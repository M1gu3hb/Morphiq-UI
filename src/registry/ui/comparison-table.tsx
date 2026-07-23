"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Comparison Table
 *
 * A plans × features pricing/feature MATRIX rendered as a REAL `<table>`. Self
 * contained by design: every recipe lives in this file and it reads no `:root`
 * custom property, so copying this file plus `src/lib/cn.ts` reproduces the full
 * look.
 *
 * This is a material-AGNOSTIC data component: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Accessibility is native, not bolted on — the graphic IS the accessible object:
 *   - A `<caption>` names the table (visible or `sr-only`), the plan columns are
 *     `<th scope="col">` and each feature row leads with `<th scope="row">`, so a
 *     screen reader announces every cell already tied to its feature AND its plan.
 *   - COLOR is never the sole carrier: a boolean cell is a CHECK or a DASH — two
 *     distinct SHAPES — each paired with `sr-only` "Included" / "Not included"
 *     text, so the answer reads without perceiving any colour. A value cell shows
 *     its text directly. A recommended plan is flagged by a text BADGE and boxed
 *     rails, not by hue alone.
 *   - Contrast: body, header and muted text all clear 4.5:1 against a light and a
 *     dark surface; the check / dash glyphs clear the 3:1 informative-mark bar in
 *     both schemes.
 *   - forced-colors: fills and shadows are discarded but borders are kept as
 *     `CanvasText`, the check / dash glyphs become `CanvasText`, and the
 *     recommended plan's badge switches to the system `Highlight` pair so the
 *     "selected" column stays perceivable.
 *   - The table fades in on mount reduced-motion-safe WITHOUT JS: its resting
 *     state is fully opaque (so SSR, no-JS and reduced motion all show it), and
 *     the entrance is `@starting-style` (the `starting:` variant) on `opacity`
 *     with `motion-reduce:transition-none` landing straight on the final value.
 *     Opacity was chosen over a transform so a sticky header is never trapped in
 *     a transformed containing block.
 *   - Every value is a prop, so nothing in render is time-dependent or random.
 *
 * Local theming knobs (each used with a literal fallback at its use site):
 *
 *   --mq-surface       table background
 *   --mq-head          header cell background (opaque, so a sticky header covers rows)
 *   --mq-head-text     header text colour
 *   --mq-text          body text colour
 *   --mq-muted         secondary text (descriptions, notes, visible caption)
 *   --mq-zebra         even-row background (when zebra is enabled)
 *   --mq-hover         row hover tint
 *   --mq-rule          hairline colour for borders and row dividers
 *   --mq-yes           "included" check colour
 *   --mq-no            "not included" dash colour
 *   --mq-accent        recommended-column rails + badge background
 *   --mq-accent-bg     recommended-column body tint (translucent)
 *   --mq-head-accent   recommended-column header background (opaque, sticky-safe)
 *   --mq-badge-text    badge text colour
 *   --mq-radius        outer corner radius (set by size)
 *   --mq-font          body font size (set by size)
 *   --mq-cell-x        horizontal cell padding (set by size)
 *   --mq-cell-y        vertical body-cell padding (set by size)
 *   --mq-head-y        vertical header-cell padding (set by size)
 */

/** An `sr-only` utility, inlined so the component needs no global stylesheet. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/** A cell is either a boolean (check / dash) or a literal value shown as text. */
export type ComparisonCell = boolean | string | number;

export type ComparisonPlan = {
  /** Stable key for React and for the column. */
  id: string;
  /** Visible plan name, e.g. "Pro". */
  name: React.ReactNode;
  /** Optional secondary line under the name, e.g. a price. */
  note?: React.ReactNode;
  /** Flag this column as the recommended plan (text badge + boxed rails). */
  highlighted?: boolean;
  /** Badge text for a highlighted plan. Defaults to `badgeLabel` ("Recommended"). */
  badge?: React.ReactNode;
};

