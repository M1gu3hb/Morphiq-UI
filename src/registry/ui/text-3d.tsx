import * as React from "react";
import { cn } from "@/lib/cn";

export type Text3DVariant = "slab" | "chromatic";
export type Text3DProps = React.ComponentPropsWithRef<"span"> & {
  variant?: Text3DVariant;
  depth?: "soft" | "deep";
};

export function Text3D({
  children,
  className,
  depth = "deep",
  variant = "slab",
  ...props
}: Text3DProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-block [transform:perspective(500px)_rotateX(4deg)_rotateY(-5deg)] transition-[transform] duration-300 ease-out",
        "hover:[transform:perspective(500px)_rotateX(-2deg)_rotateY(5deg)_translate3d(.04em,-.04em,0)]",
        "motion-reduce:![transform:none] motion-reduce:transition-none forced-colors:![transform:none] forced-colors:text-[CanvasText] forced-colors:[text-shadow:none]",
        variant === "slab" && depth === "deep"
          ? "[text-shadow:.025em_.025em_0_#d4d0c7,.05em_.05em_0_#b8b2a7,.075em_.075em_0_#918b82,.1em_.1em_0_#69645d,.14em_.14em_.12em_rgba(0,0,0,.28)]"
          : variant === "slab"
            ? "[text-shadow:.025em_.025em_0_#c8c3ba,.055em_.055em_0_#817c74,.08em_.08em_.08em_rgba(0,0,0,.22)]"
            : depth === "deep"
              ? "[text-shadow:.025em_.025em_0_#22d3ee,.055em_.055em_0_#8b5cf6,.085em_.085em_0_#ec4899,.13em_.13em_.16em_rgba(76,29,149,.5)]"
              : "[text-shadow:.025em_.025em_0_#22d3ee,.055em_.055em_0_#ec4899,.08em_.08em_.1em_rgba(76,29,149,.36)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
