const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function dateKeyInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addCalendarDays(date: Date, days: number) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parseFlexibleDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  const dateOnly = DATE_ONLY.exec(trimmed);
  if (dateOnly) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export type DerivedUrgency = "overdue" | "due_today" | "none";

export function deriveUrgency(
  status: string,
  dueAt: Date | string | null | undefined,
  timeZone = "Africa/Lagos",
  now = new Date(),
): DerivedUrgency {
  if (status !== "open") return "none";
  const due = parseFlexibleDate(dueAt ?? null);
  if (!due) return "none";
  const today = dateKeyInTimeZone(now, timeZone);
  const dueKey = dateKeyInTimeZone(due, timeZone);
  if (dueKey < today) return "overdue";
  if (dueKey === today) return "due_today";
  return "none";
}

export function inferRelativeDueDate(
  text: string,
  publishedAt: Date | null,
  now = new Date(),
): { dueAt: Date | null; reason: string } {
  const base = publishedAt ?? now;
  const lower = text.toLowerCase();

  if (/\btomorrow\b/.test(lower)) {
    return { dueAt: addCalendarDays(startOfUtcDay(base), 1), reason: "Inferred from “tomorrow”." };
  }
  if (/\btonight\b/.test(lower) || /\btoday\b/.test(lower)) {
    return { dueAt: startOfUtcDay(base), reason: "Inferred from “today/tonight”." };
  }
  if (/\bnext week\b/.test(lower)) {
    return { dueAt: addCalendarDays(startOfUtcDay(base), 7), reason: "Inferred from “next week”." };
  }

  return {
    dueAt: null,
    reason: "No calendar deadline inferred.",
  };
}
