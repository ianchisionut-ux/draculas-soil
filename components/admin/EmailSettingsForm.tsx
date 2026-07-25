"use client";

import { useActionState } from "react";
import { updateEmailSettings } from "@/lib/actions/settings";

function mask(value: string): string {
  if (!value) return "";
  return `${value.slice(0, 6)}${"•".repeat(Math.max(0, value.length - 10))}${value.slice(-4)}`;
}

export function EmailSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(updateEmailSettings, null);
  const hasKey = Boolean(settings.resend_api_key);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <label className="flex items-center gap-2 text-sm text-stone">
        <input
          type="checkbox"
          name="order_emails_enabled"
          defaultChecked={settings.order_emails_enabled !== "false"}
        />
        Send order emails
      </label>

      <div>
        <label className="block text-sm text-stone">
          Resend API key
          {hasKey && (
            <span className="ml-2 text-xs text-gold-bright">configured: {mask(settings.resend_api_key)}</span>
          )}
        </label>
        <input
          name="resend_api_key"
          placeholder={hasKey ? "Leave blank to keep the current key" : "re_..."}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-sm text-stone">Sender ("Name &lt;email@domain.com&gt;")</label>
        <input
          name="email_from"
          defaultValue={settings.email_from}
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
        {pending ? "SAVING..." : "SAVE EMAIL SETTINGS"}
      </button>
    </form>
  );
}
