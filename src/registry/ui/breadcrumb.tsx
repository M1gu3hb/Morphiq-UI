import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Breadcrumb
 *
 * A data-driven breadcrumb keeps the structural contract impossible to split:
 * the root is a labelled nav, its only list is an ol, every visible level is a
 * li, intermediate levels are anchors and the current page is plain text with
 * aria-current="page". Separators never enter the accessibility tree.
 *
 * Local theming knobs (every use includes a literal fallback):
 *
 *   --mq-crumb-bg        quiet surface
 *   --mq-crumb-solid     stronger material surface
 *   --mq-crumb-text      current-page text
 *   --mq-crumb-link      link text
 *   --mq-crumb-link-hot  hover link text
 *   --mq-crumb-hover     hover wash
 *   --mq-crumb-separator decorative separator
 *   --mq-crumb-border    solid treatment border
 *   --mq-crumb-ring      keyboard focus ring
 */

const MATERIAL_TOKENS = {
  clay: [
    "[--mq-crumb-bg:#fff4eb] [--mq-crumb-solid:#f4ded2]",
    "[--mq-crumb-text:#4a1d13] [--mq-crumb-link:#6b281d] [--mq-crumb-link-hot:#3f1710]",
    "[--mq-crumb-hover:rgba(159,47,35,0.10)] [--mq-crumb-separator:#815347]",
    "[--mq-crumb-border:#a86550] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:0_5px_14px_rgba(72,38,29,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-crumb-bg:rgba(255,255,255,0.90)] [--mq-crumb-solid:rgba(232,242,245,0.94)]",
    "[--mq-crumb-text:#17343b] [--mq-crumb-link:#075d70] [--mq-crumb-link-hot:#043d4a]",
    "[--mq-crumb-hover:rgba(7,93,112,0.10)] [--mq-crumb-separator:#47666d]",
    "[--mq-crumb-border:#557d86] [--mq-crumb-ring:#071f25]",
    "[--mq-crumb-shadow:0_7px_20px_rgba(7,31,37,0.13)]",
  ].join(" "),
  skeuo: [
    "[--mq-crumb-bg:#f3f0e8] [--mq-crumb-solid:#d6d0c4]",
    "[--mq-crumb-text:#292925] [--mq-crumb-link:#3f4641] [--mq-crumb-link-hot:#1f2421]",
    "[--mq-crumb-hover:rgba(63,70,65,0.11)] [--mq-crumb-separator:#66665f]",
    "[--mq-crumb-border:#77746c] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:inset_0_1px_0_rgba(255,255,255,0.72),0_5px_12px_rgba(35,35,31,0.16)]",
  ].join(" "),
  adaptive: [
    "[--mq-crumb-bg:#ffffff] [--mq-crumb-solid:#eeeee9]",
    "[--mq-crumb-text:#171817] [--mq-crumb-link:#30312e] [--mq-crumb-link-hot:#090a09]",
    "[--mq-crumb-hover:rgba(23,24,23,0.08)] [--mq-crumb-separator:#666862]",
    "[--mq-crumb-border:#777973] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:0_5px_14px_rgba(23,24,23,0.12)]",
    "dark:[--mq-crumb-bg:#242428] dark:[--mq-crumb-solid:#313136]",
    "dark:[--mq-crumb-text:#f5f3ee] dark:[--mq-crumb-link:#e5e3dc] dark:[--mq-crumb-link-hot:#ffffff]",
    "dark:[--mq-crumb-hover:rgba(255,255,255,0.10)] dark:[--mq-crumb-separator:#b4b2ab]",
    "dark:[--mq-crumb-border:#8f8d87] dark:[--mq-crumb-ring:#f5f3ee]",
  ].join(" "),
} as const;

type BreadcrumbMaterial = keyof typeof MATERIAL_TOKENS;
type BreadcrumbVariant = "default" | "solid";
type BreadcrumbSize = "sm" | "md" | "lg";

