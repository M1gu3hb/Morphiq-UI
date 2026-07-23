"use client";

import * as React from "react";
import { Check, Facebook, Link as LinkIcon, Linkedin, Mail, Share2, Twitter } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Share Button
 *
 * A trigger that discloses a hand-rolled popover of share destinations
 * (X/Twitter, Facebook, LinkedIn, Email) plus a "Copy link" action. The trigger
 * is a real native `<button>` carrying a visible label, `aria-haspopup="dialog"`,
 * `aria-expanded` that reflects the open state, and `aria-controls` that points
 * at the popover only while it is mounted. The surface is a `role="dialog"` with
 * `aria-modal="true"`, named by its visible heading via `aria-labelledby`, and
 * focus is TRAPPED inside it while open (Tab / Shift+Tab cycle within).
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The material recipe is Button's own PRIMARY-intent
 * token values, inlined into a `material` axis, with the same per-material press
 * physics (resting shadow, a hover lift, and an active SINK into a pressed inset
 * well). The popover surface reuses Split Button's menu recipe verbatim.
 *
 *   <ShareButton
 *     material="clay"
 *     size="md"
 *     url="https://morphiq.dev/components/share-button"
 *     shareTitle="Share Button — Morphiq UI"
 *   >
 *     Share
 *   </ShareButton>
 *
 * Keyboard: Click / Enter / Space open the popover and move focus to the first
 * control. Tab / Shift+Tab cycle within (focus trap). Escape closes and RETURNS
 * focus to the trigger; a pointer press outside closes. "Copy link" writes to an
 * always-mounted `aria-live="polite"` region ("Link copied") and shows a visible
 * "Copied" confirmation, so the state is never carried by colour alone.
 *
 * Local theming knobs (override from a parent or `className`, each read with a
 * literal fallback):
 *
 *   --mq-body / --mq-lit / --mq-edge   surface, top highlight, extruded edge
 *   --mq-text / --mq-brd / --mq-ring   label, border, focus ring
 *   --mq-accent                        destination leading-icon tint
 *   --mq-menu / --mq-menu-brd          popover surface + border
 *   --mq-menu-ink / --mq-menu-hover    popover label + hover/focus wash
 *   --mq-menu-grad / --mq-menu-blur    popover wash + backdrop blur
 *   --mq-menu-shadow                   popover elevation
 */

