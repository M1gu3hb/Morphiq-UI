"use client";

import { CountdownTimer } from "@/registry/ui/countdown-timer";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Countdown Timer. */

type CountdownVariant = "default";
type CountdownSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A release countdown: long enough that the days plate carries real weight. */
const LAUNCH_MS = 2 * DAY + 6 * HOUR + 41 * MINUTE + 12 * SECOND;
/** A retry backoff: short enough that the seconds visibly roll. */
const RETRY_MS = 45 * SECOND;

function asVariant(value: string): CountdownVariant {
  return (VARIANTS.includes(value) ? value : "default") as CountdownVariant;
}

function asSize(value: string): CountdownSize {
  return (SIZES.includes(value) ? value : "md") as CountdownSize;
}

export function CountdownTimerPreview({ material, variant, size, state }: PreviewProps) {
  // `error` shows the terminal state a countdown actually reaches: the window
  // has closed. Zero duration renders the completed panel immediately.
  if (state === "error") {
    return (
      <CountdownTimer
        completeLabel="Offer expired"
        durationMs={0}
        label="Flash sale · 40% off"
        material={material}
        maxUnit="hours"
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    );
  }

  // `loading` reads as a backoff clock — the case where a countdown really is
  // the progress indicator for something still in flight.
  if (state === "loading") {
    return (
      <CountdownTimer
        controls
        durationMs={RETRY_MS}
        label="Retrying deployment in"
        material={material}
        maxUnit="minutes"
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    );
  }

  return (
    <CountdownTimer
      controls
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      durationMs={LAUNCH_MS}
      label="Morphiq 2.0 ships in"
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
