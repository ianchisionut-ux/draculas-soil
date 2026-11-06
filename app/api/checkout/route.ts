import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { getSettings } from "@/lib/settings";
import { generateOrderNumber } from "@/lib/format";
import { SHIPPING_COUNTRIES, shippingCost } from "@/lib/shipping";

const bodySchema = z.object({
  shippingCountry: z.enum(SHIPPING_COUNTRIES),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
    }
    const { items, shippingCountry } = parsed.data;

    // Always re-fetch prices & stock from the DB — never trust client-sent prices.
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, isActive: true },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "One of the items is no longer available." },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.trackStock && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}.` },
          { status: 400 }
        );
      }
    }

    const settings = await getSettings([
      "currency",
      "shipping_flat_cents",
      "free_shipping_threshold_cents",
      "shipping_world_cents",
      "shipping_australia_cents",
    ]);
    const currency = settings.currency || "usd";

    const subtotalCents = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.priceCents * item.quantity;
    }, 0);

    const shippingCents = shippingCost(shippingCountry, subtotalCents, {
      shipping_flat_cents: settings.shipping_flat_cents,
      free_shipping_threshold_cents: settings.free_shipping_threshold_cents,
      shipping_world_cents: settings.shipping_world_cents,
      shipping_australia_cents: settings.shipping_australia_cents,
    });
    if (shippingCents === null) {
      return NextResponse.json(
        { error: "Shipping to this country is not available yet. Please contact us before ordering." },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        email: "",
        customerName: "",
        shippingAddress1: "",
        shippingCity: "",
        shippingPostalCode: "",
        shippingCountry,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        currency,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              nameSnapshot: product.name,
              priceCents: product.priceCents,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    const stripe = await getStripeClient();
    const siteUrl = process.env.SITE_URL || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      metadata: { orderId: order.id },
      line_items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return {
          quantity: item.quantity,
          price_data: {
            currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.shortDesc,
              images: product.images[0] ? [product.images[0].url] : undefined,
            },
          },
        };
      }),
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [shippingCountry],
      },
      shipping_options: shippingCents > 0
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: shippingCents, currency },
                display_name: "Standard shipping",
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 0, currency },
                display_name: "Free shipping",
              },
            },
          ],
      customer_email: undefined,
      success_url: `${siteUrl}/checkout/success?order=${order.orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
