"use client";

import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { announceCopy } from "./CopyToast";
import type { PaletteCommand } from "@/lib/commands";
import { toggleTheme } from "@/lib/theme";
import { ArrowRight, ArrowUpRight } from "./Icons";

const GROUPS: PaletteCommand["group"][] = ["Go to", "Work", "Case studies", "Actions"];

/**
 * Quick-actions dialog built on cmdk. The native <dialog> opened with showModal() supplies
 * the modal semantics: the page behind is inert (focus stays inside), Escape closes it,
 * and focus returns to the trigger. cmdk supplies the combobox/listbox keyboard model
 * (↑/↓, Home/End, Enter) and typeahead filtering.
 */
export default function CommandPalette({ commands, onClose }: { commands: PaletteCommand[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  function run(cmd: PaletteCommand) {
    if (cmd.event) track(cmd.event, { label: `palette_${cmd.id}`, href: cmd.href });

    if (cmd.kind === "copy" && cmd.value) {
      const email = cmd.value;
      navigator.clipboard.writeText(email).then(
        () => announceCopy({ email, failed: false }),
        () => announceCopy({ email, failed: true }),
      );
      dialogRef.current?.close();
      return;
    }
    if (cmd.kind === "theme") {
      const next = toggleTheme();
      setNotice(`${next === "dark" ? "Dark" : "Light"} theme on`);
      return;
    }
    if (cmd.kind === "print") {
      dialogRef.current?.close();
      // Let the dialog leave the rendering tree before the print snapshot is taken.
      window.setTimeout(() => window.print(), 150);
      return;
    }

    dialogRef.current?.close();

    if (cmd.kind === "archive-project" && cmd.archiveGroup && cmd.archiveAnchor) {
      const detail = { group: cmd.archiveGroup, targetId: cmd.archiveAnchor };
      if (pathname === "/work") {
        window.dispatchEvent(new CustomEvent("work-archive-open", { detail }));
      } else if (cmd.href) {
        // Land on /work first, then open the accordion once the page is mounted.
        navigate(cmd.href);
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("work-archive-open", { detail })), 600);
      }
    } else if (cmd.kind === "work-lens" && cmd.workLens) {
      if (pathname === "/work") {
        window.dispatchEvent(new CustomEvent("work-lens-select", { detail: cmd.workLens }));
      } else if (cmd.href) {
        navigate(cmd.href);
      }
    } else if (cmd.kind === "external" && cmd.href) {
      window.open(cmd.href, "_blank", "noopener,noreferrer");
    } else if (cmd.kind === "navigate" && cmd.href) {
      navigate(cmd.href);
    }
  }

  function navigate(href: string) {
    const [path, hash] = href.split("#");
    const target = path || "/";
    if (hash && target === pathname) {
      history.pushState(null, "", `#${hash}`);
      focusSection(hash);
    } else {
      router.push(href);
      if (hash) setTimeout(() => focusSection(hash), 350);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Quick actions"
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close(); // backdrop click
      }}
    >
      <Command label="Quick actions" loop className="flex flex-col" style={{ maxHeight: "inherit" }}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-subtle">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <Command.Input
            autoFocus
            aria-label="Search pages and actions"
            placeholder="Jump to a page or action…"
            spellCheck={false}
            className="h-13 w-full bg-transparent text-[1rem] text-fg outline-none placeholder:text-subtle"
          />
          <kbd className="kbd shrink-0" aria-hidden>
            esc
          </kbd>
        </div>

        <Command.List className="min-h-0 flex-1 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-[0.9375rem] text-subtle">No matches. Try a project, section, or action.</Command.Empty>
          {GROUPS.map((group) => {
            const items = commands.filter((c) => c.group === group);
            if (!items.length) return null;
            return (
              <Command.Group key={group} heading={group} className="mb-1.5 last:mb-0 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[0.75rem] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-subtle">
                {items.map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    value={`${cmd.label} ${cmd.id}`}
                    keywords={[cmd.group, ...(cmd.keywords ? cmd.keywords.split(/\s+/) : [])]}
                    onSelect={() => run(cmd)}
                    className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-[0.9375rem] text-muted data-[selected=true]:bg-accent-soft data-[selected=true]:text-fg"
                  >
                    <span className="truncate">{cmd.label}</span>
                    {cmd.kind === "external" ? (
                      <ArrowUpRight aria-hidden className="size-3.5 shrink-0 opacity-70" />
                    ) : (
                      <ArrowRight aria-hidden className="size-3.5 shrink-0 opacity-0 data-[selected=true]:opacity-70" />
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2 text-[0.75rem] text-subtle">
          <span aria-hidden className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> move</span>
            <span className="flex items-center gap-1"><kbd className="kbd">↵</kbd> open</span>
          </span>
          <span role="status" aria-live="polite" className="text-fg">
            {notice}
          </span>
        </div>
      </Command>
    </dialog>
  );
}

/** After jumping to a section, move keyboard focus there too (not just the scroll position). */
function focusSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
