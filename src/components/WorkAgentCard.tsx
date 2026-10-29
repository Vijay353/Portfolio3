"use client";

import Link from "next/link";
import { type ReactNode, useId, useState } from "react";
import { shortName } from "@/content/query";
import type { ArchNode, Glimpse, LinkSpec, ProjectEntry, ProofMetric } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Project card for the /work grid, composed from whichever slots the entry fills: a full agent
 * (proof stack, architecture, before → after, scope note) or a simple project (a glimpse and a link).
 * Two densities: compact (2-column grid) and featured (60/40 split under the "Agentic systems" filter).
 * Proof numerals are static. Empty slots render nothing, and the expand control appears only when
 * there is something behind it.
 */
export function WorkAgentCard({ agent, featured = false }: { agent: ProjectEntry; featured?: boolean }) {
  return featured ? <FeaturedAgent agent={agent} /> : <CompactAgent agent={agent} />;
}

/** What the compact card keeps behind "Architecture, impact & scope". */
function hiddenParts(agent: ProjectEntry) {
  const parts = [
    agent.architecture ? "architecture" : null,
    agent.beforeAfter ? "impact" : null,
    agent.honestyLine ? "scope" : null,
  ].filter((p): p is string => Boolean(p));
  const label = parts.length
    ? (parts.length > 1 ? `${parts.slice(0, -1).join(", ")} & ${parts[parts.length - 1]}` : parts[0]).replace(/^./, (c) => c.toUpperCase())
    : "Details";
  const has = Boolean(parts.length || (agent.problem && agent.positioning) || agent.proofStack?.some((p) => p.detail));
  return { has, label };
}

