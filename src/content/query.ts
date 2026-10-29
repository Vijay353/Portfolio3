import type { ProjectEntry, ProjectKind } from "./types";

/**
 * Pure selectors over projects.ts. Everything the Work page shows or counts goes through `section`,
 * so drafts can never render, count, or reach metadata. Relative imports only (runs under `node --test`).
 */

/** Published entries of one kind, ordered by `order` (when set) then array position. */
export function section(entries: ProjectEntry[], kind: ProjectKind): ProjectEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.kind === kind && entry.status === "published")
    .sort((a, b) => (a.entry.order ?? Infinity) - (b.entry.order ?? Infinity) || a.index - b.index)
    .map(({ entry }) => entry);
}

export function matchesLens(entry: Pick<ProjectEntry, "lenses">, lens: string): boolean {
  return lens === "all" || entry.lenses.includes(lens as ProjectEntry["lenses"][number]);
}

/** The section's lead: the entry marked featured, else the first. */
export function featuredEntry(list: ProjectEntry[]): ProjectEntry | undefined {
  return list.find((e) => e.featured) ?? list[0];
}

/** Short name of an agent: the part of the title before " — ". */
export function shortName(entry: Pick<ProjectEntry, "title">): string {
  return entry.title.split(" — ")[0];
}

/** DOM id and palette anchor for an archive row (stable since before the schema). */
export function archiveAnchor(entry: Pick<ProjectEntry, "id">): string {
  return `archive-${entry.id}`;
}
