import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-full bg-paper">
      <header className="border-b-2 border-ink bg-paper-raised">
        <div className="kept-shell flex min-h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6"><Link href="/dashboard" className="font-display text-3xl leading-none">Kept</Link><span className="hidden font-mono text-xs uppercase tracking-[var(--tracking-meta)] text-ink-muted sm:inline">Private workspace</span></div>
          <nav className="flex items-center gap-3 text-sm" aria-label="Workspace">
            <Link href="/dashboard" className="font-medium hover:text-seal">Promises</Link>
            <Link href="/dashboard/add" className="font-medium hover:text-seal">Sources</Link>
            <span className="hidden max-w-48 truncate text-ink-muted md:inline">{user.email ?? user.name}</span>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="kept-shell py-8 sm:py-12">{children}</main>
    </div>
  );
}
