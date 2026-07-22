"use client";

import { PasswordStrength } from "@/registry/ui/password-strength";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for Password Strength.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * `error` sets `aria-invalid` and an error message on a genuinely weak value so
 * the invalid look can be inspected; `focus` forces the ring via `data-focus`;
 * `disabled` disables the field. `loading` has no meaning for a password field,
 * so it falls through to the default render.
 */

type PasswordVariant = "default" | "filled";
type PasswordSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "filled"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): PasswordVariant {
  return (VARIANTS.includes(value) ? value : "default") as PasswordVariant;
}

function asSize(value: string): PasswordSize {
  return (SIZES.includes(value) ? value : "md") as PasswordSize;
}

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, { label: string; placeholder: string; helper: string; seed: string }> =
  {
    clay: {
      label: "New password",
      placeholder: "At least 12 characters",
      helper: "Mix letters, numbers and symbols.",
      seed: "Sunrise-Meadow-92!",
    },
    glass: {
      label: "Account password",
      placeholder: "Choose a strong password",
      helper: "Longer beats complicated.",
      seed: "Glass-Harbor-4417$",
    },
    skeuo: {
      label: "Master password",
      placeholder: "Type a new password",
      helper: "Avoid words you have reused.",
      seed: "Copper-Lathe-8",
    },
    adaptive: {
      label: "Login password",
      placeholder: "Enter a new password",
      helper: "12+ characters recommended.",
      seed: "Adaptive-Night-77#",
    },
  };

export function PasswordStrengthPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";

  return (
    <div className="w-[min(360px,100%)]">
      <PasswordStrength
        data-focus={state === "focus" ? "true" : undefined}
        defaultValue={isError ? "abc" : copy.seed}
        disabled={state === "disabled"}
        errorText={isError ? "Password is too weak. Add length and variety." : undefined}
        helperText={copy.helper}
        key={material}
        label={copy.label}
        material={material}
        placeholder={copy.placeholder}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
