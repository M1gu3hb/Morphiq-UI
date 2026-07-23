"use client";

import * as React from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Vote Buttons
 *
 * A forum-style up/down voter: an upvote button, a live score, and a downvote
 * button, held in a recessed well. Up and down are mutually exclusive toggles
 * (Reddit-style): pressing up while down is active flips the running total by 2.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The two arrow buttons reuse Button's PRIMARY-intent
 * surface recipe and its per-material press physics (resting extrusion, a hover
 * lift, and an active SINK into a pressed inset well); the well behind them
 * reuses the lighter secondary/menu surface, so the score always sits on a
 * measured >= 4.5:1 backdrop.
 *
 *   <VoteButtons score={128} defaultVote="up" onVoteChange={persist} />
 *
 * Accessibility: two real native `<button>`s, each with a distinct accessible
 * name ("Upvote" / "Downvote") and `aria-pressed` reflecting whether that
 * direction is active. Direction is carried by the arrow glyph and label, never
 * by colour; the active state is carried by an outline→solid icon FILL change, a
 * scale, a pressed-in well, and `aria-pressed` — never by colour alone. The score
 * is real text inside an `aria-live="polite"` region that announces the new
 * total ("Score 42"). Enter/Space toggle each button (native).
 *
 * Local theming knobs (override from a parent or `className`; each is read with
 * a literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   button surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   icon colour, border, focus ring
 *   --mq-accent                        active (voted) icon accent
 *   --mq-well / --mq-well-brd          recessed well surface + border
 *   --mq-well-blur / --mq-score        well backdrop blur + score ink
 */

type Material = "clay" | "glass" | "skeuo" | "adaptive";
type VoteSize = "sm" | "md" | "lg";
type VoteVariant = "default";
type VoteOrientation = "vertical" | "horizontal";

/** Which direction the viewer has voted, or `null` for no vote. */
export type VoteDirection = "up" | "down" | null;

/**
 * Palette per material. Declared once on the well; the two buttons, the arrows
 * and the score inherit it through CSS. Button tokens are Button's PRIMARY
 * intent verbatim (so the arrow keeps the measured >= 4.5:1 contract on its
 * surface); well tokens mirror the lighter secondary surface (so the score keeps
 * a >= 4.5:1 ink). `--mq-accent` is a contrast-checked active tint on the arrow
 * surface. `adaptive` additionally flips on `prefers-color-scheme` because it
 * names only opaque surfaces that flip together with the marks on them.
 */
const MATERIAL_TOKENS: Record<Material, string> = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    // Deep oxblood: reads as a red accent against coral yet stays ~5.9:1.
    "[--mq-accent:#6b1200]",
    "[--mq-well:#f4ece0] [--mq-well-brd:rgba(120,80,55,0.22)] [--mq-well-blur:0px] [--mq-score:#33261e]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    // Icy near-white: stays legible even when the translucent surface lightens
    // over a pale backdrop (measured >= 6:1 in the worst case).
    "[--mq-accent:#d6f0ff]",
    "[--mq-well:rgba(244,247,248,0.90)] [--mq-well-brd:rgba(255,255,255,0.72)] [--mq-well-blur:16px] [--mq-score:#1e1e1b]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    // Warm amber on the dark moulded key.
    "[--mq-accent:#ffcf7a]",
    // Greige, warm — the #e6e3da family — so the well belongs to the same
    // moulded material as the keys sitting in it.
    "[--mq-well:#e6e3da] [--mq-well-brd:rgba(25,25,23,0.30)] [--mq-well-blur:0px] [--mq-score:#23231f]",
  ].join(" "),
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "[--mq-accent:#a8b0ff]",
    "[--mq-well:#ffffff] [--mq-well-brd:rgba(23,24,23,0.14)] [--mq-well-blur:0px] [--mq-score:#1c1c19]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-accent:#3b3f8f]",
    "dark:[--mq-well:#26262a] dark:[--mq-well-brd:rgba(255,255,255,0.16)] dark:[--mq-score:#f1efe9]",
  ].join(" "),
};

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width/offset/colour together fully
 * replace the UA outline, so it is never reset with `outline-none`. Raised to
 * `z-10` so a neighbour never clips the ring.
 */
const FOCUS_RING =
  "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:z-10 data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Shared chrome for both arrow buttons. `translate`, not `transform`: Tailwind
 * v4 writes its `translate-*` utilities to the standalone `translate` property,
 * so the transition names it explicitly. The list mirrors Button's — every entry
 * is a property some material's state changes (translate/box-shadow on all,
 * backdrop-filter on glass, filter on skeuo, opacity on disabled).
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-center",
  "border cursor-pointer appearance-none",
  "h-[var(--mq-vb,40px)] w-[var(--mq-vb,40px)] rounded-[var(--mq-vr,13px)]",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four arrow-key recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks into a warm inset well, skeuo deepest, glass/adaptive
 * shallow. `data-[active=true]` is the persistent voted look — the key stays
 * pressed into its well. `motion-reduce` (on the base) drops the travel, but
 * `:active` still applies the inset instantly, so the tactile feedback survives.
 */
