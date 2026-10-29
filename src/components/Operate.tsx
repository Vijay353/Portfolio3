import Link from "next/link";
import { principles } from "@/content/profile";
import { ArrowRight } from "./Icons";

/**
 * My Journey: the long-form paragraphs. Left column of the lower split layout.
 * The end-to-end ownership sentence appears here and nowhere else on the site.
 */
export function About() {
  return (
    <section aria-labelledby="about-title" id="about" className="scroll-mt-20">
      <h2 id="about-title" className="mb-4 font-serif text-[1.625rem] leading-tight font-semibold tracking-tight text-fg md:text-[1.75rem]">
        My journey
      </h2>
      <div className="space-y-5 text-[1.125rem] leading-[1.6] text-muted">
        <p>
          FactSet taught me to work backward from what a client was seeing to what the system was actually doing.
          Configit put that to work in enterprise delivery for global manufacturers, and graduate study at Buffalo
          and fellowship work at Third Estate Ventures added the product side: research, UX, and analytics.
        </p>
        <p>
          It reads like three careers, but it's one skill used at different layers of the same problem. I treat enterprise problems with end-to-end ownership—from the first client discovery call to the final database transaction. Whether architecting solution blueprints for complex CPQ rollouts or leading cross-functional delivery, I focus on building reliable systems that scale long after the handoff.
        </p>
      </div>
    </section>
  );
}

/**
 * How I Operate: four principles as a numbered list of one-line titles.
 * Each principle's body and evidence link open on click via native details/summary.
 */
export function Operate() {
  return (
    <section aria-labelledby="operate-title" id="operate" className="scroll-mt-20">
      <h2 id="operate-title" className="mb-4 font-serif text-[1.625rem] leading-tight font-semibold tracking-tight text-fg md:text-[1.75rem]">
        How I operate
      </h2>
      <ol className="divide-y divide-line border-y border-line">
        {principles.map((p, i) => (
          <li key={p.title}>
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
                <span className="mono w-6 shrink-0 text-[0.75rem] text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[1.0625rem] leading-snug font-semibold tracking-tight text-fg">{p.title}</span>
                <span aria-hidden className="text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="pt-0.5 pb-3 pl-9">
                <p className="text-[1.0625rem] leading-relaxed text-muted">{p.body}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{p.vignette}</p>
                <Link
                  href={`/work/${p.evidence.slug}`}
                  className="group/ev mt-2 inline-flex min-h-8 items-center gap-1.5 text-[0.8125rem] font-medium text-accent"
                >
                  <span className="text-subtle">Evidence</span>
                  <ArrowRight className="nudge size-3" />
                  <span className="underline decoration-line-strong underline-offset-[0.2em] group-hover/ev:decoration-current">{p.evidence.label}</span>
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
