import type { FC, SVGProps } from "react";
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siHtml5,
  siCss,
  siJsonwebtokens,
  siTailwindcss,
  siRedux,
  siShadcnui,
  siNodedotjs,
  siExpress,
  siSocketdotio,
  siPostgresql,
  siMongodb,
  siPrisma,
  siGit,
  siGithub,
  siPostman,
  siVercel,
  siRender,
  siCloudinary,
  siDocker,
  siRedis,
  siNpm,
  siLangchain,
  siLanggraph,
  siGsap,
} from "simple-icons";

/**
 * Skill-cube logo registry.
 *
 * Branded entries use the real Simple Icons path from the installed package.
 * Concept entries use original stroke-based SVG pictograms (not claimed as
 * official logos). The canvas renderer can preserve native-colour SVG markup
 * through `mode: "original"`, or tint monochrome artwork for contrast.
 *
 * Prisma deliberately uses the official single-colour prism silhouette on a
 * paper-white cube. Prisma's brand kit permits this one-colour treatment on a
 * light surface; it is preferable to inventing a multicolour approximation.
 */
export type SkillLogoPath = {
  label: string;
  d?: string;
  /** Inner SVG markup (not an outer <svg>) for icons with multiple paths/strokes. */
  markup?: string;
  /** Optional inner SVG markup for multi-colour artwork. */
  svg?: string;
  /** Inner SVG markup with approved/native fills preserved instead of recoloured. */
  mode?: "monochrome" | "original";
  viewBox?: string;
  aspectRatio?: number;
  /** Original Simple Icons brand hex, recorded separately from cube surface colour. */
  brandHex?: string;
  sizeRatio?: number;
  glowColor?: string;
};

type LogoProps = SVGProps<SVGSVGElement>;

type SimpleIconLike = { path: string; title: string; hex: string };

// Explicit named imports let Next.js tree-shake the package instead of pulling
// the full Simple Icons catalogue into this client-side module.
const SIMPLE_ICONS: Record<string, SimpleIconLike> = {
  react: siReact,
  nextdotjs: siNextdotjs,
  typescript: siTypescript,
  javascript: siJavascript,
  html5: siHtml5,
  css3: siCss,
  tailwindcss: siTailwindcss,
  reduxtoolkit: siRedux,
  shadcnui: siShadcnui,
  nodedotjs: siNodedotjs,
  express: siExpress,
  socketdotio: siSocketdotio,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  prisma: siPrisma,
  git: siGit,
  github: siGithub,
  postman: siPostman,
  vercel: siVercel,
  render: siRender,
  cloudinary: siCloudinary,
  docker: siDocker,
  redis: siRedis,
  npm: siNpm,
  langchain: siLangchain,
  langgraph: siLanggraph,
  gsap: siGsap,
};

export const PATHS: Record<string, SkillLogoPath> = {};

for (const [key, icon] of Object.entries(SIMPLE_ICONS)) {
  PATHS[key] = {
    d: icon.path,
    label: icon.title,
    viewBox: "0 0 24 24",
    aspectRatio: 1,
    mode: "monochrome",
    brandHex: `#${icon.hex}`,
  };
}

// CSS3: preserve the original blue brand mark.
PATHS.css3 = {
  label: "CSS3",
  viewBox: "0 0 128 128",
  aspectRatio: 1,
  mode: "original",
  brandHex: "#1572B6",
  svg: `
    <path
      fill="#1572B6"
      d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"
    />
    <path
      fill="#33A9DC"
      d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"
    />
    <path
      fill="#FFFFFF"
      transform="scale(0.2)"
      d="m544 96l-64 368l-223.3 80L64 464l19.6-94.8h82l-8 40.6L274 454.2l134.1-44.4l18.8-97.1H93.5l16-82h333.7l10.5-52.7H120.3l16.3-82z"
    />
  `,
};
// Prisma's current brand kit permits the black one-colour prism on a light
// surface. The skill data sets its cube face to paper white, so preserve the
// official black mark instead of recolouring it.
if (PATHS.prisma) PATHS.prisma.mode = "original";

// AWS wordmark-style SVG fallback. Simple Icons does not export an AWS icon in
// the installed package version used by this project, so this is a local visual
// approximation (not an official AWS asset). It keeps the familiar dark wordmark
// and orange smile/arrow instead of substituting an unrelated icon.
PATHS.aws = {
  label: "Amazon Web Services",
  viewBox: "0 0 24 24",
  aspectRatio: 1,
  mode: "original",
  svg: `
    <path
      fill="#FFFFFF"
      d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"
    />
    <path
      fill="#FF9900"
      d="M21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"
    />
  `,
};

