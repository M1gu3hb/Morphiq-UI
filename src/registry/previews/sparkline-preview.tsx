"use client";

import { Sparkline } from "@/registry/ui/sparkline";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Sparkline.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree.
 */

type SparklineVariant = "default";
type SparklineSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SparklineVariant {
  return (VARIANTS.includes(value) ? value : "default") as SparklineVariant;
}

function asSize(value: string): SparklineSize {
  return (SIZES.includes(value) ? value : "md") as SparklineSize;
}

// Deterministic series, so the drawn path is identical on server and client.
const REVENUE: readonly number[] = [38, 41, 39, 44, 43, 47, 46, 52];
const LATENCY: readonly number[] = [182, 174, 168, 171, 156, 149, 141, 129];
const STEADY: readonly number[] = [50, 49, 51, 50, 50, 51, 49, 50];

export function SparklinePreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div
      className={
        isDisabled
          ? "flex flex-col items-start gap-[18px] opacity-55"
          : "flex flex-col items-start gap-[18px]"
      }
    >
      <div className="flex items-center gap-[10px]">
        <span className="w-[64px] text-[12px] font-bold uppercase tracking-[0.08em] text-[color:#55554e] dark:text-[color:#b9b7b0]">
          Revenue
        </span>
        <Sparkline
          data={[...REVENUE]}
          label="Revenue"
          material={resolvedMaterial}
          size={resolvedSize}
          unit="k"
          variant={resolvedVariant}
        />
      </div>

      <div className="flex items-center gap-[10px]">
        <span className="w-[64px] text-[12px] font-bold uppercase tracking-[0.08em] text-[color:#55554e] dark:text-[color:#b9b7b0]">
          Latency
        </span>
        <Sparkline
          data={[...LATENCY]}
          label="Latency"
          material={resolvedMaterial}
          size={resolvedSize}
          unit="ms"
          variant={resolvedVariant}
        />
      </div>

      <div className="flex items-center gap-[10px]">
        <span className="w-[64px] text-[12px] font-bold uppercase tracking-[0.08em] text-[color:#55554e] dark:text-[color:#b9b7b0]">
          Steady
        </span>
        <Sparkline
          data={[...STEADY]}
          label="Sessions"
          material={resolvedMaterial}
          showDelta={!isDisabled}
          size={resolvedSize}
          variant={resolvedVariant}
        />
      </div>
    </div>
  );
}
