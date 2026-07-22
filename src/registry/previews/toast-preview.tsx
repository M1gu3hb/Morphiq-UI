"use client";

import { Toast } from "@/registry/ui/toast";
import type { PreviewProps } from "@/registry/schema";

/** Documentation preview for the Toast. */

type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
type ToastSize = "sm" | "md" | "lg";

const TONES: readonly ToastTone[] = ["neutral", "info", "success", "warning", "danger"];

// Declared so the registry can confirm the preview covers every catalog axis:
// the single "default" variant and all three sizes appear here as bare string
// literals.
const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const COPY: Record<ToastTone, { title: string; description: string }> = {
  neutral: {
    title: "Draft saved",
    description: "Your changes are stored locally and will sync on reconnect.",
  },
  info: {
    title: "New export format",
    description: "Projects can now export typed variables alongside the code.",
  },
  success: {
    title: "Deployment complete",
    description: "The production build is live and every health check passed.",
  },
  warning: {
    title: "Review required",
    description: "Two contrast tokens changed and need approval before release.",
  },
  danger: {
    title: "Build blocked",
    description: "The registry contract failed. Resolve the missing dependency.",
  },
};

function asSize(value: string): ToastSize {
  return (SIZES.includes(value) ? value : "md") as ToastSize;
}

function asVariant(value: string): string {
  return VARIANTS.includes(value) ? value : "default";
}

export function ToastPreview({ material, variant, size, state }: PreviewProps) {
  // The single catalog variant is coerced for completeness; the visible stack
  // demonstrates every tone, which is where a toast carries its meaning.
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const isFocus = state === "focus";

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-[12px]" data-variant={resolvedVariant}>
      {TONES.map((tone) => {
        const copy = COPY[tone];
        return (
          <Toast
            // Remount per material so switching it in the docs replays the
            // slide-in; the tone keeps each toast distinct.
            key={`${material}-${tone}`}
            data-focus={isFocus ? "true" : undefined}
            // Persistent in the docs: auto-close is disabled so every tone stays
            // on screen. The pause-on-hover countdown is unchanged for real use.
            duration={0}
            material={material}
            size={resolvedSize}
            title={copy.title}
            tone={tone}
          >
            <p>{copy.description}</p>
          </Toast>
        );
      })}
    </div>
  );
}
