# Portfolio Blueprint

**Status:** Active source of truth for the portfolio project.
**Last updated:** 2026-10-18 (Task: Featured Projects section implemented — cinematic space environment, scroll-linked SVG rocket journey via GSAP ScrollTrigger + MotionPathPlugin, Finvia/Nebula with alternating compositions, HTML/CSS previews with placeholder data pending genuine screenshots, case-study routes `/case-studies/finvia` and `/case-studies/nebula` implemented; lint and build verified.)

This document separates **confirmed decisions** from **unresolved decisions (TBD)**. Nothing marked TBD may be invented or finalized without an explicit follow-up task.

---

## 1. Project Overview

- A completely new, recruiter-focused developer portfolio.
- Purpose: present skills, featured work, and contact information to recruiters and hiring managers.
- Static-first approach. Avoid unnecessary backend or database infrastructure.
- Work incrementally through small, reviewable tasks — one narrowly scoped change at a time.
- The current project passes lint and production build checks.
- Google Stitch is **not** part of this workflow.

## 2. Technology Stack (Confirmed)

- **Framework:** Next.js 16 (App Router), latest stable release.
- **UI:** React, TypeScript.
- **Styling:** Tailwind CSS v4.
- **Package manager:** npm.
- **Conventions:** `src/` directory, `@/*` → `./src/*` import alias.
- No backend, database, or server infrastructure is planned at this stage.

## 3. Overall Visual Identity (Confirmed)

- **Character:** Creative & Premium.
- **Style:** Cohesive cinematic-editorial design across the entire site.
- Dark and light sections are intentional, but every section must share:
  - Typography scale and pairing.
  - Spacing rhythm.
  - Color tokens.
  - Motion principles.
- **Base palette colors** (confirmed):
  - Charcoal `#101114`
  - Warm ivory `#F7F6F2`
  - Electric blue `#4169E1`
  - Cosmic dark `#080D18`
- **Full semantic color tokens, typography, and navigation are now approved** — see §3.1 (Color Tokens), §3.2 (Typography), and §3.3 (Navigation).
- Any unapproved design detail must be marked **TBD**, never invented.

### 3.1 Color Tokens (Approved)

Semantic tokens shared across all sections. **Dark cinematic is the default** context and is used by the implemented sections (Header, Hero, About); the warm-ivory editorial light context remains available via the `Section` primitive's `theme="light"` prop for any future section that opts in. Every section uses these same token names so light and dark stay cohesive.

**Dark theme (default):**

| Token | Value |
|---|---|
| background | `#080D18` |
| foreground | `#F7F6F2` |
| surface | `#101114` |
| muted text | `#A9B0C0` |
| border | `#293246` |
| accent | `#4169E1` |
| accent hover | `#3458CC` |

**Light theme (editorial):**

| Token | Value |
|---|---|
| background | `#F7F6F2` |
| foreground | `#101114` |
| surface | `#FFFFFF` |
| muted text | `#66645F` |
| border | `#D9D7D0` |
| accent | `#4169E1` |
| accent hover | `#3458CC` |

### 3.2 Typography (Approved)

- **Headings & display text:** Space Grotesk.
- **Body text:** Inter.
- **Restrained technical labels & metadata** (eyebrows, tags, code-like accents): Geist Mono.
- **No additional font families** without explicit approval.
- Self-host via `next/font` — no runtime network requests and **no new dependencies**.

### 3.3 Navigation (Approved)

- A **minimal sticky navigation** is part of the approved design.
- Planned contents: **name/brand**, **section anchor links**, and a **Resume CTA**.
- Implement and visually refine the navigation **after the section structure exists**.
- **Do not invent or wire an unverified Resume URL** — the Resume link target is **TBD** until verified (see §13).

### 3.4 Layout Tokens (Approved)

- **Content maximum width:** `1200px` / `75rem` (exposed as `max-w-content`).
- **Horizontal gutters:** `px-5 sm:px-8 lg:px-10` (20px, 32px, 40px).
- **Default section vertical spacing:** `py-section lg:py-section-lg xl:py-section-xl` → 96px, 128px, and 160px.
- Keep Tailwind CSS's default responsive breakpoints.
- Sections may override the default spacing and layout when their approved visual design requires it.
- Full-bleed backgrounds must remain possible.

