"use client";

import { StatusSummary, type StatusService } from "@/registry/ui/status-summary";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Status Summary panel. */

type StatusSummarySize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

/**
 * Realistic statuspage data. Every state appears at least once, so the silhouette,
 * the glyph and the wording of all five can be compared side by side on whichever
 * material is selected. Exactly one row is a link, which keeps the forced
 * `data-focus` ring readable instead of lighting up the whole panel.
 */
const MIXED_SERVICES: readonly StatusService[] = [
  {
    name: "Public API",
    state: "operational",
    detail: "p95 142 ms across all regions",
    href: "#status-public-api",
  },
  {
    name: "Dashboard",
    state: "degraded",
    detail: "Slow chart rendering for workspaces over 40 projects",
  },
  {
    name: "Webhooks",
    state: "partial",
    detail: "Delivery paused in eu-west-1; other regions unaffected",
  },
  {
    name: "Billing",
    state: "maintenance",
    detail: "Scheduled migration, ends 11:00 UTC",
  },
];

/**
 * The `error` state maps to a MAJOR outage — the one case `urgency="auto"`
 * escalates to `role="alert"` with `aria-live="assertive"`.
 */
const OUTAGE_SERVICES: readonly StatusService[] = [
  {
    name: "Public API",
    state: "outage",
    detail: "All requests failing since 09:12 UTC",
    href: "#status-public-api",
  },
  {
    name: "Dashboard",
    state: "outage",
    detail: "Unavailable while the API is down",
  },
  {
    name: "Webhooks",
    state: "partial",
    detail: "Queued for redelivery; nothing has been dropped",
  },
  {
    name: "Asset CDN",
    state: "operational",
    detail: "Serving from cache, no errors observed",
  },
];

function asVariant(value: string): "default" {
  return (VARIANTS.includes(value) ? value : "default") as "default";
}

function asSize(value: string): StatusSummarySize {
  return (SIZES.includes(value) ? value : "md") as StatusSummarySize;
}

export function StatusSummaryPreview({ material, variant, size, state }: PreviewProps) {
  const isOutage = state === "error";

  return (
    <StatusSummary
      data-focus={state === "focus" ? "true" : undefined}
      disabled={state === "disabled"}
      footer={
        <span>
          Incident history and post-mortems are published within 48 hours of
          resolution.
        </span>
      }
      headingLevel={3}
      loading={state === "loading"}
      material={material}
      overall={isOutage ? "outage" : "partial"}
      services={isOutage ? OUTAGE_SERVICES : MIXED_SERVICES}
      size={asSize(size)}
      updatedAt="Updated 3 minutes ago"
      variant={asVariant(variant)}
    />
  );
}
