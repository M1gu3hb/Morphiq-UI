"use client";

import * as React from "react";
import { SegmentedNav, type SegmentedNavItem } from "@/registry/ui/segmented-nav";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Segmented Nav.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * The demo runs the control CONTROLLED against a real set of `role="tabpanel"`
 * regions, because that is the arrangement `aria-controls` exists for. Every
 * panel stays mounted and the unselected ones carry `hidden`, so each segment's
 * `aria-controls` always points at a region that genuinely exists — the failure
 * mode the component's docs warn about is exactly "wire it while the panel is
 * not there". Click a segment, or focus one and press the arrow keys, and both
 * the chip and the caption below follow.
 *
 * Every `PreviewState` handled here maps to something a Segmented Nav genuinely
 * has: `focus` forces the ring onto the selected segment through the component's
 * own `data-focus` hook, `disabled` disables every segment (and dims the chip
 * with them) through the real `disabled` prop, `loading` marks the control busy.
 * Anything else falls through to the default interactive render.
 */

type SegmentedNavVariant = "default";
type SegmentedNavSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SegmentedNavVariant {
  return (VARIANTS.includes(value) ? value : "default") as SegmentedNavVariant;
}

function asSize(value: string): SegmentedNavSize {
  return (SIZES.includes(value) ? value : "md") as SegmentedNavSize;
}

type View = {
  id: string;
  label: string;
  /** One-line summary of the view, shown in that segment's panel. */
  caption: string;
  disabled?: boolean;
};

/** Copy differs per material so each recipe is shown doing real work. */
const VIEWS: Record<StyleSlug, readonly View[]> = {
  clay: [
    { id: "board", label: "Board", caption: "12 cards across 4 columns" },
    { id: "timeline", label: "Timeline", caption: "Kiln run scheduled for Thursday" },
    { id: "files", label: "Files", caption: "38 glaze tests, 2 shared folders" },
  ],
  glass: [
    { id: "day", label: "Day", caption: "3 events, next at 14:30" },
    { id: "week", label: "Week", caption: "17 events, 2 days fully free" },
    { id: "month", label: "Month", caption: "May — 4 deadlines, 1 trip" },
  ],
  skeuo: [
    { id: "input", label: "Input", caption: "Ch 1–8 · gain staged, −18 dBFS" },
    { id: "bus", label: "Bus", caption: "Drum bus glue at 2.4:1" },
    { id: "master", label: "Master", caption: "Limiter −0.8 dB ceiling" },
  ],
  adaptive: [
    { id: "overview", label: "Overview", caption: "Usage up 12% week over week" },
    { id: "activity", label: "Activity", caption: "48 events in the last 24 hours" },
    { id: "members", label: "Members", caption: "9 seats used of 12" },
    // Locked on this plan: shows roving navigation stepping over a disabled
    // segment rather than landing on it.
    { id: "billing", label: "Billing", caption: "Available on the Team plan", disabled: true },
  ],
};

const captionClass = [
  "max-w-full truncate rounded-[8px] px-[4px] text-[length:12px] leading-[1.5]",
  "text-[color:currentColor] opacity-75",
  "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-visible:outline-[Highlight]",
].join(" ");

function SegmentedNavDemo({ material, variant, size, state }: PreviewProps) {
  const views = VIEWS[material];
  const uid = React.useId();
  const panelId = (id: string) => `${uid}-${id}`;
  const [value, setValue] = React.useState(views[0].id);

  const items: SegmentedNavItem[] = views.map((view) => ({
    id: view.id,
    label: view.label,
    controls: panelId(view.id),
    disabled: view.disabled,
  }));

  return (
    <div className="flex w-full flex-col items-center gap-[10px]">
      <SegmentedNav
        aria-busy={state === "loading" || undefined}
        aria-label="Workspace views"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        items={items}
        material={material}
        onValueChange={setValue}
        size={asSize(size)}
        value={value}
        variant={asVariant(variant)}
      />
      {views.map((view) => (
        <div
          aria-label={view.label}
          className={captionClass}
          hidden={view.id !== value}
          id={panelId(view.id)}
          key={view.id}
          role="tabpanel"
          // The panels hold no controls of their own, so they are focusable —
          // otherwise a keyboard user could never reach the text a segment just
          // revealed. `hidden` keeps the other three out of the tab order.
          tabIndex={0}
        >
          {view.caption}
        </div>
      ))}
    </div>
  );
}

export function SegmentedNavPreview(props: PreviewProps) {
  // Remount when the material changes, and only then. Each material names its
  // own views, so without this the controlled `value` would keep an id that
  // matches none of the new segments and the control would render with nothing
  // selected.
  return <SegmentedNavDemo {...props} key={props.material} />;
}
