import type { SelectedSystem } from "./types";

/** Four agentic systems for the "From promise to proof" section. The first entry is featured by default. */
export const selectedSystems: SelectedSystem[] = [
  {
    slug: "three-way-match",
    shortName: "3-Way Match",
    name: "Three-Way Match Controller",
    eyebrow: "Agentic AI · Finance operations",
    headline: "Three-Way Match Controller — catching invoice mismatches before they become payments",
    positioning:
      "An agentic controller that reconciles purchase orders, goods receipts, and invoices, escalating only discrepancies it can prove — SAP-simulated backend.",
    problem:
      "PO, receipt, and invoice records disagree constantly; teams drown in false positives while real overpayments slip through.",
    metrics: [
      { value: "60%", label: "fewer matching exceptions" },
      { value: "~12K → ~4.8K", label: "matching exceptions, before → after" },
    ],
    architecture: [
      { label: "Document intake", note: "Receives PO, goods receipt and invoice records." },
      { label: "Match extractor", note: "Pulls line items to compare across the three documents." },
      { label: "Discrepancy policy", note: "Decides which mismatches are real exceptions." },
      { label: "Exception tool", note: "The single write: opens an exception, idempotent and audit-logged." },
      { label: "Reconciliation verifier", note: "Checks that the exception was recorded correctly." },
    ],
    before: "Manual line-by-line review",
    after: "Proven exceptions only",
    stack: ["TypeScript", "React"],
    links: [],
    honesty: "SAP simulated and labeled; every exception write is idempotent and audit-logged.",
  },
  {
    slug: "refund-assurance",
    shortName: "Refund Assurance",
    name: "Refund Assurance",
    eyebrow: "Agentic AI · Service operations",
    headline: "Refund Assurance — the system that reopens a case when \u201Crefund processed\u201D was a lie",
    positioning:
      "When an AI service session closes with \u201Cyour refund has been processed,\u201D this agent waits out the processing window, checks Order Management, and reopens the case — only on confirmed failure.",
    problem:
      "Async refunds fail silently at the gateway; the session still counts as resolved, and nobody knows until the customer calls back.",
    metrics: [
      { value: "73/73", label: "tests passing" },
      { value: "1", label: "bounded, idempotent, permission-checked write" },
      { value: "8", label: "step pipeline with independent read-after-write proof" },
    ],
    architecture: [
      { label: "Session-resolved event", note: "Fires when an AI support session closes." },
      { label: "Promise extractor", note: "Finds refund promises in the closing message, using rules." },
      { label: "Policy engine", note: "Decides from fixed rules whether the refund needs action." },
      { label: "openRefundException", note: "The only mutating tool: bounded, idempotent, permission-checked." },
      { label: "Read-after-write verifier", note: "Re-reads the order to confirm the failure is real." },
    ],
    before: "Silently closed case",
    after: "Owned recovery case (v7 → v8, audit-logged)",
    stack: ["TypeScript", "React", "Zod", "Vitest", "Playwright"],
    links: [
      { label: "Live demo", href: null },
      { label: "Architecture & README", href: null },
    ],
    honesty:
      "Salesforce-style systems simulated and labeled; no model called at runtime — the LLM slot is a proven, schema-guarded boundary.",
  },
  {
    slug: "soc-issue-solver",
    shortName: "SOC",
    name: "SOC Issue Solver",
    eyebrow: "Agentic AI · Security & compliance",
    headline: "SOC Issue Solver — turning audit findings into tracked, verifiable fixes",
    positioning:
      "An agent that reads compliance findings, opens the right remediation case with evidence attached, and proves the fix landed — ServiceNow-style queue simulated.",
    problem:
      "SOC findings sit in spreadsheets; remediation stalls because no one can tell which fixes actually shipped.",
    metrics: [{ value: "70%", label: "less review time" }],
    architecture: [
      { label: "Finding ingestion", note: "Reads audit findings into the queue." },
      { label: "Severity policy", note: "Assigns priority by fixed severity rules." },
      { label: "Remediation-case tool", note: "The single write: opens a case with evidence attached." },
      { label: "Fix verification", note: "Confirms the fix landed before the case closes." },
    ],
    before: "Findings aging in sheets",
    after: "Every fix evidence-backed",
    stack: [],
    links: [],
    honesty: "Ticketing and compliance systems simulated and labeled.",
  },
  {
    slug: "marginpulse",
    shortName: "MarginPulse",
    name: "MarginPulse",
    eyebrow: "Agentic AI · Operations (marketplace)",
    headline: "MarginPulse — pausing paid demand when the kitchen is drowning, and proving the pause stuck",
    positioning:
      "On a kitchen-load event from a POS/KDS webhook, an investigator gathers read-only evidence, a deterministic 18-check policy decides, a manager approves, and exactly one PATCH pauses the Sponsored Listings campaign — verified by readback, never by HTTP 200.",
    problem:
      "During a rush, the kitchen and the ad budget live in different systems; pausing means noticing, switching tools, and later checking it actually stopped.",
    metrics: [
      { value: "81 + 6", label: "Vitest + Playwright tests" },
      { value: "1", label: "write path — approval-bound, idempotency-reserved, pre-write re-read, readback-verified" },
      { value: "3", label: "failure classifications handled without blind retries" },
    ],
    architecture: [
      { label: "Signed POS webhook", note: "Fires on a kitchen-load event." },
      { label: "Read-only investigator", note: "Gathers cited, value-checked evidence." },
      { label: "18-check policy engine", note: "Deterministic decision, no blind retries." },
      { label: "Manager approval", note: "Role + store + campaign + policy version + TTL." },
      { label: "One PATCH + readback", note: "Verifies the pause stuck, never by HTTP 200." },
    ],
    before: "Campaign spend judged on stale dashboards",
    after: "Pause decision on fresh evidence, provably effective",
    stack: ["TypeScript", "React", "Fastify", "SQLite", "Playwright"],
    links: [],
    honesty:
      "Uber Ads and POS/KDS are stateful HTTP simulators; Uber scopes and endpoints verified against public docs, with documented TO_VERIFY items handled conservatively. No user research or revenue claims.",
  },
];
