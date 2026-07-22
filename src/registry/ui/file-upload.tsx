"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq File Upload
 *
 * A drag-and-drop zone wrapped around a real `<input type="file" multiple>`.
 * Self-contained by design: every material recipe lives in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * Why a `<label>` around a native input, and what that buys:
 *
 * The drop zone is a `<label>` that wraps a visually-hidden `<input type=file>`.
 * That single decision hands us click, keyboard (Tab to the input, then Enter or
 * Space opens the OS picker), form participation and the platform file dialog
 * for free — the drag-and-drop layer is a pure enhancement layered on top, so a
 * keyboard-only user is never worse off than a pointer user. Drag events set a
 * `data-dragging` flag and are the only bespoke input path; everything else is
 * the browser's.
 *
 * Local theming knobs (copied from Input so the surfaces read as one system):
 *
 *   --mq-field         drop-zone / row background
 *   --mq-field-strong  drop-zone background while a drag hovers
 *   --mq-grad          material lighting over the surface
 *   --mq-edge          tactile contact edge + progress track
 *   --mq-brd           resting border
 *   --mq-brd-focus     border once focused / dragging + progress fill
 *   --mq-text          file names and primary copy
 *   --mq-placeholder   sizes and constraints
 *   --mq-ring          focus ring
 *   --mq-error         rejected-file border + message
 *   --mq-radius        corner radius (set by size)
 *
 * Contrast contract inherited from Input: primary copy uses `--mq-text` and the
 * constraints line uses `--mq-placeholder`, both of which measure at or above
 * 4.5:1 against the control's own surface on every material.
 */

/**
 * Palette per material, as local custom properties only — no layout, no
 * decoration. Declared on the *wrapper* so the drop zone, the rows and the
 * message (all siblings, not descendants of one another) resolve the same
 * material's `--mq-error`, `--mq-brd` and friends rather than falling back to
 * the literal defaults.
 */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-field:#f7e9de] [--mq-field-strong:#efd9c8] [--mq-edge:#dcc4b2]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(151,92,58,0.06))]",
    "[--mq-brd:rgba(120,80,55,0.30)] [--mq-brd-focus:#c9482f]",
    "[--mq-text:#33261e] [--mq-placeholder:#6a5346]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
  ].join(" "),
  glass: [
    "[--mq-field:rgba(255,255,255,0.66)] [--mq-field-strong:rgba(255,255,255,0.82)] [--mq-edge:rgba(255,255,255,0.86)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0))]",
    "[--mq-brd:rgba(255,255,255,0.75)] [--mq-brd-focus:rgba(255,255,255,0.98)]",
    "[--mq-text:#1e1e1b] [--mq-placeholder:#36362f]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  skeuo: [
    "[--mq-field:#e6e3da] [--mq-field-strong:#d7d3c9] [--mq-edge:#a8a49b]",
    "[--mq-grad:linear-gradient(180deg,#f2efe7,#dcd8ce)]",
    "[--mq-brd:rgba(25,25,23,0.52)] [--mq-brd-focus:rgba(25,25,23,0.60)]",
    "[--mq-text:#23231f] [--mq-placeholder:#4a4943]",
    "[--mq-ring:#171817] [--mq-error:#8f2a1e]",
  ].join(" "),
  adaptive: [
    "[--mq-field:#ffffff] [--mq-field-strong:#f1f0ec] [--mq-edge:#d8d6ce]",
    "[--mq-grad:none]",
    "[--mq-brd:rgba(23,24,23,0.22)] [--mq-brd-focus:#171817]",
    "[--mq-text:#1c1c19] [--mq-placeholder:#55554e]",
    "[--mq-ring:#171817] [--mq-error:#9c2f22]",
    "dark:[--mq-field:#232327] dark:[--mq-field-strong:#2b2b31] dark:[--mq-edge:#3a3a40]",
    "dark:[--mq-brd:rgba(255,255,255,0.24)] dark:[--mq-brd-focus:#f1efe9]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-placeholder:#b9b7b0]",
    "dark:[--mq-ring:#f1efe9] dark:[--mq-error:#ff9d8e]",
  ].join(" "),
} as const;

/**
 * Tactile depth per material.
 *
 * Each recipe keeps the same number of shadow layers, in the same inset order,
 * across rest, hover and focus, so the browser interpolates the focus well
 * rather than swapping two incompatible shadow lists discretely. The values are
 * lifted verbatim from Input; only the focus prefix differs — focus lands on the
 * hidden `<input>`, so the well is driven from the label with `has-[:focus-
 * visible]:` (and the `data-[focus=true]:` mirror the preview forces).
 */
