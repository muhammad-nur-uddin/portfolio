import { Container, Section } from "@/components/ui/section";
import { HeroMotion } from "./hero-motion";
import { HeroVisual } from "./hero-visual";

// Approved copy — Task 05A-1. Derived only from verified facts; no invented
// claims or metrics.
const eyebrow = "BACKEND-FOCUSED FULL-STACK DEVELOPER";
const headline = "Building web applications from database to interface.";
const intro =
  "I build full-stack web applications with TypeScript, Next.js, Node.js, and PostgreSQL, with a focus on backend systems and dependable APIs.";

export function Hero() {
  return (
    <HeroMotion>
      <Section className="relative flex min-h-[90svh] items-center overflow-hidden py-0 pt-16 lg:pt-20 pb-0">
        {/* z-10 (no `relative` — that would re-anchor the absolute HeroVisual
            layer to this 1200px container instead of the full-width section). */}
        <Container className="z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="flex flex-col items-start gap-6 lg:gap-8">
            <p
              data-hero="eyebrow"
              className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase"
            >
              {eyebrow}
            </p>
            <h1
              data-hero="headline"
              className="max-w-[42ch] font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight text-fg text-balance"
            >
              {headline}
            </h1>
            <p data-hero="intro" className="max-w-[56ch] text-lg leading-relaxed text-muted">
              {intro}
            </p>
            <div
              data-hero="cta"
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <a
                href="#projects"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-ivory transition-colors duration-200 ease-out-soft hover:bg-accent-hover"
              >
                View Projects
              </a>
              {/* Temporary placeholder — reserved for the Resume CTA. Replace
                  this non-interactive button with a real link once a verified
                  Resume URL/asset exists (blueprint §3.3 / §13). Never wire an
                  invented URL. */}
              <button
                type="button"
                disabled
                aria-disabled="true"
                aria-label="Resume — link pending"
                className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full border border-dashed border-border px-7 text-sm font-medium text-muted opacity-60 select-none"
              >
                Resume
              </button>
            </div>
          </div>
          {/* Decorative Flowing Energy layer. Anchored to the right edge,
              bleeding past the content container to the viewport edge.
              Left-edge CSS fade keeps the headline area readable. */}
          <HeroVisual className="pointer-events-none mx-auto w-full max-w-[440px] sm:max-w-[520px] lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2 lg:max-w-none lg:mx-0 lg:min-h-[90svh]" />
        </Container>
      </Section>
    </HeroMotion>
  );
}