### 3.5 SEO Metadata (Approved)

Root metadata is configured in `src/app/layout.tsx` and applies to every page (page-specific `metadata` exports reuse the title template):

- **Default title:** `Muhammad Nur Uddin | Backend-Focused Full-Stack Developer`
- **Title template:** `%s | Muhammad Nur Uddin`
- **Description:** `Portfolio of Muhammad Nur Uddin, a backend-focused full-stack developer building web applications with TypeScript, Next.js, Node.js, and PostgreSQL.`
- **Open Graph:** same verified title and description; site name `Muhammad Nur Uddin`; type `website`; locale `en_US`.
- **Deferred (TBD):** `metadataBase` / canonical URL and Open Graph image — pending deployment-domain and asset confirmation (see §13).

## 4. Engineering Requirements (Confirmed)

- Responsive across desktop, tablet, and mobile.
- Accessibility: semantic HTML, keyboard usability, focus management, reduced-motion support.
- SEO: strong page metadata, page-specific `metadata` exports, and Open Graph support.
- Respect `prefers-reduced-motion` in all animated components.
- Performance-aware, especially on mobile (scroll-linked and 3D work must stay smooth).
- Never invent usage metrics, achievements, or arbitrary skill percentages.
- Never include fake project claims.
- Do not add dependencies without a clear reason and a separate review/task.
- Do not implement multiple unrelated features in one task.
- Do not run `npm audit fix --force` (would trigger a breaking downgrade for a dev-only advisory).

## 5. Known Open Advisory (Confirmed, Accepted)

- A development-only `braces` stack-exhaustion advisory (GHSA-vfj7-8cjw-p6xm / CVE-2026-93687) remains unresolved.
- It affects only the lint toolchain (`eslint-config-next` dependency chain), not production runtime.
- **Do not** run `npm audit fix --force`. Revisit only when an upstream patched release is available.

---

## 6. Section 01 — Hero (Confirmed direction)

- Dark, technical, premium visual.
- **No personal portrait** in the Hero.
- Signature visual: **Flowing Energy (Hybrid):** Ghost Fibers WebGL2 shader (adapted from react-bits) rendering fine, luminous, interconnected energy ribbons in electric blue `#4169E1` with cyan `#00E5FF` edge highlights and restrained ivory `#F7F6F2` glints; organic waves, twists, crossings, and layered flow; sparse luminous particles; subtle blue atmospheric field; decorative (`aria-hidden`, non-focusable, `pointer-events`-free); full-bleed layer to the viewport's right edge on desktop; left-edge CSS fade protects headline readability; static SVG fallback for browsers without WebGL2.
- Animation: **GSAP:** brief staggered fade-up entrance (eyebrow → headline → introduction → CTAs) plus smooth visual reveal; skipped under `prefers-reduced-motion` (`gsap.matchMedia`) with `useGSAP()` cleanup; static server-rendered paint fully visible without JS. Ambient motion inside the visual layer owned by Ghost Fibers shader (internally respects `prefers-reduced-motion`, pauses when hidden, cleans up on unmount).
- Header/navigation: sticky top bar with `N` monogram brand (`#home`), center anchor links (Home, About, Projects, Skills, Contact), right-aligned outlined **Get in Touch** CTA (`#contact`); mobile hamburger menu with accessible toggle; no theme switcher.
- Content: strong headline, concise introduction, clear **Projects** (`#projects`) and non-interactive disabled **Resume** CTA.
- **Status:** Hero header, navigation, Flowing Energy shader, GSAP motion, and WebGL2 fallback implemented (`page.tsx`, `header.tsx`, `hero.tsx`, `hero-visual.tsx`, `hero-motion.tsx`, `ghost-fibers.tsx`, `ghost-fibers.css`) — lint and production build pass.
- **Approved copy (Task 05A-1):**
  - Eyebrow: `BACKEND-FOCUSED FULL-STACK DEVELOPER`
  - Headline: `Building web applications from database to interface.`
  - Introduction: `I build full-stack web applications with TypeScript, Next.js, Node.js, and PostgreSQL, with a focus on backend systems and dependable APIs.`
  - CTAs: **View Projects** → `#projects` anchor; **Resume** is a temporary non-interactive placeholder until a verified URL exists (see §3.3 / §13) — never wire an invented URL.