const DEPTH = {
  clay: {
    rest: "shadow-[inset_0_3px_4px_rgba(255,255,255,0.78),inset_0_-4px_7px_rgba(140,90,60,0.14),inset_0_0_0_rgba(120,60,40,0),0_2px_0_var(--mq-edge,#dcc4b2),0_5px_11px_rgba(90,60,45,0.13)]",
    hover:
      "hover:shadow-[inset_0_3px_4px_rgba(255,255,255,0.88),inset_0_-4px_7px_rgba(140,90,60,0.16),inset_0_0_0_rgba(120,60,40,0),0_4px_0_var(--mq-edge,#dcc4b2),0_9px_17px_rgba(90,60,45,0.18)]",
    focus:
      "has-[:focus-visible]:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)] " +
      "data-[focus=true]:shadow-[inset_0_2px_3px_rgba(255,255,255,0.56),inset_0_-3px_6px_rgba(140,90,60,0.10),inset_0_5px_10px_rgba(120,60,40,0.27),0_1px_0_var(--mq-edge,#dcc4b2),0_2px_4px_rgba(90,60,45,0.10)]",
  },
  glass: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.86),inset_0_-1px_0_rgba(255,255,255,0.22),inset_0_0_0_rgba(24,20,40,0),0_7px_20px_rgba(24,20,40,0.15)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(255,255,255,0.27),inset_0_0_0_rgba(24,20,40,0),0_11px_28px_rgba(24,20,40,0.22)] hover:backdrop-blur-[22px]",
    focus:
      "has-[:focus-visible]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(255,255,255,0.20),inset_0_5px_12px_rgba(24,20,40,0.22),0_2px_6px_rgba(24,20,40,0.12)]",
  },
  skeuo: {
    rest: "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_5px_rgba(0,0,0,0.15),inset_0_0_0_rgba(0,0,0,0),0_2px_0_var(--mq-edge,#a8a49b),0_5px_10px_rgba(38,36,31,0.20)]",
    hover:
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),inset_0_-3px_5px_rgba(0,0,0,0.17),inset_0_0_0_rgba(0,0,0,0),0_3px_0_var(--mq-edge,#a8a49b),0_8px_15px_rgba(38,36,31,0.25)]",
    focus:
      "has-[:focus-visible]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)] " +
      "data-[focus=true]:shadow-[inset_0_1px_0_rgba(255,255,255,0.70),inset_0_-2px_4px_rgba(0,0,0,0.10),inset_0_5px_11px_rgba(0,0,0,0.32),0_1px_0_var(--mq-edge,#a8a49b),0_2px_3px_rgba(38,36,31,0.15)]",
  },
  adaptive: {
    rest: "shadow-[inset_0_0_0_rgba(20,20,18,0),0_1px_2px_rgba(20,20,18,0.10)]",
    hover: "hover:shadow-[inset_0_0_0_rgba(20,20,18,0),0_6px_16px_rgba(20,20,18,0.16)]",
    focus:
      "has-[:focus-visible]:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)] " +
      "data-[focus=true]:shadow-[inset_0_3px_7px_rgba(20,20,18,0.17),0_1px_2px_rgba(20,20,18,0.08)]",
  },
} as const;

type FileUploadMaterial = keyof typeof MATERIAL_TOKENS;
type FileUploadVariant = "default";
type FileUploadSize = "sm" | "md" | "lg";

