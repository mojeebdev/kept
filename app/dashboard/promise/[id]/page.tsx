import Link from "next/link";
import { notFound } from "next/navigation";
import { PromiseDetail } from "@/components/promises/promise-detail";
import { requireUser } from "@/lib/auth/session";
import { getPromise } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function PromisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const promise = await getPromise(user.id, id, user.timezone);
  if (!promise) notFound();

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-ink-muted hover:text-ink">
        ← Ledger
      </Link>
      <div className="mt-6">
        <PromiseDetail promise={promise} timezone={user.timezone} />
      </div>
    </div>
  );
}
