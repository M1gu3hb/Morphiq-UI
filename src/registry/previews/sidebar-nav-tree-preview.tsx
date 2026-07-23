"use client";

import {
  SidebarNavTree,
  type SidebarNavTreeNode,
} from "@/registry/ui/sidebar-nav-tree";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Sidebar Nav Tree.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Each `PreviewState` handled here maps to something the tree genuinely has:
 * `focus` holds the ring open on the current page (using the material's own
 * --mq-ring token, without leaving the node API), `disabled` dims the whole tree
 * and takes it out of the pointer path. Anything else falls through to the live
 * render, where the reader can open and close branches, walk them with Tab and
 * the arrow keys, and watch a deep branch ease to its natural height.
 *
 * Every material gets a different real-world tree — a docs site, an API
 * reference, a session browser, a platform console — and each one is three
 * levels deep with the current page buried in the third, so the auto-expanded
 * active path is visible the moment the preview mounts. `onClickCapture` cancels
 * the sample anchors so the docs page never jumps.
 */

type SidebarNavTreeVariant = "default";
type SidebarNavTreeSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SidebarNavTreeVariant {
  return (VARIANTS.includes(value) ? value : "default") as SidebarNavTreeVariant;
}

function asSize(value: string): SidebarNavTreeSize {
  return (SIZES.includes(value) ? value : "md") as SidebarNavTreeSize;
}

/** A different real navigation per material, so each recipe does real work. */
const ITEMS: Record<StyleSlug, readonly SidebarNavTreeNode[]> = {
  clay: [
    {
      id: "start",
      label: "Getting started",
      defaultOpen: true,
      children: [
        { id: "install", label: "Installation", href: "#install" },
        { id: "theming", label: "Theming", href: "#theming" },
      ],
    },
    {
      id: "components",
      label: "Components",
      children: [
        {
          id: "actions",
          label: "Actions",
          children: [
            { id: "button", label: "Button", href: "#button" },
            { id: "icon-button", label: "Icon button", href: "#icon-button", current: true },
            { id: "split-button", label: "Split button", href: "#split-button" },
          ],
        },
        {
          id: "overlays",
          label: "Overlays",
          children: [
            { id: "dialog", label: "Dialog", href: "#dialog" },
            { id: "drawer", label: "Drawer", href: "#drawer" },
          ],
        },
      ],
    },
    {
      id: "guides",
      label: "Guides",
      children: [
        { id: "accessibility", label: "Accessibility", href: "#accessibility" },
        { id: "migration", label: "Migration", href: "#migration" },
      ],
    },
  ],
  glass: [
    { id: "overview", label: "Overview", href: "#overview" },
    {
      id: "rest",
      label: "REST API",
      children: [
        { id: "auth", label: "Authentication", href: "#auth" },
        {
          id: "endpoints",
          label: "Endpoints",
          children: [
            { id: "users", label: "Users", href: "#users", current: true },
            { id: "sessions", label: "Sessions", href: "#sessions" },
            { id: "webhooks", label: "Webhooks", href: "#webhooks" },
          ],
        },
      ],
    },
    {
      id: "sdks",
      label: "SDKs",
      children: [
        { id: "javascript", label: "JavaScript", href: "#javascript" },
        { id: "python", label: "Python", href: "#python" },
      ],
    },
  ],
  skeuo: [
    {
      id: "session",
      label: "Session",
      children: [
        {
          id: "tracks",
          label: "Tracks",
          children: [
            { id: "drums", label: "Drums.wav", href: "#drums" },
            { id: "bass", label: "Bass.wav", href: "#bass", current: true },
            { id: "vocals", label: "Vocals.wav", href: "#vocals" },
          ],
        },
        {
          id: "buses",
          label: "Buses",
          children: [
            { id: "reverb", label: "Reverb A", href: "#reverb" },
            { id: "delay", label: "Delay B", href: "#delay" },
          ],
        },
      ],
    },
    {
      id: "presets",
      label: "Presets",
      defaultOpen: true,
      children: [
        { id: "mastering", label: "Mastering", href: "#mastering" },
        { id: "tape", label: "Tape", href: "#tape" },
      ],
    },
  ],
  adaptive: [
    {
      id: "platform",
      label: "Platform",
      children: [
        { id: "projects", label: "Projects", href: "#projects" },
        {
          id: "deployments",
          label: "Deployments",
          children: [
            { id: "builds", label: "Builds", href: "#builds" },
            { id: "environments", label: "Environments", href: "#environments", current: true },
            { id: "logs", label: "Logs", href: "#logs" },
          ],
        },
      ],
    },
    {
      id: "billing",
      label: "Billing",
      children: [
        { id: "plans", label: "Plans", href: "#plans" },
        { id: "invoices", label: "Invoices", href: "#invoices" },
      ],
    },
    { id: "support", label: "Support", href: "#support" },
  ],
};

const LABELS: Record<StyleSlug, string> = {
  clay: "Documentation",
  glass: "API reference",
  skeuo: "Session browser",
  adaptive: "Console sections",
};

export function SidebarNavTreePreview({ material, variant, size, state }: PreviewProps) {
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <SidebarNavTree
      aria-busy={state === "loading" || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={LABELS[material]}
      className={[
        // A docs rail is a column, not a full-bleed band: hold it to a realistic
        // width so the reader sees the indentation and the guide rails doing
        // their job rather than a row of labels adrift in white space.
        "w-full max-w-[304px]",
        isFocus
          ? // Force the focus ring onto the current page without leaving the node
            // API — the ring colour is the material's own --mq-ring token.
            "[&_[aria-current=page]]:outline-2 [&_[aria-current=page]]:outline-offset-[-2px] [&_[aria-current=page]]:outline-[var(--mq-ring,#171817)]"
          : "",
        isDisabled ? "pointer-events-none opacity-45" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      items={ITEMS[material]}
      // Remounts when the material changes, and only then. Each material names
      // its own branches, so a clean render is simpler than reconciling the
      // uncontrolled disclosure state against a tree that shares no ids.
      key={material}
      material={material}
      // The sample anchors would navigate to their hashes and scroll the docs;
      // cancel that in the capture phase so the tree stays put while the reader
      // hovers, focuses and opens branches.
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest("a")) event.preventDefault();
      }}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
