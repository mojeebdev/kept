import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const user = await getOptionalUser();

  return (
    <header className="border-b border-rule/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-seal" />
          <span className="font-display text-2xl font-medium tracking-tight">Kept</span>
          {!compact && (
            <span className="hidden text-sm text-ink-muted sm:inline">
              keep the promises your content makes
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link className="px-2 py-1 text-ink-muted hover:text-ink" href="/demo">
            Demo
          </Link>
          {user ? (
            <>
              <Link className="px-2 py-1 hover:text-seal" href="/dashboard">
                Ledger
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              className="border border-ink bg-ink px-3 py-1.5 text-paper-raised hover:bg-seal hover:border-seal"
              href="/auth/sign-in"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
