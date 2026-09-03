"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/site/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok) throw new Error(data.error || "A apărut o eroare.");
      window.location.href = data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "A apărut o eroare.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Coșul tău e gol</h1>
        <p className="mt-3 text-stone">Adaugă un produs pentru a continua.</p>
        <Link
          href="/"
          className="mt-8 inline-block bg-blood px-8 py-3 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright"
        >
          VEZI PRODUSELE
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl">Coșul tău</h1>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 flex-shrink-0 border border-line bg-ink">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-label text-sm tracking-wide">{item.name}</p>
              <p className="text-sm text-stone">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center border border-line">
              <button
                className="px-3 py-1 text-stone hover:text-gold-bright"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                aria-label="Scade cantitatea"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                className="px-3 py-1 text-stone hover:text-gold-bright"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                aria-label="Crește cantitatea"
              >
                +
              </button>
            </div>
            <button
              className="text-sm text-stone hover:text-blood-bright"
              onClick={() => removeItem(item.productId)}
              aria-label={`Elimină ${item.name}`}
            >
              Elimină
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="font-label text-sm tracking-wide text-stone">SUBTOTAL</span>
        <span className="font-label text-xl text-gold-bright">{formatPrice(totalCents)}</span>
      </div>
      <p className="mt-1 text-sm text-stone">Taxele de livrare se calculează la finalizarea comenzii.</p>

      {error && <p className="mt-4 text-sm text-blood-bright">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-8 w-full bg-blood py-4 font-label text-xs tracking-[0.15em] text-bone transition-colors hover:bg-blood-bright disabled:opacity-50"
      >
        {loading ? "SE PROCESEAZĂ..." : "FINALIZEAZĂ COMANDA"}
      </button>
    </div>
  );
}
