"use client";

import { EventCard } from "@/registry/ui/event-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Event Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Two cards are shown per material: a full listing with a poster image in its
 * resting "Attend" state, and a compact one already in the confirmed
 * "Attending" state, so both sides of the toggle are visible at a glance
 * without the reader having to click.
 */

type EventCardVariant = "default";
type EventCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): EventCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as EventCardVariant;
}

function asSize(value: string): EventCardSize {
  return (SIZES.includes(value) ? value : "md") as EventCardSize;
}

/**
 * Inline SVG poster as a `data:` URI — the docs build is static and must not
 * depend on the network, so nothing is hotlinked. Pure and deterministic, so
 * the server and the client render the same bytes.
 */
function poster(from: string, to: string, ink: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="640" height="360" fill="url(#g)"/>` +
    `<circle cx="506" cy="72" r="128" fill="${ink}" opacity="0.30"/>` +
    `<circle cx="118" cy="304" r="92" fill="${ink}" opacity="0.20"/>` +
    `<rect x="0" y="292" width="640" height="6" fill="${ink}" opacity="0.35"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

type EventCopy = {
  title: string;
  dateTime: string;
  day: string;
  month: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  attendeeCount: number;
  badge: string;
  imageSrc: string;
  imageAlt: string;
  second: {
    title: string;
    dateTime: string;
    day: string;
    month: string;
    dateLabel: string;
    timeLabel: string;
    location: string;
    attendeeCount: number;
  };
};

/** Copy differs per material so each recipe is shown doing real listing work. */
const COPY: Record<StyleSlug, EventCopy> = {
  clay: {
    title: "Wheel throwing: the tall vase",
    dateTime: "2026-03-14T19:00",
    day: "14",
    month: "Mar",
    dateLabel: "Saturday, 14 March 2026",
    timeLabel: "7:00 – 9:30 PM",
    location: "Kiln Studio 4, Rua da Boavista",
    attendeeCount: 26,
    badge: "2 seats left",
    imageSrc: poster("#f6e7dd", "#d8a887", "#5a3a28"),
    imageAlt: "A row of unfired clay vases drying on a studio shelf",
    second: {
      title: "Glaze night, open bench",
      dateTime: "2026-03-21T18:30",
      day: "21",
      month: "Mar",
      dateLabel: "Saturday, 21 March 2026",
      timeLabel: "6:30 – 9:00 PM",
      location: "Kiln Studio 4",
      attendeeCount: 11,
    },
  },
  glass: {
    title: "Rooftop listening session",
    dateTime: "2026-04-02T20:00",
    day: "02",
    month: "Apr",
    dateLabel: "Thursday, 2 April 2026",
    timeLabel: "8:00 – 11:00 PM",
    location: "Miradouro Terrace, 9th floor",
    attendeeCount: 148,
    badge: "Free entry",
    imageSrc: poster("#bcd7ea", "#e6ecf4", "#1e2a35"),
    imageAlt: "A city skyline seen through a wall of glass at dusk",
    second: {
      title: "Ambient set, late doors",
      dateTime: "2026-04-09T22:00",
      day: "09",
      month: "Apr",
      dateLabel: "Thursday, 9 April 2026",
      timeLabel: "10:00 PM – 1:00 AM",
      location: "Miradouro Terrace",
      attendeeCount: 63,
    },
  },
  skeuo: {
    title: "Analogue tape transfer clinic",
    dateTime: "2026-05-09T10:00",
    day: "09",
    month: "May",
    dateLabel: "Saturday, 9 May 2026",
    timeLabel: "10:00 AM – 4:00 PM",
    location: "Archive Room B, Sound Library",
    attendeeCount: 38,
    badge: "Bring a reel",
    imageSrc: poster("#f6f4ee", "#c4bfb2", "#2b2924"),
    imageAlt: "A reel-to-reel tape machine with its spools mid-rotation",
    second: {
      title: "Deck maintenance workshop",
      dateTime: "2026-05-16T13:00",
      day: "16",
      month: "May",
      dateLabel: "Saturday, 16 May 2026",
      timeLabel: "1:00 – 5:00 PM",
      location: "Archive Room B",
      attendeeCount: 19,
    },
  },
  adaptive: {
    title: "Design systems, third edition",
    dateTime: "2026-06-11T18:00",
    day: "11",
    month: "Jun",
    dateLabel: "Thursday, 11 June 2026",
    timeLabel: "6:00 – 8:30 PM",
    location: "Atrium Hall, Praça do Comércio",
    attendeeCount: 412,
    badge: "Waitlist open",
    imageSrc: poster("#e8e6e1", "#9aa0a6", "#1c1c19"),
    imageAlt: "An auditorium filling up before a talk, seen from the back row",
    second: {
      title: "Component library office hours",
      dateTime: "2026-06-18T17:30",
      day: "18",
      month: "Jun",
      dateLabel: "Thursday, 18 June 2026",
      timeLabel: "5:30 – 7:00 PM",
      location: "Atrium Hall, Room 2",
      attendeeCount: 57,
    },
  },
};

export function EventCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const isDisabled = state === "disabled";

  return (
    <div className="flex w-full flex-col items-start gap-[18px]">
      <EventCard
        attendeeCount={copy.attendeeCount}
        badge={copy.badge}
        className="w-[min(360px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        dateLabel={copy.dateLabel}
        dateTime={copy.dateTime}
        day={copy.day}
        disabled={isDisabled}
        href="#event"
        imageAlt={copy.imageAlt}
        imageSrc={copy.imageSrc}
        location={copy.location}
        material={material}
        month={copy.month}
        size={resolvedSize}
        timeLabel={copy.timeLabel}
        title={copy.title}
        variant={resolvedVariant}
      />

      <EventCard
        attendeeCount={copy.second.attendeeCount}
        className="w-[min(360px,100%)]"
        dateLabel={copy.second.dateLabel}
        dateTime={copy.second.dateTime}
        day={copy.second.day}
        defaultAttending
        disabled={isDisabled}
        href="#event-next"
        location={copy.second.location}
        material={material}
        month={copy.second.month}
        size={resolvedSize}
        timeLabel={copy.second.timeLabel}
        title={copy.second.title}
        variant={resolvedVariant}
      />
    </div>
  );
}
