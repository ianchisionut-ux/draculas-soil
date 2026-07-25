"use client";

import { useActionState, useRef, useEffect } from "react";
import { changeAdminPassword } from "@/lib/actions/settings";

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(changeAdminPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm text-stone">Current password</label>
        <input
          type="password"
          name="currentPassword"
          required
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-sm text-stone">New password</label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-sm text-stone">Confirm new password</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          className="mt-1 w-full border border-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />
      </div>

      {state?.error && <p className="text-sm text-blood-bright">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-bright">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blood px-6 py-2.5 font-label text-xs tracking-[0.15em] text-bone hover:bg-blood-bright disabled:opacity-50"
      >
        {pending ? "SAVING..." : "CHANGE PASSWORD"}
      </button>
    </form>
  );
}
