import type { ArchiveGroup, LinkSpec, ProjectEntry, ProjectKind } from "./types";
import { WORK_LENSES } from "./work-lenses.ts";

/**
 * Validation gate for projects.ts. Runs in `next build` (via lib/content.ts) and in `npm test`.
 * Errors fail the build; warnings are printed. Relative `.ts` imports only, so Node can run it directly.
 */

export type Issue = { level: "error" | "warning"; id: string; message: string };

const KINDS: ProjectKind[] = ["agent", "case-study", "archive"];
const STATUSES = ["published", "draft"];
const ARCHIVE_GROUPS: ArchiveGroup[] = ["Product & UX", "Data, analytics & ML", "Audit & governance"];
const LENS_IDS: string[] = WORK_LENSES.map((l) => l.id);
const GLIMPSE_TYPES = ["image", "loop", "simulation", "game"];
const ASPECTS = ["16:9", "4:3", "1:1"];

/** Placeholder text that must never reach a page, in any field, published or draft. */
export const PLACEHOLDER = /\[\s*(?:pending|verify|fill|todo|tbd|placeholder|content pending|link pending|project coming soon|credential link pending)\b[^\]]*\]/i;

// ── Normalization ──────────────────────────────────────────────────────────

/** Trims strings and drops empty strings, empty arrays, and empty objects, recursively. `lenses` is always kept. */
function prune(value: unknown): unknown {
  if (typeof value === "string") {
    const t = value.trim();
    return t === "" ? undefined : t;
  }
  if (Array.isArray(value)) {
    const items = value.map(prune).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => [k, prune(v)] as const).filter(([, v]) => v !== undefined);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }
  return value;
}

/** Normalized copy of an entry: trimmed, empties removed, case studies always match the "case-studies" lens. */
export function normalizeEntry(entry: ProjectEntry): ProjectEntry {
  const out = (prune(entry) ?? {}) as ProjectEntry;
  const lenses = Array.isArray(out.lenses) ? [...out.lenses] : [];
  if (out.kind === "case-study" && !lenses.includes("case-studies")) lenses.push("case-studies");
  return { ...out, lenses };
}

// ── Rules ──────────────────────────────────────────────────────────────────

function strings(value: unknown, path: string, out: Array<[string, string]>) {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out);
}

