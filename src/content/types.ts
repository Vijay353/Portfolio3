/**
 * Content model for the portfolio.
 *
 * Integrity conventions (see CONTENT-REVIEW.md):
 * - `verify`       → a claim that is plausible but not clearly supported by the source files.
 *                    The string explains what to check. Shown with a [verify] marker in review mode, omitted in production.
 * - `pending`      → a case study section whose content must come from Vijay. Shown as [Content pending] in review mode only.
 * - Work page entries (ProjectEntry) use the stricter `verification` gate instead: unverified entries must be drafts,
 *   and drafts never render. See src/content/validate.ts.
 */

import type { WorkLens } from "./work-lenses";

/** A paragraph or bullet. Use the object form to flag a claim for verification. */
export type Para = string | { text: string; verify: string };

export interface Metric {
  /** The number, e.g. "98%" or "49K". Omit for a qualitative outcome. */
  value?: string;
  /** What the number means, e.g. "quote-to-order success, up from 86%". */
  label: string;
  verify?: string;
}

export type CaseSectionId =
  | "context"
  | "problem"
  | "responsibility"
  | "constraints"
  | "approach"
  | "collaboration"
  | "solution"
  | "outcome"
  | "reflection";

export interface CaseSection {
  id: CaseSectionId;
  heading: string;
  body?: Para[];
  bullets?: Para[];
  /** What Vijay needs to supply. Rendered only in review mode when the section has no visible content. */
  pending?: string;
}

export interface FlowStep {
  label: string;
  detail?: string;
}

/** A simple left-to-right process or system flow. Used in case studies. */
export interface ProcessFlow {
  title: string;
  /** What the visitor should learn from the diagram. */
  caption: string;
  steps: FlowStep[];
  verify?: string;
}

/** The long-form page at /work/[id] for a case-study entry. */
export interface CaseStudy {
  /** One or two sentences, outcome first. */
  lede: string;
  metrics: Metric[];
  flow?: ProcessFlow;
  sections: CaseSection[];
}

// ── Work page content schema ───────────────────────────────────────────────

export type ProjectKind = "agent" | "case-study" | "archive";

/** draft = never rendered, not counted by filters, not in the sitemap, palette, or metadata. */
export type ProjectStatus = "published" | "draft";

/**
 * An action link. Use the `repo` form when there is no deployed URL; it always renders as "Run locally →".
 * A label that says "Live demo" or "deployed" must point at a real https deployment (validated).
 */
export type LinkSpec = { label: string; href: string } | { label: "Run locally →"; repo: string };

/** One proof point: large serif numeral + caption. `detail` is the qualifier shown when the card is expanded. */
export interface ProofMetric {
  value: string;
  caption: string;
  detail?: string;
}

/** An architecture node: mono label, optional one-line hover tooltip. */
export interface ArchNode {
  label: string;
  tooltip?: string;
}

/** A static visual for UI tools, games, and simulations. Framed in the existing hairline border. */
export interface Glimpse {
  /** image: still. loop: a short muted video, paused until the visitor presses play. simulation / game: either, by file type. */
  type: "image" | "loop" | "simulation" | "game";
  /** Path under /public (e.g. "/images/projects/x.png") or an absolute https URL. Must resolve (validated). */
  src: string;
  alt: string;
  caption?: string;
  /** Default 16:9. */
  aspect?: "16:9" | "4:3" | "1:1";
}

export type ArchiveGroup = "Product & UX" | "Data, analytics & ML" | "Audit & governance";

/**
 * One item on /work, whatever its shape. Only id, kind, status, eyebrow, title, and lenses are required;
 * every card and row composes itself from the slots that are filled. See the examples in projects.ts.
 */
export interface ProjectEntry {
  /** Stable slug: the /work anchor, and the /work/[id] route for case studies. */
  id: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Explicit order within its section. Entries without one follow array order, after ordered ones. */
  order?: number;

