import type { SelectedSystem } from "./types";

/** Four agentic systems for the "From promise to proof" section. The first entry is featured by default. */
export const selectedSystems: SelectedSystem[] = [
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
    slug: "quote-to-order",
    shortName: "Quote-to-Order",
    name: "Quote-to-Order Controller",
    eyebrow: "Agentic AI + integrations · Manufacturing",
    headline: "Quote-to-Order Controller — making configured quotes become valid orders, provably",
    positioning:
      "An agentic reliability layer across Salesforce, Configit CPQ, and SAP ERP that verifies a configured quote actually became a valid order — and reopens the defect when it didn't.",
    problem:
      "Configured quotes were failing to become valid orders across Salesforce, Configit, and SAP — 38 configuration defects per month.",
    metrics: [{ value: "38 → 2", label: "configuration defects per month" }],
    architecture: [
      { label: "Quote event", note: "A configured quote is submitted from Salesforce." },
      { label: "Config extractor", note: "Reads the Configit configuration into a structured record." },
      { label: "Cross-system policy", note: "Checks the quote against SAP order rules." },
      { label: "Defect-reopen tool", note: "The single write: reopens the defect." },
      { label: "Order-state verifier", note: "Confirms the order became valid in SAP." },
    ],
    before: "Defects found by customers",
    after: "Defects proven and routed automatically",
    stack: ["Salesforce", "Configit CPQ", "SAP ERP"],
    links: [],
    honesty: "Enterprise systems simulated per integration contract; live demo runs cloud-deployed.",
  },
];
