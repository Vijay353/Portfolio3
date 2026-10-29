import Link from "next/link";
import { site } from "@/content/site";
import { getPaletteCommands } from "@/lib/commands";
import { CommandPaletteTrigger } from "./CommandPaletteTrigger";
import { HeaderNav } from "./HeaderNav";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

/** Sticky, 56px tall, present without eating the viewport. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="container-page relative flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="font-serif text-[1.25rem] font-semibold tracking-tight text-fg">
          {site.shortName}
        </Link>

        <div className="flex items-center gap-1">
          <HeaderNav />
          <div className="ml-2 flex items-center gap-1 border-l border-line pl-3 md:ml-4">
            <CommandPaletteTrigger commands={getPaletteCommands()} />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
