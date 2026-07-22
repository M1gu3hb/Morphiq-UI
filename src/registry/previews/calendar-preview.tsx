"use client";

import { Calendar } from "@/registry/ui/calendar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Calendar.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * All dates are FIXED constructor calls (explicit args) so the preview is
 * deterministic — server, client and reduced-motion renders agree, with no
 * dependency on the wall clock.
 */

type CalendarVariant = "default";
type CalendarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): CalendarVariant {
  return (VARIANTS.includes(value) ? value : "default") as CalendarVariant;
}

function asSize(value: string): CalendarSize {
  return (SIZES.includes(value) ? value : "md") as CalendarSize;
}

// Deterministic month/selection/today — never Date.now() or Math.random().
const DEMO_MONTH = new Date(2026, 6, 1); // July 2026
const DEMO_SELECTED = new Date(2026, 6, 15);
const DEMO_TODAY = new Date(2026, 6, 22);

export function CalendarPreview({ material, variant, size }: PreviewProps) {
  // `material` is agnostic here: it is accepted for catalog parity and only
  // reflected on `data-material`. `key` resets the internal month/selection
  // state when the reader switches material so the demo always starts fresh.
  const styleSlug: StyleSlug = material;

  return (
    <Calendar
      defaultMonth={DEMO_MONTH}
      defaultSelected={DEMO_SELECTED}
      key={styleSlug}
      material={material}
      size={asSize(size)}
      today={DEMO_TODAY}
      variant={asVariant(variant)}
    />
  );
}
