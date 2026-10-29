import type { Lens } from "@/content/types";
import { Contact } from "./Contact";
import { Credentials } from "./Credentials";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Hero } from "./Hero";
import { About, Operate } from "./Operate";
import { WorkBento } from "./WorkBento";

/**
 * Homepage, shared by / and the lens variants. Four sections:
 * Hero → Selected work → Background & approach → Connect.
 */
export function HomePage({ lens }: { lens: Lens }) {
  return (
    <>
      <div className="bg-surface">
        <Hero lens={lens} />
      </div>

      <section aria-labelledby="work-title" id="work" className="scroll-mt-20 bg-bg">
        <div className="container-page py-8 md:py-12">
          <div className="mb-8 max-w-[52rem]">
            <p className="eyebrow mb-2">Selected work</p>
            <h2 id="work-title" className="font-serif text-[1.875rem] leading-tight font-semibold tracking-tight text-fg md:text-[2.25rem]">
              From promise to proof
            </h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              Four agentic systems I took from a painful problem to a working, cloud-deployed vertical slice, each with full architecture, simulated enterprise backends, and a test suite that proves the claims.
            </p>
          </div>
          <WorkBento />
        </div>
      </section>

      <section aria-labelledby="experience-title" id="experience" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="container-page pt-8 pb-6 md:pt-12 md:pb-8">
          <div className="mb-5 grid gap-2 md:mb-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <p className="eyebrow mb-2">Background</p>
              <h2 id="experience-title" className="font-serif text-[1.875rem] leading-tight font-semibold tracking-tight text-fg md:text-[2.25rem]">
                Where I learned it
              </h2>
            </div>
            <p className="self-end text-[1rem] leading-relaxed text-muted md:col-span-8">
              Client-facing fintech, then enterprise delivery, then product strategy, UX, and analytics. Open a row for detail.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <ExperienceTimeline />
            </div>
            <div className="md:col-span-5">
              <Credentials />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-bg">
        <div className="container-page py-8 md:py-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start md:gap-12">
            <About />
            <Operate />
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-surface">
        <div className="container-page py-8 md:py-10">
          <Contact />
        </div>
      </div>
    </>
  );
}
