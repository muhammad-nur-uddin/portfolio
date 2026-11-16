"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Client motion layer for the Hero.
 * GSAP handles the copy entrance and the single animated role slot. The
 * Energy Flow keeps ownership of its own fallback-to-WebGL transition.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .from("[data-hero='name']", {
            y: 18,
            opacity: 0,
            duration: 0.6,
          })
          .from(
            "[data-hero='role-window']",
            { y: 12, opacity: 0, duration: 0.45 },
            "-=0.32",
          )
          .from(
            "[data-hero='intro']",
            {
              y: 18,
              opacity: 0,
              filter: "blur(6px)",
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.12",
          )
          .from(
            "[data-hero='cta']",
            { y: 10, opacity: 0, duration: 0.45 },
            "-=0.28",
          );

        const roleTrack = scope.current?.querySelector<HTMLElement>(
          "[data-hero='role-track']",
        );

        if (roleTrack) {
          // Four equal rows (the first role is repeated at the end) make a
          // seamless vertical loop: each 25% step advances exactly one role.
          const roleTimeline = gsap.timeline({
            delay: 2.1,
            repeat: -1,
          });

          for (let step = 1; step <= 3; step += 1) {
            roleTimeline
              .to(roleTrack, {
                yPercent: -step * 25,
                opacity: 0,
                duration: 0.32,
                ease: "power1.in",
              })
              .to(roleTrack, {
                opacity: 1,
                duration: 0.34,
                ease: "power2.out",
              })
              .to({}, { duration: 2.15 });
          }
        }
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
