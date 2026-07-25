import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/orders";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const boundUpdate = updateOrderStatus.bind(null, order.id);
  const boundDelete = deleteOrder.bind(null, order.id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Order {order.orderNumber}</h1>
        <DeleteOrderButton action={boundDelete} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-stone">Customer</p>
          <p className="mt-1">{order.customerName || "—"}</p>
          <p>{order.email || "—"}</p>
        </div>
        <div>
          <p className="text-stone">Shipping address</p>
          <p className="mt-1">
            {order.shippingAddress1}
            {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}
          </p>
          <p>
            {order.shippingCity}
            {order.shippingState ? `, ${order.shippingState}` : ""} {order.shippingPostalCode}
          </p>
          <p>{order.shippingCountry}</p>
        </div>
      </div>

      <div className="mt-8 border border-line">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-stone">
              <th className="p-3 font-normal">Product</th>
              <th className="p-3 font-normal">Quantity</th>
              <th className="p-3 font-normal">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="p-3">{item.nameSnapshot}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{formatPrice(item.priceCents, order.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-1 text-right text-sm">
        <p className="text-stone">Subtotal: {formatPrice(order.subtotalCents, order.currency)}</p>
        <p className="text-stone">Shipping: {formatPrice(order.shippingCents, order.currency)}</p>
        <p className="font-label text-lg text-gold-bright">
          Total: {formatPrice(order.totalCents, order.currency)}
        </p>
      </div>

      <form action={boundUpdate} className="mt-8 flex items-center gap-3">
        <label className="text-sm text-stone">Order status</label>
        <select
          name="status"
          defaultValue={order.status}
          className="border border-line bg-ink px-3 py-2 text-sm text-bone"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blood px-5 py-2 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
}
