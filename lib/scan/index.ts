import { extractPromiseCandidates } from "@/lib/scan/deterministic";
import { enrichWithAi } from "@/lib/scan/ai";
import type { PromiseCandidate } from "@/lib/scan/schema";
import type { ScanWarning } from "@/lib/types";

export async function scanSourceText(
  text: string,
  publishedAt: Date | null,
  options?: { useAi?: boolean },
): Promise<{
  candidates: PromiseCandidate[];
  engine: "deterministic" | "deterministic+ai";
  warnings: ScanWarning[];
}> {
  const deterministic = extractPromiseCandidates(text, publishedAt);
  const warnings: ScanWarning[] = [];

  if (options?.useAi === false) {
    if (deterministic.length === 0) {
      warnings.push({
        code: "none_found",
        message:
          "No promise debt found in this content. Kept looks for language like “I’ll”, “tomorrow”, “comment TEMPLATE”, “send”, “share”, or “next video”.",
      });
    }
    return { candidates: deterministic, engine: "deterministic", warnings };
  }

  const enriched = await enrichWithAi(text, publishedAt, deterministic);
  if (enriched.warning) {
    warnings.push({
      code: enriched.warning.includes("invalid") ? "ai_invalid" : "ai_unavailable",
      message: enriched.warning,
    });
  }
  if (enriched.candidates.length === 0) {
    warnings.push({
      code: "none_found",
      message:
        "No promise debt found in this content. Kept looks for language like “I’ll”, “tomorrow”, “comment TEMPLATE”, “send”, “share”, or “next video”.",
    });
  }

  return {
    candidates: enriched.candidates,
    engine: enriched.used ? "deterministic+ai" : "deterministic",
    warnings,
  };
}

export function sameEvidence(a: string, b: string) {
  return a.replace(/\s+/g, " ").trim().toLowerCase() === b.replace(/\s+/g, " ").trim().toLowerCase();
}
