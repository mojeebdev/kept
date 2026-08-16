"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setBusy(false);
        return;
      }

      // A document navigation guarantees server-rendered navigation cannot reuse
      // the previous authenticated RSC payload after the session cookie clears.
      window.location.replace("/");
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="px-2 py-1 text-ink-muted hover:text-ink disabled:cursor-wait disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
