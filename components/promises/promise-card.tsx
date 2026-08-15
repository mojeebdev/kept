import Link from "next/link";
import { StatusStamp } from "@/components/ui/status-stamp";
import { formatDate, platformLabel, typeLabel } from "@/lib/utils";
import type { PromiseDTO } from "@/lib/types";

export function PromiseCard({
  item,
  href,
  timezone = "Africa/Lagos",
}: {
  item: PromiseDTO;
  href: string;
  timezone?: string;
}) {
  return (
    <Link href={href} className="ticket block p-5 pl-7 transition hover:-translate-y-0.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <StatusStamp status={item.status} urgency={item.urgency} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          {item.source ? platformLabel(item.source.platform) : "Source"} · {typeLabel(item.promiseType)} ·{" "}
          {item.confidence}
        </p>
      </div>
      <blockquote className="mt-4 border-l-2 border-seal/40 pl-3 font-mono text-sm leading-6 text-ink">
        “{item.evidenceQuote}”
      </blockquote>
      <p className="mt-3 font-display text-xl leading-snug">{item.summary}</p>
      <p className="mt-3 text-sm text-ink-muted">
        {item.dueAt ? `Due ${formatDate(item.dueAt, timezone)}` : "No deadline inferred"}
      </p>
    </Link>
  );
}
