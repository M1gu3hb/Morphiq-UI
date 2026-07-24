"use client";

import { PostCard } from "@/registry/ui/post-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Post Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Every image is an inlined SVG data URI. The docs build is static and must not
 * depend on the network, so nothing here hotlinks a remote placeholder.
 */

type PostCardVariant = "default";
type PostCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PostCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as PostCardVariant;
}

function asSize(value: string): PostCardSize {
  return (SIZES.includes(value) ? value : "md") as PostCardSize;
}

/** Percent-encodes an SVG so it survives as a `data:` URI in an `<img src>`. */
function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function avatarUri(back: string, shape: string): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" fill="${back}"/>` +
      `<circle cx="48" cy="37" r="17" fill="${shape}"/>` +
      `<path d="M14 96c0-19 15-31 34-31s34 12 34 31z" fill="${shape}"/>` +
      `</svg>`,
  );
}

function mediaUri(back: string, ink: string, accent: string): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">` +
      `<rect width="640" height="360" fill="${back}"/>` +
      `<circle cx="470" cy="96" r="52" fill="${accent}"/>` +
      `<path d="M0 268l150-96 118 74 126-118 246 150v82H0z" fill="${ink}"/>` +
      `<path d="M0 300l190-64 158 52 292-70v142H0z" fill="${accent}" opacity="0.55"/>` +
      `</svg>`,
  );
}

type PostSample = {
  authorName: string;
  authorHandle: string;
  avatar: string;
  media: string;
  mediaAlt: string;
  content: string;
  timestamp: string;
  timestampLabel: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  reply: {
    authorName: string;
    authorHandle: string;
    avatar: string;
    content: string;
    timestamp: string;
    timestampLabel: string;
    likeCount: number;
    commentCount: number;
  };
};

