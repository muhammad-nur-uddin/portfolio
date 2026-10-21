import type { ComponentPropsWithoutRef } from "react";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Visual context. `light` applies `.theme-light` so the approved semantic
   * tokens swap to the warm-ivory editorial palette; `dark` (default) uses the
   * root cinematic tokens.
   */
  theme?: "dark" | "light";
};

type ContainerProps = ComponentPropsWithoutRef<"div">;

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Semantic section wrapper. Applies the shared `bg-bg`/`text-fg` tokens and the
 * default vertical rhythm. It does NOT insert a `Container` — the caller decides
 * content width and may add classes for special layouts or full-bleed designs.
 */
export function Section({
  theme = "dark",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      {...props}
      className={cx(
        theme === "light" && "theme-light",
        "bg-bg text-fg",
        "py-section lg:py-section-lg xl:py-section-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Horizontal layout primitive: centers content, caps it at the approved max
 * width, and applies the responsive gutters. Adds no background or vertical
 * spacing so it can sit inside any `Section`.
 */
export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={cx(
        "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
