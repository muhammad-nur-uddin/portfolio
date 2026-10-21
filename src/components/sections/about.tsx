'use client';

// Approved copy — Task 06A-1. Derived only from verified facts; no invented
// claims, metrics, or achievements.
const eyebrow = 'ABOUT ME';
const headingPart1 = 'Turning ideas into';
const headingHighlight = 'reliable, scalable';
const headingPart2 = 'web applications';
const bio1 =
  "I'm a full-stack developer who enjoys building thoughtful backend systems, clean APIs, and smooth user experiences. I care about writing maintainable code, solving real problems, and continuously learning new technologies.";
const bio2 =
  'My goal is to build software that is not only functional, but also dependable and genuinely useful.';
const factsLabel = 'A FEW THINGS ABOUT ME';

const facts = [
  {
    number: '01',
    label: 'FOCUS',
    title: 'Backend systems & APIs',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 12h20M2 12v8l5-4 5 4 5-4v-8" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    number: '02',
    label: 'TOOLKIT',
    title: 'TypeScript · Next.js · PostgreSQL',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    number: '03',
    label: 'MINDSET',
    title: 'Continuous learning',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export function About() {
  return (
    <section
      id="about"
      className="bg-bg text-fg relative overflow-hidden scroll-mt-16 pt-14 pb-10 lg:pt-16 lg:pb-12 xl:pt-20 xl:pb-14"
    >
      {/* Subtle blue ambient lighting — decorative, no content impact. */}
      <div
        className="absolute top-0 left-[20%] w-72 h-72 bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-[20%] w-96 h-96 bg-accent/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      {/* Flowing Energy accent (Task 06A-4C) — three broad, layered
          translucent energy ribbons in the bottom-left: visible-width blue
          bodies with luminous cores, fine blue/cyan filaments, and restrained
          ivory glints. The ribbons sweep along the lower edge and around the
          lower portrait area, crest in the clear strip right of the portrait
          frame (meaningful artwork stays outside the frame), then taper and
          fade before the story/fact cards (nested masks). Decorative only:
          aria-hidden, non-focusable, pointer-events-none, z-0 behind the z-10
          content, clipped by the section's overflow-hidden (no overflow). */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[280px] w-[52%] max-w-[760px]"
        viewBox="0 0 960 480"
        preserveAspectRatio="xMinYMax meet"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          {/* Soft top fade so rising ribbons blend into the dark. */}
          <linearGradient id="about-fade-y" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="480">
            <stop offset="0" stopColor="#000" stopOpacity="1" />
            <stop offset="0.1" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.22" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="about-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="480">
            <rect x="0" y="0" width="960" height="480" fill="url(#about-fade-y)" />
          </mask>
          {/* Right falloff: ribbons taper out before the story column. */}
          <linearGradient id="about-fade-x-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="960" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.75" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.88" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="0.97" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="about-fade-x" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="480">
            <rect x="0" y="0" width="960" height="480" fill="url(#about-fade-x-g)" />
          </mask>
          {/* Crest tint: electric blue drifting to cyan along the crests. */}
          <linearGradient id="about-crest" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="860" y2="0">
            <stop offset="0" stopColor="#4169E1" />
            <stop offset="0.6" stopColor="#00E5FF" />
            <stop offset="1" stopColor="#4169E1" />
          </linearGradient>
          <filter id="about-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <radialGradient id="about-atmos-a">
            <stop offset="0" stopColor="#4169E1" stopOpacity="0.16" />
            <stop offset="1" stopColor="#4169E1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="about-atmos-b">
            <stop offset="0" stopColor="#00E5FF" stopOpacity="0.07" />
            <stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="about-atmos-c">
            <stop offset="0" stopColor="#4169E1" stopOpacity="0.09" />
            <stop offset="1" stopColor="#4169E1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft atmospheric blue lighting along the ribbon sweep. */}
        <ellipse cx="300" cy="400" rx="340" ry="160" fill="url(#about-atmos-a)" />
        <ellipse cx="740" cy="300" rx="260" ry="200" fill="url(#about-atmos-b)" />
        <ellipse cx="150" cy="330" rx="240" ry="180" fill="url(#about-atmos-c)" />

        {/* Three broad energy ribbons — visible-width translucent bodies with
            luminous cores, sweeping from the bottom-left along the lower edge,
            around the lower portrait area, cresting in the clear strip right
            of the portrait frame, then tapering before the story column. */}
        <g mask="url(#about-fade)">
          <g mask="url(#about-fade-x)">
            {/* Soft blurred glow bodies under each ribbon (one shared filter). */}
            <g filter="url(#about-glow)" fill="none" strokeLinecap="round">
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="#4169E1" strokeWidth="76" strokeOpacity="0.1" />
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#4169E1" strokeWidth="64" strokeOpacity="0.09" />
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#00E5FF" strokeWidth="56" strokeOpacity="0.08" />
            </g>
            {/* Ribbon bodies: wide translucent band + layered inner depth +
                restrained luminous core. */}
            <g fill="none" strokeLinecap="round">
              {/* Ribbon A — main sweep, cresting right of the portrait frame. */}
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="#4169E1" strokeWidth="48" strokeOpacity="0.1" />
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="#4169E1" strokeWidth="32" strokeOpacity="0.13" />
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="#4169E1" strokeWidth="18" strokeOpacity="0.18" />
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="#4169E1" strokeWidth="9" strokeOpacity="0.27" />
              <path d="M -50 455 C 140 432, 330 415, 510 392 C 630 377, 690 310, 745 230 C 785 172, 830 168, 875 215" stroke="url(#about-crest)" strokeWidth="2.6" strokeOpacity="0.75" />
              {/* Ribbon B — companion sweep, cyan-cored. */}
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#4169E1" strokeWidth="40" strokeOpacity="0.09" />
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#4169E1" strokeWidth="26" strokeOpacity="0.12" />
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#4169E1" strokeWidth="15" strokeOpacity="0.17" />
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#4169E1" strokeWidth="7" strokeOpacity="0.24" />
              <path d="M -50 475 C 160 455, 360 445, 540 425 C 650 412, 705 355, 755 285 C 795 230, 840 228, 880 268" stroke="#00E5FF" strokeWidth="2.2" strokeOpacity="0.6" />
              {/* Ribbon C — low broad body flowing along the bottom edge. */}
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#4169E1" strokeWidth="36" strokeOpacity="0.08" />
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#4169E1" strokeWidth="24" strokeOpacity="0.11" />
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#4169E1" strokeWidth="13" strokeOpacity="0.15" />
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#4169E1" strokeWidth="6" strokeOpacity="0.2" />
              <path d="M -50 438 C 130 408, 340 392, 530 372 C 650 359, 710 344, 770 330 C 815 319, 852 316, 885 320" stroke="#4169E1" strokeWidth="1.8" strokeOpacity="0.5" />
              {/* Fine blue/cyan filaments weaving around the ribbon bodies. */}
              <path d="M -50 449 C 145 427, 335 410, 515 387 C 635 372, 695 305, 750 225 C 790 167, 835 163, 878 210" stroke="#4169E1" strokeWidth="1" strokeOpacity="0.28" />
              <path d="M -50 461 C 135 437, 325 420, 505 397 C 625 382, 685 315, 740 235 C 780 177, 825 173, 872 220" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.3" />
              <path d="M -50 443 C 150 421, 342 405, 520 382 C 640 367, 700 300, 756 220 C 796 162, 840 158, 882 205" stroke="#4169E1" strokeWidth="0.7" strokeOpacity="0.22" />
              <path d="M -50 469 C 165 450, 365 440, 545 420 C 655 407, 710 350, 760 280 C 800 225, 845 223, 884 263" stroke="#4169E1" strokeWidth="0.9" strokeOpacity="0.26" />
              <path d="M -50 481 C 155 460, 355 450, 535 430 C 645 417, 700 360, 750 290 C 790 235, 835 233, 878 273" stroke="#00E5FF" strokeWidth="0.7" strokeOpacity="0.24" />
              <path d="M -50 472 C 170 453, 372 443, 552 423 C 662 410, 717 353, 767 283 C 807 228, 852 226, 888 266" stroke="#4169E1" strokeWidth="0.6" strokeOpacity="0.2" />
              <path d="M -50 432 C 135 403, 345 387, 535 367 C 655 354, 715 339, 775 325 C 820 314, 857 311, 889 315" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.24" />
              <path d="M -50 444 C 125 413, 335 397, 525 377 C 645 364, 705 349, 765 335 C 810 324, 847 321, 881 325" stroke="#4169E1" strokeWidth="0.6" strokeOpacity="0.18" />
              <path d="M -50 466 C 200 470, 420 455, 600 435 C 700 424, 780 395, 860 370" stroke="#00E5FF" strokeWidth="0.7" strokeOpacity="0.22" />
              <path d="M -50 458 C 190 462, 410 447, 590 427 C 695 415, 775 386, 855 360" stroke="#4169E1" strokeWidth="0.5" strokeOpacity="0.16" />
            </g>
            {/* Restrained ivory glints along crests and tails. */}
            <g fill="#F7F6F2">
              <circle cx="762" cy="178" r="5" opacity="0.07" />
              <circle cx="762" cy="178" r="1.5" opacity="0.45" />
              <circle cx="768" cy="252" r="4.5" opacity="0.06" />
              <circle cx="768" cy="252" r="1.3" opacity="0.38" />
              <circle cx="512" cy="394" r="4.5" opacity="0.06" />
              <circle cx="512" cy="394" r="1.3" opacity="0.35" />
              <circle cx="340" cy="394" r="4" opacity="0.05" />
              <circle cx="340" cy="394" r="1.2" opacity="0.3" />
              <circle cx="872" cy="262" r="4" opacity="0.05" />
              <circle cx="872" cy="262" r="1.2" opacity="0.3" />
            </g>
          </g>
        </g>
      </svg>

      {/* Local container — About uses a wider content measure (~1380px) than
          the shared Container so the two-column composition breathes on large
          screens; z-10 keeps content above the decorative background layers. */}
      <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Section marker: technical label left, editorial label right. */}
        <div className="mb-6 flex items-center justify-between lg:mb-8">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
          <span className="font-mono text-xs text-muted tracking-wider">
            A LITTLE BEYOND THE CODE
          </span>
        </div>

        {/* Two-column composition: portrait left (~38%), content right (~62%). */}
        <div className="grid gap-12 lg:grid-cols-[38fr_62fr] lg:gap-10 xl:gap-12 items-start">
          {/* Portrait — editorial frame with thin blue edge, capped width. */}
          <div className="relative mx-auto w-full max-w-[370px] lg:mx-0">
            <div className="relative rounded-2xl border border-accent/30 bg-surface p-2 shadow-[0_0_40px_rgba(65,105,225,0.15)]">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-accent/5">
                {/* Portrait placeholder — deliberate empty slot for a real photo. */}
                <div className="absolute inset-0 bg-gradient-to-br from-surface via-accent/[0.06] to-surface">
                  {/* Restrained blue ambient light. */}
                  <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(65,105,225,0.12),transparent_65%)]"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted/70">
                      Portrait · TODO
                    </p>
                  </div>
                </div>
                {/* Inner edge highlight. */}
                <div
                  className="absolute inset-0 rounded-xl border border-accent/20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Content column. */}
          <div className="flex flex-col gap-4 lg:gap-5">
            {/* Heading block — heading + underline only. The section-level
                `ABOUT ME` label above carries the eyebrow; the redundant inner
                eyebrow above the heading was removed (Task 06A-Final). */}
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-[clamp(2.5rem,3.2vw,3.5rem)] leading-[1.06] tracking-tight text-fg">
                {headingPart1} <span className="text-accent">{headingHighlight}</span> {headingPart2}.
              </h2>
              <div className="h-px w-20 bg-accent" />
            </div>

            <div className="prose-sm max-w-none text-muted leading-relaxed space-y-4">
              <p>{bio1}</p>
              <p>{bio2}</p>
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <span className="font-mono text-xs text-muted tracking-wider uppercase">
                {factsLabel}
              </span>
              <div className="h-px w-20 bg-accent ml-4" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-4">
              {facts.map((fact) => (
                <div
                  key={fact.number}
                  className="flex h-full min-w-0 flex-col gap-3 rounded-xl border border-border/50 bg-surface/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 text-accent">
                      {fact.icon}
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-muted">
                      <span className="text-accent">{fact.number}</span> / {fact.label}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-medium leading-snug text-fg">
                    {fact.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
