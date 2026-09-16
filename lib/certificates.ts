import { prisma } from '@/lib/db';
import { authorizeCertificateOrder } from './certificate-access';
import { getStripeClient } from './stripe';
export async function getCertificateOrder(id: string, token: string) {
  const order = await authorizeCertificateOrder(id, token, (orderId) => prisma.order.findUnique({ where: { id: orderId }, select: { id: true, orderNumber: true, status: true, stripePaymentIntent: true } }));
  if (!order) return null;
  // Recheck Stripe payments so refunds block downloads even before local
  // order status has been updated. Offline payments use the admin's status.
  if (order.stripePaymentIntent) {
    const stripe = await getStripeClient();
    const payment = await stripe.paymentIntents.retrieve(order.stripePaymentIntent, { expand: ['latest_charge'] });
    const charge = payment.latest_charge;
    if (payment.status !== 'succeeded' || !charge || typeof charge === 'string' || charge.amount_refunded > 0) return null;
  }
  return order;
}
