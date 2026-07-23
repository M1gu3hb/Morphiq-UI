"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

export type StoryProgressItem = { id: string; label: string };

const STORY_KEYFRAMES = "@keyframes mq-story-progress{from{scale:0 1}to{scale:1 1}}";

const storyProgressVariants = cva(
  [
    "relative isolate overflow-hidden border border-[#343846] bg-[#11131a] text-[#f5f7ff]",
    "shadow-[0_16px_42px_rgba(4,7,15,.26)] forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        bars: "[--mq-segment-radius:999px]",
        blocks: "[--mq-segment-radius:4px]",
      },
      size: {
        sm: "rounded-[18px] p-[12px] text-[11px]",
        md: "rounded-[24px] p-[16px] text-[12px]",
        lg: "rounded-[30px] p-[20px] text-[13px]",
      },
    },
    defaultVariants: { variant: "bars", size: "md" },
  },
);

export type StoryProgressProps = Omit<React.ComponentPropsWithRef<"section">, "children"> &
  Omit<VariantProps<typeof storyProgressVariants>, "variant" | "size"> & {
    stories: readonly StoryProgressItem[];
    material?: MaterialSlug;
    variant?: "bars" | "blocks";
    size?: "sm" | "md" | "lg";
    initialIndex?: number;
    autoAdvance?: boolean;
    intervalMs?: number;
    onIndexChange?: (index: number) => void;
  };

export function StoryProgress({
  "aria-label": ariaLabel = "Story progress",
  autoAdvance = true,
  className,
  initialIndex = 0,
  intervalMs = 4200,
  material = "adaptive",
  onIndexChange,
  size = "md",
  stories,
  variant = "bars",
  ...props
}: StoryProgressProps) {
  const [index, setIndex] = React.useState(() => Math.max(0, Math.min(initialIndex, stories.length - 1)));
  const activeIndex = stories.length ? Math.min(index, stories.length - 1) : 0;
  const active = stories[activeIndex];

  function select(next: number) {
    const safe = Math.max(0, Math.min(next, stories.length - 1));
    setIndex(safe);
    onIndexChange?.(safe);
  }

  function advance() {
    if (stories.length < 2) return;
    select((activeIndex + 1) % stories.length);
  }

  return (
    <section {...props} aria-label={ariaLabel} className={cn(storyProgressVariants({ size, variant }), className)} data-material={material}>
      <style href="mq-story-progress" precedence="medium">{STORY_KEYFRAMES}</style>
      <div aria-label="Choose story" className="flex gap-[6px]" role="tablist">
        {stories.map((story, storyIndex) => {
          const completed = storyIndex < activeIndex;
          const current = storyIndex === activeIndex;
          return (
            <button
              aria-controls={`story-${story.id}`}
              aria-label={`${story.label}, story ${storyIndex + 1} of ${stories.length}`}
              aria-selected={current}
              className="relative h-[18px] flex-1 rounded-[var(--mq-segment-radius,999px)] bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white forced-colors:outline-[Highlight]"
              id={`story-tab-${story.id}`}
              key={story.id}
              onClick={() => select(storyIndex)}
              role="tab"
              type="button"
            >
              <span aria-hidden="true" className="absolute inset-y-[6px] inset-x-0 overflow-hidden rounded-[inherit] bg-white/22 forced-colors:bg-[ButtonFace]">
                <span
                  className={cn(
                    "block size-full origin-left scale-x-0 rounded-[inherit] bg-[#a8ff78] forced-colors:bg-[Highlight]",
                    completed && "scale-x-100",
                    current && !autoAdvance && "scale-x-100",
                    current && autoAdvance && "animate-[mq-story-progress_var(--mq-duration,4200ms)_linear_both]",
                    "motion-reduce:animate-none motion-reduce:scale-x-100",
                  )}
                  key={current ? activeIndex : story.id}
                  onAnimationEnd={(event) => {
                    if (event.animationName === "mq-story-progress" && current) advance();
                  }}
                  style={{ "--mq-duration": `${Math.max(1200, intervalMs)}ms` } as React.CSSProperties}
                />
              </span>
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={active ? `story-tab-${active.id}` : undefined}
        aria-live="polite"
        className="mt-[10px] flex items-center justify-between gap-[12px]"
        id={active ? `story-${active.id}` : undefined}
        role="tabpanel"
      >
        <strong>{active?.label ?? "No stories"}</strong>
        <span className="text-[#c9ceda] forced-colors:text-[CanvasText]">{stories.length ? activeIndex + 1 : 0} / {stories.length}</span>
      </div>
      {active ? <p className="sr-only">Current story: {active.label}</p> : null}
    </section>
  );
}

export { storyProgressVariants };
