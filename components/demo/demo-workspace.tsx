"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DEMO_BANNER, createDemoSeed } from "@/lib/demo/seed";
import { extractPromiseCandidates } from "@/lib/scan/deterministic";
import { deriveUrgency } from "@/lib/scan/dates";
import { buildFollowUpDraft, channelFromPlatform } from "@/lib/follow-up";
import { uniqueId, xIntentUrl } from "@/lib/utils";
import { PromiseCard } from "@/components/promises/promise-card";
import { sortLedger } from "@/lib/db/map";
import type { ContentItemDTO, PromiseDTO } from "@/lib/types";

type Toast = string | null;

export function DemoWorkspace() {
  const seed = useMemo(() => createDemoSeed(), []);
  const [contents, setContents] = useState<ContentItemDTO[]>(seed.contents);
  const [promises, setPromises] = useState<PromiseDTO[]>([]);
  const [scanned, setScanned] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [freshBody, setFreshBody] = useState("I’ll share the template tomorrow.");
  const [toast, setToast] = useState<Toast>(null);
  const [busy, setBusy] = useState(false);

  const ledger = sortLedger(promises);
  const active = ledger.find((item) => item.id === activeId) ?? ledger[0] ?? null;

  async function scanDebt() {
    setBusy(true);
    try {
      const next: PromiseDTO[] = [];
      for (const item of contents) {
        const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null;
        const local = extractPromiseCandidates(item.body, publishedAt);
        let candidates = local;
        try {
          const response = await fetch("/api/demo/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: item.body, publishedAt: item.publishedAt }),
          });
          if (response.ok) {
            const json = (await response.json()) as { candidates?: typeof local };
            if (json.candidates?.length) candidates = json.candidates;
          }
        } catch {
          // Deterministic floor still works offline.
        }

        for (const candidate of candidates) {
          const exists = promises.some(
            (entry) =>
              entry.contentItemId === item.id &&
              entry.evidenceQuote.toLowerCase() === candidate.evidenceQuote.toLowerCase(),
          );
          if (exists) continue;
          next.push({
            id: uniqueId(),
            contentItemId: item.id,
            evidenceQuote: candidate.evidenceQuote,
            summary: candidate.summary,
            promiseType: candidate.promiseType,
            dueAt: candidate.dueAt,
            status: "open",
            confidence: candidate.confidence,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            fulfilledAt: null,
            urgency: deriveUrgency("open", candidate.dueAt),
            source: item,
            draft: null,
          });
        }
      }
      setPromises((current) => sortLedger([...current, ...next]));
      setScanned(true);
      setToast(
        next.length
          ? `Found ${next.length} promise${next.length === 1 ? "" : "s"} in this sample set.`
          : "No new promise debt in the current sample.",
      );
    } finally {
      setBusy(false);
    }
  }

  function addFreshLine() {
    const item: ContentItemDTO = {
      id: uniqueId(),
      body: freshBody.trim(),
      platform: "x",
      sourceUrl: null,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    if (item.body.length < 8) {
      setToast("Write a longer line to scan.");
      return;
    }
    setContents((current) => [item, ...current]);
    setToast("Added to the temporary demo only. Refreshing this page will clear it.");
  }

  function draftActive() {
    if (!active) return;
    const body = buildFollowUpDraft({
      summary: active.summary,
      evidenceQuote: active.evidenceQuote,
      promiseType: active.promiseType,
    });
    setDraftText(body);
    setPromises((current) =>
      current.map((item) =>
        item.id === active.id
          ? {
              ...item,
              status: "drafted",
              urgency: "none",
              draft: {
                id: uniqueId(),
                promiseId: item.id,
                channel: channelFromPlatform(item.source?.platform ?? "other"),
                body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }
          : item,
      ),
    );
    setToast("Draft ready. Opening X would only hand off text — it does not publish.");
  }

  async function copyDraft() {
    if (!draftText) return;
    await navigator.clipboard.writeText(draftText);
    setToast("Copied. Kept does not post this for you.");
  }

  function fulfilActive() {
    if (!active) return;
    setPromises((current) =>
      current.map((item) =>
        item.id === active.id
          ? {
              ...item,
              status: "fulfilled",
              urgency: "none",
              fulfilledAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    setToast("Marked fulfilled in this demo session only.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="border border-due/40 bg-[#f4ead3] px-4 py-3 text-sm">{DEMO_BANNER}</div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">Guest demo</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Scan promise debt</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            Five seeded creator posts. Three should surface as promises, including the exact
            quote about sending TEMPLATE tomorrow.
          </p>
        </div>
        <button
          type="button"
          onClick={scanDebt}
          disabled={busy}
          className="bg-ink px-5 py-3 text-sm text-paper-raised hover:bg-seal disabled:opacity-60"
        >
          {busy ? "Scanning…" : "Scan promise debt"}
        </button>
      </div>

      {toast && <p className="mt-4 text-sm text-seal">{toast}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <h2 className="font-display text-2xl">Source slips</h2>
          <label className="mt-4 block text-sm text-ink-muted">
            Add a fresh line
            <textarea
              value={freshBody}
              onChange={(event) => setFreshBody(event.target.value)}
              className="mt-2 w-full border border-rule bg-paper-raised p-3 font-mono text-sm"
              rows={3}
            />
          </label>
          <button type="button" onClick={addFreshLine} className="mt-2 border border-ink px-3 py-2 text-sm">
            Add to demo
          </button>
          <ul className="mt-6 space-y-3">
            {contents.map((item) => (
              <li key={item.id} className="border border-rule bg-paper-raised/80 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                  {item.platform} · sample
                </p>
                <p className="mt-2 text-sm leading-6">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">Ledger</h2>
          {!scanned && (
            <p className="mt-4 border border-dashed border-rule p-6 text-sm text-ink-muted">
              Click <strong>Scan promise debt</strong> to extract evidence-backed commitments from
              these sample posts.
            </p>
          )}
          {scanned && ledger.length === 0 && (
            <p className="mt-4 border border-dashed border-rule p-6 text-sm">
              No promise debt found in this content. Kept looks for “I’ll”, “tomorrow”, “comment
              TEMPLATE”, “send”, “share”, and “next video”.
            </p>
          )}
          <div className="mt-4 grid gap-4">
            {ledger.map((item) => (
              <div key={item.id} onClick={() => setActiveId(item.id)} className="cursor-pointer">
                <PromiseCard item={item} href="#demo-detail" />
              </div>
            ))}
          </div>

          {active && (
            <div id="demo-detail" className="ticket mt-6 p-5 pl-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                Selected promise
              </p>
              <blockquote className="mt-3 font-mono text-sm leading-6">“{active.evidenceQuote}”</blockquote>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={draftActive} className="bg-ink px-3 py-2 text-sm text-paper-raised">
                  Draft follow-up
                </button>
                <button type="button" onClick={fulfilActive} className="border border-ink px-3 py-2 text-sm">
                  Mark fulfilled
                </button>
              </div>
              {draftText && (
                <div className="mt-4">
                  <textarea
                    value={draftText}
                    onChange={(event) => setDraftText(event.target.value)}
                    className="w-full border border-rule bg-paper p-3 font-mono text-sm"
                    rows={6}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={copyDraft} className="border border-ink px-3 py-2 text-sm">
                      Copy
                    </button>
                    <a
                      href={xIntentUrl(draftText)}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-ink px-3 py-2 text-sm"
                    >
                      Open in X
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <p className="mt-10 text-sm text-ink-muted">
        Want this to survive a refresh or another device?{" "}
        <Link href="/auth/sign-in" className="underline decoration-seal underline-offset-4">
          Sign in
        </Link>
        .
      </p>
    </div>
  );
}
