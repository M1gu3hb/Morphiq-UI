"use client";

import * as React from "react";
import {
  Bell,
  Check,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Notification Card
 *
 * A compact notification surface: a leading avatar or icon, an actor heading, a
 * message, a machine-readable timestamp, and accept / dismiss actions. Like the
 * Card it is copy-and-own: every material recipe lives in this file, it never
 * reads a `:root` variable, and it depends on no global-stylesheet class — copy
 * this file plus `src/lib/cn.ts` and the whole look comes with it.
 *
 * Theming knobs are local CSS variables declared on the card itself, each used
 * with a literal fallback so a copied file needs no accompanying token sheet:
 *
 *   --mq-body        surface colour
 *   --mq-lit         top highlight (skeuo gradient)
 *   --mq-edge        extruded bottom edge (clay / skeuo)
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground (meta, timestamp, tone label)
 *   --mq-rule        hairline divider colour
 *   --mq-brd         border colour
 *   --mq-well        translucent well behind the leading icon and ghost button
 *   --mq-ring        focus ring colour
 *   --mq-pad/gap/radius   density
 *   --mq-well-box/well-radius/glyph   leading visual size
 *   --mq-btn/btn-glyph   action button size
 *   --mq-title/msg   type scale
 *
 * Accessibility policy:
 *
 * - Tone (info / success / warning) is carried by an ICON *and* a text label,
 *   never colour alone; the icon renders in `currentColor` so it survives
 *   forced-colors as `CanvasText`.
 * - The actor is a real heading whose rank is overridable (`headingLevel`),
 *   because the correct level depends on the surrounding document outline.
 * - The timestamp is a `<time dateTime>`; the avatar is an `<img>` with real
 *   alt (empty alt marks it decorative).
 * - Accept / dismiss are real `<button>`s with accessible names.
 * - This is a container that holds its own controls, not a whole-clickable
 *   card, so it deliberately does NOT draw a `:focus-within` ring: each button
 *   carries its own visible ring and the card is never double-outlined.
 * - `live` opts the card into a polite `role="status"` region for a
 *   notification that arrives dynamically.
 *
 * Contrast contract: on every filled material the actor, message and muted meta
 * stay at or above 4.5:1 against the surface; the glass recipe carries its own
 * tint so that holds over a light and a dark backdrop alike.
 */

export type NotificationTone = "info" | "success" | "warning";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type NotificationCardVariant = "default";
type NotificationCardSize = "sm" | "md" | "lg";
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Tone → icon. Rendered (a value, not a phantom type) so meaning has a shape. */
const TONE_ICON: Record<NotificationTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
};

/** Tone → visible label. Paired with the icon so tone is never colour alone. */
const TONE_LABEL: Record<NotificationTone, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
};

