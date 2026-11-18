import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { AddToCartHero } from "@/components/site/AddToCartHero";
import { HeroMedia } from "@/components/site/HeroMedia";
import {
  IconCertificate,
  IconGlobe,
  IconTruck,
  IconShieldCheck,
  IconCalendarCheck,
  IconLock,
} from "@/components/icons/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TRUST_BADGES = [
  { icon: IconCertificate, label: "Digital certificate of authenticity", desc: "Included with every order" },
  { icon: IconGlobe, label: "Worldwide shipping", desc: "70+ countries" },
  { icon: IconTruck, label: "Free shipping", desc: "In the US" },
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
    desc: "Authentic soil, carefully collected and preserved with a digital certificate of authenticity.",
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
    desc: "Verified buyer feedback, published as the first orders arrive.",
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
        <div className="relative overflow-hidden bg-black">
          <HeroMedia />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #050403 0%, #050403 22%, rgba(5, 4, 3, 0.9) 32%, rgba(5, 4, 3, 0.42) 42%, transparent 50%)",
            }}
          />

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
                comes with a digital certificate of authenticity.
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
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-3 text-gold">THE STORY</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">{settings.story_title}</h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-7 text-stone">
              <p>{settings.story_text}</p>
              <p>
                Set against the Carpathian landscape, Bran Castle holds a special place in
                Romania&apos;s history and in the folklore that carried the Dracula legend far
                beyond Transylvania. Its stone walls, mountain setting, and centuries of stories
                make it a place where documented history and mystery meet.
              </p>
              <p>
                Dracula&apos;s Soil preserves that connection in a small collectible made to be
                held, displayed, and shared. Every bottle is carefully packaged and accompanied
                by its own digital certificate of authenticity, linking the keepsake to its order
                and origin.
              </p>
              <p>
                Through every souvenir, we hope to bring Romania&apos;s landscape, heritage, and
                legends closer to collectors, history enthusiasts, and Dracula fans around the
                world — one authentic keepsake at a time.
              </p>
            </div>
            <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
              {[
                "Collected near Bran Castle",
                "Unique digital certificate",
                "Made for collectors worldwide",
              ].map((detail) => (
                <div key={detail} className="flex items-start gap-2 text-sm text-bone">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 overflow-hidden rounded-sm border border-line bg-ink sm:h-[520px]">
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
      <section id="product" className="relative overflow-hidden border-b border-line bg-ink/40">
        <div className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-blood/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-48 bottom-10 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-eyebrow mb-3 text-gold">THE PRODUCT</p>
              <h2 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                A fragment of Transylvania, sealed for your collection
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-7 text-stone lg:justify-self-end">
              More than a souvenir: a carefully presented connection to Bran, its landscape,
              and the legend that made Transylvania famous around the world.
            </p>
          </div>
          <div className="mt-12">
            <ProductShowcase />
          </div>
        </div>
      </section>

      {/* REVIEWS — genuine buyer feedback only */}
      <section id="reviews" className="border-b border-line bg-ink/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow mb-3 text-gold">REVIEWS</p>
            <h2 className="font-display text-4xl sm:text-5xl">Customer reviews</h2>
            <p className="mt-4 leading-7 text-stone">
              This space is reserved for genuine customer voices. We publish feedback only from
              completed orders, and the first verified reviews will appear here as collectors
              receive their bottles.
            </p>
          </div>

          <p className="text-eyebrow mt-12 text-center text-gold">WHAT MAKES EACH ORDER SPECIAL</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: IconGlobe,
                title: "A connection to Transylvania",
                text: "A tangible keepsake inspired by the landscape and folklore surrounding Bran Castle.",
              },
              {
                icon: IconShieldCheck,
                title: "Verified purchasers only",
                text: "Customer feedback displayed here will be tied to real, completed orders — never invented testimonials.",
              },
              {
                icon: IconCertificate,
                title: "Documented authenticity",
                text: "Each eligible paid order unlocks a unique digital certificate carrying its order number.",
              },
            ].map((item) => (
              <article key={item.title} className="border border-line bg-void/60 p-7">
                <item.icon className="h-8 w-8 text-gold" />
                <h3 className="mt-5 font-display text-2xl text-bone">{item.title}</h3>
                <p className="mt-3 leading-6 text-stone">{item.text}</p>
              </article>
            ))}
          </div>
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
              Yes. Every order includes a digital certificate of authenticity confirming the location
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