// Original custom concept pictograms. All are stroked, so their thin geometry
// is preserved by the canvas alpha-mask recolouring step rather than becoming
// filled blobs. These are deliberately custom concepts, not official brands.
PATHS.sql = {
  label: "SQL",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  mode: "monochrome",
  markup: `
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="4.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <ellipse cx="32" cy="12" rx="19" ry="7" />
      <path d="M13 12v36c0 4 8.5 7 19 7s19-3 19-7V12" />
      <path d="M13 24c0 4 8.5 7 19 7s19-3 19-7" />
      <path d="M13 36c0 4 8.5 7 19 7s19-3 19-7" />
    </g>
  `,
};

PATHS.zustand = {
  label: "Zustand",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  mode: "monochrome",
  markup: `<g fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 22c-5-1-8-5-7-10 1-4 5-6 9-3l5 6M47 22c5-1 8-5 7-10-1-4-5-6-9-3l-5 6"/><path d="M13 28c0-12 8-19 19-19s19 7 19 19v8c0 12-8 19-19 19s-19-7-19-19z"/><path d="M22 30h.1M42 30h.1" stroke-width="7"/><path d="M26 40c2 3 10 3 12 0M29 36h6"/></g>`,
};

PATHS.restapis = {
  label: "REST APIs",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  mode: "monochrome",
  markup: `
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="4.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M13 12H19Q25 12 25 19V22" />
      <path d="M13 32H25" />
      <path d="M13 52H19Q25 52 25 45V42" />

      <circle cx="8" cy="12" r="4.5" />
      <circle cx="8" cy="32" r="4.5" />
      <circle cx="8" cy="52" r="4.5" />

      <rect x="25" y="12" width="34" height="40" rx="4" />

      <path d="M32 23H43M32 32H43M32 41H43" />
      <circle cx="50" cy="23" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="50" cy="32" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="50" cy="41" r="1.5" fill="currentColor" stroke="none" />
    </g>
  `,
};

PATHS.jwt = {
  label: "JWT",
  d: siJsonwebtokens.path,
  viewBox: "0 0 24 24",
  aspectRatio: 1,
  mode: "monochrome",
  brandHex: "#00F2E6",
};

PATHS.cicd = {
  label: "CI/CD",
  viewBox: "0 0 128 80",
  aspectRatio: 1.6,
  mode: "original",
  markup: `
    <!-- Clean infinity pipeline -->
    <path
      d="
        M64 40
        C52 22 42 16 29 16
        C14 16 7 26 7 40
        C7 54 14 64 29 64
        C42 64 53 54 64 40
        C75 26 86 16 99 16
        C114 16 121 26 121 40
        C121 54 114 64 99 64
        C86 64 75 54 64 40
      "
      fill="none"
      stroke="#FFFFFF"
      stroke-width="5.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Clear code symbol -->
    <g
      fill="none"
      stroke="#00E5FF"
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M30 33 L24 40 L30 47" />
      <path d="M38 31 L33 49" />
      <path d="M42 33 L48 40 L42 47" />
    </g>

    <!-- Well-defined automation gear -->
    <path
      d="
        M96 29.5
        L98.2 33.1
        L102.2 32
        L103.2 36
        L106.5 38
        L104.5 40
        L106.5 43
        L103.2 45
        L102.2 48.5
        L98.2 47.2
        L96 50.5
        L93.8 47.2
        L89.8 48.5
        L88.8 45
        L85.5 43
        L87.5 40
        L85.5 38
        L88.8 36
        L89.8 32
        L93.8 33.1
        Z

        M96 36.3
        A3.7 3.7 0 1 0 96 43.7
        A3.7 3.7 0 1 0 96 36.3
        Z
      "
      fill="#FFC400"
      fill-rule="evenodd"
    />
  `,
};

