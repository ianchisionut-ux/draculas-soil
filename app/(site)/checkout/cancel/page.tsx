import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Order cancelled</h1>
      <p className="mt-4 text-stone">
        No payment was made. Your cart has been saved, so you can pick up right where you left off.
      </p>
      <Link
        href="/cart"
        className="mt-8 inline-block bg-blood px-8 py-3 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright"
      >
        BACK TO CART
      </Link>
    </div>
  );
}