export type ComparisonFeature = {
  /** Stable key for React and for the row. */
  id: string;
  /** Visible feature name; rendered as the row's `<th scope="row">`. */
  label: React.ReactNode;
  /** Optional secondary line under the feature name. */
  description?: React.ReactNode;
  /** One cell per plan, in the SAME order as `plans`. */
  cells: ReadonlyArray<ComparisonCell>;
};

export type ComparisonTableProps = Omit<
  React.ComponentPropsWithRef<"table">,
  "children"
> & {
  /** Plan columns, in display order. */
  plans: ReadonlyArray<ComparisonPlan>;
  /** Feature rows, in display order. Each row's `cells` align with `plans`. */
  features: ReadonlyArray<ComparisonFeature>;
  /** Table caption. Always rendered as a real `<caption>`; hidden unless visible. */
  caption: React.ReactNode;
  /** Show the caption above the table instead of only exposing it to AT. */
  captionVisible?: boolean;
  /** Header for the top-left corner cell (the feature column). Defaults to "Feature". */
  featureHeader?: React.ReactNode;
  /** Pin the header row with `position: sticky`; its background stays opaque. */
  stickyHeader?: boolean;
  /** Tint even rows for readability. */
  zebra?: boolean;
  /** Default badge text for highlighted plans without their own `badge`. */
  badgeLabel?: React.ReactNode;
  /** AT text for an included boolean cell. Defaults to "Included". */
  includedLabel?: string;
  /** AT text for a not-included boolean cell. Defaults to "Not included". */
  excludedLabel?: string;
  /** Fade the table in on mount. Reduced motion always lands fully opaque. */
  animate?: boolean;
  /** Accepted for catalog parity; reflected on `data-material` only. */
  material?: MaterialSlug;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  /** Class for the inner `<table>`; `className` targets the scroll wrapper. */
  tableClassName?: string;
};

/**
 * Tokens + size scale live on the scroll wrapper so custom properties inherit
 * down to the table and every cell without a context provider. Being agnostic,
 * there is a single style with a light palette and its `dark:` counterpart.
 */
