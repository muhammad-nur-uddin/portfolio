// Verified project data — Task 07A.
//
// Only facts confirmed by the blueprint (docs/portfolio-blueprint.md §8) and
// the approved Projects direction live here. Nothing may be invented:
//  - demoUrl / repoUrl stay `null` until real, verified URLs exist. The UI
//    renders those actions as disabled placeholders rather than wiring an
//    invented link (same convention as the Hero Resume CTA).
//  - Screenshots: no genuine captures exist in `public/` yet; the homepage
//    uses built HTML/CSS previews with structural placeholder data.

export type ProjectId = "finvia" | "nebula";

export type Project = {
  id: ProjectId;
  /** Zero-padded journey index, e.g. "01". */
  index: string;
  name: string;
  /** Short editorial title shown under the index. */
  tagline: string;
  /** Concise homepage description — details live on the case-study route. */
  description: string;
  /** Verified technology stack only — never padded for the layout. */
  tech: string[];
  caseStudyHref: string;
  demoUrl: string | null; // TBD — not yet verified.
  repoUrl: string | null; // TBD — not yet verified.
  /** Decorative rocket-journey milestone beside the trajectory rail. */
  milestone: { number: string; slogan: string };
};

export const projects: Project[] = [
  {
    id: "finvia",
    index: "01",
    name: "Finvia",
    tagline: "Invoice & Finance SaaS",
    description:
      "An invoice and business finance SaaS for managing invoices, clients, and financing workflows — with multi-role access and real-time insights across the product.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    caseStudyHref: "/case-studies/finvia",
    demoUrl: null,
    repoUrl: null,
    milestone: { number: "01", slogan: "Ship real solutions" },
  },
  {
    id: "nebula",
    index: "02",
    name: "Nebula",
    tagline: "Real-time Communication",
    description:
      "A real-time communication platform with live chat, online presence, typing indicators, and media sharing for seamless team collaboration.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.IO"],
    caseStudyHref: "/case-studies/nebula",
    demoUrl: null,
    repoUrl: null,
    milestone: { number: "02", slogan: "Build better together" },
  },
];