const breadcrumbVariants = cva(
  [
    "inline-flex max-w-full rounded-[var(--mq-crumb-radius,12px)] border",
    "text-[color:var(--mq-crumb-text,#4a1d13)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--mq-crumb-bg,#fff4eb)] shadow-none",
        solid:
          "border-[var(--mq-crumb-border,#a86550)] bg-[var(--mq-crumb-solid,#f4ded2)] shadow-[var(--mq-crumb-shadow,0_5px_14px_rgba(72,38,29,0.14))]",
      },
      size: {
        sm: "[--mq-crumb-radius:9px] px-[8px] py-[5px]",
        md: "[--mq-crumb-radius:12px] px-[11px] py-[7px]",
        lg: "[--mq-crumb-radius:15px] px-[14px] py-[9px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const breadcrumbListVariants = cva(
  "m-0 flex min-w-0 list-none flex-wrap items-center p-0",
  {
    variants: {
      size: {
        sm: "gap-x-[5px] gap-y-[3px] text-[length:11px]",
        md: "gap-x-[7px] gap-y-[4px] text-[length:12px]",
        lg: "gap-x-[9px] gap-y-[5px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const breadcrumbLinkVariants = cva(
  [
    "inline-flex items-center rounded-[var(--mq-crumb-link-radius,7px)] px-[4px] py-[2px]",
    "font-bold text-[color:var(--mq-crumb-link,#6b281d)] underline decoration-1 underline-offset-[3px]",
    "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-crumb-hover,rgba(159,47,35,0.10))] hover:text-[color:var(--mq-crumb-link-hot,#3f1710)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-crumb-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-crumb-ring,#171817)]",
    "forced-colors:text-[LinkText] forced-colors:hover:bg-[Canvas] forced-colors:focus-visible:outline-[Highlight]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-crumb-link-radius:5px]",
        md: "[--mq-crumb-link-radius:7px]",
        lg: "[--mq-crumb-link-radius:9px] px-[5px] py-[3px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type BreadcrumbLinkItem = {
  /** Stable identity for React and analytics. */
  id: string;
  href: string;
  label: React.ReactNode;
  linkProps?: Omit<React.ComponentPropsWithoutRef<"a">, "children" | "href"> & {
    "data-focus"?: string;
  };
};

export type BreadcrumbCurrentItem = {
  id: string;
  label: React.ReactNode;
};

export type BreadcrumbProps = Omit<React.ComponentPropsWithRef<"nav">, "children"> & {
  current: BreadcrumbCurrentItem;
  items?: readonly BreadcrumbLinkItem[];
  material?: BreadcrumbMaterial;
  variant?: BreadcrumbVariant;
  size?: BreadcrumbSize;
  /** Total visible levels, including current and the optional ellipsis. */
  maxItems?: number;
  separator?: React.ReactNode;
  collapsedLabel?: string;
};

type BreadcrumbToken =
  | { kind: "link"; item: BreadcrumbLinkItem }
  | { kind: "ellipsis"; hiddenCount: number; key: string }
  | { kind: "current"; item: BreadcrumbCurrentItem };

function getBreadcrumbTokens(
  items: readonly BreadcrumbLinkItem[],
  current: BreadcrumbCurrentItem,
  maxItems?: number,
): BreadcrumbToken[] {
  const all: BreadcrumbToken[] = [
    ...items.map((item) => ({ kind: "link" as const, item })),
    { kind: "current" as const, item: current },
  ];
  if (maxItems == null || all.length <= Math.max(3, Math.floor(maxItems))) return all;

  const visibleCount = Math.max(3, Math.floor(maxItems));
  const trailing = visibleCount - 2;
  const hiddenCount = all.length - trailing - 1;
  return [
    all[0],
    { kind: "ellipsis", hiddenCount, key: `ellipsis-${items[0]?.id ?? current.id}` },
    ...all.slice(-trailing),
  ];
}

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<"span">;

export function BreadcrumbSeparator({
  children = "/",
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn(
        "select-none font-black text-[color:var(--mq-crumb-separator,#815347)] forced-colors:text-[CanvasText]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export type BreadcrumbEllipsisProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  hiddenCount?: number;
};

export function BreadcrumbEllipsis({
  "aria-label": ariaLabel,
  className,
  hiddenCount,
  ...props
}: BreadcrumbEllipsisProps) {
  const label = ariaLabel ??
    (hiddenCount == null
      ? "More breadcrumb levels"
      : `${hiddenCount} hidden breadcrumb ${hiddenCount === 1 ? "level" : "levels"}`);

  return (
    <span
      {...props}
      aria-label={label}
      className={cn(
        "inline-grid min-w-[20px] place-items-center font-black tracking-[0.08em]",
        className,
      )}
      role="img"
    >
      <span aria-hidden="true">…</span>
    </span>
  );
}

export function Breadcrumb({
  "aria-label": ariaLabel = "Breadcrumb",
  className,
  collapsedLabel,
  current,
  items = [],
  material = "clay",
  maxItems,
  separator,
  size = "md",
  variant = "default",
  ...props
}: BreadcrumbProps) {
  const tokens = getBreadcrumbTokens(items, current, maxItems);

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(breadcrumbVariants({ size, variant }), MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
    >
      <ol className={breadcrumbListVariants({ size })}>
        {tokens.map((token, index) => {
          const isLast = index === tokens.length - 1;
          const key = token.kind === "ellipsis" ? token.key : token.item.id;

          return (
            <li className="flex min-w-0 items-center gap-[inherit]" key={key}>
              {token.kind === "link" ? (
                <a
                  {...token.item.linkProps}
                  className={cn(
                    breadcrumbLinkVariants({ size }),
                    token.item.linkProps?.className,
                  )}
                  href={token.item.href}
                >
                  {token.item.label}
                </a>
              ) : token.kind === "ellipsis" ? (
                <BreadcrumbEllipsis
                  aria-label={collapsedLabel}
                  hiddenCount={token.hiddenCount}
                />
              ) : (
                <span
                  aria-current="page"
                  className="truncate border-b-2 border-[var(--mq-crumb-border,#a86550)] px-[4px] py-[2px] font-black no-underline forced-colors:border-[Highlight]"
                >
                  {token.item.label}
                </span>
              )}
              {!isLast && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type BreadcrumbVariantProps = VariantProps<typeof breadcrumbVariants>;

export { breadcrumbLinkVariants, breadcrumbVariants };
