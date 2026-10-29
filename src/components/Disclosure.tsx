"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AnalyticsEvent } from "@/lib/analytics";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Accordion-style disclosure: a heading containing one button (the whole visible row),
 * and a panel that is `inert` while closed so hidden links can't receive focus.
 * Height animates via CSS grid rows; reduced-motion makes it instant.
 */
export function Disclosure({
  header,
  children,
  headingLevel = 3,
  className,
  analyticsEvent,
  analyticsLabel,
  archiveGroup,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  headingLevel?: 3 | 4;
  className?: string;
  analyticsEvent?: AnalyticsEvent;
  analyticsLabel?: string;
  archiveGroup?: string;
}) {
  const [open, setOpen] = useState(false);
  const pendingArchiveTarget = useRef<string | null>(null);
  const panelId = useId();
  const Heading = `h${headingLevel}` as "h3" | "h4";

  useEffect(() => {
    if (!archiveGroup) return;
    const handleArchiveOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ group: string; targetId: string }>).detail;
      if (detail.group !== archiveGroup) return;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (open) {
        document.getElementById(detail.targetId)?.scrollIntoView({ behavior, block: "center" });
        return;
      }
      pendingArchiveTarget.current = detail.targetId;
      setOpen(true);
      if (analyticsEvent) track(analyticsEvent, { label: analyticsLabel });
    };
    window.addEventListener("work-archive-open", handleArchiveOpen);
    return () => window.removeEventListener("work-archive-open", handleArchiveOpen);
  }, [analyticsEvent, analyticsLabel, archiveGroup, open]);

  useEffect(() => {
    if (!open || !pendingArchiveTarget.current) return;
    const targetId = pendingArchiveTarget.current;
    pendingArchiveTarget.current = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, reducedMotion ? 0 : 240);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className={className}>
      <Heading className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next && analyticsEvent) track(analyticsEvent, { label: analyticsLabel });
          }}
          className="group flex w-full items-start gap-4 rounded-md py-4 text-left md:py-5"
        >
          <span className="min-w-0 flex-1">{header}</span>
          <span
            aria-hidden
            className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-colors group-hover:border-fg group-hover:text-fg"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 6h8" />
              <path d="M6 2v8" className={cn("origin-center transition-transform duration-200", open && "scale-y-0")} />
            </svg>
          </span>
        </button>
      </Heading>
      <div id={panelId} className="disclosure-panel" data-open={open} inert={!open}>
        <div>{children}</div>
      </div>
    </div>
  );
}
