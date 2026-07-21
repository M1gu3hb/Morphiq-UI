import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Pagination
 *
 * Native buttons keep Tab, Enter and Space behavior in the browser. The
 * component is controlled: the caller owns `page`; Morphiq emits the next page
 * through `onPageChange` and keeps rendering deterministic for SSR.
 */

const MATERIAL_TOKENS = {
  clay: [
    "[--mq-page-bg:#fff7f1] [--mq-page-solid:#f3dfd2] [--mq-page-control:#f4dfd1]",
    "[--mq-page-shell-image:linear-gradient(180deg,rgba(255,255,255,0.52),rgba(151,92,58,0.06))]",
    "[--mq-page-control-image:linear-gradient(180deg,rgba(255,255,255,0.78),rgba(151,92,58,0.10))]",
    "[--mq-page-current-image:linear-gradient(180deg,rgba(255,255,255,0.14),rgba(78,21,16,0.14))]",
    "[--mq-page-text:#4a1d13] [--mq-page-border:rgba(120,65,42,0.34)] [--mq-page-hover:#f7e7dc]",
    "[--mq-page-active:#71231b] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-edge:#d1a98f]",
    "[--mq-page-control-shadow:inset_0_2px_2px_rgba(255,255,255,0.82),inset_0_-2px_3px_rgba(135,71,48,0.14),0_2px_0_var(--mq-page-edge,#d1a98f),0_4px_8px_rgba(94,53,38,0.15)]",
    "[--mq-page-control-shadow-hover:inset_0_2px_2px_rgba(255,255,255,0.92),inset_0_-2px_3px_rgba(135,71,48,0.16),0_4px_0_var(--mq-page-edge,#d1a98f),0_8px_14px_rgba(94,53,38,0.20)]",
    "[--mq-page-control-shadow-press:inset_0_3px_5px_rgba(118,53,34,0.27),inset_0_-1px_2px_rgba(135,71,48,0.10),0_1px_0_var(--mq-page-edge,#d1a98f),0_1px_2px_rgba(94,53,38,0.10)]",
    "[--mq-page-current-shadow:inset_0_3px_5px_rgba(73,18,13,0.34),inset_0_-1px_2px_rgba(255,255,255,0.10),0_1px_0_var(--mq-page-edge,#d1a98f),0_2px_4px_rgba(94,53,38,0.14)]",
    "[--mq-page-control-blur:0px] [--mq-page-control-blur-hot:0px] [--mq-page-control-saturate:100%] [--mq-page-touch:0px]",
    "[--mq-page-shadow:inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_5px_rgba(135,71,48,0.10),0_4px_12px_rgba(94,53,38,0.14)]",
  ].join(" "),
  glass: [
    "[--mq-page-bg:rgba(255,255,255,0.70)] [--mq-page-solid:rgba(232,242,245,0.84)] [--mq-page-control:rgba(255,255,255,0.78)]",
    "[--mq-page-shell-image:linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,255,255,0))]",
    "[--mq-page-control-image:linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.06))]",
    "[--mq-page-current-image:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(1,29,35,0.10))]",
    "[--mq-page-text:#17343b] [--mq-page-border:rgba(255,255,255,0.88)] [--mq-page-hover:rgba(239,249,251,0.90)]",
    "[--mq-page-active:#03313b] [--mq-page-active-text:#ffffff] [--mq-page-ring:#071f25]",
    "[--mq-page-edge:rgba(255,255,255,0.92)]",
    "[--mq-page-control-shadow:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(19,52,62,0.12),0_1px_0_var(--mq-page-edge,rgba(255,255,255,0.92)),0_5px_13px_rgba(7,31,37,0.17)]",
    "[--mq-page-control-shadow-hover:inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(19,52,62,0.15),0_2px_0_var(--mq-page-edge,rgba(255,255,255,0.92)),0_9px_20px_rgba(7,31,37,0.25)]",
    "[--mq-page-control-shadow-press:inset_0_3px_6px_rgba(7,31,37,0.24),inset_0_-1px_0_rgba(255,255,255,0.12),0_1px_0_var(--mq-page-edge,rgba(255,255,255,0.92)),0_2px_5px_rgba(7,31,37,0.12)]",
    "[--mq-page-current-shadow:inset_0_3px_6px_rgba(3,39,48,0.38),inset_0_-1px_0_rgba(255,255,255,0.12),0_1px_0_var(--mq-page-edge,rgba(255,255,255,0.92)),0_3px_7px_rgba(7,31,37,0.18)]",
    "[--mq-page-control-blur:12px] [--mq-page-control-blur-hot:16px] [--mq-page-control-saturate:165%] [--mq-page-touch:0px]",
    "[--mq-page-shadow:inset_0_1px_0_rgba(255,255,255,0.84),0_8px_22px_rgba(7,31,37,0.17)]",
  ].join(" "),
  skeuo: [
    "[--mq-page-bg:#e4e7ea] [--mq-page-solid:#d6dade] [--mq-page-control:#dce0e2]",
    "[--mq-page-shell-image:linear-gradient(180deg,#f0f2f3,#dadddf)]",
    "[--mq-page-control-image:linear-gradient(180deg,#f5f6f7,#cbd0d3)]",
    "[--mq-page-current-image:linear-gradient(180deg,#555c61,#30363a)]",
    "[--mq-page-text:#202326] [--mq-page-border:rgba(30,34,38,0.36)] [--mq-page-hover:#e7eaec]",
    "[--mq-page-active:#41474c] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-edge:#9aa0a5]",
    "[--mq-page-control-shadow:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-2px_3px_rgba(30,34,38,0.16),0_2px_0_var(--mq-page-edge,#9aa0a5),0_4px_8px_rgba(38,43,48,0.22)]",
    "[--mq-page-control-shadow-hover:inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_3px_rgba(30,34,38,0.19),0_4px_0_var(--mq-page-edge,#9aa0a5),0_8px_14px_rgba(38,43,48,0.29)]",
    "[--mq-page-control-shadow-press:inset_0_4px_7px_rgba(30,34,38,0.31),inset_0_-1px_2px_rgba(255,255,255,0.16),0_1px_0_var(--mq-page-edge,#9aa0a5),0_1px_2px_rgba(38,43,48,0.13)]",
    "[--mq-page-current-shadow:inset_0_4px_7px_rgba(20,23,26,0.42),inset_0_-1px_2px_rgba(255,255,255,0.12),0_1px_0_var(--mq-page-edge,#9aa0a5),0_2px_4px_rgba(38,43,48,0.18)]",
    "[--mq-page-control-blur:0px] [--mq-page-control-blur-hot:0px] [--mq-page-control-saturate:100%] [--mq-page-touch:0px]",
    "[--mq-page-shadow:inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-2px_4px_rgba(30,34,38,0.13),0_4px_10px_rgba(38,43,48,0.22)]",
  ].join(" "),
  adaptive: [
    "[--mq-page-bg:#ffffff] [--mq-page-solid:#eeeee9] [--mq-page-control:#ffffff]",
    "[--mq-page-shell-image:none] [--mq-page-control-image:none] [--mq-page-current-image:none]",
    "[--mq-page-text:#171817] [--mq-page-border:#777973] [--mq-page-hover:#e1e2dc]",
    "[--mq-page-active:#171817] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-edge:transparent]",
    "[--mq-page-control-shadow:inset_0_0_0_rgba(23,24,23,0),0_1px_2px_rgba(23,24,23,0.12)]",
    "[--mq-page-control-shadow-hover:inset_0_0_0_rgba(23,24,23,0),0_6px_15px_rgba(23,24,23,0.18)]",
    "[--mq-page-control-shadow-press:inset_0_3px_6px_rgba(23,24,23,0.16),0_1px_2px_rgba(23,24,23,0.08)]",
    "[--mq-page-current-shadow:inset_0_4px_8px_rgba(0,0,0,0.28),0_1px_2px_rgba(23,24,23,0.08)]",
    "[--mq-page-control-blur:0px] [--mq-page-control-blur-hot:0px] [--mq-page-control-saturate:100%] [--mq-page-touch:44px]",
    "[--mq-page-shadow:inset_0_0_0_rgba(23,24,23,0),0_2px_6px_rgba(23,24,23,0.12)]",
    "dark:[--mq-page-bg:#242428] dark:[--mq-page-solid:#313136] dark:[--mq-page-control:#29292e]",
    "dark:[--mq-page-text:#f5f3ee] dark:[--mq-page-border:#8f8d87] dark:[--mq-page-hover:#424248]",
    "dark:[--mq-page-active:#f5f3ee] dark:[--mq-page-active-text:#171817] dark:[--mq-page-ring:#f5f3ee]",
    "dark:[--mq-page-control-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_3px_rgba(0,0,0,0.38)]",
    "dark:[--mq-page-control-shadow-hover:inset_0_0_0_rgba(0,0,0,0),0_7px_17px_rgba(0,0,0,0.50)]",
    "dark:[--mq-page-control-shadow-press:inset_0_3px_7px_rgba(0,0,0,0.42),0_1px_2px_rgba(0,0,0,0.28)]",
    "dark:[--mq-page-current-shadow:inset_0_4px_8px_rgba(0,0,0,0.26),0_1px_2px_rgba(0,0,0,0.24)]",
  ].join(" "),
} as const;

