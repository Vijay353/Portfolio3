"use client";

import Link from "next/link";
import { useState } from "react";
import type { HeroFlowExample } from "@/content/types";
import { trackAttrs } from "@/lib/analytics";
import { ArrowRight } from "./Icons";

const STEPS = [
  { key: "need", label: "Need" },
  { key: "decision", label: "Decision" },
  { key: "system", label: "System" },
  { key: "outcome", label: "Outcome" },
] as const;

/**
 * Hero visual: Need → Decision → System → Outcome, filled with a real example.
 * Fully readable when static. Motion is one staggered entrance plus a soft fade
 * when the visitor chooses another example. Nothing loops or runs on its own.
 */
export function SystemFlow({ examples }: { examples: HeroFlowExample[] }) {
  const [activeId, setActiveId] = useState(examples[0]?.id);
  const active = examples.find((e) => e.id === activeId) ?? examples[0];
  if (!active) return null;

  return (
    <figure className="rounded-2xl border border-line bg-surface p-5 lg:p-6" aria-labelledby="flow-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <figcaption id="flow-title" className="eyebrow">
          How a problem moves
        </figcaption>
        <div role="group" aria-label="Example" className="flex rounded-md border border-line p-0.5">
          {examples.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={e.id === active.id}
              onClick={() => setActiveId(e.id)}
              className="min-h-8 rounded-[0.3rem] px-2.5 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg aria-pressed:bg-accent-soft aria-pressed:font-semibold aria-pressed:text-fg"
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
      <ol key={active.id} className="relative flow-swap">
        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={step.key} className="flow-step relative grid grid-cols-[1.25rem_1fr] gap-x-3 pb-4 last:pb-0" style={{ ["--i" as string]: i }}>
              {/* node + connector */}
              <span aria-hidden className="relative flex justify-center">
                <span
                  className={
                    "relative z-10 mt-[0.3rem] size-2.5 rounded-full border-2 " +
                    (last ? "border-accent bg-accent" : "border-accent bg-surface")
                  }
                />
                {!last ? <span className="absolute top-[0.9rem] bottom-[-0.35rem] w-px bg-line-strong" /> : null}
              </span>
              <span>
                <span className="mono block text-[0.75rem] tracking-[0.08em] text-subtle uppercase">{step.label}</span>
                <span className={"mt-0.5 block text-[0.9375rem] leading-snug " + (last ? "font-semibold text-fg" : "text-fg")}>{active[step.key]}</span>
              </span>
            </li>
          );
        })}
      </ol>
      </div>

      <Link
        href={`/work/${active.slug}`}
        className="group mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-accent"
        {...trackAttrs("case_study_click", `hero_flow_${active.id}`)}
      >
        See the case study <ArrowRight className="nudge size-3.5" />
      </Link>
    </figure>
  );
}
