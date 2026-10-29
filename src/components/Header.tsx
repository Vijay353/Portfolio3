import Link from "next/link";
import { site } from "@/content/site";
import { getPaletteCommands } from "@/lib/commands";
import { CommandPaletteTrigger } from "./CommandPaletteTrigger";
import { HeaderNav } from "./HeaderNav";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

/** Floating dark pill. It stays dark in both themes; the page theme, palette, and toggle are untouched. */
export function Header() {
  return (
    <header className="sticky top-3 z-40 md:top-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="container-page">
        <div className="header-dark relative flex h-14 items-center justify-between gap-4 rounded-full bg-[#111] pr-2 pl-5 text-white shadow-[0_16px_40px_-20px_rgb(0_0_0/0.6)] md:h-16 md:pr-3 md:pl-6">
          <Link href="/" className="mono text-[1.0625rem] font-medium tracking-tight text-white">
            {site.shortName}
          </Link>

          <div className="flex min-w-0 items-center gap-1">
            <HeaderNav />
            <div className="ml-1 flex items-center gap-1 border-l border-white/15 pl-2 md:ml-2 md:pl-3">
              <CommandPaletteTrigger commands={getPaletteCommands()} />
              <ThemeToggle />
            </div>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
