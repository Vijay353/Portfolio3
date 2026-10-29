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
        className="inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-accent-soft"
      >
        {open ? <Close className="size-5" /> : <Menu className="size-5" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-[0_12px_24px_-16px_rgb(0_0_0/0.25)]"
      >
        <nav aria-label="Mobile" className="container-page py-3">
          <ul className="flex flex-col">
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }}
                className="flex min-h-12 w-full items-center justify-between border-b border-line text-[1.0625rem] font-medium text-fg"
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
                  className="flex min-h-12 items-center border-b border-line text-[1.0625rem] font-medium text-fg last:border-0"
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
