import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { getCaseStudyProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...getCaseStudyProjects().map((p) => ({
      url: `${siteUrl}/work/${p.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
