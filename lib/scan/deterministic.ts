import { inferRelativeDueDate } from "@/lib/scan/dates";
import type { PromiseCandidate } from "@/lib/scan/schema";
import type { PromiseType } from "@/lib/types";

const NEGATIVE =
  /\b(no promises?|i won['’]t|i will not|never going to|not going to send|not promising)\b/i;
const COMMITMENT = /\b(i['’]ll|i will|i am going to|i['’]m going to)\b/i;
const DELIVERY =
  /\b(send|share|drop|post|publish|give|email|dm|reply|answer|walk through|walk you through)\b/i;
const RESOURCE =
  /\b(template|link|guide|file|pdf|board|doc|document|resource|checklist|swipe file)\b/i;
const PART_TWO = /\b(part two|part 2|follow[- ]up (post|video|episode))\b/i;
const NEXT_CONTENT = /\b(next (post|video|episode|thread))\b/i;
const COMMENT_KEYWORD = /\bcomment\s+["“]?([A-Z][A-Z0-9_-]{1,24})["”]?/i;

function splitUnits(text: string) {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 8);
}

function classifyType(sentence: string, keyword: string | null): PromiseType {
  const lower = sentence.toLowerCase();
  if (keyword && /template|guide|board/.test(keyword.toLowerCase())) return "template";
  if (/\btemplate\b/.test(lower)) return "template";
  if (PART_TWO.test(sentence)) return "part_two";
  if (/\blink\b/.test(lower)) return "link";
  if (/\b(reply|answer|respond)\b/.test(lower)) return "reply";
  if (NEXT_CONTENT.test(sentence) || /\bupdate\b/.test(lower)) return "update";
  if (RESOURCE.test(sentence) || keyword) return "resource";
  return "other";
}

function summarize(sentence: string, type: PromiseType, keyword: string | null) {
  if (keyword && type === "template") {
    return `Send the ${keyword} resource to anyone who comments ${keyword}`;
  }
  if (keyword) {
    return `Deliver the promised ${keyword} to people who comment ${keyword}`;
  }
  if (type === "part_two") return "Publish the promised part two / follow-up";
  if (type === "link") return "Share the promised link";
  if (type === "reply") return "Reply to the promised question or comment";
  if (type === "update") return "Post the promised update";
  if (type === "template") return "Send the promised template";
  if (type === "resource") return "Share the promised resource";
  const cleaned = sentence.replace(/\s+/g, " ").replace(/^["“]|["”]$/g, "");
  return cleaned.length > 140 ? `${cleaned.slice(0, 137)}…` : cleaned;
}

function isPromiseLike(sentence: string, keyword: string | null) {
  if (NEGATIVE.test(sentence)) return false;
  const hasCommitment = COMMITMENT.test(sentence);
  const hasDelivery = DELIVERY.test(sentence);
  const hasResource = RESOURCE.test(sentence) || Boolean(keyword);
  const hasPartTwo = PART_TWO.test(sentence);
  const hasNext = NEXT_CONTENT.test(sentence);
  if (hasCommitment && (hasDelivery || hasResource || hasPartTwo || hasNext || keyword)) {
    return true;
  }
  if (keyword && hasDelivery) return true;
  if (hasPartTwo && (hasNext || hasCommitment || hasDelivery)) return true;
  return false;
}

function confidenceFor(sentence: string, keyword: string | null, dueAt: Date | null) {
  const strong =
    COMMITMENT.test(sentence) &&
    (DELIVERY.test(sentence) || Boolean(keyword)) &&
    (Boolean(dueAt) || Boolean(keyword) || PART_TWO.test(sentence));
  if (strong) return "high" as const;
  if (COMMITMENT.test(sentence)) return "medium" as const;
  return "low" as const;
}

export function extractPromiseCandidates(
  text: string,
  publishedAt: Date | null = null,
  now = new Date(),
): PromiseCandidate[] {
  const units = splitUnits(text);
  const seen = new Set<string>();
  const candidates: PromiseCandidate[] = [];

  for (const sentence of units) {
    const keywordMatch = sentence.match(COMMENT_KEYWORD);
    const keyword = keywordMatch?.[1] ?? null;
    if (!isPromiseLike(sentence, keyword)) continue;

    const quote = sentence.replace(/\s+/g, " ").slice(0, 500);
    const key = quote.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const { dueAt, reason } = inferRelativeDueDate(sentence, publishedAt, now);
    const promiseType = classifyType(sentence, keyword);

    candidates.push({
      evidenceQuote: quote,
      summary: summarize(sentence, promiseType, keyword),
      promiseType,
      dueAt: dueAt ? dueAt.toISOString() : null,
      confidence: confidenceFor(sentence, keyword, dueAt),
      reason,
    });
  }

  return candidates;
}
