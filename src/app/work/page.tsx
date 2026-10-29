import type { Metadata } from "next";
import { WorkIndex } from "@/components/WorkIndex";
import { WorkLensProvider } from "@/components/WorkLens";
import { caseStudyHref, getAgentEntries, getArchiveGroups, getCaseStudyEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Agentic systems, delivery case studies, and an archive of earlier work by Vijay Kumar: each claim tied to the tests, writes, and outcomes that back it.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work" },
};

export default function WorkPage() {
  const cases = getCaseStudyEntries().map((project) => ({ project, href: caseStudyHref(project) }));
  const archive = getArchiveGroups();

  return (
    <WorkLensProvider>
      <header className="container-page pt-12 pb-6 md:pt-20 md:pb-8">
        <p className="eyebrow mb-3">Work</p>
        <h1 className="font-serif text-[2.5rem] leading-tight font-semibold tracking-tight text-fg md:text-[3.25rem]">
          From promise to proof
        </h1>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
          Agentic systems first, each with the engineering proof behind its claims. Then delivery case studies, then a compact archive of earlier product, data, and audit work.
        </p>
      </header>

      <WorkIndex agents={getAgentEntries()} cases={cases} archive={archive} />
    </WorkLensProvider>
  );
}