type PaginationMaterial = keyof typeof MATERIAL_TOKENS;
type PaginationVariant = "default" | "solid";
type PaginationSize = "sm" | "md" | "lg";
type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

const paginationVariants = cva(
  [
    "group/pagination inline-flex max-w-full rounded-[var(--mq-page-radius,14px)] border",
    "text-[color:var(--mq-page-text,#4a1d13)]",
    "[background-image:var(--mq-page-shell-image,none)]",
    "backdrop-blur-[var(--mq-page-control-blur,0px)] backdrop-saturate-[var(--mq-page-control-saturate,100%)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent [background-color:var(--mq-page-bg,#fff7f1)] shadow-none",
        solid:
          "border-[var(--mq-page-border,#a86550)] [background-color:var(--mq-page-solid,#f3dfd2)] shadow-[var(--mq-page-shadow,inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_5px_rgba(135,71,48,0.10),0_4px_12px_rgba(94,53,38,0.14))]",
      },
      size: {
        sm: "[--mq-page-radius:10px] p-[4px]",
        md: "[--mq-page-radius:14px] p-[5px]",
        lg: "[--mq-page-radius:17px] p-[6px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const paginationControlVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-[5px]",
    "rounded-[var(--mq-page-control-radius,9px)] border font-extrabold",
    "border-[var(--mq-page-border,rgba(120,65,42,0.34))] text-[color:var(--mq-page-text,#4a1d13)]",
    "[background-color:var(--mq-page-control,#f4dfd1)]",
    "[background-image:var(--mq-page-control-image,linear-gradient(180deg,rgba(255,255,255,0.78),rgba(151,92,58,0.10)))]",
    "shadow-[var(--mq-page-control-shadow,inset_0_2px_2px_rgba(255,255,255,0.82),inset_0_-2px_3px_rgba(135,71,48,0.14),0_2px_0_#d1a98f,0_4px_8px_rgba(94,53,38,0.15))]",
    "backdrop-blur-[var(--mq-page-control-blur,0px)] backdrop-saturate-[var(--mq-page-control-saturate,100%)]",
    // Tailwind 4 emits the standalone `translate` property for translate-y.
    // Naming transform here would make lift/press snap instead of animate.
    "transition-[translate,box-shadow,background-color,color,border-color,backdrop-filter] duration-200 ease-out",
    "enabled:hover:-translate-y-[1px] enabled:hover:border-[var(--mq-page-active,#71231b)]",
    "enabled:hover:[background-color:var(--mq-page-hover,#f7e7dc)]",
    "enabled:hover:shadow-[var(--mq-page-control-shadow-hover,inset_0_2px_2px_rgba(255,255,255,0.92),inset_0_-2px_3px_rgba(135,71,48,0.16),0_4px_0_#d1a98f,0_8px_14px_rgba(94,53,38,0.20))]",
    "enabled:hover:backdrop-blur-[var(--mq-page-control-blur-hot,0px)]",
    "enabled:active:translate-y-[2px]",
    "enabled:active:shadow-[var(--mq-page-control-shadow-press,inset_0_3px_5px_rgba(118,53,34,0.27),inset_0_-1px_2px_rgba(135,71,48,0.10),0_1px_0_#d1a98f,0_1px_2px_rgba(94,53,38,0.10))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-page-ring,#171817)]",
    "group-data-[focus=true]/pagination:data-[current=true]:outline-2 group-data-[focus=true]/pagination:data-[current=true]:outline-offset-[2px] group-data-[focus=true]/pagination:data-[current=true]:outline-[var(--mq-page-ring,#171817)]",
    "data-[current=true]:translate-y-[1px] data-[current=true]:border-[var(--mq-page-active,#71231b)]",
    "data-[current=true]:[background-color:var(--mq-page-active,#71231b)]",
    "data-[current=true]:[background-image:var(--mq-page-current-image,linear-gradient(180deg,rgba(255,255,255,0.14),rgba(78,21,16,0.14)))]",
    "data-[current=true]:shadow-[var(--mq-page-current-shadow,inset_0_3px_5px_rgba(73,18,13,0.34),inset_0_-1px_2px_rgba(255,255,255,0.10),0_1px_0_#d1a98f,0_2px_4px_rgba(94,53,38,0.14))]",
    "data-[current=true]:text-[color:var(--mq-page-active-text,#ffffff)]",
    "data-[current=true]:font-black data-[current=true]:underline data-[current=true]:decoration-2 data-[current=true]:underline-offset-[3px]",
    // Reduced motion removes travel, not state: current still keeps its fill,
    // underline and inset shadow, and hover/press feedback arrives instantly.
    "motion-reduce:transition-none motion-reduce:enabled:hover:translate-y-0 motion-reduce:enabled:active:translate-y-0 motion-reduce:data-[current=true]:translate-y-0",
    "pointer-coarse:min-h-[var(--mq-page-touch,0px)] pointer-coarse:min-w-[var(--mq-page-touch,0px)]",
    "disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
    "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "forced-colors:data-[current=true]:outline-2 forced-colors:data-[current=true]:outline-offset-[-2px] forced-colors:data-[current=true]:outline-[Highlight]",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:disabled:border-[GrayText] forced-colors:disabled:text-[GrayText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[--mq-page-control-radius:7px] h-[30px] min-w-[30px] px-[8px] text-[length:11px]",
        md: "[--mq-page-control-radius:9px] h-[34px] min-w-[34px] px-[10px] text-[length:12px]",
        lg: "[--mq-page-control-radius:11px] h-[40px] min-w-[40px] px-[13px] text-[length:13px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/** Five numbered pages plus decorative ellipses for long ranges. */
export function getPaginationItems(page: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 7) return range(1, pageCount);
  if (page <= 3) return [...range(1, 4), "ellipsis-end", pageCount];
  if (page >= pageCount - 2) {
    return [1, "ellipsis-start", ...range(pageCount - 3, pageCount)];
  }
  return [1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", pageCount];
}

export type PaginationProps = Omit<React.ComponentPropsWithRef<"nav">, "children"> & {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  material?: PaginationMaterial;
  variant?: PaginationVariant;
  size?: PaginationSize;
  disabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  getPageLabel?: (page: number, current: boolean) => string;
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="size-[1em]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 20 20"
    >
      <path d={direction === "left" ? "m12.5 4.5-5 5.5 5 5.5" : "m7.5 4.5 5 5.5-5 5.5"} />
    </svg>
  );
}

export function Pagination({
  "aria-label": ariaLabel = "Pagination",
  className,
  disabled = false,
  getPageLabel = (itemPage, current) =>
    current ? `Page ${itemPage}, current page` : `Page ${itemPage}`,
  material = "clay",
  nextLabel = "Next page",
  onPageChange,
  page,
  pageCount,
  previousLabel = "Previous page",
  size = "md",
  variant = "default",
  ...props
}: PaginationProps) {
  const safePageCount = Math.max(1, Math.floor(Number.isFinite(pageCount) ? pageCount : 1));
  const safePage = Math.min(
    safePageCount,
    Math.max(1, Math.floor(Number.isFinite(page) ? page : 1)),
  );
  const items = getPaginationItems(safePage, safePageCount);
  const previousDisabled = disabled || safePage === 1;
  const nextDisabled = disabled || safePage === safePageCount;

  const selectPage = (nextPage: number) => {
    if (!disabled && nextPage !== safePage) onPageChange?.(nextPage);
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(paginationVariants({ size, variant }), MATERIAL_TOKENS[material], className)}
      data-material={material}
      data-variant={variant}
    >
      <ul className="m-0 flex list-none items-center gap-[var(--mq-page-gap,4px)] p-0">
        <li>
          <button
            aria-label={previousLabel}
            className={paginationControlVariants({ size })}
            disabled={previousDisabled}
            onClick={() => selectPage(safePage - 1)}
            type="button"
          >
            <Arrow direction="left" />
            <span>{previousLabel}</span>
          </button>
        </li>

        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                aria-current={item === safePage ? "page" : undefined}
                aria-label={getPageLabel(item, item === safePage)}
                className={paginationControlVariants({ size })}
                data-current={item === safePage ? "true" : undefined}
                disabled={disabled}
                onClick={() => selectPage(item)}
                type="button"
              >
                {item}
              </button>
            </li>
          ) : (
            <li className="grid min-w-[18px] place-items-center" key={item}>
              <span aria-hidden="true" className="font-black tracking-[0.08em]">
                …
              </span>
            </li>
          ),
        )}

        <li>
          <button
            aria-label={nextLabel}
            className={paginationControlVariants({ size })}
            disabled={nextDisabled}
            onClick={() => selectPage(safePage + 1)}
            type="button"
          >
            <span>{nextLabel}</span>
            <Arrow direction="right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export type PaginationVariantProps = VariantProps<typeof paginationVariants>;

export { paginationControlVariants, paginationVariants };