/**
 * Palette per material. Declared once on the root wrapper; the trigger and the
 * popover both inherit it through CSS. The values are Button's PRIMARY intent
 * verbatim, so the label contrast contract is inherited too (>= 4.5:1 on every
 * material). `adaptive` additionally flips on `prefers-color-scheme` because it
 * names only opaque surfaces that flip together with the labels on them.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-body:#ff9077] [--mq-edge:#c9482f] [--mq-text:#4a1d13] [--mq-brd:rgba(120,40,25,0.16)] [--mq-ring:#171817]",
    "[--mq-accent:#c9482f]",
    "[--mq-menu:#f4ece0] [--mq-menu-brd:rgba(120,80,55,0.22)] [--mq-menu-ink:#33261e]",
    "[--mq-menu-hover:rgba(201,72,47,0.12)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.50),rgba(151,92,58,0.05))]",
    "[--mq-menu-shadow:0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-body:rgba(23,24,23,0.74)] [--mq-text:#ffffff] [--mq-brd:rgba(255,255,255,0.28)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    // A frosted, light popover so the destination labels stay legible however
    // dark the trigger surface reads over its backdrop.
    "[--mq-menu:rgba(244,247,248,0.90)] [--mq-menu-brd:rgba(255,255,255,0.72)] [--mq-menu-ink:#1e1e1b]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:16px]",
    "[--mq-menu-grad:linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0))]",
    "[--mq-menu-shadow:0_16px_34px_rgba(24,20,40,0.18),0_4px_12px_rgba(24,20,40,0.12)]",
  ].join(" "),
  skeuo: [
    "[--mq-lit:#4a4a44] [--mq-body:#2a2a26] [--mq-edge:#131311] [--mq-text:#f6f4ee] [--mq-brd:rgba(0,0,0,0.5)] [--mq-ring:#171817]",
    "[--mq-accent:#3f3e39]",
    // Greige, warm — the #e6e3da family — so the popover belongs to the same
    // moulded material as the control that spawned it.
    "[--mq-menu:#e6e3da] [--mq-menu-brd:rgba(25,25,23,0.30)] [--mq-menu-ink:#23231f]",
    "[--mq-menu-hover:rgba(255,255,255,0.50)] [--mq-menu-blur:0px]",
    "[--mq-menu-grad:linear-gradient(180deg,#f0ede6,#e6e3da)]",
    "[--mq-menu-shadow:0_16px_30px_rgba(38,36,31,0.28),0_4px_10px_rgba(38,36,31,0.18)]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  adaptive: [
    "[--mq-body:#171817] [--mq-text:#f6f5f1] [--mq-brd:rgba(0,0,0,0.4)] [--mq-ring:#171817]",
    "[--mq-accent:#171817]",
    "[--mq-menu:#ffffff] [--mq-menu-brd:rgba(23,24,23,0.14)] [--mq-menu-ink:#1c1c19]",
    "[--mq-menu-hover:rgba(23,24,23,0.06)] [--mq-menu-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // wash onto the one material meant to have none.
    "[--mq-menu-grad:none]",
    "[--mq-menu-shadow:0_14px_30px_rgba(20,20,18,0.16),0_3px_8px_rgba(20,20,18,0.10)]",
    "dark:[--mq-body:#f1efe9] dark:[--mq-text:#171817] dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-ring:#f1efe9]",
    "dark:[--mq-accent:#f1efe9]",
    "dark:[--mq-menu:#26262a] dark:[--mq-menu-brd:rgba(255,255,255,0.16)] dark:[--mq-menu-ink:#f1efe9]",
    "dark:[--mq-menu-hover:rgba(255,255,255,0.08)]",
    "dark:[--mq-menu-shadow:0_14px_30px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.40)]",
  ].join(" "),
} as const;

type ShareMaterial = keyof typeof MATERIAL_TOKENS;
type ShareSize = "sm" | "md" | "lg";
type ShareVariant = "default";

/**
 * Focus ring. Declared for real `:focus-visible` and, identically, for a
 * `data-focus="true"` attribute so the docs surface can render the focused look
 * without synthesising a keyboard event. Width, offset and colour together fully
 * replace the UA outline, so it is never reset with `outline-none`.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * Shared trigger chrome. `translate`, not `transform`: Tailwind v4 writes its
 * `translate-*` utilities to the standalone `translate` property, so the
 * transition names `translate` explicitly — every property in the list is one
 * some state actually changes, and none is phantom.
 */
const SURFACE_BASE = [
  "relative isolate inline-flex shrink-0 select-none items-center justify-center",
  "border font-extrabold tracking-[-0.01em] cursor-pointer appearance-none",
  "transition-[translate,box-shadow,backdrop-filter,filter,opacity] duration-200 ease-out",
  "motion-reduce:transition-none",
  FOCUS_RING,
  "forced-colors:border-[CanvasText]",
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-y-0 disabled:shadow-none",
].join(" ");

/**
 * The four material recipes, PRIMARY-intent values inlined. Press physics per
 * material: clay sinks ~3px into a warm inset well, skeuo ~4px, glass/adaptive
 * ~1px — the hover lift grows the shadow, the active state SINKS into the inset.
 * `motion-reduce` (on the base) drops the travel, but `:active` still applies the
 * inset instantly, so the tactile feedback survives even without animation.
 */
