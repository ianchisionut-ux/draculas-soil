import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this website collects, uses, and protects your personal information.",
};

export default async function PrivacyPage() {
  const settings = await getSettings(["site_name", "contact_email"]);
  const updated = "July 2026";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-eyebrow mb-3 text-gold">LEGAL</p>
      <h1 className="font-display text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone">Last updated: {updated}</p>

      <div className="mt-10 space-y-8 text-stone">
        <section>
          <p>
            This Privacy Policy explains how {settings.site_name} (&quot;we&quot;,
            &quot;us&quot;) collects, uses, and protects your personal information when you
            visit or make a purchase on this website.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Information we collect</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Contact details you provide at checkout: name, email, shipping address.</li>
            <li>Order information: items purchased, order value, order history.</li>
            <li>
              Payment information is collected and processed directly by Stripe, our payment
              provider — we never see or store your full card number.
            </li>
            <li>Basic technical data (browser type, general location) via standard server logs.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">How we use your information</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>To process and fulfill your orders, including shipping and customer support.</li>
            <li>To send order confirmations and updates related to your purchase.</li>
            <li>To improve the Site and prevent fraud or abuse.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Third-party services</h2>
          <p className="mt-2">
            We use trusted third parties to operate this Site, each of which processes data
            under its own privacy policy:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong className="text-bone">Stripe</strong> — payment processing.</li>
            <li><strong className="text-bone">Vercel</strong> — hosting and image storage.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Data retention</h2>
          <p className="mt-2">
            We retain order and account information for as long as necessary to fulfill
            orders, comply with legal obligations, resolve disputes, and enforce our
            agreements.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Your rights</h2>
          <p className="mt-2">
            Depending on where you live, you may have the right to access, correct, or
            request deletion of your personal information. To exercise these rights, contact
            us using the details below.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Cookies</h2>
          <p className="mt-2">
            We use only essential cookies required for core functionality, such as keeping
            items in your cart. We do not use third-party advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Changes to this policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Any changes will be posted
            on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">Contact</h2>
          <p className="mt-2">
            For any questions about this policy or your personal data, contact us at{" "}
            {settings.contact_email ? (
              <a href={`mailto:${settings.contact_email}`} className="text-gold-bright underline underline-offset-4">
                {settings.contact_email}
              </a>
            ) : (
              "our contact email listed on the site"
            )}
            .
          </p>
        </section>
      </div>
    </div>
  );
}