const dropzoneVariants = cva(
  [
    "group relative flex w-full cursor-pointer flex-col items-center justify-center gap-[6px] text-center",
    "border border-dashed",
    "text-[color:var(--mq-text,#33261e)]",
    // Exactly the properties that change across states — nothing phantom. Border
    // colour moves on focus, drag and error; background on drag; the shadow on
    // hover and focus; backdrop-filter on glass hover; opacity when the control
    // is disabled. `outline` is deliberately not listed: a focus ring has to be
    // there the instant focus lands, not fade in.
    "transition-[border-color,background-color,box-shadow,backdrop-filter,opacity] duration-200 ease-out",
    "motion-reduce:transition-none",
    // Focus lives on the hidden input; surface the ring on the label instead of
    // hiding it. `has-[:focus-visible]` is the keyboard case, `data-[focus=true]`
    // the one the preview forces.
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[2px]",
    "has-[:focus-visible]:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[2px]",
    "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:has-[:focus-visible]:outline-[Highlight]",
    "has-[:focus-visible]:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[focus=true]:border-[var(--mq-brd-focus,#c9482f)]",
    // The active-drop affordance is not colour alone: the border firms up, the
    // surface tints and the primary copy swaps to "Release to add files".
    "data-[dragging=true]:border-[var(--mq-brd-focus,#c9482f)]",
    "data-[dragging=true]:[background-color:var(--mq-field-strong,#efd9c8)]",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-55",
    // `aria-invalid` on the input is the single source of truth for the error
    // look; the label reads it through `:has`, so what is shown and what
    // assistive tech is told can never drift.
    "has-[[aria-invalid=true]]:border-[var(--mq-error,#9c2f22)]",
    // Forced colours drop every fill and shadow, so a zone styled only by its
    // background and box-shadow would vanish. A system-coloured dashed border
    // keeps the drop target — and its drag and invalid states — perceivable.
    "forced-colors:border-[CanvasText] forced-colors:shadow-none",
    "forced-colors:[background-image:none] forced-colors:backdrop-filter-none",
    "forced-colors:data-[dragging=true]:border-[Highlight]",
    "forced-colors:has-[[aria-invalid=true]]:border-[Mark]",
  ].join(" "),
  {
    variants: {
      material: {
        clay: [DEPTH.clay.rest, DEPTH.clay.hover, DEPTH.clay.focus].join(" "),
        glass: [
          "backdrop-blur-[18px] backdrop-saturate-[170%]",
          DEPTH.glass.rest,
          DEPTH.glass.hover,
          DEPTH.glass.focus,
        ].join(" "),
        skeuo: [DEPTH.skeuo.rest, DEPTH.skeuo.hover, DEPTH.skeuo.focus].join(" "),
        adaptive: [
          DEPTH.adaptive.rest,
          DEPTH.adaptive.hover,
          DEPTH.adaptive.focus,
          "pointer-coarse:min-h-[112px]",
        ].join(" "),
      },
      size: {
        sm: "[--mq-radius:12px] rounded-[var(--mq-radius,12px)] px-[16px] py-[18px] text-[12px]/[1.3]",
        md: "[--mq-radius:16px] rounded-[var(--mq-radius,16px)] px-[20px] py-[24px] text-[13px]/[1.3]",
        lg: "[--mq-radius:20px] rounded-[var(--mq-radius,20px)] px-[24px] py-[32px] text-[14px]/[1.3]",
      },
      variant: {
        default: [
          "border-[var(--mq-brd,rgba(120,80,55,0.30))]",
          "[background-color:var(--mq-field,#f7e9de)]",
          "[background-image:var(--mq-grad,none)]",
        ].join(" "),
      },
    },
    defaultVariants: { material: "clay", variant: "default", size: "md" },
  },
);

/** A file the component is tracking, whether dropped, picked or seeded. */
export type UploadItem = {
  id: string;
  name: string;
  size: number;
  /** Present for real picks/drops; absent for seeded defaults (SSR-safe). */
  file?: File;
};

/** Minimal shape a seeded default may use so a preview needs no real `File`. */
export type FileLike = { name: string; size: number };

export type FileUploadProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "size" | "type" | "value" | "defaultValue" | "onChange" | "children" | "color"
> & {
  material?: FileUploadMaterial;
  variant?: FileUploadVariant;
  size?: FileUploadSize;
  /** Visible field label; also the input's accessible name. */
  label?: React.ReactNode;
  /** Constraints/instructions line, wired to the input via `aria-describedby`. */
  description?: React.ReactNode;
  /** Marks the control invalid. Drives `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Error shown under the list. Its presence implies `invalid`. */
  errorText?: React.ReactNode;
  /** Reject (and announce) any file larger than this many bytes. */
  maxSize?: number;
  /** Seeds the uncontrolled list. Accepts real `File`s or a `{name,size}`. */
  defaultFiles?: ReadonlyArray<File | FileLike>;
  /** Emits the full list after every add or remove. */
  onFilesChange?: (items: UploadItem[]) => void;
  /** Per-file upload progress keyed by file name, 0–100; shows a meter+percent. */
  progress?: Record<string, number>;
  /** Forces the focus affordance for documentation. */
  "data-focus"?: "true" | "false";
  /** Class for the field wrapper. */
  className?: string;
};

const LABEL =
  // `currentColor`: the label sits on the host's surface, not on one of ours, so
  // pinning a colour would be guessing at the page it lands on.
  "text-[color:currentColor] text-[length:12px] leading-[1.3] font-extrabold tracking-[-0.01em]";

// Tailwind's `sr-only`, written out so the file leans on no global class. The
// input stays in the tab order (not `display:none`), so it is still focusable
// and the wrapping label still opens the picker on click.
const VISUALLY_HIDDEN =
  "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]";

