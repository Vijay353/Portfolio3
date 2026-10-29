"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { PaletteCommand } from "@/lib/commands";
import { toggleTheme } from "@/lib/theme";
import { ArrowRight, ArrowUpRight } from "./Icons";

const GROUPS: PaletteCommand["group"][] = ["Go to", "Work", "Case studies", "Actions"];

/**
 * Quick-actions dialog. A native <dialog> opened with showModal() gives real modal
 * semantics: the page behind is inert (focus stays inside) and Escape closes it.
 * The input is a combobox controlling a listbox; ↑/↓ move, Enter runs, Home/End jump.
 */
export default function CommandPalette({ commands, onClose }: { commands: PaletteCommand[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const baseId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const available = commands.filter((command) => !command.workPageOnly || pathname === "/work");
    const matched = q
      ? available.filter((command) => {
          const terms = q.split(/\s+/).filter(Boolean);
          const words = `${command.label} ${command.group} ${command.keywords ?? ""}`
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(Boolean);
          return terms.every((term) => words.some((word) => term.length < 3 ? word === term : word.startsWith(term)));
        })
      : available;
    // Keep group order stable so the list doesn't jump around.
    return GROUPS.flatMap((g) => matched.filter((c) => c.group === g));
  }, [commands, pathname, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    inputRef.current?.focus();
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const optionId = (i: number) => `${baseId}-opt-${i}`;

  function run(cmd: PaletteCommand) {
    if (cmd.event) track(cmd.event, { label: `palette_${cmd.id}`, href: cmd.href });

    if (cmd.kind === "copy" && cmd.value) {
      navigator.clipboard.writeText(cmd.value).then(
        () => setNotice("Email address copied"),
        () => setNotice("Copy failed"),
      );
      return; // stay open so the confirmation is seen and announced
    }
    if (cmd.kind === "theme") {
      const next = toggleTheme();
      setNotice(`${next === "dark" ? "Dark" : "Light"} theme on`);
      return;
    }

    dialogRef.current?.close();

    if (cmd.kind === "archive-project" && cmd.archiveGroup && cmd.archiveAnchor) {
      window.dispatchEvent(new CustomEvent("work-archive-open", { detail: { group: cmd.archiveGroup, targetId: cmd.archiveAnchor } }));
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

  function onKeyDown(e: React.KeyboardEvent) {
    const last = results.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i >= last ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? last : i - 1));
    } else if (e.key === "Home" && results.length) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && results.length) {
      e.preventDefault();
      setActive(last);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[active];
      if (cmd) run(cmd);
    }
  }

  let index = -1;

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
      <div className="flex flex-col" style={{ maxHeight: "inherit" }}>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-subtle">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${baseId}-list`}
            aria-activedescendant={results.length ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Search pages and actions"
            placeholder="Jump to a page or action…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            className="h-13 w-full bg-transparent text-[1rem] text-fg outline-none placeholder:text-subtle"
          />
          <kbd className="kbd shrink-0" aria-hidden>
            esc
          </kbd>
        </div>

        <div ref={listRef} id={`${baseId}-list`} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-[0.9375rem] text-subtle">No matches for "{query}"</p>
          ) : (
            GROUPS.map((group) => {
              const items = results.filter((c) => c.group === group);
              if (!items.length) return null;
              const gid = `${baseId}-${group.replace(/\s/g, "")}`;
              return (
                <div key={group} role="group" aria-labelledby={gid} className="mb-1.5 last:mb-0">
                  <div id={gid} className="px-3 pt-2 pb-1 text-[0.75rem] font-medium text-subtle">
                    {group}
                  </div>
                  {items.map((cmd) => {
                    index += 1;
                    const i = index;
                    const selected = i === active;
                    return (
                      <div
                        key={cmd.id}
                        id={optionId(i)}
                        role="option"
                        aria-selected={selected}
                        data-index={i}
                        onMouseMove={() => !selected && setActive(i)}
                        onClick={() => run(cmd)}
                        className={
                          "flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-[0.9375rem] " +
                          (selected ? "bg-accent-soft text-fg" : "text-muted")
                        }
                      >
                        <span className="truncate">{cmd.label}</span>
                        {cmd.kind === "external" ? (
                          <ArrowUpRight className="size-3.5 shrink-0 opacity-70" />
                        ) : selected ? (
                          <ArrowRight className="size-3.5 shrink-0 opacity-70" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2 text-[0.75rem] text-subtle">
          <span aria-hidden className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> move</span>
            <span className="flex items-center gap-1"><kbd className="kbd">↵</kbd> open</span>
          </span>
          <span role="status" aria-live="polite" className="text-fg">
            {notice}
          </span>
        </div>
      </div>
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
