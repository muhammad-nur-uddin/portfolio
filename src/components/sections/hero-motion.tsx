"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Client motion layer for the Hero (Task 05A-3). The Hero stays
 * server-rendered; GSAP is scoped to this subtree via `data-hero` hooks.
 * Under prefers-reduced-motion (or without JS) everything renders in its
 * final, fully visible state. useGSAP() reverts every tween on unmount.
 */
export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Brief staggered entrance. from() keeps the static first paint
        // fully visible; useLayoutEffect applies it before the browser paints.
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
          .from("[data-hero='cta']", { y: 10, opacity: 0, duration: 0.45 }, "-=0.3")
          .from("[data-hero='visual']", { opacity: 0, duration: 0.9 }, 0.1);

        // Ambient motion inside the visual layer (ribbon drift, particle
        // twinkle, fold highlights) is owned by the Ghost Fibers shader
        // (HeroVisual → ghost-fibers.tsx). GSAP handles only the entrance
        // reveal; no competing ambient animation is layered over the shader.
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
