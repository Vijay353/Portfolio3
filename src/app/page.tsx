import { HomePage } from "@/components/HomePage";
import { experience } from "@/content/experience";
import { site, siteUrl } from "@/content/site";

/** Person structured data: genuinely useful for name searches; nothing else is marked up. */
function personJsonLd() {
  const sameAs = [site.linkedin, site.github, site.credly].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    description: site.description,
    alumniOf: site.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    worksFor: { "@type": "Organization", name: experience[experience.length - 1].organization },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      <HomePage lens="default" />
    </>
  );
}
