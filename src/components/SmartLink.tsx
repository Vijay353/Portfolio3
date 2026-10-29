import Link from "next/link";
import type { AnalyticsEvent } from "@/lib/analytics";
import { trackAttrs } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "./Icons";
import { ReviewNote } from "./ReviewNote";
import { REVIEW_MODE } from "@/lib/review";

interface SmartLinkProps {
  /** null = destination unknown. Renders the label with a [link pending] note in review mode, and nothing at all in production. */
  href: string | null;
  children: React.ReactNode;
  className?: string;
  track?: AnalyticsEvent;
  trackLabel?: string;
  /** Show the ↗ icon on external links (default true). */
  showExternalIcon?: boolean;
  download?: string;
  "aria-label"?: string;
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/**
 * One link component for internal, external, mailto and download links.
 * External links open in a new tab with safe rel attributes and announce that to screen readers.
 */
export function SmartLink({
  href,
  children,
  className,
  track,
  trackLabel,
  showExternalIcon = true,
  download,
  ...rest
}: SmartLinkProps) {
  if (!href) {
    if (!REVIEW_MODE) return null;
    return (
      <span className="text-subtle">
        {children}
        <ReviewNote kind="link" />
      </span>
    );
  }

  const attrs = track ? trackAttrs(track, trackLabel) : {};

  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("group inline-flex items-center gap-1", className)}
        aria-label={rest["aria-label"]}
        {...attrs}
      >
        {children}
        {showExternalIcon ? <ArrowUpRight className="nudge nudge-diag size-3.5 shrink-0 opacity-70" /> : null}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href.startsWith("mailto:") || download) {
    return (
      <a href={href} download={download} className={className} aria-label={rest["aria-label"]} {...attrs}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={rest["aria-label"]} {...attrs}>
      {children}
    </Link>
  );
}
