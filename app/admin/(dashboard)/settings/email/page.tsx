import { getSettings } from "@/lib/settings";
import { EmailSettingsForm } from "@/components/admin/EmailSettingsForm";

export default async function AdminEmailSettingsPage() {
  const settings = await getSettings(["resend_api_key", "email_from", "order_emails_enabled"]);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl">Email settings</h1>
      <p className="mt-2 text-sm text-stone">
        Sends an order confirmation to the customer and a new-order alert to your contact
        email (set in Site settings) every time a payment succeeds.
      </p>

      <div className="mt-6 border border-line bg-ink p-4 text-sm">
        <p className="font-label text-xs tracking-[0.1em] text-gold-bright">HOW TO SET THIS UP</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-stone">
          <li>
            Create a free account at{" "}
            <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-gold-bright underline underline-offset-4">
              resend.com
            </a>
          </li>
          <li>Copy your API key from the Resend dashboard and paste it below.</li>
          <li>
            For testing, you can leave the sender as <code className="text-gold-bright">onboarding@resend.dev</code>.
            To send from your own domain (e.g. <code className="text-gold-bright">orders@yourdomain.com</code>),
            verify that domain in Resend first — otherwise emails will fail to send.
          </li>
        </ol>
      </div>

      <EmailSettingsForm settings={settings} />
    </div>
  );
}
