import type { ProjectEntry } from "./types";

/**
 * Everything on /work, in one ordered array. Sections come from `kind`; filter pills and counts
 * come from `lenses`; order within a section is array order (or `order`). No component edits needed.
 *
 *   Add:      append one entry. Start it as `status: "draft"` until every claim is checked.
 *   Remove:   delete the entry, or set `status: "draft"` (drafts never render, count, or reach SEO).
 *   Reorder:  move the entry, or set `order`.
 *
 * `npm test` and `next build` run the validation gate (src/content/validate.ts). It fails on: duplicate or
 * malformed ids, unknown lenses, published entries that are unverified or flagged, placeholder text such as
 * "[pending]" or "[verify]", a "Live demo"/"deployed" link without a real https deployment, a glimpse without
 * alt text or with a missing file, and more than one `featured` per section.
 *
 * ── Scaffold ─────────────────────────────────────────────────────────────────
 *
 *   {
 *     id: "my-project",                       // unique slug; /work#my-project
 *     kind: "agent",                          // "agent" | "case-study" | "archive"
 *     status: "draft",                        // flip to "published" once verified
 *     // order: 1,
 *     eyebrow: "Agentic AI · Domain",
 *     title: "Name — what it does, in active voice",
 *     // context: "Secondary context",
 *     // timeframe: "2026",
 *     // positioning: "One or two lines on what it does.",
 *     // problem: "Two lines of concrete pain.",
 *     // honestyLine: "What is simulated or unproven.",
 *     // proofStack: [{ value: "42/42", caption: "tests passing", detail: "optional qualifier" }],
 *     // architecture: [{ label: "Event" }, { label: "Policy engine", tooltip: "One line." }, { label: "Verifier" }],
 *     // beforeAfter: { before: "Old state", after: "New state" },
 *     // stack: ["TypeScript", "React", "Playwright"],
 *     // glimpse: { type: "image", src: "/images/projects/my-project.png", alt: "What the image shows", caption: "", aspect: "16:9" },
 *     // links: [{ label: "Live demo", href: "https://…" }, { label: "Run locally →", repo: "https://github.com/…" }],
 *     lenses: ["agentic"],
 *     // tags: ["Tag", "Tag"],
 *     // featured: true,
 *     // number: "05", role: "…", engagementDetails: "…", metric: { value: "98%", note: "…" }, capabilities: ["…"],
 *     // caseStudy: { lede: "…", metrics: [], sections: [] },
 *     verification: { state: "unverified", source: "repo path or doc", flags: [] },
 *   },
 *
 * ── Examples (copy the shape that matches) ───────────────────────────────────
 *
 * A. Complex agent: every slot. (The live Refund Assurance entry below is the real one.)
 *   {
 *     id: "refund-assurance", kind: "agent", status: "published", featured: true,
 *     eyebrow: "Agentic AI · Service operations",
 *     title: "Refund Assurance — the system that reopens a case when “refund processed” was a lie",
 *     positioning: "When a service session closes with “your refund has been processed,” this agent waits out the SLA, …",
 *     problem: "Async refunds fail silently at the gateway; …",
 *     honestyLine: "Salesforce-style systems simulated and labeled; …",
 *     proofStack: [{ value: "73/73", caption: "tests passing" }, { value: "1", caption: "idempotent write", detail: "compare-and-set + dual idempotency" }],
 *     architecture: [{ label: "Session-resolved event", tooltip: "Fires when a service session closes." }, { label: "openRefundException", tooltip: "Single mutating tool." }, { label: "Read-after-write verifier" }],
 *     beforeAfter: { before: "Silently closed case", after: "Owned recovery case (v7 → v8, audit-logged)" },
 *     stack: ["TypeScript", "React", "Zod", "Vitest", "Playwright"],
 *     lenses: ["agentic"],
 *     verification: { state: "verified", source: "repo path or commit" },
 *   },
 *
 * B. Simple UI project: a visual and a link. Renders as a minimal card: no proof rail, no expand.
 *   {
 *     id: "flow-builder", kind: "agent", status: "published",
 *     eyebrow: "UI tool · Workflow design",
 *     title: "Flow Builder — sketching approval flows before anyone writes code",
 *     positioning: "A drag-and-drop canvas for drafting approval flows and exporting them as JSON.",
 *     glimpse: { type: "image", src: "/images/projects/flow-builder.png", alt: "Canvas with three connected approval steps" },
 *     links: [{ label: "Run locally →", repo: "https://github.com/you/flow-builder" }],
 *     lenses: ["product-ux"],
 *     verification: { state: "verified", source: "github.com/you/flow-builder" },
 *   },
 *
 * C. Game or simulation: a looping clip (paused until the visitor presses play) with a caption.
 *   {
 *     id: "queue-sim", kind: "agent", status: "published",
 *     eyebrow: "Simulation · Operations research",
 *     title: "Queue Sim — watching a support queue tip over",
 *     problem: "Staffing models assume steady arrivals; real queues arrive in bursts.",
 *     glimpse: { type: "simulation", src: "/images/projects/queue-sim.mp4", alt: "Agents and tickets moving through a queue", caption: "Burst arrivals at 3× baseline", aspect: "4:3" },
 *     beforeAfter: { before: "Average-rate staffing", after: "Burst-aware staffing" },
 *     lenses: ["data-ai"],
 *     verification: { state: "verified", source: "github.com/you/queue-sim" },
 *   },
 *
 * D. Case study: compact row on /work plus the long-form page at /work/[id].
 *   {
 *     id: "configit-quote-to-order", kind: "case-study", status: "published",
 *     eyebrow: "Configit", context: "Enterprise CPQ · Salesforce + SAP", timeframe: "2021 – 2024",
 *     title: "Making quote-to-order reliable for global manufacturers",
 *     problem: "Only 86% of configured quotes were becoming orders successfully, …",
 *     metric: { value: "98%", note: "quote-to-order success, up from 86%" },
 *     tags: ["Salesforce", "SAP"], role: "Solutions Consultant → Senior Solutions Consultant, …",
 *     capabilities: ["Enterprise implementation"], stack: ["Salesforce", "SAP ERP", "Configit CPQ"],
 *     lenses: ["enterprise-integration", "case-studies"],
 *     caseStudy: { lede: "…", metrics: [{ value: "98%", label: "quote-to-order success, up from 86%" }], sections: [] },
 *     verification: { state: "verified", source: "index6.html and the brief" },
 *   },
 *
 * E. Archive item: title and one line, grouped by eyebrow.
 *   {
 *     id: "retail-analytics-dashboard", kind: "archive", status: "published",
 *     eyebrow: "Data, analytics & ML",
 *     title: "Retail analytics dashboard",
 *     positioning: "Data warehouse with ETL workflows feeding sales dashboards.",
 *     outcome: "Warehouse + dashboards", tags: ["ETL", "Power BI"],
 *     lenses: ["data-ai"],
 *     verification: { state: "verified", source: "index6.html" },
 *   },
 */
