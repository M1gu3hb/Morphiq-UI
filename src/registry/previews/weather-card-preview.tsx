"use client";

import {
  WeatherCard,
  type TemperatureUnit,
  type WeatherCondition,
  type WeatherForecastDay,
  type WeatherMetric,
} from "@/registry/ui/weather-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Weather Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Every reading, label and timestamp below is a hard-coded literal. Nothing
 * here calls `Date.now()` or `new Date()`, so the statically generated page and
 * its hydration always render the same card.
 */

type WeatherCardVariant = "default";
type WeatherCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): WeatherCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as WeatherCardVariant;
}

function asSize(value: string): WeatherCardSize {
  return (SIZES.includes(value) ? value : "md") as WeatherCardSize;
}

type WeatherSample = {
  location: string;
  condition: WeatherCondition;
  conditionLabel: string;
  temperature: number;
  high: number;
  low: number;
  unit: TemperatureUnit;
  observedAt: string;
  observedAtLabel: string;
  metrics: readonly WeatherMetric[];
  forecast: readonly WeatherForecastDay[];
  defaultSaved: boolean;
};

/** Copy differs per material so each recipe is shown reporting real weather. */
const COPY: Record<StyleSlug, WeatherSample> = {
  clay: {
    location: "Marrakesh",
    condition: "clear",
    conditionLabel: "Clear and dry",
    temperature: 34,
    high: 38,
    low: 21,
    unit: "C",
    observedAt: "2026-07-23T14:05:00+01:00",
    observedAtLabel: "Today at 14:05",
    metrics: [
      { id: "wind", icon: "wind", label: "Wind", value: "11 km/h" },
      { id: "humidity", icon: "humidity", label: "Humidity", value: "18%" },
      { id: "feels", icon: "feels-like", label: "Feels like", value: "37°" },
    ],
    forecast: [
      { id: "thu", weekday: "Thursday", weekdayShort: "Thu", date: "2026-07-23", condition: "clear", conditionLabel: "Clear", high: 38, low: 21 },
      { id: "fri", weekday: "Friday", weekdayShort: "Fri", date: "2026-07-24", condition: "clear", conditionLabel: "Clear", high: 39, low: 22 },
      { id: "sat", weekday: "Saturday", weekdayShort: "Sat", date: "2026-07-25", condition: "wind", conditionLabel: "Windy", high: 36, low: 22 },
      { id: "sun", weekday: "Sunday", weekdayShort: "Sun", date: "2026-07-26", condition: "partly-cloudy", conditionLabel: "Some cloud", high: 34, low: 20 },
      { id: "mon", weekday: "Monday", weekdayShort: "Mon", date: "2026-07-27", condition: "clear", conditionLabel: "Clear", high: 37, low: 21 },
    ],
    defaultSaved: true,
  },
  glass: {
    location: "Reykjavík",
    condition: "rain",
    conditionLabel: "Light rain",
    temperature: 9,
    high: 11,
    low: 4,
    unit: "C",
    observedAt: "2026-07-23T09:20:00Z",
    observedAtLabel: "Today at 09:20",
    metrics: [
      { id: "wind", icon: "wind", label: "Wind", value: "34 km/h" },
      { id: "humidity", icon: "humidity", label: "Humidity", value: "88%" },
      { id: "sunset", icon: "sunset", label: "Sunset", value: "23:12" },
    ],
    forecast: [
      { id: "thu", weekday: "Thursday", weekdayShort: "Thu", date: "2026-07-23", condition: "rain", conditionLabel: "Rain", high: 11, low: 4 },
      { id: "fri", weekday: "Friday", weekdayShort: "Fri", date: "2026-07-24", condition: "storm", conditionLabel: "Storms", high: 10, low: 5 },
      { id: "sat", weekday: "Saturday", weekdayShort: "Sat", date: "2026-07-25", condition: "cloudy", conditionLabel: "Overcast", high: 12, low: 6 },
      { id: "sun", weekday: "Sunday", weekdayShort: "Sun", date: "2026-07-26", condition: "partly-cloudy", conditionLabel: "Brighter", high: 13, low: 6 },
      { id: "mon", weekday: "Monday", weekdayShort: "Mon", date: "2026-07-27", condition: "rain", conditionLabel: "Showers", high: 11, low: 5 },
    ],
    defaultSaved: false,
  },
  skeuo: {
    location: "Kyoto",
    condition: "fog",
    conditionLabel: "Mist over the river",
    temperature: 18,
    high: 23,
    low: 15,
    unit: "C",
    observedAt: "2026-07-23T06:40:00+09:00",
    observedAtLabel: "Today at 06:40",
    metrics: [
      { id: "visibility", icon: "visibility", label: "Visibility", value: "1.2 km" },
      { id: "humidity", icon: "humidity", label: "Humidity", value: "94%" },
      { id: "sunrise", icon: "sunrise", label: "Sunrise", value: "05:03" },
    ],
    forecast: [
      { id: "thu", weekday: "Thursday", weekdayShort: "Thu", date: "2026-07-23", condition: "fog", conditionLabel: "Mist", high: 23, low: 15 },
      { id: "fri", weekday: "Friday", weekdayShort: "Fri", date: "2026-07-24", condition: "cloudy", conditionLabel: "Grey", high: 25, low: 17 },
      { id: "sat", weekday: "Saturday", weekdayShort: "Sat", date: "2026-07-25", condition: "rain", conditionLabel: "Rain", high: 24, low: 18 },
      { id: "sun", weekday: "Sunday", weekdayShort: "Sun", date: "2026-07-26", condition: "partly-cloudy", conditionLabel: "Hazy sun", high: 27, low: 18 },
      { id: "mon", weekday: "Monday", weekdayShort: "Mon", date: "2026-07-27", condition: "clear", conditionLabel: "Sunny", high: 29, low: 19 },
    ],
    defaultSaved: false,
  },
  adaptive: {
    location: "Seattle",
    condition: "partly-cloudy",
    conditionLabel: "Partly cloudy",
    temperature: 61,
    high: 68,
    low: 52,
    unit: "F",
    observedAt: "2026-07-23T11:00:00-07:00",
    observedAtLabel: "Today at 11:00",
    metrics: [
      { id: "wind", icon: "wind", label: "Wind", value: "7 mph" },
      { id: "humidity", icon: "humidity", label: "Humidity", value: "63%" },
      { id: "feels", icon: "feels-like", label: "Feels like", value: "59°" },
    ],
    forecast: [
      { id: "thu", weekday: "Thursday", weekdayShort: "Thu", date: "2026-07-23", condition: "partly-cloudy", conditionLabel: "Part cloud", high: 68, low: 52 },
      { id: "fri", weekday: "Friday", weekdayShort: "Fri", date: "2026-07-24", condition: "clear", conditionLabel: "Sunny", high: 74, low: 55 },
      { id: "sat", weekday: "Saturday", weekdayShort: "Sat", date: "2026-07-25", condition: "cloudy", conditionLabel: "Cloudy", high: 70, low: 54 },
      { id: "sun", weekday: "Sunday", weekdayShort: "Sun", date: "2026-07-26", condition: "rain", conditionLabel: "Showers", high: 65, low: 53 },
      { id: "mon", weekday: "Monday", weekdayShort: "Mon", date: "2026-07-27", condition: "snow", conditionLabel: "Sleet", high: 41, low: 33 },
    ],
    defaultSaved: true,
  },
};

export function WeatherCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <WeatherCard
        className="w-[min(360px,100%)]"
        condition={copy.condition}
        conditionLabel={copy.conditionLabel}
        data-focus={state === "focus" ? "true" : undefined}
        defaultSaved={copy.defaultSaved}
        disabled={state === "disabled"}
        forecast={copy.forecast}
        high={copy.high}
        href="#forecast"
        location={copy.location}
        low={copy.low}
        material={material}
        metrics={copy.metrics}
        observedAt={copy.observedAt}
        observedAtLabel={copy.observedAtLabel}
        size={asSize(size)}
        temperature={copy.temperature}
        unit={copy.unit}
        variant={asVariant(variant)}
      />
    </div>
  );
}