const MATERIAL_SURFACE: Record<ShareMaterial, string> = {
  clay: [
    "bg-[var(--mq-body,#ff9077)] text-[var(--mq-text,#4a1d13)] border-[var(--mq-brd,rgba(120,40,25,0.16))]",
    "shadow-[inset_0_3px_3px_rgba(255,255,255,0.55),inset_0_-4px_6px_rgba(120,40,25,0.18),0_6px_0_var(--mq-edge,#c9482f),0_12px_20px_rgba(75,40,31,0.18)]",
    "hover:-translate-y-[2px]",
    "hover:shadow-[inset_0_3px_3px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(120,40,25,0.18),0_8px_0_var(--mq-edge,#c9482f),0_16px_26px_rgba(75,40,31,0.2)]",
    "active:translate-y-[3px]",
    "active:shadow-[inset_0_3px_7px_rgba(120,40,25,0.32),0_2px_0_var(--mq-edge,#c9482f)]",
  ].join(" "),
  glass: [
    "bg-[var(--mq-body,rgba(23,24,23,0.74))] text-[var(--mq-text,#ffffff)] border-[var(--mq-brd,rgba(255,255,255,0.28))]",
    "backdrop-blur-[14px] backdrop-saturate-[160%]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_26px_rgba(24,20,40,0.2)]",
    "hover:-translate-y-[1px] hover:backdrop-blur-[18px]",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_32px_rgba(24,20,40,0.26)]",
    "active:translate-y-[1px]",
    "active:shadow-[inset_0_2px_7px_rgba(24,20,40,0.3)]",
    "forced-colors:[backdrop-filter:none]",
  ].join(" "),
  skeuo: [
    "bg-[linear-gradient(180deg,var(--mq-lit,#4a4a44),var(--mq-body,#2a2a26))] text-[var(--mq-text,#f6f4ee)] border-[var(--mq-brd,rgba(0,0,0,0.5))]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3),0_5px_0_var(--mq-edge,#131311),0_10px_16px_rgba(38,36,31,0.28)]",
    "hover:-translate-y-[1px] hover:brightness-[1.08]",
    "active:translate-y-[4px]",
    "active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.45),0_1px_0_var(--mq-edge,#131311)]",
  ].join(" "),
  adaptive: [
    "bg-[var(--mq-body,#171817)] text-[var(--mq-text,#f6f5f1)] border-[var(--mq-brd,rgba(0,0,0,0.4))]",
    "shadow-[0_1px_2px_rgba(20,20,18,0.12)]",
    "hover:shadow-[0_5px_14px_rgba(20,20,18,0.18)]",
    "active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.22)]",
    // Coarse pointers get a comfortable touch target; only ever grows the control.
    "pointer-coarse:min-h-[48px]",
  ].join(" "),
};

