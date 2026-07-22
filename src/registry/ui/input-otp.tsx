"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Input OTP
 *
 * A row of native numeric text inputs with one shared value. The component
 * keeps the browser's focus, autocomplete and form behaviours, then adds the
 * OTP-specific choreography: advance on entry, retreat on Backspace and
 * distribute a full pasted code. No hidden JavaScript input proxy is involved.
 *
 * Local theming knobs:
 *
 *   --mq-slot        resting slot surface
 *   --mq-slot-focus  focused slot surface
 *   --mq-text        digit colour
 *   --mq-brd         resting boundary
 *   --mq-brd-focus   focused boundary
 *   --mq-edge        tactile side wall
 *   --mq-ring        keyboard focus outline
 *   --mq-error       invalid state
 */

const otpGroupVariants = cva("inline-flex max-w-full items-center", {
  variants: {
    material: {
      clay: [
        "[--mq-slot:#f7e9de] [--mq-slot-focus:#fff3ea] [--mq-text:#33261e]",
        "[--mq-brd:#9b6750] [--mq-brd-focus:#9c2f22] [--mq-edge:#d5b8a3]",
        "[--mq-ring:#171817] [--mq-error:#9c2f22]",
      ].join(" "),
      glass: [
        "[--mq-slot:rgba(255,255,255,0.82)] [--mq-slot-focus:rgba(255,255,255,0.94)] [--mq-text:#1e1e1b]",
        "[--mq-brd:rgba(23,24,23,0.62)] [--mq-brd-focus:#171817] [--mq-edge:rgba(255,255,255,0.78)]",
        "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
      ].join(" "),
      skeuo: [
        "[--mq-slot:#e6e3da] [--mq-slot-focus:#f2efe7] [--mq-text:#23231f]",
        "[--mq-brd:#77746d] [--mq-brd-focus:#4a4943] [--mq-edge:#a8a49b]",
        "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
      ].join(" "),
      adaptive: [
        "[--mq-slot:#ffffff] [--mq-slot-focus:#f1f0ec] [--mq-text:#1c1c19]",
        "[--mq-brd:#76766f] [--mq-brd-focus:#171817] [--mq-edge:transparent]",
        "[--mq-ring:#171817] [--mq-error:#9c2f22]",
        "dark:[--mq-slot:#232327] dark:[--mq-slot-focus:#2b2b31] dark:[--mq-text:#f1efe9]",
        "dark:[--mq-brd:#a9a8a2] dark:[--mq-brd-focus:#f1efe9] dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
      ].join(" "),
    },
    size: {
      sm: "gap-[6px]",
      md: "gap-[8px]",
      lg: "gap-[10px]",
    },
  },
  defaultVariants: { material: "clay", size: "md" },
});

/** Error text sits beside the slot group, so it repeats the one inherited token. */
const OTP_ERROR_TOKENS = {
  clay: "[--mq-error:#9c2f22]",
  glass: "[--mq-error:#8f2a1e]",
  skeuo: "[--mq-error:#8f2a1e]",
  adaptive: "[--mq-error:#9c2f22] dark:[--mq-error:#ff9d8e]",
} as const;

