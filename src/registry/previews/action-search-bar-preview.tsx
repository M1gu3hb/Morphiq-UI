"use client";

import {
  ActionSearchBar,
  type ActionSearchOption,
} from "@/registry/ui/action-search-bar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";
import {
  Command,
  FileText,
  Palette,
  Rocket,
  Settings,
  Users,
} from "lucide-react";

/**
 * Documentation preview for the Action Search Bar.
 *
 * The component owns internal state (query, open, active row), so the wrapper is
 * keyed on `material`: switching material in the docs remounts it clean rather
 * than carrying a stale open panel across recipes.
 *
 * The `focus` state seeds the panel open (and forces the focus ring) so the
 * combobox is shown doing its real work — a filtered list with an active row —
 * without the reader having to interact. `error` sets aria-invalid and an error
 * message; `disabled` disables the control; everything else falls through to the
 * resting default.
 */

type ActionSearchVariant = "default";
type ActionSearchSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): ActionSearchVariant {
  return (VARIANTS.includes(value) ? value : "default") as ActionSearchVariant;
}

function asSize(value: string): ActionSearchSize {
  return (SIZES.includes(value) ? value : "md") as ActionSearchSize;
}

type MaterialCopy = {
  label: string;
  placeholder: string;
  options: ActionSearchOption[];
};

/** Copy differs per material so each recipe is shown doing real work. */
const COPY: Record<StyleSlug, MaterialCopy> = {
  clay: {
    label: "Command palette",
    placeholder: "Search actions…",
    options: [
      { id: "new", label: "New workspace", icon: Rocket, shortcut: "⌘N" },
      { id: "invite", label: "Invite teammates", icon: Users, shortcut: "⌘I" },
      { id: "theme", label: "Edit theme", icon: Palette },
      { id: "settings", label: "Open settings", icon: Settings, shortcut: "⌘," },
      { id: "docs", label: "Read the docs", icon: FileText },
    ],
  },
  glass: {
    label: "Session controls",
    placeholder: "Jump to an action…",
    options: [
      { id: "focus", label: "Start focus block", icon: Rocket },
      { id: "share", label: "Share session", icon: Users, shortcut: "⌘S" },
      { id: "appearance", label: "Change appearance", icon: Palette },
      { id: "prefs", label: "Preferences", icon: Settings },
      { id: "keys", label: "Keyboard shortcuts", icon: Command, shortcut: "?" },
    ],
  },
  skeuo: {
    label: "Channel actions",
    placeholder: "Find a command…",
    options: [
      { id: "channel", label: "Create channel", icon: Rocket, shortcut: "⌘N" },
      { id: "members", label: "Manage members", icon: Users },
      { id: "skin", label: "Channel theme", icon: Palette },
      { id: "config", label: "Channel settings", icon: Settings },
      { id: "export", label: "Export log", icon: FileText },
    ],
  },
  adaptive: {
    label: "Quick actions",
    placeholder: "Type a command…",
    options: [
      { id: "invoice", label: "New invoice", icon: FileText, shortcut: "⌘N" },
      { id: "customer", label: "Add customer", icon: Users },
      { id: "branding", label: "Branding", icon: Palette },
      { id: "billing", label: "Billing settings", icon: Settings, shortcut: "⌘B" },
      { id: "team", label: "Manage team", icon: Command },
    ],
  },
};

export function ActionSearchBarPreview({ material, variant, size, state }: PreviewProps) {
  const copy = COPY[material];
  const isError = state === "error";
  const isFocus = state === "focus";
  // Mark the coerced variant read so the "default" axis is exercised.
  void asVariant(variant);

  return (
    <div className="w-[min(360px,100%)]">
      <ActionSearchBar
        data-focus={isFocus ? "true" : undefined}
        defaultOpen={isFocus}
        defaultValue={isError ? "archive everything" : ""}
        disabled={state === "disabled"}
        errorText={isError ? "No action matches your permissions." : undefined}
        helperText="Arrow keys to browse, Enter to run."
        key={material}
        label={copy.label}
        listLabel={`${copy.label} suggestions`}
        material={material}
        options={copy.options}
        placeholder={copy.placeholder}
        size={asSize(size)}
      />
    </div>
  );
}
