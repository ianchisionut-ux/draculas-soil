"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6 text-bone">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-line bg-ink p-8">
        <p className="font-label text-xs tracking-[0.2em] text-gold">ADMIN</p>
        <h1 className="mt-2 font-display text-3xl">Sign in</h1>

        <label className="mt-6 block text-sm text-stone">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-line bg-void px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </label>

        <label className="mt-4 block text-sm text-stone">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line bg-void px-3 py-2 text-bone outline-none focus:border-gold"
          />
        </label>

        {error && <p className="mt-4 text-sm text-blood-bright">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blood py-3 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright disabled:opacity-50"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
