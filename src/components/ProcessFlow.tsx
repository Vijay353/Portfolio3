import type { ProcessFlow as Flow } from "@/content/types";
import { REVIEW_MODE } from "@/lib/review";
import { ReviewNote } from "./ReviewNote";

/**
 * A simple, readable flow: numbered steps in order, horizontal on wide screens,
 * vertical on phones. It is an ordered list, so screen readers get the sequence too.
 */
export function ProcessFlow({ flow, compact = false }: { flow: Flow; compact?: boolean }) {
  if (flow.verify && !REVIEW_MODE) return null;

  return (
    <figure className={compact ? "" : "rounded-xl border border-line bg-surface p-5 md:p-8"}>
      {!compact ? (
        <p className="eyebrow mb-5">
          {flow.title}
          {flow.verify ? <ReviewNote kind="verify">{flow.verify}</ReviewNote> : null}
        </p>
      ) : null}
      <ol
        className="grid gap-3 md:grid-flow-col md:auto-cols-fr md:gap-0"
        aria-label={flow.title}
      >
        {flow.steps.map((step, i) => (
          <li key={step.label} className="relative flex items-stretch md:flex-col">
            <div className="flex w-full items-start gap-3 rounded-lg border border-line bg-bg p-3.5 md:mr-6 md:flex-col md:gap-2 md:p-4">
              <span className="text-[0.75rem] font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-medium leading-snug text-fg">{step.label}</span>
                {step.detail ? <span className="mt-0.5 block text-[0.875rem] leading-snug text-subtle">{step.detail}</span> : null}
              </span>
            </div>
            {i < flow.steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-1/2 right-0 hidden h-px w-6 -translate-y-1/2 bg-line-strong md:block after:absolute after:right-0 after:-top-[3px] after:size-[7px] after:rotate-45 after:border-t after:border-r after:border-line-strong after:content-['']"
              />
            ) : null}
          </li>
        ))}
      </ol>
      {!compact ? <figcaption className="mt-5 max-w-[40rem] text-[0.9375rem] leading-relaxed text-muted">{flow.caption}</figcaption> : null}
    </figure>
  );
}
