"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Data Table
 *
 * A sortable table. Self-contained by design: every recipe lives in this file.
 * It does not read `:root` custom properties and it does not depend on any class
 * from a global stylesheet, so copying this file (plus `src/lib/cn.ts`) into
 * another project reproduces the full look.
 *
 * This is a data component in the "data" category and it is deliberately
 * material-agnostic: it ships a single adaptive style whose palette follows the
 * colour scheme (light + dark). `material` is accepted only for catalog parity
 * and reflected on `data-material`; it is never a visual axis.
 *
 * Accessibility is native, not bolted on. The graphic IS a real `<table>`, so
 * the accessible equivalent and the visual are the same object: a `<caption>`
 * names it, `<th scope="col">`/`<th scope="row">` associate headers, and every
 * sortable column exposes the live `aria-sort` state on its header cell. The
 * sort control is a real `<button>`, keyboard-operable, whose direction is shown
 * by an arrow/chevron *shape* (never colour) paired with `aria-sort`.
 *
 * Local theming knobs (each used with a literal fallback at its use site):
 *
 *   --mq-surface     table background
 *   --mq-head        header cell background (opaque, so a sticky header covers rows)
 *   --mq-head-text   header text colour
 *   --mq-text        body text colour
 *   --mq-muted       secondary text (visible caption)
 *   --mq-zebra       even-row background
 *   --mq-hover       row / sort-button hover tint
 *   --mq-rule        hairline colour for borders and row dividers
 *   --mq-ring        focus ring colour
 *   --mq-radius      outer corner radius (set by size)
 *   --mq-font        body font size (set by size)
 *   --mq-cell-x      horizontal cell padding (set by size)
 *   --mq-cell-y      vertical body-cell padding (set by size)
 *   --mq-head-y      vertical header-cell padding (set by size)
 *
 * Contrast contract: body text, header text and the visible caption all measure
 * at or above 4.5:1 against their surfaces in both colour schemes, and the sort
 * glyph is a shape, so its meaning never rests on contrast alone.
 */

/** An `sr-only` utility, inlined so the component needs no global stylesheet. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type ColumnAlign = "start" | "end" | "center";

/** Direction reported to assistive tech on a sortable header cell. */
export type SortDirection = "none" | "ascending" | "descending";

/** Active sort. `null` means "unsorted" — rows fall back to their input order. */
type SortState = { columnId: string; direction: "ascending" | "descending" };

export type DataTableColumn<Row> = {
  /** Stable key. Also the object key read from a row when `getValue` is absent. */
  id: string;
  /** Visible column header. */
  header: React.ReactNode;
  /**
   * Accessible column name for the sort button's label. Falls back to `header`
   * when it is a string, then to `id` — used only for sortable columns.
   */
  label?: string;
  /** Renders a keyboard-operable sort button in the header. */
  sortable?: boolean;
  /** Compare as numbers, and right-align by default. Otherwise localeCompare. */
  numeric?: boolean;
  /** Cell alignment. Defaults to `end` for numeric columns, else `start`. */
  align?: ColumnAlign;
  /** Render this column's body cells as `<th scope="row">` (a row header). */
  rowHeader?: boolean;
  /** Pull the sortable value from a row. Defaults to `row[id]` coerced safely. */
  getValue?: (row: Row) => string | number;
  /** Render the visible cell. Defaults to the `getValue` result as text. */
  renderCell?: (row: Row) => React.ReactNode;
};

export type DataTableProps<Row extends Record<string, unknown>> = Omit<
  React.ComponentPropsWithRef<"table">,
  "children"
> & {
  /** Column definitions, in display order. */
  columns: ReadonlyArray<DataTableColumn<Row>>;
  /** Row data. Order is preserved when unsorted and used as the sort tie-break. */
  rows: ReadonlyArray<Row>;
  /** Table caption. Always rendered as a real `<caption>`; hidden unless visible. */
  caption: React.ReactNode;
  /** Show the caption above the table instead of only exposing it to AT. */
  captionVisible?: boolean;
  /** Pin the header row with `position: sticky`; its background stays opaque. */
  stickyHeader?: boolean;
  /** Initial sort. Omit for the natural input order. */
  defaultSort?: SortState | null;
  /** Stable React key per row. Defaults to the row's original index. */
  getRowKey?: (row: Row, index: number) => React.Key;
  /** Accepted for catalog parity; reflected on `data-material` only. */
  material?: MaterialSlug;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  /** Class for the inner `<table>`; `className` targets the scroll wrapper. */
  tableClassName?: string;
};

/**
 * Tokens + size scale live on the scroll wrapper so custom properties inherit
 * down to the table and every cell without a context provider. Being agnostic,
 * there is a single style with a light palette and its `dark:` counterpart.
 */
