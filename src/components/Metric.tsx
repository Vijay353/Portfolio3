import type { Metric as MetricData } from "@/content/types";
import { cn } from "@/lib/cn";
import { isVisible } from "@/lib/review";
import { ReviewNote } from "./ReviewNote";

/** A number with its meaning. Never a bare number. */
export function Metric({ metric, size = "md", className }: { metric: MetricData; size?: "md" | "lg"; className?: string }) {
  if (!isVisible(metric)) return null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {metric.value ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-fg tabular-nums",
            size === "lg" ? "text-[2.25rem] leading-none md:text-[2.75rem]" : "text-[1.75rem] leading-none md:text-[2rem]",
          )}
        >
          {metric.value}
        </span>
      ) : null}
      <span className={cn("text-muted", metric.value ? "text-[0.9375rem] leading-snug" : "text-[1rem] leading-relaxed")}>
        {metric.label}
        {metric.verify ? <ReviewNote kind="verify">{metric.verify}</ReviewNote> : null}
      </span>
    </div>
  );
}