- Unresolved (TBD):
  - Resume URL for the Hero CTA (see §13).

## 7. Section 02 — About Me (Implemented — final browser review complete)

- **Dark cinematic direction (approved, supersedes the earlier warm-ivory idea):** deep-navy background, ivory text, electric-blue accents — consistent with the Hero. The section does not opt into the light theme.
- **Asymmetrical editorial layout (final):** local content container with a wider measure of approximately **1380px** on large screens (About does not use the shared `Container`, so it can widen independently of other sections); portrait area on the **left** (~38% column, reduced column gap; frame capped at ~370px wide × ~440–500px tall, 3:4 ratio, thin electric-blue border with restrained blue ambient glow); story column on the **right** (~62%) containing the headline and biography. Compact vertical rhythm (reduced section padding and gaps) so the section fits a typical 1366×768 laptop viewport below the fixed header when practical, with natural scrolling on smaller viewports and no clipped content or fixed heights.
- **Section chrome:** one section-level mono label `ABOUT ME` in electric blue (accent) with editorial label `A LITTLE BEYOND THE CODE` on the right — **one label only, no duplicated inner eyebrow above the headline** (the redundant second `ABOUT ME` eyebrow was removed in the final finishing pass). A clearly visible but secondary **Flowing Energy continuation** of the Hero's energy — a purpose-built static inline decorative SVG inside `about.tsx` (no separate component, no shaders/canvas/RAF, no animation, no new dependencies) anchored bottom-left at ~52% of the section width × 280px — forms three broad layered translucent blue ribbons with luminous cores, fine blue/cyan filaments, restrained ivory glints, and soft atmospheric blue lighting; the ribbons sweep along the lower edge and around the lower portrait area, crest in the clear strip right of the portrait frame, then taper and fade (nested vertical/horizontal masks) before the story and fact cards so no strand crosses readable content; `aria-hidden`, `focusable="false"`, pointer-events-free, rendered at `z-0` under the `z-10` content, and clipped by `overflow-hidden` so it cannot cause horizontal overflow (Hero continuity cue; purpose-built SVG chosen over a second simultaneous WebGL2 context for performance).
- **Heading (approved copy):** `Turning ideas into reliable, scalable web applications.` — `reliable, scalable` highlighted in electric blue; wraps naturally to about two lines on wide desktop.
- **Biography (approved copy):**
  - `I'm a full-stack developer who enjoys building thoughtful backend systems, clean APIs, and smooth user experiences. I care about writing maintainable code, solving real problems, and continuously learning new technologies.`
  - `My goal is to build software that is not only functional, but also dependable and genuinely useful.`
- **Three key facts** in a horizontal row below the story (exactly three equal-height cards with a small icon, mono `01 / LABEL` label, and concise title; wrap responsively to a single column on narrow screens):
  - **Focus** — `Backend systems & APIs`
  - **Toolkit** — `TypeScript · Next.js · PostgreSQL`
  - **Mindset** — `Continuous learning`
- **Integration:** rendered after the Hero in `page.tsx`; the section carries `id="about"` (resolving the existing Header and Footer `#about` anchors) plus `scroll-mt-16` so anchor jumps land below the 64px fixed header instead of underneath it. Decorative icon SVGs in the fact cards are `aria-hidden`.
- **Status:** layout implemented and reviewed — Tasks 06A-1, 06A-2, 06A-2B, final visual pass and browser review (Task 06A-3), Flowing Energy accent restored and tuned (Tasks 06A-4/4B/4C), and the production finishing pass completed and browser-reviewed (Task 06A-Final); lint and production build pass. No metrics, achievements, or unsupported personal claims are present.
- Unresolved (TBD):
  - Genuine personal portrait asset — keep the intentional placeholder frame (camera glyph + `Portrait · TODO` label) until a **verified** image is supplied. Never invent or generate a fictional portrait.

