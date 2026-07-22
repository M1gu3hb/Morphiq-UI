"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Confirm Dialog
 *
 * A modal confirmation surface: a dimmed backdrop, a focus-trapped panel that is
 * `role="dialog" aria-modal="true"`, a Cancel and a Confirm button, and a `tone`
 * that colours the destructive path. Self-contained by design — all four
 * material recipes live in this file, every local custom property carries a
 * literal fallback, and no class comes from the site's global stylesheet.
 *
 * The mechanics are hand-written but conventional:
 *
 * - `role="dialog" aria-modal="true"`, `aria-labelledby` → the title and
 *   `aria-describedby` → the description (ids from `React.useId()`).
 * - On open, focus moves to Cancel — the safe default for a destructive confirm.
 * - Tab and Shift+Tab cycle within the panel; nothing outside it is reachable.
 * - `Escape` cancels, a click on the backdrop cancels, and on any close focus
 *   returns to the trigger (or whatever was focused when the dialog opened).
 * - Body scroll is locked while open.
 *
 * The tone is never carried by colour alone: the button LABEL states the action
 * ("Delete", "Discard"), and the `danger` tone additionally shows a decorative
 * warning glyph. Controlled (`open` + `onOpenChange`) or uncontrolled with a
 * `trigger` and `defaultOpen`.
 *
 * Local theming knobs (declared on the panel; the parts inherit them):
 *
 *   --mq-body        panel surface
 *   --mq-lit         top gradient stop (skeuo)
 *   --mq-edge        extruded lower edge (clay / skeuo)
 *   --mq-text        title colour
 *   --mq-muted       description colour
 *   --mq-brd         panel border
 *   --mq-ring        focus ring
 *   --mq-icon-bg     header glyph well
 *   --mq-cancel-*    Cancel button surface / label / border
 *   --mq-confirm-*   default Confirm button surface / label / border
 *   --mq-danger-*    danger Confirm button + glyph surface / label / border
 */

export type ConfirmDialogMaterial = "clay" | "glass" | "skeuo" | "adaptive";
export type ConfirmDialogTone = "default" | "danger";

/**
 * Entrance keyframes ship with the component instead of a global stylesheet a
 * copier would have to find. React 19 hoists this and deduplicates it by `href`,
 * so several dialogs on a page emit one rule rather than one each.
 *
 * `scale` and `translate` are the standalone properties Tailwind v4 writes its
 * utilities to, and they are what this animates — there is no `transform`
 * anywhere in the file for it to fight with. The resting state (`opacity:1`,
 * `scale:1`) is the panel's base style, so under `animation:none` the dialog is
 * simply present without any motion.
 */
const CONFIRM_DIALOG_KEYFRAMES =
  "@keyframes mq-confirm-scrim{from{opacity:0}to{opacity:1}}" +
  "@keyframes mq-confirm-panel{from{opacity:0;scale:0.94;translate:0 8px}to{opacity:1;scale:1;translate:0 0}}";

function ConfirmDialogKeyframes() {
  return (
    <style href="mq-confirm-dialog" precedence="medium">
      {CONFIRM_DIALOG_KEYFRAMES}
    </style>
  );
}

