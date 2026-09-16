import { createHmac, timingSafeEqual } from 'node:crypto';
export function certificateEligible(status: string) {
  return status === 'PAID' || status === 'FULFILLED';
}
export function certificateToken(orderId: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('Certificate signing is not configured');
  return createHmac('sha256', secret).update(`draculas-soil:certificate:v1:${orderId}`).digest('base64url');
}
export function validCertificateToken(orderId: string, token: string) {
  if (!/^[a-zA-Z0-9_-]{43}$/.test(token) || !/^[a-zA-Z0-9_-]{1,100}$/.test(orderId)) return false;
  const expected = Buffer.from(certificateToken(orderId));
  const supplied = Buffer.from(token);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function authorizeCertificateOrder<T extends { status: string }>(id: string, token: string, lookup: (id: string) => Promise<T | null>) {
  if (!validCertificateToken(id, token)) return null;
  const order = await lookup(id);
  return order && certificateEligible(order.status) ? order : null;
}
