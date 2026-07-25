import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { AddToCartHero } from "@/components/site/AddToCartHero";
import {
  IconCertificate,
  IconGlobe,
  IconTruck,
  IconShieldCheck,
  IconCalendarCheck,
  IconLock,
  IconCard,
} from "@/components/icons/Icons";

const TRUST_BADGES = [
  { icon: IconCertificate, label: "Certificate of authenticity", desc: "Included with every order" },
  { icon: IconGlobe, label: "Worldwide shipping", desc: "70+ countries" },
  { icon: IconTruck, label: "Free shipping", desc: "On eligible orders" },
  { icon: IconShieldCheck, label: "30-day guarantee", desc: "Money back, no questions asked" },
];

const STATS = [
  { icon: IconGlobe, value: "70+", label: "Countries we ship to" },
  { icon: IconCalendarCheck, value: "24H", label: "Ships within 24 hours" },
  { icon: IconLock, value: "100%", label: "Secure checkout" },
  { icon: IconCertificate, value: "1:1", label: "Certificate per bottle" },
];

const EXPLORE_CARDS = [
  {
    title: "The Story",
    desc: "Discover the legend behind the world's most famous vampire.",
    cta: "EXPLORE STORY",
    href: "#story-detail",
    image: "/images/card-story.png",
  },
  {
    title: "The Product",
    desc: "Authentic soil, carefully collected and preserved with a certificate of authenticity.",
    cta: "VIEW PRODUCT",
    href: "#product",
    image: "/images/card-product.png",
  },
  {
    title: "Collector Edition",
    desc: "Premium box, wax seal, certificate and more. Perfect for collectors.",
    cta: "VIEW COLLECTION",
    href: "#product",
    image: "/images/card-collector.png",
  },
  {
    title: "Reviews",
    desc: "Customer reviews will appear here as they come in.",
    cta: "READ REVIEWS",
    href: "#reviews",
    image: "/images/card-reviews.png",
  },
];

export default async function HomePage() {
  const [settings, featuredProduct] = await Promise.all([
    getSettings(["site_tagline", "story_title", "story_text"]),
    prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <Image
          src="/images/hero.png"
          alt="Dracula's Soil bottle and box in front of Bran Castle at night"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent" />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-eyebrow mb-6 flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold/60" />
              {settings.site_tagline.toUpperCase()}
              <span className="h-px w-8 bg-gold/60" />
            </p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-wide sm:text-6xl">
              THE SOIL THAT GAVE BIRTH
              <br />
              TO THE <span className="text-blood-bright">DRACULA</span> LEGEND
            </h1>
            <p className="mt-6 max-w-md text-lg text-stone">
              Authentic soil, carefully collected near Bran Castle, Transylvania, Romania —
              comes with a certificate of authenticity.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {TRUST_BADGES.map((b) => (
                <li key={b.label} className="flex items-start gap-2 text-sm">
                  <b.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                  <div>
                    <p className="font-label text-xs tracking-wide text-gold-bright">{b.label}</p>
                    <p className="text-stone">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              {featuredProduct ? (
                <AddToCartHero
                  product={{
                    productId: featuredProduct.id,
                    slug: featuredProduct.slug,
                    name: featuredProduct.name,
                    priceCents: featuredProduct.priceCents,
                    imageUrl: featuredProduct.images[0]?.url ?? null,
                  }}
                />
              ) : (
                <span className="rounded-sm bg-line px-8 py-4 font-label text-xs tracking-[0.15em] text-stone">
                  COMING SOON
                </span>
              )}
              <Link
                href="#story-detail"
                className="font-label text-xs tracking-[0.15em] text-bone underline decoration-gold/50 underline-offset-4 hover:text-gold-bright"
              >
                READ THE STORY →
              </Link>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="relative border-t border-line/60 bg-void/80 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className="h-7 w-7 flex-shrink-0 text-gold" />
                <div>
                  <p className="font-label text-lg text-bone">{s.value}</p>
                  <p className="text-xs text-stone">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE CARDS */}
      <section className="border-b border-line">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden border-b border-line p-6 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
              <div className="relative">
                <h3 className="font-display text-2xl">{card.title}</h3>
                <div className="mt-2 h-px w-8 bg-blood" />
                <p className="mt-3 max-w-[220px] text-sm text-stone">{card.desc}</p>
              </div>
              <span className="relative w-fit border border-line bg-void/60 px-4 py-2 font-label text-[10px] tracking-[0.15em] text-bone group-hover:border-gold/50 group-hover:text-gold-bright">
                {card.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY DETAIL */}
      <section id="story-detail" className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-eyebrow mb-3 text-gold">THE STORY</p>
            <h2 className="font-display text-4xl">{settings.story_title}</h2>
            <p className="mt-4 max-w-md text-stone">{settings.story_text}</p>
          </div>
          <div className="relative h-80 overflow-hidden rounded-sm border border-line bg-ink sm:h-96">
            <Image
              src="/images/story-bottle-castle.jpg"
              alt="Holding a Dracula's Soil bottle in front of Bran Castle"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="product" className="border-b border-line bg-ink/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-eyebrow mb-3 text-center text-gold">THE PRODUCT</p>
          <h2 className="text-center font-display text-4xl">Own a piece of history</h2>
          <div className="mt-12">
            <ProductShowcase />
          </div>
        </div>
      </section>

      {/* REVIEWS (honest placeholder until real reviews exist) */}
      <section id="reviews" className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-eyebrow mb-3 text-gold">REVIEWS</p>
          <h2 className="font-display text-4xl">Customer reviews</h2>
          <p className="mt-4 text-stone">
            We&apos;re just getting started — customer reviews will show up here once orders
            start coming in.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-eyebrow mb-3 text-center text-gold">FREQUENTLY ASKED QUESTIONS</p>
        <h2 className="text-center font-display text-4xl">Have a question?</h2>
        <div className="mt-10 space-y-6">
          <div>
            <p className="font-label text-sm tracking-wide text-gold-bright">
              Is the soil really collected near Bran Castle?
            </p>
            <p className="mt-1 text-stone">
              Yes. Every order includes a certificate of authenticity confirming the location
              and date of collection.
            </p>
          </div>
          <div>
            <p className="font-label text-sm tracking-wide text-gold-bright">
              Do you ship internationally?
            </p>
            <p className="mt-1 text-stone">
              Yes, we ship to over 70 countries. Delivery times vary depending on the
              destination.
            </p>
          </div>
          <div>
            <p className="font-label text-sm tracking-wide text-gold-bright">
              What payment methods do you accept?
            </p>
            <p className="mt-1 text-stone">
              Payments are processed securely through Stripe — we accept Visa, Mastercard, and
              other methods available in your Stripe account.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