  // Identity
  /** Agents: "Agentic AI · Service operations". Case studies: the organization. Archive: the group (ArchiveGroup). */
  eyebrow: string;
  /** Agents: "Name: what it does" (the part before ": " is the short name). */
  title: string;
  /** Secondary context beside the eyebrow, e.g. "Enterprise CPQ · Salesforce + SAP". */
  context?: string;
  /** Display timeframe, e.g. "2021 – 2024". Drives "Most recent". Never guess. */
  timeframe?: string;

  // Narrative
  positioning?: string;
  problem?: string;
  /** What is simulated or unproven. Shown on expand only. */
  honestyLine?: string;

  // Proof (agents)
  proofStack?: ProofMetric[];
  architecture?: ArchNode[];
  beforeAfter?: { before: string; after: string };
  /** Gray tag pills on agent cards; the "Stack" line in case-study details. */
  stack?: string[];

  // Visual
  glimpse?: Glimpse;

  // Actions. The first renders primary blue. Case-study rows link to /work/[id] automatically and
  // leave these to the case study page's "Go deeper" list.
  links?: LinkSpec[];

  // Classification
  /** Lens values (see work-lenses.ts). Case studies also match "case-studies" automatically. */
  lenses: WorkLens[];
  /** Gray tag pills (case-study rows show two; archive rows show three). */
  tags?: string[];
  /** At most one per section: the lead card, and the full-width 60/40 card under "Agentic systems". */
  featured?: boolean;

  // Case studies
  /** Editorial number, e.g. "01". Auto-assigned from position when omitted. */
  number?: string;
  role?: string;
  engagementDetails?: string;
  /** Right-rail metric. `value` may be omitted for a qualitative outcome. */
  metric?: { value?: string; note?: string };
  capabilities?: string[];
  /** Long-form page at /work/[id]. */
  caseStudy?: CaseStudy;

  // Archive (the eyebrow is the archive group: one of ArchiveGroup)
  outcome?: string;

  // Verification gate
  verification?: {
    state: "verified" | "unverified";
    /** What the claims were checked against: repo path, doc, or commit. */
    source?: string;
    /** Any flag keeps the entry in draft. */
    flags?: string[];
  };
}

/** One step in a system's architecture. `note` is the one-line hover tooltip. */
export interface SystemNode {
  label: string;
  note: string;
}

/** A system shown in the homepage "From promise to proof" section. */
export interface SelectedSystem {
  slug: string;
  /** Label in the selector. */
  shortName: string;
  /** Mini card and index title. */
  name: string;
  eyebrow: string;
  /** Featured card headline. */
  headline: string;
  positioning: string;
  problem: string;
  /** Proof panel metric stack. The first metric is the one shown on mini cards and in the index. */
  metrics: Metric[];
  architecture: SystemNode[];
  before: string;
  after: string;
  stack: string[];
  /** href null = destination not known yet, rendered as a disabled control. */
  links: Array<{ label: string; href: string | null }>;
  /** Scope note, shown on the expanded card only. */
  honesty: string;
}

export interface Role {
  title: string;
  dates: string;
}

export interface ExperienceEntry {
  organization: string;
  location: string;
  /** Overall span at the organization, shown in the collapsed row. */
  span: string;
  current?: boolean;
  /** Oldest role first, so progression reads left to right. */
  roles: Role[];
  /** One sentence, shown when the row is expanded. */
  summary: string;
  highlights: string[];
  /** Case study that shows this work, if one exists. */
  relatedSlug?: string;
}

export interface Credential {
  name: string;
  issuer?: string;
  /** Verification URL. null = not known yet ([Credential link pending]). */
  href: string | null;
  /** Optional badge image under /public; checked at build time. */
  badge?: { src: string; alt: string };
}

export interface Principle {
  title: string;
  body: string;
  /** Two-sentence concrete enterprise example of the principle in action. */
  vignette: string;
  evidence: { label: string; slug: string };
}

export interface HeroFlowExample {
  id: string;
  label: string;
  slug: string;
  need: string;
  decision: string;
  system: string;
  outcome: string;
}

export type Lens = "default" | "product" | "consulting";
