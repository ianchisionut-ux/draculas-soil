import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { authorizeCertificateOrder, certificateToken } from './certificate-access';

test('download authorization checks signature, order existence and current payment state', async () => {
  process.env.AUTH_SECRET = 'test-only-certificate-access';
  let status = 'PAID';
  let exists = true;
  const lookup = mock.fn(async () => exists ? ({ id: 'order-one', orderNumber: 'DS-100234', status, stripePaymentIntent: null }) : null);
  const getCertificateOrder = (id: string, token: string) => authorizeCertificateOrder(id, token, lookup);
  try {
    assert.equal(await getCertificateOrder('order-one', 'invalid'), null);
    assert.equal(lookup.mock.callCount(), 0);
    const token = certificateToken('order-one');
    assert.equal((await getCertificateOrder('order-one', token))?.orderNumber, 'DS-100234');
    assert.equal(await getCertificateOrder('order-two', token), null);
    for (const blocked of ['PENDING', 'CANCELLED', 'REFUNDED']) {
      status = blocked;
      assert.equal(await getCertificateOrder('order-one', token), null);
    }
    status = 'FULFILLED';
    assert.ok(await getCertificateOrder('order-one', token));
    exists = false;
    assert.equal(await getCertificateOrder('order-one', token), null);
  } finally {
    delete process.env.AUTH_SECRET;
  }
});
