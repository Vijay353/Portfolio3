import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudySection } from "@/components/CaseStudySection";
import { ArrowRight } from "@/components/Icons";
import { Metric } from "@/components/Metric";
import { ProcessFlow } from "@/components/ProcessFlow";
import { SmartLink } from "@/components/SmartLink";
import { getCaseStudyProjects, getProject } from "@/lib/content";
import { isVisible } from "@/lib/review";

/** Only published case studies get a route; anything else is a clean 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudyProjects().map((p) => ({ slug: p.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) return {};
  return {
    title: project.title,
    description: project.caseStudy.lede,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: "article", url: `/work/${slug}`, title: project.title, description: project.caseStudy.lede },
    twitter: { title: project.title, description: project.caseStudy.lede },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();

  const cs = project.caseStudy;
  const metrics = cs.metrics.filter(isVisible);
  const all = getCaseStudyProjects();
  const next = all[(all.findIndex((p) => p.id === slug) + 1) % all.length];
  const artifacts = (project.links ?? []).map((l) => ("repo" in l ? { label: l.label, href: l.repo } : l));

  return (
    <article>
      {/* Layer 2 opens with the outcome, not the technology. */}
      <header className="container-page pt-10 pb-10 md:pt-16 md:pb-14">
        <nav aria-label="Breadcrumb" className="mb-8 text-[0.875rem]">
          <Link href="/work" className="link text-subtle">
            Work
          </Link>
          <span aria-hidden className="mx-2 text-subtle">/</span>
          <span className="text-subtle" aria-current="page">{project.eyebrow}</span>
        </nav>

        <p className="eyebrow mb-3">
          {[project.eyebrow, project.context, project.timeframe].filter(Boolean).join("  ·  ")}
        </p>
        <h1 className="max-w-[48rem] font-serif text-[2.25rem] leading-[1.1] font-semibold tracking-tight text-fg md:text-[3.25rem]">
          {project.title}
        </h1>
        <p className="mt-6 max-w-[44rem] text-[1.1875rem] leading-relaxed text-muted md:text-[1.3125rem]">{cs.lede}</p>

        {metrics.length ? (
          <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 md:max-w-[48rem]">
            {metrics.map((m) => (
              <Metric key={m.label} metric={m} size="lg" />
            ))}
          </div>
        ) : null}

        <dl className="mt-10 grid gap-5 border-t border-line pt-8 text-[0.9375rem] sm:grid-cols-3">
          {project.role ? (
            <div>
              <dt className="eyebrow mb-1.5">Role</dt>
              <dd className="text-fg">{project.role}</dd>
            </div>
          ) : null}
          {project.timeframe ? (
            <div>
              <dt className="eyebrow mb-1.5">Timeline</dt>
              <dd className="text-fg">{project.timeframe}</dd>
            </div>
          ) : null}
          <div>
            <dt className="eyebrow mb-1.5">Tools</dt>
            <dd className="text-muted">{(project.stack ?? []).join(", ")}</dd>
          </div>
        </dl>
      </header>

      {cs.flow && isVisible(cs.flow) ? (
        <div className="container-page pb-6">
          <ProcessFlow flow={cs.flow} />
        </div>
      ) : null}

      <div className="container-page pb-6">
        {cs.sections.map((s) => (
          <CaseStudySection key={s.id} section={s} />
        ))}
      </div>

      {/* Layer 3: technical artifacts, one click away for those who want them. */}
      {artifacts.length ? (
        <section aria-labelledby="artifacts" className="container-page pb-10">
          <div className="grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-10">
            <h2 id="artifacts" className="font-serif text-[1.25rem] font-semibold text-fg md:col-span-3">
              Go deeper
            </h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-9">
              {artifacts.map((l) => (
                <li key={l.label}>
                  <SmartLink href={l.href} track="external_project_click" trackLabel={project.id} className="link">
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <nav aria-label="More work" className="border-t border-line bg-surface">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between md:py-14">
          <Link href="/work" className="link text-muted">
            All work
          </Link>
          {next && next.id !== slug ? (
            <Link href={`/work/${next.id}`} className="group text-right">
              <span className="eyebrow block">Next case study</span>
              <span className="mt-1 inline-flex items-center gap-2 font-serif text-[1.25rem] font-semibold text-fg group-hover:underline group-hover:underline-offset-4">
                {next.title}
                <ArrowRight className="nudge size-4 shrink-0 text-accent" />
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
