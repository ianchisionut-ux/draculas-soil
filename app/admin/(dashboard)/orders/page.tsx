import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteOrder } from "@/lib/actions/orders";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>

      <div className="mt-8 border border-line">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-stone">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-stone">
                <th className="p-3 font-normal">Order</th>
                <th className="p-3 font-normal">Date</th>
                <th className="p-3 font-normal">Customer</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal">Total</th>
                <th className="p-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-gold-bright hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3">{o.createdAt.toLocaleDateString("en-US")}</td>
                  <td className="p-3">{o.email || "—"}</td>
                  <td className="p-3">{STATUS_LABELS[o.status] || o.status}</td>
                  <td className="p-3">{formatPrice(o.totalCents, o.currency)}</td>
                  <td className="p-3 text-right">
                    <DeleteOrderButton action={deleteOrder.bind(null, o.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
