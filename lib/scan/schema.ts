import { z } from "zod";
import { inferRelativeDueDate, parseFlexibleDate } from "@/lib/scan/dates";
import { confidenceLevels, promiseTypes, type Confidence, type PromiseType } from "@/lib/types";

export const promiseCandidateSchema = z.object({
  evidenceQuote: z.string().min(3).max(500),
  summary: z.string().min(3).max(280),
  promiseType: z.enum(promiseTypes),
  dueAt: z.string().datetime().nullable(),
  confidence: z.enum(confidenceLevels),
  reason: z.string().min(3).max(280),
});

export const looseCandidateSchema = z.object({
  evidenceQuote: z.string().min(3).max(500),
  summary: z.string().min(3).max(280),
  promiseType: z.string().optional(),
  dueAt: z.union([z.string(), z.null()]).optional(),
  confidence: z.union([z.string(), z.number()]).optional(),
  reason: z.string().min(1).max(280).optional(),
});

export const promiseCandidateListSchema = z.object({
  candidates: z.array(looseCandidateSchema).max(12),
});

export type PromiseCandidate = z.infer<typeof promiseCandidateSchema>;

function normalizePromiseType(value: string | undefined): PromiseType {
  const key = (value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if ((promiseTypes as readonly string[]).includes(key)) return key as PromiseType;
  if (key.includes("template")) return "template";
  if (key.includes("link")) return "link";
  if (key.includes("reply") || key.includes("answer")) return "reply";
  if (key.includes("part")) return "part_two";
  if (key.includes("resource") || key.includes("guide")) return "resource";
  if (key.includes("update") || key.includes("next")) return "update";
  return "other";
}

function normalizeConfidence(value: string | number | undefined): Confidence {
  if (typeof value === "number") {
    if (value >= 0.75) return "high";
    if (value >= 0.4) return "medium";
    return "low";
  }
  const key = (value ?? "").trim().toLowerCase();
  if ((confidenceLevels as readonly string[]).includes(key)) return key as Confidence;
  return "medium";
}

function normalizeDueAt(
  value: string | null | undefined,
  evidenceQuote: string,
  publishedAt: Date | null,
) {
  if (!value || value.trim() === "" || value.trim().toLowerCase() === "null") {
    return inferRelativeDueDate(evidenceQuote, publishedAt).dueAt?.toISOString() ?? null;
  }
  const parsed = parseFlexibleDate(value);
  if (parsed) return parsed.toISOString();
  return inferRelativeDueDate(`${evidenceQuote} ${value}`, publishedAt).dueAt?.toISOString() ?? null;
}

export function normalizeCandidates(
  input: z.infer<typeof promiseCandidateListSchema>,
  publishedAt: Date | null,
): PromiseCandidate[] {
  return input.candidates.map((item) => ({
    evidenceQuote: item.evidenceQuote.replace(/\s+/g, " ").trim(),
    summary: item.summary.replace(/\s+/g, " ").trim().slice(0, 280),
    promiseType: normalizePromiseType(item.promiseType),
    dueAt: normalizeDueAt(item.dueAt ?? null, item.evidenceQuote, publishedAt),
    confidence: normalizeConfidence(item.confidence),
    reason: (item.reason ?? "Model extraction").slice(0, 280),
  }));
}
