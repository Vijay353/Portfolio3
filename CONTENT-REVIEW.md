# Content review

## Content still required

| Item | Where it goes | Status |
|---|---|---|
| Email | `src/content/site.ts` → `email` | Missing (old value `contact@vijaykumar.com` looked like a placeholder). Contact row, copy button and ⌘K "Copy email" appear once set. |
| Headshot | `public/images/headshot.jpg`, `.jpeg`, `.png`, or `.webp` (from `Images/mypic.jpg`) | Missing. Shows as a small portrait beside "Product & Solutions" once present; no placeholder is shown in production. |
| CSPO, Lean Six Sigma Green Belt, ITIL 4 verification links | `src/content/credentials.ts` → `href` | Missing (old links were `href="#"`). Shown as unlinked chips; Credly profile link is live. |
| Badge images | `public/images/credentials/cspo`, `lssgb`, `itil4` with `.jpg`, `.jpeg`, `.png`, or `.webp` extensions (from `Images/CSPO01.jpg` etc.) | Missing; chips show text only |
| LinkedIn Learning course titles | `credentials.ts` → `courseCertificates` | Links are real; labels ("GenAI", "APM", "ITSM", "AZ-500 prep") are as the old site had them. Replace with full course titles |
| Project GitHub / artifact links | `src/content/projects.ts` | All pending (every original was `href="#"`) |
| Case-study sections | `projects.ts` | Constraints / Collaboration / Reflection still pending (see below) |
| Publications & talks | `credentials.ts` → `publications` | None in the source files; subsection omitted |


Everything that needs your eyes before the site goes live. Sources: `index6.html` (the old site) and the brief.

## Metrics: all traceable

| Metric | Where shown | Source |
|---|---|---|
| Quote-to-order 86% → 98% | Proof strip, Configit case study | index6.html (Configit, Senior SC) |
| Config defects 38 → 2 / month | Configit bento tile, case study | index6.html |
| Parcels ~35K → 49K | Proof strip, Third Estate case study | index6.html + brief |
| Duplicates −60% (~12K → ~4.8K) | Third Estate bento tile, case study | index6.html (60%) + brief (12K → 4.8K) |
| Client onboarding −40% | Proof strip, FactSet timeline row ("helped cut") | index6.html (FactSet, "helping reduce") |
| 70% less review time, 85% accuracy | AI Contract Analyzer | index6.html |
| <2s responses, 90%+ accuracy | GenAI RAG agent card | index6.html |
| 25% engagement, 35% faster, R² 0.79 / RMSE 46.39, F1 0.95/0.92, RMSE 1,302 | Archive | index6.html |

Not used anywhere: "5+ / 6 years", "10+ academic projects", "15+ happy clients", "~98% CSAT" (kept off; easy to add back to FactSet if you want it), skill-bar percentages.

## `[verify]`, shown in dev, omitted in production

1. **Configit: "quote status updates took ~10 minutes."** Appears in the brief as a writing example. Confirm it's real.
2. **Configit flow diagram** (Salesforce → Configit → SAP). Confirm direction and systems.
3. **Third Estate flow diagram** (5 sources → Python → Snowflake → Power BI). Confirm the stage order.
4. **Third Estate: Power Automate use.** Listed as a skill; how it was used isn't stated.
5. **Third Estate: "review cycles shortened, manual hours reduced."** No figures in the source. Add numbers or delete.
6. **AI Contract Analyzer: "offline for privacy."** Source says offline; the reason is inferred.
7. **GenAI RAG agent: problem statement.** Source doesn't say what it answers questions about.
8. **UB: quantified outcome.** None in the source.
9. **Nexus: 25% engagement.** How was it measured?
10. **Audit case studies: percentages removed.** The old site claimed 35%/70%/40%/60%/90% improvements for Smithsonian Banking Group, ClaimProof, Upward Bound Airlines and the cybersecurity study. These read as textbook course cases (you list IS Auditing as coursework); presenting real-world results for fictional companies is a credibility risk in a Big 4 interview. They're in the archive as case analyses without the numbers.
11. **"Upward Round" vs "Upward Bound" Airlines**. The old site used both. Archive uses "Bound".

## `[Content pending]`, only you can write these

Case-study sections hidden in production until filled in `src/content/projects.ts`:

- **Configit:** Constraints, What changed (the key design decisions), Reflection
- **Third Estate:** Constraints, Collaboration, Reflection
- **UB:** Context (which product/org), Collaboration, Reflection
- **AI Contract Analyzer:** Context (fellowship/coursework/independent?), Reflection (how accuracy was measured)

Reflections matter most. They're where a hiring manager sees judgment.

## Links

| Item | Status |
|---|---|
| Email | **Pending**. Old value was a placeholder (`contact@vijaykumar.com`). Phone `+1 (234) 567-890` and "San Francisco, CA" removed. |
| LinkedIn, GitHub | Set in `src/content/site.ts` to the supplied profile URLs. |
| Credly | Kept: `credly.com/users/vijay-kumar-banoth` |
| UB Projects Clinic, configit.com, factset.com | Kept from index6.html |
| All 13 project GitHub / doc links | **Pending**. Every one was `href="#"` |
| Certificate links (LinkedIn Learning) | Not carried over; Credly covers credentials. Add back if wanted. |

## Assets

No repository folder was connected, so no files could be checked. Expected:

- `public/images/headshot.jpg`, `.jpeg`, `.png`, or `.webp` ← `Images/mypic.jpg`
- Optional project images → `public/images/projects/` (old site had `vespera01.webp`, `ems01.jpg`, `quality01.png`, `retail01.png`, …). The archive doesn't use images by design; add one to an agent/featured project via `image`.

Removed: Unsplash stock photos (they represented projects with imagery that wasn't the work), skill logos, certificate thumbnails.

## Rewritten vs reused

- **Reused (condensed):** job titles, dates, locations, education, certifications, project descriptions.
- **Rewritten:** hero positioning (from the brief's core story), About (3 paragraphs on trajectory), experience summaries (grouped by company to show progression), all featured-project framing (problem → role → impact), case-study ledes (outcome first).
- **Iteration 2 (refinement pass):** hero cut to one supporting sentence; trajectory moved to About. Capabilities grid removed. Skills now appear as 1–3 tags on the project where they were used, plus one keyword line in Credentials. Experience summaries cut to one sentence each and moved behind expand. New copy: How I Operate principles (from your brief), About rewritten to two paragraphs, including the one long-term-practice sentence you supplied (reworded: "Longer term, I'd like to run a practice of my own; for now, that mostly shows up as treating problems as mine to finish."). It appears nowhere else.
- **Removed:** contact form (sent nothing), newsletter signup (no backend), privacy/terms links (`#`), skill filters, case-study filters, skill-percentage bars, "Problem Solver / User Advocate" cards, "audit assurance" framing in About and the old footer's "Senior Solution Engineer transitioning into product management".
