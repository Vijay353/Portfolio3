import { site } from "@/content/site";
import { ArrowRight } from "./Icons";
import { EmailCopy } from "./EmailCopy";
import { SmartLink } from "./SmartLink";

/**
 * Connect: a decisive footer close. One sentence, one row of links, one primary CTA.
 * Links with no value are omitted; placeholders never appear in the main view.
 */
export function Contact() {
  const links = [
    site.linkedin ? { key: "LinkedIn", href: site.linkedin, track: "linkedin_click" as const } : null,
    site.github ? { key: "GitHub", href: site.github, track: "github_click" as const } : null,
    site.credly ? { key: "Credly", href: site.credly, track: undefined } : null,
  ].filter((l): l is { key: string; href: string; track: "linkedin_click" | "github_click" | undefined } => l !== null);

  const cta = site.email ? null : site.linkedin;

  return (
    <section aria-labelledby="contact-title" id="contact" className="scroll-mt-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="md:max-w-md">
          <h2 id="contact-title" className="font-serif text-[1.875rem] leading-[1.1] font-semibold tracking-tight text-fg md:text-[2.25rem]">
            Let's work together.
          </h2>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted">
            Open to high-leverage Solution Engineering, Product Management, and Technical Architecture roles where complex systems meet commercial outcomes.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[1rem]">
            {links.map((l, i) => (
              <li key={l.key} className="flex min-h-11 items-center gap-3">
                {i > 0 ? <span aria-hidden className="text-subtle">·</span> : null}
                <SmartLink href={l.href} track={l.track} trackLabel="contact" className="link">
                  {l.key}
                </SmartLink>
              </li>
            ))}
          </ul>

          {site.email ? <EmailCopy email={site.email} variant="cta" /> : null}
          {cta ? (
            <SmartLink href={cta} track="contact_click" trackLabel="contact" showExternalIcon={false} className="btn btn-primary group self-start md:self-end">
              Email me
              <ArrowRight className="nudge size-6" />
            </SmartLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
