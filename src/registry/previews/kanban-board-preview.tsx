"use client";

import { KanbanBoard, type KanbanColumn } from "@/registry/ui/kanban-board";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Kanban Board.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. The board is uncontrolled, so it is keyed on `material` — each
 * material names its own columns, and without a remount the board would keep the
 * cards it was first mounted with when the material switched. Data is fixed, so
 * SSR and the client agree.
 */

type KanbanVariant = "default";
type KanbanSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): KanbanVariant {
  return (VARIANTS.includes(value) ? value : "default") as KanbanVariant;
}

function asSize(value: string): KanbanSize {
  return (SIZES.includes(value) ? value : "md") as KanbanSize;
}

// Deterministic columns per material, so each recipe is shown doing real work
// and server / client render the identical board.
const BOARDS: Record<StyleSlug, KanbanColumn[]> = {
  clay: [
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "clay-1", title: "Draft release notes", description: "Cover the clay refresh" },
        { id: "clay-2", title: "Audit icon set" },
      ],
    },
    { id: "doing", title: "In Progress", cards: [{ id: "clay-3", title: "Ship deploy pipeline" }] },
    { id: "done", title: "Done", cards: [{ id: "clay-4", title: "Merge feature branch" }] },
  ],
  glass: [
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        { id: "glass-1", title: "Collect frosted-panel refs" },
        { id: "glass-2", title: "Tune blur budget", description: "Keep under 12px" },
      ],
    },
    { id: "review", title: "In Review", cards: [{ id: "glass-3", title: "Contrast pass on labels" }] },
    { id: "shipped", title: "Shipped", cards: [{ id: "glass-4", title: "Publish token docs" }] },
  ],
  skeuo: [
    {
      id: "queued",
      title: "Queued",
      cards: [
        { id: "skeuo-1", title: "Record channel A" },
        { id: "skeuo-2", title: "Calibrate meters", description: "Peak at -6 dB" },
      ],
    },
    { id: "mixing", title: "Mixing", cards: [{ id: "skeuo-3", title: "Balance the bus" }] },
    { id: "mastered", title: "Mastered", cards: [{ id: "skeuo-4", title: "Bounce final take" }] },
  ],
  adaptive: [
    {
      id: "planned",
      title: "Planned",
      cards: [
        { id: "adaptive-1", title: "Reconcile March invoices" },
        { id: "adaptive-2", title: "Draft Q2 forecast", description: "Tracking 8% under plan" },
      ],
    },
    { id: "active", title: "In Progress", cards: [{ id: "adaptive-3", title: "Approve two POs" }] },
    { id: "closed", title: "Closed", cards: [{ id: "adaptive-4", title: "Send renewal notice" }] },
  ],
};

export function KanbanBoardPreview({ material, variant, size, state }: PreviewProps) {
  const columns = BOARDS[material];
  const isDisabled = state === "disabled";

  return (
    <div
      className={
        isDisabled
          ? "w-[min(760px,100%)] pointer-events-none opacity-55"
          : "w-[min(760px,100%)]"
      }
    >
      <KanbanBoard
        aria-label="Release pipeline board"
        columns={columns}
        key={material}
        material={material}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
