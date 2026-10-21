/**
 * Signature Hero visual — "Flowing Energy" (Task 05A-3R).
 *
 * Renders the audited Ghost Fibers WebGL2 shader when WebGL2 is available,
 * falling back to a static SVG hint of flowing energy otherwise. The Hero
 * section stays server-rendered; the shader is isolated in a browser-only
 * client component. Reduced-motion is honored by GhostFibers internally
 * (prefers-reduced-motion freezes animation and skips the intro).
 *
 * Desktop: visual extends to the viewport's right edge; a left-edge fade
 * protects headline readability. Mobile: text-first layout, no overflow.
 */

'use client';

import { useEffect, useState } from 'react';
import GhostFibers from './ghost-fibers';

/**
 * Static fallback for browsers without WebGL2. Subtle, intentionally static
 * hint of flowing energy — blue core fading into cyan at the edges, with a
 * few restrained luminous accents. No animation.
 */
function HeroVisualFallback({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 560 480"
      data-hero="fallback"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id="fallback-energy"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4169E1" stopOpacity="0" />
          <stop offset="0.35" stopColor="#4169E1" stopOpacity="0.3" />
          <stop offset="0.7" stopColor="#00E5FF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="560" height="480" fill="url(#fallback-energy)" />
      <path
        d="M 60 420 Q 220 120 460 220 T 560 60"
        fill="none"
        stroke="#4169E1"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        d="M 40 340 Q 160 100 380 140 T 560 100"
        fill="none"
        stroke="#00E5FF"
        strokeWidth="1"
        opacity="0.25"
      />
      <circle cx="420" cy="100" r="2" fill="#F7F6F2" opacity="0.6" />
      <circle cx="480" cy="280" r="2" fill="#F7F6F2" opacity="0.5" />
      <circle cx="340" cy="60" r="1.5" fill="#F7F6F2" opacity="0.4" />
    </svg>
  );
}

export function HeroVisual({ className }: { className?: string }) {
  const [useShader, setUseShader] = useState(false);

  // One-time WebGL2 capability check on the client. Server renders the
  // fallback; this effect swaps to the shader when WebGL2 is available.
  useEffect(() => {
    const canvas = document.createElement('canvas');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUseShader(!!canvas.getContext('webgl2'));
  }, []);

  return (
    <div data-hero="visual" className={`relative min-h-[400px] ${className ?? ''}`}>
      {useShader ? (
        <GhostFibers />
      ) : (
        <HeroVisualFallback className="absolute inset-0 w-full h-full" />
      )}
      {/* Left-edge fade into the dark background so the headline stays readable. */}
      <div
        className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-cosmic via-cosmic to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}