const isHttp = (url: string) => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url);
const isLocalHost = (url: string) => /^https?:\/\/(localhost|127\.|0\.0\.0\.0|\[::1\])/i.test(url);
const isRepoHost = (url: string) => /^https?:\/\/(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\//i.test(url);

function checkLink(link: LinkSpec, add: (level: Issue["level"], message: string) => void) {
  if ("repo" in link) {
    const label: string = link.label;
    if (label !== "Run locally →") add("error", `link with a repo must be labeled "Run locally →" (got "${label}")`);
    if (!isHttp(link.repo)) add("error", `"Run locally →" repo must be an absolute http(s) URL (got "${link.repo}")`);
    return;
  }
  if (!link.label) add("error", "link is missing a label");
  const href = link.href ?? "";
  if (/live demo|deployed/i.test(link.label ?? "") && /^https?:\/\//i.test(href)) {
    if (!/^https:\/\//i.test(href) || isLocalHost(href) || isRepoHost(href) || !isHttp(href)) {
      add("error", `"${link.label}" must point at a real https deployment, not a repo or localhost (got "${href}"). Use { label: "Run locally →", repo } instead.`);
    }
    return;
  }
  if (!(isHttp(href) || href.startsWith("/")) || isLocalHost(href)) {
    add("error", `link "${link.label}" needs an absolute http(s) URL or a site path (got "${href}")`);
  }
}

function range(add: (level: Issue["level"], message: string) => void, name: string, list: unknown[] | undefined, min: number, max: number) {
  if (list && (list.length < min || list.length > max)) add("warning", `${name} has ${list.length} items; the design expects ${min}–${max}`);
}

/**
 * Checks raw entries (normalizes them first). `assetExists` resolves local glimpse files;
 * omit it to skip the file check.
 */
export function validateProjects(raw: ProjectEntry[], opts: { assetExists?: (publicPath: string) => boolean } = {}): Issue[] {
  const issues: Issue[] = [];
  const seen = new Set<string>();
  const featured = new Map<ProjectKind, string>();

  raw.forEach((rawEntry, index) => {
    const e = normalizeEntry(rawEntry);
    const id = e.id ?? `#${index}`;
    const add = (level: Issue["level"], message: string) => issues.push({ level, id, message });
    const published = e.status === "published";

    // Identity
    for (const field of ["id", "kind", "status", "eyebrow", "title"] as const) {
      if (!e[field]) add("error", `missing required field "${field}"`);
    }
    if (e.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id)) add("error", `id must be a lowercase slug (got "${e.id}")`);
    if (e.id && seen.has(e.id)) add("error", `duplicate id "${e.id}"`);
    if (e.id) seen.add(e.id);
    if (e.kind && !KINDS.includes(e.kind)) add("error", `unknown kind "${e.kind}"`);
    if (e.status && !STATUSES.includes(e.status)) add("error", `unknown status "${e.status}"`);
    if (e.order !== undefined && !Number.isFinite(e.order)) add("error", "order must be a finite number");

    // Lenses: unknown values fail loudly instead of filtering to nothing.
    if (!Array.isArray(rawEntry.lenses)) add("error", "lenses must be an array");
    for (const lens of e.lenses) if (!LENS_IDS.includes(lens)) add("error", `unknown lens "${lens}" (known: ${LENS_IDS.join(", ")})`);

    // Verification gate
    const v = e.verification;
    if (v && v.state !== "verified" && v.state !== "unverified") add("error", `unknown verification state "${v.state}"`);
    if (published && (!v || v.state !== "verified")) add("error", 'published entries need verification: { state: "verified", source }');
    if (published && v?.flags?.length) add("error", `published entry has open verification flags (${v.flags.join(", ")}); set status: "draft"`);

    // No placeholder text anywhere
    const found: Array<[string, string]> = [];
    strings(e, "", found);
    for (const [path, text] of found) if (PLACEHOLDER.test(text)) add("error", `placeholder text in ${path}: "${text.match(PLACEHOLDER)?.[0]}"`);

    // Links
    for (const link of e.links ?? []) checkLink(link, add);

    // Slot shapes
    if (e.beforeAfter && (!e.beforeAfter.before || !e.beforeAfter.after)) add("error", "beforeAfter needs both before and after");
    for (const p of e.proofStack ?? []) if (!p.value || !p.caption) add("error", "each proofStack item needs value and caption");
    for (const n of e.architecture ?? []) if (!n.label) add("error", "each architecture node needs a label");
    if (e.kind === "agent") {
      range(add, "proofStack", e.proofStack, 1, 3);
      range(add, "architecture", e.architecture, 3, 6);
      range(add, "stack", e.stack, 3, 5);
    }

    // Glimpse
    const g = e.glimpse;
    if (g) {
      if (!g.alt) add("error", "glimpse needs alt text");
      if (!GLIMPSE_TYPES.includes(g.type)) add("error", `unknown glimpse type "${g.type}"`);
      if (g.aspect && !ASPECTS.includes(g.aspect)) add("error", `unknown glimpse aspect "${g.aspect}"`);
      if (!g.src) add("error", "glimpse needs src");
      else if (/^https?:\/\//i.test(g.src)) {
        if (!/^https:\/\//i.test(g.src) || isLocalHost(g.src)) add("error", `glimpse src must be https and not localhost (got "${g.src}")`);
      } else if (!g.src.startsWith("/")) add("error", `glimpse src must start with "/" (under /public) or be an https URL (got "${g.src}")`);
      else if (opts.assetExists && !opts.assetExists(g.src)) add(published ? "error" : "warning", `glimpse file not found in /public: ${g.src}`);
    }

    // Kind-specific
    if (e.kind === "archive" && e.eyebrow && !ARCHIVE_GROUPS.includes(e.eyebrow as ArchiveGroup)) {
      add("error", `archive eyebrow must be one of: ${ARCHIVE_GROUPS.join(", ")}`);
    }
    if (e.kind === "case-study" && e.caseStudy && (!e.caseStudy.lede || !Array.isArray(e.caseStudy.sections))) {
      add("error", "caseStudy needs a lede and sections");
    }

    // One featured entry per section
    if (published && e.featured && e.kind) {
      const prior = featured.get(e.kind);
      if (prior) add("error", `more than one featured ${e.kind} entry ("${prior}" and "${id}")`);
      else featured.set(e.kind, id);
    }
  });

  return issues;
}

/** Normalized, validated entries. Throws with every error listed; prints warnings. */
export function assertValidProjects(raw: ProjectEntry[], opts: { assetExists?: (publicPath: string) => boolean; warn?: (msg: string) => void } = {}): ProjectEntry[] {
  const issues = validateProjects(raw, opts);
  const errors = issues.filter((i) => i.level === "error");
  const format = (i: Issue) => `  - ${i.id}: ${i.message}`;
  if (errors.length) throw new Error(`[content] projects.ts failed validation:\n${errors.map(format).join("\n")}`);
  const warnings = issues.filter((i) => i.level === "warning");
  if (warnings.length && opts.warn) opts.warn(`[content] projects.ts warnings:\n${warnings.map(format).join("\n")}`);
  return raw.map(normalizeEntry);
}
