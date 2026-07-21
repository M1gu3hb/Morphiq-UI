import { Steps, type StepItem } from "@/registry/ui/steps";
import type { PreviewProps } from "@/registry/schema";

type StepsVariant = "default" | "numbered";
type StepsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "numbered"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const SAMPLE_STEPS: readonly StepItem[] = [
  { id: "brief", label: "Brief", state: "completed" },
  { id: "structure", label: "Structure", state: "completed" },
  { id: "motion", label: "Motion", state: "current" },
  { id: "publish", label: "Publish", state: "pending" },
];

function asVariant(value: string): StepsVariant {
  return (VARIANTS.includes(value) ? value : "default") as StepsVariant;
}

function asSize(value: string): StepsSize {
  return (SIZES.includes(value) ? value : "md") as StepsSize;
}

export function StepsPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <Steps
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      aria-label="Animation workflow progress"
      className={cnState(state)}
      material={material}
      size={asSize(size)}
      steps={SAMPLE_STEPS}
      variant={asVariant(variant)}
    />
  );
}

function cnState(state: PreviewProps["state"]): string | undefined {
  if (state === "disabled") return "opacity-60";
  if (state === "loading") return "cursor-wait";
  return undefined;
}
