"use client";

import { FileUpload } from "@/registry/ui/file-upload";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the File Upload.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Seeded files use the plain `{ name, size }` shape rather than real `File`
 * objects. That keeps the preview identical on the server and the client — a
 * `new File()` would throw during SSR — so there is no hydration mismatch, and
 * the `loading` state can still show a per-row progress meter.
 */

type FileUploadVariant = "default";
type FileUploadSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FileUploadVariant {
  return (VARIANTS.includes(value) ? value : "default") as FileUploadVariant;
}

function asSize(value: string): FileUploadSize {
  return (SIZES.includes(value) ? value : "md") as FileUploadSize;
}

type MaterialCopy = {
  label: string;
  description: string;
  files: { name: string; size: number }[];
  progress: Record<string, number>;
  errorText: string;
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, MaterialCopy> = {
  clay: {
    label: "Project attachments",
    description: "PNG, JPG or PDF, up to 10 MB each.",
    files: [
      { name: "moodboard.png", size: 2_411_520 },
      { name: "brand-guidelines.pdf", size: 8_650_752 },
    ],
    progress: { "moodboard.png": 100, "brand-guidelines.pdf": 46 },
    errorText: "sketch.psd is 24 MB — the limit is 10 MB.",
  },
  glass: {
    label: "Session recordings",
    description: "MP4 or MOV, up to 500 MB each.",
    files: [
      { name: "kickoff-call.mp4", size: 154_140_672 },
      { name: "walkthrough.mov", size: 268_435_456 },
    ],
    progress: { "kickoff-call.mp4": 100, "walkthrough.mov": 72 },
    errorText: "notes.txt isn't a supported video format.",
  },
  skeuo: {
    label: "Firmware bundle",
    description: "BIN or HEX, up to 32 MB each.",
    files: [
      { name: "controller-v4.bin", size: 12_582_912 },
      { name: "bootloader.hex", size: 786_432 },
    ],
    progress: { "controller-v4.bin": 88, "bootloader.hex": 100 },
    errorText: "readme.md isn't a supported firmware format.",
  },
  adaptive: {
    label: "Invoice documents",
    description: "PDF or CSV, up to 5 MB each.",
    files: [
      { name: "invoice-2026-07.pdf", size: 342_016 },
      { name: "line-items.csv", size: 51_200 },
    ],
    progress: { "invoice-2026-07.pdf": 100, "line-items.csv": 61 },
    errorText: "scan.tiff is 9 MB — the limit is 5 MB.",
  },
};

export function FileUploadPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";
  const isLoading = state === "loading";

  return (
    <div className="w-[min(420px,100%)]">
      <FileUpload
        // Reset the seeded list when the material switches under the preview.
        key={material}
        data-focus={state === "focus" ? "true" : undefined}
        defaultFiles={copy.files}
        description={copy.description}
        disabled={state === "disabled"}
        errorText={isError ? copy.errorText : undefined}
        invalid={isError}
        label={copy.label}
        material={material}
        progress={isLoading ? copy.progress : undefined}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
