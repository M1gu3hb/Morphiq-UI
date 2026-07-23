/* eslint-disable @next/next/no-img-element -- distributed open-code component, not Next-only */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type LogoWallItem = {
  id: string;
  src: string;
  alt: string;
  href?: string;
};

const logoWallVariants = cva(
  [
    "grid w-full border border-[#343846] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_16px_42px_rgba(4,7,15,.24)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        framed: "[&>li]:border [&>li]:border-white/12 [&>li]:bg-white/[.045]",
        mono: "",
      },
      size: {
        sm: "grid-cols-2 gap-[7px] rounded-[18px] p-[8px] sm:grid-cols-4",
        md: "grid-cols-2 gap-[10px] rounded-[24px] p-[12px] sm:grid-cols-4",
        lg: "grid-cols-2 gap-[14px] rounded-[30px] p-[16px] sm:grid-cols-4 lg:grid-cols-5",
      },
    },
    defaultVariants: { variant: "framed", size: "md" },
  },
);

export type LogoWallProps = Omit<React.ComponentPropsWithRef<"ul">, "children"> &
  Omit<VariantProps<typeof logoWallVariants>, "variant" | "size"> & {
    logos: readonly LogoWallItem[];
    material?: MaterialSlug;
    variant?: "framed" | "mono";
    size?: "sm" | "md" | "lg";
  };

export function LogoWall({
  "aria-label": ariaLabel = "Trusted brands",
  className,
  logos,
  material = "adaptive",
  size = "md",
  variant = "framed",
  ...props
}: LogoWallProps) {
  return (
    <ul {...props} aria-label={ariaLabel} className={cn(logoWallVariants({ size, variant }), className)} data-material={material}>
      {logos.map((logo) => {
        const image = (
          <img
            alt={logo.alt}
            className={cn(
              "max-h-[34px] max-w-full object-contain forced-colors:opacity-100 forced-colors:filter-none",
              variant === "mono" &&
                "grayscale opacity-75 transition-[filter,opacity] duration-180 hover:grayscale-0 hover:opacity-100 motion-reduce:transition-none",
            )}
            height={56}
            loading="lazy"
            src={logo.src}
            width={150}
          />
        );
        return (
          <li className="flex min-h-[72px] list-none items-center justify-center rounded-[13px] p-[12px] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas]" key={logo.id}>
            {logo.href ? (
              <a className="grid size-full place-items-center rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white forced-colors:focus-visible:outline-[Highlight]" href={logo.href}>
                {image}
              </a>
            ) : image}
          </li>
        );
      })}
    </ul>
  );
}

export { logoWallVariants };
