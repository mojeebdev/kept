import { z } from "zod";
import { confidenceLevels, promiseTypes } from "@/lib/types";

export const promiseCandidateSchema = z.object({
  evidenceQuote: z.string().min(3).max(500),
  summary: z.string().min(3).max(280),
  promiseType: z.enum(promiseTypes),
  dueAt: z.string().datetime().nullable(),
  confidence: z.enum(confidenceLevels),
  reason: z.string().min(3).max(280),
});

export const promiseCandidateListSchema = z.object({
  candidates: z.array(promiseCandidateSchema).max(12),
});

export type PromiseCandidate = z.infer<typeof promiseCandidateSchema>;
