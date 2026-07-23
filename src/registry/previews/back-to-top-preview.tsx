"use client";

import * as React from "react";
import { BackToTop } from "@/registry/ui/back-to-top";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Back To Top button.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * The disc only earns its behaviour inside something that scrolls, so it is
 * mounted beside a bounded `overflow-y-auto` pane whose ref is handed to the
 * component. Scroll the pane and the disc rises out of the corner while the ring
 * traces how far down the article you are; press it and the pane returns to the
 * top — smoothly, or instantly for a reader who asked for reduced motion.
 *
 * Two details make that read at a glance. The disc is `fixed` by default so it
 * floats over a whole page; here it is re-anchored with `absolute` onto the
 * wrapper — not the scrolling pane — so it stays pinned to the corner instead of
 * scrolling away with the copy. And the pane is parked part-way down on mount,
 * at a different depth per material, so the catalog card shows a risen disc with
 * a partly traced ring rather than an empty pane.
 *
 * `focus` forces the ring via the component's own `data-focus` hook, `disabled`
 * uses the real `disabled` prop (which dims the disc only while it is shown),
 * and `loading` marks the disc busy. `error` has no distinct rendering on a
 * scroll control and falls through to the default interactive render.
 */

type BackToTopVariant = "default";
type BackToTopSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): BackToTopVariant {
  return (VARIANTS.includes(value) ? value : "default") as BackToTopVariant;
}

function asSize(value: string): BackToTopSize {
  return (SIZES.includes(value) ? value : "md") as BackToTopSize;
}

/**
 * Pixels of pane scroll before the disc rises. Lower than the component's own
 * default because the pane is 300px tall, not a full page.
 */
const THRESHOLD = 80;

type Article = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  /**
   * Where the pane is parked on mount, as a fraction of its scrollable range.
   * Varied per material so each recipe is shown with a different arc traced.
   */
  start: number;
};

/** Copy differs per material so each recipe is shown doing real work. */
const ARTICLES: Record<StyleSlug, Article> = {
  clay: {
    eyebrow: "Release notes",
    title: "Kiln 3.4 — Firing schedules",
    start: 0.42,
    paragraphs: [
      "Firing schedules now live with the kiln rather than the project, so a studio sharing one kiln across six potters no longer keeps six copies of the same ramp quietly drifting apart.",
      "The ramp editor gained a hold step. Add one at any temperature and the schedule pauses there for the duration you set before it continues into the next segment.",
      "Cone packs can be attached to a firing after the fact. Photograph the pack, drop it on the run, and the reading is stored beside the logged curve for later comparison.",
      "Glaze recipes accept a percentage column that always totals one hundred; anything you type is redistributed across the remaining materials so a batch never silently goes off.",
      "Kiln logs export as CSV with one row per minute, carrying the setpoint, the measured temperature and the drift between them for every thermocouple on the unit.",
      "Upgrading happens in place. Existing schedules are copied to the kiln that last ran them, and nothing is deleted until you confirm the mapping looks right.",
    ],
  },
  glass: {
    eyebrow: "What's new",
    title: "Aurora — Shared calendars",
    start: 0.58,
    paragraphs: [
      "A shared calendar now shows who is holding each slot before you send the invite, so a room booked twice is caught while you are still choosing the time.",
      "Time zones follow the attendee, not the organiser. Everyone sees the meeting in their own zone and the invite carries the original, so travel never shifts it.",
      "Availability windows can be set per weekday. Block Friday afternoons once and the booking page stops offering them without you declining anything by hand.",
      "Recurring events keep their exceptions when the series is edited. Moving the whole series leaves a moved instance where you put it rather than snapping it back.",
      "The agenda view collapses long stretches of free time, so a day with two meetings reads as two meetings instead of eleven hours of empty rows.",
      "Notifications are batched. One digest before the first event of the day replaces a separate alert for each, with per-calendar overrides where you want them.",
    ],
  },
  skeuo: {
    eyebrow: "Operating manual",
    title: "Console MK II — Section 4: Routing",
    start: 0.74,
    paragraphs: [
      "Each channel strip leaves the preamp at unity and arrives at the summing bus through the fader. Insert points sit ahead of the fader unless the PRE switch is released.",
      "The four auxiliary sends share one pair of buses. Sends one and two are fixed pre-fader for monitoring; three and four follow the fader and are intended for effects.",
      "Solo is destructive on the monitor path only. The main outputs are unaffected, so a channel soloed during a live set never reaches the house.",
      "The talkback microphone reaches the auxiliary buses through a dedicated attenuator. Set it once during soundcheck and leave the trim alone for the rest of the session.",
      "Meter ballistics switch between peak and VU on the rear panel. Peak is recommended while tracking; VU reads closer to perceived level on mixdown.",
      "Before powering down, return all faders to the detent and disengage phantom power. The sequence protects ribbon microphones left connected overnight.",
    ],
  },
  adaptive: {
    eyebrow: "Documentation",
    title: "Nimbus — Deploying a service",
    start: 0.9,
    paragraphs: [
      "A service is deployed from a manifest committed alongside your code. The platform reads it on every push and reconciles the running fleet toward what it describes.",
      "Health checks gate the rollout. A revision that fails its check is held at zero traffic and the previous revision keeps serving until you intervene.",
      "Secrets are referenced by name and injected at start. They never appear in the manifest, in build logs, or in the environment of a build container.",
      "Traffic can be split across revisions by percentage. Send five percent to a new revision, watch the error rate, and raise it once the numbers hold.",
      "Every deploy stays reversible for thirty days. Rolling back promotes an earlier revision to full traffic without rebuilding anything from source.",
      "Regions are opt-in. Adding one copies the current revision and its configuration; usage is billed per region from the moment the first request lands.",
    ],
  },
};

