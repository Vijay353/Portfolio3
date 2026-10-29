import Image from "next/image";
import { certifications, courseCertificates, publications } from "@/content/credentials";
import { site } from "@/content/site";
import type { Credential } from "@/content/types";
import { resolvePublicImage } from "@/lib/assets";
import { SmartLink } from "./SmartLink";

/**
 * Education and credentials as two quiet groups: where you studied, then what you hold.
 * Proximity and whitespace do the grouping; rules are kept to a minimum.
 * Course certificates sit behind a disclosure so the main view stays short.
 */
export function Credentials() {
  return (
    <section aria-labelledby="credentials-title" className="md:self-start md:border-l md:border-line md:pl-10">
      <h3 id="credentials-title" className="sr-only">
        Education and credentials
      </h3>

      <div>
        <h4 className="eyebrow mb-2 text-[0.75rem]">Education</h4>
        <ul>
          {site.education.map((e, i) => (
            <li key={e.degree} className={"py-3 md:py-4" + (i > 0 ? " border-t border-line" : "")}>
              <div className="flex items-baseline justify-between gap-x-4">
                <p className="text-[1.0625rem] font-semibold tracking-tight text-fg">{e.school}</p>
                <span className="shrink-0 text-[0.875rem] text-subtle tabular-nums">{e.year}</span>
              </div>
              <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{e.degree}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7">
        <h4 className="eyebrow mb-2 text-[0.75rem]">Credentials</h4>
        <ul>
          {certifications.map((c) => (
            <li key={c.name} className="flex min-h-9 items-center py-2">
              <CredentialRow credential={c} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col items-start gap-3">
          {site.credly ? (
            <SmartLink href={site.credly} className="link inline-flex min-h-8 items-center text-[0.875rem] font-medium text-muted">
              View credentials
            </SmartLink>
          ) : null}

          <details className="group w-full text-[0.875rem]">
            <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-1.5 text-subtle [&::-webkit-details-marker]:hidden">
              Course certificates ({courseCertificates.length})
              <svg
                aria-hidden
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-open:rotate-180"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-2 text-[0.8125rem] text-subtle">LinkedIn Learning</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {courseCertificates.map((c) => (
                <li key={c.name}>
                  <SmartLink href={c.href} className="link text-muted" aria-label={`${c.name} certificate, LinkedIn Learning (opens in a new tab)`}>
                    {c.name}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      {publications.length ? (
        <div className="mt-6 text-[0.875rem]">
          <h4 className="mb-1.5 text-subtle">Publications & talks</h4>
          <ul className="space-y-1">
            {publications.map((p) => (
              <li key={p.title}>
                <SmartLink href={p.href} className="link text-muted">
                  {p.title}, {p.venue} · {p.year}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

/** A certification as a plain row title, with the badge image only when the file exists. */
function CredentialRow({ credential }: { credential: Credential }) {
  const badgeSrc = credential.badge ? resolvePublicImage(credential.badge.src) : null;
  const badge = badgeSrc && credential.badge ? { ...credential.badge, src: badgeSrc } : null;
  const inner = (
    <span className="flex items-center gap-3">
      {badge ? <Image src={badge.src} alt={badge.alt} width={28} height={28} className="size-7 rounded object-cover" /> : null}
      <span className="text-[0.9375rem] font-medium text-fg">{credential.name}</span>
    </span>
  );

  if (credential.href) {
    return (
      <SmartLink href={credential.href} className="link">
        {inner}
      </SmartLink>
    );
  }
  return inner;
}
