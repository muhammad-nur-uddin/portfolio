"use client";

import { useEffect, useRef, useState } from "react";
import { Section, Container } from "@/components/ui/section";

type GamePhase = "ready" | "playing" | "gameover";

function MoleCharacter() {
  return (
    <svg
      viewBox="0 0 140 140"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Soft body shading */}
        <radialGradient id="mole-fur" cx="38%" cy="25%" r="78%">
          <stop offset="0%" stopColor="#D5A078" />
          <stop offset="48%" stopColor="#A97450" />
          <stop offset="100%" stopColor="#67432F" />
        </radialGradient>

        <radialGradient id="mole-face" cx="38%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#D7A47C" />
          <stop offset="70%" stopColor="#A87551" />
          <stop offset="100%" stopColor="#855537" />
        </radialGradient>

        <radialGradient id="mole-ear">
          <stop offset="0%" stopColor="#F3B6A0" />
          <stop offset="75%" stopColor="#D58F78" />
          <stop offset="100%" stopColor="#805039" />
        </radialGradient>

        <radialGradient id="mole-muzzle" cx="40%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#FFF0D9" />
          <stop offset="100%" stopColor="#D9A58A" />
        </radialGradient>

        <radialGradient id="mole-eye">
          <stop offset="0%" stopColor="#51404A" />
          <stop offset="100%" stopColor="#15121B" />
        </radialGradient>

        <linearGradient id="mole-nose" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#81545B" />
          <stop offset="100%" stopColor="#39252D" />
        </linearGradient>

        <filter id="mole-depth" x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dy="4" result="shadow" />
          <feComponentTransfer in="shadow" result="shadow">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#mole-depth)">
        {/* Ears */}
        <circle cx="28" cy="51" r="19" fill="#75472F" />
        <circle cx="28" cy="51" r="12" fill="url(#mole-ear)" />
        <ellipse cx="24" cy="47" rx="5" ry="4" fill="#FFE0C5" opacity="0.35" />

        <circle cx="112" cy="51" r="19" fill="#75472F" />
        <circle cx="112" cy="51" r="12" fill="url(#mole-ear)" />
        <ellipse cx="108" cy="47" rx="5" ry="4" fill="#FFE0C5" opacity="0.35" />

        {/* Body */}
        <path
          d="M12 135C9 103 13 65 38 43C51 29 89 29 102 43C127 65 131 103 128 135C98 147 42 147 12 135Z"
          fill="url(#mole-fur)"
        />

        {/* Main Head */}
        <ellipse
          cx="70"
          cy="78"
          rx="51"
          ry="55"
          fill="url(#mole-face)"
          stroke="#764B35"
          strokeWidth="1.5"
        />

        {/* Forehead highlight */}
        <ellipse
          cx="53"
          cy="45"
          rx="22"
          ry="9"
          fill="#F5D2AC"
          opacity="0.16"
          transform="rotate(-18 53 45)"
        />

        {/* Side shading */}
        <ellipse cx="29" cy="87" rx="8" ry="22" fill="#593B30" opacity="0.12" />
        <ellipse
          cx="111"
          cy="87"
          rx="8"
          ry="22"
          fill="#593B30"
          opacity="0.12"
        />

        {/* Eyes */}
        <ellipse cx="50" cy="74" rx="10" ry="12" fill="#FFF4DE" />
        <ellipse cx="90" cy="74" rx="10" ry="12" fill="#FFF4DE" />

        <ellipse cx="52" cy="76" rx="5.5" ry="7" fill="url(#mole-eye)" />
        <ellipse cx="92" cy="76" rx="5.5" ry="7" fill="url(#mole-eye)" />

        <circle cx="54" cy="73" r="2.7" fill="white" />
        <circle cx="94" cy="73" r="2.7" fill="white" />

        {/* Muzzle */}
        <ellipse cx="70" cy="98" rx="29" ry="21" fill="url(#mole-muzzle)" />

        <ellipse cx="70" cy="88" rx="17" ry="5" fill="white" opacity="0.18" />

        {/* Nose */}
        <path
          d="M62 89Q70 83 78 89Q78 97 70 97Q62 97 62 89Z"
          fill="url(#mole-nose)"
        />

        <ellipse cx="67" cy="88" rx="3" ry="1.7" fill="#F9D4D0" opacity="0.5" />

        {/* Smile */}
        <path
          d="M70 97C67 105 57 105 54 99M70 97C73 105 83 105 86 99"
          stroke="#644044"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <g
          stroke="#EED0B3"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        >
          <path d="M42 95L20 90M42 101L19 105M98 95L120 90M98 101L121 105" />
        </g>

        {/* Blushing cheeks */}
        <ellipse cx="37" cy="94" rx="7" ry="4" fill="#DB8D83" opacity="0.45" />
        <ellipse cx="103" cy="94" rx="7" ry="4" fill="#DB8D83" opacity="0.45" />
      </g>
    </svg>
  );
}

