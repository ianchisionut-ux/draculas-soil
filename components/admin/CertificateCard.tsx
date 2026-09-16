import QRCode from 'qrcode';
import { auth } from '@/auth';
import { certificateEligible, certificateToken } from '@/lib/certificate-access';

export async function CertificateCard({ order }: { order: { id: string; orderNumber: string; status: string } }) {
  const session = await auth();
  if (!session?.user) return null;
  if (!certificateEligible(order.status)) return <p className="mt-6 border border-line p-5 text-stone">The certificate is available only after payment is confirmed (Paid or Fulfilled). Cancelled and refunded orders cannot download it.</p>;
  const url = new URL('/certificate', process.env.SITE_URL || 'https://draculasoil.com');
  url.searchParams.set('order', order.id);
  url.searchParams.set('token', certificateToken(order.id));
  const link = url.toString();
  const svg = await QRCode.toString(link, { type: 'svg', errorCorrectionLevel: 'M', margin: 4, width: 320 });
  const qrData = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return <section className="mt-8 rounded border border-line bg-ink p-6">
    <h2 className="font-display text-2xl">Certificate — {order.orderNumber}</h2>
    <p className="mt-2 text-sm text-stone">Send this private QR code or link only to this customer after payment. Anyone with this link can download the certificate for this order.</p>
    <div className="mt-5 w-full max-w-80 bg-white [&>svg]:h-auto [&>svg]:w-full" role="img" aria-label={`Private certificate QR code for order ${order.orderNumber}`} dangerouslySetInnerHTML={{ __html: svg }} />
    <div className="mt-5 flex flex-wrap gap-4 text-gold-bright">
      <a href={qrData} download={`certificate-qr-${order.orderNumber}.svg`} className="underline underline-offset-4">Download QR code</a>
      <a href={link} target="_blank" rel="noreferrer" className="underline underline-offset-4">Open customer certificate</a>
    </div>
    <label className="mt-5 block text-sm text-stone">Private customer link
      <input readOnly value={link} className="mt-2 w-full rounded border border-line bg-void p-3 text-sm text-bone" />
    </label>
  </section>;
}
