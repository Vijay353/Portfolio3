import { site } from "@/content/site";
import { archiveAnchor, shortName } from "@/content/query";
import { WORK_LENSES, type WorkLensFilter } from "@/content/work-lenses";
import type { ArchiveGroup } from "@/content/types";
import type { AnalyticsEvent } from "./analytics";
import { getAgentEntries, getArchiveGroups, getCaseStudyProjects } from "./content";

export type PaletteCommand = {
  id: string;
  label: string;
  group: "Go to" | "Work" | "Case studies" | "Actions";
  keywords?: string;
  kind: "navigate" | "external" | "copy" | "theme" | "print" | "work-lens" | "archive-project";
  href?: string;
  value?: string;
  event?: AnalyticsEvent;
  workLens?: WorkLensFilter;
  archiveGroup?: ArchiveGroup;
  archiveAnchor?: string;
};

/**
 * Built on the server from the same content as the pages, so the palette never offers
 * a destination that doesn't exist (missing profile links are omitted, and so on).
 */
export function getPaletteCommands(): PaletteCommand[] {
  const commands: PaletteCommand[] = [
    { id: "work", label: "Selected work", group: "Go to", href: "/#work", kind: "navigate", keywords: "projects portfolio" },
    { id: "experience", label: "Jump to: Background & Experience", group: "Go to", href: "/#experience", kind: "navigate", keywords: "experience career timeline jobs" },
    { id: "jump-three-way-match", label: "Jump to: Three way Match Controller Case Study", group: "Go to", href: "/#work", kind: "navigate", keywords: "three way match invoice po sap case study" },
    { id: "about", label: "How I operate & about", group: "Go to", href: "/#about", kind: "navigate", keywords: "principles" },
    { id: "contact", label: "Contact", group: "Go to", href: "/#contact", kind: "navigate", keywords: "email reach" },
    { id: "all-work", label: "All work & archive", group: "Go to", href: "/work", kind: "navigate", keywords: "archive ai agents" },
    ...getCaseStudyProjects().map<PaletteCommand>((p) => ({
      id: `cs-${p.id}`,
      label: p.title,
      group: "Case studies",
      href: `/work/${p.id}`,
      kind: "navigate",
      keywords: `${p.eyebrow} ${p.context ?? ""} ${(p.stack ?? []).join(" ")} ${(p.capabilities ?? []).join(" ")} ${(p.tags ?? []).join(" ")}`,
      event: "case_study_click",
    })),
    {
      id: "show-all-work",
      label: "Show all work",
      group: "Work",
      href: "/work",
      kind: "work-lens",
      workLens: "all",
      keywords: "clear filter all projects archive",
    },
    ...WORK_LENSES.map<PaletteCommand>((lens) => ({
      id: `focus-${lens.id}`,
      label: `Focus ${lens.label}`,
      group: "Work",
      href: `/work?lens=${lens.id}`,
      kind: "work-lens",
      workLens: lens.id,
      keywords: lens.keywords,
    })),
    { id: "jump-case-studies", label: "Jump to Featured Case Studies", group: "Work", href: "/work#case-studies", kind: "navigate", keywords: "featured projects" },
    { id: "jump-applied-ai", label: "Jump to Applied AI", group: "Work", href: "/work#applied-ai", kind: "navigate", keywords: "AI RAG agents GenAI" },
    { id: "jump-project-archive", label: "Jump to Project Archive", group: "Work", href: "/work#project-archive", kind: "navigate", keywords: "archive audit earlier projects" },
    ...getAgentEntries().map<PaletteCommand>((a) => ({
      id: `agent-${a.id}`,
      label: shortName(a),
      group: "Work",
      href: `/work#${a.id}`,
      kind: "navigate",
      keywords: `${a.eyebrow} ${a.context ?? ""} ${(a.stack ?? []).join(" ")} ${a.lenses.join(" ")}`,
      event: "case_study_click",
    })),
    ...getArchiveGroups().flatMap(({ group, items }) => items.map<PaletteCommand>((item) => ({
      id: `archive-${archiveAnchor(item)}`,
      label: item.title,
      group: "Work",
      href: `/work#${archiveAnchor(item)}`,
      kind: "archive-project",
      archiveGroup: group,
      archiveAnchor: archiveAnchor(item),
      keywords: `${group} ${item.positioning ?? ""} ${item.outcome ?? ""} ${(item.tags ?? []).join(" ")}`,
      event: "archive_project_opened",
    }))),
  ];

  if (site.email) {
    commands.push({ id: "copy-email", label: `Copy ${site.email} to clipboard`, group: "Actions", kind: "copy", value: site.email, event: "contact_click", keywords: "contact mail email" });
  }
  if (site.linkedin) {
    commands.push({ id: "linkedin", label: "Open LinkedIn", group: "Actions", kind: "external", href: site.linkedin, event: "linkedin_click" });
  }
  if (site.github) {
    commands.push({ id: "github", label: "Open GitHub", group: "Actions", kind: "external", href: site.github, event: "github_click", keywords: "code" });
  }
  commands.push({ id: "print", label: "Download Executive 1-Page Architecture Brief (PDF)", group: "Actions", kind: "print", keywords: "pdf print resume brief save" });
  commands.push({ id: "theme", label: "Toggle Theme (Light / Dark)", group: "Actions", kind: "theme", keywords: "dark light mode appearance" });
  return commands;
}
