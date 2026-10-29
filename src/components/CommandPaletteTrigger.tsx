"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { PaletteCommand } from "@/lib/commands";

// The dialog is code-split: nothing beyond this small trigger loads until first use.
const loadPalette = () => import("./CommandPalette");
const CommandPalette = dynamic(loadPalette, { ssr: false });

/** Header entry point + global ⌘K / Ctrl+K shortcut. */
export function CommandPaletteTrigger({ commands }: { commands: PaletteCommand[] }) {
  const [open, setOpen] = useState(false);
  const [mod, setMod] = useState<"⌘" | "Ctrl" | null>(null);

  useEffect(() => {
    setMod(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl");
    const openPalette = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens the palette when the visitor is not typing somewhere.
      const target = e.target as HTMLElement | null;
      const typing =
        !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    // The mobile menu has no trigger button, so it opens the palette through this event.
    window.addEventListener("open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={loadPalette}
        onFocus={loadPalette}
        title="Quick actions: jump to pages, open profiles, copy email, and switch theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        className="hidden min-h-9 items-center gap-2 rounded-md border border-line px-2 text-[0.8125rem] text-subtle transition-colors hover:border-line-strong hover:text-fg md:inline-flex"
      >
        <span className="sr-only">Open quick actions</span>
        <span aria-hidden className="flex items-center gap-1">
          <kbd className="kbd">{mod ?? "⌘"}</kbd>
          <kbd className="kbd">K</kbd>
        </span>
      </button>
      {open ? <CommandPalette commands={commands} onClose={close} /> : null}
    </>
  );
}
