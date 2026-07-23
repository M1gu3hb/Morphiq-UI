import * as React from "react";
import { cn } from "@/lib/cn";

const MORPH_WEIGHT_STYLES = `
@keyframes mq-morph-weight-enter{from{font-variation-settings:"wght" var(--mq-weight-start,420)}to{font-variation-settings:"wght" var(--mq-weight-end,820)}}
.mq-morph-weight{font-variation-settings:"wght" var(--mq-weight-start,420);transition:font-variation-settings var(--mq-weight-duration,520ms) cubic-bezier(.22,1,.36,1)}
.mq-morph-weight[data-variant="interactive"]:hover,.mq-morph-weight[data-variant="interactive"]:focus-visible{font-variation-settings:"wght" var(--mq-weight-end,820)}
.mq-morph-weight[data-variant="entrance"]{animation:mq-morph-weight-enter var(--mq-weight-duration,720ms) cubic-bezier(.22,1,.36,1) both}
@media (prefers-reduced-motion:reduce){.mq-morph-weight{animation:none!important;transition:none!important;font-variation-settings:"wght" var(--mq-weight-end,820)!important}}
@media (forced-colors:active){.mq-morph-weight{color:CanvasText;animation:none!important;font-variation-settings:"wght" var(--mq-weight-end,820)!important}}
`;

function MorphWeightStyles() {
  return (
    <style href="mq-morph-weight-text" precedence="medium">
      {MORPH_WEIGHT_STYLES}
    </style>
  );
}

export type MorphWeightVariant = "interactive" | "entrance";
export type MorphWeightTextProps = React.ComponentPropsWithRef<"span"> & {
  variant?: MorphWeightVariant;
  from?: number;
  to?: number;
  duration?: number;
  focusable?: boolean;
};

type MorphWeightStyle = React.CSSProperties & {
  "--mq-weight-start": number;
  "--mq-weight-end": number;
  "--mq-weight-duration": string;
};

export function MorphWeightText({
  children,
  className,
  duration = 620,
  focusable = false,
  from = 420,
  style,
  tabIndex,
  to = 820,
  variant = "interactive",
  ...props
}: MorphWeightTextProps) {
  const effectStyle: MorphWeightStyle = {
    ...style,
    "--mq-weight-start": Math.min(900, Math.max(100, from)),
    "--mq-weight-end": Math.min(900, Math.max(100, to)),
    "--mq-weight-duration": `${Math.max(120, duration)}ms`,
    fontFamily: '"Manrope Variable", Manrope, ui-sans-serif, system-ui, sans-serif',
  };

  return (
    <>
      <MorphWeightStyles />
      <span
        {...props}
        className={cn(
          "mq-morph-weight inline-block text-inherit",
          "focus-visible:rounded-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-[0.14em] focus-visible:outline-current",
          className,
        )}
        data-variant={variant}
        style={effectStyle}
        tabIndex={tabIndex ?? (focusable && variant === "interactive" ? 0 : undefined)}
      >
        {children}
      </span>
    </>
  );
}
