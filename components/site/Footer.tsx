import Link from "next/link";
import {
  IconShieldCheck,
  IconCertificate,
  IconGlobe,
  IconCard,
  IconStar,
  IconFacebook,
  IconInstagram,
  IconX,
} from "@/components/icons/Icons";

const SOCIAL_LINKS = [
  { icon: IconFacebook, href: "https://www.facebook.com/draculasoil", label: "Facebook" },
  { icon: IconInstagram, href: "https://www.instagram.com/draculasoil/", label: "Instagram" },
  { icon: IconX, href: "https://twitter.com/draculasoil/", label: "X (Twitter)" },
];

const BADGES = [
  { icon: IconShieldCheck, title: "Authentic Romanian product", desc: "Hand-collected near Bran Castle" },
  { icon: IconCertificate, title: "Certificate of authenticity", desc: "Included with every order" },
  { icon: IconGlobe, title: "Worldwide shipping", desc: "We ship to 70+ countries" },
  { icon: IconCard, title: "Secure payment", desc: "Visa, Mastercard & more via Stripe" },
  { icon: IconStar, title: "30-day guarantee", desc: "Money back, no questions asked" },
];

export function Footer({
  siteName,
  contactEmail,
  supportPhone,
}: {
  siteName: string;
  contactEmail: string;
  supportPhone: string;
}) {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-3 md:grid-cols-5">
        {BADGES.map((b) => (
          <div key={b.title} className="space-y-2">
            <b.icon className="h-6 w-6 text-gold" />
            <p className="font-label text-[11px] tracking-[0.1em] text-gold-bright">{b.title}</p>
            <p className="text-sm text-stone">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="hairline mx-6" />
      <div className="mx-auto flex max-w-7xl justify-center gap-5 px-6 py-6">
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={s.label}
            className="text-stone transition-colors hover:text-gold-bright"
          >
            <s.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
      <div className="hairline mx-6" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-stone sm:flex-row">
        <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="hover:text-gold-bright">
              {contactEmail}
            </a>
          )}
          {supportPhone && (
            <a href={`tel:${supportPhone.replace(/\s+/g, "")}`} className="hover:text-gold-bright">
              {supportPhone}
            </a>
          )}
          <Link href="/contact" className="hover:text-gold-bright">Contact</Link>
          <Link href="/terms" className="hover:text-gold-bright">Terms</Link>
          <Link href="/privacy" className="hover:text-gold-bright">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
