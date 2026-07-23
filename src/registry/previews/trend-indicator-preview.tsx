"use client";

import { TrendIndicator } from "@/registry/ui/trend-indicator";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Trend Indicator.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a reader copies is the component, never the scaffolding
 * used to document it. Every figure below is a literal, so the server render and
 * the hydrated client render agree exactly — nothing here reads the clock.
 *
 * The board deliberately mixes a plain metric with three INVERTED ones, because
 * that is the pair the component exists for: a falling churn rate, a falling
 * latency and a shrinking backlog are all good news, and each still reads
 * "Down …" in words with the goodness spelled out separately as "improvement".
 */

type TrendVariant = "default";
type TrendSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TrendVariant {
  return (VARIANTS.includes(value) ? value : "default") as TrendVariant;
}

function asSize(value: string): TrendSize {
  return (SIZES.includes(value) ? value : "md") as TrendSize;
}

type Row = {
  id: string;
  name: string;
  value: number;
  direction?: "up" | "down" | "flat";
  format?: "percent" | "absolute";
  unit?: string;
  unitLabel?: string;
  inverted?: boolean;
  comparison: string;
  comparisonLabel: string;
  live?: "off" | "polite";
};

const LABEL_CLASS =
  "w-[124px] shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] " +
  "text-[color:#55554e] dark:text-[color:#b9b7b0]";

const MUTED_CLASS = "text-[color:#55554e] dark:text-[color:#b9b7b0]";

export function TrendIndicatorPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const isFocused = state === "focus";
  const isError = state === "error";

  // Derived purely from `state` — no variable is reassigned from inside a
  // callback, so the React Compiler has nothing to complain about.
  const rows: readonly Row[] = [
    {
      id: "revenue",
      name: "Recurring revenue",
      value: 12.4,
      comparison: "vs last month",
      comparisonLabel: "versus last month",
    },
    {
      id: "churn",
      name: "Churn rate",
      value: -3.1,
      inverted: true,
      comparison: "vs last quarter",
      comparisonLabel: "versus last quarter",
    },
    // The one row the `error` state moves: latency normally drifts down (good),
    // and during an incident it spikes up (bad) while staying an INVERTED
    // metric — the arrow flips, the tone flips with it, and the qualifier word
    // flips too, so the three channels never disagree.
    isError
      ? {
          id: "latency",
          name: "p95 latency",
          value: 214,
          format: "absolute",
          unit: "ms",
          unitLabel: "milliseconds",
          inverted: true,
          comparison: "vs last week",
          comparisonLabel: "versus last week",
          live: "polite",
        }
      : {
          id: "latency",
          name: "p95 latency",
          value: -36,
          format: "absolute",
          unit: "ms",
          unitLabel: "milliseconds",
          inverted: true,
          comparison: "vs last week",
          comparisonLabel: "versus last week",
        },
    {
      id: "seats",
      name: "Seats in use",
      value: 0,
      direction: "flat",
      comparison: "vs last week",
      comparisonLabel: "versus last week",
    },
  ];

  return (
    <div
      // The busy flag lives on the region that stays in the accessibility tree;
      // the covered board below is `inert`, which would take an aria-busy on the
      // same node out of the tree with it.
      aria-busy={isLoading || undefined}
      className="flex w-full max-w-[440px] flex-col gap-[12px]"
    >
      {/* The busy state is announced as WORDS, not as a wash and a pulse. */}
      {isLoading ? (
        <p className={`m-0 text-[11px] font-bold uppercase tracking-[0.08em] ${MUTED_CLASS}`}>
          Refreshing figures…
        </p>
      ) : null}

      <div
        className={
          isDisabled
            ? "relative flex flex-col gap-[10px] opacity-55"
            : "relative flex flex-col gap-[10px]"
        }
        // While the wash covers the board its contents are genuinely removed
        // from the tab order and the accessibility tree, so nobody can land
        // behind the overlay.
        inert={isLoading || undefined}
      >
        {rows.map((row, index) => (
          <div className="flex items-center gap-[12px]" key={row.id}>
            <span className={LABEL_CLASS}>{row.name}</span>
            <TrendIndicator
              comparison={row.comparison}
              comparisonLabel={row.comparisonLabel}
              data-focus={isFocused && index === 0 ? "true" : undefined}
              direction={row.direction}
              format={row.format}
              inverted={row.inverted}
              live={row.live}
              material={material}
              size={resolvedSize}
              unit={row.unit}
              unitLabel={row.unitLabel}
              value={row.value}
              variant={resolvedVariant}
            />
          </div>
        ))}

        {isLoading ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-6px] animate-pulse rounded-[16px] bg-[rgba(252,251,248,0.62)] motion-reduce:animate-none dark:bg-[rgba(18,18,17,0.62)]"
          />
        ) : null}
      </div>

      {/* Inline in running prose, where no visible metric name sits beside the
          delta — so `metric` puts the name back into the accessible label. */}
      <p
        className={`m-0 flex flex-wrap items-center gap-[7px] text-[12px] leading-[1.7] ${MUTED_CLASS}`}
      >
        Support backlog cleared
        <TrendIndicator
          comparison="vs last sprint"
          comparisonLabel="versus last sprint"
          format="absolute"
          inverted
          material={material}
          metric="Support backlog"
          size="sm"
          unit="tickets"
          value={-118}
          variant={resolvedVariant}
        />
        after the triage rota changed.
      </p>
    </div>
  );
}
