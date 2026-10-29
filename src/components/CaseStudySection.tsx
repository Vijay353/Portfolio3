import type { CaseSection } from "@/content/types";
import { REVIEW_MODE, visibleParas } from "@/lib/review";
import { ParaText } from "./Para";
import { ReviewNote } from "./ReviewNote";

/** Whether a section has anything to show (content, or a pending prompt in review mode). */
export function sectionIsVisible(section: CaseSection): boolean {
  const hasContent = visibleParas(section.body).length + visibleParas(section.bullets).length > 0;
  return hasContent || (REVIEW_MODE && Boolean(section.pending));
}

/** One narrative block of a case study. Sections without content are omitted in production. */
export function CaseStudySection({ section }: { section: CaseSection }) {
  const body = visibleParas(section.body);
  const bullets = visibleParas(section.bullets);
  if (!sectionIsVisible(section)) return null;

  return (
    <section aria-labelledby={`cs-${section.id}`} className="grid gap-3 border-t border-line bg-bg py-8 md:grid-cols-12 md:gap-10 md:py-10">
      
      <h2 id={`cs-${section.id}`} className="font-serif text-[1.25rem] font-semibold tracking-tight text-fg md:col-span-3 md:text-[1.375rem]">
        {section.heading}
      </h2>
      <div className="space-y-4 text-[1.0625rem] leading-[1.75] text-muted md:col-span-9 md:max-w-[42rem]">
        {body.map((p, i) => (
          <p key={i}>
            <ParaText para={p} />
          </p>
        ))}
        {bullets.length ? (
          <ul className="space-y-2.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-[0.8rem] h-px w-3 shrink-0 bg-accent" />
                <span>
                  <ParaText para={b} />
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {!body.length && !bullets.length && section.pending ? (
          <p>
            <ReviewNote kind="pending">{section.pending}</ReviewNote>
          </p>
        ) : null}
      </div>
    </section>
  );
}
