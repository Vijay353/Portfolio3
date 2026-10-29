"use client";

import { track } from "@/lib/analytics";
import { ArrowRight } from "./Icons";
import { announceCopy } from "./CopyToast";

/**
 * Email actions that copy the address instead of opening a mailto: link.
 * A bottom-right toast confirms the copy for two seconds and offers one
 * secondary action, opening the mail app explicitly.
 */
export function EmailCopy({ email, variant }: { email: string; variant: "address" | "cta" }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      track("contact_click", { label: "copy_email" });
      announceCopy({ email, failed: false });
    } catch {
      // Clipboard blocked: the shared toast offers opening the mail app instead.
      announceCopy({ email, failed: true });
    }
  }

  return (
    <>
      {variant === "address" ? (
        <button
          type="button"
          onClick={copy}
          className="link break-all text-left"
          aria-label={`Copy email address ${email}`}
        >
          {email}
        </button>
      ) : (
        <button type="button" onClick={copy} className="btn btn-primary group self-start md:self-end">
          Email me
          <ArrowRight className="nudge size-6" />
        </button>
      )}

    </>
  );
}
