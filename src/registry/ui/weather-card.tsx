"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Bookmark,
  BookmarkCheck,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Weather Card
 *
 * Current conditions for one place: a large temperature reading, the condition
 * as a WORD beside a decorative glyph, a high/low pair, an optional row of
 * measurements, and a short multi-day forecast strip. Self-contained by design —
 * the four material recipes (clay / glass / skeuo / adaptive) are copied and
 * owned here, straight from `card.tsx`, so dropping this file plus
 * `src/lib/cn.ts` into another project reproduces the full tactile look with no
 * global stylesheet and no `:root` custom properties. Every `var()` carries a
 * literal fallback.
 *
 * Local theming knobs (custom properties declared on the card, inherited down):
 *
 *   --mq-body        surface colour
 *   --mq-lit         top highlight (skeuo gradient)
 *   --mq-edge        extruded bottom edge colour
 *   --mq-text        primary foreground
 *   --mq-muted       secondary foreground (labels, meta)
 *   --mq-rule        hairline / inset-well border
 *   --mq-brd         border colour
 *   --mq-ring        focus ring colour
 *   --mq-acc         accent fill for the pressed Save control
 *   --mq-acc-fg      text on the accent fill
 *   --mq-glyph       weather glyph colour
 *   --mq-well        inset surface behind the metric and forecast tiles
 *   --mq-well-shadow depth for those tiles
 *   --mq-sky         decorative atmospheric wash painted behind the content
 *   --mq-halo        decorative glow behind the condition glyph
 *   --mq-pad         inner padding
 *   --mq-gap         vertical rhythm between blocks
 *   --mq-radius      corner radius
 *   --mq-title       location heading font size
 *   --mq-temp        temperature reading font size
 *   --mq-icon        condition glyph size
 *   --mq-read        body copy font size
 *   --mq-meta        meta copy font size
 *
 * Contrast contract (inherited from the Card recipe): on every filled material
 * --mq-text, --mq-muted and --mq-glyph stay at or above 4.5:1 against the
 * surface they sit on — including the inset wells — and the glass tokens carry
 * their own tint so that holds over a white and a black backdrop alike.
 *
 * Determinism: this component NEVER calls `Date.now()` or `new Date()`. Every
 * reading, every label and every timestamp arrives as a prop, so a statically
 * generated page and its hydration always agree.
 */

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";
type WeatherCardVariant = "default";
type WeatherCardSize = "sm" | "md" | "lg";

/** Temperature scale. Drives the spelled-out unit exposed to assistive tech. */
export type TemperatureUnit = "C" | "F";

/** Condition buckets the card ships a glyph for. */
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "snow"
  | "storm"
  | "fog"
  | "wind";

/** Measurement glyphs available to the optional metrics row. */
export type WeatherMetricIcon =
  | "wind"
  | "humidity"
  | "feels-like"
  | "sunrise"
  | "sunset"
  | "visibility";

const CONDITION_ICONS: Record<WeatherCondition, LucideIcon> = {
  clear: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  fog: CloudFog,
  wind: Wind,
};

const METRIC_ICONS: Record<WeatherMetricIcon, LucideIcon> = {
  wind: Wind,
  humidity: Droplets,
  "feels-like": Thermometer,
  sunrise: Sunrise,
  sunset: Sunset,
  visibility: Eye,
};

const UNIT_NAMES: Record<TemperatureUnit, string> = {
  C: "degrees Celsius",
  F: "degrees Fahrenheit",
};

/** Visible reading, e.g. `24°`. Always paired with a spelled-out sr-only copy. */
function formatDegrees(value: number): string {
  return `${Math.round(value)}°`;
}

/** Reading for assistive tech, e.g. `24 degrees Celsius` — never "24 degree sign". */
function spellDegrees(value: number, unit: TemperatureUnit): string {
  return `${Math.round(value)} ${UNIT_NAMES[unit]}`;
}

