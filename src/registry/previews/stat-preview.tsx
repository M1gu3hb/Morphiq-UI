import { Stat } from "@/registry/ui/stat";
import type { PreviewProps } from "@/registry/schema";

type StatVariant = "default" | "outline";
type StatSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "outline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): StatVariant {
  return (VARIANTS.includes(value) ? value : "default") as StatVariant;
}

function asSize(value: string): StatSize {
  return (SIZES.includes(value) ? value : "md") as StatSize;
}

function ActivityIcon() {
  return (
    <svg fill="none" viewBox="0 0 20 20">
      <path
        d="M2.5 10h3l2-5 4 10 2-5h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function StatPreview({ material, variant, size, state }: PreviewProps) {
  const isNegative = state === "error";

  return (
    <Stat
      aria-busy={state === "loading" || undefined}
      aria-disabled={state === "disabled" || undefined}
      caption={isNegative ? "vs. previous week" : "vs. previous month"}
      className={state === "disabled" ? "w-[min(330px,100%)] opacity-60" : "w-[min(330px,100%)]"}
      delta={isNegative ? "-3.8%" : "+12.4%"}
      icon={<ActivityIcon />}
      label="Active projects"
      material={material}
      size={asSize(size)}
      trend={isNegative ? "negative" : "positive"}
      value={state === "loading" ? "—" : "24"}
      variant={asVariant(variant)}
    />
  );
}
