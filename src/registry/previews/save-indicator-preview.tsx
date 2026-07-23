"use client";

import * as React from "react";
import { SaveIndicator, type SaveIndicatorStatus } from "@/registry/ui/save-indicator";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Save Indicator.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The catalog `variant` axis is a single "default"; the interesting axis is the
 * `status` prop, so the featured chip sits in a mock document header doing the
 * job it was built for, and the remaining states are lined up underneath — that
 * side-by-side is the point, because it is what shows the label and the glyph
 * shape carrying the meaning without relying on colour.
 *
 * `savedAt` is seeded from an effect rather than during render: reading the
 * clock while rendering is exactly the hydration bug this component is designed
 * around, and the preview has to demonstrate the safe pattern, not break it.
 *
 * `loading` shows the saving state, `error` and `focus` show the error state
 * (the only one with a real retry button to focus), and `disabled` falls back to
 * idle — a save chip has no disabled state, and inventing one would document
 * something it cannot do.
 */

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];
const STATUSES: readonly SaveIndicatorStatus[] = ["idle", "saving", "saved", "error"];

type SaveIndicatorSize = "sm" | "md" | "lg";

/** Two minutes, so the seeded timestamp reads as a believable "2 minutes ago". */
const SEEDED_AGE_MS = 120000;
/** How long the simulated retry stays in flight before it reports success. */
const RETRY_DURATION_MS = 1400;

function asVariant(value: string): string {
  return VARIANTS.includes(value) ? value : "default";
}

function asSize(value: string): SaveIndicatorSize {
  return (SIZES.includes(value) ? value : "md") as SaveIndicatorSize;
}

/** A simulated retry, tagged with the base state it was started from. */
type RetryRun = { from: SaveIndicatorStatus; status: SaveIndicatorStatus };

/** Which state the featured chip should demonstrate for the selected preview state. */
function featuredStatus(state: PreviewProps["state"]): SaveIndicatorStatus {
  if (state === "loading") return "saving";
  if (state === "error" || state === "focus") return "error";
  if (state === "disabled") return "idle";
  return "saved";
}

export function SaveIndicatorPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  // The simulated retry remembers which base state it started from, so switching
  // the state selector discards it purely — no effect, no stale override.
  const [retry, setRetry] = React.useState<RetryRun | null>(null);
  const retryTimer = React.useRef<number | null>(null);
  const base = featuredStatus(state);

  // Deterministic first render (no timestamp), then a real relative phrase once
  // the browser has a clock to read. `setState` lands in a timer callback, never
  // in the effect body.
  React.useEffect(() => {
    const seed = window.setTimeout(() => setSavedAt(Date.now() - SEEDED_AGE_MS), 0);
    return () => window.clearTimeout(seed);
  }, []);

  React.useEffect(() => {
    return () => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, []);

  const handleRetry = () => {
    setRetry({ from: base, status: "saving" });
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    retryTimer.current = window.setTimeout(
      () => setRetry({ from: base, status: "saved" }),
      RETRY_DURATION_MS,
    );
  };

  const featured = retry !== null && retry.from === base ? retry.status : base;
  const others = STATUSES.filter((status) => status !== featured);

  return (
    <div
      className="flex w-full max-w-[460px] flex-col gap-[16px]"
      data-variant={resolvedVariant}
      key={material}
    >
      <div className="flex flex-wrap items-center justify-between gap-[10px] rounded-[16px] border border-black/10 bg-white/55 px-[14px] py-[11px] dark:border-white/15 dark:bg-white/[0.05]">
        <span className="text-[13px] leading-[1.3] font-extrabold tracking-[-0.01em] text-[#1c1c19] dark:text-[#f1efe9]">
          Q3 launch brief
        </span>
        <SaveIndicator
          data-focus={state === "focus" ? "true" : undefined}
          material={material}
          onRetry={handleRetry}
          savedAt={savedAt}
          savedAtLabel="14:32"
          size={resolvedSize}
          status={featured}
        />
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        {others.map((status) => (
          <SaveIndicator
            key={status}
            material={material}
            savedAt={status === "saving" ? null : savedAt}
            size={resolvedSize}
            status={status}
            urgency="off"
          />
        ))}
      </div>
    </div>
  );
}
