import { projects } from "@/content/projects";
import { section } from "@/content/query";
import type { ArchiveGroup, ProjectEntry } from "@/content/types";
import { assertValidProjects } from "@/content/validate";
import { publicAssetExists } from "./assets";

/**
 * Content access layer. Pages read Work content only through these functions.
 * projects.ts is validated here, at build time: an invalid entry fails `next build`.
 * Drafts are filtered out by `section`, so they never render, count, or reach the sitemap or metadata.
 */
const entries = assertValidProjects(projects, { assetExists: publicAssetExists, warn: console.warn });

export function getAgentEntries(): ProjectEntry[] {
  return section(entries, "agent");
}

export function getCaseStudyEntries(): ProjectEntry[] {
  return section(entries, "case-study");
}

/** Case studies with a long-form page (used for routes, the sitemap, and the palette). */
export function getCaseStudyProjects(): ProjectEntry[] {
  return getCaseStudyEntries().filter((p) => p.caseStudy);
}

export function getProject(slug: string): ProjectEntry | undefined {
  return getCaseStudyProjects().find((p) => p.id === slug);
}

export function caseStudyHref(p: ProjectEntry): string | null {
  return p.caseStudy && p.status === "published" ? `/work/${p.id}` : null;
}

const ARCHIVE_GROUPS: ArchiveGroup[] = ["Product & UX", "Data, analytics & ML", "Audit & governance"];

export function getArchiveGroups(): Array<{ group: ArchiveGroup; items: ProjectEntry[] }> {
  const items = section(entries, "archive");
  return ARCHIVE_GROUPS.map((group) => ({ group, items: items.filter((a) => a.eyebrow === group) })).filter((g) => g.items.length > 0);
}

/** Title of a published case study by slug, for cross-links. */
export function caseStudyTitle(slug: string): string | null {
  return getProject(slug)?.title ?? null;
}
