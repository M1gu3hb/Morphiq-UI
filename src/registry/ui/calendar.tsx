"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Calendar
 *
 * A selectable month grid built on the WAI-ARIA date-grid pattern. Self-contained
 * by design: the single adaptive style lives in this file, it does not read
 * `:root` custom properties and it does not depend on any class from a global
 * stylesheet, so copying this file (plus `src/lib/cn.ts`) reproduces the full
 * look.
 *
 * Material-agnostic. There is one style — the adaptive light+dark vocabulary — so
 * `material` is accepted only for catalog parity and reflected on `data-material`;
 * it is never a styling axis. Theming knobs are local custom properties declared
 * on the root, each read with a literal fallback:
 *
 *   --mq-surface   container background
 *   --mq-text      primary foreground (month heading, in-month day numbers)
 *   --mq-muted     weekday headers and out-of-month day numbers
 *   --mq-border    container / grid border
 *   --mq-ring      focus ring
 *   --mq-hover     hover wash on days and nav buttons
 *   --mq-sel-bg    selected day fill
 *   --mq-sel-text  selected day foreground
 *
 * Accessibility contract:
 *   - The grid is a real `<table role="grid">` with `role="row"` rows and
 *     `role="gridcell"` cells; weekday headers are `<th scope="col">` carrying a
 *     visually-hidden full day name.
 *   - Roving tabindex: exactly one day is tabbable. Arrow keys move ±1 / ±7 days,
 *     Home/End jump to the week's start/end, PageUp/PageDown change month, and
 *     Enter/Space select (native button activation).
 *   - State never rides on colour alone: today carries `aria-current="date"` plus
 *     a ring (a shape), the selected day carries `aria-selected` plus a filled,
 *     bolded treatment, and out-of-month days are `disabled` (non-tabbable) and
 *     dimmed to a still-legible muted colour.
 *   - Each day's accessible name is the full date; an sr-only summary states the
 *     visible month and the current selection and describes the key model.
 *   - SSR-safe: the grid is derived from `new Date(year, month, day)` with
 *     explicit args only. `today`, `month`/`selected` are props — the component
 *     never reads the wall clock, so server, no-JS and reduced-motion renders all
 *     land on the correct, final state.
 */

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

type CalendarVariant = "default";
type CalendarSize = "sm" | "md" | "lg";

/** Visually-hidden utility, inlined so no global stylesheet is required. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

const WEEKDAYS = [
  { full: "Sunday", abbr: "Sun" },
  { full: "Monday", abbr: "Mon" },
  { full: "Tuesday", abbr: "Tue" },
  { full: "Wednesday", abbr: "Wed" },
  { full: "Thursday", abbr: "Thu" },
  { full: "Friday", abbr: "Fri" },
  { full: "Saturday", abbr: "Sat" },
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * Deterministic fallback month used only when no month/selection/today prop is
 * supplied. Explicit args, so it never reads the wall clock (that would be a
 * hydration mismatch); a real caller always passes a month.
 */
const FALLBACK_MONTH = new Date(2025, 0, 1);

