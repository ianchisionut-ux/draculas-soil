import { test } from 'node:test';
import assert from 'node:assert/strict';
import { certificateEligible, certificateToken, validCertificateToken } from './certificate-access';

test('certificate links are signed for exactly one order', () => {
  process.env.AUTH_SECRET = 'local-test-signing-key-not-for-production';
  const token = certificateToken('order-one');
  assert.equal(validCertificateToken('order-one', token), true);
  assert.equal(validCertificateToken('order-two', token), false);
  assert.equal(validCertificateToken('order-one', token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')), false);
  assert.equal(validCertificateToken('order-one', ''), false);
  assert.equal(validCertificateToken('order-one', 'x'.repeat(10000)), false);
  assert.notEqual(token, certificateToken('order-two'));
  delete process.env.AUTH_SECRET;
  assert.throws(() => certificateToken('order-one'), /not configured/);
});

test('only paid or fulfilled orders qualify', () => {
  for (const status of ['PAID', 'FULFILLED']) assert.equal(certificateEligible(status), true);
  for (const status of ['PENDING', 'CANCELLED', 'REFUNDED', '', 'paid']) assert.equal(certificateEligible(status), false);
});
