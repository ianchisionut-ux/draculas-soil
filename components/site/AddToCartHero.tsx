"use client";

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
};

export function AddToCartHero({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        addItem(product, 1);
        router.push("/cart");
      }}
      className="bg-blood px-8 py-4 font-label text-xs tracking-[0.15em] text-bone transition-colors hover:bg-blood-bright"
    >
      OWN A PIECE OF HISTORY
    </button>
  );
}
