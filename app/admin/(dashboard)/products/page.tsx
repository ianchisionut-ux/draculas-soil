import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-blood px-5 py-2.5 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright"
        >
          + NEW PRODUCT
        </Link>
      </div>

      <div className="mt-8 border border-line">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-stone">No products yet. Add your first product to start selling.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-stone">
                <th className="p-3 font-normal">Product</th>
                <th className="p-3 font-normal">Price</th>
                <th className="p-3 font-normal">Stock</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{formatPrice(p.priceCents, p.currency)}</td>
                  <td className="p-3">{p.trackStock ? p.stock : "—"}</td>
                  <td className="p-3">
                    <span className={p.isActive ? "text-gold-bright" : "text-stone"}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-gold-bright hover:underline">
                      Edit
                    </Link>
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
