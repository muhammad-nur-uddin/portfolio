"use client";

// Rocket journey — Task 07A. Projects content stays server-rendered (passed
// in as children); this narrowly scoped client component owns only the
// trajectory rail and the scroll-linked rocket. A single scrubbed GSAP
// timeline (ScrollTrigger + MotionPathPlugin from the installed gsap) moves
// the rocket along the path and paints the trail behind it — progress is
// tied strictly to scroll (no pinning, no hijacking, no independent play).
// The rocket faces its actual direction of travel — tangent-aligned, with a
// smooth flip when the scroll direction reverses (Task 07A-2) — and the
// milestone closest to its current stage stays highlighted.
// Under prefers-reduced-motion (or without JS) the static state is
// meaningful: full trail, rocket at launch, stage 01 milestone marked.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** Trajectory in rail viewBox units (160 × 1000, stretched to rail height).
 * Clearly curved S-curve: leaves Finvia at top center, swings right through
 * the journey's middle, then returns to center at Nebula — so the rocket's
 * tangent rotation is meaningful in both scroll directions.
 */
const RAIL_D =
  "M 80 12 C 120 200, 120 500, 80 700 C 40 900, 40 980, 80 988";

export function ProjectsJourney({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        const rocket = root?.querySelector<SVGSVGElement>("[data-rocket]");
        const path = root?.querySelector<SVGPathElement>("[data-rail-path]");
        const trail = root?.querySelector<SVGPathElement>("[data-rail-trail]");
        const trailCore = root?.querySelector<SVGPathElement>(
          "[data-rail-trail-core]"
        );
        const glow = root?.querySelector<SVGCircleElement>("[data-engine-glow]");
        const milestones = gsap.utils.toArray<HTMLElement>("[data-milestone]");
        if (!root || !rocket || !path || !trail || !trailCore) return;

        const cores = milestones.map((m) => m.querySelector<HTMLElement>(".milestone-core"));
        const dots = milestones.map((m) => m.querySelector<HTMLElement>(".milestone-dot"));
        const setMilestone = (i: number, active: boolean) => {
          gsap.to(cores[i], {
            backgroundColor: active ? "#4169e1" : "#293246",
            scale: active ? 1.3 : 1,
            duration: 0.25,
            overwrite: "auto",
          });
          gsap.to(dots[i], {
            borderColor: active ? "rgba(65,105,225,0.85)" : "#293246",
            boxShadow: active ? "0 0 14px rgba(65,105,225,0.5)" : "none",
            duration: 0.25,
            overwrite: "auto",
          });
        };

        const length = trail.getTotalLength();
        gsap.set(trail, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(trailCore, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // --- Direction-aware orientation (Task 07A-2) -----------------------
        // The rocket artwork's nose points UP in its own box, so once aligned
        // to the path a rotation of (screen-space tangent + 90°) aims it along
        // travel; travelling backwards adds 180°. The rail SVG is stretched
        // (preserveAspectRatio="none"), so the tangent is measured through the
        // path's screen CTM — raw viewBox angles would be visibly skewed.
        const DEG = 180 / Math.PI;
        const tangentDeg = (p: number): number => {
          const ctm = path.getScreenCTM();
          if (!ctm) return 90; // degenerate: face straight down the rail
          const total = path.getTotalLength();
          const at = (l: number) => {
            const pt = path.getPointAtLength(Math.min(Math.max(l, 0), total));
            return {
              x: ctm.a * pt.x + ctm.c * pt.y + ctm.e,
              y: ctm.b * pt.x + ctm.d * pt.y + ctm.f,
            };
          };
          const eps = Math.max(total * 0.005, 2);
          const a = at(p * total - eps);
          const b = at(p * total + eps);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          return dx === 0 && dy === 0 ? 90 : Math.atan2(dy, dx) * DEG;
        };

        let lastProgress = 0;
        let travelDir: 1 | -1 = 1; // last meaningful direction — retained at rest
        let pendingDir: 1 | -1 | 0 = 0; // hysteresis: sustained reverse before flipping
        let pendingAmt = 0;
        let activeStage = -1;

        // Persistent retargetable setter (quickTo): one internal tween that
        // eases between orientation targets — no snapping when the scroll
        // direction flips, no per-frame tween stacking, and no time-based
        // motion of its own: it only ever chases scroll-derived targets.
        const setRotation = gsap.quickTo(rocket, "rotation", {
          duration: 0.28,
          ease: "power1.out",
        });

        // Closest-milestone highlight, driven by the same journey progress —
        // no second timeline.
        const setStage = (idx: number) => {
          if (activeStage === idx) return;
          activeStage = idx;
          setMilestone(0, idx === 0);
          setMilestone(1, idx === 1);
        };

        gsap.set(rocket, { rotation: tangentDeg(0) + 90, transformOrigin: "50% 50%" });
        setStage(0);

        // One scrubbed timeline, one trigger — progress mirrors scroll.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top 55%", end: "bottom 65%", scrub: 0.6 },
        });
        tl.fromTo(
          rocket,
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.42], start: 0, end: 0 } },
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.42], start: 0, end: 1 } },
          0,
        ).to(trail, { strokeDashoffset: 0 }, 0).to(trailCore, { strokeDashoffset: 0 }, 0);

        // Journey progress → orientation + milestone state (same timeline as
        // position and trail). Hysteresis keeps micro-oscillation from
        // flipping the rocket as scroll velocity approaches zero; a flip
        // requires ~0.4% of sustained reverse travel and is then eased.
        tl.eventCallback("onUpdate", () => {
          const p = tl.progress();
          const delta = p - lastProgress;
          lastProgress = p;
          if (Math.abs(delta) > 1e-6) {
            const dir: 1 | -1 = delta > 0 ? 1 : -1;
            if (dir === travelDir) {
              pendingDir = 0;
              pendingAmt = 0;
            } else {
              if (pendingDir !== dir) {
                pendingDir = dir;
                pendingAmt = 0;
              }
              pendingAmt += Math.abs(delta);
              if (pendingAmt > 0.004) {
                travelDir = dir;
                pendingDir = 0;
                pendingAmt = 0;
              }
            }
            setRotation(tangentDeg(p) + 90 + (travelDir === -1 ? 180 : 0));
          }
          setStage(p < 0.5 ? 0 : 1);
        });

        // Restrained engine illumination — one small flicker, same context.
        if (glow) {
          gsap.to(glow, {
            opacity: 0.5,
            duration: 0.85,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative" data-journey>
      {/* Trajectory rail — decorative, behind content, clipped to section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-14 select-none sm:w-16 lg:w-40"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 160 1000"
          preserveAspectRatio="none"
          fill="none"
          focusable="false"
        >
          <defs>
            <linearGradient id="rail-grad" gradientUnits="userSpaceOnUse" x1="80" y1="0" x2="80" y2="1000">
              <stop offset="0" stopColor="#4169e1" />
              <stop offset="0.72" stopColor="#4169e1" />
              <stop offset="1" stopColor="#00e5ff" />
            </linearGradient>
            <filter id="rail-glow" x="-40%" y="-8%" width="180%" height="116%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          {/* Soft atmospheric glow along the route. */}
          <path
            d={RAIL_D}
            stroke="url(#rail-grad)"
            strokeOpacity="0.28"
            strokeWidth="7"
            vectorEffect="non-scaling-stroke"
            filter="url(#rail-glow)"
          />
          {/* Faint dashed guide (static, always visible). */}
          <path
            d={RAIL_D}
            stroke="url(#rail-grad)"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bright trail painted by scroll progress — restrained stroke. */}
          <path
            data-rail-trail
            d={RAIL_D}
            stroke="url(#rail-grad)"
            strokeWidth="1.25"
            strokeOpacity="0.35"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Illuminated blue core along the trail, painted by scroll progress. */}
          <path
            data-rail-trail-core
            d={RAIL_D}
            stroke="#00e5ff"
            strokeWidth="0.6"
            strokeOpacity="0.55"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Subtle decorative particles along the rail (static, always visible). */}
          <circle
            cx="110"
            cy="340"
            r="1.5"
            fill="#00e5ff"
            opacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="80"
            cy="500"
            r="1.5"
            fill="#00e5ff"
            opacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="50"
            cy="680"
            r="1.5"
            fill="#00e5ff"
            opacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="80"
            cy="860"
            r="1.5"
            fill="#00e5ff"
            opacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          {/* Hidden geometry used by MotionPathPlugin for alignment. */}
          <path data-rail-path d={RAIL_D} stroke="none" />
        </svg>


        {/* Milestones — closest-stage highlight (Task 07A-2). Static default:
            stage 01 active (rocket parked at launch), stage 02 subdued but
            visible; under animation GSAP retargets the same accent/subdued
            states from journey progress — never both lit at once. */}
        {projects.map((project, i) => (
          <div
            key={project.id}
            data-milestone={i}
            className="absolute flex items-center gap-2 lg:gap-3"
            style={{ top: i === 0 ? "27%" : "86%" }}
          >
            <span
              className={
                "milestone-dot flex h-3 w-3 items-center justify-center rounded-full border bg-bg lg:h-3.5 lg:w-3.5 " +
                (i === 0
                  ? "border-accent/80 shadow-[0_0_14px_rgba(65,105,225,0.5)]"
                  : "border-border")
              }
            >
              <span
                className={
                  "milestone-core h-1.5 w-1.5 rounded-full " +
                  (i === 0 ? "scale-125 bg-accent" : "bg-border")
                }
              />
            </span>
            <span className="hidden lg:flex lg:flex-col">
              <span className="font-mono text-sm font-medium text-fg">
                {project.milestone.number}
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                {project.milestone.slogan}
              </span>
            </span>
          </div>
        ))}

        {/* Rocket — parked at the trajectory start (facing down-path) for the
            static render; GSAP repositions it along the path and orients it
            to its travel direction while scrolling. */}
        <RocketGlyph />
      </div>

      {children}
    </div>
  );
}

