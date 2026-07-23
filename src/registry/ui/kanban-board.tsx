"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Kanban Board
 *
 * Columns of cards where a card MOVES between columns via real buttons and the
 * keyboard — drag is only an optional enhancement, never the sole way to move.
 * Everything is drawn from a `columns: { id, title, cards: { id, title }[] }[]`
 * prop, so copying this file plus `src/lib/cn.ts` reproduces the full widget.
 *
 * This is a material-AGNOSTIC data component: it ships one style built on the
 * adaptive light+dark token vocabulary. `material` is accepted only for catalog
 * parity and reflected on `data-material`; it drives no separate recipe.
 *
 * Accessibility contract (the defining rule of this batch):
 *   - Each column is a labelled list: a real heading names it and an
 *     `<ul role="list">` (named via `aria-labelledby`) holds one
 *     `role="listitem"` card each, so assistive tech reads the board as
 *     structured lists rather than a wall of divs.
 *   - Every card carries real `<button>` move controls whose `aria-label`
 *     spells the destination ("Move 'Ship pipeline' to Done"). The buttons are
 *     in the tab order, so the whole board is operable by keyboard with no drag.
 *     A button is `disabled` at the ends (no "move left" in the first column).
 *   - An `aria-live="polite"` region announces each move ("Moved <card> to
 *     <column>") so a keyboard / screen-reader user hears the result.
 *   - COLOUR is never the sole carrier: a column's card COUNT is shown as text
 *     (a numeric chip for sighted readers plus an sr-only "N cards" in the
 *     heading), the move direction is carried by an arrow ICON *shape* plus the
 *     button's text label, and the drop-target highlight is backed by a border.
 *   - Focus is preserved across a move: after a card jumps columns, focus lands
 *     on the same-direction button in its new column (or the opposite one when
 *     the card now sits at an end), so keyboard operation never dead-ends.
 *   - The card entrance is reduced-motion-safe WITHOUT JS: a card's resting
 *     state is its FINAL position (SSR, no-JS and reduced motion show it), and
 *     the mount rise/fade is expressed with the `starting:` variant
 *     (@starting-style) + a matching `transition-[opacity,translate]` and
 *     `motion-reduce:transition-none`. No count-up / draw via setState-in-effect.
 *   - forced-colors: fills and shadows are discarded, so column / card / button
 *     bounds are kept with `CanvasText` borders, the focus ring becomes
 *     `Highlight`, and the drop target is marked with a `Highlight` border.
 *   - Contrast: card, heading, count and description text all clear 4.5:1 in
 *     both schemes.
 *   - Every id comes from `React.useId()` and every figure is a prop, so nothing
 *     in render depends on the current time or randomness.
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";
type MoveDirection = "left" | "right";

export type KanbanCard = {
  /** Stable key. Also used to track the card as it moves between columns. */
  id: string;
  /** Card label, shown as the card's title and quoted in the move button labels. */
  title: string;
  /** Optional secondary line rendered under the title. */
  description?: string;
};

export type KanbanColumn = {
  /** Stable key and the target id a card is moved to. */
  id: string;
  /** Column name. Rendered as the column heading and named in move-button labels. */
  title: string;
  /** Cards currently in this column, in display order. */
  cards: KanbanCard[];
};

const kanbanVariants = cva(
  [
    "relative isolate w-full text-left",
    // Adaptive light+dark token vocabulary. One agnostic style.
    "[--mq-col-bg:#f6f5f1] [--mq-col-brd:rgba(23,24,23,0.10)] [--mq-col-head:#33322d]",
    "[--mq-count-bg:rgba(23,24,23,0.06)] [--mq-count-text:#55554e]",
    "[--mq-card-bg:#ffffff] [--mq-card-brd:rgba(23,24,23,0.10)] [--mq-card-text:#1c1c19] [--mq-card-desc:#55554e]",
    "[--mq-card-hover:rgba(23,24,23,0.02)] [--mq-card-brd-hover:rgba(23,24,23,0.22)]",
    "[--mq-btn-bg:rgba(23,24,23,0.04)] [--mq-btn-text:#33322d] [--mq-btn-hover:rgba(23,24,23,0.10)] [--mq-btn-brd:rgba(23,24,23,0.12)]",
    "[--mq-accent:#3f5bd9] [--mq-drop:rgba(63,91,217,0.10)] [--mq-ring:#171817]",
    "dark:[--mq-col-bg:#1e1e22] dark:[--mq-col-brd:rgba(255,255,255,0.10)] dark:[--mq-col-head:#e9e7e1]",
    "dark:[--mq-count-bg:rgba(255,255,255,0.10)] dark:[--mq-count-text:#b9b7b0]",
    "dark:[--mq-card-bg:#2a2a30] dark:[--mq-card-brd:rgba(255,255,255,0.12)] dark:[--mq-card-text:#f1efe9] dark:[--mq-card-desc:#b9b7b0]",
    "dark:[--mq-card-hover:rgba(255,255,255,0.04)] dark:[--mq-card-brd-hover:rgba(255,255,255,0.26)]",
    "dark:[--mq-btn-bg:rgba(255,255,255,0.08)] dark:[--mq-btn-text:#e9e7e1] dark:[--mq-btn-hover:rgba(255,255,255,0.16)] dark:[--mq-btn-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-accent:#8ea2ff] dark:[--mq-drop:rgba(142,162,255,0.16)] dark:[--mq-ring:#f1efe9]",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "[--mq-col-w:200px] [--mq-gap:10px] [--mq-col-pad:10px] [--mq-card-pad:8px] [--mq-fs:12px] [--mq-radius:12px] [--mq-btn:26px] [--mq-ic:14px]",
        md: "[--mq-col-w:240px] [--mq-gap:14px] [--mq-col-pad:12px] [--mq-card-pad:11px] [--mq-fs:13px] [--mq-radius:14px] [--mq-btn:30px] [--mq-ic:16px]",
        lg: "[--mq-col-w:280px] [--mq-gap:18px] [--mq-col-pad:14px] [--mq-card-pad:14px] [--mq-fs:14px] [--mq-radius:16px] [--mq-btn:34px] [--mq-ic:18px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const COLUMN_BASE = cn(
  "flex w-[var(--mq-col-w,240px)] shrink-0 flex-col gap-[var(--mq-col-pad,12px)]",
  "rounded-[var(--mq-radius,14px)] border p-[var(--mq-col-pad,12px)]",
  "[background-color:var(--mq-col-bg,#f6f5f1)] [border-color:var(--mq-col-brd,rgba(23,24,23,0.10))]",
  "forced-colors:border-[CanvasText] forced-colors:[background-color:Canvas]",
  "transition-[border-color,background-color] duration-150 ease-out motion-reduce:transition-none",
);

const COLUMN_DROP = cn(
  "[background-color:var(--mq-drop,rgba(63,91,217,0.10))] [border-color:var(--mq-accent,#3f5bd9)]",
  "forced-colors:border-[Highlight]",
);

const CARD_BASE = cn(
  "group/card flex items-start justify-between gap-[8px]",
  "rounded-[calc(var(--mq-radius,14px)-4px)] border p-[var(--mq-card-pad,11px)]",
  "[background-color:var(--mq-card-bg,#ffffff)] [border-color:var(--mq-card-brd,rgba(23,24,23,0.10))]",
  "[box-shadow:0_1px_2px_rgba(20,20,18,0.06)]",
  "[color:var(--mq-card-text,#1c1c19)] forced-colors:text-[CanvasText]",
  "forced-colors:border-[CanvasText] forced-colors:shadow-none",
  "hover:[background-color:var(--mq-card-hover,rgba(23,24,23,0.02))] hover:[border-color:var(--mq-card-brd-hover,rgba(23,24,23,0.22))]",
);

// Resting is the FINAL position; the mount rise/fade is a @starting-style
// entrance on the standalone `translate` property (named in the transition, so
// no transform-trap) plus opacity. Reduced motion lands straight on rest.
const CARD_MOTION_ON = cn(
  "opacity-100 [translate:0px_0px]",
  "starting:opacity-0 starting:[translate:0px_5px]",
  "transition-[opacity,translate,background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
);

const CARD_MOTION_OFF = "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none";

const MOVE_BUTTON = cn(
  "inline-flex size-[var(--mq-btn,30px)] shrink-0 items-center justify-center",
  "rounded-[calc(var(--mq-radius,14px)-6px)] border cursor-pointer",
  "[background-color:var(--mq-btn-bg,rgba(23,24,23,0.04))] [border-color:var(--mq-btn-brd,rgba(23,24,23,0.12))]",
  "[color:var(--mq-btn-text,#33322d)]",
  "transition-colors duration-150 ease-out motion-reduce:transition-none",
  "hover:[background-color:var(--mq-btn-hover,rgba(23,24,23,0.10))]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--mq-ring,#171817)]",
  "forced-colors:border-[CanvasText] forced-colors:text-[ButtonText] forced-colors:focus-visible:outline-[Highlight]",
  "disabled:cursor-not-allowed disabled:opacity-40",
);

export type KanbanBoardProps = Omit<React.ComponentPropsWithRef<"div">, "children"> &
  Omit<VariantProps<typeof kanbanVariants>, "variant" | "size"> & {
    /**
     * The columns to render, in display order. This is the INITIAL data: the
     * board is uncontrolled and manages moves in its own state, so changing this
     * prop after mount does not reset the board — remount it (a `key`) to reset.
     */
    columns: KanbanColumn[];
    /** Called with the next columns array after every move (button, key or drop). */
    onColumnsChange?: (columns: KanbanColumn[]) => void;
    /** Enable optional native drag-and-drop. Buttons/keyboard always work regardless. */
    allowDrag?: boolean;
    /** Rise/fade cards in on mount. Reduced motion always lands on the final position. */
    animate?: boolean;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
  };

/**
 * The board. Uncontrolled: the initial `columns` seed React state, and each move
 * produces a new immutable columns array. Ids come from `useId`, so nothing in
 * render is time-dependent or random.
 */
export function KanbanBoard({
  allowDrag = true,
  animate = true,
  className,
  columns,
  material = "adaptive",
  onColumnsChange,
  size = "md",
  variant = "default",
  ...props
}: KanbanBoardProps) {
  const baseId = React.useId();
  const [board, setBoard] = React.useState<KanbanColumn[]>(() => columns);
  const [liveMessage, setLiveMessage] = React.useState("");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);

  // Focus is restored after a move by looking up the destination button in this
  // map; the ref-callbacks below keep it in sync with the mounted DOM nodes.
  const buttonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = React.useRef<{ cardId: string; dir: MoveDirection } | null>(null);

  const registerButton = React.useCallback(
    (cardId: string, dir: MoveDirection, node: HTMLButtonElement | null) => {
      const key = `${cardId}::${dir}`;
      if (node) buttonRefs.current.set(key, node);
      else buttonRefs.current.delete(key);
    },
    [],
  );

  // After the board re-renders from a move, land focus on the intended button so
  // keyboard operation continues from where the card went.
  React.useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    buttonRefs.current.get(`${target.cardId}::${target.dir}`)?.focus();
  }, [board]);

  const moveCard = React.useCallback(
    (cardId: string, targetColumnId: string, focusDir?: MoveDirection) => {
      const sourceIndex = board.findIndex((col) => col.cards.some((card) => card.id === cardId));
      if (sourceIndex === -1) return;
      const targetIndex = board.findIndex((col) => col.id === targetColumnId);
      if (targetIndex === -1 || targetIndex === sourceIndex) return;
      const card = board[sourceIndex].cards.find((candidate) => candidate.id === cardId);
      if (!card) return;

      // Immutable: new column objects and card arrays, never a mutation in place.
      const next = board.map((col, index) => {
        if (index === sourceIndex) {
          return { ...col, cards: col.cards.filter((candidate) => candidate.id !== cardId) };
        }
        if (index === targetIndex) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });

      setBoard(next);
      onColumnsChange?.(next);
      setLiveMessage(`Moved ${card.title} to ${board[targetIndex].title}`);

      if (focusDir) {
        const lastIndex = board.length - 1;
        pendingFocus.current = {
          cardId,
          dir:
            focusDir === "left"
              ? targetIndex > 0
                ? "left"
                : "right"
              : targetIndex < lastIndex
                ? "right"
                : "left",
        };
      } else {
        pendingFocus.current = null;
      }
    },
    [board, onColumnsChange],
  );

  const lastIndex = board.length - 1;

  return (
    <div
      {...props}
      className={cn(kanbanVariants({ variant, size }), className)}
      data-material={material}
    >
      {/* Authoritative move announcer. Kept sr-only; the visible move is the card. */}
      <div aria-atomic="true" aria-live="polite" className={SR_ONLY} role="status">
        {liveMessage}
      </div>

      <div className="flex w-full items-start gap-[var(--mq-gap,14px)] overflow-x-auto pb-[6px] text-[length:var(--mq-fs,13px)]">
        {board.map((column, columnIndex) => {
          const headingId = `${baseId}-col-${columnIndex}`;
          const count = column.cards.length;
          const isDragOver = allowDrag && draggingId != null && dragOverCol === column.id;

          return (
            <div
              key={column.id}
              className={cn(COLUMN_BASE, isDragOver && COLUMN_DROP)}
              data-dragover={isDragOver ? "true" : undefined}
              onDragOver={
                allowDrag
                  ? (event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (dragOverCol !== column.id) setDragOverCol(column.id);
                    }
                  : undefined
              }
              onDrop={
                allowDrag
                  ? (event) => {
                      event.preventDefault();
                      const id = draggingId ?? event.dataTransfer.getData("text/plain");
                      if (id) moveCard(id, column.id);
                      setDraggingId(null);
                      setDragOverCol(null);
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-[8px] px-[2px]">
                <h3
                  className="m-0 min-w-0 flex-1 truncate text-[length:var(--mq-fs,13px)] font-bold leading-tight [color:var(--mq-col-head,#33322d)] forced-colors:text-[CanvasText]"
                  id={headingId}
                >
                  <span>{column.title}</span>
                  <span className={SR_ONLY}>
                    , {count} {count === 1 ? "card" : "cards"}
                  </span>
                </h3>
                {/* Count as TEXT for sighted readers; the sr-only span above voices it. */}
                <span
                  aria-hidden="true"
                  className="inline-flex min-w-[1.6em] shrink-0 items-center justify-center rounded-full px-[7px] py-[1px] text-[length:0.82em] font-bold tabular-nums [background-color:var(--mq-count-bg,rgba(23,24,23,0.06))] [color:var(--mq-count-text,#55554e)] forced-colors:border forced-colors:border-[CanvasText] forced-colors:text-[CanvasText] forced-colors:[background-color:Canvas]"
                >
                  {count}
                </span>
              </div>

              <ul
                aria-labelledby={headingId}
                className="m-0 flex list-none flex-col gap-[var(--mq-col-pad,12px)] p-0"
                role="list"
              >
                {count === 0 ? (
                  <li className="rounded-[calc(var(--mq-radius,14px)-4px)] border border-dashed [border-color:var(--mq-card-brd,rgba(23,24,23,0.10))] px-[var(--mq-card-pad,11px)] py-[calc(var(--mq-card-pad,11px)+3px)] text-center text-[length:0.85em] [color:var(--mq-card-desc,#55554e)] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]">
                    No cards
                  </li>
                ) : (
                  column.cards.map((card) => {
                    const canLeft = columnIndex > 0;
                    const canRight = columnIndex < lastIndex;
                    const leftColumn = canLeft ? board[columnIndex - 1] : undefined;
                    const rightColumn = canRight ? board[columnIndex + 1] : undefined;

                    return (
                      <li
                        key={card.id}
                        className={cn(
                          CARD_BASE,
                          animate ? CARD_MOTION_ON : CARD_MOTION_OFF,
                          allowDrag &&
                            "[cursor:grab] active:[cursor:grabbing] data-[dragging=true]:opacity-50",
                        )}
                        data-dragging={draggingId === card.id ? "true" : undefined}
                        draggable={allowDrag || undefined}
                        onDragEnd={
                          allowDrag
                            ? () => {
                                setDraggingId(null);
                                setDragOverCol(null);
                              }
                            : undefined
                        }
                        onDragStart={
                          allowDrag
                            ? (event) => {
                                setDraggingId(card.id);
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", card.id);
                              }
                            : undefined
                        }
                        role="listitem"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="m-0 break-words text-[length:var(--mq-fs,13px)] font-semibold leading-snug">
                            {card.title}
                          </p>
                          {card.description ? (
                            <p className="m-0 mt-[3px] break-words text-[length:0.85em] leading-snug [color:var(--mq-card-desc,#55554e)] forced-colors:text-[CanvasText]">
                              {card.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 items-center gap-[4px]">
                          <MoveButton
                            card={card}
                            dir="left"
                            enabled={canLeft}
                            onMove={moveCard}
                            registerButton={registerButton}
                            targetColumn={leftColumn}
                          />
                          <MoveButton
                            card={card}
                            dir="right"
                            enabled={canRight}
                            onMove={moveCard}
                            registerButton={registerButton}
                            targetColumn={rightColumn}
                          />
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type MoveButtonProps = {
  card: KanbanCard;
  dir: MoveDirection;
  enabled: boolean;
  targetColumn: KanbanColumn | undefined;
  onMove: (cardId: string, targetColumnId: string, focusDir?: MoveDirection) => void;
  registerButton: (cardId: string, dir: MoveDirection, node: HTMLButtonElement | null) => void;
};

/**
 * One move control. The direction is carried by the arrow ICON shape *and* the
 * text label, never colour alone; the label names the destination column so a
 * screen reader hears exactly where the card is going. Disabled at the ends.
 */
function MoveButton({ card, dir, enabled, targetColumn, onMove, registerButton }: MoveButtonProps) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  const label =
    enabled && targetColumn ? `Move '${card.title}' to ${targetColumn.title}` : `Move '${card.title}' ${dir}`;

  return (
    <button
      aria-label={label}
      className={MOVE_BUTTON}
      disabled={!enabled}
      onClick={() => {
        if (enabled && targetColumn) onMove(card.id, targetColumn.id, dir);
      }}
      ref={(node) => registerButton(card.id, dir, node)}
      type="button"
    >
      <Icon
        aria-hidden="true"
        className="size-[var(--mq-ic,16px)] shrink-0 forced-colors:[color:ButtonText]"
        strokeWidth={2.25}
      />
    </button>
  );
}

export { kanbanVariants };
