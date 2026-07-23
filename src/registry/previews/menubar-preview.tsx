"use client";

import {
  ClipboardPaste,
  Copy,
  Crop,
  Download,
  Eye,
  EyeOff,
  FilePlus,
  FolderOpen,
  Gauge,
  Grid3x3,
  Layers,
  Maximize,
  Mic,
  Moon,
  PanelLeft,
  Pause,
  Play,
  Printer,
  Redo2,
  RefreshCw,
  Rows3,
  Save,
  Scissors,
  Settings,
  SkipForward,
  Trash2,
  Undo2,
  Upload,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Menubar, type MenubarMenu } from "@/registry/ui/menubar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Menubar.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Each `PreviewState` handled here maps to something the Menubar genuinely has:
 * `focus` forces the ring onto the first top item (using the material's own
 * --mq-ring token, without reaching into the menus API), `disabled` marks every
 * top menu disabled through the real `MenubarMenu.disabled` flag so the bar goes
 * inert exactly the way a consumer's would. Anything else falls through to the
 * default interactive render: the reader can click a top item, glide the pointer
 * across the row to switch menus, and drive the whole thing from the keyboard.
 */

type MenubarVariant = "default";
type MenubarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): MenubarVariant {
  return (VARIANTS.includes(value) ? value : "default") as MenubarVariant;
}

function asSize(value: string): MenubarSize {
  return (SIZES.includes(value) ? value : "md") as MenubarSize;
}

/**
 * Force the focus ring onto the first top item for the docs `focus` state. The
 * selector walks the menubar row's first cell to its button, and the ring colour
 * is the material's own --mq-ring token, so the forced state is the real one.
 */
const FOCUS_RING = [
  "[&_[role=menubar]>div:first-child>button]:outline-2",
  "[&_[role=menubar]>div:first-child>button]:outline-offset-[2px]",
  "[&_[role=menubar]>div:first-child>button]:outline-[var(--mq-ring,#171817)]",
].join(" ");

