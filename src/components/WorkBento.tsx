"use client";

import { type ReactNode, useId, useState } from "react";
import { selectedSystems } from "@/content/selected-systems";
import type { Metric, SelectedSystem } from "@/content/types";
import { cn } from "@/lib/cn";
import { ArchitectureFlow } from "./ArchitectureFlow";

/**
 * From promise to proof: a selector, one featured system card, and the other systems as mini cards.
 * Choosing a system promotes it into the featured slot in place. "All systems" opens an inline index.
 */
export function WorkBento() {
  const [activeSlug, setActiveSlug] = useState(selectedSystems[0].slug);
  const [indexOpen, setIndexOpen] = useState(false);
  const indexId = useId();

  const featured = selectedSystems.find((s) => s.slug === activeSlug) ?? selectedSystems[0];
  const others = selectedSystems.filter((s) => s.slug !== featured.slug);

  const promote = (slug: string) => {
    setActiveSlug(slug);
    setIndexOpen(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <nav
          aria-label="Systems"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible"
        >
          {selectedSystems.map((s) => {
            const active = s.slug === featured.slug;
            return (
              <button
                key={s.slug}
                type="button"
                aria-pressed={active}
                onClick={() => promote(s.slug)}
                className={cn(
                  "btn shrink-0 px-4",
                  active ? "btn-primary underline underline-offset-4" : "text-muted hover:text-fg",
                )}
              >
                {s.shortName}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          aria-expanded={indexOpen}
          aria-controls={indexId}
          onClick={() => setIndexOpen((open) => !open)}
          className="btn btn-secondary shrink-0"
        >
          All systems <span aria-hidden>→</span>
        </button>
      </div>

      {indexOpen ? <SystemIndex id={indexId} systems={selectedSystems} onPromote={promote} /> : null}

      <div className="mt-6">
        <FeaturedSystem key={featured.slug} system={featured} />
      </div>

      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {others.map((s) => (
          <li key={s.slug} className="flex min-w-0">
            <MiniCard system={s} onPromote={() => promote(s.slug)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedSystem({ system }: { system: SelectedSystem }) {
  return (
    <article className="motion-safe:animate-[fade-in_150ms_ease-out] rounded-xl border border-line bg-surface p-4 md:p-7">
      <div className="grid gap-y-6 md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] md:gap-x-9">
        <div className="flex min-w-0 flex-col gap-4">
          <p className="eyebrow text-[0.75rem]">{system.eyebrow}</p>
          <h3 className="font-serif text-[1.375rem] leading-[1.15] font-semibold tracking-tight text-balance text-fg md:text-[1.75rem]">
            {system.headline}
          </h3>
          <p className="text-[1rem] leading-relaxed text-fg">{system.positioning}</p>
          <div>
            <p className="eyebrow mb-1.5 text-[0.75rem]">The problem</p>
            <p className="leading-relaxed text-muted">{system.problem}</p>
          </div>
          {system.stack.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
              {system.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
          {system.links.length > 0 ? (
            <div className="flex flex-wrap gap-3 pt-1">
              {system.links.map((link, i) =>
                link.href ? (
                  link.href.startsWith("http") ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn("btn", i === 0 ? "btn-primary" : "btn-secondary")}
                    >
                      {link.label} <span aria-hidden>→</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className={cn("btn", i === 0 ? "btn-primary" : "btn-secondary")}
                    >
                      {link.label} <span aria-hidden>→</span>
                    </a>
                  )
                ) : (
                  <span
                    key={link.label}
                    aria-disabled="true"
                    title="Link not added yet"
                    className={cn("btn cursor-not-allowed opacity-60", i === 0 ? "btn-primary" : "btn-secondary")}
                  >
                    {link.label} <span aria-hidden>→</span>
                  </span>
                ),
              )}
            </div>
          ) : null}
        </div>

        <ProofPanel system={system} />
      </div>

      <p className="mt-6 border-t border-line pt-3 text-[0.8125rem] leading-relaxed text-subtle">
        <span className="eyebrow mr-2 text-[0.75rem]">Scope</span>
        {system.honesty}
      </p>
    </article>
  );
}

function ProofPanel({ system }: { system: SelectedSystem }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-line bg-bg p-4 md:p-5">
      <p className="eyebrow text-[0.75rem]">The proof</p>

      {/* Metric stack: never collapses. */}
      <ul className="divide-y divide-line">
        {system.metrics.map((m) => (
          <MetricRow key={m.label} metric={m} />
        ))}
      </ul>

      <ProofSection title="Architecture">
        <ArchitectureFlow nodes={system.architecture} />
      </ProofSection>

      <ProofSection title="Before → After">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.875rem] text-muted">
            {system.before}
          </span>
          <span aria-hidden className="text-subtle">
            →
          </span>
          <span className="rounded-full border border-accent bg-accent-soft px-3 py-1.5 text-[0.875rem] font-medium text-accent">
            {system.after}
          </span>
        </div>
      </ProofSection>
    </div>
  );
}

function MetricRow({ metric }: { metric: Metric }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      {metric.value ? (
        <p className="font-serif text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums text-fg md:text-[2rem]">
          {metric.value}
        </p>
      ) : null}
      <p className="mt-2 text-[0.9375rem] leading-snug text-muted">{metric.label}</p>
    </li>
  );
}

/** On phones the section is a tap-to-open accordion; from md up it is always open. */
function ProofSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-t border-line pt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between text-left md:hidden"
      >
        <span className="eyebrow text-[0.75rem]">{title}</span>
        <span aria-hidden className={cn("text-subtle transition-transform duration-200", open && "rotate-180")}>
          ↓
        </span>
      </button>
      <p className="eyebrow mb-3 hidden text-[0.75rem] md:block">{title}</p>
      <div id={id} className={cn(!open && "hidden", "md:block")}>
        {children}
      </div>
    </div>
  );
}

function MiniCard({ system, onPromote }: { system: SelectedSystem; onPromote: () => void }) {
  const metric = system.metrics[0];

  return (
    <button
      type="button"
      onClick={onPromote}
      className="group flex w-full flex-col rounded-xl border border-line bg-surface p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[0_8px_24px_-18px_rgb(0_0_0/0.35)] md:p-6"
    >
      <span className="eyebrow block text-[0.75rem]">{system.eyebrow}</span>
      <span className="mt-3 block font-serif text-[1.1875rem] leading-snug font-semibold tracking-tight text-fg">
        {system.name}
      </span>
      <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted line-clamp-2">{system.problem}</span>

      {metric ? (
        <span className="mt-5 flex flex-col">
          {metric.value ? (
            <span className="font-serif text-[2.25rem] leading-none font-semibold tracking-tight tabular-nums text-fg">
              {metric.value}
            </span>
          ) : null}
          <span className="mt-1.5 text-[0.875rem] leading-snug text-muted">{metric.label}</span>
        </span>
      ) : null}

      <span className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="flex flex-wrap gap-1.5">
          {system.stack.slice(0, 2).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] font-semibold text-accent">
          Case study <span aria-hidden className="nudge">→</span>
        </span>
      </span>
    </button>
  );
}

/** Inline index of all systems: eyebrow, title, one metric, and a link that promotes the system. */
function SystemIndex({
  id,
  systems,
  onPromote,
}: {
  id: string;
  systems: SelectedSystem[];
  onPromote: (slug: string) => void;
}) {
  return (
    <ol id={id} className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
      {systems.map((s) => {
        const metric = s.metrics[0];
        return (
          <li key={s.slug} className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-8">
            <div className="min-w-0">
              <p className="eyebrow text-[0.75rem]">{s.eyebrow}</p>
              <p className="mt-1 font-serif text-[1.125rem] font-semibold tracking-tight text-fg">{s.name}</p>
            </div>
            {metric ? (
              <p className="text-[0.875rem] text-muted">
                <span className="font-serif text-[1.25rem] font-semibold text-fg tabular-nums">{metric.value}</span>{" "}
                {metric.label}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => onPromote(s.slug)}
              className="btn btn-secondary justify-self-start md:justify-self-end"
            >
              View <span aria-hidden>→</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
