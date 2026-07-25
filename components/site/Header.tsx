"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#story-detail", label: "Story" },
  { href: "/#product", label: "Product" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#product", label: "Collector Edition" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ siteName }: { siteName: string }) {
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-void/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt={siteName}
            width={200}
            height={50}
            priority
            className="hidden h-9 w-auto sm:block"
          />
          <span className="font-label text-lg tracking-[0.15em] text-bone sm:hidden">
            {siteName.toUpperCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-label text-xs tracking-[0.15em] text-stone transition-colors hover:text-gold-bright"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${totalCount} items`}
            className="relative text-bone transition-colors hover:text-gold-bright"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9.5" cy="21.5" r="1" fill="currentColor" />
              <circle cx="17.5" cy="21.5" r="1" fill="currentColor" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[10px] text-bone">
                {totalCount}
              </span>
            )}
          </Link>

          <button
            className="text-bone md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 font-label text-xs tracking-[0.15em] text-stone hover:text-gold-bright"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