const VOTE_SURFACE: Record<Material, string> = {
  clay: [
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_2px_2px_rgba(255,255,255,0.55),inset_0_-3px_5px_rgba(120,40,25,0.18),0_4px_0_var(--mq-edge,#c9482f),0_8px_14px_rgba(75,40,31,0.16)]",
    "hover:-translate-y-[1px]",
    "hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-3px_5px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_18px_rgba(75,40,31,0.2)]",
    "active:translate-y-[2px] active:shadow-[inset_0_3px_6px_rgba(120,40,25,0.32),0_1px_0_var(--mq-edge,#c9482f)]",
    "data-[active=true]:translate-y-[2px] data-[active=true]:shadow-[inset_0_3px_6px_rgba(120,40,25,0.30),0_1px_0_var(--mq-edge,#c9482f)]",
    "forced-colors:data-[active=true]:bg-[Highlight]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_20px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_12px_26px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
    "data-[active=true]:shadow-[inset_0_2px_7px_rgba(24,20,40,0.32)]",
    "forced-colors:[backdrop-filter:none] forced-colors:data-[active=true]:bg-[Highlight]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_4px_0_var(--mq-edge,#131311),0_8px_14px_rgba(38,36,31,0.26)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[3px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
    "data-[active=true]:translate-y-[3px] data-[active=true]:shadow-[inset_0_3px_6px_rgba(0,0,0,0.42),0_1px_0_var(--mq-edge,#131311)]",
    "forced-colors:data-[active=true]:bg-[Highlight]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12),0_4px_10px_rgba(20,20,18,0.10)]",
    "hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    "data-[active=true]:translate-y-[1px] data-[active=true]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    // Coarse pointers get a comfortable touch target; only ever grows the key.
    "pointer-coarse:min-h-[48px] pointer-coarse:min-w-[48px]",
    "forced-colors:data-[active=true]:bg-[Highlight]",
  ].join(" "),
};

const voteButtonVariants = cva(SURFACE_BASE, {
  variants: { material: VOTE_SURFACE },
  defaultVariants: { material: "clay" },
});

/**
 * The recessed well behind the keys and the score. One recipe reads the
 * per-material tokens; `--mq-well-blur` is 0 for every material but glass. The
 * `size` axis is the single source of dimension truth — it sets the CSS
 * variables the keys, arrows and score all read with literal fallbacks.
 */
const voteWellVariants = cva(
  cn(
    "relative isolate inline-flex select-none items-center justify-center",
    "border bg-[var(--mq-well,#f4ece0)] border-[var(--mq-well-brd,rgba(120,80,55,0.22))]",
    "backdrop-blur-[var(--mq-well-blur,0px)] text-[color:var(--mq-score,#33261e)]",
    "shadow-[inset_0_2px_5px_rgba(30,20,10,0.10),inset_0_-1px_0_rgba(255,255,255,0.45)]",
    "gap-[var(--mq-vg,6px)] p-[var(--mq-vp,5px)] rounded-[var(--mq-well-r,18px)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none forced-colors:backdrop-blur-none",
  ),
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row",
      },
      size: {
        sm: "[--mq-vb:32px] [--mq-vi:18px] [--mq-vs:13px] [--mq-vg:4px] [--mq-vp:4px] [--mq-well-r:14px] [--mq-vr:10px]",
        md: "[--mq-vb:40px] [--mq-vi:22px] [--mq-vs:15px] [--mq-vg:6px] [--mq-vp:5px] [--mq-well-r:18px] [--mq-vr:13px]",
        lg: "[--mq-vb:48px] [--mq-vi:26px] [--mq-vs:17px] [--mq-vg:8px] [--mq-vp:6px] [--mq-well-r:22px] [--mq-vr:16px]",
      },
    },
    defaultVariants: { orientation: "vertical", size: "md" },
  },
);

/** Shared arrow class. The active FILL (outline→solid) is the non-colour cue. */
const arrowClass = cn(
  "size-[var(--mq-vi,22px)] shrink-0 fill-none",
  "transition-[color,fill,scale] duration-150 ease-out motion-reduce:transition-none",
  "group-data-[active=true]/vote:fill-current group-data-[active=true]/vote:scale-110",
  "group-data-[active=true]/vote:text-[var(--mq-accent,#6b1200)]",
  "forced-colors:text-[CanvasText]",
  "forced-colors:group-data-[active=true]/vote:text-[HighlightText]",
);