/**
 * Stylized rocket — custom layered SVG (no emoji, no 3D dependency).
 * Nose up at the rail's left center for the static render; positioned
 * along the trajectory by MotionPathPlugin while scrolling.
 */
function RocketGlyph() {
  return (
    <svg
      data-rocket
      viewBox="0 0 64 64"
      fill="none"
      focusable="false"
      aria-hidden="true"
      className="absolute top-[1%] left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-[42%] will-change-transform sm:h-14 sm:w-14 lg:h-16 lg:w-16"
    >
      <defs>
        <linearGradient id="rk-body" x1="24" y1="4" x2="41" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f7f6f2" />
          <stop offset="1" stopColor="#c3ccdf" />
        </linearGradient>
        <linearGradient id="rk-fin" x1="16" y1="34" x2="24" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4169e1" />
          <stop offset="1" stopColor="#3458cc" />
        </linearGradient>
        <linearGradient id="rk-nose" x1="26" y1="3" x2="38" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5b8aff" />
          <stop offset="1" stopColor="#4169e1" />
        </linearGradient>
        <radialGradient id="rk-window" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#9be9ff" />
          <stop offset="1" stopColor="#4169e1" />
        </radialGradient>
        <linearGradient id="rk-plume" x1="32" y1="52" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00e5ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#4169e1" stopOpacity="0" />
        </linearGradient>
        <filter id="rk-glow" x="-120%" y="-60%" width="340%" height="260%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>
      {/* Engine illumination + exhaust plume (behind the body). */}
      <circle
        data-engine-glow
        cx="32"
        cy="57"
        r="6.5"
        fill="#4169e1"
        opacity="0.65"
        filter="url(#rk-glow)"
      />
      <path d="M28.5 52 L35.5 52 C 35.2 57 33.6 61.5 32 64 C 30.4 61.5 28.8 57 28.5 52 Z" fill="url(#rk-plume)" />
      {/* Fins. */}
      <path d="M24 33 L15.5 47.2 C 15.1 48 15.7 48.9 16.6 48.9 L24 48.9 Z" fill="url(#rk-fin)" />
      <path d="M40 33 L48.5 47.2 C 48.9 48 48.3 48.9 47.4 48.9 L40 48.9 Z" fill="url(#rk-fin)" />
      {/* Engine bell. */}
      <path d="M27.5 48 L36.5 48 L35 53 L29 53 Z" fill="#293246" />
      {/* Body. */}
      <path
        d="M32 3 C 37 9 40 17 40 26 L40 44 C 40 46.8 38.2 48.6 35.4 48.6 L28.6 48.6 C 25.8 48.6 24 46.8 24 44 L24 26 C 24 17 27 9 32 3 Z"
        fill="url(#rk-body)"
      />
      {/* Nose accent. */}
      <path d="M32 3 C 34.6 6.6 36.4 10.8 37.4 15 L26.6 15 C 27.6 10.8 29.4 6.6 32 3 Z" fill="url(#rk-nose)" />
      {/* Window + glint. */}
      <circle cx="32" cy="23.5" r="4.6" fill="url(#rk-window)" />
      <circle cx="30.4" cy="22" r="1.4" fill="#f7f6f2" opacity="0.75" />
      {/* Surface highlights — metallic ivory sheen (left) + edge shade (right). */}
      <path d="M28.6 13.5 C 27.1 18.5 26.6 23 26.6 29 L26.6 42.5" stroke="#f7f6f2" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M36.6 14.5 C 37.7 19.5 37.9 24 37.9 30 L37.9 43" stroke="#31415f" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      {/* Accent hull stripe. */}
      <rect x="24.8" y="36.5" width="14.4" height="2.2" rx="1.1" fill="#4169e1" opacity="0.85" />
    </svg>
  );
}
