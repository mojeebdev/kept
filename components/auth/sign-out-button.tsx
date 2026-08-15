"use client";

import { signOutAction } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="px-2 py-1 text-ink-muted hover:text-ink">
        Sign out
      </button>
    </form>
  );
}
