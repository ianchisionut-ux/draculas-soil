import { getAllSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import Link from "next/link";

export default async function AdminSiteSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <h1 className="font-display text-4xl">Site settings</h1>
      <p className="mt-2 text-sm text-stone">
        These settings control the information shown publicly and your SEO metadata.
      </p>
      <Link href="/admin/settings/certificates" className="mt-6 block rounded border border-line bg-ink p-5 text-gold-bright">Private certificates — QR codes for paid orders →</Link>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