/**
 * Focus ring for the card itself, declared for real `:focus-visible` and for a
 * `data-focus="true"` attribute so docs and visual-regression can render the
 * focused look without synthesising a keyboard event. No `:focus-within` here —
 * see the policy note above.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const notificationCardVariants = cva(
  [
    "relative isolate grid grid-cols-[auto_minmax(0,1fr)]",
    "items-start gap-[var(--mq-gap,12px)] p-[var(--mq-pad,18px)] rounded-[var(--mq-radius,20px)]",
    "border text-left text-[color:var(--mq-text,#2b2b26)]",
    // Static surface: the card does not lift. The only thing that changes on it
    // is the disabled fade, so the transition names just `opacity` — no phantom
    // properties, and no `translate` for Tailwind v4's standalone trap to bite.
    "transition-opacity duration-200 ease-out",
    "motion-reduce:transition-none",
    "data-[state=disabled]:opacity-55",
    // Shadows and translucency are erased in forced-colors mode, so a system
    // border keeps the card's bounds.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_18px_36px_rgba(0,0,0,0.45)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: [
          "[--mq-pad:14px] [--mq-gap:10px] [--mq-radius:16px]",
          "[--mq-well-box:36px] [--mq-well-radius:10px] [--mq-glyph:18px]",
          "[--mq-btn:30px] [--mq-btn-glyph:16px] [--mq-title:13px] [--mq-msg:12px]",
        ].join(" "),
        md: [
          "[--mq-pad:18px] [--mq-gap:12px] [--mq-radius:20px]",
          "[--mq-well-box:42px] [--mq-well-radius:12px] [--mq-glyph:20px]",
          "[--mq-btn:34px] [--mq-btn-glyph:18px] [--mq-title:15px] [--mq-msg:13px]",
        ].join(" "),
        lg: [
          "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:26px]",
          "[--mq-well-box:48px] [--mq-well-radius:14px] [--mq-glyph:22px]",
          "[--mq-btn:38px] [--mq-btn-glyph:20px] [--mq-title:17px] [--mq-msg:14px]",
        ].join(" "),
      },
    },
    compoundVariants: [
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-lit:#fff3ea] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-well:rgba(120,80,55,0.12)] [--mq-ring:#171817]",
      },
      {
        material: "glass",
        variant: "default",
        // `--mq-muted` is deliberately dark (#36362f): at 0.66 surface opacity it
        // still composites above 4.5:1 over a black backdrop, where a lighter
        // muted measured only ~4.27:1.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-well:rgba(23,24,23,0.10)] [--mq-ring:#171817]",
      },
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-well:rgba(25,25,23,0.10)] [--mq-ring:#171817]",
      },
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-well:rgba(20,20,18,0.06)] [--mq-ring:#171817] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-well:rgba(255,255,255,0.10)] dark:[--mq-ring:#f1efe9]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/** Shared icon-button chrome for accept and dismiss. */
const ACTION_BUTTON_BASE =
  "relative z-10 inline-grid place-items-center rounded-full " +
  "size-[var(--mq-btn,34px)] [&>svg]:size-[var(--mq-btn-glyph,18px)] " +
  "transition-[background-color,color,box-shadow,opacity] duration-150 ease-out motion-reduce:transition-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-40 " +
  "forced-colors:focus-visible:outline-[Highlight]";

const ACCEPT_BUTTON =
  ACTION_BUTTON_BASE +
  " border border-transparent bg-[var(--mq-text,#33261e)] text-[color:var(--mq-body,#f6e7dd)] " +
  "shadow-[0_1px_2px_rgba(20,20,18,0.22)] hover:shadow-[0_3px_8px_rgba(20,20,18,0.30)] hover:opacity-90 active:opacity-100 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none";

const DISMISS_BUTTON =
  ACTION_BUTTON_BASE +
  " border border-[var(--mq-brd,rgba(120,80,55,0.16))] bg-transparent text-[color:var(--mq-muted,#5c5b55)] " +
  "hover:bg-[var(--mq-well,rgba(120,80,55,0.12))] hover:text-[color:var(--mq-text,#33261e)] hover:shadow-[0_2px_6px_rgba(20,20,18,0.14)] " +
  "forced-colors:border-[ButtonText] forced-colors:text-[ButtonText]";

export type NotificationCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  "children" | "role" | "title"
> &
  Omit<VariantProps<typeof notificationCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: NotificationCardVariant;
    size?: NotificationCardSize;
    /** Tone of the notification; carried by icon + text, never colour alone. */
    tone?: NotificationTone;
    /** Localised tone label; defaults to the English tone name. */
    toneLabel?: React.ReactNode;
    /** The actor / source of the notification, rendered as a heading. */
    actor?: React.ReactNode;
    /** Heading rank for the actor; set it to match the document outline. */
    headingLevel?: HeadingLevel;
    /** The notification message body. */
    children: React.ReactNode;
    /** ISO 8601 timestamp for the machine-readable `<time dateTime>`. */
    dateTime?: string;
    /** Human-readable timestamp; falls back to `dateTime` when omitted. */
    timeLabel?: React.ReactNode;
    /** Meaningful avatar; empty `avatarAlt` marks the image decorative. */
    avatarSrc?: string;
    avatarAlt?: string;
    /** Leading icon shown when no avatar is given. `false` removes it. */
    icon?: React.ReactNode;
    /** Accessible name for the accept button. */
    acceptLabel?: string;
    /** Accessible name for the dismiss button. */
    dismissLabel?: string;
    /** Renders the accept button when provided. */
    onAccept?: React.MouseEventHandler<HTMLButtonElement>;
    /** Renders the dismiss button when provided. */
    onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
    /** Dims the card and disables its actions. */
    disabled?: boolean;
    /** Announces the card in a polite `role="status"` live region. */
    live?: boolean;
  };