// LangChain — Official Light Blue Brand Symbol
PATHS.langchain = {
  label: "LangChain",
  viewBox: "0 0 120 120",
  aspectRatio: 1,
  mode: "original",
  sizeRatio: 0.7,
  glowColor: "rgba(127, 200, 255, 0.32)",
  svg: `
    <path
      d="M37.6549 79.8801C44.7143 72.8204 48.6826 63.2351 48.6826 53.2522C48.6826 43.2694 44.7109 33.684 37.6549 26.6244L11.0278 0C3.97179 7.05963 0 16.645 0 26.6278C0 36.6107 3.97179 46.196 11.0278 53.2557L37.6514 79.8801H37.6549Z"
      fill="#7FC8FF"
    />
    <path
      d="M93.3698 82.344C86.3138 75.2878 76.7254 71.3159 66.7462 71.3159C56.7671 71.3159 47.1786 75.2878 40.1191 82.344L66.7462 108.972C73.8022 116.028 83.3907 120 93.3733 120C103.356 120 112.941 116.028 120 108.972L93.3733 82.344H93.3698Z"
      fill="#7FC8FF"
    />
    <path
      d="M11.0937 108.91C18.1531 115.966 27.7382 119.938 37.7208 119.938V82.2822H0.0625C0.0659269 92.2651 4.03428 101.85 11.0937 108.91Z"
      fill="#7FC8FF"
    />
    <path
      d="M103.65 42.9749C96.5907 35.9187 87.0057 31.9434 77.0196 31.9468C67.0371 31.9468 57.452 35.9187 50.3926 42.9783L77.0196 69.6061L103.65 42.9749Z"
      fill="#7FC8FF"
    />
  `,
};

PATHS.rag = {
  label: "RAG",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  sizeRatio: 0.95,
  mode: "monochrome",
  markup: `
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="3.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Clean document -->
      <path d="
        M10 8
        H29
        L37 16
        V42
        H10
        Z
      " />

      <!-- Folded corner -->
      <path d="M29 8 V16 H37" />

      <!-- Document text lines -->
      <path d="
        M15 25 H30
        M15 32 H26
      " />

      <!-- Refined magnifying glass -->
      <circle
        cx="43"
        cy="43"
        r="8.5"
      />

      <!-- Magnifying glass handle -->
      <path d="M49 49 L56.5 56.5" />

      <!-- Plus symbol -->
      <path
        d="M43 39.5 V46.5 M39.5 43 H46.5"
        stroke-width="2.7"
      />
    </g>
  `,
};

PATHS.vectordb = {
  label: "Vector DB",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  mode: "monochrome",
  markup: `<g fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="19" cy="13" rx="13" ry="6"/><path d="M6 13v32c0 3.5 5.8 6 13 6s13-2.5 13-6V13M6 24c0 3.5 5.8 6 13 6s13-2.5 13-6M6 35c0 3.5 5.8 6 13 6s13-2.5 13-6"/><path d="m32 29 12-10 9 12-9 14-12-10m12-16v30m-12-18h21"/><circle cx="44" cy="19" r="3"/><circle cx="53" cy="31" r="3"/><circle cx="44" cy="45" r="3"/></g>`,
};

PATHS.systemdesign = {
  label: "System Design",
  viewBox: "0 0 64 64",
  aspectRatio: 1,
  mode: "monochrome",
  markup: `<g fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="5" width="20" height="13" rx="2.5"/><path d="M32 18v9M11 27h42M11 27v8m21-8v8m21-8v8"/><rect x="3" y="35" width="16" height="20" rx="2.5"/><rect x="24" y="35" width="16" height="20" rx="2.5"/><rect x="45" y="35" width="16" height="20" rx="2.5"/><path d="M8 42h6m-6 5h6M29 42h6m-6 5h6M50 42h6m-6 5h6"/></g>`,
};

/** Throws with a useful list instead of silently rendering missing logos. */
export function assertSkillLogoMappings(logoKeys: readonly string[]): void {
  const missing = logoKeys.filter(
    (key) =>
      !PATHS[key] || (!PATHS[key].d && !PATHS[key].markup && !PATHS[key].svg),
  );
  if (missing.length > 0) {
    throw new Error(`Missing skill logo asset(s): ${missing.join(", ")}`);
  }
}

function make(name: string): FC<LogoProps> {
  const entry = PATHS[name];
  if (!entry) throw new Error(`Unknown skill logo key: ${name}`);

  const Logo: FC<LogoProps> = ({ className, ...props }) => (
    <svg
      className={className}
      viewBox={entry.viewBox ?? "0 0 24 24"}
      fill={entry.mode === "original" ? undefined : "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      role="img"
      aria-label={entry.label}
    >
      {entry.svg ? (
        <g dangerouslySetInnerHTML={{ __html: entry.svg }} />
      ) : entry.d ? (
        <path d={entry.d} fillRule="evenodd" />
      ) : (
        <g dangerouslySetInnerHTML={{ __html: entry.markup ?? "" }} />
      )}
    </svg>
  );

  Logo.displayName = entry.label;
  return Logo;
}

export const SKILL_LOGOS: Record<string, FC<LogoProps>> = Object.fromEntries(
  Object.keys(PATHS).map((key) => [key, make(key)]),
) as Record<string, FC<LogoProps>>;
