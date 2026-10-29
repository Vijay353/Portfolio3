"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Close, Menu } from "./Icons";
import { NAV_ITEMS } from "./nav";

/**
 * Mobile menu: a plain disclosure panel under the header.
 * Closes on link click, route change, Escape, or tapping outside. Focus returns to the button.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        {open ? <Close className="size-5" /> : <Menu className="size-5" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="header-dark absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border border-white/10 bg-[#111]/95 p-2 text-white shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] backdrop-blur"
      >
        <nav aria-label="Mobile" className="px-2 py-1">
          <ul className="flex flex-col">
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }}
                className="mono flex min-h-12 w-full items-center justify-between border-b border-white/10 text-[1rem] font-medium text-white"
              >
                Search
                <span aria-hidden className="flex items-center gap-1">
                  <kbd className="kbd">⌘</kbd>
                  <kbd className="kbd">K</kbd>
                </span>
              </button>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="mono flex min-h-12 items-center border-b border-white/10 text-[1rem] font-medium text-white/80 last:border-0 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
