"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/site/CartContext";

export const dynamic = "force-dynamic";

function SuccessContent() {
  const { clear } = useCart();
  const params = useSearchParams();
  const orderNumber = params.get("order");

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <Image
        src="/images/wax-seal.png"
        alt=""
        width={96}
        height={96}
        className="mx-auto h-24 w-24 object-contain"
      />
      <h1 className="mt-6 font-display text-4xl">Order confirmed</h1>
      {orderNumber && (
        <p className="mt-2 font-label text-sm tracking-wide text-gold-bright">
          #{orderNumber}
        </p>
      )}
      <p className="mt-4 text-stone">
        Thank you! You&apos;ll receive a confirmation email shortly with your order details.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-blood px-8 py-3 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
