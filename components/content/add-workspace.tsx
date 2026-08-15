"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addContentAction, importCsvAction, scanOneAction } from "@/app/actions/workspace";
import { platforms, type Platform } from "@/lib/types";
import { platformLabel } from "@/lib/utils";

export function AddWorkspace() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [publishedAt, setPublishedAt] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [csvText, setCsvText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [csvReport, setCsvReport] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onManual(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const item = await addContentAction({
        body,
        platform,
        publishedAt: publishedAt || null,
        sourceUrl,
      });
      const scan = await scanOneAction(item.id);
      setMessage(
        scan.created
          ? `Saved and scanned. ${scan.created} promise${scan.created === 1 ? "" : "s"} added.`
          : "Saved. No new promise debt found in that text.",
      );
      setBody("");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save that content.");
    } finally {
      setBusy(false);
    }
  }

  async function onCsv(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setCsvReport(null);
    try {
      const result = await importCsvAction(csvText);
      setCsvReport(
        `Imported ${result.createdCount} valid row${result.createdCount === 1 ? "" : "s"}. ${
          result.errors.length
            ? result.errors.map((entry) => `Row ${entry.row}: ${entry.error}`).join(" ")
            : "No row errors."
        }`,
      );
      router.refresh();
    } catch (error) {
      setCsvReport(error instanceof Error ? error.message : "CSV import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={onManual} className="space-y-4">
        <h2 className="font-display text-2xl">Paste a post or transcript</h2>
        <label className="block text-sm">
          Body
          <textarea
            required
            minLength={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-2 w-full border border-rule bg-paper-raised p-3 font-mono text-sm"
            rows={8}
            placeholder="Comment TEMPLATE and I’ll send it tomorrow."
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Platform
            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value as Platform)}
              className="mt-2 w-full border border-rule bg-paper-raised p-2"
            >
              {platforms.map((value) => (
                <option key={value} value={value}>
                  {platformLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Published date
            <input
              type="date"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className="mt-2 w-full border border-rule bg-paper-raised p-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          Source URL <span className="text-ink-muted">(optional, not fetched)</span>
          <input
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className="mt-2 w-full border border-rule bg-paper-raised p-2"
          />
        </label>
        <button type="submit" disabled={busy} className="button-primary disabled:opacity-60">
          {busy ? "Saving…" : "Save and scan"}
        </button>
        {message && <p className="text-sm text-seal">{message}</p>}
      </form>

      <form onSubmit={onCsv} className="space-y-4">
        <h2 className="font-display text-2xl">Import a small CSV</h2>
        <p className="text-sm text-ink-muted">
          Columns: <code>body</code>, <code>platform</code>, <code>published_at</code>, optional{" "}
          <code>source_url</code>. Invalid rows are reported and skipped.
        </p>
        <textarea
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
          className="w-full border border-rule bg-paper-raised p-3 font-mono text-sm"
          rows={12}
          placeholder={'body,platform,published_at,source_url\n"I’ll share the template tomorrow.",x,2026-08-14,'}
        />
        <button type="submit" disabled={busy} className="button-secondary">
          Import valid rows
        </button>
        {csvReport && <p className="text-sm leading-6 text-ink-muted">{csvReport}</p>}
      </form>
    </div>
  );
}
