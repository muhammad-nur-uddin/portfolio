import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Container, Section } from "@/components/ui/section";
import { projects } from "@/lib/projects";

const project = projects.find((p) => p.id === "finvia")!;

export const metadata: Metadata = {
  title: "Finvia — Invoice & Finance SaaS Case Study",
  description:
    "Case study: Finvia, an invoice and business finance SaaS for managing invoices, clients, and financing workflows with multi-role access and real-time insights. Built with Next.js, TypeScript, PostgreSQL, and Prisma.",
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

export default function FinviaCaseStudy() {
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
                  {project.name} is an invoice and business finance SaaS: a single place for
                  businesses to manage invoices, client records, and financing workflows, with
                  multi-role access and real-time insights across the product.
                </p>
              </CaseBlock>

              <CaseBlock label="Problem">
                <p>
                  Invoice, client, and financing work is easy to scatter across separate tools and
                  handoffs. {project.name} addresses that by keeping the whole flow — issuing and
                  tracking invoices, managing clients, and moving financing requests forward — in
                  one product with role-aware access.
                </p>
              </CaseBlock>

              <CaseBlock label="Implementation">
                <p>
                  The product is built with Next.js and TypeScript, using PostgreSQL as the system
                  of record accessed through Prisma. Detailed implementation notes (auth flow,
                  testing strategy, deployment) are being documented — TBD.
                </p>
              </CaseBlock>

              <CaseBlock label="Architecture">
                <p>
                  Next.js application layer · TypeScript across the stack · PostgreSQL data layer
                  via Prisma ORM. A more detailed architecture breakdown (data model, API surface,
                  role model) is pending documentation — TBD.
                </p>
              </CaseBlock>

              <CaseBlock label="Key features">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Invoice management and tracking</li>
                  <li>Client management</li>
                  <li>Financing workflows</li>
                  <li>Multi-role access</li>
                  <li>Real-time insights across the dashboard</li>
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
