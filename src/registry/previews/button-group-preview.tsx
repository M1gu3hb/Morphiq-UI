"use client";

import * as React from "react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { ButtonGroup, ButtonGroupItem } from "@/registry/ui/button-group";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Button Group.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type ButtonGroupOrientation = "horizontal" | "vertical";
type ButtonGroupSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["horizontal", "vertical"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ButtonGroupOrientation {
  return (VARIANTS.includes(value) ? value : "horizontal") as ButtonGroupOrientation;
}

function asSize(value: string): ButtonGroupSize {
  return (SIZES.includes(value) ? value : "md") as ButtonGroupSize;
}

/** Icon-only members, each with a real accessible name via aria-label. */
const ALIGNMENTS = [
  { id: "left", label: "Align left", Icon: AlignLeft },
  { id: "center", label: "Align center", Icon: AlignCenter },
  { id: "right", label: "Align right", Icon: AlignRight },
  { id: "justify", label: "Justify", Icon: AlignJustify },
] as const;

/** A short demo copy per material so each recipe is shown doing real work. */
const CAPTION: Record<StyleSlug, string> = {
  clay: "Alignment",
  glass: "Alignment",
  skeuo: "Alignment",
  adaptive: "Alignment",
};

export function ButtonGroupPreview({ material, variant, size, state }: PreviewProps) {
  const orientation = asVariant(variant);
  // A selectable toolbar (single-select). Reset when the material changes via
  // `key` on the wrapper below.
  const [selected, setSelected] = React.useState<string>("center");

  return (
    <div className="flex flex-col items-start gap-[10px]" key={material}>
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-70">
        {CAPTION[material]}
      </span>
      <ButtonGroup
        aria-label="Text alignment"
        material={material}
        size={asSize(size)}
        variant={orientation}
      >
        {ALIGNMENTS.map(({ id, label, Icon }, index) => (
          <ButtonGroupItem
            aria-label={label}
            aria-pressed={selected === id}
            data-focus={state === "focus" && index === 0 ? "true" : undefined}
            disabled={state === "disabled" && index === ALIGNMENTS.length - 1}
            key={id}
            onClick={() => setSelected(id)}
          >
            <Icon aria-hidden="true" className="size-[1.05em] shrink-0" />
          </ButtonGroupItem>
        ))}
      </ButtonGroup>
    </div>
  );
}