const panelVariants = cva(
  [
    "relative isolate z-10 flex w-full flex-col overflow-hidden border text-left",
    "max-w-[var(--mq-maxw,420px)] gap-[var(--mq-gap,16px)] rounded-[var(--mq-radius,24px)] p-[var(--mq-pad,24px)]",
    "text-[color:var(--mq-text,#1c1c19)] border-[var(--mq-brd,rgba(23,24,23,0.14))]",
    // Signature: the panel scales up a hair and settles as it appears. It is
    // mounted in its final state, so this is a keyframe, not a transition —
    // there is nothing for a transition to run from on the mount frame.
    "animate-[mq-confirm-panel_260ms_cubic-bezier(0.22,1.25,0.36,1)]",
    // The entrance is decoration — the dialog is already announced by its role
    // and focus has already moved into it — so reduced motion drops the travel
    // and the panel is simply present.
    "motion-reduce:animate-none",
    // Fills, gradients and shadows are discarded in forced-colors mode, so the
    // panel would dissolve into the backdrop. A system border keeps its bounds
    // and the gradient (a background-image, which survives) is cleared by hand.
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
    "forced-colors:shadow-none forced-colors:[background-image:none] forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.20)]",
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346]",
          "[--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] [--mq-icon-bg:rgba(255,255,255,0.55)]",
          "[--mq-cancel-bg:#efe7db] [--mq-cancel-text:#2c2721] [--mq-cancel-brd:rgba(70,55,40,0.20)]",
          "[--mq-confirm-bg:#ff9077] [--mq-confirm-text:#4a1d13] [--mq-confirm-brd:rgba(120,40,25,0.20)]",
          "[--mq-danger-bg:#b23a2e] [--mq-danger-text:#ffffff] [--mq-danger-brd:rgba(120,40,25,0.30)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))] backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.24)]",
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f]",
          "[--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] [--mq-icon-bg:rgba(23,24,23,0.06)]",
          "[--mq-cancel-bg:rgba(255,255,255,0.72)] [--mq-cancel-text:#23231f] [--mq-cancel-brd:rgba(255,255,255,0.85)]",
          "[--mq-confirm-bg:rgba(23,24,23,0.86)] [--mq-confirm-text:#ffffff] [--mq-confirm-brd:rgba(255,255,255,0.24)]",
          "[--mq-danger-bg:#a32633] [--mq-danger-text:#ffffff] [--mq-danger-brd:rgba(255,255,255,0.24)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.26)]",
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943]",
          "[--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] [--mq-icon-bg:rgba(255,255,255,0.50)]",
          "[--mq-cancel-bg:#e6e3da] [--mq-cancel-text:#23231f] [--mq-cancel-brd:rgba(25,25,23,0.30)]",
          "[--mq-confirm-bg:#2a2a26] [--mq-confirm-text:#f6f4ee] [--mq-confirm-brd:rgba(0,0,0,0.50)]",
          "[--mq-danger-bg:#9c2b2f] [--mq-danger-text:#ffffff] [--mq-danger-brd:rgba(0,0,0,0.45)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "shadow-[0_2px_4px_rgba(20,20,18,0.10),0_22px_44px_rgba(20,20,18,0.16)]",
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.50),0_22px_44px_rgba(0,0,0,0.55)]",
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
          "[--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] [--mq-icon-bg:rgba(23,24,23,0.05)]",
          "[--mq-cancel-bg:#f1f0ec] [--mq-cancel-text:#1c1c19] [--mq-cancel-brd:rgba(23,24,23,0.18)]",
          "[--mq-confirm-bg:#171817] [--mq-confirm-text:#f6f5f1] [--mq-confirm-brd:rgba(0,0,0,0.40)]",
          "[--mq-danger-bg:#b3261e] [--mq-danger-text:#ffffff] [--mq-danger-brd:rgba(120,40,25,0.32)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
          "dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] dark:[--mq-icon-bg:rgba(255,255,255,0.08)]",
          "dark:[--mq-cancel-bg:#2f2f34] dark:[--mq-cancel-text:#f1efe9] dark:[--mq-cancel-brd:rgba(255,255,255,0.20)]",
          "dark:[--mq-confirm-bg:#f1efe9] dark:[--mq-confirm-text:#171817] dark:[--mq-confirm-brd:rgba(255,255,255,0.24)]",
          "dark:[--mq-danger-bg:#f2b8ba] dark:[--mq-danger-text:#5a1820] dark:[--mq-danger-brd:rgba(90,24,32,0.35)]",
        ].join(" "),
      },
      size: {
        sm: [
          "[--mq-maxw:360px] [--mq-gap:12px] [--mq-pad:18px] [--mq-radius:18px]",
          "[--mq-icon-box:34px] [--mq-icon-radius:11px] [--mq-glyph:18px]",
          "[--mq-title-size:15px] [--mq-desc-size:12px]",
        ].join(" "),
        md: [
          "[--mq-maxw:420px] [--mq-gap:16px] [--mq-pad:24px] [--mq-radius:24px]",
          "[--mq-icon-box:40px] [--mq-icon-radius:13px] [--mq-glyph:20px]",
          "[--mq-title-size:18px] [--mq-desc-size:13px]",
        ].join(" "),
        lg: [
          "[--mq-maxw:480px] [--mq-gap:20px] [--mq-pad:30px] [--mq-radius:28px]",
          "[--mq-icon-box:46px] [--mq-icon-radius:15px] [--mq-glyph:22px]",
          "[--mq-title-size:21px] [--mq-desc-size:14px]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", size: "md" },
  },
);

/**
 * Shared CTA paint. The two buttons only differ in which token group they read,
 * so the base is one string and each role picks its colours below.
 *
 * The hover lift writes the standalone `translate` property and the depth swells
 * with it — the only two things that change, and both are named in the
 * transition, so nothing is phantom and `box-shadow` interpolates rather than
 * swapping. Motion here is pure feedback on a real button, so reduced motion
 * cancels it outright.
 */