export const projects: ProjectEntry[] = [
  // ── Agents & Applied AI ───────────────────────────────────────────────────
  {
    id: "refund-assurance",
    kind: "agent",
    status: "published",
    eyebrow: "Agentic AI · Service operations",
    title: "Refund Assurance — the system that reopens a case when “refund processed” was a lie",
    positioning: "When a service session closes with “your refund has been processed,” this agent waits out the SLA, checks the (simulated) Order Management evidence, and reopens the case — only on confirmed failure.",
    problem: "Async refunds fail silently at the gateway; the session still counts as resolved, and nobody knows until the customer calls back.",
    honestyLine: "Salesforce-style systems simulated and labeled; no model called at runtime — the LLM slot is a proven, schema-guarded boundary.",
    proofStack: [
      { value: "73/73", caption: "tests passing" },
      { value: "1", caption: "idempotent write", detail: "compare-and-set + dual idempotency" },
      { value: "8", caption: "step verified pipeline", detail: "with independent read-after-write proof" },
    ],
    architecture: [
      { label: "Session-resolved event", tooltip: "Fires when a service session closes." },
      {
        label: "Rule-based promise extractor",
        tooltip: "Finds refund promises in the closing message, using rules.",
      },
      {
        label: "Deterministic policy engine",
        tooltip: "Decides from fixed rules whether the refund needs action.",
      },
      { label: "openRefundException", tooltip: "Single mutating tool." },
      { label: "Read-after-write verifier" },
    ],
    beforeAfter: { before: "Silently closed case", after: "Owned recovery case (v7 → v8, audit-logged)" },
    stack: ["TypeScript", "React", "Zod", "Vitest", "Playwright"],
    lenses: ["agentic"],
    featured: true,
    verification: { state: "verified", source: "Work page brief §5, card 1 (codebase-verified by the author)" },
  },
  {
    id: "matchpoint",
    kind: "agent",
    status: "published",
    eyebrow: "Agentic AI · Accounts payable operations",
    title: "MatchPoint — resolving three-way-match exceptions inside CFO authority, and stopping exactly where humans must decide",
    positioning: "An agentic reconciliation system that matches purchase orders, goods receipts, and supplier invoices; negotiates structured settlements with suppliers over a message channel; and posts to a simulated ERP — only inside policy, only with authority, every write verified and audit-chained.",
    problem: "Price variances, partial receipts, and duplicate invoices stall AP posting; the judgment calls live in policy, not in anyone's head.",
    honestyLine: "ERP, supplier network, and carrier are stateful simulators reached over real HTTP; SANDBOX/LIVE adapters exist and fail closed. Deployment status: container rehearsed locally, not live-verified.",
    proofStack: [
      {
        value: "201/201",
        caption: "tests passing",
        detail: "23 files, invariant tests: forged authority, stale revision, idempotent replay",
      },
      { value: "22", caption: "Playwright e2e" },
      { value: "5", caption: "additive SQLite migrations" },
      { value: "1", caption: "hash-chained, tamper-evident ERP audit log" },
    ],
    architecture: [
      { label: "Match run" },
      { label: "Evidence + duplicate screen" },
      { label: "Pure policy engine", tooltip: "CFO thresholds, versioned" },
      { label: "Authority gate", tooltip: "AUTO or bound approval" },
      { label: "Port call", tooltip: "Supplier ACCEPT → ERP post, idempotency key" },
      { label: "Independent read-back" },
    ],
    beforeAfter: {
      before: "Exception queues judged by tenure",
      after: "Every posting decided by policy, authorized per record, provable after the fact",
    },
    stack: ["TypeScript", "React", "Express", "SQLite", "Playwright", "Coolify-packaged container"],
    lenses: ["agentic"],
    verification: { state: "verified", source: "Work page brief §5 (doc-verified by the author)" },
  },
  {
    id: "business-impact-gate",
    kind: "agent",
    status: "published",
    eyebrow: "Agentic AI · Security operations",
    title: "Business Impact Gate — the pre-flight check before an analyst isolates a production SAP gateway",
    positioning: "When a Defender XDR–style incident suggests full device isolation, this gate snapshots the security evidence, joins it with CMDB tier, live dependencies, and change freezes, extracts cited constraints from runbooks — and stages a dual-approval packet instead of touching the endpoint.",
    problem: "A containment action can be technically right and operationally harmful; the context that would change the decision lives in other systems, is sometimes stale, and is joined by hand under pressure.",
    honestyLine: "Microsoft Graph and ServiceNow integrations are verified-as-real API contracts (scopes documented) behind fail-closed placeholder adapters; the model extractor is compiled and unit-tested with a stubbed provider, not verified live. Scenario numbers (1,420 sessions) are synthetic.",
    proofStack: [
      { value: "92/92", caption: "tests passing" },
      { value: "8/8", caption: "browser e2e" },
      {
        value: "0",
        caption: "endpoint mutations",
        detail: "isolate capability deliberately never granted, proved by least-privilege lab check",
      },
      { value: "2", caption: "independent stateful simulators", detail: "security + ITSM/CMDB" },
    ],
    architecture: [
      { label: "ManualIsolationRequested" },
      { label: "Evidence snapshot" },
      {
        label: "Constraint extractor",
        tooltip: "Cited claims, verbatim-match verified, never the authority",
      },
      { label: "Deterministic policy CAP-1.0", tooltip: "Fails closed" },
      { label: "Staged approval packet" },
      { label: "Independent read-back" },
    ],
    beforeAfter: {
      before: "Isolation decision from security evidence alone",
      after: "Decision with operational context, dual approval, expiry that never approves",
    },
    stack: ["TypeScript", "React", "Express", "SQLite (three owned databases)", "Playwright"],
    lenses: ["agentic", "audit-governance"],
    verification: { state: "verified", source: "Work page brief §5 (doc-verified by the author)" },
  },
  {
    id: "marginpulse",
    kind: "agent",
    status: "published",
    eyebrow: "Agentic AI · Operations (marketplace)",
    title: "MarginPulse — pausing paid demand when the kitchen is drowning, and proving the pause stuck",
    positioning: "On a kitchen-load event from a POS/KDS webhook, an investigator gathers read-only evidence, a deterministic 18-check policy decides, a manager approves, and exactly one PATCH pauses the Sponsored Listings campaign — verified by readback, never by HTTP 200.",
    problem: "During a rush, the kitchen and the ad budget live in different systems; pausing means noticing, switching tools, and later checking it actually stopped.",
    honestyLine: "Uber Ads and POS/KDS are stateful HTTP simulators; Uber scopes and endpoints verified against public docs, with documented TO_VERIFY items handled conservatively. No user research or revenue claims.",
    proofStack: [
      { value: "81 + 6", caption: "Vitest + Playwright tests" },
      {
        value: "1",
        caption: "write path",
        detail: "approval-bound, idempotency-reserved, pre-write re-read, readback-verified",
      },
      { value: "3", caption: "failure classifications handled without blind retries" },
    ],
    architecture: [
      { label: "Signed POS webhook" },
      { label: "Read-only investigator", tooltip: "Cited, value-checked report" },
      { label: "18-check policy engine" },
      { label: "Manager approval", tooltip: "Role + store + campaign + policy version + TTL" },
      { label: "One PATCH + readback verification" },
    ],
    beforeAfter: {
      before: "Campaign spend judged on stale dashboards",
      after: "Pause decision on fresh evidence, provably effective",
    },
    stack: ["TypeScript", "React", "Fastify", "SQLite", "Playwright"],
    lenses: ["agentic"],
    verification: { state: "verified", source: "Work page brief §5 (doc-verified by the author)" },
  },
  {
    id: "genai-agentic-rag",
    kind: "agent",
    status: "published",
    eyebrow: "Applied AI · Retrieval-augmented generation",
    title: "GenAI agentic RAG system",
    positioning: "Answering questions over a document set quickly and accurately.",
    proofStack: [
      { value: "<2s", caption: "response time" },
      { value: "90%+", caption: "accuracy" },
    ],
    architecture: [
      { label: "Retrieve relevant context" },
      { label: "Reason and act step by step" },
      { label: "Answer in a Streamlit UI" },
    ],
    stack: ["LLaMA 3", "RAG", "ReAct", "Streamlit"],
    lenses: ["agentic", "data-ai"],
    verification: { state: "verified", source: "Original portfolio copy (index6.html); unsupported problem line cut" },
  },

  // ── Case studies ──────────────────────────────────────────────────────────
  {
    id: "configit-quote-to-order",
    kind: "case-study",
    status: "published",
    eyebrow: "Configit",
    title: "Making quote-to-order reliable for global manufacturers",
    context: "Enterprise CPQ · Salesforce + SAP",
    timeframe: "2021 – 2024",
    problem: "Only 86% of configured quotes were becoming orders successfully, and configuration defects were running at 38 a month.",
    role: "Solutions Consultant → Senior Solutions Consultant, owning end-to-end solution delivery.",
    metric: { value: "98%", note: "quote-to-order success, up from 86%" },
    tags: ["Salesforce", "SAP"],
    stack: ["Salesforce", "SAP ERP", "Configit CPQ", "REST", "SOAP", "GraphQL", "Microsoft Azure", "BPMN"],
    capabilities: ["Enterprise implementation", "Integration design", "Customer discovery"],
    lenses: ["product-ux", "enterprise-integration", "case-studies"],
    caseStudy: {
      lede: "Raised quote-to-order success from 86% to 98% and cut configuration defects from 38 to 2 a month by redesigning how customer requirements became integrations across Salesforce, SAP, and Configit.",
      metrics: [
        { value: "98%", label: "quote-to-order success, up from 86%" },
        { value: "38 → 2", label: "configuration defects per month" },
      ],
      flow: {
        title: "Where the work sat",
        caption: "A configured quote has to stay valid as it moves from the CRM through the configuration engine into the ERP. Each hand-off is a place an order can fail.",
        steps: [
          { label: "Salesforce", detail: "Quote created by sales" },
          { label: "Configit CPQ", detail: "Configuration validated" },
          { label: "SAP ERP", detail: "Order created and fulfilled" },
        ],
        verify: "Confirm this is the correct direction and set of systems for the implementations you want to describe.",
      },
      sections: [
        {
          id: "context",
          heading: "Context",
          body: [
            "I worked with global manufacturers implementing Configit's CPQ and CLM products alongside Salesforce and SAP ERP. When a configured quote cannot become a valid order, sales, operations, and the end customer all feel it.",
          ],
        },
        {
          id: "problem",
          heading: "The problem",
          body: [
            "Quote-to-order success sat at 86%, and configuration defects averaged 38 per month.",
            {
              text: "Quote status updates were taking roughly 10 minutes to reach downstream teams, creating uncertainty about whether an order had gone through.",
              verify: "This appears in the brief as an example. Confirm it describes a real Configit implementation before publishing.",
            },
          ],
        },
        {
          id: "responsibility",
          heading: "My responsibility",
          body: [
            "As a Solutions Consultant I turned customers' configuration and quote-to-order problems into requirements, process designs, and integrations that Product and Engineering could execute. As Senior Solutions Consultant I owned solution delivery end to end, including production reliability after go-live.",
          ],
        },
        {
          id: "constraints",
          heading: "Constraints",
          pending: "What made this hard? e.g. legacy SAP configuration, customer release windows, data ownership across teams, or limits on changing the customer's Salesforce org.",
        },
        {
          id: "approach",
          heading: "Approach",
          bullets: [
            "Ran technical discovery with customer teams to find where quotes were actually failing.",
            "Translated findings into requirements and BPMN process designs.",
            "Designed integrations across Salesforce, SAP, and Configit over REST, SOAP, and GraphQL, with Microsoft Azure.",
            "Tested through UAT and supported production troubleshooting after go-live.",
          ],
        },
        {
          id: "collaboration",
          heading: "Collaboration",
          body: [
            "The work sat between enterprise customers and Configit's Product and Engineering teams: customer workshops to understand the real business problem, and requirements precise enough for engineers to build against. After go-live, customer enablement helped teams run the new process themselves.",
          ],
        },
        {
          id: "solution",
          heading: "What changed",
          pending: "Describe the one or two design decisions that made the biggest difference (e.g. what moved from batch to event-driven, which validation moved earlier).",
        },
        {
          id: "outcome",
          heading: "Outcome",
          body: [
            "Quote-to-order success rose from 86% to 98%, and configuration defects fell from 38 to 2 per month.",
          ],
        },
        {
          id: "reflection",
          heading: "Reflection",
          pending: "What did you learn? What tradeoff did you make? What would you do differently?",
        },
      ],
    },
    verification: { state: "verified", source: "index6.html and the brief (see CONTENT-REVIEW.md)" },
  },
  {
    id: "third-estate-property-data",
    kind: "case-study",
    status: "published",
    eyebrow: "Third Estate Ventures",
    title: "Rebuilding the property data analysts decide with",
    context: "Real-estate investment · Data & UX",
    timeframe: "2025 – Present",
    problem: "Investment analysts were working from property data that covered about 35K parcels and carried roughly 12K duplicate records.",
    role: "Business Intelligence & UX Designer, from analyst discovery through implementation.",
    metric: { value: "49K", note: "parcels of usable property coverage, up from ~35K" },
    tags: ["Python", "Data quality"],
    stack: ["Python", "REST APIs", "Snowflake", "SQL", "Power BI", "Power Automate"],
    capabilities: ["User research", "Data design", "Analytics"],
    lenses: ["product-ux", "data-ai", "case-studies"],
    caseStudy: {
      lede: "Expanded usable property coverage from about 35K to 49K parcels and cut duplicate records by 60% by rebuilding how five municipal data sources were collected and validated, starting from how analysts actually make decisions.",
      metrics: [
        { value: "35K → 49K", label: "parcels of usable property coverage" },
        { value: "60%", label: "fewer duplicate records (~12K → ~4.8K)" },
      ],
      flow: {
        title: "From public records to analyst decisions",
        caption: "Five municipal sources, each with its own format, are collected and validated before analysts ever see them, so the dashboards show one clean record per parcel.",
        steps: [
          { label: "5 municipal sources", detail: "Public property records" },
          { label: "Collect & validate", detail: "Python, REST APIs" },
          { label: "Model", detail: "Snowflake, SQL" },
          { label: "Decide", detail: "Power BI views for analysts" },
        ],
        verify: "Confirm the order of the pipeline stages (in particular that Snowflake feeds Power BI).",
      },
      sections: [
        {
          id: "context",
          heading: "Context",
          body: [
            "Third Estate Ventures' analysts evaluate real-estate investments. Their decisions are only as good as the property data underneath, and that data comes from public sources that were never designed to work together.",
          ],
        },
        {
          id: "problem",
          heading: "The problem",
          body: [
            "Coverage stopped at roughly 35K parcels, and about 12K duplicate records meant analysts could not trust that one row was one property.",
          ],
        },
        {
          id: "responsibility",
          heading: "My responsibility",
          body: [
            "As a Multi-Project Fellow I worked across the whole path: analyst discovery, UX, data design, and implementation.",
          ],
        },
        {
          id: "constraints",
          heading: "Constraints",
          pending: "What made this hard? e.g. inconsistent municipal formats, rate limits, parcel-ID mismatches, time or tooling limits.",
        },
        {
          id: "approach",
          heading: "Approach",
          bullets: [
            "Started with analysts: how they actually evaluate a property and which data they rely on.",
            "Rebuilt collection and validation for five municipal data sources in Python using their REST APIs.",
            "Modeled the cleaned data with SQL and Snowflake.",
            "Built Power BI analytics around analysts' real decision steps rather than around the raw tables.",
            {
              text: "Automated recurring hand-offs with Power Automate.",
              verify: "Power Automate is listed in the brief; confirm how it was used on this project.",
            },
          ],
        },
        {
          id: "collaboration",
          heading: "Collaboration",
          pending: "Who did you work with (analysts, partners, other fellows) and how did you bring them into decisions?",
        },
        {
          id: "solution",
          heading: "What changed",
          body: [
            "Analysts now work from a validated, de-duplicated property dataset with far broader coverage, surfaced in views designed around their workflow.",
          ],
        },
        {
          id: "outcome",
          heading: "Outcome",
          body: [
            "Coverage grew from about 35K to 49K parcels, and duplicate records fell by 60%, from about 12K to 4.8K.",
            {
              text: "Review cycles shortened and manual processing hours dropped significantly.",
              verify: "The brief mentions these outcomes without figures. Add the numbers or remove the sentence.",
            },
          ],
        },
        {
          id: "reflection",
          heading: "Reflection",
          pending: "What did you learn? What tradeoff did you make? What would you do differently?",
        },
      ],
    },
    verification: { state: "verified", source: "index6.html and the brief (see CONTENT-REVIEW.md)" },
  },
  {
    id: "ub-product-discovery",
    kind: "case-study",
    status: "published",
    eyebrow: "University at Buffalo",
    title: "Turning customer research into product decisions",
    context: "Product strategy & UX",
    timeframe: "2025",
    problem: "Onboarding and the overall experience needed to improve, but it was not yet clear which users mattered most or where they were dropping off.",
    role: "Product Strategy & UX Intern, research through recommendation.",
    metric: {
      note: "Identified user segments and experience drop-offs, and turned them into prioritized onboarding and UX recommendations.",
    },
    tags: ["JTBD", "Product discovery"],
    stack: ["Google Analytics", "Figma"],
    capabilities: ["Product discovery", "Customer research", "Prioritization"],
    links: [
      {
        label: "UB School of Management Projects Clinic",
        href: "https://management.buffalo.edu/faculty/projects-clinic.html",
      },
    ],
    lenses: ["product-ux", "case-studies"],
    caseStudy: {
      lede: "Combined customer interviews, Jobs-to-be-Done research, competitive and pricing analysis, and behavioral data to find who the product served and where the experience broke down, then turned that into prioritized recommendations.",
      metrics: [
        {
          label: "Quantified outcome",
          verify: "No metric in the source files. Add one if the recommendations were measured, or leave this out.",
        },
      ],
      sections: [
        {
          id: "context",
          heading: "Context",
          pending: "Which product or organization was this for (or how can it be described if confidential), and why did it matter now?",
        },
        {
          id: "problem",
          heading: "The problem",
          body: [
            "The team needed to improve onboarding and the overall experience, but did not yet have a clear picture of which user segments mattered most or where people were dropping off.",
          ],
        },
        {
          id: "responsibility",
          heading: "My responsibility",
          body: [
            "I owned the research-to-recommendation path: gathering evidence, synthesizing it into segments and drop-off points, and turning findings into product recommendations.",
          ],
        },
        {
          id: "approach",
          heading: "Approach",
          bullets: [
            "Interviewed customers and framed their needs as Jobs-to-be-Done.",
            "Mapped competitors and pricing to understand the alternatives users compare against.",
            "Used behavioral analytics in Google Analytics to locate experience drop-offs.",
            "Prioritized opportunities and defined product KPIs to measure them.",
            "Prototyped onboarding and UX improvements in Figma.",
          ],
        },
        {
          id: "collaboration",
          heading: "Collaboration",
          pending: "Who were the stakeholders, and how did you bring findings to them?",
        },
        {
          id: "solution",
          heading: "What changed",
          body: [
            "The team moved from a general sense that onboarding needed work to specific segments, specific drop-off points, and recommendations ranked against product KPIs.",
          ],
        },
        {
          id: "reflection",
          heading: "Reflection",
          pending: "What did you learn? Which recommendation did you deprioritize, and why?",
        },
      ],
    },
    verification: { state: "verified", source: "index6.html and the brief (see CONTENT-REVIEW.md)" },
  },
  {
    id: "ai-contract-analyzer",
    kind: "case-study",
    status: "published",
    eyebrow: "AI Contract Analyzer",
    title: "Making lease risk visible to non-legal stakeholders",
    context: "Applied AI · Document analysis",
    problem: "Critical clauses buried in unstructured real-estate lease documents were slow to review and hard for non-legal stakeholders to see.",
    role: "Designed and built the system.",
    metric: { value: "70%", note: "less review time, with 85% accuracy on flagged clauses" },
    tags: ["Applied AI", "Mistral 7B"],
    stack: ["Mistral 7B", "Ollama", "PyMuPDF", "Python"],
    capabilities: ["Applied AI", "Technical problem solving"],
    lenses: ["data-ai", "audit-governance", "case-studies"],
    caseStudy: {
      lede: "An offline AI system that extracts, summarizes, and flags critical clauses in real-estate leases with 85% accuracy, cutting review time by 70% and giving non-legal stakeholders a clear view of risk.",
      metrics: [
        { value: "70%", label: "reduction in review time" },
        { value: "85%", label: "accuracy extracting and flagging critical clauses" },
      ],
      flow: {
        title: "How a lease becomes a risk summary",
        caption: "Everything runs locally, so documents never leave the machine.",
        steps: [
          { label: "Lease PDF", detail: "Unstructured document" },
          { label: "Extract", detail: "PyMuPDF" },
          { label: "Summarize & flag", detail: "Mistral 7B via Ollama" },
          { label: "Risk view", detail: "Critical clauses for non-legal readers" },
        ],
      },
      sections: [
        {
          id: "context",
          heading: "Context",
          pending: "Where did this project come from (fellowship, coursework, independent)? Who were the intended users?",
        },
        {
          id: "problem",
          heading: "The problem",
          body: [
            "Lease documents are long and unstructured. The clauses that carry real risk are easy to miss, and stakeholders without legal training had no quick way to see them.",
          ],
        },
        {
          id: "approach",
          heading: "Approach",
          bullets: [
            "Extracted text from lease PDFs with PyMuPDF.",
            "Ran Mistral 7B locally through Ollama to summarize documents and flag critical clauses.",
            {
              text: "Kept the whole system offline so sensitive documents never left the machine.",
              verify: "The source says 'offline'; confirm that data privacy was the reason for that choice.",
            },
          ],
        },
        {
          id: "outcome",
          heading: "Outcome",
          body: ["Critical clauses were flagged with 85% accuracy, and review time fell by 70%."],
        },
        {
          id: "reflection",
          heading: "Reflection",
          pending: "How was accuracy measured? What tradeoffs came with a 7B local model versus a hosted one?",
        },
      ],
    },
    verification: { state: "verified", source: "index6.html and the brief (see CONTENT-REVIEW.md)" },
  },

  // ── Archive ───────────────────────────────────────────────────────────────
  // Review note: Confirm how the 25% engagement lift was measured.
  {
    id: "nexus-event-management-platform",
    kind: "archive",
    status: "published",
    eyebrow: "Product & UX",
    title: "Nexus event management platform",
    positioning: "Centralized bookings, payments, and coordination; later extended with mobile-responsive design, Stripe and PayPal payments, and analytics dashboards.",
    outcome: "Centralized event operations",
    tags: ["Product discovery", "Event analytics"],
    lenses: ["product-ux", "data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "vespera",
    kind: "archive",
    status: "published",
    eyebrow: "Product & UX",
    title: "Vespera",
    positioning: "Product and UX concept for a premium automated home cocktail machine.",
    outcome: "Product concept & UX",
    tags: ["Product concept", "UX design"],
    lenses: ["product-ux"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "livesafe",
    kind: "archive",
    status: "published",
    eyebrow: "Product & UX",
    title: "LiveSafe",
    positioning: "App concept combining real-time crime statistics with quality-of-life metrics.",
    outcome: "UX design",
    tags: ["Product concept", "Data visualization"],
    lenses: ["product-ux"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "retail-analytics-dashboard",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Retail analytics dashboard",
    positioning: "Data warehouse with ETL workflows feeding sales dashboards.",
    outcome: "Warehouse + dashboards",
    tags: ["ETL", "Power BI"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "word-problem-solver",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Word problem solver",
    positioning: "Solves algebra word problems with SVM classification and IBM CPLEX optimization.",
    outcome: "35% faster solution time",
    tags: ["SVM", "Optimization"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "housing-value-prediction",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Housing value prediction",
    positioning: "Multiple linear regression on 5,802 West Roxbury housing records.",
    outcome: "R² 0.79 · test RMSE 46.39",
    tags: ["Regression", "Prediction"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "personal-loan-acceptance-classifier",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Personal loan acceptance classifier",
    positioning: "k-NN and logistic regression on the Universal Bank dataset.",
    outcome: "F1 0.95 (k-NN) · 0.92 (logistic)",
    tags: ["Classification", "Machine learning"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "vehicle-price-prediction",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Vehicle price prediction",
    positioning: "Decision-tree model for Toyota Corolla auction pricing.",
    outcome: "RMSE 1,302",
    tags: ["Decision tree", "Prediction"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "airfare-price-prediction",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Airfare price prediction",
    positioning: "Price-forecasting models in Python and pandas on 638 airfare records.",
    outcome: "Forecasting model",
    tags: ["Forecasting", "Python"],
    lenses: ["data-ai"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "hostel-management-system",
    kind: "archive",
    status: "published",
    eyebrow: "Data, analytics & ML",
    title: "Hostel management system",
    positioning: "Hostel administration with secure registration and notifications (HTML, CSS, JSP, PHP, MySQL).",
    outcome: "Web application",
    tags: ["Web application", "MySQL"],
    lenses: ["product-ux"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  // Review note: The old site claimed 35% fewer compliance gaps and 70% lower risk. If this is a course case, keep those numbers off.
  {
    id: "smithsonian-banking-group",
    kind: "archive",
    status: "published",
    eyebrow: "Audit & governance",
    title: "Smithsonian Banking Group",
    positioning: "COBIT 5–aligned risk assessment of an internet banking system, including business rules and SIEM recommendations.",
    outcome: "Control recommendations",
    tags: ["COBIT 5", "Risk assessment"],
    lenses: ["audit-governance"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  // Review note: The old site claimed 40% fewer unauthorized changes. Confirm it is a real-world result before restoring it.
  {
    id: "claimproof-insurance",
    kind: "archive",
    status: "published",
    eyebrow: "Audit & governance",
    title: "ClaimProof Insurance",
    positioning: "IT assurance audit of change control using COBIT 5: OTP storage, log reconciliation, change management.",
    outcome: "Control recommendations",
    tags: ["IT assurance", "Change control"],
    lenses: ["audit-governance"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  {
    id: "major-manufacturing",
    kind: "archive",
    status: "published",
    eyebrow: "Audit & governance",
    title: "Major Manufacturing",
    positioning: "COBIT 5–aligned governance and ERP-security risk assessment.",
    outcome: "Restructuring & security recommendations",
    tags: ["COBIT 5", "ERP security"],
    lenses: ["audit-governance"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  // Review note: The old site spelled this 'Upward Round' in one place and 'Upward Bound' in another, and claimed 60% better risk mitigation.
  {
    id: "upward-bound-airlines",
    kind: "archive",
    status: "published",
    eyebrow: "Audit & governance",
    title: "Upward Bound Airlines",
    positioning: "Risk assessment of a cloud migration using COBIT 5.",
    outcome: "Cloud security recommendations",
    tags: ["Cloud migration", "COBIT 5"],
    lenses: ["audit-governance"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },
  // Review note: The old site claimed 90% faster breach detection. Confirm the context before restoring it.
  {
    id: "ai-for-cybersecurity-defensive-controls",
    kind: "archive",
    status: "published",
    eyebrow: "Audit & governance",
    title: "AI for cybersecurity defensive controls",
    positioning: "Applying machine learning, reinforcement learning, and NLP to threat detection and response.",
    outcome: "Research case study",
    tags: ["Machine learning", "Threat detection"],
    lenses: ["data-ai", "audit-governance"],
    verification: { state: "verified", source: "index6.html (condensed)" },
  },

  // ── Demo entries (drafts): a simple glimpse card and a simulation card ─────
  // Flip status to "published" to preview how these shapes compose in the grid.
  {
    id: "demo-ui-tool",
    kind: "agent",
    status: "draft",
    eyebrow: "UI tool · Demo",
    title: "Demo UI tool — a minimal card with one visual and one link",
    positioning: "Checks that a project with only a glimpse and a link renders cleanly in the agent grid.",
    glimpse: { type: "image", src: "/images/projects/demo-ui-glimpse.svg", alt: "Three connected workflow steps" },
    links: [{ label: "Run locally →", repo: "https://github.com/example/demo-ui-tool" }],
    lenses: ["product-ux"],
    verification: { state: "verified", source: "temporary layout demo" },
  },
  {
    id: "demo-simulation",
    kind: "agent",
    status: "draft",
    eyebrow: "Simulation · Demo",
    title: "Demo simulation — a glimpse, a caption, and a before → after",
    problem: "Checks that a visual, a problem line, and before → after compose without a proof rail.",
    glimpse: { type: "simulation", src: "/images/projects/demo-sim-glimpse.svg", alt: "Dots queueing through a gate", caption: "Burst arrivals at 3× baseline", aspect: "4:3" },
    beforeAfter: { before: "Average-rate staffing", after: "Burst-aware staffing" },
    lenses: ["agentic", "data-ai"],
    verification: { state: "verified", source: "temporary layout demo" },
  },

  // ── Drafts (never rendered) ───────────────────────────────────────────────
  {
    id: "three-way-match",
    kind: "agent",
    status: "draft",
    eyebrow: "Agentic AI · Finance operations",
    title: "Three-Way Match Controller — catching invoice mismatches before they become payments",
    positioning: "An agentic controller that reconciles purchase orders, goods receipts, and invoices, escalating only discrepancies it can prove — SAP-simulated backend.",
    lenses: ["agentic"],
    verification: {
      state: "unverified",
      flags: ["repo-not-provided"],
    },
  },
  {
    id: "soc-issue-solver",
    kind: "agent",
    status: "draft",
    eyebrow: "Agentic AI · Security & compliance",
    title: "SOC Issue Solver — turning audit findings into tracked, verifiable fixes",
    positioning: "An agent that reads compliance findings, opens the right remediation case with evidence attached, and proves the fix landed — ServiceNow-style queue simulated.",
    lenses: ["agentic"],
    verification: {
      state: "unverified",
      flags: ["repo-not-provided"],
    },
  },
  {
    id: "quote-to-order",
    kind: "agent",
    status: "draft",
    eyebrow: "Agentic AI + integrations · Manufacturing",
    title: "Quote-to-Order Controller — making configured quotes become valid orders, provably",
    positioning: "An agentic reliability layer across Salesforce, Configit CPQ, and SAP ERP that verifies a configured quote actually became a valid order — and reopens the defect when it didn't.",
    lenses: ["agentic"],
    verification: {
      state: "unverified",
      flags: ["repo-not-provided"],
    },
  },
  {
    id: "agentforce-project",
    kind: "agent",
    status: "draft",
    eyebrow: "Salesforce Agentforce",
    title: "Agentforce project",
    lenses: ["agentic"],
    verification: {
      state: "unverified",
      flags: ["content-not-written"],
    },
  },
];