/* Cartoon Hammer */

function HammerCharacter() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hammer-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#63402A" />
          <stop offset="35%" stopColor="#C48A53" />
          <stop offset="70%" stopColor="#E3B77E" />
          <stop offset="100%" stopColor="#765035" />
        </linearGradient>

        <linearGradient id="hammer-head" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0CE9A" />
          <stop offset="35%" stopColor="#C58B54" />
          <stop offset="100%" stopColor="#785032" />
        </linearGradient>

        <linearGradient id="hammer-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#AD7746" />
          <stop offset="100%" stopColor="#583A26" />
        </linearGradient>

        <filter id="hammer-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset in="blur" dy="4" result="offset" />
          <feComponentTransfer in="offset">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#hammer-shadow)">
        {/* Handle */}
        <path
          d="M49 45L65 45L77 111Q78 119 70 121L61 122Q54 122 53 115Z"
          fill="url(#hammer-wood)"
          stroke="#583A26"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Handle highlight */}
        <path
          d="M54 56L67 109"
          stroke="#F7DBA7"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Hammer head side */}
        <rect
          x="8"
          y="19"
          width="104"
          height="40"
          rx="12"
          fill="url(#hammer-side)"
          stroke="#543722"
          strokeWidth="3"
        />

        {/* Main head */}
        <rect
          x="8"
          y="14"
          width="104"
          height="36"
          rx="11"
          fill="url(#hammer-head)"
          stroke="#70482F"
          strokeWidth="3"
        />

        {/* Head highlight */}
        <path
          d="M21 23H98"
          stroke="#FFF0CC"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Wood grain */}
        <path
          d="M22 32C38 29 48 35 65 31C77 28 89 31 99 28"
          stroke="#95603D"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />

        <path
          d="M26 39H55"
          stroke="#F5D7AC"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Side bevel */}
        <path
          d="M16 45H104"
          stroke="#69452C"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

type MoleHoleProps = {
  index: number;
  hasMole: boolean;
  isHit: boolean;
  disabled: boolean;
  onHit: (index: number) => void;
};

