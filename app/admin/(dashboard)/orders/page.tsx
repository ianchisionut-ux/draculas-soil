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

const FILTERS = [
  { key: "paid", label: "Paid & fulfilled" },
  { key: "pending", label: "Pending (unpaid)" },
  { key: "all", label: "All" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function whereForFilter(filter: FilterKey) {
  if (filter === "pending") return { status: "PENDING" as const };
  if (filter === "all") return {};
  // "paid" (default): everything except abandoned/never-paid checkouts
  return { status: { not: "PENDING" as const } };
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter: FilterKey = FILTERS.some((f) => f.key === rawFilter) ? (rawFilter as FilterKey) : "paid";

  const orders = await prisma.order.findMany({
    where: whereForFilter(filter),
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-stone">
        Showing only orders that were actually paid, by default — abandoned checkouts (started
        but never paid) are hidden so you always know exactly what to ship.
      </p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/orders?filter=${f.key}`}
            className={`border px-4 py-1.5 font-label text-xs tracking-[0.1em] ${
              filter === f.key
                ? "border-gold bg-ink text-gold-bright"
                : "border-line text-stone hover:text-bone"
            }`}
          >
            {f.label.toUpperCase()}
          </Link>
        ))}
      </div>

      <div className="mt-6 border border-line">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-stone">
            {filter === "pending" ? "No abandoned checkouts. " : "No orders yet. "}
            Nothing to show here.
          </p>
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
