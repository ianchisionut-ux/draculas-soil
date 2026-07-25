import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using this website and purchasing products.",
};

export default async function TermsPage() {
  const settings = await getSettings(["site_name", "contact_email"]);
  const updated = "July 2026";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-eyebrow mb-3 text-gold">LEGAL</p>
      <h1 className="font-display text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-stone">Last updated: {updated}</p>

      <div className="mt-10 space-y-8 text-stone">
        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">1. Acceptance of terms</h2>
          <p className="mt-2">
            By accessing or using {settings.site_name} (&quot;the Site&quot;), you agree to be
            bound by these Terms of Service. If you do not agree with any part of these terms,
            please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">2. Products and orders</h2>
          <p className="mt-2">
            All products are described as accurately as possible. We reserve the right to
            limit quantities, refuse orders, or discontinue any product at any time. Prices
            are listed in the currency shown at checkout and may change without notice, though
            changes will never affect orders already confirmed.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">3. Payment</h2>
          <p className="mt-2">
            Payments are processed securely through Stripe. We do not store your card details
            on our servers. By placing an order, you confirm that you are authorized to use
            the selected payment method.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">4. Shipping</h2>
          <p className="mt-2">
            We ship to the countries listed at checkout. Estimated delivery times are
            provided for convenience only and are not guaranteed. Risk of loss and title for
            items pass to you upon delivery to the shipping carrier.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">5. Returns and refunds</h2>
          <p className="mt-2">
            We offer a 30-day money-back guarantee from the date of delivery. To request a
            return or refund, contact us using the details below. Refunds are issued to the
            original payment method once the return is processed.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">6. Intellectual property</h2>
          <p className="mt-2">
            All content on this Site — including text, graphics, logos, and images — is the
            property of {settings.site_name} or its licensors and is protected by applicable
            intellectual property laws. You may not reproduce, distribute, or create
            derivative works from this content without prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">7. Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, {settings.site_name} shall not be liable
            for any indirect, incidental, or consequential damages arising from your use of
            the Site or products purchased through it.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">8. Changes to these terms</h2>
          <p className="mt-2">
            We may update these Terms of Service from time to time. Continued use of the Site
            after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-label text-sm tracking-wide text-gold-bright">9. Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to{" "}
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
