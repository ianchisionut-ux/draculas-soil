import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About Us & Contact",
  description:
    "Learn the story behind Dracula's Soil and get in touch with our team for any questions or after-sales support.",
};

export default async function ContactPage() {
  const settings = await getSettings(["site_name", "contact_email", "support_phone"]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-eyebrow mb-3 text-gold">ABOUT US</p>
      <h1 className="font-display text-4xl">About {settings.site_name}</h1>

      <div className="mt-8 space-y-5 text-stone">
        <p>
          We established Draculasoil.com with the goal of bringing a smile on people&apos;s
          faces by giving them a chance to own a piece of history!
        </p>
        <p>
          Each bottle of Dracula&apos;s Soil contains genuine and authentic soil collected
          from Dracula&apos;s Castle (Bran Castle), which is located in Brașov County, 30 km
          away from Brașov City, in the Bucegi Mountains.
        </p>
        <p>
          The Bran Castle constitutes a significant part of Romania&apos;s rich history, and
          Draculasoil.com takes great pride in promoting this wonderful history across the
          world with our souvenirs.
        </p>
        <p>
          We are a social enterprise, with a significant share of proceeds from each purchase
          going towards animal rescues in Romania.
        </p>
        <p>
          We hope you have a great time shopping with us — for any concerns, feel free to get
          in touch! We are all about our customer service and after-sales support.
        </p>
      </div>

      <div className="hairline my-12" />

      <p className="text-eyebrow mb-6 text-gold">GET IN TOUCH</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-line bg-ink p-6">
          <p className="font-label text-xs tracking-[0.15em] text-gold-bright">EMAIL</p>
          {settings.contact_email ? (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-2 block text-lg text-bone hover:text-gold-bright"
            >
              {settings.contact_email}
            </a>
          ) : (
            <p className="mt-2 text-sm text-stone">
              Not set yet — add it in /admin/settings.
            </p>
          )}
        </div>

        <div className="border border-line bg-ink p-6">
          <p className="font-label text-xs tracking-[0.15em] text-gold-bright">PHONE</p>
          {settings.support_phone ? (
            <a
              href={`tel:${settings.support_phone.replace(/\s+/g, "")}`}
              className="mt-2 block text-lg text-bone hover:text-gold-bright"
            >
              {settings.support_phone}
            </a>
          ) : (
            <p className="mt-2 text-sm text-stone">
              Not set yet — add it in /admin/settings.
            </p>
          )}
        </div>
      </div>

      {!settings.contact_email && !settings.support_phone && (
        <p className="mt-6 text-sm text-stone">
          Tip: set your email and phone number once, in{" "}
          <span className="text-gold-bright">/admin/settings</span> — they&apos;ll show up
          here and in the footer automatically.
        </p>
      )}
    </div>
  );
}
