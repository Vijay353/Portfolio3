import type { Para } from "@/content/types";

/**
 * Review mode surfaces [verify] and [Content pending] markers so claims can be audited.
 * Default: on in development, off in production. Vercel previews can opt in explicitly.
 */
const flag = process.env.NEXT_PUBLIC_REVIEW_MODE;
const isProduction = process.env.NODE_ENV === "production";
const isPreview = process.env.VERCEL_ENV === "preview";
export const REVIEW_MODE = isProduction ? isPreview && flag === "true" : flag ? flag === "true" : true;

/** Text of a paragraph, whichever form it takes. */
export function paraText(p: Para): string {
  return typeof p === "string" ? p : p.text;
}

/** Verification note for a paragraph, if any. */
export function paraVerify(p: Para): string | undefined {
  return typeof p === "string" ? undefined : p.verify;
}

/** Whether a claim should render: unflagged claims always; flagged claims only in review mode. */
export function isVisible(item: { verify?: string } | Para): boolean {
  if (typeof item === "string") return true;
  return !item.verify || REVIEW_MODE;
}

export function visibleParas(paras: Para[] | undefined): Para[] {
  return (paras ?? []).filter(isVisible);
}