/** A different application per material, so each recipe is shown doing real work. */
const MENUS: Record<StyleSlug, readonly MenubarMenu[]> = {
  clay: [
    {
      id: "file",
      label: "File",
      items: [
        { id: "new", label: "New file", icon: <FilePlus />, onSelect: () => {} },
        { id: "open", label: "Open…", icon: <FolderOpen />, onSelect: () => {} },
        { id: "save", label: "Save", icon: <Save />, onSelect: () => {} },
        { id: "print", label: "Print…", icon: <Printer />, disabled: true, onSelect: () => {} },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { id: "undo", label: "Undo", icon: <Undo2 />, onSelect: () => {} },
        { id: "redo", label: "Redo", icon: <Redo2 />, onSelect: () => {} },
        { id: "cut", label: "Cut", icon: <Scissors />, onSelect: () => {} },
        { id: "copy", label: "Copy", icon: <Copy />, onSelect: () => {} },
        { id: "paste", label: "Paste", icon: <ClipboardPaste />, onSelect: () => {} },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { id: "zoom-in", label: "Zoom in", icon: <ZoomIn />, onSelect: () => {} },
        { id: "zoom-out", label: "Zoom out", icon: <ZoomOut />, onSelect: () => {} },
        { id: "full", label: "Full screen", icon: <Maximize />, onSelect: () => {} },
      ],
    },
    // A disabled top menu: roving skips straight over it, and the label dims.
    {
      id: "window",
      label: "Window",
      disabled: true,
      items: [
        { id: "split", label: "Split editor", icon: <PanelLeft />, onSelect: () => {} },
        { id: "zoom-window", label: "Zoom window", icon: <Maximize />, onSelect: () => {} },
      ],
    },
  ],
  glass: [
    {
      id: "image",
      label: "Image",
      items: [
        { id: "import", label: "Import…", icon: <Upload />, onSelect: () => {} },
        { id: "export", label: "Export as PNG", icon: <Download />, onSelect: () => {} },
        { id: "crop", label: "Crop to selection", icon: <Crop />, onSelect: () => {} },
      ],
    },
    {
      id: "layer",
      label: "Layer",
      items: [
        { id: "new-layer", label: "New layer", icon: <Layers />, onSelect: () => {} },
        { id: "duplicate-layer", label: "Duplicate layer", icon: <Copy />, onSelect: () => {} },
        { id: "show-layer", label: "Show all layers", icon: <Eye />, onSelect: () => {} },
        { id: "hide-layer", label: "Hide layer", icon: <EyeOff />, disabled: true, onSelect: () => {} },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { id: "fit", label: "Fit to screen", icon: <Maximize />, onSelect: () => {} },
        { id: "zoom", label: "Zoom in", icon: <ZoomIn />, onSelect: () => {} },
        { id: "guides", label: "Show guides", icon: <Rows3 />, onSelect: () => {} },
      ],
    },
  ],
  skeuo: [
    {
      id: "session",
      label: "Session",
      items: [
        { id: "open-session", label: "Open session…", icon: <FolderOpen />, onSelect: () => {} },
        { id: "save-session", label: "Save session", icon: <Save />, onSelect: () => {} },
        { id: "bounce", label: "Bounce to disk", icon: <Download />, onSelect: () => {} },
      ],
    },
    {
      id: "transport",
      label: "Transport",
      items: [
        { id: "play", label: "Play", icon: <Play />, onSelect: () => {} },
        { id: "pause", label: "Pause", icon: <Pause />, onSelect: () => {} },
        { id: "next", label: "Next marker", icon: <SkipForward />, onSelect: () => {} },
        { id: "loop", label: "Loop region", icon: <RefreshCw />, disabled: true, onSelect: () => {} },
      ],
    },
    {
      id: "mix",
      label: "Mix",
      items: [
        { id: "levels", label: "Input levels", icon: <Gauge />, onSelect: () => {} },
        { id: "mic", label: "Arm microphone", icon: <Mic />, onSelect: () => {} },
        { id: "master", label: "Master output", icon: <Volume2 />, onSelect: () => {} },
      ],
    },
  ],
  adaptive: [
    {
      id: "project",
      label: "Project",
      items: [
        { id: "new-project", label: "New project", icon: <FilePlus />, onSelect: () => {} },
        { id: "duplicate-project", label: "Duplicate", icon: <Copy />, onSelect: () => {} },
        { id: "delete-project", label: "Delete", icon: <Trash2 />, disabled: true, onSelect: () => {} },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { id: "undo", label: "Undo", icon: <Undo2 />, onSelect: () => {} },
        { id: "redo", label: "Redo", icon: <Redo2 />, onSelect: () => {} },
        { id: "prefs", label: "Preferences…", icon: <Settings />, onSelect: () => {} },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { id: "sidebar", label: "Toggle sidebar", icon: <PanelLeft />, onSelect: () => {} },
        { id: "grid", label: "Show grid", icon: <Grid3x3 />, onSelect: () => {} },
        { id: "appearance", label: "Appearance", icon: <Moon />, onSelect: () => {} },
      ],
    },
  ],
};

/** The landmark name names the application whose menus the bar carries. */
const LABELS: Record<StyleSlug, string> = {
  clay: "Document menu",
  glass: "Photo editor menu",
  skeuo: "Session menu",
  adaptive: "Project menu",
};

export function MenubarPreview({ material, variant, size, state }: PreviewProps) {
  const isDisabled = state === "disabled";
  // Disabled goes through the real API rather than a decorative overlay: every
  // top menu is marked disabled, so the buttons are genuinely inert and roving
  // finds nothing to land on.
  const menus: readonly MenubarMenu[] = isDisabled
    ? MENUS[material].map((menu) => ({ ...menu, disabled: true }))
    : MENUS[material];

  return (
    // Reserve room under the bar so an opened submenu has somewhere to land
    // inside the docs frame.
    <div className="flex min-h-[268px] flex-col items-start gap-[16px]">
      <Menubar
        aria-busy={state === "loading" || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={LABELS[material]}
        className={state === "focus" ? FOCUS_RING : undefined}
        // Remounts when the material changes: each material names its own menus,
        // and the open submenu is tracked by index, so a clean render is simpler
        // than reconciling an index against a different set of menus.
        key={material}
        material={material}
        menus={menus}
        size={asSize(size)}
        variant={asVariant(variant)}
      />
    </div>
  );
}
