"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav";

/**
 * Sections in page order. `operate` shares the About nav item.
 * The active item is whichever section occupies the upper third of the viewport.
 */
const SPY_TARGETS = [
  { id: "work", href: "/work" },
  { id: "experience", href: "/#experience" },
  { id: "about", href: "/#about" },
  { id: "operate", href: "/#about" },
  { id: "contact", href: "/#about" },
] as const;

/**
 * Primary navigation. On pages that render the home sections the link for the
 * section in the upper third of the viewport gets the accent colour and
 * underline; on other pages the link whose route matches is active.
 */
export function HeaderNav() {
  const pathname = usePathname();
  const isSpyPage = pathname === "/" || pathname.startsWith("/lens");
  const [spyHref, setSpyHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isSpyPage) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight / 3;
      let current: string | null = null;
      for (const t of SPY_TARGETS) {
        const el = document.getElementById(t.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = t.href;
      }
      setSpyHref(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isSpyPage, pathname]);

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-x-5 md:gap-x-6">
        {NAV_ITEMS.map((item) => {
          const active = isSpyPage
            ? spyHref === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "mono inline-flex min-h-11 items-center text-[0.875rem] transition-colors hover:text-white hover:underline hover:underline-offset-4",
                  active ? "text-white underline underline-offset-4" : "text-white/60",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
