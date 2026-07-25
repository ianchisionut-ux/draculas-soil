import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getSetting } from "@/lib/settings";
import { getStripeClient } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order && order.status === "PENDING") {
        const details = session.customer_details;
        const address = details?.address;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            email: details?.email || order.email,
            customerName: details?.name || order.customerName,
            shippingAddress1: address?.line1 || "",
            shippingAddress2: address?.line2 || undefined,
            shippingCity: address?.city || "",
            shippingState: address?.state || undefined,
            shippingPostalCode: address?.postal_code || "",
            shippingCountry: address?.country || "",
            stripePaymentIntent:
              typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          },
        });

        // Decrement stock for tracked products
        for (const item of order.items) {
          await prisma.product.updateMany({
            where: { id: item.productId, trackStock: true },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Re-fetch with the just-written customer/shipping details for the emails below.
        const paidOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (paidOrder) {
          await Promise.all([
            sendOrderConfirmationEmail(paidOrder),
            sendAdminOrderNotification(paidOrder),
          ]);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
