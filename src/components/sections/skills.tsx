// Section 04 — Technical Skills — Task 08A (rebuilt to match approved A2).
//
// Horizontal 3D technology carousel: a row of front-facing cards, each icon
// rendered as a six-sided brand-colored 3D cube with its logo on every face.
// CSS 3D transforms + plain React only
// (no 3D library, per blueprint §9/§12). Recognizable brand logos and names,
// no fake metrics or proficiency percentages.
//
// Interactions:
//  - Category filter tabs (All / Frontend / Backend / Database / Tools & DevOps)
//  - Previous / next navigation arrows
//  - Mouse + touch dragging (pointer events)
//  - Subtle per-card 3D tilt/scale/depth that tracks the active item
//  - Synchronized active label + progress indicator
//  - Keyboard navigation + prefers-reduced-motion support
//  - Stage clips overflow so there is no horizontal page scroll
//
// Geometry note: the track is translated horizontally to center the active
// card. Each card is given a small rotateY (max 12deg) plus depth/scale based
// on its distance from the active index — a shallow arc. Cards are never
// rotated edge-on, so logos and labels always stay readable (this replaces an
// earlier cylindrical-ring interpretation that collapsed into a thin strip).

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Section, Container } from "@/components/ui/section";
import { SkillsCanvas } from "./skills-canvas";
import {
  skillsByCategory,
  CATEGORIES,
  type SkillCategory,
} from "@/lib/skills";
import "./skills.css";

// Card pitch: fixed card width + gap. Keep in sync with the CSS card width.
const CARD_W = 168;
const GAP = 28;
const PITCH = CARD_W + GAP;

// Shallow-arc 3D tuning (kept modest so cards never go edge-on).
const MAX_TILT = 12; // deg — cap for per-card rotateY
const DEPTH = 26; // px of translateZ per step away from active
const SCALE_STEP = 0.045; // scale falloff per step
const OPACITY_STEP = 0.16; // opacity falloff per step
const MIN_SCALE = 0.82;
// Minimum clear space (px) kept between the outermost visible card and the
// stage clip edge. Sized to exceed how far the nav arrows intrude into the
// stage (sm: ~28px) so a card is never sliced by the clip AND never sits under
// an arrow — keeping buttons clear of icons/labels at every breakpoint.
const EDGE_GUTTER = 36;