/** Deterministic, locale-free byte formatting — no `Math.random`, no `Date`. */
function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || Number.isInteger(value) ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function matchesAccept(name: string, type: string, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const lowerName = name.toLowerCase();
  const lowerType = type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return lowerName.endsWith(token);
    if (token.endsWith("/*")) return lowerType.startsWith(token.slice(0, -1));
    return lowerType !== "" && lowerType === token;
  });
}

/** Returns a short reason a file is rejected, or `null` when it is accepted. */
function rejectReason(
  file: File | FileLike,
  maxSize: number | undefined,
  accept: string | undefined,
): string | null {
  if (maxSize != null && file.size > maxSize) return "too large";
  const type = "type" in file && typeof file.type === "string" ? file.type : "";
  if (accept && !matchesAccept(file.name, type, accept)) return "unsupported type";
  return null;
}

const iconSizeForSize: Record<FileUploadSize, string> = {
  sm: "size-[22px]",
  md: "size-[26px]",
  lg: "size-[30px]",
};

/**
 * The composed field: label + drop zone + file list + message + a live status
 * region. The drop zone is the native input's `<label>`, so click, keyboard and
 * the OS picker all work without any of our code; drag-and-drop is the only
 * bespoke path and it is a pure enhancement.
 */
export function FileUpload({
  "aria-describedby": callerDescribedBy,
  "data-focus": dataFocus,
  accept,
  className,
  defaultFiles,
  description,
  disabled = false,
  errorText,
  id,
  invalid = false,
  label = "Upload files",
  material = "clay",
  maxSize,
  multiple = true,
  onFilesChange,
  progress,
  size = "md",
  variant = "default",
  ...rest
}: FileUploadProps) {
  const uid = React.useId();
  const inputId = id ?? `${uid}-input`;
  const labelId = `${uid}-label`;
  const descId = `${uid}-desc`;
  const messageId = `${uid}-message`;

  const [items, setItems] = React.useState<UploadItem[]>(() =>
    (defaultFiles ?? []).map((file, index) => ({
      id: `${uid}-d${index}`,
      name: file.name,
      size: file.size,
      file: typeof File !== "undefined" && file instanceof File ? file : undefined,
    })),
  );
  const [isDragging, setDragging] = React.useState(false);
  const [rejection, setRejection] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState("");
  const dragDepth = React.useRef(0);
  const idCounter = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const hasErrorText = typeof errorText === "string" ? errorText.trim() !== "" : errorText != null;
  const isInvalid = invalid || rejection != null || hasErrorText;
  const message = rejection ?? (hasErrorText ? errorText : null);

  const describedBy = [callerDescribedBy, descId, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  function nextId() {
    idCounter.current += 1;
    return `${uid}-f${idCounter.current}`;
  }

  function emit(next: UploadItem[]) {
    setItems(next);
    onFilesChange?.(next);
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    if (incoming.length === 0) return;

    const accepted: UploadItem[] = [];
    const rejected: string[] = [];
    for (const file of incoming) {
      const reason = rejectReason(file, maxSize, accept);
      if (reason) rejected.push(`${file.name} (${reason})`);
      else accepted.push({ id: nextId(), name: file.name, size: file.size, file });
    }

    // When !multiple a multi-file drop is narrowed to the last file, so the
    // announcement must count what is actually kept — not what arrived — or the
    // live region says "3 files added" while one row renders.
    const keptCount = multiple ? accepted.length : Math.min(accepted.length, 1);
    if (accepted.length > 0) {
      emit(multiple ? [...items, ...accepted] : accepted.slice(-1));
    }
    setRejection(rejected.length > 0 ? `Couldn't add ${rejected.join(", ")}.` : null);

    const announcements: string[] = [];
    if (keptCount > 0) {
      announcements.push(`${keptCount} file${keptCount === 1 ? "" : "s"} added`);
    }
    if (rejected.length > 0) {
      announcements.push(`${rejected.length} rejected`);
    }
    setStatus(announcements.join(", "));
  }

  function removeItem(item: UploadItem) {
    emit(items.filter((candidate) => candidate.id !== item.id));
    setStatus(`Removed ${item.name}`);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(event.currentTarget.files ?? []);
    // Clear the native value so re-picking the same file fires `change` again.
    event.currentTarget.value = "";
  }

  function handleDragEnter(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    // Both are required for the element to become a valid drop target.
    event.preventDefault();
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;
    addFiles(event.dataTransfer.files);
  }

  return (
    <div className={cn("flex w-full flex-col gap-[10px] text-left", MATERIAL_TOKENS[material], className)}>
      <span className={LABEL} id={labelId}>
        {label}
      </span>

      <label
        className={cn(dropzoneVariants({ material, variant, size }))}
        data-dragging={isDragging ? "true" : undefined}
        data-focus={dataFocus}
        data-material={material}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...rest}
          aria-describedby={describedBy || undefined}
          aria-invalid={isInvalid || undefined}
          aria-labelledby={labelId}
          accept={accept}
          className={VISUALLY_HIDDEN}
          disabled={disabled}
          id={inputId}
          multiple={multiple}
          onChange={handleInputChange}
          ref={inputRef}
          type="file"
        />
        <UploadCloud
          aria-hidden="true"
          className={cn(
            "text-[color:var(--mq-placeholder,#6a5346)] forced-colors:text-[CanvasText]",
            iconSizeForSize[size],
          )}
        />
        <span className="font-semibold text-[color:var(--mq-text,#33261e)]">
          {isDragging ? (
            "Release to add files"
          ) : (
            <>
              Drag &amp; drop, or{" "}
              <span className="underline underline-offset-[3px] [text-decoration-thickness:1.5px]">
                browse
              </span>
            </>
          )}
        </span>
        <span className="text-[11px]/[1.4] text-[color:var(--mq-placeholder,#6a5346)]" id={descId}>
          {description}
        </span>
      </label>

      {items.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
          {items.map((item) => {
            const raw = progress?.[item.name];
            const showMeter = typeof raw === "number";
            const percent = typeof raw === "number" ? clampPercent(raw) : 0;
            return (
              <li
                className={cn(
                  "flex items-center gap-[10px] rounded-[10px] border px-[10px] py-[8px]",
                  "border-[var(--mq-brd,rgba(120,80,55,0.30))] [background-color:var(--mq-field,#f7e9de)]",
                  "text-[12px]/[1.3] text-[color:var(--mq-text,#33261e)]",
                  "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
                  "starting:opacity-0 starting:-translate-y-[6px]",
                  "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
                )}
                key={item.id}
              >
                <FileText
                  aria-hidden="true"
                  className="size-[18px] shrink-0 text-[color:var(--mq-placeholder,#6a5346)] forced-colors:text-[CanvasText]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-[10px]">
                    <span className="truncate font-semibold">{item.name}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-[color:var(--mq-placeholder,#6a5346)]">
                      {formatBytes(item.size)}
                    </span>
                  </div>
                  {showMeter ? (
                    <div className="mt-[6px] flex items-center gap-[8px]">
                      <div
                        aria-label={`Uploading ${item.name}`}
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={percent}
                        className="h-[6px] flex-1 overflow-hidden rounded-full [background-color:var(--mq-edge,#dcc4b2)] forced-colors:border forced-colors:border-[CanvasText]"
                        role="progressbar"
                      >
                        <div
                          // The fill uses the high-contrast --mq-ring token, not
                          // --mq-brd-focus: on glass the focus border is near-white
                          // (rgba(255,255,255,0.98)) and would vanish into the light
                          // --mq-edge track. --mq-ring is dark on every light material
                          // and flips with adaptive's scheme, so the level is always
                          // perceivable. Highlight keeps it visible under forced-colors.
                          className="h-full rounded-full [background-color:var(--mq-ring,#171817)] forced-colors:[background-color:Highlight] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {/* Text percent so upload level is never conveyed by colour alone. */}
                      <span className="shrink-0 text-[10px] tabular-nums text-[color:var(--mq-text,#33261e)] forced-colors:text-[CanvasText]">
                        {percent}%
                      </span>
                    </div>
                  ) : null}
                </div>
                <button
                  aria-label={`Remove ${item.name}`}
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-[8px] p-[6px]",
                    "text-[color:var(--mq-text,#33261e)]",
                    "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
                    "hover:[background-color:var(--mq-edge,#dcc4b2)] hover:text-[color:var(--mq-error,#9c2f22)]",
                    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
                    "forced-colors:focus-visible:outline-[Highlight] forced-colors:text-[CanvasText]",
                    "disabled:cursor-not-allowed disabled:opacity-55",
                  )}
                  disabled={disabled}
                  onClick={() => removeItem(item)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-[16px]" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p
        aria-live="polite"
        className={cn(
          "m-0 text-[length:11px] leading-[1.5]",
          message != null && isInvalid
            ? "font-bold text-[color:var(--mq-error,#9c2f22)]"
            : "text-[color:currentColor]",
        )}
        id={messageId}
      >
        {message}
      </p>

      {/* Add/remove announcements live apart from the persistent error so one
          never clobbers the other. */}
      <p aria-live="polite" className={VISUALLY_HIDDEN} role="status">
        {status}
      </p>
    </div>
  );
}

export { dropzoneVariants, formatBytes };
