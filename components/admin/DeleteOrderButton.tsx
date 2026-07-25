"use client";

import { useState } from "react";

export function DeleteOrderButton({ action }: { action: () => Promise<void> }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!confirm("Delete this order permanently? This cannot be undone.")) return;
        setPending(true);
        await action();
      }}
      className="text-sm text-stone hover:text-blood-bright disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete order"}
    </button>
  );
}