/**
 * Focus ring. Declared for real `:focus-visible` and identically for a
 * `data-focus="true"` attribute so documentation surfaces and visual-regression
 * tests can render the focused look without synthesising a keyboard event.
 */
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "focus-visible:outline-[var(--mq-ring,#171817)] " +
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[3px] " +
  "data-[focus=true]:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-visible:outline-[Highlight]";

/**
 * `:focus-within` is scoped to the LINKED card only: tabbing to the location
 * link or the Save control outlines the whole card, so the stretched link never
 * loses its visible focus. An inert weather card skips this — outlining the card
 * as well as the Save button would double-ring one focus.
 */
const FOCUS_WITHIN_RING =
  "focus-within:outline-2 focus-within:outline-offset-[3px] " +
  "focus-within:outline-[var(--mq-ring,#171817)] " +
  "forced-colors:focus-within:outline-[Highlight]";

/**
 * Hover lift + press sink for a card that leads somewhere.
 *
 * `translate`, not `transform`: Tailwind v4's `translate-*` utilities write the
 * standalone `translate` property, so the transition NAMES `translate` (with
 * `box-shadow`, which also changes). Both listed properties really change, so
 * there is no phantom transition. Reduced motion cancels the travel outright
 * because the card is already a link — nothing is being communicated by it.
 */
const INTERACTIVE_LIFT =
  "cursor-pointer transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 " +
  "hover:shadow-[var(--mq-shadow-hover,0_14px_35px_rgba(20,20,18,0.12))] " +
  "active:translate-y-[1px] active:shadow-[var(--mq-shadow-press,0_4px_10px_rgba(20,20,18,0.09))] " +
  "motion-reduce:active:translate-y-0";

/**
 * Stretched link: a single <a> INSIDE the heading — so the location is the
 * link's accessible name — whose transparent `::after` covers the card (the
 * nearest positioned ancestor). Everything the reader must still reach
 * independently, i.e. the Save control, sits on a higher `z-index`, so it stays
 * clickable and focusable while the rest of the surface routes to the forecast
 * page. No <a> or <button> is ever nested inside another. The <a> drops its own
 * outline; the card's `:focus-within` ring is what shows the focus.
 */
const STRETCHED_LINK =
  "text-inherit no-underline outline-none " +
  "[&::after]:absolute [&::after]:inset-0 [&::after]:z-[1] [&::after]:content-['']";

/**
 * Inset well shared by the metric tiles and the forecast columns. Forced colours
 * discard fills and shadows but NOT background images, so the wash is cleared by
 * hand and a system-coloured border keeps each tile's bounds.
 */
const WELL =
  "rounded-[calc(var(--mq-radius,24px)_-_12px)] border " +
  "border-[var(--mq-rule,rgba(23,24,23,0.14))] bg-[var(--mq-well,rgba(255,255,255,0.55))] " +
  "shadow-[var(--mq-well-shadow,inset_0_1px_0_rgba(255,255,255,0.7))] " +
  "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none " +
  "forced-colors:[background-image:none]";

/**
 * The Save toggle. State is carried by `aria-pressed`, by the visible LABEL
 * ("Save" / "Saved") and by a different icon — never by the accent fill alone.
 * It sits at `relative z-10`, above the stretched link's overlay, so it remains
 * independently clickable and independently focusable.
 */
const SAVE_BUTTON =
  "relative z-10 inline-flex shrink-0 items-center gap-[6px] rounded-full border " +
  "px-[11px] py-[7px] text-[length:12px] leading-none font-bold whitespace-nowrap " +
  "border-[var(--mq-rule,rgba(23,24,23,0.14))] bg-[var(--mq-well,rgba(255,255,255,0.55))] " +
  "text-[color:var(--mq-text,#2b2b26)] " +
  "transition-[translate,background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none " +
  "hover:-translate-y-[1px] hover:opacity-90 motion-reduce:hover:translate-y-0 active:translate-y-0 " +
  "data-[pressed=true]:border-transparent data-[pressed=true]:bg-[var(--mq-acc,#1c1c19)] " +
  "data-[pressed=true]:text-[color:var(--mq-acc-fg,#ffffff)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mq-ring,#171817)] " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 " +
  "forced-colors:border-[ButtonText] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] " +
  "forced-colors:data-[pressed=true]:bg-[Highlight] forced-colors:data-[pressed=true]:text-[HighlightText] " +
  "forced-colors:focus-visible:outline-[Highlight]";