## 8. Section 03 — Featured Projects (Implemented — Task 07A)

- Full cinematic **dark-space environment** consistent with the Hero: restrained star field, soft blue atmospheric lighting, and a dark terrain/cloud silhouette along the lower edge (decorative, `aria-hidden`, pointer-events-free, clipped to the section).
- Editorial chrome: index `03 / PROJECTS`, opposite label `REAL PROJECTS. REAL IMPACT.`, heading `From ideas to **impact.**` (electric-blue highlight on `impact.`), short introduction.
- A dimensional white-and-blue **rocket with a curved electric-blue trajectory** connects the two projects through a **scroll-linked transition**:
  - Custom layered SVG rocket (gradients, metallic/ivory highlights, fins, blue engine illumination with a restrained flicker; no emoji, no Three.js or other 3D dependency).
  - The trajectory follows a clearly curved S-shape rail from Finvia to Nebula; the trail layer is restrained with an illuminated electric-blue core line plus subtle static particles (both paint in from fully hidden at scroll start to fully drawn at scroll end). Two milestones mark the journey (`01 · Ship real solutions` at Finvia, `02 · Build better together` at Nebula) and light up as the rocket passes.
  - GSAP `ScrollTrigger` + `MotionPathPlugin` (from the already-installed gsap package) drive a single **scrubbed** timeline: rocket movement, rotation, and trail progress are tied strictly to scroll progress. No pinning, no hijacking, no independent playback; scoped to the section via `useGSAP()` with a single trigger and full cleanup on unmount. The rocket **faces its actual direction of travel** (Task 07A-2): rotation follows the path's screen-space tangent adjusted for artwork orientation, flips smoothly (+180°) when scrolling reverses (hysteresis + eased steady-state guard, no snapping), retains the last travel direction at rest, and uses a sensible down-path default on initial load.
  - **Milestones (completed — Task 07A-2):** two milestones (`01 · Ship real solutions` at Finvia, `02 · Build better together` at Nebula) highlight the one closest to the rocket's current journey position, driven by the same scroll progress. Stage 01 (Finvia) default static highlight; stage 02 subdued but visible.
  - **Project actions (completed — Task 07A-3):** the only wired action is `Read case study` → the internal case-study route (`/case-studies/finvia`, `/case-studies/nebula`). Live Demo / View Code actions were removed entirely — their URLs are not yet verified, so they are omitted rather than rendered as disabled placeholders (per blueprint §3.3).
  - **Reduced motion / no JS:** meaningful static presentation — full trail drawn (both core + stroke), rocket parked at launch facing down-path, stage 01 milestone marked, stage 02 subdued but visible.
  - Mobile/tablet: the rail compacts to a slim side rail, project content stacks and stays clear of it; no horizontal overflow.
  - One `useGSAP()` block, one `ScrollTrigger` per section, all tweens cleaned up on unmount; `prefers-reduced-motion` gates all animation via `gsap.matchMedia`.
  - **Resolved by Task 07A / Task 07A-2 / Task 07A-3:** curved-S trajectory; direction-aware rocket rotation (tangent-aligned, reverse-aware, jitter-guarded); milestone closest-to-stage highlighting driven by the same scroll progress; Live Demo / View Code actions omitted (unverified URLs), case-study link preserved.
- Feature **exactly two projects** at launch:
  - **Finvia** — invoice & business finance SaaS (invoices, clients, financing workflows, multi-role access, real-time insights). Verified stack: Next.js, TypeScript, PostgreSQL, Prisma. Homepage composition: large preview left, overview right.
  - **Nebula** — real-time communication platform (live chat, channels/DMs, online presence, typing indicators, media sharing). Verified stack: React, Node.js, Express, MongoDB, Socket.IO. Homepage composition: overview left, large preview right (reversed rhythm).
