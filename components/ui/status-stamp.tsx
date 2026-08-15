import { cn } from "@/lib/utils";
import type { PromiseStatus, Urgency } from "@/lib/types";

export function statusLabel(status: PromiseStatus, urgency: Urgency) {
  if (status === "fulfilled") return "Kept";
  if (status === "dismissed") return "Dismissed";
  if (status === "drafted") return "Drafted";
  if (urgency === "overdue") return "Overdue";
  if (urgency === "due_today") return "Due today";
  return "Open";
}

export function StatusStamp({
  status,
  urgency,
}: {
  status: PromiseStatus;
  urgency: Urgency;
}) {
  const label = statusLabel(status, urgency);
  const tone =
    label === "Overdue"
      ? "text-overdue"
      : label === "Due today"
        ? "text-due"
        : label === "Kept"
          ? "text-kept"
          : label === "Drafted"
            ? "text-draft"
            : label === "Dismissed"
              ? "text-dismissed"
              : "text-open";

  return <span className={cn("stamp", tone)}>{label}</span>;
}
