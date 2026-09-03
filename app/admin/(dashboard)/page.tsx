import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { isStripeConfigured } from "@/lib/settings";

export default async function AdminHomePage() {
  const [productCount, orderCount, paidOrders, recentOrders, stripeReady] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: { not: "PENDING" } } }),
    prisma.order.findMany({ where: { status: "PAID" } }),
    prisma.order.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    isStripeConfigured(),
  ]);

  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: "Active products", value: productCount },
    { label: "Orders", value: orderCount },
    { label: "Total revenue", value: formatPrice(revenueCents) },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl">Overview</h1>

      {!stripeReady && (
        <div className="mt-6 border border-blood/50 bg-blood/10 p-4 text-sm">
          <p className="text-bone">
            Stripe isn&apos;t configured yet — the store can&apos;t accept payments.
          </p>
          <Link href="/admin/settings/stripe" className="mt-1 inline-block text-gold-bright underline underline-offset-4">
            Configure Stripe →
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-ink p-6">
            <p className="text-xs text-stone">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-gold-bright">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-label text-sm tracking-wide text-stone">RECENT ORDERS</h2>
          <Link href="/admin/orders" className="text-sm text-gold-bright hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-4 border border-line">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-stone">No paid orders yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-stone">
                  <th className="p-3 font-normal">Order</th>
                  <th className="p-3 font-normal">Customer</th>
                  <th className="p-3 font-normal">Status</th>
                  <th className="p-3 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-gold-bright hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">{o.email || "—"}</td>
                    <td className="p-3">{o.status}</td>
                    <td className="p-3">{formatPrice(o.totalCents, o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
