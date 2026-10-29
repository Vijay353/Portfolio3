"use client";

import { type ReactNode, useState } from "react";
import { featuredEntry, matchesLens, shortName } from "@/content/query";
import type { ArchiveGroup, ProjectEntry } from "@/content/types";
import type { WorkLensFilter } from "@/content/work-lenses";
import { cn } from "@/lib/cn";
import { ArchiveList } from "./ArchiveList";
import { CaseStudyRow } from "./CaseStudyRow";
import { SectionHeader } from "./SectionHeader";
import { WorkAgentCard } from "./WorkAgentCard";
import { WorkFilterBar, type WorkSort, useWorkLens } from "./WorkLens";

type CaseEntry = { project: ProjectEntry; href: string | null };
type SectionId = "applied-ai" | "case-studies" | "project-archive";

/**
 * The /work index: sticky filter bar, then Agents & Applied AI → Case studies → Archive.
 * Filtering never removes a section: one with no matches collapses to a hairline row with "show anyway".
 * Sorting reorders items inside a section; sections keep their narrative order.
 */
export function WorkIndex({
  agents,
  cases,
  archive,
}: {
  agents: ProjectEntry[];
  cases: CaseEntry[];
  archive: Array<{ group: ArchiveGroup; items: ProjectEntry[] }>;
}) {
  const { activeLens } = useWorkLens();
  const [sort, setSort] = useState<WorkSort>("quantified");
  const [forced, setForced] = useState<{ lens: WorkLensFilter; ids: SectionId[] }>({ lens: "all", ids: [] });
  const [openCase, setOpenCase] = useState<string | null>(null);

  const isForced = (id: SectionId) => forced.lens === activeLens && forced.ids.includes(id);
  const showAnyway = (id: SectionId) =>
    setForced((f) => ({ lens: activeLens, ids: f.lens === activeLens ? [...f.ids, id] : [id] }));

  const matchedAgents = agents.filter((a) => matchesLens(a, activeLens));
  const matchedCases = cases.filter((c) => matchesLens(c.project, activeLens));
  const archiveMatches = archive.flatMap((g) => g.items).filter((i) => matchesLens(i, activeLens)).length;

  const visibleAgents = sortAgents(isForced("applied-ai") ? agents : matchedAgents, sort);
  const visibleCases = sortCases(isForced("case-studies") ? cases : matchedCases, sort);
  const promote = activeLens === "agentic" && visibleAgents.length > 0;
  const lead = featuredEntry(visibleAgents);
  const rest = visibleAgents.filter((a) => a !== lead);

  const announcement = describe(activeLens, matchedAgents.length, matchedCases.length, archiveMatches);
  const nothing = activeLens !== "all" && !matchedAgents.length && !matchedCases.length && !archiveMatches;

  return (
    <>
      <WorkFilterBar sort={sort} onSort={setSort} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {nothing ? (
        <p className="container-page pt-10 text-center text-[0.9375rem] text-muted">Nothing in this slice. Try All.</p>
      ) : null}

      <LensSection
        id="applied-ai"
        labelId="ai-agents"
        name="Agents & Applied AI"
        count={matchedAgents.length}
        forced={isForced("applied-ai")}
        onShowAnyway={() => showAnyway("applied-ai")}
        header={
          <SectionHeader
            id="ai-agents"
            eyebrow="Agents & Applied AI"
            title="Agentic systems"
            intro="Each card leads with the problem and the engineering proof behind it. What is simulated is disclosed under Scope."
          />
        }
      >
        <div key={`${activeLens}-${sort}`} className="motion-safe:animate-[fade-in_150ms_ease-out]">
          {promote && lead ? (
            <div className="grid gap-6">
              <WorkAgentCard agent={lead} featured />
              {rest.length ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {rest.map((a) => (
                    <WorkAgentCard key={a.id} agent={a} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {visibleAgents.map((a) => (
                <WorkAgentCard key={a.id} agent={a} />
              ))}
            </div>
          )}
        </div>
      </LensSection>

      <LensSection
        id="case-studies"
        labelId="case-studies-title"
        name="Case studies"
        count={matchedCases.length}
        forced={isForced("case-studies")}
        onShowAnyway={() => showAnyway("case-studies")}
        header={
          <SectionHeader
            id="case-studies-title"
            eyebrow="Case studies"
            title="Delivery case studies"
            intro="Open a row for my role and the engagement details."
          />
        }
      >
        <div className="border-b border-line">
          {visibleCases.map((c, i) => (
            <CaseStudyRow
              key={c.project.id}
              project={c.project}
              href={c.href}
              number={i + 1}
              open={openCase === c.project.id}
              onToggle={() => setOpenCase((id) => (id === c.project.id ? null : c.project.id))}
            />
          ))}
        </div>
      </LensSection>

      <LensSection
        id="project-archive"
        labelId="archive-title"
        name="Archive"
        count={archiveMatches}
        forced={isForced("project-archive")}
        onShowAnyway={() => showAnyway("project-archive")}
        className="pb-16 md:pb-20"
        header={
          <SectionHeader
            id="archive-title"
            eyebrow="Archive"
            title="Earlier projects"
            intro="Coursework, prototypes, and case analyses, kept for reference."
          />
        }
      >
        <ArchiveList groups={archive} />
      </LensSection>
    </>
  );
}

/** A section that collapses to one hairline row when the active lens has no matches in it. */
function LensSection({
  id,
  labelId,
  name,
  count,
  forced,
  onShowAnyway,
  header,
  className,
  children,
}: {
  id: SectionId;
  labelId: string;
  name: string;
  count: number;
  forced: boolean;
  onShowAnyway: () => void;
  header: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { activeLens } = useWorkLens();
  const collapsed = activeLens !== "all" && count === 0 && !forced;

  if (collapsed) {
    return (
      <section id={id} aria-label={name} className="container-page scroll-mt-12 py-3">
        <p className="flex flex-wrap items-center gap-x-2 border-y border-line text-[0.875rem] text-subtle">
          <span>
            {name}: 0 matches
          </span>
          <span aria-hidden>·</span>
          <button type="button" onClick={onShowAnyway} className="link inline-flex min-h-11 items-center">
            show anyway <span aria-hidden>&nbsp;→</span>
          </button>
        </p>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={labelId}
      className={cn("container-page scroll-mt-12 py-10 md:py-14", className)}
    >
      {header}
      {children}
    </section>
  );
}

// ── Sorting ────────────────────────────────────────────────────────────────
// "Most quantified" counts numeric proof points; the featured card stays first. "Most recent" uses the
// latest year in the timeframe (items without dates keep their order). Array#sort is stable.

const numeric = (value?: string) => Boolean(value && /\d/.test(value));

function sortAgents(list: ProjectEntry[], sort: WorkSort): ProjectEntry[] {
  const out = [...list];
  if (sort === "az") return out.sort((a, b) => shortName(a).localeCompare(shortName(b)));
  if (sort === "quantified") {
    const score = (a: ProjectEntry) => (a.featured ? Infinity : (a.proofStack ?? []).filter((p) => numeric(p.value)).length);
    return out.sort((a, b) => score(b) - score(a));
  }
  return out.sort((a, b) => year(b.timeframe) - year(a.timeframe));
}

/** Latest year in a timeframe; "Present" sorts first, undated last. */
function year(timeframe?: string): number {
  if (!timeframe) return -1;
  if (/present/i.test(timeframe)) return Number.MAX_SAFE_INTEGER;
  return Math.max(...(timeframe.match(/\d{4}/g) ?? ["-1"]).map(Number));
}

function sortCases(list: CaseEntry[], sort: WorkSort): CaseEntry[] {
  const out = [...list];
  if (sort === "az") return out.sort((a, b) => a.project.eyebrow.localeCompare(b.project.eyebrow));
  if (sort === "quantified") {
    const score = ({ project: p }: CaseEntry) =>
      (p.caseStudy?.metrics ?? [{ label: "", value: p.metric?.value }]).filter((m) => !m.verify && numeric(m.value)).length;
    return out.sort((a, b) => score(b) - score(a));
  }
  return out.sort((a, b) => year(b.project.timeframe) - year(a.project.timeframe));
}

function describe(lens: WorkLensFilter, agents: number, cases: number, archive: number): string {
  if (lens === "all") return "Showing all work";
  const parts = [
    agents ? `${agents} agentic ${agents === 1 ? "system" : "systems"}` : "",
    cases ? `${cases} case ${cases === 1 ? "study" : "studies"}` : "",
    archive ? `${archive} archive ${archive === 1 ? "project" : "projects"}` : "",
  ].filter(Boolean);
  return parts.length ? `Showing ${parts.join(", ")}` : "Nothing in this slice. Try All.";
}