const ctaBase =
  "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[6px] " +
  "whitespace-nowrap appearance-none border font-extrabold tracking-[-0.01em] " +
  "shadow-[0_1px_2px_rgba(20,20,18,0.14)] " +
  "transition-[translate,box-shadow] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:shadow-[0_5px_12px_rgba(20,20,18,0.18)] " +
  "active:translate-y-0 active:shadow-[0_1px_2px_rgba(20,20,18,0.14)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:border-[CanvasText] forced-colors:shadow-none forced-colors:focus-visible:outline-[Highlight] " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const ctaSize = cva("", {
  variants: {
    size: {
      sm: "h-[34px] rounded-[10px] px-[14px] text-[length:12px]",
      md: "h-[40px] rounded-[12px] px-[18px] text-[length:13px]",
      lg: "h-[46px] rounded-[14px] px-[22px] text-[length:14px]",
    },
  },
  defaultVariants: { size: "md" },
});

/** Cancel: a quiet, material-neutral surface — never the primary action. */
const CANCEL_TOKENS =
  "bg-[var(--mq-cancel-bg,#f1f0ec)] text-[color:var(--mq-cancel-text,#1c1c19)] " +
  "border-[var(--mq-cancel-brd,rgba(23,24,23,0.18))] " +
  "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]";

/**
 * Confirm: the primary action. In forced colours it takes `Highlight` so it is
 * distinguishable from Cancel once every fill is discarded.
 */
const CONFIRM_DEFAULT_TOKENS =
  "bg-[var(--mq-confirm-bg,#171817)] text-[color:var(--mq-confirm-text,#f6f5f1)] " +
  "border-[var(--mq-confirm-brd,rgba(0,0,0,0.40))] " +
  "forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:border-[Highlight]";

const CONFIRM_DANGER_TOKENS =
  "bg-[var(--mq-danger-bg,#b3261e)] text-[color:var(--mq-danger-text,#ffffff)] " +
  "border-[var(--mq-danger-brd,rgba(120,40,25,0.32))] " +
  "forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:border-[Highlight]";

