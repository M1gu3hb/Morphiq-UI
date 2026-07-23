import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const BLOB_KEYFRAMES = `@keyframes mq-blob-a{0%,100%{transform:translate3d(-8%,-6%,0) scale(1)}50%{transform:translate3d(20%,14%,0) scale(1.16)}}@keyframes mq-blob-b{0%,100%{transform:translate3d(12%,18%,0) scale(1.08)}50%{transform:translate3d(-18%,-12%,0) scale(.9)}}@keyframes mq-blob-c{0%,100%{transform:translate3d(0,22%,0) scale(.92)}50%{transform:translate3d(16%,-18%,0) scale(1.12)}}`;

function BlobKeyframes() {
  return (
    <style href="mq-blob-background" precedence="medium">
      {BLOB_KEYFRAMES}
    </style>
  );
}

const blobBackgroundVariants = cva(
  [
    "relative isolate overflow-hidden bg-[var(--mq-blob-bg,#090c17)] text-[color:var(--mq-blob-fg,#f8fafc)]",
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      variant: {
        pastel: "[--mq-blob-a:#f0abfc] [--mq-blob-b:#93c5fd] [--mq-blob-c:#6ee7b7]",
        neon: "[--mq-blob-a:#f43f5e] [--mq-blob-b:#7c3aed] [--mq-blob-c:#06b6d4]",
      },
      size: {
        sm: "min-h-[200px] rounded-[18px] p-5",
        md: "min-h-[280px] rounded-[24px] p-7",
        lg: "min-h-[380px] rounded-[30px] p-9",
      },
    },
    defaultVariants: { variant: "pastel", size: "md" },
  },
);

type BlobVariant = "pastel" | "neon";
type BlobSize = "sm" | "md" | "lg";
type BlobStyle = React.CSSProperties &
  Partial<Record<"--mq-blob-a" | "--mq-blob-b" | "--mq-blob-c" | "--mq-blob-intensity", string>>;

export type BlobBackgroundProps = React.ComponentPropsWithRef<"div"> &
  Omit<VariantProps<typeof blobBackgroundVariants>, "variant" | "size"> & {
    variant?: BlobVariant;
    size?: BlobSize;
    height?: React.CSSProperties["minHeight"];
    intensity?: number;
    colors?: readonly [string, string, string];
  };

export function BlobBackground({
  children,
  className,
  colors,
  height,
  intensity = 0.78,
  size = "md",
  style,
  variant = "pastel",
  ...props
}: BlobBackgroundProps) {
  const safeIntensity = Math.min(1, Math.max(0.2, intensity));
  const blobStyle: BlobStyle = {
    ...style,
    minHeight: height ?? style?.minHeight,
    "--mq-blob-intensity": String(safeIntensity),
    ...(colors
      ? { "--mq-blob-a": colors[0], "--mq-blob-b": colors[1], "--mq-blob-c": colors[2] }
      : {}),
  };

  return (
    <div
      {...props}
      className={cn(blobBackgroundVariants({ variant, size }), className)}
      data-material="adaptive"
      style={blobStyle}
    >
      <BlobKeyframes />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-22%] z-0 opacity-[var(--mq-blob-intensity,0.78)] blur-[42px] contrast-125 forced-colors:hidden"
      >
        <span className="absolute left-[4%] top-[5%] size-[58%] rounded-full bg-[var(--mq-blob-a,#f0abfc)] animate-[mq-blob-a_17s_ease-in-out_infinite] motion-reduce:animate-none" />
        <span className="absolute right-[2%] top-[16%] size-[55%] rounded-full bg-[var(--mq-blob-b,#93c5fd)] animate-[mq-blob-b_20s_ease-in-out_infinite] motion-reduce:animate-none" />
        <span className="absolute bottom-[0%] left-[26%] size-[50%] rounded-full bg-[var(--mq-blob-c,#6ee7b7)] animate-[mq-blob-c_23s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[rgba(3,7,18,0.56)] forced-colors:hidden" />
      <div className="relative z-10 flex size-full flex-col">{children}</div>
    </div>
  );
}

export { blobBackgroundVariants };
