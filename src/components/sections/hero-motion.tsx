"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Client motion layer for the Hero. GSAP animates the copy and CTA only.
 * The Energy Flow controls its own fallback-to-WebGL readiness transition,
 * so the visual is never hidden during the initial page paint.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .from("[data-hero='eyebrow']", { y: 12, opacity: 0, duration: 0.45 })
          .from(
            "[data-hero='headline']",
            { y: 16, opacity: 0, duration: 0.55 },
            "-=0.3",
          )
          .from(
            "[data-hero='intro']",
            { y: 12, opacity: 0, duration: 0.45 },
            "-=0.32",
          )
          .from(
            "[data-hero='cta']",
            { y: 10, opacity: 0, duration: 0.45 },
            "-=0.3",
          );

        // The visual is intentionally not animated here. HeroVisual keeps a
        // polished fallback visible until the first WebGL frame is ready.
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
