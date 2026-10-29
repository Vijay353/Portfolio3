export const WORK_LENSES = [
  {
    id: "product-ux",
    label: "Product & UX",
    keywords: "product ux discovery research JTBD usability workflow",
  },
  {
    id: "data-ai",
    label: "Data & AI",
    keywords: "data analytics AI ML machine learning Python Power BI Snowflake RAG agents",
  },
  {
    id: "enterprise-integration",
    label: "Enterprise / Integration",
    keywords: "enterprise integration Salesforce SAP CPQ CLM REST SOAP GraphQL",
  },
  {
    id: "audit-governance",
    label: "Audit & Governance",
    keywords: "audit governance risk COBIT security controls cybersecurity compliance",
  },
  {
    id: "agentic",
    label: "Agentic systems",
    keywords: "agentic agents AI workflow approval policy audit human in the loop automation",
  },
  {
    id: "case-studies",
    label: "Case studies",
    keywords: "case studies consulting engagements featured delivery",
  },
] as const;

export type WorkLens = (typeof WORK_LENSES)[number]["id"];
export type WorkLensFilter = WorkLens | "all";

export function parseWorkLens(value: string | null | undefined): WorkLensFilter {
  if (value === "all") return "all";
  return WORK_LENSES.find((lens) => lens.id === value)?.id ?? "all";
}

/**
 * The Work page's sticky filter pills: UI over the same lens field, in display order.
 * Labels are pill copy only; ids, URLs, and palette labels stay as defined above.
 * A lens without a pill (e.g. product-ux from a palette or URL) still filters, and its pill appears while active.
 */
export const WORK_FILTER_PILLS: ReadonlyArray<{ id: WorkLensFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "agentic", label: "Agentic systems" },
  { id: "case-studies", label: "Case studies" },
  { id: "enterprise-integration", label: "Enterprise / Integration" },
  { id: "data-ai", label: "Data & AI" },
  { id: "audit-governance", label: "Compliance & Security" },
];
