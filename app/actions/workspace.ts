"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { contentInputSchema, parseContentCsv } from "@/lib/csv";
import {
  createContentItems,
  getPromise,
  insertCandidates,
  listContent,
  listPromises,
  updatePromise,
  upsertDraft,
} from "@/lib/db/repositories";
import { isDatabaseConfigured } from "@/lib/db/client";
import { toDraftDTO, toPromiseDTO } from "@/lib/db/map";
import { buildFollowUpDraft, channelFromPlatform } from "@/lib/follow-up";
import { scanSourceText } from "@/lib/scan";
import { parseFlexibleDate } from "@/lib/scan/dates";
import { promiseCandidateSchema } from "@/lib/scan/schema";
import type { PromiseStatus, ScanResult } from "@/lib/types";

function assertDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not set. Neon Postgres is required for a saved workspace.");
  }
}

export async function addContentAction(input: unknown) {
  assertDatabase();
  const user = await requireUser();
  const parsed = contentInputSchema.parse(input);
  const [item] = await createContentItems(user.id, [parsed]);
  revalidatePath("/dashboard");
  return item;
}

export async function importCsvAction(csvText: string) {
  assertDatabase();
  const user = await requireUser();
  const results = parseContentCsv(csvText);
  const valid = results.flatMap((row) => (row.ok ? [row.value] : []));
  const invalid = results.flatMap((row) => (row.ok ? [] : [row]));
  const created = await createContentItems(user.id, valid);
  revalidatePath("/dashboard");
  return {
    createdCount: created.length,
    errors: invalid.map((row) => ({ row: row.row, error: row.error })),
  };
}

export async function scanAllAction(): Promise<ScanResult> {
  assertDatabase();
  const user = await requireUser();
  const contents = await listContent(user.id);
  const warnings = [];
  let created = 0;
  let duplicates = 0;
  let engine: ScanResult["engine"] = "deterministic";

  for (const item of contents) {
    const result = await scanSourceText(
      item.body,
      item.publishedAt ? new Date(item.publishedAt) : null,
    );
    if (result.engine === "deterministic+ai") engine = result.engine;
    warnings.push(...result.warnings);
    const saved = await insertCandidates(user.id, item.id, result.candidates);
    created += saved.created;
    duplicates += saved.duplicates;
  }

  const candidates = await listPromises(user.id, user.timezone);
  revalidatePath("/dashboard");
  return { candidates, created, duplicates, warnings: uniqueWarnings(warnings), engine };
}

export async function scanOneAction(contentItemId: string): Promise<ScanResult> {
  assertDatabase();
  const user = await requireUser();
  const contents = await listContent(user.id);
  const item = contents.find((entry) => entry.id === contentItemId);
  if (!item) {
    throw new Error("Content item not found.");
  }
  const result = await scanSourceText(
    item.body,
    item.publishedAt ? new Date(item.publishedAt) : null,
  );
  const saved = await insertCandidates(user.id, item.id, result.candidates);
  const candidates = await listPromises(user.id, user.timezone);
  revalidatePath("/dashboard");
  return {
    candidates,
    created: saved.created,
    duplicates: saved.duplicates,
    warnings: result.warnings,
    engine: result.engine,
  };
}

const updateSchema = z.object({
  promiseId: z.string().uuid(),
  summary: z.string().trim().min(3).max(280).optional(),
  dueAt: z.string().nullable().optional(),
  status: z.enum(["open", "drafted", "fulfilled", "dismissed"]).optional(),
});

export async function updatePromiseAction(input: unknown) {
  assertDatabase();
  const user = await requireUser();
  const parsed = updateSchema.parse(input);
  const dueAt =
    parsed.dueAt === undefined ? undefined : parsed.dueAt ? parseFlexibleDate(parsed.dueAt) : null;
  const fulfilledAt =
    parsed.status === "fulfilled" ? new Date() : parsed.status === "open" ? null : undefined;
  const row = await updatePromise(user.id, parsed.promiseId, {
    summary: parsed.summary,
    dueAt,
    status: parsed.status,
    fulfilledAt,
  });
  if (!row) throw new Error("Promise not found.");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/promise/${parsed.promiseId}`);
  return toPromiseDTO(row, user.timezone);
}

const draftSchema = z.object({
  promiseId: z.string().uuid(),
  body: z.string().trim().min(3).max(4000).optional(),
  deliveryLink: z.string().trim().url().optional().or(z.literal("")),
});

export async function draftFollowUpAction(input: unknown) {
  assertDatabase();
  const user = await requireUser();
  const parsed = draftSchema.parse(input);
  const promise = await getPromise(user.id, parsed.promiseId, user.timezone);
  if (!promise) throw new Error("Promise not found.");

  const body =
    parsed.body ??
    buildFollowUpDraft({
      summary: promise.summary,
      evidenceQuote: promise.evidenceQuote,
      promiseType: promise.promiseType,
      deliveryLink: parsed.deliveryLink,
      creatorName: user.name,
    });
  const channel = channelFromPlatform(promise.source?.platform ?? "other");
  const draft = await upsertDraft(user.id, promise.id, channel, body);
  if (promise.status === "open") {
    await updatePromise(user.id, promise.id, { status: "drafted" });
  }
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/promise/${promise.id}`);
  return draft ? toDraftDTO(draft) : null;
}

export async function createManualPromiseAction(input: unknown) {
  assertDatabase();
  const user = await requireUser();
  const parsed = z
    .object({
      contentItemId: z.string().uuid(),
      candidate: promiseCandidateSchema,
    })
    .parse(input);
  const result = await insertCandidates(user.id, parsed.contentItemId, [parsed.candidate]);
  revalidatePath("/dashboard");
  return result;
}

export async function setPromiseStatusAction(promiseId: string, status: PromiseStatus) {
  return updatePromiseAction({ promiseId, status });
}

function uniqueWarnings(warnings: ScanResult["warnings"]) {
  const seen = new Set<string>();
  return warnings.filter((warning) => {
    const key = `${warning.code}:${warning.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