- **LaunchForge AI is not included.**
- Homepage project summaries stay **brief**; detailed information lives on the case-study pages — both routes implemented:
  - `/case-studies/finvia`
  - `/case-studies/nebula`
  - Each case study covers overview, problem, implementation, architecture, key features, and technology stack, with page metadata and a back-link to `/#projects`; unavailable details are marked TBD rather than invented.
- Alternating editorial project compositions driven by a typed, reusable data module (`src/lib/projects.ts`).
- **Screenshots/links policy (implemented):** no genuine project screenshots exist in `public/` yet, so the homepage renders polished responsive HTML/CSS previews built from the verified feature lists — structural placeholder data only (no customer identities, revenue figures, analytics, or business results; framed as interface illustrations, not real screenshots). Live Demo / repository URLs are not yet verified, so those actions render as disabled placeholders (same convention as the Hero Resume CTA); the only wired project action is the internal case-study link.
- The design allows **two more projects** to be added later without redesign (typed data + alternating composition); no empty or placeholder project cards exist.
- Resolved by Task 07A: project summary copy; final 3D/scroll implementation approach (SVG rocket + GSAP scroll-scrub, no 3D library).
- Unresolved (TBD):
  - Genuine project screenshots (swap in for the HTML/CSS previews when verified captures exist).
  - Verified Live Demo and repository URLs for Finvia and Nebula (wire into `demoUrl` / `repoUrl` in `src/lib/projects.ts`).
  - Deeper case-study documentation (auth/testing/deployment specifics, architecture detail).

## 9. Section 04 — Technical Skills (Confirmed direction)

- Dark cinematic styling consistent with surrounding sections.
- Organized **3D technology carousel** — explicitly **not** a generic grid of cards and **not** a constellation.
- Use recognizable technology **logos and names**.
- Planned categories: **All, Frontend, Backend, Database, Tools & DevOps**.
- Interactions: carousel navigation, a progress indicator, and interactive rotation via **mouse drag**.
- Support **touch interaction** on mobile.
- Avoid excessive glow or motion.
- Unresolved (TBD):
  - Exact 3D rendering approach and any required library.
  - **Do not install a 3D library** until its approach and trade-offs are assessed in a separate task.

## 10. Section 05 — Contact (Confirmed direction)

- Dark cinematic ending that **visually echoes the Hero**.
- Minimal, high-impact headline.
- Prominent email call-to-action.
- Social links.
- **No contact form.**
- Unresolved (TBD):
  - Actual email address and social URLs — **must be verified before implementation**.

---

## 11. Planned Routes (Confirmed)

| Route | Purpose |
|---|---|
| `/` | Full single-page portfolio (Hero → About → Projects → Skills → Contact). |
| `/case-studies/finvia` | Detailed case study for Finvia (implemented — Task 07A). |
| `/case-studies/nebula` | Detailed case study for Nebula (implemented — Task 07A). |

Additional project case-study routes may be added later without changing this structure.

## 12. Explicit Exclusions (Confirmed)

- No Google Stitch usage.
- No backend, database, or server infrastructure.
- No ShadCN UI, 3D libraries, or animation libraries installed at initialization.
- No contact form.
- No personal portrait in the Hero.
- No LaunchForge AI project.
- No empty or placeholder project cards.
- No fake metrics, achievements, or arbitrary skill percentages.
- No unapproved dependency changes or unrelated refactors.

## 13. Open Decisions Summary (TBD)

- About portrait asset (genuine personal photo — pending verified image; story copy and three facts are approved, see §7).
- Genuine project screenshots and verified Live Demo / repository URLs (homepage summaries and case-study routes are implemented; deeper case-study documentation also TBD).
- Technology carousel rendering approach (the rocket scroll-transition is implemented — Task 07A).
- Resume URL (see §3.3 — must be verified before wiring the navigation CTA).
- SEO metadata: `metadataBase` / canonical URL and Open Graph image (see §3.5) — pending deployment domain and assets.
- Verified email and social URLs.
