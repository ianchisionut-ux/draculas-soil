import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/site/AddToCartButton";

type Params = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const inStock = !product.trackStock || product.stock > 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: product.images.map((i) => i.url),
    sku: product.sku || undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: product.currency.toUpperCase(),
      price: (product.priceCents / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative flex h-96 items-center justify-center border border-line bg-ink">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />
          ) : (
            <span className="font-label text-sm tracking-[0.2em] text-stone">
              {product.name.toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-stone">{product.shortDesc}</p>
          <p className="mt-6 font-label text-2xl text-gold-bright">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          {!inStock && (
            <p className="mt-2 text-sm text-blood-bright">Currently out of stock</p>
          )}

          <div className="mt-8">
            <AddToCartButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.images[0]?.url ?? null,
              }}
              disabled={!inStock}
            />
          </div>

          <div className="hairline my-8" />
          <div
            className="prose prose-invert max-w-none text-stone"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
}
