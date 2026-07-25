"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="mt-2 text-xs text-stone hover:text-blood-bright"
    >
      Sign out
    </button>
  );
}
