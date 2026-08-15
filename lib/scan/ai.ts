import OpenAI from "openai";
import {
  normalizeCandidates,
  promiseCandidateListSchema,
  type PromiseCandidate,
} from "@/lib/scan/schema";

function configuredKey() {
  return process.env.AI_API_KEY || process.env.NVIDIA_API_KEY || process.env.XAI_API_KEY || "";
}

export function aiConfigured() {
  return Boolean(configuredKey());
}

function createClient() {
  const apiKey = configuredKey();
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_BASE_URL || "https://integrate.api.nvidia.com/v1",
  });
}

const SYSTEM = `You extract public creator-to-audience promises from posts or transcripts.
Return JSON only: {"candidates":[...]}.
Each candidate needs evidenceQuote, summary, promiseType, dueAt (ISO or null), confidence, reason.
promiseType must be one of: link, template, reply, part_two, resource, update, other.
confidence must be high, medium, or low.
evidenceQuote MUST be a verbatim substring of the source text.
Do not invent links, names, or commitments that are not in the text.
Do not treat "no promises" or mere opinions as commitments.
dueAt only when the text plus published date justify a calendar date.`;

export async function enrichWithAi(
  text: string,
  publishedAt: Date | null,
  deterministic: PromiseCandidate[],
): Promise<{ candidates: PromiseCandidate[]; used: boolean; warning?: string }> {
  const client = createClient();
  if (!client) {
    return { candidates: deterministic, used: false };
  }

  try {
    const model = process.env.AI_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b";
    const response = await client.chat.completions.create({
      model,
      temperature: 0.1,
      max_tokens: 2500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: JSON.stringify({
            publishedAt: publishedAt?.toISOString() ?? null,
            sourceText: text,
            deterministicCandidates: deterministic,
          }),
        },
      ],
    });

    const message = response.choices[0]?.message as {
      content?: string | null;
      reasoning_content?: string | null;
    };
    const raw =
      extractJsonObject(message?.content ?? "") ||
      extractJsonObject(message?.reasoning_content ?? "") ||
      extractJsonObject(`${message?.content ?? ""}\n${message?.reasoning_content ?? ""}`);
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      return {
        candidates: deterministic,
        used: false,
        warning: "AI analysis returned invalid structure. Using deterministic matches.",
      };
    }
    const parsed = promiseCandidateListSchema.safeParse(parsedJson);
    if (!parsed.success) {
      return {
        candidates: deterministic,
        used: false,
        warning: "AI analysis returned invalid structure. Using deterministic matches.",
      };
    }

    const merged = mergeCandidates(text, deterministic, normalizeCandidates(parsed.data, publishedAt));
    return { candidates: merged, used: true };
  } catch {
    return {
      candidates: deterministic,
      used: false,
      warning: "AI analysis was unavailable. Using deterministic matches.",
    };
  }
}

function mergeCandidates(
  source: string,
  base: PromiseCandidate[],
  extra: PromiseCandidate[],
) {
  const byQuote = new Map<string, PromiseCandidate>();
  for (const item of base) {
    byQuote.set(normalizeQuote(item.evidenceQuote), item);
  }

  for (const item of extra) {
    if (!source.includes(item.evidenceQuote.trim())) continue;
    const key = normalizeQuote(item.evidenceQuote);
    const existing = byQuote.get(key);
    if (!existing) {
      byQuote.set(key, item);
      continue;
    }
    byQuote.set(key, {
      ...existing,
      summary: item.summary || existing.summary,
      promiseType: existing.promiseType === "other" ? item.promiseType : existing.promiseType,
      dueAt: existing.dueAt ?? item.dueAt,
      reason: existing.reason,
    });
  }

  return [...byQuote.values()];
}

function normalizeQuote(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function extractJsonObject(value: string) {
  const start = value.lastIndexOf('{"candidates"');
  const slice = start >= 0 ? value.slice(start) : value.slice(value.indexOf("{"));
  if (!slice.startsWith("{")) return "";

  for (let end = slice.length; end > 1; end -= 1) {
    if (slice[end - 1] !== "}") continue;
    const candidate = slice.slice(0, end);
    try {
      const parsed = JSON.parse(candidate) as { candidates?: unknown };
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.candidates)) {
        return candidate;
      }
    } catch {
      // Trim until the JSON object is complete.
    }
  }
  return "";
}
