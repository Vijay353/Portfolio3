"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { HeroFlowExample } from "@/content/types";
import { trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./Icons";

const STEPS = [
  { key: "need", label: "Need" },
  { key: "decision", label: "Decision" },
  { key: "system", label: "System" },
  { key: "outcome", label: "Outcome" },
] as const;

/** Systems with a hover/tap explanation. Other names in a system row render as plain text. */
const NODE_COPY: Record<string, string> = {
  Salesforce: "Opportunity & account hierarchy; triggers CPQ configuration session.",
  "Configit CPQ": "Deterministic rules engine enforcing engineering valid BOM constraints.",
  "SAP ERP": "Sales order generation, materials planning, and billing schedule creation.",
};

/**
 * Hero visual: Need → Decision → System → Outcome, filled with a real example.
 * Switching examples animates the pill and the stepper contents. Reduced motion
 * swaps instantly. Nothing loops or runs on its own.
 */
export function SystemFlow({ examples }: { examples: HeroFlowExample[] }) {
  const [activeId, setActiveId] = useState(examples[0]?.id);
  const active = examples.find((e) => e.id === activeId) ?? examples[0];
  const reduced = useReducedMotion();
  if (!active) return null;

  const fade = reduced
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <figure className="rounded-2xl border border-line bg-surface p-5 lg:p-6" aria-labelledby="flow-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <figcaption id="flow-title" className="eyebrow">
          How a problem moves
        </figcaption>
        <div role="group" aria-label="Example" className="flex rounded-md border border-line p-0.5">
          {examples.map((e) => {
            const selected = e.id === active.id;
            return (
              <button
                key={e.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(e.id)}
                className={cn(
                  "relative min-h-8 rounded-[0.3rem] px-2.5 text-[0.8125rem] font-medium transition-colors hover:text-fg",
                  selected ? "font-semibold text-fg" : "text-muted",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="flow-tab-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-[0.3rem] bg-accent-soft"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
                <span className="relative">{e.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={active.id}
            className="relative"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={fade}
          >
            {STEPS.map((step, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li key={step.key} className="relative grid grid-cols-[1.25rem_1fr] gap-x-3 pb-4 last:pb-0">
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
                    <span className={"mt-0.5 block text-[0.9375rem] leading-snug " + (last ? "font-semibold text-fg" : "text-fg")}>
                      {step.key === "system" ? <SystemNodes text={active.system} /> : active[step.key]}
                    </span>
                  </span>
                </li>
              );
            })}
          </motion.ol>
        </AnimatePresence>
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

/** Splits "A · B · C" into names; known systems get an explanatory popover. */
function SystemNodes({ text }: { text: string }) {
  return (
    <>
      {text.split(" · ").map((name, i) => (
        <span key={`${name}-${i}`}>
          {i > 0 ? <span aria-hidden> · </span> : null}
          {NODE_COPY[name] ? <SystemNode name={name} copy={NODE_COPY[name]} /> : name}
        </span>
      ))}
    </>
  );
}

/**
 * Hover (mouse), focus (keyboard) or tap (touch) opens the note; hover-out, blur,
 * a second tap or Escape dismisses it. The note exists in the DOM only while open,
 * so aria-describedby points at it only then.
 */
function SystemNode({ name, copy }: { name: string; copy: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const lastPointer = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span
      className="relative inline-block"
      onPointerDown={(e) => {
        lastPointer.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onFocus={() => {
          if (lastPointer.current !== "touch") setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (lastPointer.current === "touch") setOpen((o) => !o);
        }}
        className="cursor-help rounded-sm underline decoration-dotted decoration-line-strong underline-offset-[0.25em] transition-colors hover:decoration-accent"
      >
        {name}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-20 mt-2 block w-[min(17rem,calc(100vw-3rem))] rounded-lg border border-line-strong bg-surface p-3 text-[0.8125rem] leading-snug font-normal text-muted shadow-lg"
          >
            {copy}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
