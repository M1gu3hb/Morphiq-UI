"use client";

import { LoadingBar } from "@/registry/ui/loading-bar";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Loading Bar.
 *
 * The real component is normally pinned to the top of the viewport during a
 * route transition, which would be invisible in a small docs panel — so it is
 * rendered inline here (`fixed={false}`) at the top of a faux page frame, where
 * the indeterminate creep is on display while the behaviour stays intact.
 *
 * `focus`, `disabled` and `error` fall through to the default render: a route
 * loading bar has none of those states, and inventing them would document
 * something the component cannot do.
 */

type LoadingBarVariant = "default";
type LoadingBarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): LoadingBarVariant {
  return (VARIANTS.includes(value) ? value : "default") as LoadingBarVariant;
}

function asSize(value: string): LoadingBarSize {
  return (SIZES.includes(value) ? value : "md") as LoadingBarSize;
}

export function LoadingBarPreview({ material, variant, size }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  return (
    <div className="w-full max-w-[420px]">
      {/* A faux page frame so the top-pinned bar reads in context, inline. */}
      <div className="relative isolate overflow-hidden rounded-[16px] border border-[rgba(23,24,23,0.14)] bg-[#ffffff] shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] dark:border-[rgba(255,255,255,0.16)] dark:bg-[#232327]">
        {/* Remounts on material change so the creep restarts cleanly per option. */}
        <LoadingBar
          key={material}
          fixed={false}
          material={material}
          size={resolvedSize}
          variant={resolvedVariant}
        />
        <div className="flex items-center gap-[8px] border-b border-[rgba(23,24,23,0.08)] px-[14px] py-[10px] dark:border-[rgba(255,255,255,0.10)]">
          <span className="size-[9px] rounded-full bg-[rgba(23,24,23,0.18)] dark:bg-[rgba(255,255,255,0.24)]" />
          <span className="size-[9px] rounded-full bg-[rgba(23,24,23,0.18)] dark:bg-[rgba(255,255,255,0.24)]" />
          <span className="size-[9px] rounded-full bg-[rgba(23,24,23,0.18)] dark:bg-[rgba(255,255,255,0.24)]" />
          <span className="ml-[8px] text-[11px] font-bold tracking-[-0.01em] text-[#55554e] dark:text-[#b9b7b0]">
            navigating…
          </span>
        </div>
        <div className="space-y-[8px] px-[14px] py-[16px]">
          <span className="block h-[10px] w-[70%] rounded-full bg-[rgba(23,24,23,0.10)] dark:bg-[rgba(255,255,255,0.12)]" />
          <span className="block h-[10px] w-[92%] rounded-full bg-[rgba(23,24,23,0.08)] dark:bg-[rgba(255,255,255,0.09)]" />
          <span className="block h-[10px] w-[55%] rounded-full bg-[rgba(23,24,23,0.08)] dark:bg-[rgba(255,255,255,0.09)]" />
        </div>
      </div>
    </div>
  );
}
