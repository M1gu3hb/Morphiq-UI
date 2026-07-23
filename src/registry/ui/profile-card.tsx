"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Profile Card
 *
 * A person surface: avatar, a real heading for the name, a role line, a short
 * bio and a row of social links, with an optional primary action.
 *
 * Self-contained by design — every material recipe lives in this file. It reads
 * no `:root` custom properties and depends on no class from a global stylesheet,
 * so copying this file plus `src/lib/cn.ts` reproduces the full look. The four
 * material recipes are copied and owned from the Card, folded to this component's
 * single `default` variant. Local theming knobs, each referenced with a literal
 * fallback so a missing token never blanks the surface:
 *
 *   --mq-body    surface color
 *   --mq-lit     top highlight color (skeuo gradient)
 *   --mq-edge    extruded bottom edge color
 *   --mq-text    primary foreground color
 *   --mq-muted   secondary foreground (role line, resting social icons)
 *   --mq-rule    hairline color for the footer divider
 *   --mq-brd     border color
 *   --mq-ring    focus ring color
 *   --mq-pad     inner padding
 *   --mq-gap     vertical rhythm
 *   --mq-radius  corner radius
 *   --mq-title   name font size
 *   --mq-avatar  avatar diameter
 *
 * Contrast contract: on every filled material both `--mq-text` and `--mq-muted`
 * stay at or above 4.5:1 against the surface — for glass, against a white and a
 * black backdrop alike, because glass must never borrow its legibility from
 * whatever sits behind it.
 *
 * This card is NOT whole-clickable: it holds several independent links plus an
 * optional action, so there is no stretched-link overlay and no `:focus-within`
 * ring on the container — each control carries its own `:focus-visible` ring,
 * and ringing the whole card as well would double-target the same focus.
 */

// Defined as a value-free union (never a const object used only for its keys,
// which would trip no-unused-vars) so the material prop is typed without any
// dependency on `@/lib/component-data`.
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Focus ring. Real `:focus-visible` for when a consumer makes the article
 * focusable, plus an identical `data-focus="true"` hook so documentation and
 * visual-regression surfaces can render the focused look without synthesising a
 * keyboard event. No `:focus-within` here — see the file header.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const profileCardVariants = cva(
  [
    "relative isolate flex flex-col text-left",
    "border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows and translucency are erased in forced-colors mode, so a
    // system-colored border keeps the card's bounds.
    "forced-colors:border-[CanvasText]",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
            "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          // `--mq-muted` is #36362f rather than a lighter grey: at 0.66 opacity
          // the surface composites to ~#a8a8a8 over black, where a lighter muted
          // measured only 4.27:1. This holds at 5.14:1 there and 12.17:1 over white.
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
            "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)]",
          "forced-colors:[backdrop-filter:none] forced-colors:shadow-none",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
            "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)]",
        ].join(" "),
        // Polymorphic: the palette follows the color scheme and the rhythm grows
        // on coarse pointers. The surface is opaque and flips together with the
        // text, so `dark:` overrides are safe here.
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
            "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
            "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9]",
          // Underscores are Tailwind's escape for the spaces calc() needs around `+`.
          "pointer-coarse:gap-[calc(var(--mq-gap,14px)_+_4px)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-avatar:44px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-avatar:56px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-avatar:68px]",
      },
    },
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Social link. A real `<a>` with an accessible name via `aria-label`; the icon
 * is decorative and hidden. The hover lift uses `-translate-y-*` (Tailwind v4's
 * `translate-*` writes the standalone `translate` property) and the transition
 * NAMES `translate` — never `transition-[transform]` beside a translate utility.
 * Every listed property is changed by some state, so nothing is a phantom.
 */
const SOCIAL_LINK_CLASS = cn(
  "relative inline-flex size-[36px] items-center justify-center rounded-full",
  "border border-[var(--mq-brd,rgba(23,24,23,0.14))]",
  "text-[color:var(--mq-muted,#5c5b55)]",
  "[&_svg]:size-[18px]",
  "transition-[translate,background-color,color] duration-150 ease-out",
  "hover:-translate-y-[1px] hover:text-[color:var(--mq-text,#2b2b26)]",
  "hover:bg-[color-mix(in_srgb,var(--mq-text,#2b2b26)_10%,transparent)]",
  "active:translate-y-0",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
);

/**
 * Primary action. Filled by inverting the material's own tokens — surface text
 * color becomes the fill, surface color becomes the label — which keeps the
 * label at the same measured contrast on every material and flips correctly in
 * adaptive dark. The lift transition names only `translate` and `box-shadow`,
 * both of which a state changes.
 */
const ACTION_CLASS = cn(
  "relative inline-flex items-center justify-center gap-[6px] rounded-[12px] whitespace-nowrap",
  "px-[16px] py-[9px] text-[length:13px] font-semibold",
  "border border-transparent",
  "bg-[var(--mq-text,#2b2b26)] text-[color:var(--mq-body,#ffffff)]",
  "[&_svg]:size-[16px]",
  "shadow-[0_1px_2px_rgba(0,0,0,0.14)]",
  "transition-[translate,box-shadow] duration-150 ease-out",
  "hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(0,0,0,0.18)]",
  "active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.14)]",
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
  "disabled:opacity-55 disabled:cursor-not-allowed",
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none forced-colors:focus-visible:outline-[Highlight]",
);