/** Copy differs per material so each recipe is shown carrying a real post. */
const COPY: Record<StyleSlug, PostSample> = {
  clay: {
    authorName: "Marta Ibáñez",
    authorHandle: "@marta.throws",
    avatar: avatarUri("#e8cdbc", "#a9765a"),
    media: mediaUri("#f1dccd", "#a9765a", "#c98d63"),
    mediaAlt: "Six unglazed bowls drying on a wooden board beside a kiln",
    content:
      "Opened the kiln at 6am and every single bowl survived the cone 6 firing.\nThe glaze pooled exactly where I wanted it for once.",
    timestamp: "2026-07-21T06:40:00Z",
    timestampLabel: "Jul 21, 6:40 AM",
    likeCount: 40,
    commentCount: 12,
    shareCount: 4,
    reply: {
      authorName: "Tobias Renner",
      authorHandle: "@tobi.kiln",
      avatar: avatarUri("#dcc4b2", "#8a5a41"),
      content: "That pooling is unreal. What was your hold time at the top?",
      timestamp: "2026-07-21T07:05:00Z",
      timestampLabel: "Jul 21, 7:05 AM",
      likeCount: 9,
      commentCount: 2,
    },
  },
  glass: {
    authorName: "Nadia Okonkwo",
    authorHandle: "@nadia.builds",
    avatar: avatarUri("#cfe0e6", "#3f6d7d"),
    media: mediaUri("#dcebf0", "#3f6d7d", "#7aa9b8"),
    mediaAlt: "A frosted glass facade catching low morning light across a courtyard",
    content:
      "Spent the morning measuring how much light the frosted facade actually lets through.\nAnswer: more than the spec sheet promised.",
    timestamp: "2026-07-20T11:12:00Z",
    timestampLabel: "Jul 20, 11:12 AM",
    likeCount: 214,
    commentCount: 31,
    shareCount: 18,
    reply: {
      authorName: "Priya Raman",
      authorHandle: "@priya.light",
      avatar: avatarUri("#c3d8de", "#2f5a68"),
      content: "Did you measure at noon too? The falloff after 2pm is the part that bit us.",
      timestamp: "2026-07-20T12:02:00Z",
      timestampLabel: "Jul 20, 12:02 PM",
      likeCount: 27,
      commentCount: 5,
    },
  },
  skeuo: {
    authorName: "Hal Brenner",
    authorHandle: "@halb.tape",
    avatar: avatarUri("#d9d5cb", "#5d5a51"),
    media: mediaUri("#e6e3da", "#5d5a51", "#9a968c"),
    mediaAlt: "A dismantled cassette deck with its transport belt laid out on a workbench",
    content:
      "Belt replaced, heads cleaned, azimuth set by ear against a 10kHz tone.\nThe deck plays like 1983 again.",
    timestamp: "2026-07-19T20:35:00Z",
    timestampLabel: "Jul 19, 8:35 PM",
    likeCount: 1284,
    commentCount: 96,
    shareCount: 42,
    reply: {
      authorName: "Ines Duarte",
      authorHandle: "@ines.hifi",
      avatar: avatarUri("#cfcbc1", "#4b4842"),
      content: "By ear! Respect. I still can't do azimuth without the scope.",
      timestamp: "2026-07-19T21:10:00Z",
      timestampLabel: "Jul 19, 9:10 PM",
      likeCount: 61,
      commentCount: 7,
    },
  },
  adaptive: {
    authorName: "June Park",
    authorHandle: "@junepark",
    avatar: avatarUri("#e4e3de", "#5a5a53"),
    media: mediaUri("#efeeea", "#4a4a44", "#8d8d84"),
    mediaAlt: "Two screenshots of the same dashboard, one in a light theme and one in a dark theme",
    content:
      "Shipped the theme pass today. Same component, two palettes, one contrast budget.\nNothing switches on colour alone any more.",
    timestamp: "2026-07-22T15:48:00Z",
    timestampLabel: "Jul 22, 3:48 PM",
    likeCount: 372,
    commentCount: 44,
    shareCount: 27,
    reply: {
      authorName: "Sam Whitfield",
      authorHandle: "@samw",
      avatar: avatarUri("#d7d6d1", "#46463f"),
      content: "The contrast budget line is the whole trick. Stealing it for our design review.",
      timestamp: "2026-07-22T16:20:00Z",
      timestampLabel: "Jul 22, 4:20 PM",
      likeCount: 88,
      commentCount: 11,
    },
  },
};

export function PostCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];

  return (
    <div className="flex w-full flex-col items-start gap-[18px]">
      {/* Linked post with media: the whole surface leads to the permalink while
          like / comment / share stay independently clickable. */}
      <PostCard
        authorHandle={copy.authorHandle}
        authorName={copy.authorName}
        avatarSrc={copy.avatar}
        className="w-[min(420px,100%)]"
        commentCount={copy.commentCount}
        content={copy.content}
        data-focus={state === "focus" ? "true" : undefined}
        defaultLikeCount={copy.likeCount}
        disabled={state === "disabled"}
        headingLevel={3}
        href="#post"
        material={material}
        mediaAlt={copy.mediaAlt}
        mediaAspect="16/9"
        mediaSrc={copy.media}
        shareCount={copy.shareCount}
        size={asSize(size)}
        timestamp={copy.timestamp}
        timestampLabel={copy.timestampLabel}
        variant={asVariant(variant)}
        verified
      />

      {/* Inert reply, already liked: no whole-card link, so the card is not
          outlined on :focus-within and only the buttons take focus. */}
      <PostCard
        authorHandle={copy.reply.authorHandle}
        authorName={copy.reply.authorName}
        avatarSrc={copy.reply.avatar}
        className="w-[min(420px,100%)]"
        commentCount={copy.reply.commentCount}
        content={copy.reply.content}
        defaultLikeCount={copy.reply.likeCount}
        defaultLiked
        disabled={state === "disabled"}
        headingLevel={3}
        material={material}
        size={asSize(size)}
        timestamp={copy.reply.timestamp}
        timestampLabel={copy.reply.timestampLabel}
        variant={asVariant(variant)}
      />
    </div>
  );
}
