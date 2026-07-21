"use client";

import { Button } from "@/registry/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Tooltip. */

type TooltipVariant = "default" | "inverted";
type TooltipSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "inverted"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TooltipVariant {
  return (VARIANTS.includes(value) ? value : "default") as TooltipVariant;
}

function asSize(value: string): TooltipSize {
  return (SIZES.includes(value) ? value : "md") as TooltipSize;
}

export function TooltipPreview({ material, variant, size, state }: PreviewProps) {
  const treatment = asVariant(variant);
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const isError = state === "error";
  const copy = isLoading
    ? "Loading token details…"
    : isError
      ? "Token details are unavailable"
      : treatment === "inverted"
        ? "Copy the variable reference"
        : "View token details";

  return (
    <div className="flex min-h-[150px] items-end justify-center pb-4" data-tooltip-preview="">
      <TooltipProvider delayDuration={0}>
        <Tooltip defaultOpen delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              aria-busy={isLoading || undefined}
              aria-invalid={isError || undefined}
              data-focus={state === "focus" ? "true" : undefined}
              disabled={isDisabled}
              material={material}
              size="sm"
            >
              Inspect token
            </Button>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            material={material}
            portalled={false}
            side="top"
            sideOffset={10}
            size={asSize(size)}
            variant={treatment}
          >
            {copy}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
