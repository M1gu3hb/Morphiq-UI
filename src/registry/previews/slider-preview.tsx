"use client";

import { Slider } from "@/registry/ui/slider";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for single-value and range Sliders. */

type SliderVariant = "default" | "ticks";
type SliderSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "ticks"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SliderVariant {
  return (VARIANTS.includes(value) ? value : "default") as SliderVariant;
}

function asSize(value: string): SliderSize {
  return (SIZES.includes(value) ? value : "md") as SliderSize;
}

export function SliderPreview({ material, variant, size, state }: PreviewProps) {
  const disabled = state === "disabled";
  const sharedProps = {
    "aria-busy": state === "loading" || undefined,
    "aria-invalid": state === "error" || undefined,
    "data-focus": state === "focus" ? "true" : undefined,
    disabled,
    material,
    size: asSize(size),
    variant: asVariant(variant),
  } as const;

  return (
    <div className="grid w-[min(380px,100%)] gap-9 py-4" data-slider-preview="">
      <div className="grid gap-3">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase">Level</span>
        <Slider
          {...sharedProps}
          defaultValue={[40]}
          max={100}
          min={0}
          showValue
          step={5}
          thumbLabels={["Level"]}
        />
      </div>
      <div className="grid gap-3">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase">
          Preferred range
        </span>
        <Slider
          {...sharedProps}
          defaultValue={[25, 75]}
          max={100}
          min={0}
          minStepsBetweenThumbs={2}
          step={5}
          thumbLabels={["Minimum preferred value", "Maximum preferred value"]}
        />
      </div>
    </div>
  );
}
