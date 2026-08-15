import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Quote, Upload } from "lucide-react";

const catches = [
  { quote: "I’ll send the template tomorrow.", label: "Template promised", tone: "Overdue" },
  { quote: "Part two is coming next week.", label: "Follow-up promised", tone: "Due next week" },
  { quote: "Comment GUIDE and I’ll share the link.", label: "Reply promised", tone: "Open" },
];

const steps = [
  { icon: Upload, number: "01", title: "Paste", body: "Add a post, thread, transcript, or comment. Kept only works with what you choose to bring in." },
  { icon: Quote, number: "02", title: "See the proof", body: "Kept flags a possible commitment and keeps the exact source excerpt attached for review." },
  { icon: BadgeCheck, number: "03", title: "Close the loop", body: "Edit the follow-up, copy it to the right place, then mark the promise kept when you post it." },
];

export function Landing() {
  return (
    <main>
      <section className="border-b-2 border-ink bg-[var(--surface-hero)]">
        <div className="kept-shell grid items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-ink">A private promise ledger for creators</p>
            <h1 className="mt-5 font-display text-[length:var(--text-display-hero)] leading-[var(--leading-display)] tracking-[var(--tracking-display)]">
              Keep the promises your content makes.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted">
              Paste posts, threads, transcripts, or comments. Kept keeps the evidence attached to every suggested follow-up, so you can make good on what you said.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/demo" className="button-primary">Try the live example <ArrowRight size={17} aria-hidden /></Link>
              <a href="#how-it-works" className="font-semibold underline decoration-2 underline-offset-4 hover:text-seal">See how it works</a>
            </div>
            <p className="mt-6 font-mono text-xs leading-5 text-ink-muted">No passwords, social credentials, or auto-posting.</p>
          </div>
          <div className="order-last lg:order-none">
            <Image src="/illustrations/hero-promise-relay.jpg" alt="An illustrated relay turns a source post into evidence, a follow-up draft, and a kept checkmark." width={1499} height={592} priority className="relay-art" />
          </div>
        </div>
      </section>

      <section aria-label="Promise relay" className="border-b border-ink bg-paper-raised">
        <div className="kept-shell grid grid-cols-4 gap-2 py-5 text-center font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] sm:gap-5 sm:text-xs">
          {["Post", "Proof", "Draft", "Kept"].map((label, index) => <div key={label} className="flex items-center justify-center gap-2"><span className={index === 3 ? "h-2 w-2 rounded-full bg-kept" : "h-2 w-2 rounded-full bg-signal"} aria-hidden />{label}</div>)}
        </div>
      </section>

      <section id="what-it-catches" className="bg-paper py-18 sm:py-24">
        <div className="kept-shell">
          <div className="max-w-2xl">
            <p className="eyebrow text-seal">Evidence, not guesswork</p>
            <h2 className="mt-4 font-display text-[length:var(--text-display-section)] leading-[var(--leading-heading)] tracking-[var(--tracking-display)]">What Kept catches</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {catches.map((item) => (
              <article key={item.quote} className="evidence-card flex min-h-60 flex-col justify-between p-6">
                <span className="eyebrow text-signal">{item.tone}</span>
                <blockquote className="my-7 font-mono text-base leading-7">“{item.quote}”</blockquote>
                <p className="border-t border-rule pt-4 text-sm font-semibold">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y-2 border-ink bg-[var(--surface-explainer)] py-18 sm:py-24">
        <div className="kept-shell">
          <p className="eyebrow">A calm way to follow through</p>
          <h2 className="mt-4 font-display text-[length:var(--text-display-section)] leading-[var(--leading-heading)] tracking-[var(--tracking-display)]">How it works</h2>
          <div className="mt-10 grid gap-5 min-[720px]:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, body }) => (
              <article key={title} className="surface-card p-6">
                <div className="flex items-start justify-between gap-4"><Icon size={30} strokeWidth={1.8} aria-hidden /><span className="eyebrow">{number}</span></div>
                <h3 className="mt-12 font-display text-4xl leading-none">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-ink-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-it-matters" className="bg-paper py-18 sm:py-24">
        <div className="kept-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div><p className="eyebrow text-seal">Why it matters</p><h2 className="mt-4 max-w-4xl font-display text-[length:var(--text-display-section)] leading-[var(--leading-heading)] tracking-[var(--tracking-display)]">Trust is built in the follow-through.</h2></div>
          <div><p className="max-w-md text-lg leading-8 text-ink-muted">Kept is not a social scheduler or auto-publisher. It gives you a private record of your public commitments, then helps you prepare the response you decide to post.</p><Link href="/auth/sign-in" className="button-secondary mt-6">Start a private ledger <ArrowRight size={17} aria-hidden /></Link></div>
        </div>
      </section>
    </main>
  );
}