const comparisonTableVariants = cva(
  [
    "w-full overflow-x-auto",
    "rounded-[var(--mq-radius,16px)] border border-[var(--mq-rule,rgba(23,24,23,0.12))]",
    // Material depth in the normal scheme; discarded in forced-colors, where the
    // border keeps the outer bound.
    "shadow-[0_1px_2px_rgba(23,24,23,0.06),0_18px_36px_-24px_rgba(23,24,23,0.30)]",
    "dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_18px_40px_-24px_rgba(0,0,0,0.7)]",
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    // Adaptive palette — light.
    "[--mq-surface:#ffffff] [--mq-head:#f5f4f0] [--mq-head-text:#33322d] [--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-zebra:rgba(23,24,23,0.035)] [--mq-hover:rgba(23,24,23,0.05)] [--mq-rule:rgba(23,24,23,0.12)]",
    "[--mq-yes:#15703f] [--mq-no:#55554e] [--mq-accent:#3f5bd9] [--mq-accent-bg:rgba(63,91,217,0.07)] [--mq-head-accent:#edf0fd] [--mq-badge-text:#ffffff]",
    // Adaptive palette — dark. The surface flips with the text, so the opaque
    // header still covers rows behind a sticky header.
    "dark:[--mq-surface:#1b1b1f] dark:[--mq-head:#26262b] dark:[--mq-head-text:#f1efe9] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b7b5ae] dark:[--mq-zebra:rgba(255,255,255,0.04)] dark:[--mq-hover:rgba(255,255,255,0.07)] dark:[--mq-rule:rgba(255,255,255,0.14)]",
    "dark:[--mq-yes:#5ad18b] dark:[--mq-no:#b7b5ae] dark:[--mq-accent:#8ea2ff] dark:[--mq-accent-bg:rgba(142,162,255,0.12)] dark:[--mq-head-accent:#24273a] dark:[--mq-badge-text:#191b23]",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "[--mq-radius:12px] [--mq-font:12px] [--mq-cell-x:12px] [--mq-cell-y:8px] [--mq-head-y:10px]",
        md: "[--mq-radius:16px] [--mq-font:13px] [--mq-cell-x:16px] [--mq-cell-y:11px] [--mq-head-y:14px]",
        lg: "[--mq-radius:20px] [--mq-font:14px] [--mq-cell-x:20px] [--mq-cell-y:14px] [--mq-head-y:18px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const HEAD_PAD = "px-[var(--mq-cell-x,16px)] py-[var(--mq-head-y,14px)]";

const HEAD_BASE = cn(
  "border-b border-[var(--mq-rule,rgba(23,24,23,0.12))] forced-colors:border-[CanvasText]",
  "[background-color:var(--mq-head,#f5f4f0)] forced-colors:[background-color:Canvas]",
  "text-[color:var(--mq-head-text,#33322d)] forced-colors:text-[CanvasText]",
  HEAD_PAD,
  "align-bottom font-bold",
);

/** Opaque recommended-header background + boxed top/side rails (sticky-safe). */
const HEAD_ACCENT = cn(
  "[background-color:var(--mq-head-accent,#edf0fd)]",
  "border-x-2 border-t-2 rounded-t-[8px]",
  "[border-left-color:var(--mq-accent,#3f5bd9)] [border-right-color:var(--mq-accent,#3f5bd9)] [border-top-color:var(--mq-accent,#3f5bd9)]",
  "forced-colors:[border-left-color:CanvasText] forced-colors:[border-right-color:CanvasText] forced-colors:[border-top-color:CanvasText] forced-colors:[background-color:Canvas]",
);

const ROW_HEADER = cn(
  "border-b border-[var(--mq-rule,rgba(23,24,23,0.12))] forced-colors:border-[CanvasText]",
  "px-[var(--mq-cell-x,16px)] py-[var(--mq-cell-y,11px)] align-middle text-left",
  "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
  "font-semibold whitespace-normal",
);

const BODY_CELL = cn(
  "border-b border-[var(--mq-rule,rgba(23,24,23,0.12))] forced-colors:border-[CanvasText]",
  "px-[var(--mq-cell-x,16px)] py-[var(--mq-cell-y,11px)] align-middle text-center",
  "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText] tabular-nums",
);

/** Translucent body tint + side rails for a recommended column's data cells. */
const BODY_ACCENT = cn(
  "[background-color:var(--mq-accent-bg,rgba(63,91,217,0.07))]",
  "border-x-2 [border-left-color:var(--mq-accent,#3f5bd9)] [border-right-color:var(--mq-accent,#3f5bd9)]",
  "forced-colors:[border-left-color:CanvasText] forced-colors:[border-right-color:CanvasText] forced-colors:[background-color:Canvas]",
);

const BADGE = cn(
  "mb-[3px] inline-flex items-center rounded-full px-[8px] py-[2px]",
  "text-[0.66em] font-bold uppercase leading-none tracking-[0.05em]",
  "[background-color:var(--mq-accent,#3f5bd9)] text-[color:var(--mq-badge-text,#ffffff)]",
  "forced-colors:[background-color:Highlight] forced-colors:text-[HighlightText]",
);

const MUTED_LINE =
  "mt-[2px] block text-[0.82em] font-normal text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]";

/** A single boolean answer: a shape (check / dash) + an sr-only word. */
function BooleanCell({
  value,
  includedLabel,
  excludedLabel,
}: {
  value: boolean;
  includedLabel: string;
  excludedLabel: string;
}) {
  const Glyph = value ? Check : Minus;
  return (
    <span className="inline-flex items-center justify-center">
      {/* Decorative: meaning is carried by the glyph's SHAPE and the sr-only word,
          so colour is never the sole cue. Kept as CanvasText in forced-colors. */}
      <Glyph
        aria-hidden="true"
        className={cn(
          "size-[1.2em] shrink-0",
          value
            ? "text-[color:var(--mq-yes,#15703f)]"
            : "text-[color:var(--mq-no,#55554e)]",
          "forced-colors:text-[CanvasText]",
        )}
        strokeWidth={value ? 2.75 : 2.5}
      />
      <span className={SR_ONLY}>{value ? includedLabel : excludedLabel}</span>
    </span>
  );
}

function renderCell(
  cell: ComparisonCell,
  includedLabel: string,
  excludedLabel: string,
): React.ReactNode {
  if (typeof cell === "boolean") {
    return (
      <BooleanCell
        value={cell}
        includedLabel={includedLabel}
        excludedLabel={excludedLabel}
      />
    );
  }
  return <span>{String(cell)}</span>;
}

/**
 * The comparison table. Uncontrolled and stateless: plans and features are props,
 * so nothing is time-dependent or random in render and there is nothing to hydrate.
 */
export function ComparisonTable({
  animate = true,
  badgeLabel = "Recommended",
  caption,
  captionVisible = false,
  className,
  excludedLabel = "Not included",
  featureHeader = "Feature",
  features,
  includedLabel = "Included",
  material = "adaptive",
  plans,
  size = "md",
  stickyHeader = false,
  tableClassName,
  variant = "default",
  zebra = false,
  ...rest
}: ComparisonTableProps) {
  return (
    <div
      className={cn(
        comparisonTableVariants({ variant, size }),
        // Fade in on mount, reduced-motion-safe: the resting state is fully
        // opaque (SSR / no-JS / reduced motion show it), and @starting-style
        // supplies the from-transparent entrance. Opacity (not a transform) so a
        // sticky header is never caught in a transformed containing block.
        animate &&
          "opacity-100 starting:opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none",
        className,
      )}
      data-material={material}
    >
      <table
        {...rest}
        className={cn(
          "w-full border-separate border-spacing-0 text-left",
          "text-[length:var(--mq-font,13px)] text-[color:var(--mq-text,#1c1c19)]",
          "[background-color:var(--mq-surface,#ffffff)]",
          "forced-colors:[background-color:Canvas] forced-colors:text-[CanvasText]",
          tableClassName,
        )}
      >
        <caption
          className={cn(
            "[caption-side:top]",
            captionVisible
              ? cn(
                  HEAD_PAD,
                  "text-left text-[11px] leading-[1.4] font-semibold tracking-[0.01em]",
                  "text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]",
                )
              : SR_ONLY,
          )}
        >
          {caption}
        </caption>
        <thead>
          <tr>
            <th
              className={cn(
                HEAD_BASE,
                "text-left",
                stickyHeader && "sticky top-0 z-20",
              )}
              scope="col"
            >
              {featureHeader}
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                aria-current={plan.highlighted ? "true" : undefined}
                className={cn(
                  HEAD_BASE,
                  "text-center",
                  plan.highlighted && HEAD_ACCENT,
                  stickyHeader && "sticky top-0 z-10",
                )}
                scope="col"
              >
                <span className="flex flex-col items-center leading-tight">
                  {plan.highlighted ? (
                    <span className={BADGE}>{plan.badge ?? badgeLabel}</span>
                  ) : null}
                  <span className="text-[1.08em] font-bold">{plan.name}</span>
                  {plan.note ? <span className={MUTED_LINE}>{plan.note}</span> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr
              key={feature.id}
              className={cn(
                "transition-colors duration-150 ease-out motion-reduce:transition-none",
                zebra && "even:[background-color:var(--mq-zebra,rgba(23,24,23,0.035))]",
                "hover:[background-color:var(--mq-hover,rgba(23,24,23,0.05))]",
                // The wrapper draws the outer bottom bound, so drop the last row's
                // divider to avoid a doubled hairline. The recommended column's
                // vertical rails then close against the wrapper's own border.
                "last:[&>th]:border-b-0 last:[&>td]:border-b-0",
              )}
            >
              <th className={ROW_HEADER} scope="row">
                <span className="block">{feature.label}</span>
                {feature.description ? (
                  <span className={MUTED_LINE}>{feature.description}</span>
                ) : null}
              </th>
              {plans.map((plan, colIndex) => (
                <td
                  key={plan.id}
                  className={cn(BODY_CELL, plan.highlighted && BODY_ACCENT)}
                >
                  {renderCell(feature.cells[colIndex], includedLabel, excludedLabel)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { comparisonTableVariants };
