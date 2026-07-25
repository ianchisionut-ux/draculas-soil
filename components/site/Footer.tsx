import Link from "next/link";
import {
  IconShieldCheck,
  IconCertificate,
  IconGlobe,
  IconCard,
  IconStar,
} from "@/components/icons/Icons";

const BADGES = [
  { icon: IconShieldCheck, title: "Authentic Romanian product", desc: "Hand-collected near Bran Castle" },
  { icon: IconCertificate, title: "Certificate of authenticity", desc: "Included with every order" },
  { icon: IconGlobe, title: "Worldwide shipping", desc: "We ship to 70+ countries" },
  { icon: IconCard, title: "Secure payment", desc: "Visa, Mastercard & more via Stripe" },
  { icon: IconStar, title: "30-day guarantee", desc: "Money back, no questions asked" },
];

export function Footer({ siteName, contactEmail }: { siteName: string; contactEmail: string }) {
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
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-stone sm:flex-row">
        <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        <div className="flex gap-6">
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="hover:text-gold-bright">
              {contactEmail}
            </a>
          )}
          <Link href="/terms" className="hover:text-gold-bright">Terms</Link>
          <Link href="/privacy" className="hover:text-gold-bright">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
