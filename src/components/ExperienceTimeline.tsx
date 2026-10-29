import Link from "next/link";
import { experience } from "@/content/experience";
import { caseStudyTitle } from "@/lib/content";
import { Disclosure } from "./Disclosure";
import { ArrowRight } from "./Icons";

/**
 * Compact career progression. Collapsed rows show organization, span and title progression
 * (Associate → Client Solutions Consultant); detail is one click away, never shown by default.
 */
export function ExperienceTimeline() {
  return (
    <ol className="relative">
      {experience.map((entry, i) => {
        const related = entry.relatedSlug ? caseStudyTitle(entry.relatedSlug) : null;
        const last = i === experience.length - 1;
        return (
          <li key={entry.organization} className="relative grid grid-cols-[1.25rem_1fr] gap-x-3 md:gap-x-5">
            {/* rail */}
            <span aria-hidden className="relative flex justify-center">
              <span
                className={
                  "relative z-10 mt-[1.2rem] size-2.5 rounded-full border-2 md:mt-[1.45rem] " +
                  (entry.current ? "border-accent bg-accent" : "border-line-strong bg-surface")
                }
              />
              {!last ? <span className="absolute top-[1.85rem] bottom-[-1.55rem] w-px bg-line-strong md:top-[2.1rem] md:bottom-[-1.8rem]" /> : null}
            </span>

            <Disclosure
              className="border-b border-line"
              header={
                <span className="grid gap-1 md:grid-cols-[1fr_auto] md:items-baseline md:gap-x-6">
                  <span className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">{entry.organization}</span>
                    {entry.current ? <span className="mono text-[0.6875rem] tracking-[0.08em] text-accent uppercase">Now</span> : null}
                  </span>
                  <span className="text-[0.875rem] text-subtle tabular-nums md:row-span-2 md:text-right">{entry.span}</span>
                  <span className="text-[0.9375rem] leading-snug text-muted">
                    {entry.roles.map((r, ri) => (
                      <span key={r.title}>
                        {ri > 0 ? (
                          <>
                            <span aria-hidden className="mx-1.5 text-subtle">→</span>
                            <span className="sr-only">, then </span>
                          </>
                        ) : null}
                        {r.title}
                      </span>
                    ))}
                  </span>
                </span>
              }
            >
              <div className="pb-5 text-[0.9375rem] md:pr-11">
                <p className="max-w-[42rem] leading-relaxed text-muted">{entry.summary}</p>
                {entry.roles.length > 1 ? (
                  <ul className="mt-3 space-y-0.5 text-[0.875rem] text-subtle">
                    {entry.roles.map((r) => (
                      <li key={r.title} className="flex flex-wrap gap-x-2">
                        <span className="text-muted">{r.title}</span>
                        <span className="tabular-nums">· {r.dates}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <ul className="flex flex-wrap gap-1.5" aria-label="Tools and methods">
                    {entry.highlights.map((h) => (
                      <li key={h} className="chip">
                        {h}
                      </li>
                    ))}
                  </ul>
                  {related && entry.relatedSlug ? (
                    <Link href={`/work/${entry.relatedSlug}`} className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-accent">
                      Related work <ArrowRight className="nudge size-3.5" />
                      <span className="sr-only">: {related}</span>
                    </Link>
                  ) : null}
                </div>
                <p className="mt-3 text-[0.8125rem] text-subtle">{entry.location}</p>
              </div>
            </Disclosure>
          </li>
        );
      })}
    </ol>
  );
}
