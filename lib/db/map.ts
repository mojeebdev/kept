import { deriveUrgency } from "@/lib/scan/dates";
import type { ContentItemRow, FollowUpDraftRow, PromiseRow } from "@/lib/db/schema";
import type {
  Confidence,
  ContentItemDTO,
  DraftChannel,
  FollowUpDraftDTO,
  Platform,
  PromiseDTO,
  PromiseStatus,
  PromiseType,
} from "@/lib/types";

export function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toContentDTO(row: ContentItemRow): ContentItemDTO {
  return {
    id: row.id,
    body: row.body,
    platform: row.platform as Platform,
    sourceUrl: row.sourceUrl,
    publishedAt: toIso(row.publishedAt),
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
  };
}

export function toDraftDTO(row: FollowUpDraftRow): FollowUpDraftDTO {
  return {
    id: row.id,
    promiseId: row.promiseId,
    channel: row.channel as DraftChannel,
    body: row.body,
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date().toISOString(),
  };
}

export function toPromiseDTO(
  row: PromiseRow,
  timeZone: string,
  extras?: { source?: ContentItemDTO; draft?: FollowUpDraftDTO | null },
): PromiseDTO {
  return {
    id: row.id,
    contentItemId: row.contentItemId,
    evidenceQuote: row.evidenceQuote,
    summary: row.summary,
    promiseType: row.promiseType as PromiseType,
    dueAt: toIso(row.dueAt),
    status: row.status as PromiseStatus,
    confidence: row.confidence as Confidence,
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date().toISOString(),
    fulfilledAt: toIso(row.fulfilledAt),
    urgency: deriveUrgency(row.status, row.dueAt, timeZone),
    source: extras?.source,
    draft: extras?.draft ?? null,
  };
}

export function ledgerRank(item: PromiseDTO) {
  if (item.status === "fulfilled" || item.status === "dismissed") return 4;
  if (item.status === "drafted") return 3;
  if (item.urgency === "overdue") return 0;
  if (item.urgency === "due_today") return 1;
  return 2;
}

export function sortLedger(items: PromiseDTO[]) {
  return [...items].sort((a, b) => {
    const rank = ledgerRank(a) - ledgerRank(b);
    if (rank !== 0) return rank;
    const aDue = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bDue = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
    return aDue - bDue;
  });
}
