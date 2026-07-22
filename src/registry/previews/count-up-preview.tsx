"use client";

import { CountUp } from "@/registry/ui/count-up";
import type { PreviewProps } from "@/registry/schema";

type CountUpVariant = "integer" | "decimal";
type CountUpSize = "inherit";
const VARIANTS: readonly string[] = ["integer", "decimal"];
const SIZES: readonly string[] = ["inherit"];

function asVariant(value: string): CountUpVariant {
  return (VARIANTS.includes(value) ? value : "integer") as CountUpVariant;
}
function asSize(value: string): CountUpSize {
  return (SIZES.includes(value) ? value : "inherit") as CountUpSize;
}

export function CountUpPreview({ material, variant, size, state }: PreviewProps) {
  const resolved = asVariant(variant);
  return (
    <CountUp
      animate={state !== "disabled"}
      className="text-[clamp(34px,7vw,72px)]/[1] font-black tracking-[-0.06em] text-[#171817] dark:text-[#f1efe9]"
      data-material={material}
      data-size={asSize(size)}
      decimals={resolved === "decimal" ? 1 : 0}
      prefix={resolved === "decimal" ? "$" : ""}
      suffix={resolved === "integer" ? "+" : "M"}
      value={resolved === "decimal" ? 98.6 : 12840}
    />
  );
}
