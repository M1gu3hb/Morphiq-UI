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
    "[--mq-page-bg:#fff4eb] [--mq-page-solid:#f4ded2] [--mq-page-control:#fff9f5]",
    "[--mq-page-text:#4a1d13] [--mq-page-border:#a86550] [--mq-page-hover:#f9d2c3]",
    "[--mq-page-active:#7c281f] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-shadow:0_5px_14px_rgba(72,38,29,0.14)] [--mq-page-control-shadow:0_3px_8px_rgba(72,38,29,0.16)]",
  ].join(" "),
  glass: [
    "[--mq-page-bg:rgba(255,255,255,0.90)] [--mq-page-solid:rgba(232,242,245,0.94)] [--mq-page-control:rgba(255,255,255,0.82)]",
    "[--mq-page-text:#17343b] [--mq-page-border:#557d86] [--mq-page-hover:rgba(7,93,112,0.13)]",
    "[--mq-page-active:#075d70] [--mq-page-active-text:#ffffff] [--mq-page-ring:#071f25]",
    "[--mq-page-shadow:0_7px_20px_rgba(7,31,37,0.13)] [--mq-page-control-shadow:0_4px_12px_rgba(7,31,37,0.16)]",
  ].join(" "),
  skeuo: [
    "[--mq-page-bg:#f3f0e8] [--mq-page-solid:#d6d0c4] [--mq-page-control:#ece9e1]",
    "[--mq-page-text:#292925] [--mq-page-border:#77746c] [--mq-page-hover:#cbc6ba]",
    "[--mq-page-active:#3f4641] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-shadow:inset_0_1px_0_rgba(255,255,255,0.72),0_5px_12px_rgba(35,35,31,0.16)] [--mq-page-control-shadow:0_3px_7px_rgba(35,35,31,0.18)]",
  ].join(" "),
  adaptive: [
    "[--mq-page-bg:#ffffff] [--mq-page-solid:#eeeee9] [--mq-page-control:#ffffff]",
    "[--mq-page-text:#171817] [--mq-page-border:#777973] [--mq-page-hover:#e1e2dc]",
    "[--mq-page-active:#171817] [--mq-page-active-text:#ffffff] [--mq-page-ring:#171817]",
    "[--mq-page-shadow:0_5px_14px_rgba(23,24,23,0.12)] [--mq-page-control-shadow:0_3px_8px_rgba(23,24,23,0.15)]",
    "dark:[--mq-page-bg:#242428] dark:[--mq-page-solid:#313136] dark:[--mq-page-control:#29292e]",
    "dark:[--mq-page-text:#f5f3ee] dark:[--mq-page-border:#8f8d87] dark:[--mq-page-hover:#424248]",
    "dark:[--mq-page-active:#f5f3ee] dark:[--mq-page-active-text:#171817] dark:[--mq-page-ring:#f5f3ee]",
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
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--mq-page-bg,#fff4eb)] shadow-none",
        solid:
          "border-[var(--mq-page-border,#a86550)] bg-[var(--mq-page-solid,#f4ded2)] shadow-[var(--mq-page-shadow,0_5px_14px_rgba(72,38,29,0.14))]",
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
    "border-[var(--mq-page-border,#a86550)] bg-[var(--mq-page-control,#fff9f5)] text-[color:var(--mq-page-text,#4a1d13)]",
    "transition-[background-color,color,box-shadow,border-color] duration-150 ease-out motion-reduce:transition-none",
    "enabled:hover:border-[var(--mq-page-active,#7c281f)] enabled:hover:bg-[var(--mq-page-hover,#f9d2c3)] enabled:hover:shadow-[var(--mq-page-control-shadow,0_3px_8px_rgba(72,38,29,0.16))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-page-ring,#171817)]",
    "group-data-[focus=true]/pagination:data-[current=true]:outline-2 group-data-[focus=true]/pagination:data-[current=true]:outline-offset-[2px] group-data-[focus=true]/pagination:data-[current=true]:outline-[var(--mq-page-ring,#171817)]",
    "data-[current=true]:border-[var(--mq-page-active,#7c281f)] data-[current=true]:bg-[var(--mq-page-active,#7c281f)] data-[current=true]:text-[color:var(--mq-page-active-text,#ffffff)]",
    "data-[current=true]:font-black data-[current=true]:underline data-[current=true]:decoration-2 data-[current=true]:underline-offset-[3px]",
    "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
    "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none",
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
