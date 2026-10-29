/**
 * Site-wide facts and links.
 *
 * Every value here must be real. Unknown values stay `null` and render as
 * "[link pending]" in review mode (and are hidden in production).
 * Fill these in before deploying. They are the fastest wins on the site.
 */
export const site = {
  name: "Vijay Kumar",
  shortName: "Vijay Kumar",
  initials: "VK",
  role: "Product & Solutions",

  /** One-line positioning. Rewritten from the core story in the brief. */
  positioning: "I make enterprise software work for the people who have to use it.",

  description:
    "Vijay Kumar, Product & Solutions professional connecting users, business decisions, and enterprise systems. Previously FactSet and Configit; product strategy and UX at the University at Buffalo.",

  /** [link pending]. The old site used contact@vijaykumar.com, which looks like a placeholder. */
  email: null as string | null,
  linkedin: "https://www.linkedin.com/in/vk902/" as string | null,
  github: "https://github.com/Vijay353" as string | null,
  /** From index6.html. */
  credly: "https://www.credly.com/users/vijay-kumar-banoth" as string | null,

  /** Copy Images/mypic.jpg from the old site to public/images/headshot.jpg. */
  headshot: {
    src: "/images/headshot1.jpg",
    alt: "Portrait of Vijay Kumar",
  },

  education: [
    {
      degree: "M.S., Management Information Systems (STEM)",
      school: "University at Buffalo",
      year: "2025",
    },
    {
      degree: "B.Tech., Computer Science & Engineering",
      school: "MNIT Jaipur",
      year: "2018",
    },
  ],
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
