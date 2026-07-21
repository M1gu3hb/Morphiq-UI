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
 *   --mq-crumb-pill      link pill surface
 *   --mq-crumb-pill-image / --mq-crumb-chip-image material lighting
 *   --mq-crumb-pill-shadow / --mq-crumb-pill-shadow-hot interactive depth
 *   --mq-crumb-chip      persistent current-page surface
 *   --mq-crumb-separator decorative separator
 *   --mq-crumb-border    solid treatment border
 *   --mq-crumb-ring      keyboard focus ring
 */

const MATERIAL_TOKENS = {
  clay: [
    "[--mq-crumb-bg:#fff7f1] [--mq-crumb-solid:#f3dfd2]",
    "[--mq-crumb-shell-image:linear-gradient(180deg,rgba(255,255,255,0.52),rgba(151,92,58,0.06))]",
    "[--mq-crumb-text:#4a1d13] [--mq-crumb-link:#6b281d] [--mq-crumb-link-hot:#3f1710]",
    "[--mq-crumb-pill:#f2daca] [--mq-crumb-pill-border:rgba(120,65,42,0.20)] [--mq-crumb-edge:#d1a98f]",
    "[--mq-crumb-pill-image:linear-gradient(180deg,rgba(255,255,255,0.72),rgba(151,92,58,0.10))]",
    "[--mq-crumb-pill-shadow:inset_0_2px_2px_rgba(255,255,255,0.78),inset_0_-2px_3px_rgba(135,71,48,0.14),0_1px_0_var(--mq-crumb-edge,#d1a98f),0_3px_7px_rgba(94,53,38,0.13)]",
    "[--mq-crumb-pill-shadow-hot:inset_0_2px_2px_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(135,71,48,0.17),0_2px_0_var(--mq-crumb-edge,#d1a98f),0_5px_10px_rgba(94,53,38,0.18)]",
    "[--mq-crumb-chip:#edcdb9] [--mq-crumb-chip-image:linear-gradient(180deg,rgba(255,255,255,0.66),rgba(151,92,58,0.13))]",
    "[--mq-crumb-chip-shadow:inset_0_2px_2px_rgba(255,255,255,0.82),inset_0_-3px_4px_rgba(135,71,48,0.17),0_2px_0_var(--mq-crumb-edge,#d1a98f),0_4px_9px_rgba(94,53,38,0.16)]",
    "[--mq-crumb-blur:0px] [--mq-crumb-saturate:100%] [--mq-crumb-touch:0px]",
    "[--mq-crumb-separator:#815347] [--mq-crumb-border:#a86550] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_5px_rgba(135,71,48,0.10),0_4px_12px_rgba(94,53,38,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-crumb-bg:rgba(255,255,255,0.72)] [--mq-crumb-solid:rgba(232,242,245,0.86)]",
    "[--mq-crumb-shell-image:linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0))]",
    "[--mq-crumb-text:#17343b] [--mq-crumb-link:#054858] [--mq-crumb-link-hot:#043945]",
    "[--mq-crumb-pill:rgba(255,255,255,0.78)] [--mq-crumb-pill-border:rgba(255,255,255,0.88)] [--mq-crumb-edge:rgba(255,255,255,0.92)]",
    "[--mq-crumb-pill-image:linear-gradient(180deg,rgba(255,255,255,0.64),rgba(255,255,255,0.08))]",
    "[--mq-crumb-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(19,52,62,0.12),0_1px_0_var(--mq-crumb-edge,rgba(255,255,255,0.92)),0_4px_11px_rgba(7,31,37,0.15)]",
    "[--mq-crumb-pill-shadow-hot:inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(19,52,62,0.15),0_2px_0_var(--mq-crumb-edge,rgba(255,255,255,0.92)),0_7px_16px_rgba(7,31,37,0.22)]",
    "[--mq-crumb-chip:rgba(239,248,250,0.88)] [--mq-crumb-chip-image:linear-gradient(180deg,rgba(255,255,255,0.72),rgba(204,231,237,0.16))]",
    "[--mq-crumb-chip-shadow:inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(19,52,62,0.14),0_1px_0_var(--mq-crumb-edge,rgba(255,255,255,0.92)),0_5px_14px_rgba(7,31,37,0.18)]",
    "[--mq-crumb-blur:12px] [--mq-crumb-saturate:165%] [--mq-crumb-touch:0px]",
    "[--mq-crumb-separator:#47666d] [--mq-crumb-border:#557d86] [--mq-crumb-ring:#071f25]",
    "[--mq-crumb-shadow:inset_0_1px_0_rgba(255,255,255,0.84),0_8px_22px_rgba(7,31,37,0.16)]",
  ].join(" "),
  skeuo: [
    "[--mq-crumb-bg:#e4e7ea] [--mq-crumb-solid:#d6dade]",
    "[--mq-crumb-shell-image:linear-gradient(180deg,#f0f2f3,#dadddf)]",
    "[--mq-crumb-text:#202326] [--mq-crumb-link:#343b40] [--mq-crumb-link-hot:#181c1f]",
    "[--mq-crumb-pill:#dce0e2] [--mq-crumb-pill-border:rgba(30,34,38,0.32)] [--mq-crumb-edge:#9aa0a5]",
    "[--mq-crumb-pill-image:linear-gradient(180deg,#f5f6f7,#cbd0d3)]",
    "[--mq-crumb-pill-shadow:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-2px_3px_rgba(30,34,38,0.16),0_2px_0_var(--mq-crumb-edge,#9aa0a5),0_4px_8px_rgba(38,43,48,0.20)]",
    "[--mq-crumb-pill-shadow-hot:inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_3px_rgba(30,34,38,0.19),0_3px_0_var(--mq-crumb-edge,#9aa0a5),0_6px_12px_rgba(38,43,48,0.27)]",
    "[--mq-crumb-chip:#d2d7da] [--mq-crumb-chip-image:linear-gradient(180deg,#eef0f2,#c2c8cc)]",
    "[--mq-crumb-chip-shadow:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_3px_6px_rgba(30,34,38,0.22),0_1px_0_var(--mq-crumb-edge,#9aa0a5),0_3px_6px_rgba(38,43,48,0.18)]",
    "[--mq-crumb-blur:0px] [--mq-crumb-saturate:100%] [--mq-crumb-touch:0px]",
    "[--mq-crumb-separator:#5a6064] [--mq-crumb-border:#6d7479] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-2px_4px_rgba(30,34,38,0.13),0_4px_10px_rgba(38,43,48,0.21)]",
  ].join(" "),
  adaptive: [
    "[--mq-crumb-bg:#ffffff] [--mq-crumb-solid:#eeeee9]",
    "[--mq-crumb-shell-image:none]",
    "[--mq-crumb-text:#171817] [--mq-crumb-link:#30312e] [--mq-crumb-link-hot:#090a09]",
    "[--mq-crumb-pill:#eeeee9] [--mq-crumb-pill-border:rgba(23,24,23,0.18)] [--mq-crumb-edge:transparent]",
    "[--mq-crumb-pill-image:none] [--mq-crumb-chip-image:none]",
    "[--mq-crumb-pill-shadow:inset_0_0_0_rgba(23,24,23,0),0_1px_2px_rgba(23,24,23,0.10)]",
    "[--mq-crumb-pill-shadow-hot:inset_0_0_0_rgba(23,24,23,0),0_5px_12px_rgba(23,24,23,0.17)]",
    "[--mq-crumb-chip:#e1e2dc] [--mq-crumb-chip-shadow:inset_0_3px_6px_rgba(23,24,23,0.13),0_1px_2px_rgba(23,24,23,0.08)]",
    "[--mq-crumb-blur:0px] [--mq-crumb-saturate:100%] [--mq-crumb-touch:36px]",
    "[--mq-crumb-separator:#666862] [--mq-crumb-border:#777973] [--mq-crumb-ring:#171817]",
    "[--mq-crumb-shadow:inset_0_0_0_rgba(23,24,23,0),0_2px_6px_rgba(23,24,23,0.12)]",
    "dark:[--mq-crumb-bg:#242428] dark:[--mq-crumb-solid:#313136]",
    "dark:[--mq-crumb-text:#f5f3ee] dark:[--mq-crumb-link:#e5e3dc] dark:[--mq-crumb-link-hot:#ffffff]",
    "dark:[--mq-crumb-pill:#34343a] dark:[--mq-crumb-chip:#414148]",
    "dark:[--mq-crumb-pill-border:rgba(255,255,255,0.22)]",
    "dark:[--mq-crumb-pill-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_3px_rgba(0,0,0,0.38)]",
    "dark:[--mq-crumb-pill-shadow-hot:inset_0_0_0_rgba(0,0,0,0),0_6px_14px_rgba(0,0,0,0.52)]",
    "dark:[--mq-crumb-chip-shadow:inset_0_3px_7px_rgba(0,0,0,0.38),0_1px_2px_rgba(0,0,0,0.34)]",
    "dark:[--mq-crumb-separator:#b4b2ab]",
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
    "[background-image:var(--mq-crumb-shell-image,none)]",
    "backdrop-blur-[var(--mq-crumb-blur,0px)] backdrop-saturate-[var(--mq-crumb-saturate,100%)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent [background-color:var(--mq-crumb-bg,#fff7f1)] shadow-none",
        solid:
          "border-[var(--mq-crumb-border,#a86550)] [background-color:var(--mq-crumb-solid,#f3dfd2)] shadow-[var(--mq-crumb-shadow,inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_5px_rgba(135,71,48,0.10),0_4px_12px_rgba(94,53,38,0.14))]",
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
    "relative isolate inline-flex items-center rounded-[var(--mq-crumb-link-radius,7px)] px-[4px] py-[2px]",
    "font-bold text-[color:var(--mq-crumb-link,#6b281d)] underline decoration-1 underline-offset-[3px]",
    "transition-[color] duration-150 ease-out motion-reduce:transition-none",
    // The material surface belongs to a pseudo-element so the underline and
    // immediate keyboard outline remain crisp above it. At rest it is a small,
    // transparent seed; hover/focus expands it into a physical pill.
    "before:pointer-events-none before:absolute before:inset-x-[-3px] before:inset-y-[-2px] before:-z-10 before:content-['']",
    "before:rounded-[var(--mq-crumb-link-radius,7px)] before:border",
    "before:border-[var(--mq-crumb-pill-border,rgba(120,65,42,0.20))]",
    "before:[background-color:var(--mq-crumb-pill,#f2daca)]",
    "before:[background-image:var(--mq-crumb-pill-image,linear-gradient(180deg,rgba(255,255,255,0.72),rgba(151,92,58,0.10)))]",
    "before:shadow-[var(--mq-crumb-pill-shadow,inset_0_2px_2px_rgba(255,255,255,0.78),inset_0_-2px_3px_rgba(135,71,48,0.14),0_1px_0_#d1a98f,0_3px_7px_rgba(94,53,38,0.13))]",
    "before:backdrop-blur-[var(--mq-crumb-blur,0px)] before:backdrop-saturate-[var(--mq-crumb-saturate,100%)]",
    "before:origin-center before:scale-x-[0.72] before:opacity-0",
    "before:transition-[scale,opacity,box-shadow] before:duration-200 before:ease-[cubic-bezier(0.22,1.35,0.36,1)]",
    "hover:text-[color:var(--mq-crumb-link-hot,#3f1710)] hover:before:scale-x-100 hover:before:opacity-100",
    "hover:before:shadow-[var(--mq-crumb-pill-shadow-hot,inset_0_2px_2px_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(135,71,48,0.17),0_2px_0_#d1a98f,0_5px_10px_rgba(94,53,38,0.18))]",
    "focus-visible:text-[color:var(--mq-crumb-link-hot,#3f1710)] focus-visible:before:scale-x-100 focus-visible:before:opacity-100",
    "focus-visible:before:shadow-[var(--mq-crumb-pill-shadow-hot,inset_0_2px_2px_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(135,71,48,0.17),0_2px_0_#d1a98f,0_5px_10px_rgba(94,53,38,0.18))]",
    "data-[focus=true]:text-[color:var(--mq-crumb-link-hot,#3f1710)] data-[focus=true]:before:scale-x-100 data-[focus=true]:before:opacity-100",
    "data-[focus=true]:before:shadow-[var(--mq-crumb-pill-shadow-hot,inset_0_2px_2px_rgba(255,255,255,0.88),inset_0_-2px_3px_rgba(135,71,48,0.17),0_2px_0_#d1a98f,0_5px_10px_rgba(94,53,38,0.18))]",
    "motion-reduce:before:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-crumb-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px] data-[focus=true]:outline-[var(--mq-crumb-ring,#171817)]",
    "pointer-coarse:min-h-[var(--mq-crumb-touch,0px)]",
    "forced-colors:text-[LinkText] forced-colors:focus-visible:outline-[Highlight]",
    "forced-colors:before:border-[LinkText] forced-colors:before:bg-[Canvas] forced-colors:before:shadow-none",
    "forced-colors:before:[background-image:none] forced-colors:before:backdrop-filter-none",
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

/** Persistent material chip for the non-interactive current page. */
const breadcrumbCurrentVariants = cva(
  [
    "inline-flex min-w-0 items-center truncate border font-black no-underline",
    "rounded-[var(--mq-crumb-link-radius,7px)]",
    "border-[var(--mq-crumb-pill-border,rgba(120,65,42,0.20))]",
    "[background-color:var(--mq-crumb-chip,#edcdb9)]",
    "[background-image:var(--mq-crumb-chip-image,linear-gradient(180deg,rgba(255,255,255,0.66),rgba(151,92,58,0.13)))]",
    "shadow-[var(--mq-crumb-chip-shadow,inset_0_2px_2px_rgba(255,255,255,0.82),inset_0_-3px_4px_rgba(135,71,48,0.17),0_2px_0_#d1a98f,0_4px_9px_rgba(94,53,38,0.16))]",
    "backdrop-blur-[var(--mq-crumb-blur,0px)] backdrop-saturate-[var(--mq-crumb-saturate,100%)]",
    "pointer-coarse:min-h-[var(--mq-crumb-touch,0px)]",
    "forced-colors:border-[Highlight] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-crumb-link-radius:5px] px-[5px] py-[2px]",
        md: "[--mq-crumb-link-radius:7px] px-[6px] py-[3px]",
        lg: "[--mq-crumb-link-radius:9px] px-[8px] py-[4px]",
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
                  className={breadcrumbCurrentVariants({ size })}
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
