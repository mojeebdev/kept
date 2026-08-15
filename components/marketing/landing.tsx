import Link from "next/link";

export function Landing() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-seal">
            Public promise debt
          </p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
            Your audience is still waiting.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-ink-muted">
            Creators lose trust through forgotten commitments, not missed posting slots.
            Kept turns the words you already published into a private ledger — then helps
            you write the follow-up that closes the loop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="bg-ink px-5 py-3 text-sm font-medium text-paper-raised hover:bg-seal"
            >
              Try the demo
            </Link>
            <Link
              href="/auth/sign-in"
              className="border border-ink px-5 py-3 text-sm font-medium hover:border-seal hover:text-seal"
            >
              Sign in to keep a ledger
            </Link>
          </div>
        </div>

        <aside className="ticket p-6 pl-8">
          <div className="flex items-center justify-between">
            <span className="stamp text-overdue">Overdue</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              Sample ticket
            </span>
          </div>
          <blockquote className="mt-5 border-l-2 border-overdue/50 pl-3 font-mono text-sm leading-6">
            “Comment TEMPLATE and I’ll send it tomorrow.”
          </blockquote>
          <p className="mt-4 font-display text-2xl leading-snug">
            Send the TEMPLATE to anyone who comments TEMPLATE
          </p>
          <p className="mt-3 text-sm text-ink-muted">Due two days ago · evidence from the original post</p>
        </aside>
      </section>

      <section className="border-y border-rule/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Paste what you already said",
              body: "Posts, transcripts, comment replies. Manual text or a small CSV. No social passwords. No scraping.",
            },
            {
              n: "02",
              title: "Scan for promise debt",
              body: "Kept highlights the exact quote, a plain-language action, and whether it is open, due, or overdue.",
            },
            {
              n: "03",
              title: "Write the follow-up and mark it kept",
              body: "Draft the reply, copy it, open X if you want, then record the promise as fulfilled. The ledger stays with your account.",
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="font-mono text-xs tracking-[0.18em] text-ink-muted">{step.n}</p>
              <h2 className="mt-2 font-display text-2xl">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl">A ledger, not another content machine.</h2>
            <p className="mt-4 max-w-md leading-7 text-ink-muted">
              Kept does not schedule posts, scrape accounts, or publish for you. It keeps the
              private record of what you already promised in public.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              "Google or magic-link sign-in. Same workspace on another phone.",
              "Deterministic scan works even if AI is offline.",
              "Evidence quote sits above any generated summary.",
              "Dismiss a false positive. Reopen anything you closed too soon.",
            ].map((item) => (
              <li key={item} className="border border-rule bg-paper-raised/70 p-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
