import { Progress } from "@/registry/ui/progress";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Progress component. */

type ProgressVariant = "default" | "striped";
type ProgressSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "striped"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ProgressVariant {
  return (VARIANTS.includes(value) ? value : "default") as ProgressVariant;
}

function asSize(value: string): ProgressSize {
  return (SIZES.includes(value) ? value : "md") as ProgressSize;
}

export function ProgressPreview({ material, variant, size, state }: PreviewProps) {
  const sharedProps = {
    className: "w-[min(360px,100%)]",
    material,
    size: asSize(size),
    variant: asVariant(variant),
  } as const;

  if (state === "loading") {
    return (
      <Progress
        {...sharedProps}
        aria-label="Preparing assets"
        aria-valuetext="Preparing assets"
        label="Preparing assets"
        value={null}
        valueLabel="Working"
      />
    );
  }

  const isError = state === "error";
  const progressValue = isError ? 34 : 64;

  return (
    <Progress
      {...sharedProps}
      aria-disabled={state === "disabled" || undefined}
      aria-label={isError ? "Asset upload interrupted" : "Asset upload"}
      aria-valuetext={isError ? "Upload interrupted at 34 percent" : undefined}
      data-preview-state={state}
      label={isError ? "Upload interrupted" : "Assets uploaded"}
      value={progressValue}
    />
  );
}
