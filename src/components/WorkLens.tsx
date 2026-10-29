"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { WORK_FILTER_PILLS, WORK_LENSES, parseWorkLens, type WorkLensFilter } from "@/content/work-lenses";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type WorkLensContextValue = {
  activeLens: WorkLensFilter;
  selectLens: (lens: WorkLensFilter) => void;
};

const WorkLensContext = createContext<WorkLensContextValue | null>(null);

export function WorkLensProvider({ children }: { children: ReactNode }) {
  const [activeLens, setActiveLens] = useState<WorkLensFilter>("all");
  const activeLensRef = useRef<WorkLensFilter>("all");

  const syncLens = useCallback((lens: WorkLensFilter) => {
    activeLensRef.current = lens;
    setActiveLens(lens);
  }, []);

  const selectLens = useCallback((lens: WorkLensFilter) => {
    if (lens === activeLensRef.current) return;

    const url = new URL(window.location.href);
    if (lens === "all") url.searchParams.delete("lens");
    else url.searchParams.set("lens", lens);
    window.history.pushState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    syncLens(lens);
    track("work_lens_selected", { label: lens });
  }, [syncLens]);

  useEffect(() => {
    const readUrl = () => syncLens(parseWorkLens(new URLSearchParams(window.location.search).get("lens")));
    const selectFromPalette = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      selectLens(parseWorkLens(value));
    };

    readUrl();
    window.addEventListener("popstate", readUrl);
    window.addEventListener("work-lens-select", selectFromPalette);
    return () => {
      window.removeEventListener("popstate", readUrl);
      window.removeEventListener("work-lens-select", selectFromPalette);
    };
  }, [selectLens, syncLens]);

  return (
    <WorkLensContext.Provider value={{ activeLens, selectLens }}>
      <div data-work-lens-root data-active-lens={activeLens} className="contents">
        {children}
      </div>
    </WorkLensContext.Provider>
  );
}

export const WORK_SORTS = [
  { id: "quantified", label: "Most quantified" },
  { id: "recent", label: "Most recent" },
  { id: "az", label: "A–Z" },
] as const;
export type WorkSort = (typeof WORK_SORTS)[number]["id"];

/**
 * Sticky filter bar for /work. The pills are UI over the lens field (one taxonomy, one ?lens= param),
 * a single tab stop with arrow-key navigation (roving tabindex). Enter/Space selects.
 * The impact sort sits at the right on desktop and below the pill strip on phones.
 */
export function WorkFilterBar({ sort, onSort }: { sort: WorkSort; onSort: (sort: WorkSort) => void }) {
  const { activeLens, selectLens } = useWorkLens();
  const [focusId, setFocusId] = useState<WorkLensFilter | null>(null);
  const buttons = useRef(new Map<WorkLensFilter, HTMLButtonElement>());

  const pills: Array<{ id: WorkLensFilter; label: string }> = [...WORK_FILTER_PILLS];
  if (!pills.some((p) => p.id === activeLens)) {
    const lens = WORK_LENSES.find((l) => l.id === activeLens);
    if (lens) pills.push({ id: lens.id, label: lens.label });
  }
  const tabStop = focusId && pills.some((p) => p.id === focusId) ? focusId : activeLens;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = pills.findIndex((p) => p.id === tabStop);
    const last = pills.length - 1;
    const next =
      event.key === "ArrowRight" ? (i >= last ? 0 : i + 1)
      : event.key === "ArrowLeft" ? (i <= 0 ? last : i - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    const id = pills[next].id;
    setFocusId(id);
    const el = buttons.current.get(id);
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <>
      <div className="sticky top-[calc(4rem_+_1px)] z-30 border-b border-line bg-bg md:top-[calc(4.25rem_+_1px)]">
        <div className="container-page flex items-center gap-4">
          <div
            role="toolbar"
            aria-label="Filter work"
            onKeyDown={onKeyDown}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusId(null);
            }}
            className="-mx-1.5 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1.5 py-1.5 pr-8 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%_-_2.5rem),transparent)] lg:pr-1.5 lg:[mask-image:none]"
          >
            {pills.map((pill) => {
              const active = pill.id === activeLens;
              return (
                <button
                  key={pill.id}
                  ref={(el) => {
                    if (el) buttons.current.set(pill.id, el);
                    else buttons.current.delete(pill.id);
                  }}
                  type="button"
                  aria-pressed={active}
                  tabIndex={pill.id === tabStop ? 0 : -1}
                  onClick={() => {
                    setFocusId(pill.id);
                    selectLens(pill.id);
                  }}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center rounded-md border border-line px-3 text-[0.875rem] font-medium whitespace-nowrap transition-colors md:min-h-9",
                    active ? "border-l-2 border-l-accent text-fg" : "text-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
          <SortSelect sort={sort} onSort={onSort} className="hidden md:flex" />
        </div>
      </div>
      <div className="container-page md:hidden">
        <SortSelect sort={sort} onSort={onSort} className="flex border-b border-line py-1.5" />
      </div>
    </>
  );
}

function SortSelect({ sort, onSort, className }: { sort: WorkSort; onSort: (sort: WorkSort) => void; className?: string }) {
  const id = useId();
  return (
    <div className={cn("shrink-0 items-center gap-2", className)}>
      <label htmlFor={id} className="text-[0.8125rem] text-subtle">
        Sort
      </label>
      <select
        id={id}
        value={sort}
        onChange={(event) => onSort(event.target.value as WorkSort)}
        className="min-h-11 rounded-md border border-line bg-bg px-2 text-[0.875rem] font-medium text-fg hover:border-line-strong md:min-h-9"
      >
        {WORK_SORTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function useWorkLens() {
  const value = useContext(WorkLensContext);
  if (!value) throw new Error("Work Lens components must be rendered inside WorkLensProvider.");
  return value;
}