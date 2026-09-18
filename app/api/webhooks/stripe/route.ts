import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { getStripeClient } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";
import { checkoutCustomerDetails } from "@/lib/stripe-order-details";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = await getSetting("stripe_webhook_secret");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = await getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature invalid:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    // Retrieve the complete session instead of relying on the webhook payload,
    // which may be a thin event without collected shipping information.
    const eventSession = event.data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(eventSession.id);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order && (order.status === "PENDING" || order.status === "PAID")) {
        const paymentUpdate = await prisma.order.updateMany({
          where: { id: orderId, status: "PENDING" },
          data: {
            status: "PAID",
            stripePaymentIntent:
              typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          },
        });

        // Always refresh customer data, including on webhook retries. This
        // repairs paid orders created by an older handler that stored blanks.
        await prisma.order.update({
          where: { id: orderId },
          data: checkoutCustomerDetails(session, order),
        });

        // Only the first delivery of the Stripe event changes inventory.
        if (paymentUpdate.count === 1) {
          for (const item of order.items) {
            await prisma.product.updateMany({
              where: { id: item.productId, trackStock: true },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // Re-fetch with the just-written customer/shipping details for the emails below.
        const paidOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (paidOrder) {
          // The admin notification is awaited and uses a stable Resend
          // idempotency key. If Resend is temporarily unavailable, returning
          // a 500 makes Stripe retry without duplicating the email.
          await sendAdminOrderNotification(paidOrder);

          // Customer email remains non-blocking for checkout processing.
          if (paymentUpdate.count === 1) {
            await sendOrderConfirmationEmail(paidOrder);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
