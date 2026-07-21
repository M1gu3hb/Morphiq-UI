"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Tabs.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Every `PreviewState` maps to something a Tabs genuinely has, so nothing here
 * is a stand-in: `focus` forces the ring on the active trigger, `disabled`
 * disables the whole tablist, and `loading` shows the panel busy — the state a
 * tabbed surface really does enter while its content is being fetched.
 */

type TabsVariant = "default" | "pill" | "underline";
type TabsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "pill", "underline"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TabsVariant {
  return (VARIANTS.includes(value) ? value : "default") as TabsVariant;
}

function asSize(value: string): TabsSize {
  return (SIZES.includes(value) ? value : "md") as TabsSize;
}

type Panel = { value: string; label: string; body: string };

/** Copy differs per material so each recipe is shown doing real work. */
const PANELS: Record<StyleSlug, Panel[]> = {
  clay: [
    { value: "overview", label: "Overview", body: "Rolling out to 12% of traffic. Nothing has regressed since the last checkpoint." },
    { value: "activity", label: "Activity", body: "Four deploys today, all green. The last one shipped 4 minutes ago." },
    { value: "settings", label: "Settings", body: "Auto-promote is on once a build holds for thirty minutes." },
  ],
  glass: [
    { value: "session", label: "Session", body: "Notifications are held until 18:42. Two collaborators are still editing." },
    { value: "people", label: "People", body: "Ana is presenting. Three others are watching without audio." },
    { value: "notes", label: "Notes", body: "Shared notes sync to everyone in the room as you type." },
  ],
  skeuo: [
    { value: "channel", label: "Channel A", body: "Signal is clean across the range. The limiter has not engaged this take." },
    { value: "routing", label: "Routing", body: "Input 3 feeds the bus. Phantom power stays off on this channel." },
    { value: "meters", label: "Meters", body: "Peak holds at -6 dB with headroom to spare." },
  ],
  adaptive: [
    { value: "summary", label: "Summary", body: "Spend is tracking 8% under plan. Three invoices await approval." },
    { value: "invoices", label: "Invoices", body: "Two are due this week; none are overdue." },
    { value: "team", label: "Team", body: "Seat usage is 18 of 25. Billing renews on the 3rd." },
  ],
};

export function TabsPreview({ material, variant, size, state }: PreviewProps) {
  const panels = PANELS[material];
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";

  return (
    <Tabs
      className="w-[min(360px,100%)]"
      defaultValue={panels[0].value}
      material={material}
      size={asSize(size)}
      variant={asVariant(variant)}
    >
      <TabsList>
        {panels.map((panel, index) => (
          <TabsTrigger
            data-focus={state === "focus" && index === 0 ? "true" : undefined}
            disabled={isDisabled}
            key={panel.value}
            value={panel.value}
          >
            {panel.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((panel) => (
        <TabsContent key={panel.value} value={panel.value}>
          {isLoading ? (
            <p aria-busy="true" className="m-0 opacity-70">
              Loading {panel.label.toLowerCase()}…
            </p>
          ) : (
            <p className="m-0">{panel.body}</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
