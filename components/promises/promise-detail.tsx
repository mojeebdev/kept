"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  draftFollowUpAction,
  setPromiseStatusAction,
  updatePromiseAction,
} from "@/app/actions/workspace";
import { StatusStamp } from "@/components/ui/status-stamp";
import type { PromiseDTO } from "@/lib/types";
import { formatDate, platformLabel, typeLabel, xIntentUrl } from "@/lib/utils";

export function PromiseDetail({
  promise,
  timezone,
}: {
  promise: PromiseDTO;
  timezone: string;
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(promise.summary);
  const [dueAt, setDueAt] = useState(promise.dueAt ? promise.dueAt.slice(0, 10) : "");
  const [draft, setDraft] = useState(promise.draft?.body ?? "");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveEdits(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await updatePromiseAction({
        promiseId: promise.id,
        summary,
        dueAt: dueAt || null,
      });
      setMessage("Summary and date saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function draftFollowUp() {
    setBusy(true);
    try {
      const saved = await draftFollowUpAction({
        promiseId: promise.id,
        body: draft || undefined,
        deliveryLink: link,
      });
      if (saved) setDraft(saved.body);
      setMessage("Follow-up saved as a draft. Opening X is not proof of publishing.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not draft.");
    } finally {
      setBusy(false);
    }
  }

  async function copyDraft() {
    if (!draft) return;
    await navigator.clipboard.writeText(draft);
    setMessage("Copied to clipboard.");
  }

  async function setStatus(status: "open" | "fulfilled" | "dismissed") {
    setBusy(true);
    try {
      await setPromiseStatusAction(promise.id, status);
      setMessage(
        status === "fulfilled"
          ? "Marked fulfilled. This stays on your account across devices."
          : status === "dismissed"
            ? "Dismissed. You can reopen it later."
            : "Reopened.",
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update status.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 min-[900px]:grid-cols-[1.05fr_0.95fr]">
      <article className="evidence-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusStamp status={promise.status} urgency={promise.urgency} />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
            {promise.source ? platformLabel(promise.source.platform) : "Source"} ·{" "}
            {typeLabel(promise.promiseType)} · {promise.confidence} confidence
          </p>
        </div>
        <h1 className="mt-5 font-display text-4xl leading-none">Evidence first</h1>
        <blockquote className="mt-5 border-l-2 border-signal pl-4 font-mono text-base leading-7">
          “{promise.evidenceQuote}”
        </blockquote>
        {promise.source && (
          <p className="mt-4 text-sm leading-6 text-ink-muted">{promise.source.body}</p>
        )}
        <p className="mt-4 text-sm text-ink-muted">
          {promise.dueAt ? `Due ${formatDate(promise.dueAt, timezone)}` : "No deadline inferred"}
        </p>

        <form onSubmit={saveEdits} className="mt-6 space-y-3">
          <label className="block text-sm">
            Promise summary
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="mt-2 w-full border border-rule bg-paper p-3"
              rows={3}
            />
          </label>
          <label className="block text-sm">
            Due date
            <input
              type="date"
              value={dueAt}
              onChange={(event) => setDueAt(event.target.value)}
              className="mt-2 w-full border border-rule bg-paper p-2"
            />
          </label>
          <button type="submit" disabled={busy} className="button-secondary">
            Save edits
          </button>
        </form>
      </article>

      <section className="surface-card p-6">
        <p className="eyebrow text-seal">Your next action</p>
        <h2 className="mt-3 font-display text-4xl leading-none">Close the loop</h2>
        <label className="mt-4 block text-sm">
          Delivery link <span className="text-ink-muted">(optional, never invented)</span>
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-rule bg-paper-raised p-2"
          />
        </label>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-4 w-full rounded-[var(--radius-sm)] border border-rule bg-paper-raised p-3 font-mono text-sm"
          rows={8}
          placeholder="Draft a follow-up grounded in the evidence above."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={draftFollowUp}
            disabled={busy}
            className="button-primary"
          >
            Save follow-up draft
          </button>
          <button type="button" onClick={copyDraft} className="button-secondary">
            Copy
          </button>
          {(promise.source?.platform === "x" || promise.draft?.channel === "x") && draft && (
            <a
              href={xIntentUrl(draft)}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
            >
              Open in X
            </a>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatus("fulfilled")}
            className="button-secondary border-kept text-kept"
          >
            Mark fulfilled
          </button>
          <button
            type="button"
            onClick={() => setStatus("dismissed")}
            className="button-secondary border-dismissed text-dismissed"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => setStatus("open")}
            className="button-secondary border-open text-open"
          >
            Reopen
          </button>
        </div>
        {message && <p aria-live="polite" className="mt-4 border-l-2 border-seal pl-3 text-sm text-seal">{message}</p>}
      </section>
    </div>
  );
}
