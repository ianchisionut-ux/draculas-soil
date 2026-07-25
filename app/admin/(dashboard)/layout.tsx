import Link from "next/link";
import { auth } from "@/auth";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/settings/stripe", label: "Stripe settings" },
  { href: "/admin/settings/email", label: "Email settings" },
  { href: "/admin/settings/password", label: "Change password" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-void text-bone">
      <aside className="hidden w-60 flex-shrink-0 border-r border-line p-6 md:block">
        <p className="font-label text-sm tracking-[0.15em] text-gold-bright">DRACULA&apos;S SOIL</p>
        <p className="mt-1 text-xs text-stone">Admin dashboard</p>
        <nav className="mt-8 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-sm px-3 py-2 text-sm text-stone hover:bg-ink hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 border-t border-line pt-4">
          <p className="truncate text-xs text-stone">{session?.user?.email}</p>
          <AdminSignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
