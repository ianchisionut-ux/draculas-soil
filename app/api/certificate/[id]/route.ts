import { NextRequest } from 'next/server';
import { getCertificateOrder } from '@/lib/certificates';
import { createCertificatePdf } from '@/lib/certificate-pdf';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' };
  const order = await getCertificateOrder(id, req.nextUrl.searchParams.get('token') || '');
  if (!order) return new Response('Certificate unavailable', { status: 404, headers });
  const bytes = await createCertificatePdf(order.orderNumber);
  const filename = order.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  return new Response(new Uint8Array(bytes), { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="certificate-${filename}.pdf"`, 'X-Content-Type-Options': 'nosniff' } });
}
