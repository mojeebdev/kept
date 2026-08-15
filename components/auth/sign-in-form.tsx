"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function SignInForm() {
  const [email, setEmail] = useState("");
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

  async function magicLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const client = authClient as unknown as {
        signIn: {
          magicLink?: (input: { email: string; callbackURL: string }) => Promise<{ error?: { message?: string } }>;
          emailOtp?: (input: { email: string; otp: string }) => Promise<unknown>;
        };
        emailOtp?: {
          sendVerificationOtp?: (input: {
            email: string;
            type: string;
          }) => Promise<{ error?: { message?: string } }>;
        };
      };

      if (client.signIn.magicLink) {
        const { error } = await client.signIn.magicLink({
          email,
          callbackURL: "/dashboard",
        });
        setMessage(
          error?.message || "Check your email for a sign-in link. It expires, and it is not a password.",
        );
        return;
      }

      if (client.emailOtp?.sendVerificationOtp) {
        const { error } = await client.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });
        setMessage(
          error?.message || "If magic link is off, enable Email OTP in Neon Auth and try again.",
        );
        return;
      }

      setMessage("Enable Magic Link or Email OTP on this Neon Auth branch, then try again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send a sign-in email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ticket mx-auto w-full max-w-md p-6 pl-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">Private workspace</p>
      <h1 className="mt-3 font-display text-3xl">Sign in to Kept</h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        Google first. Email link if you need it. Same account, same ledger, any device. No
        passwords stored by Kept.
      </p>
      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="mt-6 w-full bg-ink px-4 py-3 text-sm text-paper-raised hover:bg-seal disabled:opacity-60"
      >
        Continue with Google
      </button>
      <form onSubmit={magicLink} className="mt-6 space-y-3">
        <label className="block text-sm">
          Email for a magic link
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border border-rule bg-paper p-2"
            placeholder="you@studio.com"
          />
        </label>
        <button type="submit" disabled={busy} className="w-full border border-ink px-4 py-2 text-sm">
          Email me a sign-in link
        </button>
      </form>
      {message && <p className="mt-4 text-sm leading-6 text-seal">{message}</p>}
    </div>
  );
}
