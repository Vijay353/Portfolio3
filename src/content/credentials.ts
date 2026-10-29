import type { Credential } from "./types";

/**
 * Certifications named in index6.html. The old site had badge images
 * (Images/CSPO01.jpg, LSSGB01.jpg, ITIL01.jpg) but their links were `href="#"`.
 * To show a badge, copy the image to /public/images/credentials/. Missing files are skipped.
 */
export const certifications: Credential[] = [
  {
    name: "Certified Scrum Product Owner (CSPO)",
    href: null,
    badge: { src: "/images/credentials/cspo.jpg", alt: "Certified Scrum Product Owner badge" },
  },
  {
    name: "Lean Six Sigma Green Belt",
    href: null,
    badge: { src: "/images/credentials/lssgb.jpg", alt: "Lean Six Sigma Green Belt badge" },
  },
  {
    name: "ITIL 4",
    href: null,
    badge: { src: "/images/credentials/itil4.jpg", alt: "ITIL 4 certification badge" },
  },
];

/** Course certificates. Links are the real LinkedIn Learning URLs from index6.html; labels match the old site. */
export const courseCertificates: Credential[] = [
  { name: "GenAI", issuer: "LinkedIn Learning", href: "https://www.linkedin.com/learning/certificates/6b2140e9bbdb8e9c4f41ddfb34c509d4d90356b994a8a35e5d7a2e5459047257" },
  { name: "APM", issuer: "LinkedIn Learning", href: "https://www.linkedin.com/learning/certificates/ffb8d80e4642a56e69bb8a088f53506e5979e13d915d5240a5f4834931fa60a6" },
  { name: "ITSM", issuer: "LinkedIn Learning", href: "https://www.linkedin.com/learning/certificates/28775b819d52580481183342639e0dd943176157df26d57857267fcaca04aa09" },
  { name: "Project Management", issuer: "LinkedIn Learning", href: "https://www.linkedin.com/learning/certificates/9675d3b8dae2886fc07bf6ec3e4408671a207eec95b42eaaa89e5dbe0593cc9e" },
  { name: "AZ-500 prep", issuer: "LinkedIn Learning", href: "https://www.linkedin.com/learning/certificates/e9099d54520fcad7b6d6606ede166a48916c25135387951e5c86230714179c2e" },
];

/** Publications and talks. Empty: none exist in the source files, so the subsection is omitted. */
export const publications: Array<{ title: string; venue: string; year: string; href: string | null }> = [];
