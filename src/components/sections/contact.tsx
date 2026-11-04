"use client";

import { useRef, useState } from "react";
import { Container, Section } from "@/components/ui/section";
import { CONTACT_EMAIL, CONTACT_GITHUB_URL, CONTACT_LINKEDIN_URL } from "@/lib/site";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Contact() {
  const scope = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .from("[data-contact='eyebrow']", { y: 12, opacity: 0, duration: 0.45 })
          .from("[data-contact='headline']", { y: 16, opacity: 0, duration: 0.55 }, "-=0.3")
          .from("[data-contact='support']", { y: 12, opacity: 0, duration: 0.45 }, "-=0.32")
          .from("[data-contact='cta']", { y: 10, opacity: 0, duration: 0.45 }, "-=0.3")
          .from("[data-contact='email']", { y: 8, opacity: 0, duration: 0.4 }, "-=0.28")
          .from("[data-contact='socials']", { y: 8, opacity: 0, duration: 0.4 }, "-=0.25");
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      <Section id="contact" className="relative overflow-hidden py-section lg:py-section-lg">
        {/* Subtle CSS radial glow echoing Hero's blue atmospheric field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(65,105,225,0.12), transparent 60%)",
          }}
        />
        <Container className="relative z-10 flex flex-col items-center gap-6 text-center lg:gap-8">
          <p
            data-contact="eyebrow"
            className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase"
          >
            Get in touch
          </p>
          <h2
            data-contact="headline"
            className="max-w-[24ch] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tight text-fg text-balance"
          >
            Let&apos;s build something reliable.
          </h2>
          <p
            data-contact="support"
            className="max-w-[48ch] text-lg leading-relaxed text-muted"
          >
            I&apos;m open to junior backend and backend-focused full-stack
            opportunities, along with thoughtful collaborations.
          </p>
          <div data-contact="cta" className="flex flex-col items-center gap-3">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=muhammadnur.codes@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-ivory transition-colors duration-200 ease-out-soft hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
            >
              Email me
            </a>
            <span
              data-contact="email"
              className="flex items-center gap-2 font-mono text-sm text-muted"
            >
              {CONTACT_EMAIL}
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied email address" : "Copy email address"}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-muted transition-colors duration-200 ease-out-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {copied ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Copied!" : ""}
              </span>
            </span>
          </div>
          <div
            data-contact="socials"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-6"
          >
            <a
              href={CONTACT_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 ease-out-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C19.3 4.9 20.3 5.2 20.3 5.2c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
              </svg>
              GitHub
            </a>
            <a
              href={CONTACT_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 ease-out-soft hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </Container>
      </Section>
    </div>
  );
}