const triggerVariants = cva(cn(SURFACE_BASE, "rounded-[var(--mq-radius,15px)]"), {
  variants: {
    material: MATERIAL_SURFACE,
    size: {
      sm: "h-[36px] gap-[6px] px-[14px] text-[12px]/[1] [--mq-radius:12px]",
      md: "h-[44px] gap-[8px] px-[20px] text-[13px]/[1] [--mq-radius:15px]",
      lg: "h-[52px] gap-[10px] px-[26px] text-[14px]/[1] [--mq-radius:18px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/**
 * Popover entrance keyframe, shipped with the component instead of a global
 * sheet. React 19 hoists this `<style>` and dedupes it by `href`, so a page with
 * many share buttons emits one rule. The keyframe's resting end-state is the
 * popover's base style, so `motion-reduce:animate-none` keeps it fully open —
 * only the small rise is dropped. A UNIQUE href per component.
 */
const POPOVER_KEYFRAMES = `
@keyframes mq-share-pop-in{from{opacity:0;translate:0 -6px}to{opacity:1;translate:0 0}}`;

function PopoverKeyframes() {
  return (
    <style href="mq-share-button" precedence="medium">
      {POPOVER_KEYFRAMES}
    </style>
  );
}

/** A share destination. `href` renders a link; `onSelect` renders a button. */
export type ShareTarget = {
  /** Stable key; also the React list key. */
  id: string;
  label: string;
  /** Optional leading glyph (a lucide icon element). Decorative; sized by CSS. */
  icon?: React.ReactNode;
  /** When set, the destination is a real anchor opening this URL in a new tab. */
  href?: string;
  /** When set (and `href` is not), the destination is a button firing this. */
  onSelect?: () => void;
};

type ShareButtonOwnProps = {
  /** The URL to share and copy. Used to build the default destinations. */
  url: string;
  /** Optional title/text carried into the share intents (X, Email). */
  shareTitle?: string;
  /** Override the default destination list (X, Facebook, LinkedIn, Email). */
  targets?: ShareTarget[];
  material?: ShareMaterial;
  size?: ShareSize;
  /** Single presentation variant; reserved for future tone axes. */
  variant?: ShareVariant;
  /** Heading shown at the top of the popover; also names the dialog. */
  dialogTitle?: string;
};

/**
 * `Omit` the own props off the native button props so the rest — `disabled`,
 * `children` (the trigger label), `data-*`, `aria-*`, `ref` — spread straight
 * onto the trigger `<button>`. `className` dresses the outer wrapper.
 */
export type ShareButtonProps = ShareButtonOwnProps &
  Omit<React.ComponentPropsWithRef<"button">, keyof ShareButtonOwnProps | "type">;

const itemClass = cn(
  "group/si flex w-full items-center gap-[10px] rounded-[10px] px-[12px] h-[38px]",
  "cursor-pointer appearance-none border-0 bg-transparent text-left no-underline",
  "font-bold tracking-[-0.01em] text-[13px]/[1] text-[color:var(--mq-menu-ink,#33261e)]",
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus:bg-[var(--mq-menu-hover,rgba(201,72,47,0.12))]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  // Fills are discarded in forced colours; the focused/hovered item takes a
  // system mark so it is still distinguishable.
  "forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText]",
  "forced-colors:hover:bg-[Highlight] forced-colors:hover:text-[HighlightText]",
  "forced-colors:focus-visible:outline-[Highlight]",
);

function ItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center text-[color:var(--mq-accent,#c9482f)]",
        "[&_svg]:size-[1.05em] [&_svg]:shrink-0 forced-colors:text-[CanvasText]",
      )}
    >
      {children}
    </span>
  );
}

/** Elements the focus trap treats as tabbable, in DOM order. */
const FOCUSABLE_SELECTOR = "a[href],button:not([disabled])";

export function ShareButton({
  children,
  className,
  dialogTitle = "Share",
  disabled = false,
  material = "clay",
  onClick,
  shareTitle,
  size = "md",
  targets,
  url,
  variant = "default",
  ...triggerProps
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const popoverId = React.useId();
  const headingId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const copiedTimer = React.useRef<number | null>(null);

  const destinations = React.useMemo<ShareTarget[]>(() => {
    if (targets) return targets;
    const u = encodeURIComponent(url);
    const t = shareTitle ? encodeURIComponent(shareTitle) : "";
    return [
      {
        id: "x",
        label: "X (Twitter)",
        icon: <Twitter />,
        href: `https://twitter.com/intent/tweet?url=${u}${t ? `&text=${t}` : ""}`,
      },
      { id: "facebook", label: "Facebook", icon: <Facebook />, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
      { id: "linkedin", label: "LinkedIn", icon: <Linkedin />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
      { id: "email", label: "Email", icon: <Mail />, href: `mailto:?subject=${t}&body=${u}` },
    ];
  }, [targets, url, shareTitle]);

  // Closing clears the copy confirmation (and its pending timer) so a fresh open
  // re-announces cleanly. Kept in the close paths rather than an effect, so the
  // state transition sits in the handler that causes it (no setState-in-effect).
  const closePopover = React.useCallback(() => {
    setOpen(false);
    setCopied(false);
    setAnnouncement("");
    if (copiedTimer.current != null) {
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = null;
    }
  }, []);

  const closeAndFocusTrigger = React.useCallback(() => {
    closePopover();
    triggerRef.current?.focus();
  }, [closePopover]);

  // On open, move focus into the popover — to its first control.
  React.useEffect(() => {
    if (!open) return;
    const node = popoverRef.current;
    if (!node) return;
    node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)[0]?.focus();
  }, [open]);

  // A pointer press anywhere outside the wrapper closes the popover. Registered
  // only while open, and cleaned up on close/unmount.
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closePopover();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, closePopover]);

  // Sweep the confirmation timer on unmount.
  React.useEffect(
    () => () => {
      if (copiedTimer.current != null) window.clearTimeout(copiedTimer.current);
    },
    [],
  );

  function handleTriggerClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (open) closePopover();
    else setOpen(true);
  }

  async function handleCopy() {
    // `navigator` is only touched inside the handler, keeping the module
    // SSR-safe for static generation.
    let ok = false;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok && typeof document !== "undefined") {
      // Legacy fallback for browsers without the async clipboard API.
      try {
        const area = document.createElement("textarea");
        area.value = url;
        area.setAttribute("readonly", "");
        area.style.position = "absolute";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) return;
    setCopied(true);
    setAnnouncement("Link copied");
    if (copiedTimer.current != null) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  function handlePopoverKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      // Absorb the dismiss key so it does not also close an enclosing
      // Escape-closable ancestor (a dialog or menu the share button sits in).
      event.stopPropagation();
      closeAndFocusTrigger();
      return;
    }
    if (event.key !== "Tab") return;
    const node = popoverRef.current;
    if (!node) return;
    const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    // Wrap at the boundaries so Tab / Shift+Tab never leave the popover.
    if (event.shiftKey) {
      if (active === first || !node.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !node.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className={cn("group/share relative isolate inline-flex w-fit align-middle", MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
      ref={rootRef}
    >
      <PopoverKeyframes />
      {/*
        The live region is always mounted, ahead of any copy, so the "Link
        copied" announcement is reliably picked up by assistive tech.
      */}
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>

      <button
        {...triggerProps}
        aria-controls={open ? popoverId : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(triggerVariants({ material, size }))}
        data-open={open ? "true" : "false"}
        disabled={disabled}
        onClick={handleTriggerClick}
        ref={triggerRef}
        type="button"
      >
        <Share2 aria-hidden="true" className="size-[1.05em] shrink-0 forced-colors:text-[CanvasText]" />
        <span>{children ?? "Share"}</span>
      </button>

      {open ? (
        <div
          aria-labelledby={headingId}
          aria-modal="true"
          className={cn(
            "absolute right-0 top-full z-50 mt-[8px] w-[264px] max-w-[320px] p-[8px]",
            "rounded-[14px] border bg-[var(--mq-menu,#f4ece0)] border-[var(--mq-menu-brd,rgba(120,80,55,0.22))]",
            "[background-image:var(--mq-menu-grad,none)] backdrop-blur-[var(--mq-menu-blur,0px)]",
            "text-[color:var(--mq-menu-ink,#33261e)]",
            "shadow-[var(--mq-menu-shadow,0_16px_32px_rgba(75,40,31,0.22),0_4px_10px_rgba(75,40,31,0.14))]",
            "animate-[mq-share-pop-in_160ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none",
            // Fills, washes and shadows are discarded in forced colours; a real
            // border keeps the surface's bounds and a solid Canvas backs it.
            "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:bg-[Canvas]",
            "forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
          )}
          id={popoverId}
          onKeyDown={handlePopoverKeyDown}
          ref={popoverRef}
          role="dialog"
        >
          <p
            className="m-0 mb-[6px] px-[8px] pt-[2px] text-[11px] font-extrabold uppercase tracking-[0.06em] opacity-70"
            id={headingId}
          >
            {dialogTitle}
          </p>
          {/* The link being shared, truncated so a long URL cannot break out. */}
          <p className="m-0 mb-[8px] px-[8px] truncate text-[12px]/[1.3] font-semibold opacity-60" title={url}>
            {url}
          </p>

          <ul className="m-0 flex list-none flex-col gap-[2px] p-0">
            {destinations.map((target) =>
              target.href != null ? (
                <li key={target.id}>
                  <a
                    className={itemClass}
                    href={target.href}
                    onClick={closeAndFocusTrigger}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {target.icon != null ? <ItemIcon>{target.icon}</ItemIcon> : null}
                    <span className="min-w-0 flex-1 truncate">{target.label}</span>
                  </a>
                </li>
              ) : (
                <li key={target.id}>
                  <button
                    className={itemClass}
                    onClick={() => {
                      target.onSelect?.();
                      closeAndFocusTrigger();
                    }}
                    type="button"
                  >
                    {target.icon != null ? <ItemIcon>{target.icon}</ItemIcon> : null}
                    <span className="min-w-0 flex-1 truncate">{target.label}</span>
                  </button>
                </li>
              ),
            )}
          </ul>

          <div
            aria-hidden="true"
            className="my-[8px] h-px w-full bg-[var(--mq-menu-brd,rgba(120,80,55,0.22))] forced-colors:bg-[CanvasText]"
          />

          <button className={itemClass} onClick={handleCopy} type="button">
            <ItemIcon>{copied ? <Check /> : <LinkIcon />}</ItemIcon>
            <span className="min-w-0 flex-1 truncate">{copied ? "Copied" : "Copy link"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export type ShareButtonVariantProps = VariantProps<typeof triggerVariants>;

export { triggerVariants };