/**
 * Score entrance keyframe, shipped with the component instead of a global sheet.
 * React 19 hoists this `<style>` and dedupes it by `href`. Its resting end-state
 * is `scale:1` (the normal look), so `motion-reduce:animate-none` leaves the
 * number at rest — only the bump is dropped.
 */
const VOTE_KEYFRAMES = `
@keyframes mq-vote-pop{0%{scale:1}35%{scale:1.24}100%{scale:1}}`;

function VoteKeyframes() {
  return (
    <style href="mq-vote-buttons" precedence="medium">
      {VOTE_KEYFRAMES}
    </style>
  );
}

/** Compact, sign-aware score formatting for the visible number. */
function formatScore(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs < 1000) return String(value);
  const scaled = abs / 1000;
  const text = scaled >= 10 ? String(Math.round(scaled)) : scaled.toFixed(1).replace(/\.0$/, "");
  return `${sign}${text}k`;
}

function voteDelta(vote: VoteDirection): number {
  return vote === "up" ? 1 : vote === "down" ? -1 : 0;
}

type VoteButtonsOwnProps = {
  /** Community score EXCLUDING the viewer's own vote; the viewer's delta is added on top. */
  score: number;
  /** Initial vote for the uncontrolled component. */
  defaultVote?: VoteDirection;
  /** Called after a toggle with the new direction and the new displayed total. */
  onVoteChange?: (vote: VoteDirection, score: number) => void;
  material?: Material;
  size?: VoteSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: VoteVariant;
  /** Stacking direction of the two keys and the score. */
  orientation?: VoteOrientation;
  /** Accessible name for the whole voter group. */
  groupLabel?: string;
  /** Accessible name for the upvote button. */
  upLabel?: string;
  /** Accessible name for the downvote button. */
  downLabel?: string;
  disabled?: boolean;
  /** Docs hook: forces the focused ring on the upvote key without a real event. */
  "data-focus"?: string;
};

/**
 * `Omit` the own props off the native div props so the rest — `id`, `data-*`,
 * `aria-*`, `ref` — spread onto the well. `className` dresses the well too.
 */
export type VoteButtonsProps = VoteButtonsOwnProps &
  Omit<React.ComponentPropsWithRef<"div">, keyof VoteButtonsOwnProps>;

export function VoteButtons({
  score,
  defaultVote = null,
  onVoteChange,
  material = "clay",
  size = "md",
  variant = "default",
  orientation = "vertical",
  groupLabel = "Vote",
  upLabel = "Upvote",
  downLabel = "Downvote",
  disabled = false,
  className,
  "data-focus": dataFocus,
  ...rest
}: VoteButtonsProps) {
  const [vote, setVote] = React.useState<VoteDirection>(defaultVote);
  const displayScore = score + voteDelta(vote);

  function toggle(direction: "up" | "down") {
    if (disabled) return;
    const next: VoteDirection = vote === direction ? null : direction;
    setVote(next);
    onVoteChange?.(next, score + voteDelta(next));
  }

  const isUp = vote === "up";
  const isDown = vote === "down";

  return (
    <div
      {...rest}
      aria-label={groupLabel}
      className={cn(voteWellVariants({ orientation, size }), MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-orientation={orientation}
      data-variant={variant}
      role="group"
    >
      <VoteKeyframes />

      <button
        aria-label={upLabel}
        aria-pressed={isUp}
        className={cn(voteButtonVariants({ material }), "group/vote")}
        data-active={isUp ? "true" : "false"}
        data-focus={dataFocus}
        disabled={disabled}
        onClick={() => toggle("up")}
        type="button"
      >
        <ArrowBigUp aria-hidden="true" className={arrowClass} strokeWidth={2.25} />
      </button>

      <span
        aria-atomic="true"
        aria-live="polite"
        className={cn(
          "inline-flex min-w-[var(--mq-vb,40px)] items-center justify-center px-[2px]",
          "font-extrabold tabular-nums tracking-[-0.02em] leading-none",
          "text-[length:var(--mq-vs,15px)] text-[color:var(--mq-score,#33261e)]",
          "forced-colors:text-[CanvasText]",
        )}
      >
        <span className="sr-only">Score </span>
        <span
          className="inline-block animate-[mq-vote-pop_260ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
          key={displayScore}
        >
          {formatScore(displayScore)}
        </span>
      </span>

      <button
        aria-label={downLabel}
        aria-pressed={isDown}
        className={cn(voteButtonVariants({ material }), "group/vote")}
        data-active={isDown ? "true" : "false"}
        disabled={disabled}
        onClick={() => toggle("down")}
        type="button"
      >
        <ArrowBigDown aria-hidden="true" className={arrowClass} strokeWidth={2.25} />
      </button>
    </div>
  );
}

export type VoteButtonsVariantProps = VariantProps<typeof voteButtonVariants>;

export { voteButtonVariants, voteWellVariants };
