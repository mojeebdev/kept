"use client";

import { useState } from "react";
import Link from "next/link";
import { scanAllAction } from "@/app/actions/workspace";
import { PromiseCard } from "@/components/promises/promise-card";
import type { ContentItemDTO, PromiseDTO, ScanWarning } from "@/lib/types";
import { formatDate, platformLabel } from "@/lib/utils";

export function DashboardWorkspace({
  promises,
  contents,
  timezone,
  databaseReady,
}: {
  promises: PromiseDTO[];
  contents: ContentItemDTO[];
  timezone: string;
  databaseReady: boolean;
}) {
  const [items, setItems] = useState(promises);
  const [message, setMessage] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ScanWarning[]>([]);
  const [busy, setBusy] = useState(false);

  const actionable = items.filter(
    (item) => item.status === "open" || item.status === "drafted",
  );
  const closed = items.filter(
    (item) => item.status === "fulfilled" || item.status === "dismissed",
  );

  async function scan() {
    setBusy(true);
    setMessage(null);
    try {
      const result = await scanAllAction();
      setItems(result.candidates);
      setWarnings(result.warnings);
      setMessage(
        `Scan finished with the ${result.engine} engine. ${result.created} new, ${result.duplicates} already recorded.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Scan failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!databaseReady) {
    return (
      <div className="border border-overdue/40 bg-[#f7e6e3] p-6 text-sm leading-7">
        Neon Postgres is not configured. Add <code>DATABASE_URL</code> and run the Kept
        schema before this signed-in workspace can persist.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">Private ledger</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">What you still owe</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            Overdue first, then due today, then open. Evidence stays above every generated summary.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/add" className="border border-ink px-4 py-3 text-sm">
            Add content
          </Link>
          <button
            type="button"
            onClick={scan}
            disabled={busy || contents.length === 0}
            className="bg-ink px-4 py-3 text-sm text-paper-raised hover:bg-seal disabled:opacity-50"
          >
            {busy ? "Scanning…" : "Scan promise debt"}
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-seal">{message}</p>}
      {warnings.map((warning) => (
        <p key={warning.message} className="text-sm text-due">
          {warning.message}
        </p>
      ))}

      {contents.length === 0 && (
        <div className="border border-dashed border-rule p-8">
          <h2 className="font-display text-2xl">No source text yet</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-ink-muted">
            Paste a post or import a small CSV, then scan. Kept looks for commitments like
            “I’ll send it tomorrow” or “comment TEMPLATE”.
          </p>
          <Link href="/dashboard/add" className="mt-4 inline-block bg-ink px-4 py-2 text-sm text-paper-raised">
            Add the first slip
          </Link>
        </div>
      )}

      {contents.length > 0 && items.length === 0 && (
        <div className="border border-dashed border-rule p-8 text-sm leading-7 text-ink-muted">
          Content is saved. Run a scan to extract promise debt, or add a clearer commitment if
          nothing obvious is in the text.
        </div>
      )}

      <section className="grid gap-4">
        {actionable.map((item) => (
          <PromiseCard
            key={item.id}
            item={item}
            href={`/dashboard/promise/${item.id}`}
            timezone={timezone}
          />
        ))}
      </section>

      {closed.length > 0 && (
        <section>
          <h2 className="font-display text-2xl">Closed</h2>
          <div className="mt-4 grid gap-4">
            {closed.map((item) => (
              <PromiseCard
                key={item.id}
                item={item}
                href={`/dashboard/promise/${item.id}`}
                timezone={timezone}
              />
            ))}
          </div>
        </section>
      )}

      {contents.length > 0 && (
        <section>
          <h2 className="font-display text-2xl">Source history</h2>
          <ul className="mt-4 divide-y divide-rule border border-rule">
            {contents.map((item) => (
              <li key={item.id} className="px-4 py-3 text-sm">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  {platformLabel(item.platform)} · {formatDate(item.publishedAt ?? item.createdAt, timezone)}
                </p>
                <p className="mt-1 line-clamp-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