const otpSlotVariants = cva(
  [
    "block shrink-0 appearance-none border text-center font-extrabold tabular-nums caret-transparent",
    "text-[color:var(--mq-text,#33261e)]",
    "[background-color:var(--mq-slot,#f7e9de)]",
    "border-[var(--mq-brd,#9b6750)]",
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "hover:[background-color:var(--mq-slot-focus,#fff3ea)]",
    "focus-visible:[background-color:var(--mq-slot-focus,#fff3ea)]",
    "focus-visible:border-[var(--mq-brd-focus,#9c2f22)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px]",
    "focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:[background-color:var(--mq-slot-focus,#fff3ea)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#9c2f22)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "aria-[invalid=true]:border-[var(--mq-error,#9c2f22)]",
    "aria-[invalid=true]:focus-visible:outline-[var(--mq-error,#9c2f22)]",
    "disabled:cursor-not-allowed disabled:opacity-55",
    "motion-reduce:transition-none",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Field] forced-colors:text-[FieldText]",
    "forced-colors:shadow-none forced-colors:backdrop-filter-none",
    "forced-colors:focus-visible:outline-[Highlight]",
    "forced-colors:aria-[invalid=true]:border-[Mark]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [
          "shadow-[inset_0_2px_3px_rgba(255,255,255,0.72),inset_0_-3px_5px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_3px_0_var(--mq-edge,#d5b8a3),0_6px_11px_rgba(90,60,45,0.14)]",
          "hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.82),inset_0_-3px_5px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#d5b8a3),0_9px_15px_rgba(90,60,45,0.18)]",
          "focus-visible:shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(140,90,60,0.1),inset_0_4px_8px_rgba(120,60,40,0.25),0_1px_0_var(--mq-edge,#d5b8a3),0_2px_4px_rgba(90,60,45,0.1)]",
          "data-[focus=true]:shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(140,90,60,0.1),inset_0_4px_8px_rgba(120,60,40,0.25),0_1px_0_var(--mq-edge,#d5b8a3),0_2px_4px_rgba(90,60,45,0.1)]",
        ].join(" "),
        glass: [
          "backdrop-blur-[16px] backdrop-saturate-[165%]",
          "shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.78)),inset_0_0_0_rgba(24,20,40,0),0_7px_18px_rgba(24,20,40,0.17)]",
          "hover:backdrop-blur-[20px] hover:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.78)),inset_0_0_0_rgba(24,20,40,0),0_10px_24px_rgba(24,20,40,0.22)]",
          "focus-visible:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.78)),inset_0_5px_11px_rgba(24,20,40,0.2),0_2px_5px_rgba(24,20,40,0.12)]",
          "data-[focus=true]:shadow-[inset_0_1px_0_var(--mq-edge,rgba(255,255,255,0.78)),inset_0_5px_11px_rgba(24,20,40,0.2),0_2px_5px_rgba(24,20,40,0.12)]",
        ].join(" "),
        skeuo: [
          "[background-image:linear-gradient(180deg,#f2efe7,var(--mq-slot,#e6e3da))]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-3px_5px_rgba(0,0,0,0.13),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_6px_11px_rgba(38,36,31,0.22)]",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_4px_0_var(--mq-edge,#a8a49b),0_9px_16px_rgba(38,36,31,0.26)]",
          "focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_5px_11px_rgba(0,0,0,0.3),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.16)]",
          "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_5px_11px_rgba(0,0,0,0.3),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.16)]",
          "forced-colors:[background-image:none]",
        ].join(" "),
        adaptive: [
          "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.1)]",
          "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_5px_14px_rgba(20,20,18,0.14)]",
          "focus-visible:shadow-[inset_0_4px_8px_rgba(20,20,18,0.16),0_1px_2px_rgba(20,20,18,0.08)]",
          "data-[focus=true]:shadow-[inset_0_4px_8px_rgba(20,20,18,0.16),0_1px_2px_rgba(20,20,18,0.08)]",
          "pointer-coarse:min-h-[48px] pointer-coarse:min-w-[44px]",
        ].join(" "),
      },
      variant: {
        default: "",
      },
      size: {
        sm: "size-[36px] rounded-[10px] text-[15px]/[1]",
        md: "size-[44px] rounded-[13px] text-[18px]/[1]",
        lg: "size-[52px] rounded-[16px] text-[21px]/[1]",
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

type InputOTPMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type InputOTPVariant = "default";
type InputOTPSize = "sm" | "md" | "lg";

export type InputOTPProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  /** Number of visible slots. Clamped to 1…10. */
  length?: number;
  /** Controlled code. Non-digits are discarded. */
  value?: string;
  /** Initial code for the uncontrolled path. */
  defaultValue?: string;
  /** Emits the complete code represented by the slots after every edit. */
  onValueChange?: (value: string) => void;
  /** Accessible base label used by the group and each numbered slot. */
  label?: string;
  /** Optional form field name; submitted once through a native hidden input. */
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: React.ReactNode;
  "data-focus"?: "true" | "false";
  slotClassName?: string;
  material?: InputOTPMaterial;
  variant?: InputOTPVariant;
  size?: InputOTPSize;
};

function digits(value: string, length: number) {
  return value.replace(/\D/g, "").slice(0, length);
}

function toSlots(value: string, length: number) {
  const clean = digits(value, length);
  return Array.from({ length }, (_, index) => clean[index] ?? "");
}

export function InputOTP({
  "aria-describedby": ariaDescribedBy,
  "data-focus": dataFocus,
  className,
  defaultValue = "",
  disabled = false,
  errorText,
  invalid = false,
  label = "One-time code",
  length = 6,
  material = "clay",
  name,
  onValueChange,
  size = "md",
  slotClassName,
  value,
  variant = "default",
  ...props
}: InputOTPProps) {
  const slotCount = Math.min(10, Math.max(1, Math.floor(length) || 1));
  const [uncontrolledSlots, setUncontrolledSlots] = React.useState(() =>
    toSlots(defaultValue, slotCount),
  );
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const generatedId = React.useId();
  const errorId = `${generatedId}-error`;
  const controlled = value !== undefined;
  const slots = controlled
    ? toSlots(value, slotCount)
    : Array.from({ length: slotCount }, (_, index) => uncontrolledSlots[index] ?? "");
  const hasError =
    invalid || (typeof errorText === "string" ? errorText.trim() !== "" : errorText != null);
  const describedBy = [ariaDescribedBy, errorText != null ? errorId : null]
    .filter(Boolean)
    .join(" ");
  const forceFocus = dataFocus === "true";

  function focusSlot(index: number) {
    const input = inputRefs.current[Math.min(slotCount - 1, Math.max(0, index))];
    input?.focus();
    input?.select();
  }

  function commit(nextSlots: string[], focusIndex?: number) {
    const normalized = Array.from({ length: slotCount }, (_, index) => nextSlots[index] ?? "");
    if (!controlled) setUncontrolledSlots(normalized);
    onValueChange?.(normalized.join(""));
    if (focusIndex !== undefined) focusSlot(focusIndex);
  }

  function writeDigits(index: number, incomingValue: string) {
    const incoming = digits(incomingValue, slotCount);
    if (incoming.length === 0) {
      const next = [...slots];
      next[index] = "";
      commit(next);
      return;
    }

    const start = incoming.length >= slotCount ? 0 : index;
    const next = incoming.length >= slotCount ? Array.from({ length: slotCount }, () => "") : [...slots];
    for (let offset = 0; offset < incoming.length && start + offset < slotCount; offset += 1) {
      next[start + offset] = incoming[offset];
    }
    commit(next, Math.min(start + incoming.length, slotCount - 1));
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...slots];
      if (next[index]) {
        next[index] = "";
        commit(next, index);
      } else if (index > 0) {
        next[index - 1] = "";
        commit(next, index - 1);
      }
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      const next = [...slots];
      next[index] = "";
      commit(next, index);
      return;
    }

    const nextIndex =
      event.key === "ArrowLeft"
        ? index - 1
        : event.key === "ArrowRight"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? slotCount - 1
              : null;
    if (nextIndex !== null) {
      event.preventDefault();
      focusSlot(nextIndex);
    }
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = digits(event.clipboardData.getData("text"), slotCount);
    if (!pasted) return;
    event.preventDefault();
    writeDigits(index, pasted);
  }

  return (
    <div
      {...props}
      className={cn(
        "inline-flex max-w-full flex-col gap-[7px]",
        OTP_ERROR_TOKENS[material],
        className,
      )}
      data-focus={dataFocus}
    >
      <div
        aria-describedby={describedBy || undefined}
        aria-label={label}
        className={cn(otpGroupVariants({ material, size }))}
        data-material={material}
        role="group"
      >
        {slots.map((digit, index) => (
          <input
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError || undefined}
            aria-label={`${label}, digit ${index + 1} of ${slotCount}`}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            className={cn(otpSlotVariants({ material, size, variant }), slotClassName)}
            data-focus={forceFocus && index === 0 ? "true" : undefined}
            disabled={disabled}
            enterKeyHint={index === slotCount - 1 ? "done" : "next"}
            inputMode="numeric"
            key={index}
            maxLength={slotCount}
            onChange={(event) => writeDigits(index, event.currentTarget.value)}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            pattern="[0-9]*"
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            type="text"
            value={digit}
          />
        ))}
      </div>
      {name ? <input disabled={disabled} name={name} type="hidden" value={slots.join("")} /> : null}
      {errorText != null ? (
        <p
          aria-live="polite"
          className="m-0 text-[11px]/[1.45] font-bold text-[color:var(--mq-error,#9c2f22)]"
          id={errorId}
        >
          {errorText}
        </p>
      ) : null}
    </div>
  );
}

export { otpGroupVariants, otpSlotVariants };
