"use client";

import { TreeView, type TreeNode } from "@/registry/ui/tree-view";
import type { PreviewProps } from "@/registry/schema";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Documentation preview for the Tree View.
 *
 * Previews live outside `src/registry/ui/` so that folder stays purely
 * distributable: what a user copies is the component, never the scaffolding used
 * to document it. Data is fixed, so SSR and the client agree and the rendered
 * hierarchy is identical on both.
 */

type TreeViewVariant = "default";
type TreeViewSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): TreeViewVariant {
  return (VARIANTS.includes(value) ? value : "default") as TreeViewVariant;
}

function asSize(value: string): TreeViewSize {
  return (SIZES.includes(value) ? value : "md") as TreeViewSize;
}

// Deterministic hierarchy, so the rendered tree is identical on server and client.
const NODES: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "Button.tsx" },
          { id: "card", label: "Card.tsx" },
          { id: "tree-view", label: "TreeView.tsx" },
        ],
      },
      {
        id: "lib",
        label: "lib",
        children: [
          { id: "cn", label: "cn.ts" },
          { id: "utils", label: "utils.ts" },
        ],
      },
      { id: "index", label: "index.ts" },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [
      { id: "favicon", label: "favicon.ico" },
      { id: "logo", label: "logo.svg" },
    ],
  },
  { id: "readme", label: "README.md" },
];

export function TreeViewPreview({ material, variant, size, state }: PreviewProps) {
  const resolvedVariant = asVariant(variant);
  const resolvedSize = asSize(size);
  const resolvedMaterial = material as StyleSlug;
  const isDisabled = state === "disabled";

  return (
    <div className={isDisabled ? "w-[min(320px,100%)] opacity-55" : "w-[min(320px,100%)]"}>
      <TreeView
        // Reset the uncontrolled expand/select state when the material switches,
        // so switching styles in the docs never carries a stale open branch.
        key={resolvedMaterial}
        defaultExpandedIds={["src", "components"]}
        defaultSelectedId="tree-view"
        label="Project files"
        material={resolvedMaterial}
        nodes={NODES}
        size={resolvedSize}
        variant={resolvedVariant}
      />
    </div>
  );
}
