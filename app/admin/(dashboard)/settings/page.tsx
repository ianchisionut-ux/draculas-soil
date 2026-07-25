import { getAllSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSiteSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <h1 className="font-display text-4xl">Site settings</h1>
      <p className="mt-2 text-sm text-stone">
        These settings control the information shown publicly and your SEO metadata.
      </p>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
