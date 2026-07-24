"use client";

import { Download, Pencil, Trash2 } from "lucide-react";
import { FileCard, formatFileSize, type FileCardAction, type FileKind } from "@/registry/ui/file-card";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the File Card.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding
 * used to document it.
 */

type FileCardVariant = "default";
type FileCardSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FileCardVariant {
  return (VARIANTS.includes(value) ? value : "default") as FileCardVariant;
}

function asSize(value: string): FileCardSize {
  return (SIZES.includes(value) ? value : "md") as FileCardSize;
}

/**
 * Inline SVG thumbnail as a `data:` URI. The docs build is static and must not
 * depend on the network, so nothing is hotlinked.
 */
const THUMBNAIL_SRC =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2096%2096'%3E" +
  "%3Crect%20width='96'%20height='96'%20fill='%23bcd0d8'/%3E" +
  "%3Ccircle%20cx='30'%20cy='27'%20r='11'%20fill='%23f2c56d'/%3E" +
  "%3Cpath%20d='M0%2080%20L28%2046%20L52%2070%20L70%2052%20L96%2080%20Z'%20fill='%235c7a63'/%3E" +
  "%3C/svg%3E";

/**
 * Dates arrive as PROPS — an ISO string for `<time dateTime>` and a display
 * string beside it. Nothing calls `Date.now()` during render, so the statically
 * generated page and the hydrated one always agree.
 */
type FileSample = {
  name: string;
  fileType: string;
  bytes: number;
  kind: FileKind;
  modifiedIso: string;
  modifiedLabel: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
};

const COPY: Record<StyleSlug, { primary: FileSample; secondary: FileSample }> = {
  clay: {
    primary: {
      name: "Spring range — studio brief.pdf",
      fileType: "PDF document",
      bytes: 2_517_000,
      kind: "pdf",
      modifiedIso: "2026-03-04T09:12:00Z",
      modifiedLabel: "4 Mar 2026",
    },
    secondary: {
      name: "Glaze tests, batch 12.zip",
      fileType: "ZIP archive",
      bytes: 48_300_000,
      kind: "archive",
      modifiedIso: "2026-02-19T16:40:00Z",
      modifiedLabel: "19 Feb 2026",
    },
  },
  glass: {
    primary: {
      name: "Ridge line at first light.jpg",
      fileType: "JPEG image",
      bytes: 6_180_000,
      kind: "image",
      modifiedIso: "2026-05-11T07:05:00Z",
      modifiedLabel: "11 May 2026",
      thumbnailSrc: THUMBNAIL_SRC,
      thumbnailAlt: "A sunlit ridge line above a green valley at dawn",
    },
    secondary: {
      name: "Site survey notes.docx",
      fileType: "Word document",
      bytes: 184_000,
      kind: "doc",
      modifiedIso: "2026-05-09T13:22:00Z",
      modifiedLabel: "9 May 2026",
    },
  },
  skeuo: {
    primary: {
      name: "Room tone — hall, take 3.wav",
      fileType: "WAV audio",
      bytes: 92_400_000,
      kind: "audio",
      modifiedIso: "2026-01-27T21:48:00Z",
      modifiedLabel: "27 Jan 2026",
    },
    secondary: {
      name: "Console faceplate.step",
      fileType: "STEP model",
      bytes: 12_900_000,
      kind: "generic",
      modifiedIso: "2026-01-22T11:03:00Z",
      modifiedLabel: "22 Jan 2026",
    },
  },
  adaptive: {
    primary: {
      name: "Q2 headcount plan.xlsx",
      fileType: "Spreadsheet",
      bytes: 738_000,
      kind: "sheet",
      modifiedIso: "2026-04-02T08:30:00Z",
      modifiedLabel: "2 Apr 2026",
    },
    secondary: {
      name: "deploy-pipeline.ts",
      fileType: "TypeScript source",
      bytes: 21_400,
      kind: "code",
      modifiedIso: "2026-03-30T18:15:00Z",
      modifiedLabel: "30 Mar 2026",
    },
  },
};

function buildActions(fileName: string): FileCardAction[] {
  return [
    {
      id: "download",
      label: "Download",
      icon: <Download aria-hidden="true" />,
      announcement: `Download started for ${fileName}`,
    },
    {
      id: "rename",
      label: "Rename",
      icon: <Pencil aria-hidden="true" />,
      announcement: `Rename opened for ${fileName}`,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 aria-hidden="true" />,
      destructive: true,
      announcement: `Delete confirmation opened for ${fileName}`,
    },
  ];
}

export function FileCardPreview({ material, variant, size, state }: PreviewProps) {
  const { primary, secondary } = COPY[material];
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);
  const isDisabled = state === "disabled";

  return (
    <ul className="m-0 flex w-full list-none flex-col gap-[12px] p-0">
      {[primary, secondary].map((file, index) => (
        <li key={file.name} className="w-[min(430px,100%)]">
          <FileCard
            actions={buildActions(file.name)}
            data-focus={index === 0 && state === "focus" ? "true" : undefined}
            disabled={isDisabled}
            fileSize={formatFileSize(file.bytes)}
            fileType={file.fileType}
            href="#file"
            kind={file.kind}
            material={material}
            modifiedIso={file.modifiedIso}
            modifiedLabel={file.modifiedLabel}
            name={file.name}
            size={resolvedSize}
            thumbnailAlt={file.thumbnailAlt}
            thumbnailSrc={file.thumbnailSrc}
            variant={resolvedVariant}
          />
        </li>
      ))}
    </ul>
  );
}
