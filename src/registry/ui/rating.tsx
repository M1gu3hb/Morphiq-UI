"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Rating
 *
 * An interactive star rating drawn entirely as inline SVG — no icon package, no
 * global stylesheet, no charting helper. It is uncontrolled by default
 * (`defaultValue`) and fully controllable (`value` + `onValueChange`), supports
 * HALF steps, a configurable star count, and a passive read-only display mode.
 *
 * This is a material-AGNOSTIC feedback control: it ships a single style built on
 * the adaptive light+dark token vocabulary. `material` is accepted only for
 * catalog parity and is reflected on `data-material`; it drives no separate
 * recipe.
 *
 * Chosen ARIA pattern — SLIDER, implemented fully:
 *   - Interactive mode puts `role="slider"` on the star row with
 *     `aria-valuemin=0`, `aria-valuemax={count}`, `aria-valuenow` and an
 *     `aria-valuetext` that SPELLS the reading ("3.5 out of 5 stars", or
 *     "No rating" at zero). One tab stop, `aria-orientation="horizontal"`.
 *     `role="slider"` has presentational children, which is exactly right here:
 *     every glyph inside it is decoration over the value the role already
 *     carries. The label, the numeric readout and the status message are
 *     therefore SIBLINGS of the slider, never children of it.
 *   - Read-only mode swaps to `role="img"` with an `aria-label` that spells the
 *     value, and the number is ALSO printed as visible text.
 *   - `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `role` are Omitted
 *     from the public props type so a caller cannot desync them from `value`.
 *
 * Keyboard (interactive mode, single tab stop):
 *   ArrowRight / ArrowUp    +1 step (0.5 when `allowHalf`)
 *   ArrowLeft  / ArrowDown  -1 step
 *   PageUp     / PageDown   plus or minus one whole star
 *   Home                    the minimum (0 — no rating)
 *   End                     the maximum (`count`)
 *
 * Never colour alone: a filled star is a SOLID shape and an empty star is an
 * OUTLINE, a half star is a genuine geometric clip of the solid shape (an
 * overflow window at 50% width, never an opacity fade), and the value is printed
 * as real numeric text next to the row and spelled in words in `aria-valuetext`.
 * The hover preview is carried by a size change plus the word "Preview" and its
 * number — it does not recolour anything and it never touches the committed
 * value; it clears on pointer leave, on commit and on any key press.
 *
 * Local theming knobs, every one referenced with a literal fallback:
 *
 *   --mq-text        primary text (the numeric reading)
 *   --mq-muted       label, preview caption and busy message
 *   --mq-danger      the error message
 *   --mq-on          the filled star
 *   --mq-off         the empty star's outline
 *   --mq-well        the recessed row surface
 *   --mq-brd         the row's hairline border
 *   --mq-ring        focus ring colour
 *   --mq-veil        the busy wash laid over the row
 *   --mq-star        the star box (set by size)
 *   --mq-star-gap    spacing between stars (set by size)
 *   --mq-pad         row padding (set by size)
 *   --mq-radius      row corner radius (set by size)
 *   --mq-value       numeric readout size (set by size)
 *   --mq-msg         label / caption / message size (set by size)
 *   --mq-gap         vertical rhythm (set by size)
 *
 * SSR / SSG safety: no `Date.now()`, no `new Date()`, no `window`, no
 * `localStorage`, no observers and no timers anywhere — the uncontrolled value
 * starts from a deterministic prop, so the server and the client render the same
 * stars. There is not a single `useEffect` in this file, so the
 * `react-hooks/set-state-in-effect` trap cannot be hit; every `setState` lives in
 * a pointer or keyboard handler.
 */

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type RatingSize = "sm" | "md" | "lg";

/** Live-region policy for the status / error line. `auto` derives it from state. */
export type RatingUrgency = "auto" | "polite" | "assertive" | "off";

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/**
 * A five-point star in a 24x24 box, symmetric about x = 12 so a 50% overflow
 * window clips it exactly down its own axis. Drawn twice per star: once stroked
 * with no fill (empty) and once solid (filled), so the two states differ by
 * SHAPE, not by hue.
 */
const STAR_PATH =
  "M12 2.35 15.09 8.61 22 9.62 17 14.49 18.18 21.37 12 18.12 5.82 21.37 7 14.49 2 9.62 8.91 8.61Z";

/**
 * Ink wiping into a star as it commits.
 *
 * The RESTING state is the end state: no `clip-path` at all, so the fill is
 * fully drawn. `motion-reduce:animate-none` therefore leaves every filled star
 * completely rendered — reduced motion loses the wipe, never the reading. The
 * same holds for SSR and for a no-JS render.
 */
const RATING_KEYFRAMES = `@keyframes mq-rating-fill{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}`;

/**
 * Focus ring. Declared for real `:focus-visible` on the slider, and identically
 * behind `data-focus="true"` on the slider itself AND on the component root
 * (`group-data-*`), so the documentation preview can force the focused look
 * without synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "group-data-[focus=true]:outline-2 group-data-[focus=true]:outline-offset-[3px] " +
  "group-data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight] " +
  "forced-colors:group-data-[focus=true]:outline-[Highlight]";

const ratingVariants = cva(
  [
    // `group` so the preview's `data-focus` on the root can reach the slider.
    "group inline-flex flex-col items-start gap-[var(--mq-gap,7px)]",
    // Adaptive light + dark vocabulary. The amber holds 5.2:1 on white and
    // 9.8:1 on the dark surface; the empty-star outline holds 5.1:1 and 6.9:1.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-danger:#9c2f22]",
    "[--mq-on:#a35a00] [--mq-off:#6f6d66]",
    "[--mq-well:#fbfaf7] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
    "[--mq-veil:rgba(251,250,247,0.66)]",
    "[--mq-well-shadow:inset_0_1px_2px_rgba(23,24,23,0.12),0_1px_0_rgba(255,255,255,0.75)]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-danger:#ff9d8e]",
    "dark:[--mq-on:#efb45f] dark:[--mq-off:#a3a19a]",
    "dark:[--mq-well:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-veil:rgba(35,35,39,0.66)]",
    "dark:[--mq-well-shadow:inset_0_1px_2px_rgba(0,0,0,0.50)]",
    "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      // A rating has one composition. `default` exists so the registry can list
      // a variant and the preview can coerce whatever value arrives.
      variant: { default: "" },
      // Size scales the star box and the type around it; nothing else depends
      // on it, so the geometry is identical at every size.
      size: {
        sm: "[--mq-star:18px] [--mq-star-gap:2px] [--mq-pad:5px] [--mq-radius:12px] [--mq-value:12px] [--mq-msg:11px] [--mq-gap:5px]",
        md: "[--mq-star:24px] [--mq-star-gap:3px] [--mq-pad:7px] [--mq-radius:14px] [--mq-value:14px] [--mq-msg:12px] [--mq-gap:7px]",
        lg: "[--mq-star:32px] [--mq-star-gap:4px] [--mq-pad:9px] [--mq-radius:18px] [--mq-value:17px] [--mq-msg:13px] [--mq-gap:9px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** Shared box for both star layers, so the solid one cannot shrink in the clip. */
const STAR_SVG =
  "absolute top-0 left-0 block h-[var(--mq-star,24px)] w-[var(--mq-star,24px)]";

function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
}

/** Spells the reading in words — the string behind aria-valuetext and the label. */
function describeValue(value: number, count: number): string {
  if (value <= 0) return "No rating";
  return `${trimNumber(value)} out of ${count} ${value === 1 ? "star" : "stars"}`;
}

/**
 * One star. The empty outline is always drawn; the solid copy is laid over it
 * inside an overflow window whose width IS the fill fraction, so a half star is
 * a real geometric clip of the solid shape rather than a faded one.
 */
function StarGlyph({ animate, fill }: { animate: boolean; fill: number }) {
  return (
    <>
      <svg
        aria-hidden="true"
        className={STAR_SVG}
        focusable="false"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="[stroke:var(--mq-off,#6f6d66)] forced-colors:[stroke:GrayText]"
          d={STAR_PATH}
          fill="none"
          strokeLinejoin="round"
          strokeWidth={1.7}
        />
      </svg>
      {fill > 0 ? (
        // Keyed by the fill fraction: changing it remounts this window, which is
        // what replays the wipe. The resting state is fully revealed, so a
        // reduced-motion reader simply sees the finished star.
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 block overflow-hidden",
            animate &&
              "animate-[mq-rating-fill_260ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none",
          )}
          key={`fill-${fill}`}
          style={{ width: `${fill * 100}%` }}
        >
          <svg
            aria-hidden="true"
            className={STAR_SVG}
            focusable="false"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="[fill:var(--mq-on,#a35a00)] [stroke:var(--mq-on,#a35a00)] forced-colors:[fill:Highlight] forced-colors:[stroke:Highlight]"
              d={STAR_PATH}
              strokeLinejoin="round"
              strokeWidth={1.7}
            />
          </svg>
        </span>
      ) : null}
    </>
  );
}

/** Decorative glyph beside the error message; the message text carries meaning. */
function WarnGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="block size-[1.05em] shrink-0"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.6 21.6 20.4H2.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path d="M12 10v4.4" stroke="currentColor" strokeLinecap="round" strokeWidth={2} />
      <circle cx={12} cy={17.6} fill="currentColor" r={1.15} />
    </svg>
  );
}

export type RatingProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "children" | "defaultValue" | "role"
> &
  Omit<VariantProps<typeof ratingVariants>, "size" | "variant"> & {
    /** Controlled value. Omit it (and use `defaultValue`) to stay uncontrolled. */
    value?: number;
    /** Uncontrolled starting value. Deterministic, so SSR and hydration agree. */
    defaultValue?: number;
    /** Fires with the committed, clamped and step-snapped value. */
    onValueChange?: (value: number) => void;
    /** Number of stars. Defaults to 5; non-finite or sub-1 values fall back to 5. */
    count?: number;
    /** Allow half steps; the arrow-key step becomes 0.5 and halves are clipped. */
    allowHalf?: boolean;
    /** Passive display mode: `role="img"` with the value spelled in its label. */
    readOnly?: boolean;
    /** Keeps the slider focusable and announced, but refuses input. */
    disabled?: boolean;
    /** Marks the row busy: `aria-busy` on the root, `inert` on the star row. */
    busy?: boolean;
    /** Visible message shown while `busy`. */
    busyLabel?: React.ReactNode;
    /** Validation message. Its presence also sets `aria-invalid` on the row. */
    error?: React.ReactNode;
    /** Live-region policy for that message; `auto` derives it from the state. */
    urgency?: RatingUrgency;
    /** Optional visible label. A string also becomes the accessible name. */
    label?: React.ReactNode;
    /** Print the numeric reading beside the stars. On by default. */
    showValue?: boolean;
    /** Formats the visible reading. Defaults to `"4.5 / 5"`. */
    formatValue?: (value: number, count: number) => string;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: RatingSize;
  };

export function Rating({
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  allowHalf = false,
  busy = false,
  busyLabel = "Saving rating",
  className,
  count = 5,
  defaultValue,
  disabled = false,
  error,
  formatValue,
  label,
  material = "adaptive",
  onValueChange,
  readOnly = false,
  showValue = true,
  size = "md",
  urgency = "auto",
  value,
  variant = "default",
  ...props
}: RatingProps) {
  const safeCount = Number.isFinite(count) && count >= 1 ? Math.floor(count) : 5;
  const step = allowHalf ? 0.5 : 1;

  const clampTo = (input: number): number => {
    if (!Number.isFinite(input)) return 0;
    const snapped = Math.round(input / step) * step;
    return Math.min(Math.max(snapped, 0), safeCount);
  };

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<number>(() =>
    clampTo(defaultValue ?? 0),
  );
  const [preview, setPreview] = React.useState<number | null>(null);

  const current = isControlled ? clampTo(value) : uncontrolled;
  const interactive = !readOnly && !disabled && !busy;
  const isPreviewing = interactive && preview !== null;
  const shown = interactive && preview !== null ? preview : current;

  const reactId = React.useId();
  const messageId = `${reactId}-msg`;
  const isError = error != null;
  const message = isError ? error : busy ? busyLabel : null;
  const resolvedUrgency: RatingUrgency =
    urgency === "auto" ? (isError ? "assertive" : "polite") : urgency;
  const messageRole =
    message == null || resolvedUrgency === "off"
      ? undefined
      : resolvedUrgency === "assertive"
        ? "alert"
        : "status";

  const accessibleName = ariaLabel ?? (typeof label === "string" ? label : "Rating");
  const valueWords = describeValue(current, safeCount);
  const readingText = formatValue
    ? formatValue(current, safeCount)
    : `${trimNumber(current)} / ${safeCount}`;

  // Every setState below sits in a pointer or keyboard handler — never in an
  // effect — and nothing declared in the component body is reassigned from a
  // callback, so neither React 19 lint trap applies.
  function commit(next: number) {
    const clamped = clampTo(next);
    if (!isControlled) setUncontrolled(clamped);
    if (clamped !== current) onValueChange?.(clamped);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    const key = event.key;
    const delta =
      key === "ArrowRight" || key === "ArrowUp"
        ? step
        : key === "ArrowLeft" || key === "ArrowDown"
          ? -step
          : key === "PageUp"
            ? 1
            : key === "PageDown"
              ? -1
              : 0;

    if (delta !== 0) {
      event.preventDefault();
      setPreview(null);
      commit(current + delta);
      return;
    }
    if (key === "Home") {
      event.preventDefault();
      setPreview(null);
      commit(0);
      return;
    }
    if (key === "End") {
      event.preventDefault();
      setPreview(null);
      commit(safeCount);
    }
  }

  const stars = Array.from({ length: safeCount }, (_unused, index) => {
    const raw = Math.min(Math.max(shown - index, 0), 1);
    const fill = allowHalf ? Math.round(raw * 2) / 2 : Math.round(raw);
    // Hit regions: one per star, or two half-width ones when halves are allowed.
    // They live inside `role="slider"`, whose children are presentational, and
    // the slider itself owns the entire keyboard contract — so these are a
    // pointer convenience, never the only route to a value.
    const targets = allowHalf
      ? [
          { key: "half", next: index + 0.5, region: "left-0 w-1/2" },
          { key: "full", next: index + 1, region: "right-0 w-1/2" },
        ]
      : [{ key: "full", next: index + 1, region: "inset-x-0" }];

    return (
      <span
        className={cn(
          "relative block shrink-0",
          "h-[var(--mq-star,24px)] w-[var(--mq-star,24px)]",
          // `scale-*` writes the standalone `scale` property in Tailwind v4, so
          // the transition names `scale` — naming `transform` would animate
          // nothing. Declared only where a state actually changes it, so there
          // is no phantom transition on the read-only display.
          interactive &&
            "transition-[scale] duration-[160ms] ease-out motion-reduce:transition-none data-[active=true]:scale-[1.16]",
        )}
        data-active={isPreviewing && index < Math.ceil(shown) ? "true" : undefined}
        key={index}
      >
        <StarGlyph animate={!isPreviewing} fill={fill} />
        {interactive
          ? targets.map((target) => (
              <span
                className={cn("absolute inset-y-0 z-10 cursor-pointer", target.region)}
                key={target.key}
                onClick={() => {
                  setPreview(null);
                  commit(target.next);
                }}
                onPointerMove={(event) => {
                  // Touch has no hover: previewing there would flash a value the
                  // reader never asked for, one frame before the tap commits.
                  if (event.pointerType === "touch") return;
                  setPreview(target.next);
                }}
              />
            ))
          : null}
      </span>
    );
  });

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a list
        of ratings emits one rule rather than one per row.
      */}
      <style href="mq-rating" precedence="medium">
        {RATING_KEYFRAMES}
      </style>
      <div
        {...props}
        aria-busy={busy || undefined}
        className={cn(ratingVariants({ size, variant }), disabled && "opacity-55", className)}
        data-material={material}
        data-readonly={readOnly ? "true" : undefined}
        data-state={disabled ? "disabled" : busy ? "busy" : isError ? "error" : "idle"}
      >
        {/* aria-hidden: the slider's own accessible name already says this. */}
        {label != null ? (
          <span
            aria-hidden="true"
            className="text-[length:var(--mq-msg,12px)] leading-[1.3] font-semibold text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]"
            data-rating-label=""
          >
            {label}
          </span>
        ) : null}

        <div className="flex flex-wrap items-center gap-[10px]">
          <div
            aria-describedby={message != null ? messageId : undefined}
            aria-disabled={disabled || undefined}
            aria-invalid={isError || undefined}
            aria-label={readOnly ? `${accessibleName}: ${valueWords}` : accessibleName}
            aria-orientation={readOnly ? undefined : "horizontal"}
            aria-valuemax={readOnly ? undefined : safeCount}
            aria-valuemin={readOnly ? undefined : 0}
            aria-valuenow={readOnly ? undefined : current}
            aria-valuetext={readOnly ? undefined : (ariaValueText ?? valueWords)}
            className={cn(
              "relative isolate inline-flex items-center gap-[var(--mq-star-gap,3px)]",
              // The read-only display is bare inline type; only the control gets
              // the recessed well — which is also what gives forced-colors a
              // bound to keep once fills and shadows are discarded.
              !readOnly &&
                [
                  "rounded-[var(--mq-radius,14px)] border p-[var(--mq-pad,7px)]",
                  "border-[var(--mq-brd,rgba(23,24,23,0.14))] bg-[var(--mq-well,#fbfaf7)]",
                  "shadow-[var(--mq-well-shadow,inset_0_1px_2px_rgba(23,24,23,0.12))]",
                  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none",
                  FOCUS_RING,
                ].join(" "),
              isError && !readOnly && "border-[var(--mq-danger,#9c2f22)]",
              disabled && "cursor-not-allowed",
            )}
            data-rating-stars=""
            inert={busy || undefined}
            onKeyDown={handleKeyDown}
            onPointerLeave={() => setPreview(null)}
            role={readOnly ? "img" : "slider"}
            tabIndex={readOnly || busy ? undefined : 0}
          >
            {stars}
            {busy ? (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 z-20 rounded-[inherit]",
                  "bg-[var(--mq-veil,rgba(251,250,247,0.66))] animate-pulse motion-reduce:animate-none",
                  // Forced colours keep background COLOURS, so the veil has to
                  // be cleared by hand or it would wash the system palette. The
                  // busy state survives in the message text and in aria-busy.
                  "forced-colors:bg-transparent",
                )}
              />
            ) : null}
          </div>

          {/* aria-hidden: aria-valuetext (or the img label) already spells this,
              so the visible copy is for sighted readers only. */}
          {showValue ? (
            <span
              aria-hidden="true"
              className="inline-flex items-baseline gap-[8px]"
              data-rating-value=""
            >
              <span className="text-[length:var(--mq-value,14px)] leading-none font-extrabold tabular-nums">
                {readingText}
              </span>
              {isPreviewing ? (
                <span className="text-[length:var(--mq-msg,12px)] leading-none font-semibold tracking-[0.02em] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]">
                  Preview {trimNumber(shown)}
                </span>
              ) : null}
            </span>
          ) : null}
        </div>

        {message != null ? (
          <span
            aria-atomic={messageRole ? true : undefined}
            aria-live={messageRole ? (messageRole === "alert" ? "assertive" : "polite") : undefined}
            className={cn(
              "inline-flex items-center gap-[6px] text-[length:var(--mq-msg,12px)] leading-[1.4] font-semibold",
              isError
                ? "text-[color:var(--mq-danger,#9c2f22)]"
                : "text-[color:var(--mq-muted,#55554e)]",
              "forced-colors:text-[CanvasText]",
            )}
            data-rating-message=""
            id={messageId}
            role={messageRole}
          >
            {/* The state is named in WORDS before the message itself, exactly as
                the Alert prefixes its tone — so "this is an error" never rests
                on the red token or the triangle glyph alone. */}
            <span className={SR_ONLY} data-rating-message-label="">
              {isError ? "Error: " : "Status: "}
            </span>
            {isError ? <WarnGlyph /> : null}
            {message}
          </span>
        ) : null}
      </div>
    </>
  );
}

export { ratingVariants };