function CompactAgent({ agent }: { agent: ProjectEntry }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const tagline = agent.title.split(": ")[1];
  const hidden = hiddenParts(agent);
  const lead = agent.problem ?? agent.positioning;

  return (
    <article
      id={agent.id}
      data-lens-item="true"
      data-lenses={agent.lenses.join(" ")}
      className="group flex min-w-0 scroll-mt-12 flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong md:p-6"
    >
      <p className="eyebrow text-[0.75rem]">{agent.eyebrow}</p>
      <h3 className="mt-2 font-serif text-[1.25rem] leading-snug font-semibold tracking-tight text-fg">
        <span className="decoration-accent decoration-1 underline-offset-4 group-hover:underline">{shortName(agent)}</span>
        {tagline ? <span className="font-normal text-muted">: {tagline}</span> : null}
      </h3>

      {lead ? (
        <p className={cn("mt-3 text-[0.9375rem] leading-relaxed text-muted", agent.problem && hidden.has && !open && "line-clamp-2")}>
          {agent.problem ? <span className="sr-only">Problem: </span> : null}
          {lead}
        </p>
      ) : null}

      {agent.glimpse ? <GlimpseFrame glimpse={agent.glimpse} className="mt-4" /> : null}

      {/* Metric stack: never collapses. */}
      {agent.proofStack ? <ProofList proof={agent.proofStack} showDetail={open} className="mt-4" /> : null}

      {agent.stack ? <StackTags stack={agent.stack} className="mt-4" /> : null}

      {hidden.has || agent.links ? (
        <div className="mt-auto pt-4">
          {hidden.has ? (
            <div id={panelId} hidden={!open} className="motion-safe:animate-[fade-in_150ms_ease-out]">
              <div>
                <div className="mb-3 space-y-4 border-t border-line pt-3">
                  {agent.problem && agent.positioning ? (
                    <p className="text-[0.9375rem] leading-relaxed text-fg">{agent.positioning}</p>
                  ) : null}
                  {agent.architecture ? (
                    <div>
                      <p className="eyebrow mb-2 text-[0.75rem]">Architecture</p>
                      <NodeFlow nodes={agent.architecture} />
                    </div>
                  ) : null}
                  {agent.beforeAfter ? (
                    <div>
                      <p className="eyebrow mb-2 text-[0.75rem]">Before → After</p>
                      <BeforeAfter {...agent.beforeAfter} size="sm" />
                    </div>
                  ) : null}
                  {agent.honestyLine ? <ScopeNote text={agent.honestyLine} /> : null}
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-1">
            {agent.links ? <Actions links={agent.links} /> : null}
            {hidden.has ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex min-h-11 items-center gap-1.5 text-[0.875rem] font-semibold text-accent"
              >
                {open ? "Less" : hidden.label}
                <span aria-hidden className={cn("inline-block transition-transform duration-150", open && "rotate-180")}>
                  ↓
                </span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/** Promote-on-filter state: 60/40 split, story and actions left, "The proof" right. Single column when there is no proof or visual. */
function FeaturedAgent({ agent }: { agent: ProjectEntry }) {
  const hasProof = Boolean(agent.proofStack || agent.architecture || agent.beforeAfter);
  const hasPanel = hasProof || Boolean(agent.glimpse);

  return (
    <article
      id={agent.id}
      data-lens-item="true"
      data-lenses={agent.lenses.join(" ")}
      className="group scroll-mt-12 rounded-xl border border-line bg-surface p-6 transition-colors hover:border-line-strong md:p-10"
    >
      <div className={cn("grid gap-y-8", hasPanel && "md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] md:gap-x-12")}>
        <div className="flex min-w-0 flex-col gap-5">
          <p className="eyebrow text-[0.75rem]">{agent.eyebrow}</p>
          <h3 className="font-serif text-[1.75rem] leading-[1.15] font-semibold tracking-tight text-balance text-fg md:text-[2.25rem]">
            <span className="decoration-accent decoration-2 underline-offset-[0.2em] group-hover:underline">{agent.title}</span>
          </h3>
          {agent.positioning ? <p className="text-[1.0625rem] leading-relaxed text-fg">{agent.positioning}</p> : null}
          {agent.problem ? (
            <div>
              <p className="eyebrow mb-1.5 text-[0.75rem]">The problem</p>
              <p className="leading-relaxed text-muted">{agent.problem}</p>
            </div>
          ) : null}
          {agent.stack ? <StackTags stack={agent.stack} /> : null}
          {agent.links ? <Actions links={agent.links} /> : null}
          {agent.honestyLine ? <ScopeNote text={agent.honestyLine} className="border-t border-line pt-4" /> : null}
        </div>

        {hasPanel ? (
          <div className="flex min-w-0 flex-col gap-6 rounded-lg border border-line bg-bg p-5 md:p-6">
            {agent.glimpse ? <GlimpseFrame glimpse={agent.glimpse} /> : null}
            {hasProof ? <p className="eyebrow text-[0.75rem]">The proof</p> : null}
            {agent.proofStack ? <ProofList proof={agent.proofStack} showDetail size="lg" /> : null}
            {agent.architecture ? (
              <Slot title="Architecture" className="border-t border-line pt-5">
                <NodeFlow nodes={agent.architecture} vertical />
              </Slot>
            ) : null}
            {agent.beforeAfter ? (
              <Slot title="Before → After" className="border-t border-line pt-5">
                <BeforeAfter {...agent.beforeAfter} />
              </Slot>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ProofList({
  proof,
  showDetail,
  size = "md",
  className,
}: {
  proof: ProofMetric[];
  showDetail: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <ul aria-label="Proof" className={cn("divide-y divide-line", size === "md" && "border-y border-line", className)}>
      {proof.map((p) =>
        size === "lg" ? (
          <li key={p.caption} className="py-4 first:pt-0 last:pb-0">
            <p className="font-serif text-[2.25rem] leading-none font-semibold tracking-tight tabular-nums text-fg md:text-[2.5rem]">
              {p.value}
            </p>
            <p className="mt-2 text-[0.9375rem] leading-snug text-muted">
              {p.caption}
              {showDetail && p.detail ? <span className="text-subtle"> ({p.detail})</span> : null}
            </p>
          </li>
        ) : (
          <li key={p.caption} className="grid grid-cols-[minmax(5.5rem,auto)_1fr] items-baseline gap-x-4 py-2">
            <span className="font-serif text-[1.5rem] leading-none font-semibold tracking-tight tabular-nums text-fg">{p.value}</span>
            <span className="text-[0.875rem] leading-snug text-muted">
              {p.caption}
              {showDetail && p.detail ? <span className="text-subtle"> ({p.detail})</span> : null}
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

const VIDEO = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
const ASPECT: Record<NonNullable<Glimpse["aspect"]>, string> = { "16:9": "aspect-video", "4:3": "aspect-[4/3]", "1:1": "aspect-square" };

/**
 * A still or a short loop in the existing hairline frame. Video never autoplays and is muted:
 * it waits for the visitor to press play, so reduced-motion preferences are respected by default.
 */
function GlimpseFrame({ glimpse, className }: { glimpse: Glimpse; className?: string }) {
  const video = glimpse.type === "loop" || (glimpse.type !== "image" && VIDEO.test(glimpse.src));
  return (
    <figure className={cn("min-w-0", className)}>
      <div className={cn("overflow-hidden rounded-lg border border-line bg-bg", ASPECT[glimpse.aspect ?? "16:9"])}>
        {video ? (
          <video src={glimpse.src} aria-label={glimpse.alt} muted loop playsInline controls preload="metadata" className="size-full object-cover" />
        ) : (
          // Plain <img>: works for local files and verified remote URLs without image-loader config.
          <img src={glimpse.src} alt={glimpse.alt} loading="lazy" className="size-full object-cover" />
        )}
      </div>
      {glimpse.caption ? <figcaption className="mt-2 text-[0.8125rem] leading-snug text-subtle">{glimpse.caption}</figcaption> : null}
    </figure>
  );
}

/**
 * Hairline architecture micro-diagram: pill nodes, mono labels. Static; a node with a tooltip shows it on
 * hover or focus. Wraps horizontally on wide cards, stacks vertically on phones.
 */
function NodeFlow({ nodes, vertical = false }: { nodes: ArchNode[]; vertical?: boolean }) {
  return (
    <ol aria-label="Architecture" className={cn("flex flex-col", !vertical && "md:flex-row md:flex-wrap md:items-center md:gap-y-2")}>
      {nodes.map((node, i) => (
        <li key={node.label} className={cn("flex flex-col", !vertical && "md:flex-row md:items-center")}>
          <Node node={node} />
          {i < nodes.length - 1 ? (
            <span
              aria-hidden
              className={cn("ml-[0.9375rem] h-3 w-px bg-line-strong", !vertical && "md:ml-0 md:h-px md:w-2.5")}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function Node({ node }: { node: ArchNode }) {
  const tipId = useId();
  const pill = "relative inline-flex w-fit items-center gap-2 rounded-full border border-line-strong bg-surface px-3 py-1 text-fg";
  const label = (
    <>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
      <span className="mono text-[0.75rem] leading-tight">{node.label}</span>
    </>
  );
  if (!node.tooltip) return <span className={pill}>{label}</span>;
  return (
    <span tabIndex={0} aria-describedby={tipId} className={cn("group/node", pill)}>
      {label}
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-10 mt-2 hidden w-max max-w-[16rem] rounded-md border border-line bg-surface px-2.5 py-1.5 text-[0.8125rem] leading-snug text-muted shadow-[0_8px_24px_-18px_rgb(0_0_0/0.35)] group-hover/node:block group-focus/node:block"
      >
        {node.tooltip}
      </span>
    </span>
  );
}

function BeforeAfter({ before, after, size = "md" }: { before: string; after: string; size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-[0.8125rem]" : "text-[0.875rem]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn("rounded-full border border-line bg-surface px-3 py-1 text-muted", text)}>{before}</span>
      <span aria-hidden className="text-subtle">
        →
      </span>
      <span className="sr-only">became</span>
      <span className={cn("rounded-full border border-accent bg-accent-soft px-3 py-1 font-medium text-accent", text)}>{after}</span>
    </div>
  );
}

function StackTags({ stack, className }: { stack: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Stack">
      {stack.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** First link primary blue. A repo link always reads "Run locally →". Internal paths stay in the tab. */
function Actions({ links }: { links: LinkSpec[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {links.map((link, i) => {
        const href = "repo" in link ? link.repo : link.href;
        const label = link.label.replace(/\s*→$/, "");
        const className = cn("inline-flex min-h-11 items-center gap-1 text-[0.9375rem] font-semibold", i === 0 ? "text-accent" : "link");
        const content = (
          <>
            {label} <span aria-hidden>→</span>
          </>
        );
        return href.startsWith("/") ? (
          <Link key={label} href={href} className={className}>
            {content}
          </Link>
        ) : (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {content}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      })}
    </div>
  );
}

function ScopeNote({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("text-[0.8125rem] leading-relaxed text-subtle", className)}>
      <span className="eyebrow mr-2 text-[0.75rem]">Scope</span>
      {text}
    </p>
  );
}

/** On phones a tap-to-open accordion (never auto-expanded); from md up always open. */
function Slot({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between text-left md:hidden"
      >
        <span className="eyebrow text-[0.75rem]">{title}</span>
        <span aria-hidden className={cn("text-subtle transition-transform duration-150", open && "rotate-180")}>
          ↓
        </span>
      </button>
      <p className="eyebrow mb-2 hidden text-[0.75rem] md:block">{title}</p>
      <div id={id} className={cn(!open && "hidden", "md:block")}>
        {children}
      </div>
    </div>
  );
}