// --- Pure date helpers. Every constructor call takes EXPLICIT args, so all are
// --- deterministic and SSR-safe; JS normalises day/month overflow for us. -----
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function addMonths(d: Date, n: number): Date {
  const anchor = new Date(d.getFullYear(), d.getMonth() + n, 1);
  // Clamp the day to the target month's length (e.g. Jan 31 → Feb 28/29).
  const daysInTarget = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  return new Date(anchor.getFullYear(), anchor.getMonth(), Math.min(d.getDate(), daysInTarget));
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function toKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function fullLabel(d: Date): string {
  return `${WEEKDAYS[d.getDay()].full}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const calendarVariants = cva(
  [
    "relative isolate inline-block text-left align-top",
    // Adaptive palette: light values, then dark overrides — the surface is
    // opaque and flips together with its text, so switching on the colour scheme
    // is safe.
    "[--mq-surface:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e]",
    "[--mq-border:rgba(23,24,23,0.14)] [--mq-ring:#171817] [--mq-hover:rgba(23,24,23,0.06)]",
    "[--mq-sel-bg:#1c1c19] [--mq-sel-text:#ffffff]",
    "[--mq-shadow:0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)]",
    "dark:[--mq-surface:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0]",
    "dark:[--mq-border:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] dark:[--mq-hover:rgba(255,255,255,0.10)]",
    "dark:[--mq-sel-bg:#f1efe9] dark:[--mq-sel-text:#1c1c19]",
    "dark:[--mq-shadow:0_1px_2px_rgba(0,0,0,0.5),0_10px_24px_rgba(0,0,0,0.4)]",
    "bg-[var(--mq-surface,#ffffff)] text-[color:var(--mq-text,#1c1c19)]",
    "border border-[var(--mq-border,rgba(23,24,23,0.14))]",
    "rounded-[var(--mq-radius,18px)] p-[var(--mq-pad,16px)]",
    "shadow-[var(--mq-shadow,0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06))]",
    // Forced colours discard the fill and shadow; a system border keeps the
    // component's bounds, and system fore/background keep it legible.
    "forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:border-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "[--mq-radius:14px] [--mq-pad:12px] [--mq-cell:32px] [--mq-day-radius:10px] [--mq-day:12px] [--mq-head:10px] [--mq-heading:14px] [--mq-gap:1px]",
        md: "[--mq-radius:18px] [--mq-pad:16px] [--mq-cell:38px] [--mq-day-radius:12px] [--mq-day:13px] [--mq-head:11px] [--mq-heading:15px] [--mq-gap:2px]",
        lg: "[--mq-radius:22px] [--mq-pad:20px] [--mq-cell:44px] [--mq-day-radius:14px] [--mq-day:15px] [--mq-head:12px] [--mq-heading:17px] [--mq-gap:3px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const NAV_BTN = [
  "inline-flex items-center justify-center rounded-[10px] border border-transparent",
  "size-[calc(var(--mq-heading,15px)_+_18px)]",
  "text-[color:var(--mq-text,#1c1c19)] text-[length:var(--mq-heading,15px)]",
  // Only the background moves on hover — nothing phantom in the list.
  "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-hover,rgba(23,24,23,0.06))]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
].join(" ");

const DAY_BTN = [
  "inline-flex items-center justify-center",
  "size-[var(--mq-cell,38px)] rounded-[var(--mq-day-radius,12px)] border border-transparent",
  "text-[length:var(--mq-day,13px)] font-semibold leading-none tabular-nums",
  "text-[color:var(--mq-text,#1c1c19)]",
  // Background and text colour are the only things that move across hover /
  // selected, so the transition names exactly those two — no transform, no
  // phantom property. Reduced motion drops it and the state is simply present.
  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-hover,rgba(23,24,23,0.06))]",
  "focus-visible:relative focus-visible:z-10",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)]",
  "forced-colors:focus-visible:outline-[Highlight]",
  // Out-of-month days: dimmed to a still-legible muted colour and inert.
  "data-[outside]:text-[color:var(--mq-muted,#55554e)] data-[outside]:font-normal",
  "disabled:cursor-default disabled:hover:bg-transparent",
  // Today: a ring (shape, not colour) drawn in currentColor so it stays visible
  // whether the cell is plain or selected; the number is also bolded.
  "data-[today]:shadow-[inset_0_0_0_2px_currentColor] data-[today]:font-bold",
  "forced-colors:data-[today]:shadow-none forced-colors:data-[today]:border-[CanvasText]",
  // Selected: a filled, bolded treatment paired with aria-selected on the cell.
  "data-[selected]:bg-[var(--mq-sel-bg,#1c1c19)] data-[selected]:text-[color:var(--mq-sel-text,#ffffff)] data-[selected]:font-bold",
  "data-[selected]:hover:bg-[var(--mq-sel-bg,#1c1c19)]",
  "forced-colors:data-[selected]:bg-[Highlight] forced-colors:data-[selected]:text-[HighlightText]",
].join(" ");

export type CalendarProps = Omit<React.ComponentPropsWithRef<"div">, "onSelect"> & {
  /** Agnostic component: `material` is accepted for catalog parity and only
   *  reflected on `data-material`. There is a single adaptive style. */
  material?: MaterialSlug;
  variant?: CalendarVariant;
  size?: CalendarSize;
  /** Controlled displayed month (any day within it). */
  month?: Date;
  /** Initial displayed month for the uncontrolled case. */
  defaultMonth?: Date;
  /** Controlled selected day. `null` clears the selection. */
  selected?: Date | null;
  /** Initial selected day for the uncontrolled case. */
  defaultSelected?: Date | null;
  /** The day to flag with `aria-current="date"`. Omit for no "today" marker. */
  today?: Date;
  onSelect?: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
};

export function Calendar({
  className,
  defaultMonth,
  defaultSelected,
  material = "adaptive",
  month,
  onMonthChange,
  onSelect,
  selected,
  size = "md",
  today,
  variant = "default",
  ...props
}: CalendarProps) {
  const reactId = React.useId();
  const headingId = `${reactId}-heading`;
  const summaryId = `${reactId}-summary`;

  const isMonthControlled = month !== undefined;
  const isSelectedControlled = selected !== undefined;

  // The month the grid is derived from, resolved once for the initial state.
  const initialMonth = startOfMonth(
    month ?? defaultMonth ?? selected ?? defaultSelected ?? today ?? FALLBACK_MONTH,
  );

  const [monthState, setMonthState] = React.useState<Date>(initialMonth);
  const [selectedState, setSelectedState] = React.useState<Date | null>(defaultSelected ?? null);
  const [focusedState, setFocusedState] = React.useState<Date>(() => {
    const seed = selected ?? defaultSelected;
    if (seed && isSameMonth(seed, initialMonth)) return seed;
    if (today && isSameMonth(today, initialMonth)) return today;
    return initialMonth;
  });

  const monthValue = startOfMonth(isMonthControlled ? month : monthState);
  const selectedValue = isSelectedControlled ? selected : selectedState;

  // Roving-tabindex target: the focused day when it is in the visible month,
  // otherwise a sensible in-month fallback (the selection, then today, then the
  // first of the month).
  const focusedValue = React.useMemo(() => {
    if (isSameMonth(focusedState, monthValue)) return focusedState;
    if (selectedValue && isSameMonth(selectedValue, monthValue)) return selectedValue;
    if (today && isSameMonth(today, monthValue)) return today;
    return monthValue;
  }, [focusedState, monthValue, selectedValue, today]);
  const focusedKey = toKey(focusedValue);

  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
  // Only move DOM focus after an explicit keyboard navigation — never on mount
  // (that would steal focus) and never on header-button month changes (the
  // pointer stays on the button the user clicked).
  const shouldFocusRef = React.useRef(false);

  React.useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    dayRefs.current.get(focusedKey)?.focus();
  }, [focusedKey]);

  const commitMonth = React.useCallback(
    (next: Date) => {
      const normalized = startOfMonth(next);
      if (!isMonthControlled) setMonthState(normalized);
      onMonthChange?.(normalized);
    },
    [isMonthControlled, onMonthChange],
  );

  const moveFocusTo = React.useCallback(
    (next: Date) => {
      shouldFocusRef.current = true;
      setFocusedState(next);
      if (!isSameMonth(next, monthValue)) commitMonth(next);
    },
    [commitMonth, monthValue],
  );

  const goToMonth = React.useCallback(
    (delta: number) => {
      const next = addMonths(monthValue, delta);
      commitMonth(next);
      // Keep the tabbable cell inside the new month without stealing focus.
      shouldFocusRef.current = false;
      setFocusedState(startOfMonth(next));
    },
    [commitMonth, monthValue],
  );

  const handleSelect = React.useCallback(
    (day: Date) => {
      if (!isSelectedControlled) setSelectedState(day);
      onSelect?.(day);
      setFocusedState(day);
    },
    [isSelectedControlled, onSelect],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTableElement>) => {
      // Leave browser and OS shortcuts alone.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      let next: Date | null = null;
      switch (event.key) {
        case "ArrowLeft":
          next = addDays(focusedValue, -1);
          break;
        case "ArrowRight":
          next = addDays(focusedValue, 1);
          break;
        case "ArrowUp":
          next = addDays(focusedValue, -7);
          break;
        case "ArrowDown":
          next = addDays(focusedValue, 7);
          break;
        case "Home":
          next = addDays(focusedValue, -focusedValue.getDay());
          break;
        case "End":
          next = addDays(focusedValue, 6 - focusedValue.getDay());
          break;
        case "PageUp":
          next = addMonths(focusedValue, -1);
          break;
        case "PageDown":
          next = addMonths(focusedValue, 1);
          break;
        default:
          // Enter / Space fall through to native `<button>` activation, which
          // fires the day's onClick — so selection lives in one place.
          return;
      }

      event.preventDefault();
      moveFocusTo(next);
    },
    [focusedValue, moveFocusTo],
  );

  // Build a stable 6-week grid so the layout never jumps between months.
  const gridStart = addDays(monthValue, -monthValue.getDay());
  const weeks: Date[][] = [];
  for (let week = 0; week < 6; week += 1) {
    const days: Date[] = [];
    for (let day = 0; day < 7; day += 1) {
      days.push(addDays(gridStart, week * 7 + day));
    }
    weeks.push(days);
  }

  const monthName = MONTH_NAMES[monthValue.getMonth()];
  const year = monthValue.getFullYear();

  return (
    <div
      {...props}
      aria-labelledby={headingId}
      className={cn(calendarVariants({ variant, size }), className)}
      data-material={material}
      role="group"
    >
      <div className="mb-[var(--mq-gap,2px)] flex items-center justify-between gap-[8px] pb-[8px]">
        <button
          aria-label="Previous month"
          className={NAV_BTN}
          onClick={() => goToMonth(-1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-[1.15em]" strokeWidth={2.25} />
        </button>
        <div
          aria-atomic="true"
          aria-live="polite"
          className="text-[length:var(--mq-heading,15px)] font-extrabold tracking-[-0.01em] tabular-nums text-[color:var(--mq-text,#1c1c19)] forced-colors:text-[CanvasText]"
          id={headingId}
        >
          {monthName} {year}
        </div>
        <button
          aria-label="Next month"
          className={NAV_BTN}
          onClick={() => goToMonth(1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-[1.15em]" strokeWidth={2.25} />
        </button>
      </div>

      {/* sr-only equivalent: the authoritative textual summary of the visible
          month, the current selection, and the keyboard model. */}
      <div className={SR_ONLY} id={summaryId}>
        {`Showing ${monthName} ${year}. ${
          selectedValue ? `Selected date: ${fullLabel(selectedValue)}.` : "No date is currently selected."
        } Use the arrow keys to move between dates, Page Up and Page Down to change month, and Enter to select a date.`}
      </div>

      <table
        aria-describedby={summaryId}
        aria-labelledby={headingId}
        className="w-full border-separate [border-spacing:var(--mq-gap,2px)]"
        onKeyDown={handleKeyDown}
        role="grid"
      >
        <thead>
          <tr role="row">
            {WEEKDAYS.map((weekday) => (
              <th
                className="pb-[6px] text-center text-[length:var(--mq-head,11px)] font-bold uppercase tracking-[0.06em] text-[color:var(--mq-muted,#55554e)] forced-colors:text-[CanvasText]"
                key={weekday.full}
                scope="col"
              >
                <span className={SR_ONLY}>{weekday.full}</span>
                <span aria-hidden="true">{weekday.abbr}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toKey(week[0])} role="row">
              {week.map((day) => {
                const inMonth = isSameMonth(day, monthValue);
                const isSelected = selectedValue != null && isSameDay(day, selectedValue);
                const isToday = today != null && isSameDay(day, today);
                const isTabbable = inMonth && isSameDay(day, focusedValue);
                const key = toKey(day);

                return (
                  <td
                    aria-selected={isSelected ? true : undefined}
                    className="p-0 text-center"
                    key={key}
                    role="gridcell"
                  >
                    <button
                      aria-current={isToday ? "date" : undefined}
                      aria-label={fullLabel(day)}
                      className={DAY_BTN}
                      data-outside={inMonth ? undefined : ""}
                      data-selected={isSelected ? "" : undefined}
                      data-today={isToday ? "" : undefined}
                      disabled={!inMonth}
                      onClick={() => handleSelect(day)}
                      ref={
                        inMonth
                          ? (element) => {
                              if (element) dayRefs.current.set(key, element);
                              else dayRefs.current.delete(key);
                            }
                          : undefined
                      }
                      tabIndex={isTabbable ? 0 : -1}
                      type="button"
                    >
                      <span aria-hidden="true">{day.getDate()}</span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { calendarVariants };
