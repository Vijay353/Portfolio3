import { heroFlows } from "@/content/profile";
import { site } from "@/content/site";
import type { Lens } from "@/content/types";
import { trackAttrs } from "@/lib/analytics";
import { resolvePublicImage } from "@/lib/assets";
import { heroSupport } from "@/lib/lens";
import { Headshot } from "./Headshot";
import { ArrowRight } from "./Icons";
import { ReviewNote } from "./ReviewNote";
import { SmartLink } from "./SmartLink";
import { SystemFlow } from "./SystemFlow";

/**
 * Hero answers one question: what does this person do?
 * Name → positioning → one sentence → actions. The system flow on the right shows
 * how that work moves from a need to an outcome; the proof strip below carries the numbers.
 */
export function Hero({ lens }: { lens: Lens }) {
  const hasPortrait = Boolean(resolvePublicImage(site.headshot.src));

  return (
    <section aria-labelledby="hero-name" className="container-page pt-7 pb-7 md:pt-10 md:pb-9 lg:pt-14">
      <div className="grid items-center gap-10 md:grid-cols-[1fr_20rem] lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="max-w-[40rem]">
          <div className="enter mb-6 flex items-center gap-4 md:gap-5">
            {hasPortrait ? (
              <Headshot
                className="size-[4.5rem] shrink-0 rounded-full ring-1 ring-line md:size-[6.5rem] lg:size-28"
                sizes="(min-width: 1024px) 112px, (min-width: 768px) 104px, 72px"
                preload
              />
            ) : null}
            <div className="min-w-0">
              <p className="eyebrow text-accent">{site.role}</p>
              <h1 id="hero-name" className="font-serif text-[2.625rem] leading-[1.05] font-semibold tracking-tight text-fg md:text-[3.5rem] lg:text-[3.75rem]">
                {site.name}
              </h1>
            </div>
            {!hasPortrait ? <ReviewNote kind="pending">Add public/images/headshot.jpg</ReviewNote> : null}
          </div>

          <p className="enter text-[1.375rem] leading-snug font-medium tracking-tight text-fg md:text-[1.625rem] lg:text-[1.75rem]" style={{ ["--enter-delay" as string]: "60ms" }}>
            {site.positioning}
          </p>

          <p className="enter mt-3 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-[1.125rem]" style={{ ["--enter-delay" as string]: "120ms" }}>
            {heroSupport[lens]}
          </p>

          <div className="enter mt-7 flex flex-wrap items-center gap-3" style={{ ["--enter-delay" as string]: "180ms" }}>
            <a href="#work" className="btn btn-primary group" {...trackAttrs("view_work_click", "hero")}>
              View work
              <ArrowRight className="nudge size-6" />
            </a>
            <SmartLink href={site.github} track="github_click" trackLabel="hero" className="btn btn-secondary">
              GitHub
            </SmartLink>
            <SmartLink href={site.linkedin} track="linkedin_click" trackLabel="hero" className="btn btn-secondary">
              LinkedIn
            </SmartLink>
          </div>
        </div>

        {/* On phones the proof strip follows immediately; the flow appears from tablet up. */}
        <div className="hidden md:block">
          <SystemFlow examples={heroFlows} />
        </div>
      </div>
    </section>
  );
}
