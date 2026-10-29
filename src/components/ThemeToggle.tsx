"use client";

import { useEffect, useState } from "react";
import { toggleTheme } from "@/lib/theme";
import { Moon, Sun } from "./Icons";

/** Compact theme control. Icons swap via CSS, so server and client markup always match. */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    // Stay in sync when the theme is changed from the command palette.
    const onChange = (e: Event) => setDark((e as CustomEvent<string>).detail === "dark");
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setDark(toggleTheme() === "dark")}
      aria-pressed={dark ?? undefined}
      aria-label="Dark theme"
      title="Toggle dark theme"
      className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-fg"
    >
      <Moon className="size-[18px] dark:hidden" />
      <Sun className="hidden size-[18px] dark:block" />
    </button>
  );
}
