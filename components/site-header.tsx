import Link from "next/link";
import { getOptionalUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const user = await getOptionalUser();

  return (
    <header className="bg-ink text-paper-raised">
      <div className="kept-shell flex min-h-14 items-center justify-between gap-4">
        <Link href="/" className="font-display text-3xl leading-none tracking-tight">
          Kept
        </Link>
        {!compact && (
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#what-it-catches" className="text-paper-raised/80 hover:text-paper-raised">What it catches</a>
            <a href="#how-it-works" className="text-paper-raised/80 hover:text-paper-raised">How it works</a>
            <a href="#why-it-matters" className="text-paper-raised/80 hover:text-paper-raised">Why it matters</a>
          </nav>
        )}
        <nav className="flex items-center gap-2 text-sm" aria-label="Account">
          {!compact && <a href="#how-it-works" className="px-2 py-1 font-medium md:hidden">Menu</a>}
          {user ? (
            <>
              <Link href="/dashboard" className="px-2 py-1 font-medium hover:text-butter">Workspace</Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/sign-in" className="button-inverse min-h-0 px-3 py-2 text-sm">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
