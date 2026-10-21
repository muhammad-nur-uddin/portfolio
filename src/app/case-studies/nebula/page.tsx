import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Container, Section } from "@/components/ui/section";
import { projects } from "@/lib/projects";

const project = projects.find((p) => p.id === "nebula")!;

export const metadata: Metadata = {
  title: "Nebula — Real-time Communication Case Study",
  description:
    "Case study: Nebula, a real-time communication platform with live chat, online presence, typing indicators, and media sharing for team collaboration. Built with React, Node.js, Express, MongoDB, and Socket.IO.",
};

/** Case-study sub-section shell — mono label + content. */
function CaseBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/50 pt-8">
      <h2 className="font-mono text-xs tracking-widest text-accent uppercase">{label}</h2>
      <div className="mt-4 max-w-[68ch] space-y-4 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function NebulaCaseStudy() {
  return (
    <>
      <Header />
      <main>
        <Section className="relative pt-24 lg:pt-28">
          <Container className="relative z-10">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted uppercase transition-colors duration-200 ease-out-soft hover:text-fg"
            >
              ← Back to projects
            </Link>

            <header className="mt-10 mb-12 flex flex-col gap-4">
              <p className="font-mono text-sm font-medium tracking-[0.18em] text-accent uppercase">
                {project.index} <span className="text-muted">/ {project.name}</span> — Case study
              </p>
              <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] tracking-tight text-fg">
                {project.tagline}
              </h1>
              <p className="max-w-[56ch] text-lg leading-relaxed text-muted">
                {project.description}
              </p>
            </header>

            <div className="flex flex-col gap-10 lg:gap-12">
              <CaseBlock label="Overview">
                <p>
                  {project.name} is a real-time communication platform for teams: live chat in
                  channels and direct messages, online presence, typing indicators, and media
                  sharing — the collaboration basics kept instant and dependable.
                </p>
              </CaseBlock>

              <CaseBlock label="Problem">
                <p>
                  Team communication only works when everyone sees the same state at the same
                  time. {project.name} focuses on that real-time layer — messages, presence, and
                  shared files staying in sync across everyone in a conversation.
                </p>
              </CaseBlock>

              <CaseBlock label="Implementation">
                <p>
                  The client is built with React; the server runs on Node.js and Express, with
                  Socket.IO handling the real-time layer (messages, presence, typing indicators)
                  and MongoDB persisting conversations and media. Detailed implementation notes
                  (auth flow, scaling strategy, deployment) are being documented — TBD.
                </p>
              </CaseBlock>

              <CaseBlock label="Architecture">
                <p>
                  React front end · Node.js + Express API layer · Socket.IO real-time transport ·
                  MongoDB persistence. A more detailed architecture breakdown (socket event model,
                  data model, media handling) is pending documentation — TBD.
                </p>
              </CaseBlock>

              <CaseBlock label="Key features">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Live chat with channels and direct messages</li>
                  <li>Online presence</li>
                  <li>Typing indicators</li>
                  <li>Media / file sharing</li>
                </ul>
              </CaseBlock>

              <CaseBlock label="Technology stack">
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
              </CaseBlock>

              <CaseBlock label="Links">
                <p>
                  Live demo URL and public repository — TBD. They will be linked here once verified;
                  no placeholder or invented URLs are wired in the meantime.
                </p>
              </CaseBlock>
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
