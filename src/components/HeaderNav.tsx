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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Honor a deep link (e.g. /#experience) by scrolling to that section smoothly.
    const initial = window.location.hash.slice(1);
    if (initial && SPY_TARGETS.some((t) => t.id === initial)) {
      document.getElementById(initial)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }

    // A section is "current" while it crosses the top 30% of the viewport.
    const visible = new Set<string>();
    let currentId: string | null = null;
    const commit = () => {
      // The last section in page order that is inside the band wins.
      const id = SPY_TARGETS.map((t) => t.id).filter((x) => visible.has(x)).pop() ?? null;
      if (id === currentId) return;
      currentId = id;
      const target = SPY_TARGETS.find((t) => t.id === id);
      setSpyHref(target ? target.href : null);
      // Keep the address bar in sync without adding history entries or jumping.
      if (id) history.replaceState(null, "", `#${id}`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        commit();
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    for (const t of SPY_TARGETS) {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isSpyPage, pathname]);

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-x-6">
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
                  "inline-flex min-h-11 items-center text-[0.9375rem] font-medium transition-colors hover:text-accent hover:underline hover:underline-offset-4",
                  active ? "text-accent underline underline-offset-4" : "text-muted",
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