/** Pure and SSR-safe: no randomness, no `Date`, deterministic for a given name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type ProfileSocialLink = {
  /** Accessible name for the link, e.g. "GitHub profile". Required. */
  label: string;
  href: string;
  /** Decorative icon (e.g. a lucide element); hidden from assistive tech. */
  icon?: React.ReactNode;
};

export type ProfileAction = {
  label: string;
  /** When present renders an `<a>`; otherwise a `<button type="button">`. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export type ProfileCardProps = Omit<React.ComponentPropsWithRef<"article">, "title" | "role"> &
  Omit<VariantProps<typeof profileCardVariants>, "material"> & {
    material?: MaterialSlug;
    /** Person's name — rendered as the card's heading. */
    name: string;
    role?: string;
    bio?: string;
    /** Avatar image URL. When omitted, an initials avatar is drawn instead. */
    avatarSrc?: string;
    /**
     * Alt text for the avatar image. The name is already in the heading, so an
     * avatar can be decorative (`alt=""`, the default) or descriptive — the
     * consumer decides. Ignored when `avatarSrc` is absent.
     */
    avatarAlt?: string;
    /**
     * Heading rank for the name. Overridable because the correct level depends
     * on where the card sits in the document outline. Defaults to `h3`.
     */
    headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    socials?: ReadonlyArray<ProfileSocialLink>;
    action?: ProfileAction;
  };

export function ProfileCard({
  action,
  avatarAlt = "",
  avatarSrc,
  bio,
  children,
  className,
  headingLevel = "h3",
  material = "clay",
  name,
  role,
  size,
  socials = [],
  variant,
  ...props
}: ProfileCardProps) {
  const Heading = headingLevel;
  const hasFooter = socials.length > 0 || action != null;

  const avatar = avatarSrc ? (
    // eslint-disable-next-line @next/next/no-img-element -- self-contained copy-and-own component stays framework-agnostic (no next/image coupling)
    <img
      src={avatarSrc}
      alt={avatarAlt}
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      className={cn(
        "size-[var(--mq-avatar,56px)] shrink-0 rounded-full object-cover",
        "border border-[var(--mq-brd,rgba(23,24,23,0.14))]",
      )}
    />
  ) : (
    <span
      // Decorative, mirroring the photo path (whose alt defaults to ""): the
      // name is already announced by the adjacent heading, so labelling the
      // initials with it too would double-announce.
      aria-hidden="true"
      className={cn(
        "grid size-[var(--mq-avatar,56px)] shrink-0 place-items-center rounded-full",
        "border border-[var(--mq-brd,rgba(23,24,23,0.14))]",
        "bg-[color-mix(in_srgb,var(--mq-text,#2b2b26)_12%,transparent)]",
        "font-bold text-[color:var(--mq-text,#2b2b26)]",
        "text-[length:calc(var(--mq-avatar,56px)_*_0.38)] leading-none",
        "forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]",
      )}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </span>
  );

  return (
    <article
      {...props}
      className={cn(profileCardVariants({ material, variant, size }), className)}
      data-material={material}
    >
      <div className="flex items-center gap-[var(--mq-gap,14px)]">
        {avatar}
        <div className="flex min-w-0 flex-col gap-[3px]">
          <Heading className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]">
            {name}
          </Heading>
          {role ? (
            <p className="m-0 font-medium text-[color:var(--mq-muted,#5c5b55)] text-[length:12px] leading-[1.4]">
              {role}
            </p>
          ) : null}
        </div>
      </div>

      {bio ? (
        <p className="m-0 text-[color:var(--mq-text,#2b2b26)] text-[length:13px] leading-[1.65]">
          {bio}
        </p>
      ) : null}

      {children}

      {hasFooter ? (
        <div className="flex flex-wrap items-center justify-between gap-[10px] border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)]">
          {socials.length > 0 ? (
            <ul className="m-0 flex flex-wrap items-center gap-[8px] p-0 [list-style:none]">
              {socials.map((social, index) => (
                <li key={`${social.href}-${index}`}>
                  <a href={social.href} aria-label={social.label} className={SOCIAL_LINK_CLASS}>
                    <span aria-hidden="true" className="inline-flex">
                      {social.icon ?? <Link2 aria-hidden="true" />}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}

          {action ? (
            // A disabled action never renders as a live <a> (an anchor cannot be
            // disabled): it degrades to a real disabled <button> so `disabled` is
            // honoured — no navigation, native disabled semantics + styling.
            action.href && !action.disabled ? (
              <a href={action.href} className={ACTION_CLASS}>
                {action.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={action.disabled ? undefined : action.onClick}
                disabled={action.disabled}
                className={ACTION_CLASS}
              >
                {action.label}
              </button>
            )
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export { profileCardVariants };
