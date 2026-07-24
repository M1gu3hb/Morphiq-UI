"use client";

import { SwipeCards, type SwipeCardItem } from "@/registry/ui/swipe-cards";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for Swipe Cards.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * The artwork is generated as inline SVG data URIs rather than hotlinked: the
 * site is statically generated and a preview must never depend on the network.
 * `cardArt` is a pure string builder — no clock, no randomness — so the server
 * and the client render byte-identical markup.
 */

type SwipeCardsVariant = "default";
type SwipeCardsSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SwipeCardsVariant {
  return (VARIANTS.includes(value) ? value : "default") as SwipeCardsVariant;
}

function asSize(value: string): SwipeCardsSize {
  return (SIZES.includes(value) ? value : "md") as SwipeCardsSize;
}

function dataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Abstract cover at a real 4:3, matching the image well so nothing shifts. */
function cardArt(from: string, to: string, ink: string, cx: number, cy: number, r: number): string {
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs>` +
      `<rect width="640" height="480" fill="url(#g)"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ink}" fill-opacity="0.20"/>` +
      `<path d="M0 352 L188 232 L372 330 L640 154 L640 480 L0 480 Z" fill="${ink}" fill-opacity="0.26"/>` +
      `<rect x="56" y="62" width="164" height="9" rx="4.5" fill="${ink}" fill-opacity="0.42"/>` +
      `<rect x="56" y="88" width="104" height="9" rx="4.5" fill="${ink}" fill-opacity="0.26"/>` +
      `</svg>`,
  );
}

type Deck = {
  label: string;
  progressLabel: string;
  acceptLabel: string;
  rejectLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  items: readonly SwipeCardItem[];
};

