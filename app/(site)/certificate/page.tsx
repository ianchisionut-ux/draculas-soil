import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCertificateOrder } from '@/lib/certificates';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your certificate', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function CertificatePage({ searchParams }: { searchParams: Promise<{ order?: string; token?: string }> }) {
  const { order: id, token } = await searchParams;
  if (typeof id !== 'string' || typeof token !== 'string') notFound();
  const order = await getCertificateOrder(id, token);
  if (!order) notFound();
  return <section className="mx-auto max-w-2xl px-6 py-20 text-center">
    <p className="text-eyebrow text-gold">DRACULA&apos;S SOIL</p>
    <h1 className="mt-4 font-display text-4xl">Your certificate of authenticity</h1>
    <p className="mt-6 text-stone">Order {order.orderNumber}</p>
    <p className="mt-3 text-stone">Your personal certificate includes your unique order number. Download it below and keep it with your souvenir.</p>
    <a href={`/api/certificate/${encodeURIComponent(order.id)}?token=${encodeURIComponent(token)}`} className="mt-8 inline-block bg-blood px-8 py-4 font-label text-sm text-bone hover:bg-blood-bright">DOWNLOAD CERTIFICATE (PDF)</a>
  </section>;
}
