"use client";

import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Folder,
  Home,
  Inbox,
  LayoutGrid,
  Music,
  Package,
  Radio,
  Search,
  Settings,
  Sliders,
  Users,
  Volume2,
} from "lucide-react";
import {
  Sidebar,
  type SidebarGroup,
} from "@/registry/ui/sidebar";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Sidebar.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it.
 *
 * Every `PreviewState` handled here maps to something the Sidebar genuinely has:
 * `focus` forces the ring onto the active link, `disabled` dims the whole panel
 * and takes it out of the pointer path. Anything else falls through to the
 * default interactive render — the reader can toggle the sections and (via the
 * rail button) collapse the sidebar to an icon strip. `onClickCapture` cancels
 * the links' navigation so the docs page never jumps.
 */

type SidebarVariant = "default";
type SidebarSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): SidebarVariant {
  return (VARIANTS.includes(value) ? value : "default") as SidebarVariant;
}

function asSize(value: string): SidebarSize {
  return (SIZES.includes(value) ? value : "md") as SidebarSize;
}

type SidebarDemo = {
  heading: string;
  activeId: string;
  groups: readonly SidebarGroup[];
};

/** Copy differs per material so each recipe is shown doing real work. */
const DEMOS: Record<StyleSlug, SidebarDemo> = {
  clay: {
    heading: "Studio",
    activeId: "projects",
    groups: [
      {
        id: "workspace",
        label: "Workspace",
        icon: <Home />,
        links: [
          { id: "overview", label: "Overview", href: "#overview", icon: <LayoutGrid /> },
          { id: "projects", label: "Projects", href: "#projects", icon: <Folder /> },
          { id: "activity", label: "Activity", href: "#activity", icon: <Activity /> },
        ],
      },
      {
        id: "account",
        label: "Account",
        icon: <Users />,
        links: [
          { id: "team", label: "Team", href: "#team", icon: <Users /> },
          { id: "billing", label: "Billing", href: "#billing", icon: <CreditCard /> },
          { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
        ],
      },
    ],
  },
  glass: {
    heading: "Inbox",
    activeId: "today",
    groups: [
      {
        id: "mail",
        label: "Mail",
        icon: <Inbox />,
        links: [
          { id: "today", label: "Today", href: "#today", icon: <Calendar /> },
          { id: "flagged", label: "Flagged", href: "#flagged", icon: <Bell /> },
          { id: "drafts", label: "Drafts", href: "#drafts", icon: <FileText />, disabled: true },
        ],
      },
      {
        id: "browse",
        label: "Browse",
        icon: <Search />,
        links: [
          { id: "reports", label: "Reports", href: "#reports", icon: <BarChart3 /> },
          { id: "archive", label: "Archive", href: "#archive", icon: <Package /> },
        ],
      },
    ],
  },
  skeuo: {
    heading: "Console",
    activeId: "mixer",
    groups: [
      {
        id: "signal",
        label: "Signal",
        icon: <Sliders />,
        links: [
          { id: "mixer", label: "Mixer", href: "#mixer", icon: <Sliders /> },
          { id: "master", label: "Master", href: "#master", icon: <Volume2 /> },
          { id: "monitor", label: "Monitor", href: "#monitor", icon: <Radio /> },
        ],
      },
      {
        id: "library",
        label: "Library",
        icon: <Music />,
        links: [
          { id: "tracks", label: "Tracks", href: "#tracks", icon: <Music /> },
          { id: "presets", label: "Presets", href: "#presets", icon: <Folder /> },
        ],
      },
    ],
  },
  adaptive: {
    heading: "Console",
    activeId: "usage",
    groups: [
      {
        id: "product",
        label: "Product",
        icon: <LayoutGrid />,
        links: [
          { id: "overview", label: "Overview", href: "#overview", icon: <Home /> },
          { id: "usage", label: "Usage", href: "#usage", icon: <Activity /> },
          { id: "reports", label: "Reports", href: "#reports", icon: <BarChart3 /> },
        ],
      },
      {
        id: "org",
        label: "Organization",
        icon: <Users />,
        links: [
          { id: "members", label: "Members", href: "#members", icon: <Users /> },
          { id: "billing", label: "Billing", href: "#billing", icon: <CreditCard /> },
          { id: "settings", label: "Settings", href: "#settings", icon: <Settings /> },
        ],
      },
    ],
  },
};

export function SidebarPreview({ material, variant, size, state }: PreviewProps) {
  const demo = DEMOS[material];
  const isDisabled = state === "disabled";
  const isFocus = state === "focus";

  return (
    <Sidebar
      aria-busy={state === "loading" || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={`${demo.heading} navigation`}
      activeId={demo.activeId}
      className={
        isFocus
          ? // Force the focus ring onto the active link without leaving the item
            // API — the ring colour is the material's own --mq-ring token, and the
            // inset offset matches the live ring so it never clips in the scroll area.
            "[&_[aria-current=page]]:outline-2 [&_[aria-current=page]]:outline-offset-[-2px] [&_[aria-current=page]]:outline-[var(--mq-ring,#171817)]"
          : isDisabled
            ? "pointer-events-none opacity-45"
            : undefined
      }
      collapsible
      groups={demo.groups}
      heading={demo.heading}
      // Remounts when the material changes, and only then. Each material names
      // its own groups, so without this the open-state seed and activeId would
      // reference ids that no longer exist.
      key={material}
      material={material}
      // Anchors would navigate to their hashes and scroll the docs; cancel that
      // in the capture phase while the disclosure toggles still work.
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest("a")) event.preventDefault();
      }}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
