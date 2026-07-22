"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/registry/ui/confirm-dialog";
import { Button } from "@/registry/ui/button";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/** Documentation preview for the Confirm Dialog. */

type ConfirmTone = "default" | "danger";
type ConfirmSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const COPY: Record<ConfirmTone, { title: string; description: string; confirm: string }> = {
  default: {
    title: "Publish these changes?",
    description:
      "The updated tokens will go live for everyone on the team as soon as you confirm.",
    confirm: "Publish",
  },
  danger: {
    title: "Delete this component?",
    description:
      "This permanently removes the component and its previews from the registry. This cannot be undone.",
    confirm: "Delete",
  },
};

function asSize(value: string): ConfirmSize {
  return (SIZES.includes(value) ? value : "md") as ConfirmSize;
}

function asVariant(value: string): string {
  return VARIANTS.includes(value) ? value : "default";
}

export function ConfirmDialogPreview({ material, variant, size, state }: PreviewProps) {
  // Uncontrolled would vanish once a reader clicks Cancel; controlled state plus
  // a real trigger keeps the modal shown on load AND fully interactive — Cancel
  // and Confirm close it, the trigger reopens it, and focus returns correctly.
  const [open, setOpen] = useState(true);

  // The registry variant axis is just "default"; the destructive path is shown
  // when the switcher forces the `error` state, so both tones are inspectable.
  const tone: ConfirmTone = state === "error" ? "danger" : "default";
  const copy = COPY[tone];
  // Referenced so the coercion helpers are exercised for every declared id.
  void asVariant(variant);
  const previewMaterial = material as StyleSlug;

  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={copy.confirm}
        description={copy.description}
        key={previewMaterial}
        material={previewMaterial}
        onOpenChange={setOpen}
        open={open}
        size={asSize(size)}
        title={copy.title}
        tone={tone}
        trigger={
          <Button intent="secondary" material={previewMaterial} size="sm">
            Open dialog
          </Button>
        }
      />
    </div>
  );
}
