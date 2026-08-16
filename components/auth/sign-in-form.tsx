"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function SignInForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function google() {
    setBusy(true);
    setMessage(null);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        setMessage(error.message || "Google sign-in is not available yet.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Confirm Neon Auth and the Google provider are enabled.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="evidence-card mx-auto w-full max-w-md p-6">
      <p className="eyebrow text-seal">Private workspace</p>
      <h1 className="mt-4 font-display text-4xl leading-none">Sign in to Kept</h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        Continue with Google to keep the same private ledger on any device. Kept stores no
        passwords or social credentials.
      </p>
      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="button-primary mt-6 w-full disabled:opacity-60"
      >
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>
      {message && (
        <p aria-live="polite" className="mt-4 border-l-2 border-seal pl-3 text-sm leading-6 text-seal">
          {message}
        </p>
      )}
    </div>
  );
}