const weatherCardVariants = cva(
  [
    "group relative isolate flex flex-col text-left border",
    "gap-[var(--mq-gap,14px)] p-[var(--mq-pad,22px)] rounded-[var(--mq-radius,24px)]",
    "text-[color:var(--mq-text,#2b2b26)]",
    // Shadows, translucency and gradients are erased or ignored in forced-colors
    // mode, so the card would either dissolve into the page or keep a wash it
    // was never designed against. A system-coloured border plus a cleared
    // background-image fixes both.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
    "data-[state=disabled]:opacity-60",
    FOCUS_RING,
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "bg-[var(--mq-body,#f6e7dd)]",
          "border-[var(--mq-brd,rgba(120,80,55,0.16))]",
          "shadow-[inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_7px_0_var(--mq-edge,#dcc4b2),0_18px_30px_rgba(90,60,45,0.16)] [--mq-shadow-hover:inset_0_3px_4px_rgba(255,255,255,0.75),inset_0_-5px_8px_rgba(140,90,60,0.12),0_10px_0_var(--mq-edge,#dcc4b2),0_26px_44px_rgba(90,60,45,0.189)] [--mq-shadow-press:inset_0_3px_4px_rgba(255,255,255,0.938),inset_0_-5px_8px_rgba(140,90,60,0.15),0_3px_0_var(--mq-edge,#dcc4b2),0_7px_12px_rgba(90,60,45,0.136)]",
        ].join(" "),
        glass: [
          "bg-[var(--mq-body,rgba(255,255,255,0.66))]",
          "border-[var(--mq-brd,rgba(255,255,255,0.75))]",
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          "forced-colors:[backdrop-filter:none] forced-colors:shadow-none",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(24,20,40,0.20)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.85),0_23px_55px_rgba(24,20,40,0.236)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),0_6px_15px_rgba(24,20,40,0.17)]",
        ].join(" "),
        skeuo: [
          "bg-[linear-gradient(180deg,var(--mq-lit,#f6f4ee),var(--mq-body,#d9d5cb))]",
          "border-[var(--mq-brd,rgba(25,25,23,0.28))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_6px_0_var(--mq-edge,#a8a49b),0_14px_22px_rgba(38,36,31,0.24)] [--mq-shadow-hover:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.14),0_9px_0_var(--mq-edge,#a8a49b),0_20px_32px_rgba(38,36,31,0.283)] [--mq-shadow-press:inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.175),0_2px_0_var(--mq-edge,#a8a49b),0_6px_9px_rgba(38,36,31,0.204)]",
        ].join(" "),
        adaptive: [
          "bg-[var(--mq-body,#ffffff)]",
          "border-[var(--mq-brd,rgba(23,24,23,0.14))]",
          "shadow-[0_1px_2px_rgba(20,20,18,0.10),0_10px_24px_rgba(20,20,18,0.06)] [--mq-shadow-hover:0_1px_3px_rgba(20,20,18,0.118),0_14px_35px_rgba(20,20,18,0.071)] [--mq-shadow-press:0_0px_1px_rgba(20,20,18,0.085),0_4px_10px_rgba(20,20,18,0.051)]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "[--mq-pad:16px] [--mq-gap:10px] [--mq-radius:18px] [--mq-title:15px] [--mq-temp:46px] [--mq-icon:38px] [--mq-read:12px] [--mq-meta:11px]",
        md: "[--mq-pad:22px] [--mq-gap:14px] [--mq-radius:24px] [--mq-title:17px] [--mq-temp:60px] [--mq-icon:48px] [--mq-read:13px] [--mq-meta:12px]",
        lg: "[--mq-pad:28px] [--mq-gap:18px] [--mq-radius:30px] [--mq-title:20px] [--mq-temp:76px] [--mq-icon:60px] [--mq-read:14px] [--mq-meta:13px]",
      },
    },
    compoundVariants: [
      // ---------------------------------------------------------------- clay
      {
        material: "clay",
        variant: "default",
        class:
          "[--mq-body:#f6e7dd] [--mq-edge:#dcc4b2] [--mq-text:#33261e] [--mq-muted:#6a5346] " +
          "[--mq-rule:rgba(120,80,55,0.20)] [--mq-brd:rgba(120,80,55,0.16)] [--mq-ring:#171817] " +
          "[--mq-acc:#33261e] [--mq-acc-fg:#fff3ea] [--mq-glyph:#9a4a17] " +
          "[--mq-well:rgba(255,255,255,0.58)] [--mq-well-shadow:inset_0_1px_0_rgba(255,255,255,0.85)] " +
          "[--mq-sky:radial-gradient(115%_85%_at_88%_-12%,rgba(255,255,255,0.85),rgba(255,255,255,0)_62%)] " +
          "[--mq-halo:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.9),rgba(255,255,255,0)_70%)]",
      },
      // --------------------------------------------------------------- glass
      {
        material: "glass",
        variant: "default",
        // --mq-muted #36362f (not a lighter grey) holds 5.1:1 over a black
        // backdrop at 0.66 opacity, where a lighter muted measured only 4.3:1.
        // --mq-glyph #14424e holds 4.6:1 there and 10.9:1 over white.
        class:
          "[--mq-body:rgba(255,255,255,0.66)] [--mq-text:#1e1e1b] [--mq-muted:#36362f] " +
          "[--mq-rule:rgba(23,24,23,0.18)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-ring:#171817] " +
          "[--mq-acc:#1e1e1b] [--mq-acc-fg:#ffffff] [--mq-glyph:#14424e] " +
          "[--mq-well:rgba(255,255,255,0.34)] [--mq-well-shadow:inset_0_1px_0_rgba(255,255,255,0.7)] " +
          "[--mq-sky:radial-gradient(110%_80%_at_82%_-15%,rgba(255,255,255,0.55),rgba(255,255,255,0)_64%)] " +
          "[--mq-halo:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(255,255,255,0)_70%)]",
      },
      // --------------------------------------------------------------- skeuo
      // The inset wells are warm greige #e6e3da: a milled panel recessed into
      // the brushed face, not another sheet of the same plastic.
      {
        material: "skeuo",
        variant: "default",
        class:
          "[--mq-lit:#f6f4ee] [--mq-body:#d9d5cb] [--mq-edge:#a8a49b] [--mq-text:#23231f] [--mq-muted:#4a4943] " +
          "[--mq-rule:rgba(25,25,23,0.26)] [--mq-brd:rgba(25,25,23,0.28)] [--mq-ring:#171817] " +
          "[--mq-acc:#23231f] [--mq-acc-fg:#f6f4ee] [--mq-glyph:#3a3f3b] " +
          "[--mq-well:#e6e3da] [--mq-well-shadow:inset_0_2px_3px_rgba(38,36,31,0.22),inset_0_-1px_0_rgba(255,255,255,0.85)] " +
          "[--mq-sky:radial-gradient(120%_90%_at_50%_-20%,rgba(255,255,255,0.55),rgba(255,255,255,0)_58%)] " +
          "[--mq-halo:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.75),rgba(255,255,255,0)_70%)]",
      },
      // ------------------------------------------------------------ adaptive
      {
        material: "adaptive",
        variant: "default",
        class:
          "[--mq-body:#ffffff] [--mq-text:#1c1c19] [--mq-muted:#55554e] " +
          "[--mq-rule:rgba(23,24,23,0.14)] [--mq-brd:rgba(23,24,23,0.14)] [--mq-ring:#171817] " +
          "[--mq-acc:#1c1c19] [--mq-acc-fg:#ffffff] [--mq-glyph:#1f4f63] " +
          "[--mq-well:#f4f4f2] [--mq-well-shadow:none] " +
          "[--mq-sky:radial-gradient(120%_90%_at_88%_-12%,rgba(31,79,99,0.10),rgba(31,79,99,0)_60%)] " +
          "[--mq-halo:radial-gradient(circle_at_50%_50%,rgba(31,79,99,0.12),rgba(31,79,99,0)_70%)] " +
          "dark:[--mq-body:#232327] dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] " +
          "dark:[--mq-rule:rgba(255,255,255,0.16)] dark:[--mq-brd:rgba(255,255,255,0.16)] dark:[--mq-ring:#f1efe9] " +
          "dark:[--mq-acc:#f1efe9] dark:[--mq-acc-fg:#1c1c19] dark:[--mq-glyph:#8fc9de] " +
          "dark:[--mq-well:#2c2c31] dark:[--mq-well-shadow:inset_0_1px_0_rgba(255,255,255,0.06)] " +
          "dark:[--mq-sky:radial-gradient(120%_90%_at_88%_-12%,rgba(143,201,222,0.16),rgba(143,201,222,0)_62%)] " +
          "dark:[--mq-halo:radial-gradient(circle_at_50%_50%,rgba(143,201,222,0.16),rgba(143,201,222,0)_70%)] " +
          "dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_14px_30px_rgba(0,0,0,0.55)] dark:[--mq-shadow-hover:0_3px_6px_rgba(0,0,0,0.59),0_20px_44px_rgba(0,0,0,0.62)] dark:[--mq-shadow-press:0_1px_2px_rgba(0,0,0,0.45),0_6px_12px_rgba(0,0,0,0.5)]",
      },
    ],
    defaultVariants: {
      material: "clay",
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Local keyframes.
 *
 * Both animations END at the component's resting visual state — the forecast
 * tiles finish fully opaque and untranslated, the glyph finishes exactly where
 * it started — so `motion-reduce:animate-none` leaves the card completely
 * rendered instead of stranding it mid-reveal.
 */
const WEATHER_CARD_KEYFRAMES = `
@keyframes mq-weather-card-rise {
  from { opacity: 0; translate: 0 8px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes mq-weather-card-drift {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -3px; }
}`;

/** One day in the forecast strip. Every value arrives from the caller. */
export type WeatherForecastDay = {
  /** Stable React key. */
  id: string;
  /** Full weekday name, e.g. "Tuesday" — always exposed to assistive tech. */
  weekday: string;
  /** Optional short visible form, e.g. "Tue". Falls back to `weekday`. */
  weekdayShort?: string;
  /** ISO date for the day, rendered into `<time dateTime>`. Never computed here. */
  date?: string;
  condition: WeatherCondition;
  /** Short visible condition word, e.g. "Rain". Never a glyph on its own. */
  conditionLabel: string;
  high: number;
  low: number;
};

/** One measurement tile, e.g. wind or humidity. The value is a formatted string. */
export type WeatherMetric = {
  id: string;
  icon?: WeatherMetricIcon;
  /** Visible label, e.g. "Wind". */
  label: string;
  /** Visible, already-formatted value, e.g. "12 km/h". */
  value: string;
};

export type WeatherCardProps = Omit<
  React.ComponentPropsWithRef<"article">,
  "children"
> &
  Omit<VariantProps<typeof weatherCardVariants>, "material" | "variant" | "size"> & {
    material?: MaterialSlug;
    variant?: WeatherCardVariant;
    size?: WeatherCardSize;
    /** Place name — the card's heading and, when `href` is set, the link text. */
    location: string;
    /**
     * Heading rank for the location. The correct level depends on the
     * surrounding document outline, so it is overridable rather than hardcoded.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** When set, the whole card becomes one link via the stretched-link pattern. */
    href?: string;
    /** Condition bucket — picks the decorative glyph only. */
    condition: WeatherCondition;
    /** The condition as visible words, e.g. "Partly cloudy". Always rendered. */
    conditionLabel: string;
    /** Current reading, in `unit`. */
    temperature: number;
    /** Day high, in `unit`. */
    high: number;
    /** Day low, in `unit`. */
    low: number;
    unit?: TemperatureUnit;
    /** ISO timestamp for the observation, e.g. "2026-07-23T14:05:00Z". */
    observedAt?: string;
    /** Human-readable observation time, e.g. "14:05". Supplied, never computed. */
    observedAtLabel?: string;
    /** Optional measurement tiles. */
    metrics?: readonly WeatherMetric[];
    /** Optional multi-day forecast strip. */
    forecast?: readonly WeatherForecastDay[];
    /** Visible label above the forecast strip; also names the list. */
    forecastLabel?: string;
    /** Renders the Save toggle. */
    savable?: boolean;
    /** Controlled saved state. Omit to let the card own it. */
    saved?: boolean;
    /** Initial saved state when uncontrolled. */
    defaultSaved?: boolean;
    onSavedChange?: (nextSaved: boolean) => void;
    /** Visible label while unsaved. */
    saveLabel?: string;
    /** Visible label while saved. */
    savedLabel?: string;
    /** Dims the card, disables the Save control and drops the stretched link. */
    disabled?: boolean;
  };

/** Weekday cell: short text on screen, the full name always read aloud. */
function WeekdayLabel({ day }: { day: WeatherForecastDay }) {
  const content = (
    <>
      <span aria-hidden="true">{day.weekdayShort ?? day.weekday}</span>
      <span className="sr-only">{day.weekday}</span>
    </>
  );
  return (
    <p className="m-0 text-[length:11px] font-bold leading-none tracking-[0.04em] text-[color:var(--mq-text,#2b2b26)]">
      {day.date ? <time dateTime={day.date}>{content}</time> : content}
    </p>
  );
}

export function WeatherCard({
  className,
  condition,
  conditionLabel,
  defaultSaved = false,
  disabled = false,
  forecast,
  forecastLabel = "Next days",
  headingLevel = 3,
  high,
  href,
  location,
  low,
  material = "clay",
  metrics,
  observedAt,
  observedAtLabel,
  onSavedChange,
  savable = true,
  saveLabel = "Save",
  saved,
  savedLabel = "Saved",
  size = "md",
  temperature,
  unit = "C",
  variant = "default",
  ...props
}: WeatherCardProps) {
  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const ConditionIcon = CONDITION_ICONS[condition];
  const forecastLabelId = React.useId();

  // Uncontrolled fallback for the Save toggle. Both transitions happen in the
  // click handler — never synchronously inside an effect.
  const [internalSaved, setInternalSaved] = React.useState(defaultSaved);
  const [announcement, setAnnouncement] = React.useState("");
  const isSavedControlled = saved !== undefined;
  const isSaved = saved ?? internalSaved;
  const isLinked = Boolean(href) && !disabled;

  function handleSaveClick() {
    const nextSaved = !isSaved;
    if (!isSavedControlled) setInternalSaved(nextSaved);
    setAnnouncement(
      nextSaved
        ? `${location} saved to your locations.`
        : `${location} removed from your locations.`,
    );
    onSavedChange?.(nextSaved);
  }

  return (
    <>
      {/*
        `href` + `precedence` so React 19 hoists this and deduplicates it: a bare
        <style> emits one identical copy per WeatherCard rendered on the page.
      */}
      <style href="mq-weather-card" precedence="medium">
        {WEATHER_CARD_KEYFRAMES}
      </style>
      <article
        {...props}
        className={cn(
          weatherCardVariants({ material, variant, size }),
          // Gate the whole-card affordances on `!disabled` too: a dimmed card
          // must not lift, ring, or render a live stretched link.
          isLinked && INTERACTIVE_LIFT,
          isLinked && FOCUS_WITHIN_RING,
          className,
        )}
        data-material={material}
        data-state={disabled ? "disabled" : "idle"}
      >
        {/*
          Atmospheric wash. Decorative and inert, painted behind the content by a
          negative z-index inside the card's own stacking context.
        */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] [background-image:var(--mq-sky,none)] forced-colors:[background-image:none]"
        />

        {/*
          Present in the DOM before any text arrives, so the confirmation is
          actually announced rather than being created together with its message.
        */}
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>

        <header className="flex flex-wrap items-start justify-between gap-[10px]">
          <div className="flex min-w-0 flex-col gap-[3px]">
            <HeadingTag className="m-0 font-extrabold tracking-[-0.02em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-title,17px)] leading-[1.2]">
              {isLinked ? (
                <a href={href} className={STRETCHED_LINK}>
                  {location}
                </a>
              ) : (
                location
              )}
            </HeadingTag>
            {observedAtLabel ? (
              <p className="m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:var(--mq-meta,12px)] leading-[1.4]">
                <span className="sr-only">Updated </span>
                {observedAt ? (
                  <time dateTime={observedAt}>{observedAtLabel}</time>
                ) : (
                  <span>{observedAtLabel}</span>
                )}
              </p>
            ) : null}
          </div>

          {savable ? (
            <button
              aria-pressed={isSaved}
              className={SAVE_BUTTON}
              data-pressed={isSaved ? "true" : "false"}
              disabled={disabled}
              onClick={handleSaveClick}
              type="button"
            >
              {isSaved ? (
                <BookmarkCheck aria-hidden="true" className="size-[15px]" strokeWidth={2} />
              ) : (
                <Bookmark aria-hidden="true" className="size-[15px]" strokeWidth={2} />
              )}
              <span>{isSaved ? savedLabel : saveLabel}</span>
            </button>
          ) : null}
        </header>

        <div className="flex items-end justify-between gap-[var(--mq-gap,14px)]">
          <div className="flex min-w-0 flex-col gap-[6px]">
            <p className="m-0 font-extrabold tabular-nums tracking-[-0.04em] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-temp,60px)] leading-[0.9]">
              {/* The glyph on screen, the words for assistive tech: "24°" must
                  never be read as "24 degree sign". */}
              <span aria-hidden="true">{formatDegrees(temperature)}</span>
              <span className="sr-only">{spellDegrees(temperature, unit)}</span>
            </p>
            {/* The condition is TEXT. The glyph beside it is decoration. */}
            <p className="m-0 font-semibold text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-read,13px)] leading-[1.4]">
              {conditionLabel}
            </p>
            <p className="m-0 flex flex-wrap items-baseline gap-x-[10px] gap-y-[2px] text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-meta,12px)] leading-[1.4]">
              <span className="inline-flex items-baseline gap-[5px]">
                <span className="font-bold">High</span>
                <span aria-hidden="true" className="tabular-nums">
                  {formatDegrees(high)}
                </span>
                <span className="sr-only">{spellDegrees(high, unit)}</span>
              </span>
              <span aria-hidden="true" className="text-[color:var(--mq-muted,#5c5b55)]">
                ·
              </span>
              <span className="inline-flex items-baseline gap-[5px]">
                <span className="font-bold">Low</span>
                <span aria-hidden="true" className="tabular-nums">
                  {formatDegrees(low)}
                </span>
                <span className="sr-only">{spellDegrees(low, unit)}</span>
              </span>
            </p>
          </div>

          <span
            aria-hidden="true"
            className="relative grid size-[calc(var(--mq-icon,48px)_+_22px)] shrink-0 place-items-center"
          >
            <span className="absolute inset-0 rounded-full [background-image:var(--mq-halo,none)] forced-colors:[background-image:none]" />
            <ConditionIcon
              className="relative size-[var(--mq-icon,48px)] text-[color:var(--mq-glyph,#33261e)] animate-[mq-weather-card-drift_6.5s_ease-in-out_infinite] motion-reduce:animate-none forced-colors:text-[CanvasText]"
              strokeWidth={1.5}
            />
          </span>
        </div>

        {metrics && metrics.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(104px,1fr))] gap-[8px] p-0">
            {metrics.map((metric) => {
              const MetricIcon = metric.icon ? METRIC_ICONS[metric.icon] : null;
              return (
                <li
                  key={metric.id}
                  className={cn(WELL, "flex items-center gap-[8px] px-[10px] py-[8px]")}
                >
                  {MetricIcon ? (
                    <MetricIcon
                      aria-hidden="true"
                      className="size-[16px] shrink-0 text-[color:var(--mq-glyph,#33261e)] forced-colors:text-[CanvasText]"
                      strokeWidth={1.75}
                    />
                  ) : null}
                  <span className="flex min-w-0 flex-col gap-[3px]">
                    <span className="font-bold uppercase tracking-[0.12em] text-[color:var(--mq-muted,#5c5b55)] text-[length:11px] leading-none">
                      {metric.label}
                    </span>
                    <span className="font-semibold text-[color:var(--mq-text,#2b2b26)] text-[length:var(--mq-meta,12px)] leading-none">
                      {metric.value}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {forecast && forecast.length > 0 ? (
          <div className="flex flex-col gap-[9px] border-t border-[var(--mq-rule,rgba(23,24,23,0.14))] pt-[var(--mq-gap,14px)] forced-colors:border-[CanvasText]">
            <p
              className="m-0 font-bold uppercase tracking-[0.14em] text-[color:var(--mq-muted,#5c5b55)] text-[length:11px] leading-none"
              id={forecastLabelId}
            >
              {forecastLabel}
            </p>
            <ul
              aria-labelledby={forecastLabelId}
              className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-[8px] p-0"
            >
              {forecast.map((day, index) => {
                const DayIcon = CONDITION_ICONS[day.condition];
                return (
                  <li
                    key={day.id}
                    className={cn(
                      WELL,
                      "flex flex-col items-center gap-[6px] px-[6px] py-[10px] text-center",
                      // Ends fully opaque and untranslated, so reduced motion
                      // simply shows the finished strip.
                      "animate-[mq-weather-card-rise_420ms_ease-out_both] motion-reduce:animate-none",
                    )}
                    // Derived purely from the map index — no variable declared in
                    // the component body is reassigned during render.
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <WeekdayLabel day={day} />
                    <DayIcon
                      aria-hidden="true"
                      className="size-[19px] text-[color:var(--mq-glyph,#33261e)] forced-colors:text-[CanvasText]"
                      strokeWidth={1.75}
                    />
                    {/* The day's condition is words on screen too, not a glyph alone. */}
                    <p className="m-0 text-[color:var(--mq-muted,#5c5b55)] text-[length:11px] leading-[1.3]">
                      {day.conditionLabel}
                    </p>
                    <p className="m-0 font-semibold tabular-nums text-[color:var(--mq-text,#2b2b26)] text-[length:12px] leading-none">
                      <span aria-hidden="true">
                        {`${formatDegrees(day.high)} / ${formatDegrees(day.low)}`}
                      </span>
                      <span className="sr-only">
                        {`High ${spellDegrees(day.high, unit)}, low ${spellDegrees(day.low, unit)}`}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </article>
    </>
  );
}

export { weatherCardVariants };
