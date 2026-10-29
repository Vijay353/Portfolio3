import { REVIEW_MODE } from "@/lib/review";

type Kind = "verify" | "pending" | "link" | "credential";

const LABEL: Record<Kind, string> = {
  verify: "[verify]",
  pending: "[Content pending]",
  link: "[link pending]",
  credential: "[Credential link pending]",
};

/**
 * Visible only in review mode (dev by default). In production it renders nothing,
 * so unverified claims and placeholders never ship to visitors.
 */
export function ReviewNote({ kind, children }: { kind: Kind; children?: React.ReactNode }) {
  if (!REVIEW_MODE) return null;
  return (
    <span className="review-note" role="note">
      <span>{LABEL[kind]}</span>
      {children ? <span className="font-sans">{children}</span> : null}
    </span>
  );
}
