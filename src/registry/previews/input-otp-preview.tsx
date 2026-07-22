"use client";

import { InputOTP } from "@/registry/ui/input-otp";
import type { PreviewProps } from "@/registry/schema";

type InputOTPVariant = "default";
type InputOTPSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): InputOTPVariant {
  return (VARIANTS.includes(value) ? value : "default") as InputOTPVariant;
}

function asSize(value: string): InputOTPSize {
  return (SIZES.includes(value) ? value : "md") as InputOTPSize;
}

export function InputOTPPreview({ material, variant, size, state }: PreviewProps) {
  const isError = state === "error";

  return (
    <div className="flex max-w-full flex-col gap-[8px]">
      <p className="m-0 text-[12px]/[1.3] font-extrabold">Verification code</p>
      <InputOTP
        key={`${material}-${isError ? "error" : "ok"}`}
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "18" : "482916"}
        disabled={state === "disabled"}
        errorText={isError ? "The code has expired. Request a new one." : undefined}
        invalid={isError}
        label="Verification code"
        material={material}
        name="verification-code"
        size={asSize(size)}
        variant={asVariant(variant)}
      />
      {!isError ? (
        <p className="m-0 text-[11px]/[1.45] opacity-75">Paste all six digits or type one at a time.</p>
      ) : null}
    </div>
  );
}
