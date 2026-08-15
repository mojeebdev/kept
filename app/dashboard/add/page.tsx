import { AddWorkspace } from "@/components/content/add-workspace";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AddPage() {
  await requireUser();
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">Intake</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Add source text</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Paste one post or import a small archive. Kept stores the text you provide. It does
        not fetch, scrape, or sign into social platforms.
      </p>
      <div className="mt-8">
        <AddWorkspace />
      </div>
    </div>
  );
}
