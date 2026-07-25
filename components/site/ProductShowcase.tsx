import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export async function ProductShowcase() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  if (products.length === 0) {
    return (
      <p className="text-center text-stone">
        Products will appear here as soon as they&apos;re added from the admin dashboard.
      </p>
    );
  }

  return (
    <div
      className={`mx-auto grid max-w-5xl gap-8 ${
        products.length === 1 ? "grid-cols-1 justify-items-center" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/product/${p.slug}`}
          className="group block w-full max-w-sm border border-line bg-ink p-6 transition-colors hover:border-gold/50"
        >
          <div className="relative mb-5 flex h-56 items-center justify-center overflow-hidden bg-void/60">
            {p.images[0] ? (
              <Image
                src={p.images[0].url}
                alt={p.images[0].alt || p.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-4"
              />
            ) : (
              <span className="font-label text-xs tracking-[0.2em] text-stone">
                {p.name.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl group-hover:text-gold-bright">{p.name}</h3>
          <p className="mt-1 text-sm text-stone">{p.shortDesc}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-label text-sm text-gold-bright">
              {formatPrice(p.priceCents, p.currency)}
            </span>
            <span className="font-label text-xs tracking-[0.1em] text-bone underline decoration-gold/40 underline-offset-4">
              VIEW PRODUCT
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
