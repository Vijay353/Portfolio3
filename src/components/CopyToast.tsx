"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TOAST_MS = 2000;
const EVENT = "copy-toast";

export type CopyToastDetail = { email: string; failed: boolean };

/** Call after a copy attempt; the CopyToastHost mounted in the layout shows the toast. */
export function announceCopy(detail: CopyToastDetail) {
  window.dispatchEvent(new CustomEvent<CopyToastDetail>(EVENT, { detail }));
}

/**
 * Shared bottom-right confirmation for copy actions (email buttons and the command palette).
 * Shows for two seconds and offers one secondary action, opening the mail app explicitly.
 */
export function CopyToastHost() {
  const [state, setState] = useState<CopyToastDetail | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onCopy = (event: Event) => {
      setState((event as CustomEvent<CopyToastDetail>).detail);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState(null), TOAST_MS);
    };
    window.addEventListener(EVENT, onCopy);
    return () => {
      window.removeEventListener(EVENT, onCopy);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      <AnimatePresence>
        {state ? (
          <motion.div
            key="toast"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-line-strong bg-surface py-2 pr-2 pl-4 text-[0.875rem] text-fg shadow-lg"
          >
            <span>{state.failed ? "Copy blocked. Use Open mail app" : "Copied email to clipboard"}</span>
            <a
              href={`mailto:${state.email}`}
              onClick={() => setState(null)}
              className="rounded-full bg-accent-soft px-3 py-1 text-[0.8125rem] font-semibold text-accent hover:underline"
            >
              Open mail app
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