const dataTableVariants = cva(
  [
    "w-full overflow-x-auto",
    "rounded-[var(--mq-radius,14px)] border border-[var(--mq-rule,rgba(23,24,23,0.12))]",
    // Shadows and fills are discarded in forced-colors mode, so the outer bound
    // is kept by a system-coloured border.
    "forced-colors:border-[CanvasText]",
    // Adaptive palette — light.
    "[--mq-surface:#ffffff] [--mq-head:#f5f4f0] [--mq-head-text:#33322d] [--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-zebra:rgba(23,24,23,0.035)] [--mq-hover:rgba(23,24,23,0.06)] [--mq-rule:rgba(23,24,23,0.12)] [--mq-ring:#171817]",
    // Adaptive palette — dark. The surface flips together with the text, so the
    // opaque header still covers rows behind a sticky header.
    "dark:[--mq-surface:#1b1b1f] dark:[--mq-head:#26262b] dark:[--mq-head-text:#f1efe9] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b7b5ae] dark:[--mq-zebra:rgba(255,255,255,0.04)] dark:[--mq-hover:rgba(255,255,255,0.08)] dark:[--mq-rule:rgba(255,255,255,0.14)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "[--mq-radius:12px] [--mq-font:12px] [--mq-cell-x:10px] [--mq-cell-y:6px] [--mq-head-y:7px]",
        md: "[--mq-radius:14px] [--mq-font:13px] [--mq-cell-x:14px] [--mq-cell-y:9px] [--mq-head-y:10px]",
        lg: "[--mq-radius:18px] [--mq-font:14px] [--mq-cell-x:16px] [--mq-cell-y:12px] [--mq-head-y:12px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const HEAD_PAD = "px-[var(--mq-cell-x,14px)] py-[var(--mq-head-y,10px)]";

const HEAD_CELL = cn(
  "border-b border-[var(--mq-rule,rgba(23,24,23,0.12))] forced-colors:border-[CanvasText]",
  "[background-color:var(--mq-head,#f5f4f0)] forced-colors:[background-color:Canvas]",
  "text-[color:var(--mq-head-text,#33322d)] forced-colors:text-[CanvasText]",
  "font-bold whitespace-nowrap",
);

const SORT_BUTTON = cn(
  "inline-flex w-full items-center gap-[6px] rounded-[inherit]",
  HEAD_PAD,
  "text-[color:inherit] font-bold cursor-pointer",
  // Only the background changes on hover, so `transition-colors` animates
  // something real rather than a phantom property.
  "transition-colors duration-150 ease-out motion-reduce:transition-none",
  "hover:[background-color:var(--mq-hover,rgba(23,24,23,0.06))]",
  // Inset offset so the ring is not clipped by the wrapper's overflow.
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-visible:outline-[Highlight]",
);

const BODY_CELL = cn(
  "border-b border-[var(--mq-rule,rgba(23,24,23,0.12))] forced-colors:border-[CanvasText]",
  "px-[var(--mq-cell-x,14px)] py-[var(--mq-cell-y,9px)] align-middle",
  "text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]",
);

const BODY_ROW = cn(
  "transition-colors duration-150 ease-out motion-reduce:transition-none",
  "even:[background-color:var(--mq-zebra,rgba(23,24,23,0.035))]",
  "hover:[background-color:var(--mq-hover,rgba(23,24,23,0.06))]",
  // The wrapper already draws the bottom bound, so drop the last row's divider
  // to avoid a doubled hairline.
  "last:[&>td]:border-b-0 last:[&>th]:border-b-0",
);

function alignClass(align: ColumnAlign): string {
  if (align === "end") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function justifyClass(align: ColumnAlign): string {
  if (align === "end") return "justify-end";
  if (align === "center") return "justify-center";
  return "justify-start";
}

function resolveAlign<Row>(column: DataTableColumn<Row>): ColumnAlign {
  if (column.align) return column.align;
  return column.numeric ? "end" : "start";
}

/** Safe default accessor: numbers and strings pass through, anything else coerces. */
function readValue<Row extends Record<string, unknown>>(
  row: Row,
  column: DataTableColumn<Row>,
): string | number {
  if (column.getValue) return column.getValue(row);
  const raw = row[column.id];
  if (typeof raw === "number" || typeof raw === "string") return raw;
  return raw == null ? "" : String(raw);
}

function renderContent<Row extends Record<string, unknown>>(
  row: Row,
  column: DataTableColumn<Row>,
): React.ReactNode {
  if (column.renderCell) return column.renderCell(row);
  return readValue(row, column);
}

/**
 * Deterministic comparator. Numeric columns compare numerically (NaN sorts last
 * in both directions before the tie-break is applied); everything else uses
 * `localeCompare`. `direction` (+1 asc / -1 desc) is applied to the meaningful
 * comparison INSIDE this, so the NaN-last ordering stays fixed instead of being
 * flipped to NaN-first when the caller multiplied the whole result by -1.
 */
function compareValues(
  a: string | number,
  b: string | number,
  numeric: boolean | undefined,
  direction: number,
): number {
  const asNumbers = numeric ?? (typeof a === "number" && typeof b === "number");
  if (asNumbers) {
    const na = typeof a === "number" ? a : Number(a);
    const nb = typeof b === "number" ? b : Number(b);
    const aNaN = Number.isNaN(na);
    const bNaN = Number.isNaN(nb);
    if (aNaN && bNaN) return 0;
    if (aNaN) return 1;
    if (bNaN) return -1;
    return (na - nb) * direction;
  }
  return String(a).localeCompare(String(b)) * direction;
}

/** asc -> desc -> unsorted, then back to asc; switching columns starts at asc. */
function nextSort(current: SortState | null, columnId: string): SortState | null {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "ascending" };
  }
  if (current.direction === "ascending") return { columnId, direction: "descending" };
  return null;
}

export function DataTable<Row extends Record<string, unknown>>({
  caption,
  captionVisible = false,
  className,
  columns,
  defaultSort = null,
  getRowKey,
  material = "adaptive",
  rows,
  size = "md",
  stickyHeader = false,
  tableClassName,
  variant = "default",
  ...rest
}: DataTableProps<Row>) {
  const [sort, setSort] = React.useState<SortState | null>(defaultSort);

  // Sort is derived, never a copy of the rows in state, so it cannot drift out
  // of sync with the data. The tie-break on original index makes it stable.
  const orderedRows = React.useMemo(() => {
    const decorated = rows.map((row, index) => ({ row, index }));
    if (!sort) return decorated;
    const column = columns.find((candidate) => candidate.id === sort.columnId);
    if (!column) return decorated;
    const direction = sort.direction === "ascending" ? 1 : -1;
    return [...decorated].sort((left, right) => {
      const comparison = compareValues(
        readValue(left.row, column),
        readValue(right.row, column),
        column.numeric,
        direction,
      );
      // Direction is already applied inside compareValues (keeping NaN last), so
      // the tie-break restores the original order without being flipped.
      return comparison !== 0 ? comparison : left.index - right.index;
    });
  }, [rows, columns, sort]);

  return (
    <div
      className={cn(dataTableVariants({ variant, size }), className)}
      data-material={material}
    >
      <table
        {...rest}
        className={cn(
          "w-full border-separate border-spacing-0 text-left",
          "text-[length:var(--mq-font,13px)] text-[color:var(--mq-text,#1c1c19)]",
          "[background-color:var(--mq-surface,#ffffff)]",
          "forced-colors:[background-color:Canvas] forced-colors:text-[CanvasText]",
          tableClassName,
        )}
      >
        <caption
          className={cn(
            "[caption-side:top]",
            captionVisible
              ? cn(
                  HEAD_PAD,
                  "text-left text-[length:11px] leading-[1.4] font-semibold tracking-[0.01em]",
                  "text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]",
                )
              : SR_ONLY,
          )}
        >
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const align = resolveAlign(column);
              const isActive = sort?.columnId === column.id;
              const direction: SortDirection = isActive
                ? (sort as SortState).direction
                : "none";

              if (!column.sortable) {
                return (
                  <th
                    key={column.id}
                    className={cn(HEAD_CELL, HEAD_PAD, alignClass(align), stickyHeader && "sticky top-0 z-10")}
                    scope="col"
                  >
                    {column.header}
                  </th>
                );
              }

              const columnName =
                column.label ??
                (typeof column.header === "string" ? column.header : column.id);
              const stateText =
                direction === "ascending"
                  ? "sorted ascending"
                  : direction === "descending"
                    ? "sorted descending"
                    : "not sorted";
              const Glyph =
                direction === "ascending"
                  ? ArrowUp
                  : direction === "descending"
                    ? ArrowDown
                    : ChevronsUpDown;

              return (
                <th
                  key={column.id}
                  aria-sort={direction}
                  className={cn(HEAD_CELL, "p-0", stickyHeader && "sticky top-0 z-10")}
                  scope="col"
                >
                  <button
                    aria-label={`Sort by ${columnName}, ${stateText}`}
                    className={cn(SORT_BUTTON, justifyClass(align))}
                    onClick={() => setSort((previous) => nextSort(previous, column.id))}
                    type="button"
                  >
                    <span>{column.header}</span>
                    {/* Decorative: the direction is carried by `aria-sort` and by
                        the glyph's own shape (up vs down vs neutral), so the icon
                        is hidden and never the sole colour cue. */}
                    <Glyph
                      aria-hidden="true"
                      className={cn(
                        "size-[14px] shrink-0 forced-colors:[stroke:CanvasText]",
                        direction === "none" ? "opacity-45" : "opacity-100",
                      )}
                      strokeWidth={2.5}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {orderedRows.map(({ row, index }) => {
            const rowKey = getRowKey ? getRowKey(row, index) : index;
            return (
              <tr key={rowKey} className={BODY_ROW}>
                {columns.map((column) => {
                  const align = resolveAlign(column);
                  const content = renderContent(row, column);
                  const numeric = column.numeric ? "tabular-nums" : "";
                  if (column.rowHeader) {
                    return (
                      <th
                        key={column.id}
                        className={cn(BODY_CELL, alignClass(align), numeric, "font-semibold")}
                        scope="row"
                      >
                        {content}
                      </th>
                    );
                  }
                  return (
                    <td key={column.id} className={cn(BODY_CELL, alignClass(align), numeric)}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { dataTableVariants };