function MoleHole({ index, hasMole, isHit, disabled, onHit }: MoleHoleProps) {
  return (
    <button
      type="button"
      disabled={disabled || !hasMole || isHit}
      onClick={() => onHit(index)}
      aria-label={
        hasMole
          ? `Mole in hole ${index + 1}. Whack it!`
          : `Empty mole hole ${index + 1}`
      }
      className="relative aspect-square min-w-0 w-full touch-manipulation rounded-full bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#101A2B] disabled:cursor-default"
    >
      {/* Outer wooden rim */}
      <div className="absolute inset-x-[5%] bottom-[10%] h-[37%] rounded-[50%] border-[3px] border-[#75553B] bg-gradient-to-b from-[#A77A52] to-[#60452F] shadow-[0_5px_10px_rgba(0,0,0,0.35)]" />

      {/* Inner recessed hole */}
      <div className="absolute inset-x-[10%] bottom-[13%] h-[30%] rounded-[50%] border border-[#080D18] bg-[#080D18] shadow-[inset_0_5px_12px_rgba(0,0,0,0.9)]" />

      {/* Mole Character */}
      {hasMole && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-[9%] bottom-[16%] z-10 mx-auto w-[82%] [filter:drop-shadow(0_-6px_7px_rgba(0,0,0,0.35))] ${
            isHit
              ? "mole-funny-defeat"
              : "transition-transform duration-300 ease-out"
          }`}
        >
          <MoleCharacter />

          {/* Dizzy Stars */}
          {isHit && (
            <div className="pointer-events-none absolute inset-0">
              <span className="dizzy-star star-one">✦</span>
              <span className="dizzy-star star-two">✦</span>
              <span className="dizzy-star star-three">✦</span>
              <span className="hit-score-pop" aria-hidden="true">
                +10
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hammer Swing */}
      {isHit && (
        <div
          aria-hidden="true"
          className="whack-hammer pointer-events-none absolute -right-[12%] -top-[18%] z-30 aspect-square w-[100%]"
        >
          <HammerCharacter />
        </div>
      )}

      {/* Front wooden rim */}
      <div className="pointer-events-none absolute inset-x-[5%] bottom-[10%] z-20 h-[37%] rounded-[50%] border-[3px] border-[#75553B]" />
    </button>
  );
}

export function WhackAMole() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(4);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(75);
  const [isMoleHit, setIsMoleHit] = useState(false);

  const hasBeenHitRef = useRef(false);
  const activeMoleRef = useRef<number | null>(4);
  const lastMoleIndexRef = useRef(4);
  const hitAnimationTimeoutRef = useRef<number | null>(null);

  // Start or replay a round
  const handleStart = () => {
    if (hitAnimationTimeoutRef.current !== null) {
      window.clearTimeout(hitAnimationTimeoutRef.current);
      hitAnimationTimeoutRef.current = null;
    }

    hasBeenHitRef.current = false;
    activeMoleRef.current = 4;
    lastMoleIndexRef.current = 4;

    setScore(0);
    setRemaining(75);
    setIsMoleHit(false);
    setActiveMoleIndex(4);
    setPhase("playing");
  };

  // Automatic mole movement
  useEffect(() => {
    if (phase !== "playing" || isMoleHit) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) return;

    let timeoutId: number | null = null;
    let cancelled = false;

    const clearScheduledMove = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const showNextMole = () => {
      if (cancelled) return;

      const previousIndex = lastMoleIndexRef.current;
      const randomSlot = Math.floor(Math.random() * 8);

      const nextIndex =
        randomSlot >= previousIndex ? randomSlot + 1 : randomSlot;

      lastMoleIndexRef.current = nextIndex;
      activeMoleRef.current = nextIndex;
      hasBeenHitRef.current = false;

      setActiveMoleIndex(nextIndex);

      timeoutId = window.setTimeout(hideCurrentMole, 1200);
    };

    const hideCurrentMole = () => {
      if (cancelled) return;

      activeMoleRef.current = null;

      setActiveMoleIndex(null);
      setIsMoleHit(false);

      timeoutId = window.setTimeout(showNextMole, 450);
    };

    // After a hit, wait before spawning the next mole.
    // On the initial round, let the center mole stay visible for 900ms.
    if (activeMoleRef.current === null) {
      timeoutId = window.setTimeout(showNextMole, 450);
    } else {
      timeoutId = window.setTimeout(hideCurrentMole, 900);
    }

    return () => {
      cancelled = true;
      clearScheduledMove();
    };
  }, [phase, isMoleHit]);

  // Countdown timer and automatic Game Over
  useEffect(() => {
    if (phase !== "playing") return;

    const endTime = Date.now() + 75_000;

    const intervalId = window.setInterval(() => {
      const nextRemaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000),
      );

      setRemaining(nextRemaining);

      if (nextRemaining === 0) {
        window.clearInterval(intervalId);

        if (hitAnimationTimeoutRef.current !== null) {
          window.clearTimeout(hitAnimationTimeoutRef.current);
          hitAnimationTimeoutRef.current = null;
        }

        hasBeenHitRef.current = true;
        activeMoleRef.current = null;

        setActiveMoleIndex(null);
        setIsMoleHit(false);
        setPhase("gameover");
      }
    }, 250);

    return () => {
      window.clearInterval(intervalId);

      if (hitAnimationTimeoutRef.current !== null) {
        window.clearTimeout(hitAnimationTimeoutRef.current);
        hitAnimationTimeoutRef.current = null;
      }
    };
  }, [phase]);

  // Handle mole hit
  const handleMoleHit = (index: number) => {
    if (
      phase !== "playing" ||
      activeMoleIndex !== index ||
      hasBeenHitRef.current
    ) {
      return;
    }

    hasBeenHitRef.current = true;

    // Immediate score feedback
    setScore((currentScore) => currentScore + 10);

    // Trigger hammer and mole defeat animations
    setIsMoleHit(true);

    if (hitAnimationTimeoutRef.current !== null) {
      window.clearTimeout(hitAnimationTimeoutRef.current);
    }

    hitAnimationTimeoutRef.current = window.setTimeout(() => {
      hitAnimationTimeoutRef.current = null;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        // Keep the same mole available without animation
        hasBeenHitRef.current = false;
        setIsMoleHit(false);
        return;
      }

      // Remove the defeated mole.
      // The movement effect will schedule the next one.
      activeMoleRef.current = null;
      setActiveMoleIndex(null);
      setIsMoleHit(false);
    }, 460);
  };

  const formattedTime = `${String(Math.floor(remaining / 60)).padStart(
    2,
    "0",
  )}:${String(remaining % 60).padStart(2, "0")}`;

  const isTimeCritical = remaining <= 15 && phase === "playing";

  return (
    <Section id="whack-a-mole" className="bg-bg">
      <Container className="relative py-16 sm:py-20">
        {/* Section Introduction */}
        <div className="mb-12 text-center sm:mb-14">
          <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">
            INTERACTIVE PLAYGROUND
          </p>

          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tight text-fg text-balance">
            Feeling Playful?
          </h2>

          <p className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-muted sm:text-lg">
            Tap the little moles as they pop up. Catch a golden one for extra
            points!
          </p>
        </div>

        {/* Score and Timer */}
        <div className="mx-auto mb-5 flex w-full max-w-[490px] items-center justify-between rounded-2xl border border-[#29374D] bg-[#101A2B]/80 px-5 py-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
              YOUR SCORE
            </p>

            <p
              className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg"
              aria-live="polite"
              aria-atomic="true"
            >
              {String(score).padStart(3, "0")}
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
              TIME LEFT
            </p>

            <p
              className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
                isTimeCritical ? "text-red-400" : "text-fg"
              }`}
              aria-label={`${remaining} seconds remaining`}
            >
              {formattedTime}
            </p>
          </div>
        </div>

        {/* Arcade Board */}
        <div className="mx-auto w-full max-w-[490px]">
          <div className="relative overflow-hidden rounded-3xl border border-[#29374D] bg-gradient-to-b from-[#172338] via-[#101A2B] to-[#0B1220] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-7">
            {/* Ambient highlight */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-3/4 -translate-x-1/2 rounded-full bg-[#4169E1]/10 blur-3xl" />

            {/* Board */}
            <div
              role="group"
              aria-label="Whack-a-Mole game board"
              className="relative grid grid-cols-3 gap-3 sm:gap-5"
            >
              {Array.from({ length: 9 }, (_, index) => (
                <MoleHole
                  key={index}
                  index={index}
                  hasMole={activeMoleIndex === index}
                  isHit={activeMoleIndex === index && isMoleHit}
                  disabled={phase !== "playing"}
                  onHit={handleMoleHit}
                />
              ))}
            </div>

            {/* Board bottom decoration */}
            <div className="mx-auto mt-5 h-px w-2/3 bg-gradient-to-r from-transparent via-[#536782]/50 to-transparent" />
          </div>
        </div>

        {/* Start Screen */}
        {phase === "ready" && (
          <div className="mx-auto mt-7 max-w-[490px] text-center">
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-ivory transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
            >
              Start Game
            </button>

            <p className="mt-3 text-sm text-muted">
              Ready? You have 75 seconds. Have fun!
            </p>
          </div>
        )}

        {/* Playing Hint */}
        {phase === "playing" && (
          <p className="mt-6 text-center text-sm text-muted">
            Tap the mole before it hides!
          </p>
        )}

        {/* Game Over */}
        {phase === "gameover" && (
          <div className="mx-auto mt-7 w-full max-w-[490px] rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent">
              GAME OVER
            </p>

            <h3 className="mt-3 font-display text-2xl font-semibold text-fg">
              Round complete!
            </h3>

            <p className="mt-4 font-mono text-4xl font-bold tabular-nums text-fg">
              {score}
            </p>

            <p className="mt-1 text-sm text-muted">points earned</p>

            <button
              type="button"
              onClick={handleStart}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-ivory transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:w-auto"
            >
              <span className="mr-2">↻</span>
              Play Again
            </button>
          </div>
        )}

        {/* Bottom Caption */}
        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.2em] text-muted/70">
          A LITTLE ARCADE BREAK
        </p>
      </Container>

      {/* Hammer & Funny Mole Animations */}
      <style>{`
        @keyframes whack-hammer-swing {
  0% {
    opacity: 0;
    transform: translate(28px, -22px)
      rotate(-45deg) scale(0.9);
  }

  18% {
    opacity: 1;
    transform: translate(12px, -10px)
      rotate(-35deg) scale(1);
  }

  46% {
    opacity: 1;
    transform: translate(-2px, 12px)
      rotate(20deg) scale(1.02);
  }

  60% {
    opacity: 1;
    transform: translate(0, 7px)
      rotate(12deg);
  }

  80% {
    opacity: 1;
    transform: translate(12px, -7px)
      rotate(-18deg);
  }

  100% {
    opacity: 0;
    transform: translate(20px, -16px)
      rotate(-30deg);
  }
}

.whack-hammer {
  transform-origin: 78% 80%;
  animation: whack-hammer-swing
    460ms cubic-bezier(0.2, 0.8, 0.25, 1) both;
}

        @keyframes mole-funny-defeat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  35% {
    opacity: 1;
    transform: translateY(5px)
      scaleX(1.06) scaleY(0.88) rotate(-4deg);
  }

  52% {
    opacity: 1;
    transform: translateY(8px)
      scaleX(1.04) scaleY(0.9) rotate(5deg);
  }

  78% {
    opacity: 0.9;
    transform: translateY(20px)
      scaleX(0.96) scaleY(0.7);
  }

  100% {
    opacity: 0;
    transform: translateY(38px)
      scaleX(0.88) scaleY(0.55);
  }
}

@keyframes hit-score-float {
  0% {
    opacity: 0;
    transform: translate(-50%, 8px) scale(0.7);
  }

  25% {
    opacity: 1;
    transform: translate(-50%, -5px) scale(1.15);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -32px) scale(1);
  }
}

.hit-score-pop {
  position: absolute;
  z-index: 40;
  top: -2%;
  left: 50%;
  color: #86E8A6;
  font-family: var(--font-geist-mono);
  font-size: 15px;
  font-weight: 800;
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  animation: hit-score-float 460ms ease-out both;
}

        .mole-funny-defeat {
          animation: mole-funny-defeat 460ms cubic-bezier(0.2, 0.8, 0.25, 1) both;
        }

        @keyframes dizzy-star {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.3) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: translateY(0) scale(1.1) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px) scale(0.65) rotate(150deg);
          }
        }

        .dizzy-star {
          position: absolute;
          z-index: 2;
          color: #FFD76B;
          font-size: 20px;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(255, 215, 107, 0.7);
          animation: dizzy-star 460ms ease-out both;
        }

        .star-one {
          top: -5%;
          left: 5%;
          animation-delay: 170ms;
        }

        .star-two {
          top: -15%;
          right: 2%;
          animation-delay: 190ms;
        }

        .star-three {
          top: 12%;
          right: -8%;
          font-size: 15px;
          animation-delay: 210ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .whack-hammer,
          .mole-funny-defeat,
          .dizzy-star {
            animation: none !important;
          }
        }
      `}</style>
    </Section>
  );
}
