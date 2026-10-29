import type { HeroFlowExample, Principle } from "./types";

/**
 * Hero "mini system flow": how a problem moved from need to outcome in real work.
 * Outcomes are qualitative here on purpose. The numbers live in the proof strip directly below.
 */
export const heroFlows: HeroFlowExample[] = [
  {
    id: "configit",
    label: "Configit",
    slug: "configit-quote-to-order",
    need: "Configured quotes failing to become valid orders",
    decision: "Fix how requirements become integrations",
    system: "Salesforce · Configit CPQ · SAP ERP",
    outcome: "Reliable quote-to-order",
  },
  {
    id: "third-estate",
    label: "Third Estate",
    slug: "third-estate-property-data",
    need: "Analysts couldn't trust one row as one property",
    decision: "Rebuild collection around how analysts decide",
    system: "5 municipal APIs · Python · Snowflake · Power BI",
    outcome: "Broader, de-duplicated coverage",
  },
  {
    id: "ub",
    label: "UB",
    slug: "ub-product-discovery",
    need: "No clear picture of where users dropped off",
    decision: "Interview customers, frame Jobs-to-be-Done",
    system: "Google Analytics · Figma prototypes",
    outcome: "Prioritized onboarding recommendations",
  },
];

/** How I Operate: four principles, each linked to the work that shows it. */
export const principles: Principle[] = [
  {
    title: "Start with the person, not the ticket",
    body: "A request is usually the visible part of the problem, so I start with the user's actual context.",
    vignette: "During a CPQ rollout, reps kept re-entering quotes the pricing engine rejected. Sitting with them on live quotes showed the failures came from how requirements were written, not from user error.",
    evidence: { label: "Customer research at UB", slug: "ub-product-discovery" },
  },
  {
    title: "Trace it to the system",
    body: "I follow what someone experiences down to the data, workflow, or integration that produces it.",
    vignette: "When analysts reported one property appearing in several rows, I traced the records from the municipal APIs through the pipeline to where they were matched. Rebuilding that matching around how analysts actually decide cut duplicate records by 60%.",
    evidence: { label: "Property data rebuild", slug: "third-estate-property-data" },
  },
  {
    title: "Own it past the handoff",
    body: "Requirements aren't the finish line. I stay through design, build, UAT, go-live, and production.",
    vignette: "I stayed on a quote-to-order go-live through UAT and the first production order cycle, watching integration logs for failures. That follow-through caught problems that would have blocked orders in the first week after launch.",
    evidence: { label: "Quote-to-order at Configit", slug: "configit-quote-to-order" },
  },
  {
    title: "Let evidence set the priority",
    body: "Behavioral data, research, and measured outcomes decide what comes first, not the loudest opinion.",
    vignette: "Two onboarding screens looked like the main problem until analytics showed most users leaving at a later step. Ranking the recommendations by that data moved the roadmap to where people actually dropped off.",
    evidence: { label: "Behavioral analytics at UB", slug: "ub-product-discovery" },
  },
];
