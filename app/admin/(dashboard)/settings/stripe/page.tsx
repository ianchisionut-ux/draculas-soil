import { getSettings } from "@/lib/settings";
import { StripeSettingsForm } from "@/components/admin/StripeSettingsForm";

export default async function AdminStripeSettingsPage() {
  const settings = await getSettings([
    "stripe_publishable_key",
    "stripe_secret_key",
    "stripe_webhook_secret",
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl">Stripe settings</h1>
      <p className="mt-2 text-sm text-stone">
        Keys are encrypted before being saved to the database. Find them in{" "}
        <a
          href="https://dashboard.stripe.com/apikeys"
          target="_blank"
          rel="noreferrer"
          className="text-gold-bright underline underline-offset-4"
        >
          Stripe Dashboard → Developers → API keys
        </a>
        .
      </p>

      <div className="mt-6 border border-line bg-ink p-4 text-sm">
        <p className="font-label text-xs tracking-[0.1em] text-gold-bright">WEBHOOK</p>
        <p className="mt-2 text-stone">
          Add a webhook endpoint in Stripe Dashboard → Developers → Webhooks, with the URL:
        </p>
        <code className="mt-2 block break-all border border-line bg-void px-3 py-2 text-bone">
          {siteUrl}/api/webhooks/stripe
        </code>
        <p className="mt-2 text-stone">
          Select the <code className="text-gold-bright">checkout.session.completed</code> event and
          copy the resulting signing secret below.
        </p>
      </div>

      <StripeSettingsForm settings={settings} />
    </div>
  );
}
