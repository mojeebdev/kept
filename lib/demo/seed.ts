import { extractPromiseCandidates } from "@/lib/scan/deterministic";
import { deriveUrgency } from "@/lib/scan/dates";
import { uniqueId } from "@/lib/utils";
import type { ContentItemDTO, PromiseDTO } from "@/lib/types";

function daysAgoIso(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

export function createDemoSeed() {
  const now = new Date();
  const contents: ContentItemDTO[] = [
    {
      id: uniqueId(),
      body: "Comment TEMPLATE and I’ll send it tomorrow.",
      platform: "x",
      sourceUrl: null,
      publishedAt: daysAgoIso(3),
      createdAt: now.toISOString(),
    },
    {
      id: uniqueId(),
      body: "Part two drops next video — I’ll walk through the pricing model in public.",
      platform: "youtube",
      sourceUrl: null,
      publishedAt: daysAgoIso(5),
      createdAt: now.toISOString(),
    },
    {
      id: uniqueId(),
      body: "If you want the Notion board, comment GUIDE and I’ll share the link.",
      platform: "instagram",
      sourceUrl: null,
      publishedAt: daysAgoIso(1),
      createdAt: now.toISOString(),
    },
    {
      id: uniqueId(),
      body: "Really enjoyed the Q&A today. The comments were thoughtful and I learned as much as I taught.",
      platform: "linkedin",
      sourceUrl: null,
      publishedAt: daysAgoIso(1),
      createdAt: now.toISOString(),
    },
    {
      id: uniqueId(),
      body: "The new episode is live. Timestamp chapters are in the description. No promises beyond that.",
      platform: "youtube",
      sourceUrl: null,
      publishedAt: daysAgoIso(2),
      createdAt: now.toISOString(),
    },
  ];

  const promises: PromiseDTO[] = contents.flatMap((item) => {
    const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null;
    return extractPromiseCandidates(item.body, publishedAt, now).map((candidate) => {
      const created = now.toISOString();
      return {
        id: uniqueId(),
        contentItemId: item.id,
        evidenceQuote: candidate.evidenceQuote,
        summary: candidate.summary,
        promiseType: candidate.promiseType,
        dueAt: candidate.dueAt,
        status: "open" as const,
        confidence: candidate.confidence,
        createdAt: created,
        updatedAt: created,
        fulfilledAt: null,
        urgency: deriveUrgency("open", candidate.dueAt, "Africa/Lagos", now),
        source: item,
        draft: null,
      };
    });
  });

  return { contents, promises };
}

export const DEMO_BANNER =
  "Temporary sample workspace. Nothing here is saved to an account. Sign in to keep a real ledger.";