export function NotificationCard({
  acceptLabel = "Accept",
  actor,
  avatarAlt = "",
  avatarSrc,
  children,
  className,
  dateTime,
  disabled = false,
  dismissLabel = "Dismiss",
  headingLevel = 3,
  icon,
  live = false,
  material = "clay",
  onAccept,
  onDismiss,
  size = "md",
  timeLabel,
  tone = "info",
  toneLabel,
  variant = "default",
  ...props
}: NotificationCardProps) {
  const headingId = React.useId();
  const ToneIcon = TONE_ICON[tone];
  // The heading rank is a prop, so the tag is dynamic. `createElement` with the
  // narrowed `h1`–`h6` string type resolves it as a real heading element, which
  // sidesteps the way TSX can reject a union-typed value as a JSX tag.
  const headingTag = `h${headingLevel}` as `h${HeadingLevel}`;
  const hasAvatar = typeof avatarSrc === "string" && avatarSrc.length > 0;
  const leadingIcon = icon === undefined ? <Bell aria-hidden="true" /> : icon;

  return (
    <article
      {...props}
      aria-atomic={live ? true : undefined}
      aria-disabled={disabled || undefined}
      aria-labelledby={actor ? headingId : undefined}
      aria-live={live ? "polite" : undefined}
      className={cn(notificationCardVariants({ material, variant, size }), className)}
      data-material={material}
      data-state={disabled ? "disabled" : "idle"}
      data-tone={tone}
      role={live ? "status" : undefined}
    >
      {hasAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- self-contained copy-and-own component stays framework-agnostic (no next/image coupling)
        <img
          alt={avatarAlt}
          className={cn(
            "size-[var(--mq-well-box,42px)] rounded-[var(--mq-well-radius,12px)] object-cover",
            "border border-[var(--mq-brd,rgba(120,80,55,0.16))]",
            "forced-colors:border-[CanvasText]",
          )}
          height={48}
          src={avatarSrc}
          width={48}
        />
      ) : leadingIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            "grid place-items-center",
            "size-[var(--mq-well-box,42px)] rounded-[var(--mq-well-radius,12px)]",
            "bg-[var(--mq-well,rgba(120,80,55,0.12))] text-[color:var(--mq-text,#33261e)]",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] [&>svg]:size-[var(--mq-glyph,20px)]",
            "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
          )}
        >
          {leadingIcon}
        </span>
      ) : (
        <span aria-hidden="true" />
      )}

      <div className="flex min-w-0 flex-col gap-[6px]">
        <div className="flex flex-wrap items-baseline gap-x-[8px] gap-y-[2px]">
          {actor
            ? React.createElement(
                headingTag,
                {
                  className:
                    "m-0 min-w-0 font-extrabold tracking-[-0.01em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,15px)] leading-[1.25]",
                  id: headingId,
                },
                actor,
              )
            : null}
          {dateTime ? (
            <time
              className="ml-auto shrink-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:11px] leading-[1.4] tabular-nums"
              dateTime={dateTime}
            >
              {timeLabel ?? dateTime}
            </time>
          ) : null}
        </div>

        <div className="text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-msg,13px)] leading-[1.6] [&_p]:m-0">
          {children}
        </div>

        <p
          className={cn(
            "m-0 inline-flex items-center gap-[5px]",
            "text-[color:var(--mq-muted,#5c5b55)] text-[length:11px] font-semibold uppercase tracking-[0.04em]",
            "[&>svg]:size-[13px] [&>svg]:shrink-0",
            "forced-colors:text-[CanvasText]",
          )}
          data-notification-tone={tone}
        >
          <ToneIcon aria-hidden="true" />
          <span>{toneLabel ?? TONE_LABEL[tone]}</span>
        </p>

        {onAccept || onDismiss ? (
          <div className="mt-[4px] flex items-center justify-end gap-[8px]">
            {onAccept ? (
              <button
                aria-label={acceptLabel}
                className={ACCEPT_BUTTON}
                disabled={disabled}
                onClick={onAccept}
                type="button"
              >
                <Check aria-hidden="true" />
              </button>
            ) : null}
            {onDismiss ? (
              <button
                aria-label={dismissLabel}
                className={DISMISS_BUTTON}
                disabled={disabled}
                onClick={onDismiss}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export { notificationCardVariants };
