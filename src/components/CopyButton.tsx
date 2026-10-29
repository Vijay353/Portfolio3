"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/** Copies text; the result is announced through a polite live region and shown inline for 2s. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      track("contact_click", { label: "copy_email" });
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="mono inline-flex min-h-8 items-center rounded-md border border-line px-2 text-[0.75rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
      >
        {status === "copied" ? "Copied" : "Copy"}
        <span className="sr-only"> {label}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? `${label} copied to clipboard` : status === "failed" ? "Copy failed" : ""}
      </span>
    </span>
  );
}
