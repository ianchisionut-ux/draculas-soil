import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { getStripeClient } from '@/lib/stripe';

type ExistingDetails = {
  email: string;
  customerName: string;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingState: string | null;
  shippingPostalCode: string;
  shippingCountry: string;
};

export function checkoutCustomerDetails(session: Stripe.Checkout.Session, existing: ExistingDetails) {
  const customer = session.customer_details;
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address ?? customer?.address;

  return {
    email: customer?.email || existing.email,
    customerName: shipping?.name || customer?.name || existing.customerName,
    shippingAddress1: address?.line1 || existing.shippingAddress1,
    shippingAddress2: address?.line2 || existing.shippingAddress2,
    shippingCity: address?.city || existing.shippingCity,
    shippingState: address?.state || existing.shippingState,
    shippingPostalCode: address?.postal_code || existing.shippingPostalCode,
    shippingCountry: address?.country || existing.shippingCountry,
    stripePaymentIntent:
      typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
  };
}

export async function syncOrderCustomerDetails(order: ExistingDetails & { id: string; stripeSessionId: string | null }) {
  if (!order.stripeSessionId) return false;
  const stripe = await getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
  if (session.payment_status !== 'paid') return false;
  await prisma.order.update({
    where: { id: order.id },
    data: checkoutCustomerDetails(session, order),
  });
  return true;
}