export function BackToTopPreview({ material, variant, size, state }: PreviewProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const article = ARTICLES[material];

  // Park the pane part-way down so the preview opens on the disc already risen
  // with a partly traced ring, instead of an empty pane the reader has to scroll
  // before anything is visible. This only writes to the DOM — no setState — and
  // the component picks the new position up from its own scroll listener and its
  // first requestAnimationFrame reading. Re-runs per material because each one
  // ships its own copy, so both the scrollable height and the depth differ.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const range = el.scrollHeight - el.clientHeight;
    if (range <= 0) return;
    el.scrollTop = Math.round(range * ARTICLES[material].start);
  }, [material]);

  return (
    <div className="relative w-[min(460px,100%)]">
      <div
        className="h-[300px] overflow-y-auto rounded-[14px] border border-black/10 bg-black/[0.015] [scrollbar-width:thin] dark:border-white/15 dark:bg-white/[0.03]"
        ref={scrollRef}
      >
        <article className="flex flex-col gap-[14px] px-[20px] pb-[64px] pt-[20px]">
          <header className="flex flex-col gap-[4px]">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45 dark:text-white/45">
              {article.eyebrow}
            </p>
            <h3 className="m-0 text-[16px] font-semibold text-black dark:text-white">
              {article.title}
            </h3>
          </header>
          {article.paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              <p className="m-0 text-[13px] leading-[1.65] text-black/60 dark:text-white/55">
                {paragraph}
              </p>
              {index % 2 === 1 ? (
                // A figure placeholder: guarantees the pane has a real scrollable
                // range whatever width the docs column gives it.
                <div
                  aria-hidden="true"
                  className="h-[64px] rounded-[10px] border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]"
                />
              ) : null}
            </React.Fragment>
          ))}
        </article>
      </div>

      <BackToTop
        aria-busy={state === "loading" || undefined}
        // Re-anchored onto the wrapper: `absolute` replaces the component's own
        // `fixed` cleanly through tailwind-merge, and a local z keeps the disc
        // under the site chrome. The wrapper is the containing block rather than
        // the scrolling pane, so the disc stays pinned to the corner. The size
        // axis still drives the inset through --mq-btt-offset.
        className="absolute z-[2]"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        // Remounts when the material changes so the disc takes a fresh first
        // reading right after the pane has been re-parked for the new copy.
        key={material}
        label="Back to top"
        material={material}
        scrollContainerRef={scrollRef}
        size={asSize(size)}
        threshold={THRESHOLD}
        variant={asVariant(variant)}
      />
    </div>
  );
}
