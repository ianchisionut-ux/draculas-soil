"use client";

import { useActionState } from "react";
import { updateStripeSettings } from "@/lib/actions/settings";

function mask(value: string): string {
  if (!value) return "";
  return `${value.slice(0, 7)}${"•".repeat(Math.max(0, value.length - 11))}${value.slice(-4)}`;
}

export function StripeSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(updateStripeSettings, null);

  const hasSecret = Boolean(settings.stripe_secret_key);
  const hasWebhook = Boolean(settings.stripe_webhook_secret);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label className="block text-sm text-stone">Publishable key (pk_...)</label>
        <input
          name="stripe_publishable_key"
          defaultValue={settings.stripe_publishable_key}
          placeholder="pk_live_..."
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">
          Secret key (sk_...)
          {hasSecret && (
            <span className="ml-2 text-xs text-gold-bright">
              configured: {mask(settings.stripe_secret_key)}
            </span>
          )}
        </label>
        <input
          name="stripe_secret_key"
          placeholder={hasSecret ? "Leave blank to keep the current key" : "sk_live_..."}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">
          Webhook signing secret (whsec_...)
          {hasWebhook && (
            <span className="ml-2 text-xs text-gold-bright">
              configured: {mask(settings.stripe_webhook_secret)}
            </span>
          )}
        </label>
        <input
          name="stripe_webhook_secret"
          placeholder={hasWebhook ? "Leave blank to keep the current value" : "whsec_..."}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      {state?.error && <p className="text-sm text-blood-bright">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-bright">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blood px-6 py-2.5 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright disabled:opacity-50"
      >
        {pending ? "SAVING..." : "SAVE KEYS"}
      </button>
    </form>
  );
}