/** Everything the browser lets a keyboard user land on, for the focus trap. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
}

export type ConfirmDialogProps = VariantProps<typeof panelVariants> & {
  /** Required visible heading; states what is being confirmed. */
  title: React.ReactNode;
  /** Optional supporting copy, announced with the title via aria-describedby. */
  description?: React.ReactNode;
  /** default / danger. `danger` colours Confirm and shows a warning glyph. */
  tone?: ConfirmDialogTone;
  /** Confirm button label. Carries the action's meaning ("Delete", "Discard"). */
  confirmLabel?: React.ReactNode;
  /** Cancel button label. */
  cancelLabel?: React.ReactNode;
  /**
   * Header glyph. Defaults to a warning triangle for `danger`, none otherwise.
   * Pass `false` to remove it, or any node to supply a custom decorative glyph.
   */
  icon?: React.ReactNode | false;
  /** Controlled open state. Omit to run uncontrolled with `defaultOpen`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fires whenever the dialog wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Runs when Confirm is chosen, just before the dialog closes. */
  onConfirm?: () => void;
  /** Runs when the dialog is cancelled (button, Escape or backdrop). */
  onCancel?: () => void;
  /**
   * A focusable element (usually a `<button>`) that opens the dialog and
   * receives focus back when it closes. Omit in controlled mode.
   */
  trigger?: React.ReactElement;
  /** Class merged onto the dialog panel. */
  className?: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  className,
  confirmLabel = "Confirm",
  defaultOpen = false,
  description,
  icon,
  material,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  size,
  title,
  tone = "default",
  trigger,
}: ConfirmDialogProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open : uncontrolledOpen;

  const reactId = React.useId();
  const titleId = `${reactId}-title`;
  const descId = `${reactId}-desc`;

  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  // Whatever held focus when the dialog opened, so focus can return there even
  // when there is no `trigger` (a fully controlled caller, say).
  const openerRef = React.useRef<HTMLElement | null>(null);

  const setOpenState = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const requestOpen = React.useCallback(() => {
    if (typeof document !== "undefined") {
      openerRef.current = document.activeElement as HTMLElement | null;
    }
    setOpenState(true);
  }, [setOpenState]);

  // Return focus to the trigger the moment we close. The trigger is always
  // mounted (rendered outside the open branch), so focusing it synchronously —
  // before the panel unmounts on the next render — lands cleanly.
  const restoreFocus = React.useCallback(() => {
    const target = triggerRef.current ?? openerRef.current;
    if (target && typeof target.focus === "function") target.focus();
  }, []);

  const handleCancel = React.useCallback(() => {
    setOpenState(false);
    onCancel?.();
    restoreFocus();
  }, [onCancel, restoreFocus, setOpenState]);

  const handleConfirm = React.useCallback(() => {
    setOpenState(false);
    onConfirm?.();
    restoreFocus();
  }, [onConfirm, restoreFocus, setOpenState]);

  // On open: lock body scroll and move focus to Cancel (the safe default for a
  // destructive confirm). Both are external systems, so they live in an effect,
  // and the scroll lock is undone on close/unmount.
  React.useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /**
   * Escape cancels; Tab is trapped so it cycles within the panel and Shift+Tab
   * wraps the other way. Enter / Space need no handling — the controls are real
   * `<button>`s.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = getFocusables(dialogRef.current);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const inside = dialogRef.current?.contains(active as Node) ?? false;
    if (event.shiftKey) {
      if (!inside || active === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (!inside || active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Wire the trigger: it opens the dialog and receives focus back on close. The
  // caller's own ref and onClick are preserved.
  let triggerElement: React.ReactNode = null;
  if (React.isValidElement(trigger)) {
    const triggerProps = trigger.props as {
      onClick?: (event: React.MouseEvent) => void;
      ref?: React.Ref<HTMLElement>;
    };
    triggerElement = React.cloneElement(
      trigger as React.ReactElement<Record<string, unknown>>,
      {
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        onClick: (event: React.MouseEvent) => {
          triggerProps.onClick?.(event);
          if (!event.defaultPrevented) requestOpen();
        },
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          const original = triggerProps.ref;
          if (typeof original === "function") original(node);
          else if (original && typeof original === "object") {
            // Ref composition: preserving a caller's object ref on the trigger
            // means assigning its `.current` — that is what a ref object exists
            // for, not a harmful prop mutation, so the immutability rule is a
            // false positive here. Dropping it would silently discard the ref.
            // eslint-disable-next-line react-hooks/immutability
            (original as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        },
      } as Record<string, unknown>,
    );
  }

  const resolvedIcon =
    icon === false
      ? null
      : icon !== undefined
        ? icon
        : tone === "danger"
          ? <TriangleAlert />
          : null;

  return (
    <>
      <ConfirmDialogKeyframes />
      {triggerElement}
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-[16px] sm:p-[24px]">
          {/*
            The dimmed backdrop and the click-to-cancel target in one. It sits
            behind the panel (which is `z-10`), so a click on the panel never
            reaches it. In forced-colors mode the translucency is discarded, so a
            solid Canvas keeps the modal separated from the page behind it.
          */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-[rgba(15,14,13,0.55)]",
              "animate-[mq-confirm-scrim_200ms_ease-out] motion-reduce:animate-none",
              "forced-colors:bg-[Canvas]",
            )}
            data-confirm-backdrop=""
            onClick={handleCancel}
          />
          <div
            aria-describedby={description ? descId : undefined}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn(panelVariants({ material, size }), className)}
            data-material={material ?? "clay"}
            data-tone={tone}
            onKeyDown={handleKeyDown}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="flex items-start gap-[12px]">
              {resolvedIcon ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative grid shrink-0 place-items-center",
                    "size-[var(--mq-icon-box,40px)] rounded-[var(--mq-icon-radius,13px)]",
                    "bg-[var(--mq-icon-bg,rgba(23,24,23,0.05))] text-[color:var(--mq-text,#1c1c19)]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
                    "[&>svg]:size-[var(--mq-glyph,20px)]",
                    // The danger glyph borrows the danger surface colour, but it
                    // is decoration on an aria-hidden mark — the button label is
                    // what carries the destructive meaning, never this hue.
                    "data-[tone=danger]:text-[color:var(--mq-danger-bg,#b3261e)]",
                    "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
                  )}
                  data-tone={tone}
                >
                  {resolvedIcon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <h2
                  className="m-0 font-extrabold tracking-[-0.01em] text-[length:var(--mq-title-size,18px)] leading-[1.25]"
                  id={titleId}
                >
                  {title}
                </h2>
                {description ? (
                  <p
                    className="mt-[6px] m-0 font-medium text-[color:var(--mq-muted,#55554e)] text-[length:var(--mq-desc-size,13px)] leading-[1.55]"
                    id={descId}
                  >
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-[4px] flex flex-wrap items-center justify-end gap-[10px]">
              <button
                className={cn(ctaBase, ctaSize({ size }), CANCEL_TOKENS)}
                onClick={handleCancel}
                ref={cancelRef}
                type="button"
              >
                {cancelLabel}
              </button>
              <button
                className={cn(
                  ctaBase,
                  ctaSize({ size }),
                  tone === "danger" ? CONFIRM_DANGER_TOKENS : CONFIRM_DEFAULT_TOKENS,
                )}
                data-tone={tone}
                onClick={handleConfirm}
                type="button"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export { panelVariants };