// Per-icon 3D rotation tuning (independent of carousel navigation).
const ICON_ROTATION_CAP = 90; // deg — keep icons readable, never fully edge-on

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function Skills() {
  const [category, setCategory] = useState<SkillCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  // Continuous position (allows sub-card drag), snapped to an integer on release.
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  // Per-icon 3D rotation angles (degrees), keyed by skill id. Preserved on release.
  const [iconRotations, setIconRotations] = useState<Record<
    string,
    { rx: number; ry: number }
  >>({});
  // Pointer rotation gestures are owned by the Three.js canvas now; these stay
  // to preserve the canvas prop contract (never mid-gesture / never paused here).
  const [rotatingIconId] = useState<string | null>(null);
  const [iconSpinPaused] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);
  // Measured stage width (px) — drives how many cards fit fully per side.
  const [stageW, setStageW] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartPosition = useRef(0);

  const filtered = useMemo(() => skillsByCategory(category), [category]);
  const count = filtered.length;

  // Track reduced-motion responsively (SSR-safe).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Measure the stage width so the number of fully-visible cards adapts to the
  // viewport (fewer, larger cards on narrow screens; more on wide screens).
  // This prevents any card from being sliced by the stage's overflow clip.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setStageW(w);
    });
    ro.observe(el);
    setStageW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const target = clamp(index, 0, count - 1);
      setActiveIndex(target);
      setPosition(target);
    },
    [count],
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const onCategoryChange = useCallback((key: SkillCategory) => {
    setCategory(key);
    setActiveIndex(0);
    setPosition(0);
  }, []);

  // --- Pointer dragging (covers mouse + touch via pointer events) ---
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      setDragging(true);
      dragStartX.current = e.clientX;
      dragStartPosition.current = position;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [position],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX.current;
      // Dragging left (negative dx) advances to higher indices.
      const nextPos = dragStartPosition.current - dx / PITCH;
      setPosition(clamp(nextPos, -0.4, count - 1 + 0.4));
    },
    [dragging, count],
  );

  const endDrag = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const snapped = clamp(Math.round(position), 0, count - 1);
    setActiveIndex(snapped);
    setPosition(snapped);
  }, [dragging, position, count]);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragging && e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      endDrag();
    },
    [dragging, endDrag],
  );

  // --- Per-icon 3D rotation (isolated from carousel navigation) ---
  const resetIconRotation = useCallback((id: string) => {
    setIconRotations((prev) => ({ ...prev, [id]: { rx: 0, ry: 0 } }));
  }, []);


  // Keyboard navigation on the stage.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next],
  );

  // --- Track + per-card transforms ---
  // The track is anchored at the stage's horizontal center (left:50% in CSS).
  // How many cards fit fully on each side of the active card without being
  // clipped by the stage edge. Falls back to 2 before the stage is measured.
  // Guarantees a balanced viewport: the outermost card always keeps an
  // EDGE_GUTTER-sized margin from the clip edge (never sliced, labels intact).
  const halfStage = stageW / 2;
  const maxFitDelta =
    stageW > 0
      ? Math.max(0, Math.floor((halfStage - CARD_W / 2 - EDGE_GUTTER) / PITCH))
      : 2;

  // Shift it left by the active card's center offset so that card sits centered;
  // translateY(-50%) keeps cards vertically centered in the stage.
  // (Use a px offset — NOT translateX(50%), which is 50% of the track's OWN
  // width and pushed the whole row off-screen for the wide All category.)
  //
  // When near the start or end of the carousel there are fewer cards on one
  // side, so shift the track to keep the visible cards balanced within the
  // stage instead of clustering them to one side.
  const missingLeft = Math.max(0, maxFitDelta - position);
  const missingRight = Math.max(0, maxFitDelta - (count - 1 - position));
  const balanceShift = (missingRight - missingLeft) * (PITCH / 2);
  const trackOffset = -(position * PITCH + CARD_W / 2) + balanceShift;
  const trackTransition =
    dragging || reducedMotion
      ? "none"
      : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

  const activeSkill = filtered[activeIndex];

  // Shallow-arc transform for a card given its distance from the active position.
  const cardTransform = (delta: number) => {
    const abs = Math.abs(delta);
    const tilt = clamp(delta, -1, 1) * MAX_TILT;
    const z = -Math.min(abs, 2) * DEPTH;
    const scale = clamp(1 - abs * SCALE_STEP, MIN_SCALE, 1);
    return {
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${tilt.toFixed(
        1,
      )}deg) scale(${scale.toFixed(3)})`,
      opacity: clamp(1 - abs * OPACITY_STEP, 0, 1),
      transition: dragging || reducedMotion ? "none" : undefined,
    } as React.CSSProperties;
  };

  return (
    <Section id="skills" className="relative scroll-mt-20 pt-20 pb-10 lg:pt-20 lg:pb-10 xl:pt-24 xl:pb-14">
      {/* Restrained cinematic background lighting (blueprint §9: avoid excessive glow). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-xl -translate-x-1/2 rounded-full bg-accent/6 blur-[120px]" />
        <div className="absolute bottom-0 right-[8%] h-64 w-64 rounded-full bg-accent/5 blur-[110px]" />
      </div>

      <Container className="relative z-10">
        {/* Header: eyebrow + title + intro, centered (A2). */}
        <div className="mx-auto max-w-[52ch] text-center">
          <p className="font-mono text-xs font-medium tracking-[0.22em] text-muted uppercase">
            04 <span className="text-accent">—</span> Technical Skills
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight text-fg text-balance">
            The tools behind the{" "}
            <span className="text-accent italic">build.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Technologies I use to turn ideas into real-world applications.
          </p>
        </div>

        {/* Category filters (above the carousel, per A2). */}
        <div
          role="tablist"
          aria-label="Filter skills by category"
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat.key)}
                className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-accent text-white"
                    : "border border-border/70 text-muted hover:border-border hover:text-fg"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </Container>

      {/* Carousel stage. */}
      <div className="relative z-10 mt-6 lg:mt-8">
        <Container>
          <div className="relative">
            {/* Previous / next arrows, vertically centered on the cards. */}
            <button
              type="button"
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Previous skill"
              className="absolute -left-2 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-surface/60 text-muted backdrop-blur transition-colors duration-200 hover:bg-surface hover:text-fg disabled:pointer-events-none disabled:opacity-30 sm:-left-4 lg:-left-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={activeIndex === count - 1}
              aria-label="Next skill"
              className="absolute -right-2 top-[42%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-surface/60 text-muted backdrop-blur transition-colors duration-200 hover:bg-surface hover:text-fg disabled:pointer-events-none disabled:opacity-30 sm:-right-4 lg:-right-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            {/* The stage: perspective + overflow clip. Cards sit on a horizontal
                track that slides to center the active card. */}
            <div
              ref={stageRef}
              data-dragging={dragging}
              role="group"
              aria-roledescription="carousel"
              aria-label="Technology skills carousel"
              tabIndex={0}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="skills-stage h-62.5 outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:h-70 lg:h-75"
              style={{ perspective: "1200px" }}
            >
              <SkillsCanvas
                filteredSkills={filtered}
                position={position}
                activeIndex={activeIndex}
                count={count}
                iconRotations={iconRotations}
                rotatingIconId={rotatingIconId}
                iconSpinPaused={iconSpinPaused}
                reducedMotion={reducedMotion}
                stageWidth={stageW}
              />
              <div
                className="skills-track"
                style={{
                  transform: `translate(${trackOffset.toFixed(2)}px, -50%)`,
                  transition: trackTransition,
                }}
              >
                {filtered.map((skill, index) => {
                                    const delta = index - position;
                  const abs = Math.abs(delta);
                  const isActive = index === activeIndex;
                  const hidden = abs > maxFitDelta;
                  const style = cardTransform(delta);
                  if (hidden) style.opacity = 0;

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      aria-label={skill.name}
                      aria-current={isActive}
                      aria-describedby="skill-rotation-instructions"
                      onClick={() => goTo(index)}
                      onKeyDown={(e) => {
                        if (e.key === "r" || e.key === "R") {
                          e.preventDefault();
                          e.stopPropagation();
                          resetIconRotation(skill.id);
                          return;
                        }
                        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
                          e.preventDefault();
                          e.stopPropagation();
                          const step = 8;
                          const cur = iconRotations[skill.id] ?? { rx: 0, ry: 0 };
                          let nrx = cur.rx;
                          let nry = cur.ry;
                          if (e.key === "ArrowUp") nrx = clamp(cur.rx - step, -ICON_ROTATION_CAP, ICON_ROTATION_CAP);
                          if (e.key === "ArrowDown") nrx = clamp(cur.rx + step, -ICON_ROTATION_CAP, ICON_ROTATION_CAP);
                          if (e.key === "ArrowLeft") nry = clamp(cur.ry - step, -ICON_ROTATION_CAP, ICON_ROTATION_CAP);
                          if (e.key === "ArrowRight") nry = clamp(cur.ry + step, -ICON_ROTATION_CAP, ICON_ROTATION_CAP);
                          setIconRotations((prev) => ({ ...prev, [skill.id]: { rx: nrx, ry: nry } }));
                        }
                      }}
                      className="skills-card group flex flex-col items-center justify-start px-3 pt-6 pb-5 outline-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                      data-active={isActive}
                      style={{
                        ...style,
                        width: CARD_W,
                        marginRight: index === filtered.length - 1 ? 0 : GAP,
                        pointerEvents: hidden ? "none" : "auto",
                        visibility: hidden ? "hidden" : "visible",
                      }}
                    >
                      {/* Label: name + category, always readable (never edge-on). */}
                      <span className="relative z-10 mt-4 flex flex-col items-center gap-1">
                        <span
                          className="font-display text-[0.95rem] leading-tight tracking-tight transition-colors duration-300"
                          style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
                        >
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
                          {skill.category.replace("-", " & ")}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress indicator + drag hint, close to the stage (per A2). */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div
                className="h-1 w-40 overflow-hidden rounded-full bg-border/60 sm:w-56"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={count}
                aria-valuenow={activeIndex + 1}
                aria-label="Carousel progress"
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width,transform] duration-500 ease-out"
                  style={{
                    width: `${count > 0 ? (100 / count).toFixed(2) : 0}%`,
                    transform: `translateX(${count > 0 ? activeIndex * 100 : 0}%)`,
                  }}
                />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {dragging
                  ? "Release to snap"
                  : "Drag stage to navigate · Drag an icon to rotate · Dbl-click/R to reset"}
              </p>
              {/* Accessible rotation instructions referenced by each card button. */}
              <span id="skill-rotation-instructions" className="sr-only">
                Rotate a technology icon: press and drag it in any direction. Reset its orientation: double-click it or press R while it is focused. The Prev/Next arrows navigate the carousel independently.
              </span>
              <span aria-live="polite" className="sr-only">
                {activeSkill ? `${activeSkill.name} selected` : ""}
              </span>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}




