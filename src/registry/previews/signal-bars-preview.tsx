"use client";

import { SignalBars } from "@/registry/ui/signal-bars";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for Signal Bars.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a reader copies is the component, never the scaffolding
 * used to document it. Every reading below is a fixed literal, so the server and
 * the client draw the same ladder and the statically generated page hydrates
 * without a mismatch.
 */

type SignalVariant = "default";
type SignalSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

/** Four-step wireless quality wording. */
const WIFI_LABELS: readonly string[] = ["Weak", "Fair", "Good", "Excellent"];
/** Five-step cellular wording, so the preview also shows a non-default count. */
const CELL_LABELS: readonly string[] = ["Poor", "Fair", "Good", "Great", "Excellent"];
/** Password strength wording — the same readout doing a very different job. */
const STRENGTH_LABELS: readonly string[] = ["Too weak", "Weak", "Strong", "Very strong"];

function asVariant(value: string): SignalVariant {
  return (VARIANTS.includes(value) ? value : "default") as SignalVariant;
}

function asSize(value: string): SignalSize {
  return (SIZES.includes(value) ? value : "md") as SignalSize;
}

export function SignalBarsPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);

  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const isError = state === "error";

  // The lead row carries the switchable states: scanning (level 0, busy), a
  // dropped link (level 0, error wording) or the settled 3-of-4 reading.
  const wifiLevel = isLoading || isError ? 0 : 3;
  const wifiEmptyLabel = isLoading ? "Scanning" : "No signal";

  return (
    <div
      aria-busy={isLoading || undefined}
      aria-disabled={isDisabled || undefined}
      className={
        isDisabled
          ? "flex flex-col items-start gap-[22px] opacity-55"
          : "flex flex-col items-start gap-[22px]"
      }
    >
      <SignalBars
        data-focus={state === "focus" ? "true" : undefined}
        emptyLabel={wifiEmptyLabel}
        label="Office Wi-Fi"
        labels={WIFI_LABELS}
        level={wifiLevel}
        levels={4}
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />

      <SignalBars
        label="Cellular"
        labels={CELL_LABELS}
        level={5}
        levels={5}
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />

      <SignalBars
        label="Password strength"
        labels={STRENGTH_LABELS}
        level={isError ? 1 : 2}
        levels={4}
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />

      {/* A zero reading is a legitimate state, not a failure: the ladder is all
          track and the meter still announces "Offline, 0 of 4". */}
      <SignalBars
        emptyLabel="Offline"
        label="Guest network"
        labels={WIFI_LABELS}
        level={0}
        levels={4}
        material={material}
        size={resolvedSize}
        variant={resolvedVariant}
      />
    </div>
  );
}
