"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/registry/ui/data-table";
import type { PreviewProps } from "@/registry/schema";
import { cn } from "@/lib/cn";

/**
 * Documentation preview for the Data Table.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed inline so the render is deterministic (no
 * Date.now / random), which keeps SSR and hydration stable.
 */

type DataTableVariant = "default";
type DataTableSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): DataTableVariant {
  return (VARIANTS.includes(value) ? value : "default") as DataTableVariant;
}

function asSize(value: string): DataTableSize {
  return (SIZES.includes(value) ? value : "md") as DataTableSize;
}

type Region = {
  name: string;
  market: string;
  users: number;
  growth: number;
};

const REGIONS: readonly Region[] = [
  { name: "Aurora", market: "North", users: 18240, growth: 12.4 },
  { name: "Basalt", market: "South", users: 9310, growth: -3.1 },
  { name: "Cinder", market: "East", users: 22105, growth: 5.8 },
  { name: "Delta", market: "West", users: 14780, growth: -0.6 },
  { name: "Ember", market: "North", users: 30412, growth: 21.0 },
  { name: "Flint", market: "East", users: 7640, growth: 2.3 },
];

/**
 * The growth column pairs its colour with an arrow icon AND a signed value, so
 * meaning never rests on colour alone — it survives forced-colors and reads for
 * colour-blind users. Both hues clear 4.5:1 against the table surface in their
 * own scheme.
 */
function GrowthCell({ value }: { value: number }) {
  const up = value >= 0;
  const Arrow = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-[4px] font-semibold tabular-nums",
        up ? "text-[#0f7a3d] dark:text-[#4ade80]" : "text-[#b3261e] dark:text-[#f87171]",
      )}
    >
      <Arrow
        aria-hidden="true"
        className="size-[13px] forced-colors:[stroke:CanvasText]"
        strokeWidth={2.5}
      />
      {`${up ? "+" : "−"}${Math.abs(value).toFixed(1)}%`}
    </span>
  );
}

const COLUMNS: ReadonlyArray<DataTableColumn<Region>> = [
  { id: "name", header: "Region", sortable: true, rowHeader: true },
  { id: "market", header: "Market", sortable: true },
  { id: "users", header: "Active users", sortable: true, numeric: true },
  {
    id: "growth",
    header: "MoM growth",
    label: "month-over-month growth",
    sortable: true,
    numeric: true,
    renderCell: (row) => <GrowthCell value={row.growth} />,
  },
];

export function DataTablePreview({ material, variant, size }: PreviewProps) {
  return (
    <div className="w-[min(520px,100%)]">
      <DataTable
        caption="Regional activity by active users"
        captionVisible
        columns={COLUMNS}
        defaultSort={{ columnId: "users", direction: "descending" }}
        getRowKey={(row) => row.name}
        material={material}
        rows={REGIONS}
        size={asSize(size)}
        stickyHeader
        variant={asVariant(variant)}
      />
    </div>
  );
}
