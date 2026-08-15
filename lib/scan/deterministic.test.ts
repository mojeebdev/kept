import { describe, expect, it } from "vitest";
import { extractPromiseCandidates } from "@/lib/scan/deterministic";

const published = new Date("2026-08-10T09:00:00.000Z");

describe("extractPromiseCandidates", () => {
  it("extracts a clear comment-and-send promise with tomorrow", () => {
    const result = extractPromiseCandidates(
      "Comment TEMPLATE and I'll send it tomorrow.",
      published,
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.evidenceQuote).toMatch(/Comment TEMPLATE/i);
    expect(result[0]?.summary.toLowerCase()).toContain("template");
    expect(result[0]?.promiseType).toBe("template");
    expect(result[0]?.dueAt).toBe("2026-08-11T00:00:00.000Z");
    expect(result[0]?.confidence).toBe("high");
  });

  it("returns nothing for a non-promise post", () => {
    const result = extractPromiseCandidates(
      "Really enjoyed the Q&A today. The comments were thoughtful.",
      published,
    );
    expect(result).toHaveLength(0);
  });

  it("keeps a no-date promise open without inventing a deadline", () => {
    const result = extractPromiseCandidates(
      "If you want the Notion board, comment GUIDE and I'll share the link.",
      published,
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.dueAt).toBeNull();
    expect(result[0]?.reason).toMatch(/no calendar deadline/i);
  });

  it("does not create a second identical candidate from the same quote", () => {
    const text = "Comment TEMPLATE and I'll send it tomorrow.";
    const first = extractPromiseCandidates(`${text} ${text}`, published);
    expect(first).toHaveLength(1);
  });

  it("skips negated or ambiguous non-commitments", () => {
    const result = extractPromiseCandidates(
      "The new episode is live. No promises beyond that.",
      published,
    );
    expect(result).toHaveLength(0);
  });
});
