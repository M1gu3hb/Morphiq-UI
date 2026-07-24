"use client";

import { useId } from "react";
import { InlineFeedback } from "@/registry/ui/inline-feedback";
import type { InlineFeedbackTone } from "@/registry/ui/inline-feedback";
import type { PreviewProps } from "@/registry/schema";

/**
 * Documentation preview for the Inline Feedback.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 *
 * Two things are worth seeing at once. The top block is the real job — a field
 * whose message is wired to the input with `aria-describedby` and whose slot is
 * held open with `reserveSpace`, so validating never shifts the form. The lower
 * block is the whole tone system side by side, which is what shows the glyph
 * and the tone word carrying meaning without relying on colour.
 */

type InlineFeedbackSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const TONE_SAMPLES: ReadonlyArray<{
  tone: InlineFeedbackTone;
  field: string;
  message: string;
}> = [
  {
    tone: "success",
    field: "Workspace URL",
    message: "morphiq.app/atlas is available.",
  },
  {
    tone: "error",
    field: "Card number",
    message: "This card number is 15 digits. Amex is not accepted yet.",
  },
  {
    tone: "warning",
    field: "Password",
    message: "Works, but 8 characters is weak for an admin account.",
  },
  {
    tone: "info",
    field: "Billing country",
    message: "VAT is added at checkout for EU addresses.",
  },
  {
    tone: "hint",
    field: "Display name",
    message: "Shown on invoices and in your team directory.",
  },
];

function asVariant(value: string): string {
  return VARIANTS.includes(value) ? value : "default";
}

function asSize(value: string): InlineFeedbackSize {
  return (SIZES.includes(value) ? value : "md") as InlineFeedbackSize;
}

/** The field-level message each preview state is really documenting. */
function fieldCopy(state: PreviewProps["state"]): { tone: InlineFeedbackTone; message: string } {
  if (state === "error") {
    return {
      tone: "error",
      message: "That address is already registered. Sign in instead.",
    };
  }
  if (state === "loading") {
    return { tone: "info", message: "Checking availability…" };
  }
  if (state === "disabled") {
    return { tone: "hint", message: "Locked while your invite is pending." };
  }
  if (state === "focus") {
    return { tone: "info", message: "Use the address your team invited." };
  }
  return { tone: "success", message: "That address is available." };
}

export function InlineFeedbackPreview({ material, variant, size, state }: PreviewProps) {
  const inputId = useId();
  const messageId = useId();
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);
  const copy = fieldCopy(state);
  const isDisabled = state === "disabled";
  const isBusy = state === "loading";
  const isInvalid = state === "error";

  return (
    <div
      className="flex w-full max-w-[420px] flex-col gap-[22px]"
      data-variant={resolvedVariant}
      key={material}
    >
      <div aria-busy={isBusy || undefined} className="flex flex-col gap-[6px]">
        <label
          className="text-[12px] font-bold tracking-[0.04em] text-[#55554e] uppercase dark:text-[#b9b7b0]"
          htmlFor={inputId}
        >
          Work email
        </label>
        <input
          aria-describedby={messageId}
          aria-invalid={isInvalid || undefined}
          className={[
            "w-full rounded-[10px] border px-[12px] py-[9px] text-[14px] font-medium",
            "border-[rgba(23,24,23,0.20)] bg-white text-[#1c1c19]",
            "dark:border-[rgba(241,239,233,0.24)] dark:bg-[#232421] dark:text-[#f1efe9]",
            "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#171817]",
            "dark:focus-visible:outline-[#f1efe9]",
            "disabled:cursor-not-allowed disabled:opacity-55",
            "forced-colors:border-[CanvasText]",
          ].join(" ")}
          defaultValue="rosa@atlas-studio.com"
          disabled={isDisabled}
          id={inputId}
          name="work-email"
          readOnly
          type="email"
        />
        <InlineFeedback
          data-focus={state === "focus" ? "true" : undefined}
          id={messageId}
          material={material}
          messageKey={copy.message}
          reserveSpace
          size={resolvedSize}
          tone={copy.tone}
          toneLabelHidden={!isInvalid}
        >
          {copy.message}
        </InlineFeedback>
      </div>

      <div className="flex flex-col gap-[14px]">
        {TONE_SAMPLES.map((sample) => (
          <div className="flex flex-col gap-[4px]" key={sample.tone}>
            <span className="text-[11px] font-bold tracking-[0.05em] text-[#6d6d65] uppercase dark:text-[#a3a19a]">
              {sample.field}
            </span>
            <InlineFeedback
              material={material}
              size={resolvedSize}
              tone={sample.tone}
              urgency="off"
            >
              {sample.message}
            </InlineFeedback>
          </div>
        ))}
      </div>
    </div>
  );
}
