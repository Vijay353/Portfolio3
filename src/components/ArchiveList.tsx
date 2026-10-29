"use client";

import { archiveAnchor, matchesLens } from "@/content/query";
import type { ArchiveGroup, LinkSpec, ProjectEntry } from "@/content/types";
import { Disclosure } from "./Disclosure";
import { SmartLink } from "./SmartLink";
import { useWorkLens } from "./WorkLens";

/**
 * Quiet archive: each category stays available in a collapsed disclosure.
 * A table on wide screens, stacked rows on phones. Year and link columns appear only when there is data.
 */
export function ArchiveList({ groups }: { groups: Array<{ group: ArchiveGroup; items: ProjectEntry[] }> }) {
  const { activeLens } = useWorkLens();
  const all = groups.flatMap((g) => g.items);
  const showYear = all.some((i) => i.timeframe);
  const showLink = all.some((i) => i.links);

  return (
    <div className="space-y-6">
      {groups.map(({ group, items }) => (
        (() => {
          const matches = activeLens === "all" ? items.length : items.filter((item) => matchesLens(item, activeLens)).length;
          const count = activeLens === "all"
            ? `${items.length} ${items.length === 1 ? "project" : "projects"}`
            : `${items.length} projects · ${matches} match this lens`;

          return (
            <Disclosure
              key={group}
              headingLevel={3}
              className="border-t border-line"
              header={
                <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className={"eyebrow " + (matches ? "" : "font-normal")}>{group}</span>
                  <span className="chip tabular-nums">{count}</span>
                </span>
              }
              analyticsEvent="archive_category_expanded"
              analyticsLabel={group}
              archiveGroup={group}
            >
              <table className="w-full border-collapse text-left text-[0.9375rem]">
                <thead className="sr-only md:not-sr-only">
                  <tr className="border-b border-line text-[0.8125rem] text-subtle">
                    <th scope="col" className="py-2 pr-6 font-medium md:w-[26%]">Project</th>
                    <th scope="col" className="py-2 pr-6 font-medium">Description</th>
                    <th scope="col" className="py-2 pr-6 font-medium md:w-[22%]">Outcome</th>
                    {showYear ? <th scope="col" className="py-2 pr-6 font-medium">Year</th> : null}
                    {showLink ? <th scope="col" className="py-2 font-medium"><span className="sr-only">Link</span></th> : null}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      id={archiveAnchor(item)}
                      data-lens-item="true"
                      data-lenses={item.lenses.join(" ")}
                      className="flex flex-col gap-1 border-b border-line py-4 md:table-row md:py-0"
                    >
                      <th scope="row" className="font-medium text-fg md:py-3.5 md:pr-6 md:align-top">
                        {item.title}
                        <ul className="mt-1 flex flex-wrap gap-1" aria-label={`${item.title} tags`}>
                          {(item.tags ?? []).slice(0, 3).map((tag) => (
                            <li key={tag} className="chip">{tag}</li>
                          ))}
                        </ul>
                      </th>
                      <td className="leading-relaxed text-muted md:py-3.5 md:pr-6 md:align-top">{item.positioning}</td>
                      <td className="text-fg md:py-3.5 md:pr-6 md:align-top">{item.outcome}</td>
                      {showYear ? <td className="text-subtle tabular-nums md:py-3.5 md:pr-6 md:align-top">{item.timeframe ?? ""}</td> : null}
                      {showLink ? (
                        <td className="md:py-3.5 md:align-top md:whitespace-nowrap">
                          {item.links ? (
                            <SmartLink href={linkHref(item.links[0])} track="external_project_click" trackLabel={item.title} className="link">
                              {item.links[0].label}
                            </SmartLink>
                          ) : null}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Disclosure>
          );
        })()
      ))}
    </div>
  );
}

const linkHref = (link: LinkSpec) => ("repo" in link ? link.repo : link.href);
