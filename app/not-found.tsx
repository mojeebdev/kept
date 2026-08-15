import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">404</p>
      <h1 className="mt-3 font-display text-4xl">That page is not on the ledger.</h1>
      <p className="mt-4 text-ink-muted">Go back to the public page or your private workspace.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="bg-ink px-4 py-2 text-sm text-paper-raised">
          Home
        </Link>
        <Link href="/dashboard" className="border border-ink px-4 py-2 text-sm">
          Ledger
        </Link>
      </div>
    </main>
  );
}
