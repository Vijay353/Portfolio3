import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page py-6 text-[0.9375rem] font-medium text-fg">
        United States · Responds within 24 hours
      </div>
      <div className="container-page flex flex-col gap-3 pb-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex gap-5">
          <li><Link className="link text-subtle" href="/work">All work</Link></li>
          <li><Link className="link text-subtle" href="/#contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
