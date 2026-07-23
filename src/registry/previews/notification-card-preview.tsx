"use client";

import { NotificationCard } from "@/registry/ui/notification-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Notification Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type NotificationCardVariant = "default";
type NotificationCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): NotificationCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as NotificationCardVariant;
}

function asSize(value: string): NotificationCardSize {
  return (SIZES.includes(value) ? value : "md") as NotificationCardSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<
  StyleSlug,
  { actor: string; message: string; seed: string; alt: string }
> = {
  clay: {
    actor: "Priya Nair",
    message: "requested access to the Atlas workspace and is waiting on your review.",
    seed: "priya",
    alt: "Priya Nair",
  },
  glass: {
    actor: "Deploy bot",
    message: "finished rolling out v2.4 to production. All health checks are green.",
    seed: "deploybot",
    alt: "Deploy bot",
  },
  skeuo: {
    actor: "Marcus Bell",
    message: "left three comments on the mastering notes for Channel A.",
    seed: "marcus",
    alt: "Marcus Bell",
  },
  adaptive: {
    actor: "Billing",
    message: "an invoice for $1,280 is awaiting approval before the cycle closes.",
    seed: "billing",
    alt: "Billing",
  },
};

const noop = () => {};

export function NotificationCardPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const isDisabled = state === "disabled";
  const focus = state === "focus" ? "true" : undefined;

  return (
    <div className="flex w-[min(400px,100%)] flex-col gap-[16px]">
      {/* Meaningful avatar + success tone. */}
      <NotificationCard
        actor={copy.actor}
        avatarAlt={`${copy.alt} avatar`}
        avatarSrc={`https://picsum.photos/seed/${copy.seed}/96/96`}
        data-focus={focus}
        dateTime="2026-07-22T09:41:00Z"
        disabled={isDisabled}
        material={material}
        onAccept={noop}
        onDismiss={noop}
        size={resolvedSize}
        timeLabel="2m ago"
        tone="success"
        variant={resolvedVariant}
      >
        <p>{copy.message}</p>
      </NotificationCard>

      {/* Leading tone icon (no avatar) + warning tone, dismiss only. */}
      <NotificationCard
        actor="Storage"
        data-focus={focus}
        dateTime="2026-07-22T08:12:00Z"
        disabled={isDisabled}
        live
        material={material}
        onDismiss={noop}
        size={resolvedSize}
        timeLabel="1h ago"
        tone="warning"
        variant={resolvedVariant}
      >
        <p>You have used 92% of your plan&rsquo;s storage. Archive old assets to free space.</p>
      </NotificationCard>
    </div>
  );
}
