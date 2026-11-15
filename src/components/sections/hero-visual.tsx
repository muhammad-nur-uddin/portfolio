"use client";

import { useCallback, useState } from "react";
import GhostFibers from "./ghost-fibers";

/**
 * Minimal atmospheric preview shown only while the WebGL shader initializes.
 * It uses ambient light and sparse particles only; it does not imitate the
 * ribbons or motion of the actual Ghost Fibers shader.
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
        <radialGradient
          id="hero-fallback-blue-atmosphere"
          cx="62%"
          cy="57%"
          r="62%"
        >
          <stop offset="0%" stopColor="#123F91" stopOpacity="0.17" />
          <stop offset="48%" stopColor="#103875" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#103875" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-fallback-upper-cyan" cx="78%" cy="23%" r="39%">
          <stop offset="0%" stopColor="#00A9D8" stopOpacity="0.25" />
          <stop offset="36%" stopColor="#087FB9" stopOpacity="0.15" />
          <stop offset="72%" stopColor="#14549A" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#14549A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-fallback-lower-cyan" cx="76%" cy="94%" r="38%">
          <stop offset="0%" stopColor="#00A8D5" stopOpacity="0.19" />
          <stop offset="42%" stopColor="#0871B8" stopOpacity="0.11" />
          <stop offset="76%" stopColor="#174B91" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#174B91" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Static atmosphere only: no ribbons, waves, lines, or blurred bands. */}
      <rect
        x="0"
        y="0"
        width="560"
        height="480"
        fill="url(#hero-fallback-blue-atmosphere)"
      />
      <rect
        x="0"
        y="0"
        width="560"
        height="480"
        fill="url(#hero-fallback-upper-cyan)"
      />
      <rect
        x="0"
        y="0"
        width="560"
        height="480"
        fill="url(#hero-fallback-lower-cyan)"
      />

      {/* Sparse, tiny points add depth without becoming a star field. */}
      <g fill="#83DFFF">
        <circle cx="430" cy="64" r="1.05" opacity="0.38" />
        <circle cx="492" cy="101" r="0.8" opacity="0.27" />
        <circle cx="356" cy="126" r="0.7" opacity="0.23" />
        <circle cx="470" cy="171" r="0.95" opacity="0.34" />
        <circle cx="535" cy="216" r="0.75" opacity="0.22" />
        <circle cx="393" cy="232" r="0.8" opacity="0.29" />
        <circle cx="500" cy="284" r="1.05" opacity="0.37" />
        <circle cx="450" cy="320" r="0.7" opacity="0.23" />
        <circle cx="535" cy="365" r="0.9" opacity="0.28" />
        <circle cx="380" cy="393" r="0.8" opacity="0.25" />
        <circle cx="480" cy="440" r="0.95" opacity="0.33" />
        <circle cx="330" cy="70" r="0.65" opacity="0.2" />
      </g>
    </svg>
  );
}

export function HeroVisual({ className }: { className?: string }) {
  const [shaderReady, setShaderReady] = useState(false);

  const handleShaderReady = useCallback(() => {
    setShaderReady(true);
  }, []);

  return (
    <div
      data-hero="visual"
      className={`relative isolate min-h-[400px] ${className ?? ""}`}
    >
      {/* Fallback design only changes here; the 700ms crossfade is preserved. */}
      <HeroVisualFallback
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
          shaderReady ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          shaderReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <GhostFibers className="absolute inset-0" onReady={handleShaderReady} />
      </div>

      {/* Left-edge fade protects headline readability. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-cosmic via-cosmic to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
