import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { contentItems, followUpDrafts, promises } from "@/lib/db/schema";
import { sortLedger, toContentDTO, toDraftDTO, toPromiseDTO } from "@/lib/db/map";
import { sameEvidence } from "@/lib/scan";
import { parseFlexibleDate } from "@/lib/scan/dates";
import type { PromiseCandidate } from "@/lib/scan/schema";
import type { ContentInput } from "@/lib/csv";
import type { ContentItemDTO, PromiseDTO, PromiseStatus } from "@/lib/types";

export async function listContent(userId: string): Promise<ContentItemDTO[]> {
  const rows = await getDb()
    .select()
    .from(contentItems)
    .where(eq(contentItems.userId, userId))
    .orderBy(desc(contentItems.createdAt));
  return rows.map(toContentDTO);
}

export async function createContentItems(userId: string, items: ContentInput[]) {
  if (items.length === 0) return [];
  const inserted = await getDb()
    .insert(contentItems)
    .values(
      items.map((item) => ({
        userId,
        body: item.body,
        platform: item.platform,
        sourceUrl: item.sourceUrl ? item.sourceUrl : null,
        publishedAt: parseFlexibleDate(item.publishedAt ?? null),
      })),
    )
    .returning();
  return inserted.map(toContentDTO);
}

export async function listPromises(userId: string, timeZone: string): Promise<PromiseDTO[]> {
  const db = getDb();
  const rows = await db
    .select({
      promise: promises,
      content: contentItems,
      draft: followUpDrafts,
    })
    .from(promises)
    .leftJoin(contentItems, eq(promises.contentItemId, contentItems.id))
    .leftJoin(followUpDrafts, eq(followUpDrafts.promiseId, promises.id))
    .where(eq(promises.userId, userId));

  return sortLedger(
    rows.map((row) =>
      toPromiseDTO(row.promise, timeZone, {
        source: row.content ? toContentDTO(row.content) : undefined,
        draft: row.draft ? toDraftDTO(row.draft) : null,
      }),
    ),
  );
}

export async function getPromise(userId: string, promiseId: string, timeZone: string) {
  const all = await listPromises(userId, timeZone);
  return all.find((item) => item.id === promiseId) ?? null;
}

export async function insertCandidates(
  userId: string,
  contentItemId: string,
  candidates: PromiseCandidate[],
) {
  const existing = await getDb()
    .select()
    .from(promises)
    .where(and(eq(promises.userId, userId), eq(promises.contentItemId, contentItemId)));

  let created = 0;
  let duplicates = 0;
  const saved: typeof existing = [];

  for (const candidate of candidates) {
    const already = existing.some((row) => sameEvidence(row.evidenceQuote, candidate.evidenceQuote));
    if (already) {
      duplicates += 1;
      continue;
    }
    try {
      const [row] = await getDb()
        .insert(promises)
        .values({
          userId,
          contentItemId,
          evidenceQuote: candidate.evidenceQuote,
          summary: candidate.summary,
          promiseType: candidate.promiseType,
          dueAt: candidate.dueAt ? new Date(candidate.dueAt) : null,
          status: "open",
          confidence: candidate.confidence,
        })
        .returning();
      if (row) {
        created += 1;
        existing.push(row);
        saved.push(row);
      }
    } catch {
      duplicates += 1;
    }
  }

  return { created, duplicates, saved };
}

export async function updatePromise(
  userId: string,
  promiseId: string,
  patch: {
    summary?: string;
    dueAt?: Date | null;
    status?: PromiseStatus;
    fulfilledAt?: Date | null;
  },
) {
  const [row] = await getDb()
    .update(promises)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(and(eq(promises.id, promiseId), eq(promises.userId, userId)))
    .returning();
  return row ?? null;
}

export async function upsertDraft(
  userId: string,
  promiseId: string,
  channel: string,
  body: string,
) {
  const db = getDb();
  const existing = await db
    .select()
    .from(followUpDrafts)
    .where(and(eq(followUpDrafts.userId, userId), eq(followUpDrafts.promiseId, promiseId)))
    .limit(1);

  if (existing[0]) {
    const [row] = await db
      .update(followUpDrafts)
      .set({ body, channel, updatedAt: new Date() })
      .where(and(eq(followUpDrafts.id, existing[0].id), eq(followUpDrafts.userId, userId)))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(followUpDrafts)
    .values({ userId, promiseId, channel, body })
    .returning();
  return row;
}
