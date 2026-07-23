"use client";

import { useState } from "react";
import { Button } from "@/registry/ui/button";
import { ResultState } from "@/registry/ui/result-state";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Result State.
 *
 * All four outcomes are shown at once, because the component's variant axis is
 * a single `default` presentation and the tone is what actually carries the
 * design. Only the leading panel is a live region: four panels announcing on
 * every switch of the docs controls would be unusable with a screen reader, so
 * the rest declare `urgency="off"` and are met by heading navigation instead.
 */

type ResultTone = "success" | "error" | "warning" | "info";
type ResultSize = "sm" | "md" | "lg";
type ResultVariant = "default";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

/** Fixed presentation order; the lead tone is hoisted out of it at render. */
const TONE_ORDER: readonly ResultTone[] = ["success", "info", "warning", "error"];

const COPY: Record<
  ResultTone,
  { title: string; description: string; action: string; secondary: string; done: string }
> = {
  success: {
    title: "Payment received",
    description:
      "Invoice MQ-4821 is settled for €2,480.00. A receipt is on its way to billing@northwind.co.",
    action: "Download receipt",
    secondary: "Back to invoices",
    done: "Receipt saved",
  },
  info: {
    title: "Export queued",
    description:
      "38 components are being packaged. We will email a download link to you when the archive is ready.",
    action: "Track export",
    secondary: "Keep browsing",
    done: "Tracking export",
  },
  warning: {
    title: "Published with warnings",
    description:
      "The release is live, but two contrast tokens fell below 4.5:1 and were shipped unchanged.",
    action: "Review 2 warnings",
    secondary: "Publish anyway",
    done: "Warnings opened",
  },
  error: {
    title: "Card was declined",
    description:
      "The issuing bank rejected the charge (code 51 — insufficient funds). No money has left your account.",
    action: "Try another card",
    secondary: "Contact support",
    done: "Retrying payment",
  },
};

function asVariant(value: string): ResultVariant {
  return (VARIANTS.includes(value) ? value : "default") as ResultVariant;
}

function asSize(value: string): ResultSize {
  return (SIZES.includes(value) ? value : "md") as ResultSize;
}

export function ResultStatePreview({ material, variant, size, state }: PreviewProps) {
  const [usedTone, setUsedTone] = useState<ResultTone | null>(null);

  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);
  const isBlocked = state === "disabled" || state === "loading";
  // `state="error"` leads with the outcome a reader came to inspect; everything
  // else leads with the happy path.
  const leadTone: ResultTone = state === "error" ? "error" : "success";
  const tones: ResultTone[] = [leadTone, ...TONE_ORDER.filter((tone) => tone !== leadTone)];

  return (
    <div className="grid w-full gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
      {tones.map((tone, index) => {
        const copy = COPY[tone];
        const isLead = index === 0;

        return (
          <ResultState
            action={
              <Button
                data-focus={isLead && state === "focus" ? "true" : undefined}
                disabled={isBlocked}
                intent="primary"
                material={material}
                onClick={() => setUsedTone(tone)}
                size="sm"
              >
                {usedTone === tone ? copy.done : copy.action}
              </Button>
            }
            aria-busy={isLead && state === "loading" ? true : undefined}
            aria-disabled={isLead && state === "disabled" ? true : undefined}
            data-focus={isLead && state === "focus" ? "true" : undefined}
            data-state={isLead && isBlocked ? state : "idle"}
            description={copy.description}
            headingLevel={3}
            key={tone}
            material={material}
            secondaryAction={
              <Button
                disabled={isBlocked}
                intent="ghost"
                material={material}
                onClick={() => setUsedTone(tone)}
                size="sm"
              >
                {copy.secondary}
              </Button>
            }
            size={resolvedSize}
            title={isLead && state === "loading" ? `Finalising: ${copy.title}` : copy.title}
            tone={tone}
            // Only the lead panel is announced; the rest would turn one docs
            // interaction into four interruptions.
            urgency={isLead ? "auto" : "off"}
            variant={resolvedVariant}
          />
        );
      })}
    </div>
  );
}
