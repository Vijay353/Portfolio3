/**
 * Vendor-neutral analytics.
 *
 * Components never call a vendor. They either call `track()` or mark links with
 * `trackAttrs()`; a single delegated listener (AnalyticsListener) forwards clicks.
 * Providers are plugged in once, so switching GA4 ↔ Vercel Analytics ↔ anything
 * else never touches component code.
 */

export type AnalyticsEvent =
  | "page_view"
  | "view_work_click"
  | "case_study_click"
  | "external_project_click"
  | "linkedin_click"
  | "github_click"
  | "contact_click"
  | "work_lens_selected"
  | "archive_category_expanded"
  | "archive_project_opened";

export type AnalyticsProps = Record<string, string | number | undefined>;
export type AnalyticsProvider = (event: AnalyticsEvent, props: AnalyticsProps) => void;

const providers = new Set<AnalyticsProvider>();

export function registerAnalyticsProvider(provider: AnalyticsProvider): () => void {
  providers.add(provider);
  return () => providers.delete(provider);
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
  for (const provider of providers) {
    try {
      provider(event, props);
    } catch {
      // Analytics must never break the page.
    }
  }
}

/** Data attributes that let a server-rendered link report a click without client JS of its own. */
export function trackAttrs(event: AnalyticsEvent, label?: string) {
  return { "data-track": event, ...(label ? { "data-track-label": label } : {}) } as const;
}

type Gtag = (command: "event", name: string, params: AnalyticsProps) => void;
type VercelVa = (command: "event", payload: { name: string; data: AnalyticsProps }) => void;

/** GA4 via gtag.js (loaded in the root layout only when NEXT_PUBLIC_GA_ID is set). */
export const ga4Provider: AnalyticsProvider = (event, props) => {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", event, props);
};

/** Vercel Web Analytics custom events, if its script is present. */
export const vercelProvider: AnalyticsProvider = (event, props) => {
  const va = (window as unknown as { va?: VercelVa }).va;
  va?.("event", { name: event, data: props });
};