/** Copy differs per material so each recipe is shown doing real triage work. */
const COPY: Record<StyleSlug, Deck> = {
  clay: {
    label: "Residency applications",
    progressLabel: "Applications reviewed",
    acceptLabel: "Shortlist",
    rejectLabel: "Pass",
    emptyTitle: "Every application reviewed",
    emptyDescription: "Your shortlist has been saved. Restart the deck to go through it again.",
    items: [
      {
        id: "clay-1",
        title: "Nadia Ferrer",
        meta: "Hand-built vessels · Girona",
        description:
          "Six years of slab work in unglazed terracotta. Proposes a residency around locally dug clay bodies and low-fire burnishing.",
        href: "#application-nadia-ferrer",
        imageSrc: cardArt("#f7ded0", "#deb096", "#7a3a1e", 486, 132, 148),
        imageAlt: "Three unglazed terracotta vessels grouped on a warm plaster shelf",
        tags: ["Ceramics", "Portfolio complete"],
      },
      {
        id: "clay-2",
        title: "Osei Mensah",
        meta: "Press-moulded tableware · Accra",
        description:
          "Runs a four-person studio making everyday plates. Wants kiln time to test a matte slip that survives commercial dishwashers.",
        imageSrc: cardArt("#f2e2d6", "#d7ab8f", "#6d3a22", 168, 176, 132),
        imageAlt: "A stack of matte earthenware plates beside a wooden press mould",
        tags: ["Tableware", "Needs kiln time"],
      },
      {
        id: "clay-3",
        title: "Ines Duarte",
        meta: "Architectural tile · Lisbon",
        description:
          "Restores azulejo panels and casts replacements by hand. The proposal covers a public commission for a covered market.",
        imageSrc: cardArt("#f6e6da", "#e0bda3", "#83411f", 512, 328, 158),
        imageAlt: "A partly restored panel of blue and white glazed wall tiles",
        tags: ["Tile", "Public commission"],
      },
      {
        id: "clay-4",
        title: "Rowan Keeler",
        meta: "Sculptural work · Leeds",
        description:
          "Large coil-built forms fired outdoors in a pit. Asks for covered space and a second reviewer for the safety plan.",
        imageSrc: cardArt("#efe0d4", "#cfa387", "#5f3319", 220, 316, 142),
        imageAlt: "A tall coil-built ceramic form cooling beside an outdoor pit kiln",
        tags: ["Sculpture", "Safety review"],
      },
    ],
  },
  glass: {
    label: "Design portfolio review",
    progressLabel: "Portfolios reviewed",
    acceptLabel: "Advance",
    rejectLabel: "Decline",
    emptyTitle: "No portfolios left",
    emptyDescription: "Everyone in this round has a decision. Restart the deck to review them again.",
    items: [
      {
        id: "glass-1",
        title: "Ivan Solis",
        meta: "Product designer · 7 years",
        description:
          "Led the checkout rebuild at a payments company. Case study includes the failed first attempt and what it cost to unpick.",
        href: "#portfolio-ivan-solis",
        imageSrc: cardArt("#e8ecff", "#b3c0f2", "#2a2166", 474, 140, 150),
        imageAlt: "Translucent blue interface panes layered over a pale gradient field",
        tags: ["Product", "Case study"],
      },
      {
        id: "glass-2",
        title: "Mei Sasaki",
        meta: "Interaction designer · 4 years",
        description:
          "Prototypes in code. Sent a motion spec that names durations, easings and the reduced-motion fallback for every transition.",
        imageSrc: cardArt("#e4eefc", "#a9c4ec", "#1d3560", 178, 168, 136),
        imageAlt: "A frosted prototype panel showing a motion timeline in cool blue",
        tags: ["Motion", "Prototypes in code"],
      },
      {
        id: "glass-3",
        title: "Bilal Haddad",
        meta: "Design systems · 6 years",
        description:
          "Maintains a token pipeline across three platforms. Wrote the accessibility contract his team now reviews every component against.",
        imageSrc: cardArt("#eceaff", "#bdb4ee", "#31235f", 498, 336, 162),
        imageAlt: "Overlapping translucent swatch cards arranged as a token scale",
        tags: ["Systems", "Accessibility"],
      },
      {
        id: "glass-4",
        title: "Astrid Vang",
        meta: "Brand and product · 5 years",
        description:
          "Came from editorial. The type work is strong and the interaction work is thinner, which is exactly the gap this role would fill.",
        imageSrc: cardArt("#e9f0fb", "#aec6e8", "#243f66", 214, 322, 144),
        imageAlt: "A translucent editorial layout with large display type on a cool wash",
        tags: ["Brand", "Editorial"],
      },
    ],
  },
  skeuo: {
    label: "Gear inbox",
    progressLabel: "Listings reviewed",
    acceptLabel: "Watch",
    rejectLabel: "Skip",
    emptyTitle: "Inbox cleared",
    emptyDescription: "Watched listings move to your saved searches. Restart to run through them again.",
    items: [
      {
        id: "skeuo-1",
        title: "Field recorder MK II",
        meta: "$210 · Serviced, Rotterdam",
        description:
          "Metal transport, new belts, original case. Seller has the service receipt and will ship insured within the EU.",
        href: "#listing-field-recorder",
        imageSrc: cardArt("#f4f1e8", "#cdc6b6", "#3d3320", 468, 138, 146),
        imageAlt: "A portable field recorder with machined metal dials on warm greige felt",
        tags: ["Serviced", "Case included"],
      },
      {
        id: "skeuo-2",
        title: "Ribbon microphone, pair",
        meta: "$540 · As-is, Turin",
        description:
          "Matched pair from a closed radio studio. One ribbon is slack and will need retensioning before either can be used.",
        imageSrc: cardArt("#f0ece1", "#c4bcaa", "#35301f", 172, 172, 134),
        imageAlt: "Two vintage ribbon microphones resting in a lined wooden case",
        tags: ["Needs repair", "Matched pair"],
      },
      {
        id: "skeuo-3",
        title: "Eight-channel desk",
        meta: "$1,150 · Collection only, Leeds",
        description:
          "Heavy, loud, and beautifully made. Every fader was cleaned last winter; two channel LEDs are out and one pot is scratchy.",
        imageSrc: cardArt("#f2efe6", "#c9c2b1", "#403722", 506, 330, 156),
        imageAlt: "A wide analogue mixing desk with rows of faders and coloured knobs",
        tags: ["Collection only", "Minor faults"],
      },
      {
        id: "skeuo-4",
        title: "Spring reverb tank",
        meta: "$95 · Untested, Porto",
        description:
          "Pulled from a combo amp during a rebuild. Sold untested, so budget for a replacement transducer if it turns out to be dead.",
        imageSrc: cardArt("#efebdf", "#bdb5a2", "#332c1c", 226, 312, 140),
        imageAlt: "An open spring reverb tank showing its coiled springs and transducers",
        tags: ["Untested", "Parts"],
      },
    ],
  },
  adaptive: {
    label: "Feature request triage",
    progressLabel: "Requests triaged",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
    emptyTitle: "Nothing left to triage",
    emptyDescription: "Every request in this queue has a decision. Restart the deck to review them again.",
    items: [
      {
        id: "adaptive-1",
        title: "Keyboard shortcuts for the editor",
        meta: "142 votes · Filed by 31 teams",
        description:
          "Power users want the command palette bound to a key. The ask is well specified and overlaps a route we already planned.",
        href: "#request-keyboard-shortcuts",
        imageSrc: cardArt("#eeeaff", "#c1b7f3", "#241a63", 480, 136, 148),
        imageAlt: "A command palette overlay floating above a dimmed editor window",
        tags: ["Editor", "High demand"],
      },
      {
        id: "adaptive-2",
        title: "Export a workspace as JSON",
        meta: "88 votes · Filed by 12 teams",
        description:
          "Requested for backups and migrations. Cheap to build, but it exposes internal ids we would then be obliged to keep stable.",
        imageSrc: cardArt("#eaeefb", "#b6c1ea", "#1f2a5c", 176, 170, 134),
        imageAlt: "A structured data file rendered as indented rows on a cool surface",
        tags: ["Data", "API surface"],
      },
      {
        id: "adaptive-3",
        title: "Per-project notification rules",
        meta: "64 votes · Filed by 9 teams",
        description:
          "Large teams are muting everything to escape the noise. A real fix needs a settings model we do not have yet.",
        imageSrc: cardArt("#edeaf8", "#bcb2e6", "#2b2160", 502, 332, 158),
        imageAlt: "A notification settings panel with grouped rows of toggles",
        tags: ["Notifications", "Needs design"],
      },
      {
        id: "adaptive-4",
        title: "Offline drafts on mobile",
        meta: "37 votes · Filed by 5 teams",
        description:
          "Comes up from field teams on unreliable connections. Sync conflicts make this much larger than the vote count suggests.",
        imageSrc: cardArt("#e9edf7", "#b0bde3", "#1c2a55", 218, 318, 142),
        imageAlt: "A phone showing a draft document with an offline status indicator",
        tags: ["Mobile", "Large scope"],
      },
    ],
  },
};

export function SwipeCardsPreview({ material, variant, size, state }: PreviewProps) {
  const deck = COPY[material];

  return (
    <div className="flex flex-col items-start gap-[18px]">
      <SwipeCards
        acceptLabel={deck.acceptLabel}
        className="w-[min(340px,100%)]"
        data-focus={state === "focus" ? "true" : undefined}
        disabled={state === "disabled"}
        emptyDescription={deck.emptyDescription}
        emptyTitle={deck.emptyTitle}
        items={deck.items}
        label={deck.label}
        material={material}
        progressLabel={deck.progressLabel}
        rejectLabel={deck.rejectLabel}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
