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
    <div className="min-h-full">
      <header className="border-b border-rule/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="font-display text-2xl">
            Kept
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/dashboard/add" className="text-ink-muted hover:text-ink">
              Add
            </Link>
            <span className="hidden text-ink-muted sm:inline">{user.email ?? user.name}</span>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
