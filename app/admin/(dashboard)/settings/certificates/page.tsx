import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { CertificateCard } from '@/components/admin/CertificateCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Private certificates', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function CertificatesSettings({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  if (!(await auth())?.user) redirect('/admin/login');
  const query = await searchParams;
  const number = typeof query.order === 'string' ? query.order.trim().slice(0, 100) : '';
  const order = number ? await prisma.order.findUnique({ where: { orderNumber: number }, select: { id: true, orderNumber: true, status: true } }) : null;
  const recent = !number ? await prisma.order.findMany({ where: { status: { in: ['PAID', 'FULFILLED'] } }, orderBy: { createdAt: 'desc' }, take: 20, select: { orderNumber: true } }) : [];
  return <div className="max-w-3xl">
    <h1 className="font-display text-4xl">Private certificates</h1>
    <p className="mt-3 text-stone">Choose a paid order to get its unique QR code and download link. The PDF contains the order number. Access is blocked when the order is pending, cancelled, refunded or deleted.</p>
    <form className="mt-6 flex flex-wrap gap-3" action="/admin/settings/certificates">
      <label className="flex-1 text-sm text-stone">Order number
        <input name="order" defaultValue={number} placeholder="DS-100234" required maxLength={100} className="mt-2 block w-full border border-line bg-ink p-3 text-bone" />
      </label>
      <button className="self-end bg-blood px-6 py-3 text-bone">Show QR code</button>
    </form>
    {number && !order && <p className="mt-5 text-stone">No order found with this number.</p>}
    {order && <CertificateCard order={order} />}
    {!number && <div className="mt-8">
      <h2 className="font-display text-2xl">Recent paid orders</h2>
      {recent.length ? <ul className="mt-4 space-y-3">{recent.map(o => <li key={o.orderNumber}><Link className="text-gold-bright underline" href={`/admin/settings/certificates?order=${encodeURIComponent(o.orderNumber)}`}>{o.orderNumber} — get certificate QR</Link></li>)}</ul> : <p className="mt-3 text-stone">No paid orders yet.</p>}
    </div>}
  </div>;
}
