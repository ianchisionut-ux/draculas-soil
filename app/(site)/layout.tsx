import { CartProvider } from "@/components/site/CartContext";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/settings";
import { connection } from "next/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const settings = await getSettings(["site_name", "contact_email", "support_phone"]);

  return (
    <CartProvider>
      <Header siteName={settings.site_name} />
      <main>{children}</main>
      <Footer
        siteName={settings.site_name}
        contactEmail={settings.contact_email}
        supportPhone={settings.support_phone}
      />
    </CartProvider>
  );
}
