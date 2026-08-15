export const platforms = [
  "x",
  "instagram",
  "youtube",
  "linkedin",
  "other",
] as const;
export type Platform = (typeof platforms)[number];

export const promiseTypes = [
  "link",
  "template",
  "reply",
  "part_two",
  "resource",
  "update",
  "other",
] as const;
export type PromiseType = (typeof promiseTypes)[number];

export const promiseStatuses = [
  "open",
  "drafted",
  "fulfilled",
  "dismissed",
] as const;
export type PromiseStatus = (typeof promiseStatuses)[number];

export const confidenceLevels = ["high", "medium", "low"] as const;
export type Confidence = (typeof confidenceLevels)[number];

export const draftChannels = [
  "x",
  "instagram",
  "youtube",
  "linkedin",
  "generic",
] as const;
export type DraftChannel = (typeof draftChannels)[number];

export type Urgency = "overdue" | "due_today" | "none";

export type ContentItemDTO = {
  id: string;
  body: string;
  platform: Platform;
  sourceUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type FollowUpDraftDTO = {
  id: string;
  promiseId: string;
  channel: DraftChannel;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type PromiseDTO = {
  id: string;
  contentItemId: string;
  evidenceQuote: string;
  summary: string;
  promiseType: PromiseType;
  dueAt: string | null;
  status: PromiseStatus;
  confidence: Confidence;
  createdAt: string;
  updatedAt: string;
  fulfilledAt: string | null;
  urgency: Urgency;
  source?: ContentItemDTO;
  draft?: FollowUpDraftDTO | null;
};

export type ScanWarning = {
  code: "ai_unavailable" | "ai_invalid" | "duplicate" | "none_found";
  message: string;
};

export type ScanResult = {
  candidates: PromiseDTO[];
  created: number;
  duplicates: number;
  warnings: ScanWarning[];
  engine: "deterministic" | "deterministic+ai";
};
