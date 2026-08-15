import { z } from "zod";
import { platforms, type Platform } from "@/lib/types";
import { parseFlexibleDate } from "@/lib/scan/dates";

export const contentInputSchema = z.object({
  body: z.string().trim().min(8, "Write at least a short post or transcript excerpt.").max(20000),
  platform: z.enum(platforms),
  publishedAt: z.string().nullable().optional(),
  sourceUrl: z
    .string()
    .trim()
    .url("Enter a full URL or leave this blank.")
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type ContentInput = z.infer<typeof contentInputSchema>;

export type CsvRowResult =
  | { ok: true; row: number; value: ContentInput }
  | { ok: false; row: number; error: string };

export function parseCsv(text: string): { header: string[]; rows: string[][] } {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  const pushCell = () => {
    row.push(current);
    current = "";
  };
  const pushRow = () => {
    pushCell();
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === ",") {
      pushCell();
      continue;
    }
    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      pushRow();
      continue;
    }
    current += char;
  }
  if (current.length > 0 || row.length > 0) pushRow();

  const header = (rows.shift() ?? []).map((cell) => cell.trim().toLowerCase());
  return { header, rows };
}

function normalizePlatform(value: string): Platform | null {
  const key = value.trim().toLowerCase();
  if (key === "twitter" || key === "x.com") return "x";
  if ((platforms as readonly string[]).includes(key)) return key as Platform;
  return null;
}

export function parseContentCsv(text: string): CsvRowResult[] {
  const { header, rows } = parseCsv(text);
  const bodyIndex = header.indexOf("body");
  if (bodyIndex === -1) {
    return [{ ok: false, row: 1, error: "CSV must include a body column." }];
  }
  const platformIndex = header.indexOf("platform");
  const publishedIndex = header.indexOf("published_at");
  const urlIndex = header.indexOf("source_url");

  return rows.map((cells, index) => {
    const rowNumber = index + 2;
    const platform = normalizePlatform(cells[platformIndex] ?? "other") ?? "other";
    const publishedRaw = publishedIndex >= 0 ? cells[publishedIndex]?.trim() || null : null;
    if (publishedRaw && !parseFlexibleDate(publishedRaw)) {
      return { ok: false, row: rowNumber, error: "published_at is not a valid date." };
    }
    const parsed = contentInputSchema.safeParse({
      body: cells[bodyIndex] ?? "",
      platform,
      publishedAt: publishedRaw,
      sourceUrl: urlIndex >= 0 ? cells[urlIndex] || "" : "",
    });
    if (!parsed.success) {
      return { ok: false, row: rowNumber, error: parsed.error.issues[0]?.message ?? "Invalid row." };
    }
    return { ok: true, row: rowNumber, value: parsed.data };
  });
}
