"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/settings";

export function SiteSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, null);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-8">
      <fieldset className="space-y-4">
        <legend className="font-label text-xs tracking-[0.15em] text-gold-bright">
          GENERAL INFORMATION
        </legend>
        <Field label="Site name" name="site_name" defaultValue={settings.site_name} />
        <Field label="Tagline (shown in the hero)" name="site_tagline" defaultValue={settings.site_tagline} />
        <Field label="Contact email" name="contact_email" type="email" defaultValue={settings.contact_email} />
        <Field label="Support phone" name="support_phone" defaultValue={settings.support_phone} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-label text-xs tracking-[0.15em] text-gold-bright">
          CURRENCY & SHIPPING
        </legend>
        <div>
          <label className="block text-sm text-stone">Currency (ISO code, e.g. usd, eur, gbp)</label>
          <input
            name="currency"
            defaultValue={settings.currency}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </div>
        <Field
          label="Standard shipping cost"
          name="shipping_flat"
          type="number"
          step="0.01"
          defaultValue={(parseInt(settings.shipping_flat_cents || "0", 10) / 100).toFixed(2)}
        />
        <Field
          label="Free shipping threshold (0 = disabled)"
          name="free_shipping_threshold"
          type="number"
          step="0.01"
          defaultValue={(parseInt(settings.free_shipping_threshold_cents || "0", 10) / 100).toFixed(2)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-label text-xs tracking-[0.15em] text-gold-bright">SEO</legend>
        <Field label="Default title (&lt;title&gt; tag)" name="seo_default_title" defaultValue={settings.seo_default_title} />
        <div>
          <label className="block text-sm text-stone">Default description (meta description)</label>
          <textarea
            name="seo_default_description"
            rows={3}
            defaultValue={settings.seo_default_description}
            className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </div>
        <Field label="Open Graph image URL" name="og_image_url" defaultValue={settings.og_image_url} />
        <Field
          label="Google Search Console verification code"
          name="google_site_verification"
          defaultValue={settings.google_site_verification}
        />
      </fieldset>

      {state?.error && <p className="text-sm text-blood-bright">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-bright">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blood px-6 py-2.5 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright disabled:opacity-50"
      >
        {pending ? "SAVING..." : "SAVE SETTINGS"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-stone">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
      />
    </div>
  );
}
