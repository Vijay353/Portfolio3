# Vijay Kumar Portfolio

Next.js (App Router) · TypeScript · Tailwind CSS v4. Every page is statically generated.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 (review markers ON)
npm run typecheck
npm run build && npm start   # production (review markers OFF)
```

Requires Node 20.9+.

## Before you deploy: remaining details

| What | Where | Why |
|---|---|---|
| Headshot | `public/images/headshot.jpg`, `.jpeg`, `.png`, or `.webp` (copy `Images/mypic.jpg`; square, ≥ 800px) | Falls back to a "VK" monogram when missing |
| Email | `src/content/site.ts` → `email` | Old site used `contact@vijaykumar.com`, which looks like a placeholder |
| Site URL | `NEXT_PUBLIC_SITE_URL` env var | Canonical URLs, sitemap, OpenGraph |

Then work through `CONTENT-REVIEW.md`. Every `[verify]` and `[Content pending]` item is listed there.

## Review mode

`npm run dev` shows yellow `[verify]`, `[Content pending]` and `[link pending]` markers next to anything that
isn't confirmed. Production builds omit those claims, pending sections and pending links entirely, so nothing
unverified ships. Vercel Preview deployments can opt in with `NEXT_PUBLIC_REVIEW_MODE=true`; production deployments
always suppress review notes.

## Editing content

All copy lives in `src/content/`. No layout code to touch.

- `site.ts`: name, positioning, contact links, education
- `experience.ts`: career timeline (oldest first; one-sentence summaries shown on expand)
- `projects.ts`: everything on `/work` (agents, case studies, archive) as one ordered array of `ProjectEntry`. The header comment has a scaffold and five copy-ready examples. `kind` picks the section, `lenses` drive the filter pills, and cards render only the slots an entry fills.
- `selected-systems.ts`: the homepage "From promise to proof" systems
- `work-lenses.ts`: shared Work page lens IDs, labels, and search keywords
- `profile.ts`: hero "How a problem moves" examples and the four How I Operate principles
- `credentials.ts`: certifications (+ optional badge images), LinkedIn Learning certificates, keyword line, publications
- `src/lib/lens.ts`: hero sentence and Selected Work order for `?lens=product` / `?lens=consulting`

**Add, remove, or reorder a project:** append one entry to `projects.ts`, delete it (or set `status: "draft"`), or move it (or set `order`). Drafts never render, never count in filters, and never reach the sitemap, palette, or metadata. Start new entries as drafts and publish once `verification: { state: "verified", source }` is true.

**Validation gate:** `npm test` and `npm run build` both check `projects.ts` (`src/content/validate.ts`). They fail on duplicate ids, unknown lenses, published entries that are unverified or flagged, placeholder text like `[pending]`, "Live demo" links without a real https deployment, glimpses without alt text or a missing file, and two featured entries in one section. Out-of-range proof, architecture, or stack counts only warn.

**Add a case study:** a `kind: "case-study"` entry with a `caseStudy` block gets `/work/<id>`, a sitemap entry, and metadata automatically.

**Add an agent, UI tool, game, or simulation:** a `kind: "agent"` entry. Fill `proofStack` / `architecture` / `beforeAfter` for a full proof card, or just `glimpse` + `links` for a simple one. The deferred systems and Agentforce sit at the end of the file as drafts.

**Add a badge image:** copy it to `public/images/credentials/` using the filename stem in `credentials.ts` (e.g. `cspo.png` or `cspo.jpg`). It appears automatically; add the verification URL as `href`.

**Add a publication or talk:** add it to `publications` in `credentials.ts`. The subsection only appears when the list is non-empty.

**Add a project visual:** put it under `public/images/projects/` and set `glimpse: { type, src, alt }`. Images render as stills; `.mp4` / `.webm` loops render muted and paused until the visitor presses play. A missing file fails the build for published entries.

## Analytics

Components never call a vendor. Links carry `data-track` attributes; one client component (`AnalyticsListener`) forwards them to registered providers.

- GA4: set `NEXT_PUBLIC_GA_ID` (the old site used `G-RXJKP5MVQW`).
- Vercel Analytics: install `@vercel/analytics` and add `<Analytics />` to the layout; custom events already route to it.
- Anything else: `registerAnalyticsProvider((event, props) => …)` in `src/lib/analytics.ts`.

Events: `page_view`, `view_work_click`, `case_study_click`, `external_project_click`, `linkedin_click`, `github_click`, `contact_click`, `work_lens_selected`, `archive_category_expanded`, `archive_project_opened`.

## Deploy

Vercel: import the repo, set `NEXT_PUBLIC_SITE_URL` (and optionally `NEXT_PUBLIC_GA_ID`), deploy. No other configuration.
Any Node host works with `npm run build && npm start`. The `?lens=` rewrite lives in `src/proxy.ts` (Next 16's middleware).

## Homepage structure

Hero → Proof strip → Selected work (bento) → Experience (expandable) → Education & credentials → How I operate + About → Contact.
Each number appears once on the homepage: the proof strip carries the headline results, the bento tiles use different evidence.

## Quick actions (⌘K / Ctrl+K)

`CommandPaletteTrigger` (in the header) is the only always-loaded piece; the dialog itself is code-split and fetched on first open
(or on hover/focus of the trigger). Commands are generated server-side in `src/lib/commands.ts` from the same content as the pages,
so a missing email or profile URL simply means no command for it.

## Fonts

Inter and Source Serif 4 (SIL Open Font License) are self-hosted in `src/app/fonts/` and loaded via `next/font/local`. No third-party font requests.
