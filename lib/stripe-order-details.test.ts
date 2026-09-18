import { test } from 'node:test';
import assert from 'node:assert/strict';
import type Stripe from 'stripe';
import { checkoutCustomerDetails } from './stripe-order-details';

test('uses Stripe shipping details and preserves existing values when fields are absent', () => {
  const existing = {
    email: 'old@example.com',
    customerName: 'Old Name',
    shippingAddress1: 'Old Street',
    shippingAddress2: null,
    shippingCity: 'Old City',
    shippingState: null,
    shippingPostalCode: '00000',
    shippingCountry: 'RO',
  };
  const session = {
    customer_details: { email: 'buyer@example.com', name: 'Billing Name', address: null },
    collected_information: {
      shipping_details: {
        name: 'Shipping Name',
        address: { line1: 'New Street', line2: null, city: 'Brasov', state: 'BV', postal_code: '500001', country: 'RO' },
      },
    },
    payment_intent: 'pi_123',
  } as unknown as Stripe.Checkout.Session;

  assert.deepEqual(checkoutCustomerDetails(session, existing), {
    email: 'buyer@example.com',
    customerName: 'Shipping Name',
    shippingAddress1: 'New Street',
    shippingAddress2: null,
    shippingCity: 'Brasov',
    shippingState: 'BV',
    shippingPostalCode: '500001',
    shippingCountry: 'RO',
    stripePaymentIntent: 'pi_123',
  });
});
