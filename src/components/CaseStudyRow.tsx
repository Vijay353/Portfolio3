"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { ProjectEntry } from "@/content/types";
import { trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./Icons";

/**
 * Compact editorial row for a case study on /work: number · eyebrow · context, serif headline,
 * a two-line problem, and a right rail (metric, two tags, case study link), each shown only when filled.
 * When the entry has role or engagement details, the headline button (stretched over the row) expands it
 * in place; the parent keeps one row open at a time. On phones the collapsed row is number, title, and metric.
 */
export function CaseStudyRow({
  project,
  href,
  number,
  open,
  onToggle,
}: {
  project: ProjectEntry;
  /** Internal case study URL, or null when there is no long-form page. */
  href: string | null;
  /** Position in the list; `project.number` overrides it. */
  number: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const detailsRef = useRef<HTMLHeadingElement>(null);
  const focusOnOpen = useRef(false);
  const tags = (project.tags ?? project.capabilities ?? []).slice(0, 2);
  const metric = project.metric;
  const details = [
    project.role ? { term: "My role", text: project.role } : null,
    project.timeframe ? { term: "When", text: project.timeframe } : null,
    project.capabilities ? { term: "Capabilities", text: project.capabilities.join(" · ") } : null,
    project.stack ? { term: "Stack", text: project.stack.join(" · ") } : null,
    project.engagementDetails ? { term: "Details", text: project.engagementDetails } : null,
  ].filter((d): d is { term: string; text: string } => Boolean(d));
  const expandable = Boolean(project.role || project.engagementDetails || details.length);
  const isOpen = expandable && open;
  const railExtras = Boolean(tags.length || href);

  useEffect(() => {
    if (isOpen && focusOnOpen.current) detailsRef.current?.focus();
    focusOnOpen.current = false;
  }, [isOpen]);

  return (
    <article
      id={project.id}
      data-lens-item="true"
      data-lenses={project.lenses.join(" ")}
      className="group relative grid scroll-mt-12 gap-x-10 gap-y-3 border-t border-line py-5 md:grid-cols-12 md:py-6"
    >
      <div className="min-w-0 md:col-span-8">
        <p className="eyebrow mb-2 flex flex-wrap items-center gap-x-2 text-[0.75rem]">
          <span className="text-accent tabular-nums">{project.number ?? String(number).padStart(2, "0")}</span>
          <span aria-hidden>·</span>
          <span>{project.eyebrow}</span>
          {project.context ? (
            <>
              <span aria-hidden className="hidden sm:inline">·</span>
              <span className="hidden font-normal tracking-normal normal-case sm:inline">{project.context}</span>
            </>
          ) : null}
        </p>
        <h3 className="font-serif text-[1.25rem] leading-snug font-semibold tracking-tight text-fg md:text-[1.375rem]">
          {expandable ? (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => {
                if (!isOpen) focusOnOpen.current = true;
                onToggle();
              }}
              className="line-clamp-2 text-left decoration-accent decoration-1 underline-offset-[0.2em] group-hover:underline after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </button>
          ) : (
            <span className="line-clamp-2 decoration-accent decoration-1 underline-offset-[0.2em] group-hover:underline">{project.title}</span>
          )}
        </h3>
        {project.problem ? (
          <p
            className={cn(
              "mt-2 text-[0.9375rem] leading-relaxed text-muted",
              !expandable ? "md:line-clamp-2" : isOpen ? "block" : "hidden md:line-clamp-2",
            )}
          >
            <span className="sr-only">Problem: </span>
            {project.problem}
          </p>
        ) : null}
      </div>

      {metric || railExtras || expandable ? (
        <div className="flex min-w-0 items-start justify-between gap-4 md:col-span-4 md:border-l md:border-line md:pl-8">
          <div className="flex min-w-0 flex-col gap-2">
            {metric ? (
              <div className="flex flex-col gap-1">
                {metric.value ? (
                  <span className="font-serif text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums text-fg">
                    {metric.value}
                  </span>
                ) : null}
                {metric.note ? (
                  <span
                    className={cn(
                      "text-[0.875rem] leading-snug text-muted",
                      !isOpen && "line-clamp-2",
                      expandable && !isOpen && metric.value && "hidden md:block",
                    )}
                  >
                    {metric.note}
                  </span>
                ) : null}
              </div>
            ) : null}
            {railExtras ? (
              <div className={cn("flex-col gap-2", !expandable || isOpen ? "flex" : "hidden md:flex")}>
                {tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                    {tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {href ? (
                  <Link
                    href={href}
                    className="relative z-10 inline-flex min-h-11 w-fit items-center gap-1.5 text-[0.9375rem] font-semibold text-accent md:min-h-0"
                    {...trackAttrs("case_study_click", project.id)}
                  >
                    Read case study
                    <ArrowRight className="nudge size-4" />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          {expandable ? (
            <span
              aria-hidden
              className={cn(
                "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-transform duration-150 group-hover:border-fg group-hover:text-fg",
                isOpen && "rotate-180",
              )}
            >
              ↓
            </span>
          ) : null}
        </div>
      ) : null}

      {expandable ? (
        <div id={panelId} className="disclosure-panel relative z-10 md:col-span-12" data-open={isOpen} inert={!isOpen}>
          <div>
            <div className="grid gap-x-10 gap-y-3 pt-2 md:grid-cols-12">
              <h4 ref={detailsRef} tabIndex={-1} className="eyebrow text-[0.75rem] md:col-span-12">
                Engagement details
              </h4>
              <dl className="grid gap-x-4 gap-y-2 text-[0.9375rem] leading-relaxed sm:grid-cols-[7rem_1fr] md:col-span-8">
                {details.map((d) => (
                  <Detail key={d.term} term={d.term}>
                    {d.text}
                  </Detail>
                ))}
              </dl>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-[0.8125rem] font-semibold tracking-[0.06em] text-subtle uppercase sm:pt-[0.15rem]">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  );
}
