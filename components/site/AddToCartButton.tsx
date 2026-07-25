"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

type Props = {
  product: {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
  };
  disabled?: boolean;
};

export function AddToCartButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-line">
        <button
          type="button"
          className="px-3 py-2 text-lg text-stone hover:text-gold-bright disabled:opacity-40"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={disabled}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-10 text-center">{qty}</span>
        <button
          type="button"
          className="px-3 py-2 text-lg text-stone hover:text-gold-bright disabled:opacity-40"
          onClick={() => setQty((q) => q + 1)}
          disabled={disabled}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addItem(product, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="bg-blood px-8 py-3 font-label text-xs tracking-[0.15em] text-bone transition-colors hover:bg-blood-bright disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added ? "ADDED ✓" : "ADD TO CART"}
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addItem(product, qty);
          router.push("/cart");
        }}
        className="font-label text-xs tracking-[0.15em] text-bone underline decoration-gold/50 underline-offset-4 hover:text-gold-bright disabled:opacity-40"
      >
        BUY NOW
      </button>
    </div>
  );
}
