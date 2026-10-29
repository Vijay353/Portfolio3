"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { AnalyticsEvent } from "@/lib/analytics";
import { ga4Provider, registerAnalyticsProvider, track, vercelProvider } from "@/lib/analytics";

/**
 * The only analytics code that runs in the browser:
 * - registers whichever providers are configured
 * - sends page_view on every route change
 * - forwards clicks on any element carrying data-track (so links stay server components)
 */
export function AnalyticsListener({ gaEnabled }: { gaEnabled: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = [registerAnalyticsProvider(vercelProvider)];
    if (gaEnabled) cleanups.push(registerAnalyticsProvider(ga4Provider));

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      track(el.dataset.track as AnalyticsEvent, {
        label: el.dataset.trackLabel,
        href: el.getAttribute("href") ?? undefined,
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cleanups.forEach((c) => c());
    };
  }, [gaEnabled]);

  useEffect(() => {
    track("page_view", { page_path: pathname, page_location: window.location.href });
  }, [pathname]);

  return null;
}
