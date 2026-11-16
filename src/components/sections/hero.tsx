import { Container, Section } from "@/components/ui/section";
import { HeroMotion } from "./hero-motion";
import { HeroVisual } from "./hero-visual";

const roles = [
  "Full Stack Developer",
  "AI Application Developer",
  "Cloud & DevOps Developer",
] as const;

const intro =
  "I build full-stack applications and AI-powered systems with TypeScript, Next.js, LangChain, and LangGraph, focusing on RAG and scalable backend architecture.";

export function Hero() {
  return (
    <HeroMotion>
      <Section className="relative flex min-h-[90svh] items-center overflow-hidden py-0 pt-16 pb-0 lg:pt-20">
        <Container className="z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="flex w-full flex-col items-start gap-7 lg:gap-8">
            <div className="flex w-full flex-col items-start gap-4 lg:gap-4">
              <h1
                data-hero="name"
                className="w-max max-w-none overflow-visible pr-6 font-display text-[clamp(3rem,5.2vw,4.75rem)] font-black italic leading-[0.86] tracking-[-0.065em]"
              >
                <span className="block w-max whitespace-nowrap pr-6 bg-[linear-gradient(112deg,#fffdf8_8%,#dceaff_54%,#83b9ff_100%)] bg-clip-text text-transparent drop-shadow-[0_5px_22px_rgba(78,143,255,0.2)]">
                  Muhammad
                </span>

                <span className="block w-max origin-left scale-x-[1.21] whitespace-nowrap pr-6 bg-[linear-gradient(112deg,#fffdf8_8%,#dceaff_54%,#83b9ff_100%)] bg-clip-text text-transparent drop-shadow-[0_5px_22px_rgba(78,143,255,0.2)]">
                  Nur Uddin
                </span>
              </h1>

              <div
                data-hero="role-window"
                className="relative h-[1.35em] w-full overflow-hidden font-display text-[clamp(1.25rem,2.15vw,1.75rem)] font-semibold leading-none tracking-[-0.035em] text-[#7DB7FF]"
              >
                <span className="sr-only absolute">
                  Professional roles: {roles.join(", ")}.
                </span>

                <div
                  data-hero="role-track"
                  aria-hidden="true"
                  className="will-change-transform"
                >
                  {[...roles, roles[0]].map((role, index) => (
                    <p
                      key={`${role}-${index}`}
                      className="flex h-[1.35em] items-center whitespace-nowrap text-inherit"
                    >
                      {role}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <p
              data-hero="intro"
              className="max-w-[56ch] text-lg leading-relaxed text-muted"
            >
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

              <a
                href="/Md%20Nur%20Uddin%20-%20Full%20Stack%20Developer%20Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in a new tab"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-7 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Resume
              </a>
            </div>
          </div>

          <HeroVisual className="pointer-events-none mx-auto w-full max-w-[440px] sm:max-w-[520px] lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:h-full lg:min-h-[90svh] lg:w-1/2 lg:max-w-none" />
        </Container>
      </Section>
    </HeroMotion>
  );
}
