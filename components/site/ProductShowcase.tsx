import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { digitalCertificateCopy } from "@/lib/certificate-copy";
import { AddToCartHero } from "./AddToCartHero";

const PRODUCT_DETAILS = [
  "Authentic soil carefully collected near Bran Castle",
  "A unique digital certificate linked to the paid order",
  "Worldwide shipping with the rate shown before payment",
];

export async function ProductShowcase() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  if (products.length === 0) {
    return (
      <p className="text-center text-stone">
        Products will appear here as soon as they&apos;re added from the admin dashboard.
      </p>
    );
  }

  const [featured, ...moreProducts] = products;
  const featuredImage = featured.images[0]?.url ?? "/images/product-bottle-rock.jpg";
  const inStock = !featured.trackStock || featured.stock > 0;

  return (
    <div>
      <article className="grid overflow-hidden border border-line bg-void shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:grid-cols-[1.12fr_0.88fr]">
        <Link
          href={`/product/${featured.slug}`}
          className="group relative min-h-[480px] overflow-hidden border-b border-line bg-black lg:min-h-[620px] lg:border-b-0 lg:border-r"
          aria-label={`View ${featured.name}`}
        >
          <Image
            src={featuredImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="scale-105 object-cover opacity-30 blur-sm transition-transform duration-1000 group-hover:scale-110"
          />
          <Image
            src={featuredImage}
            alt={featured.images[0]?.alt || featured.name}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.025] sm:p-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-transparent to-black/10" />
          <div className="absolute left-6 top-6 border border-gold/35 bg-void/75 px-4 py-2 font-label text-[10px] tracking-[0.2em] text-gold-bright backdrop-blur sm:left-8 sm:top-8">
            ORIGINAL TRANSYLVANIAN COLLECTIBLE
          </div>
          <div className="absolute bottom-6 left-6 right-32 sm:bottom-8 sm:left-8">
            <p className="max-w-sm font-display text-2xl text-bone sm:text-3xl">
              A fragment of the legend, preserved in glass.
            </p>
          </div>
          <div className="absolute bottom-4 right-4 w-24 sm:bottom-6 sm:right-6 sm:w-32">
            <Image
              src="/images/wax-seal.png"
              alt="Romanian coat of arms embossed in red wax"
              width={227}
              height={211}
              className="h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            />
          </div>
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="text-eyebrow text-gold">THE ORIGINAL</p>
          <h3 className="mt-4 font-display text-4xl leading-tight text-bone sm:text-5xl">
            {featured.name}
          </h3>
          <p className="mt-5 max-w-lg text-lg leading-7 text-stone">
            {digitalCertificateCopy(featured.shortDesc)} A compact piece of Transylvanian
            atmosphere, carefully presented for collectors, history lovers, and Dracula fans.
          </p>

          <div className="my-8 h-px bg-gradient-to-r from-gold/50 via-line to-transparent" />

          <ul className="space-y-4">
            {PRODUCT_DETAILS.map((detail) => (
              <li key={detail} className="flex items-start gap-3 text-bone">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 border border-gold bg-gold/20" />
                <span className="leading-6">{detail}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-7">
            <div>
              <p className="font-label text-[10px] tracking-[0.18em] text-stone">COLLECTOR PRICE</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-display text-4xl text-gold-bright">
                  {formatPrice(featured.priceCents, featured.currency)}
                </span>
                {featured.compareAtCents && featured.compareAtCents > featured.priceCents ? (
                  <span className="text-sm text-stone line-through">
                    {formatPrice(featured.compareAtCents, featured.currency)}
                  </span>
                ) : null}
              </div>
            </div>
            <p className="max-w-[190px] text-right text-xs leading-5 text-stone">
              Secure checkout · 30-day guarantee
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {inStock ? (
              <AddToCartHero
                product={{
                  productId: featured.id,
                  slug: featured.slug,
                  name: featured.name,
                  priceCents: featured.priceCents,
                  imageUrl: featured.images[0]?.url ?? null,
                }}
              />
            ) : (
              <span className="bg-line px-8 py-4 font-label text-xs tracking-[0.15em] text-stone">
                CURRENTLY OUT OF STOCK
              </span>
            )}
            <Link
              href={`/product/${featured.slug}`}
              className="font-label text-xs tracking-[0.15em] text-bone underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-bright"
            >
              EXPLORE EVERY DETAIL →
            </Link>
          </div>
        </div>
      </article>

      {moreProducts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moreProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group border border-line bg-void p-5 transition-colors hover:border-gold/50"
            >
              <div className="relative h-64 overflow-hidden bg-black">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <h3 className="mt-5 font-display text-2xl group-hover:text-gold-bright">
                {product.name}
              </h3>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-label text-sm text-gold-bright">
                  {formatPrice(product.priceCents, product.currency)}
                </span>
                <span className="font-label text-[10px] tracking-[0.15em] text-bone">
                  VIEW PRODUCT →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
