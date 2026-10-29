import type { ExperienceEntry } from "./types";

/**
 * Career progression, newest first:
 * Third Estate Ventures → University at Buffalo → Configit → FactSet.
 * Titles, dates and locations are taken verbatim from index6.html.
 * The collapsed row shows organization, span and the title progression;
 * summary, per-role dates, tools and related work appear on expand.
 */
export const experience: ExperienceEntry[] = [
  {
    organization: "Third Estate Ventures",
    location: "Buffalo, NY · Remote",
    span: "Sep 2025 – Present",
    current: true,
    roles: [{ title: "Business Intelligence & UX Designer, Multi-Project Fellow", dates: "Sep 2025 – Present" }],
    summary:
      "Work from analyst discovery through implementation to rebuild the property data behind real-estate investment decisions, and the Power BI views analysts use to make them.",
    highlights: ["Python", "REST APIs", "Snowflake", "Power BI", "UX research"],
    relatedSlug: "third-estate-property-data",
  },
  {
    organization: "University at Buffalo",
    location: "Buffalo, NY",
    span: "Aug 2024 – May 2025",
    roles: [
      { title: "Teaching Assistant, School of Management", dates: "Aug 2024 – Dec 2024" },
      { title: "Product Strategy & UX Intern", dates: "Jan 2025 – May 2025" },
    ],
    summary:
      "Taught graduate students technical and business concepts, then turned customer interviews, JTBD research, and behavioral analytics into prioritized onboarding and UX recommendations.",
    highlights: ["Customer interviews", "JTBD", "Google Analytics", "Figma"],
    relatedSlug: "ub-product-discovery",
  },
  {
    organization: "Configit",
    location: "Chennai, India",
    span: "Feb 2021 – May 2024",
    roles: [
      { title: "Solutions Consultant", dates: "Feb 2021 – Feb 2023" },
      { title: "Senior Solutions Consultant", dates: "Mar 2023 – May 2024" },
    ],
    summary:
      "Grew from turning manufacturers' quote-to-order problems into requirements and integrations to owning solution delivery end to end across Salesforce, SAP, and Configit CPQ.",
    highlights: ["Salesforce", "SAP ERP", "CPQ / CLM", "REST · SOAP · GraphQL", "Azure", "UAT"],
    relatedSlug: "configit-quote-to-order",
  },
  {
    organization: "FactSet Research Systems",
    location: "Hyderabad, India",
    span: "Dec 2018 – Feb 2021",
    roles: [
      { title: "Associate Solutions Consultant", dates: "Dec 2018 – Feb 2020" },
      { title: "Client Solutions Consultant", dates: "Feb 2020 – Feb 2021" },
    ],
    summary:
      "Solved institutional clients' market-data and portfolio-analytics problems by working backward to the data, calculation, or platform behavior underneath, then helped cut client onboarding time by 40%.",
    highlights: ["Market data", "Portfolio analytics", "SQL", "Salesforce"],
  },
];
