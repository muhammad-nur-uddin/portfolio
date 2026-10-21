import { Container, Section } from "@/components/ui/section";
import { ProjectsJourney } from "./projects-journey";
import { FinviaPreview, NebulaPreview } from "./project-previews";
import { projects, type Project } from "@/lib/projects";

// Approved copy — Task 07A. Derived only from verified project information
// (blueprint §8 + approved direction); no invented metrics or claims.
const headingPart1 = "From ideas to ";
const headingHighlight = "impact.";
const intro =
  "A closer look at two products I've designed and built end to end — from the database schema to the interface. Each focuses on practical problems, dependable structure, and useful software.";

/** Editorial overview column: index, title, description, tags, actions. */

/**
 * Project action (blueprint §8): a functional link when a verified URL
 * exists, otherwise a visible, non-clickable disabled placeholder — same
 * convention as the Hero Resume CTA. Never wires an invented URL.
 */
function ProjectAction({ href, label }: { href: string | null; label: string }) {
  if (href) {
    return (
      <a
        href={href}
        className="inline-flex h-11 items-center rounded-full border border-border/70 bg-surface/5 px-6 text-sm font-medium text-muted transition-colors duration-200 ease-out-soft hover:bg-surface/10"
      >
        {label}
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      aria-label={`${label} — link pending`}
      className="inline-flex h-11 cursor-not-allowed items-center rounded-full border border-dashed border-border px-6 text-sm font-medium text-muted opacity-60 select-none"
    >
      {label}
    </button>
  );
}
function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <p className="font-mono text-xs tracking-widest uppercase">
        <span className="font-medium text-accent">{project.index}</span>
        <span className="text-muted"> / {project.name.toUpperCase()}</span>
      </p>
      <h3 className="font-display text-[1.6rem] leading-tight tracking-tight text-fg lg:text-[1.9rem]">
        {project.tagline}
      </h3>
      <p className="max-w-[46ch] text-muted leading-relaxed">{project.description}</p>
      <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border/70 px-3 py-1 font-mono text-[11px] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Real destination — the case-study route. */}
        <a
          href={project.caseStudyHref}
          className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-ivory transition-colors duration-200 ease-out-soft hover:bg-accent-hover"
        >
          Read case study
        </a>
        {/* Live Demo / View Code: functional link when a verified URL exists,
            visible disabled placeholder otherwise (blueprint §8 — no fake
            URLs, no click affordance while pending). */}
        <ProjectAction href={project.demoUrl} label="Live Demo" />
        <ProjectAction href={project.repoUrl} label="View Code" />
      </div>
    </div>
  );
}

/** Deterministic star positions — subtle, restrained density. */
const stars = [
  { top: "5%", left: "14%", o: 0.5 },
  { top: "9%", left: "46%", o: 0.35 },
  { top: "4%", left: "72%", o: 0.45 },
  { top: "16%", left: "88%", o: 0.3 },
  { top: "22%", left: "8%", o: 0.4 },
  { top: "30%", left: "60%", o: 0.3 },
  { top: "38%", left: "94%", o: 0.4 },
  { top: "48%", left: "50%", o: 0.25 },
  { top: "58%", left: "90%", o: 0.35 },
  { top: "66%", left: "70%", o: 0.3 },
  { top: "78%", left: "96%", o: 0.4 },
  { top: "88%", left: "80%", o: 0.3 },
];

export function Projects() {
  const [finvia, nebula] = projects;

  return (
    <Section
      id="projects"
      className="relative overflow-hidden scroll-mt-16 pt-14 pb-10 lg:pt-16 lg:pb-12 xl:pt-20 xl:pb-14"
    >
      {/* Deep-space environment: restrained stars, blue atmospheric lighting,
          and a dark terrain/cloud silhouette along the lower edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-ivory"
            style={{ top: s.top, left: s.left, opacity: s.o }}
          />
        ))}
        <div className="absolute -top-24 right-[12%] h-80 w-80 rounded-full bg-accent/[0.07] blur-[120px]" />
        <div className="absolute top-1/3 -left-24 h-96 w-96 rounded-full bg-accent/[0.06] blur-[130px]" />
        <div className="absolute bottom-10 left-[4%] h-40 w-56 rounded-full bg-accent/10 blur-[90px]" />
        <svg
          className="absolute bottom-0 left-0 h-40 w-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 96 C 180 64, 340 120, 520 112 C 700 104, 820 60, 1020 84 C 1220 108, 1320 96, 1440 88 L1440 160 L0 160 Z"
            fill="#0b1327"
          />
          <path
            d="M0 122 C 220 98, 420 140, 640 132 C 860 124, 1080 94, 1440 118 L1440 160 L0 160 Z"
            fill="#0d1730"
          />
        </svg>
      </div>

      {/* Section chrome + introduction. */}
      <Container className="relative z-10">
        <div className="mb-8 flex items-center justify-between gap-4 lg:mb-10">
          <div className="flex items-center gap-4">
            <p className="font-mono text-sm font-medium tracking-[0.18em] text-accent uppercase">
              03 <span className="text-muted">/ Projects</span>
            </p>
            <span className="hidden h-px w-20 bg-border sm:block lg:w-28" aria-hidden="true" />
          </div>
          <span className="font-mono text-xs tracking-wider text-muted uppercase">
            Real projects. Real impact.
          </span>
        </div>
        <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] tracking-tight text-fg text-balance">
          {headingPart1}
          <span className="text-accent">{headingHighlight}</span>
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">{intro}</p>
      </Container>

      {/* Journey: rocket rail (client) + the two featured projects. */}
      <Container className="relative z-10 mt-12 lg:mt-16">
        <ProjectsJourney>
          <div className="pl-14 sm:pl-16 lg:pl-48">
            {/* 01 — Finvia: preview left, overview right. */}
            <article
              data-project="finvia"
              className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
            >
              <FinviaPreview />
              <ProjectOverview project={finvia} />
            </article>

            <div className="my-10 border-t border-border/50 lg:my-14" aria-hidden="true" />

            {/* 02 — Nebula: overview left, preview right (reversed rhythm). */}
            <article
              data-project="nebula"
              className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12"
            >
              <ProjectOverview project={nebula} />
              <NebulaPreview />
            </article>
          </div>
        </ProjectsJourney>
      </Container>
    </Section>
  );
}
