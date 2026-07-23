"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** The four Morphiq materials, inlined so the component stays self-contained. */
type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Morphiq Tree View
 *
 * A collapsible hierarchical tree built from a `{ id, label, children? }[]` prop.
 * Self-contained by design: every recipe lives in this file, every local custom
 * property carries a literal fallback, and nothing comes from a global
 * stylesheet, so copying this file plus `src/lib/cn.ts` reproduces the full look.
 *
 * This is a data component and it is deliberately material-AGNOSTIC: it ships a
 * single adaptive style whose palette follows the colour scheme (light + dark).
 * `material` is accepted only for catalog parity and reflected on
 * `data-material`; it drives no separate recipe.
 *
 * Accessibility is native, not bolted on — the visual IS the accessible widget:
 *   - The root is `role="tree"` with an accessible name (`aria-label`), each node
 *     is a `role="treeitem"` carrying `aria-level`, `aria-setsize`,
 *     `aria-posinset`, `aria-selected`, and — on parents only — `aria-expanded`.
 *     Every child list is a `role="group"`. A screen reader therefore reads the
 *     real hierarchy, position and state, not an interpretation of a drawing.
 *   - EXPANSION is never carried by colour: it is announced by `aria-expanded`
 *     and shown to sighted users by the chevron's ORIENTATION (a shape that
 *     rotates 90° when open), so the open/closed state survives with colour off.
 *   - SELECTION is never carried by colour: it is announced by `aria-selected`
 *     and shown to sighted users by a heavier font weight in addition to the
 *     tint, so it reads without perceiving the fill.
 *   - ROVING TABINDEX: exactly one treeitem is tabbable at a time. ArrowUp/Down
 *     move to the previous/next VISIBLE item, ArrowRight expands a collapsed
 *     parent then steps into its first child, ArrowLeft collapses an open parent
 *     then steps out to its parent, Home/End jump to the first/last visible item,
 *     and Enter/Space select (toggling a parent open). A supplementary `sr-only`
 *     summary states the item count and depth.
 *   - The chevron's rotation is a state transition, reduced-motion-safe: its
 *     resting value is the FINAL rotation for the current state (SSR, no-JS and
 *     reduced motion all show the correct orientation), and
 *     `motion-reduce:transition-none` drops the travel.
 *   - In forced-colors mode the chevron becomes CanvasText, the selected row
 *     becomes Highlight / HighlightText and the focus ring becomes Highlight, so
 *     structure and state stay perceivable once fills are discarded.
 *   - Every value is a prop and ids come from `React.useId()`, so nothing in
 *     render depends on the current time or randomness.
 *
 * Local theming knobs (each used with a literal fallback at its use site):
 *
 *   --mq-text           row text colour
 *   --mq-muted          supplementary text colour
 *   --mq-chevron        chevron stroke colour
 *   --mq-row-hover      hover wash on a row
 *   --mq-selected       selected-row background tint
 *   --mq-selected-text  selected-row text colour
 *   --mq-ring           focus ring colour
 *   --mq-font           row font size (set by size)
 *   --mq-row-py         vertical row padding (set by size)
 *   --mq-icon           chevron box size (set by size)
 */

/** sr-only helper, inlined so the component owns no global class. */
const SR_ONLY =
  "absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [margin:-1px]";

type Size = "sm" | "md" | "lg";

export type TreeNode = {
  /** Stable, unique id. Drives expansion, selection and keyboard navigation. */
  id: string;
  /** Visible content of the row and the treeitem's accessible name. */
  label: React.ReactNode;
  /** Child nodes. A node with a non-empty array is an expandable parent. */
  children?: TreeNode[];
};

/** Per-size indentation geometry, in px (base inset + per-level step). */
const SIZE_GEOM: Record<Size, { base: number; indent: number }> = {
  sm: { base: 8, indent: 16 },
  md: { base: 10, indent: 20 },
  lg: { base: 12, indent: 24 },
};

const treeVariants = cva(
  [
    "relative isolate block w-full text-left",
    "text-[length:var(--mq-font,13px)] text-[color:var(--mq-text,#1c1c19)]",
    "forced-colors:text-[CanvasText]",
    // Adaptive light+dark token vocabulary. One agnostic style, both schemes.
    "[--mq-text:#1c1c19] [--mq-muted:#55554e] [--mq-chevron:#7a786f]",
    "[--mq-row-hover:rgba(23,24,23,0.05)] [--mq-selected:rgba(63,91,217,0.14)] [--mq-selected-text:#1c1c19]",
    "[--mq-ring:#171817]",
    "dark:[--mq-text:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-chevron:#b9b7b0]",
    "dark:[--mq-row-hover:rgba(255,255,255,0.07)] dark:[--mq-selected:rgba(142,162,255,0.24)] dark:[--mq-selected-text:#f1efe9]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
  {
    variants: {
      variant: { default: "" },
      size: {
        sm: "[--mq-font:12px] [--mq-row-py:5px] [--mq-icon:15px]",
        md: "[--mq-font:13px] [--mq-row-py:6px] [--mq-icon:16px]",
        lg: "[--mq-font:14px] [--mq-row-py:8px] [--mq-icon:18px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** A visible node, flattened in top-to-bottom order for keyboard navigation. */
type FlatItem = {
  id: string;
  level: number;
  posinset: number;
  setsize: number;
  hasChildren: boolean;
  parentId: string | null;
};

/** Ordered list of the currently VISIBLE nodes, respecting the expanded set. */
function flattenVisible(nodes: TreeNode[], expanded: Set<string>): FlatItem[] {
  const out: FlatItem[] = [];
  const walk = (list: TreeNode[], level: number, parentId: string | null) => {
    list.forEach((node, index) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      out.push({ id: node.id, level, posinset: index + 1, setsize: list.length, hasChildren, parentId });
      if (hasChildren && expanded.has(node.id)) {
        walk(node.children as TreeNode[], level + 1, node.id);
      }
    });
  };
  walk(nodes, 1, null);
  return out;
}

/** Total node count and maximum depth across the whole tree, for the summary. */
function measureTree(nodes: TreeNode[]): { total: number; depth: number } {
  let total = 0;
  let depth = 0;
  const walk = (list: TreeNode[], level: number) => {
    if (list.length > 0) depth = Math.max(depth, level);
    for (const node of list) {
      total += 1;
      if (node.children && node.children.length > 0) walk(node.children, level + 1);
    }
  };
  walk(nodes, 1);
  return { total, depth };
}

export type TreeViewProps = Omit<
  React.ComponentPropsWithRef<"div">,
  "children" | "onSelect"
> &
  Omit<VariantProps<typeof treeVariants>, "variant" | "size"> & {
    /** The hierarchy to render, in display order. The single source of truth. */
    nodes: TreeNode[];
    /** Accessible name for the tree, rendered as the root's `aria-label`. */
    label: string;
    /** Accepted for catalog parity; a single agnostic style. Reflected on data-material. */
    material?: MaterialSlug;
    variant?: "default";
    size?: Size;
    /** Uncontrolled: ids expanded on first render. */
    defaultExpandedIds?: string[];
    /** Controlled expansion. When set, `onExpandedChange` owns the updates. */
    expandedIds?: string[];
    /** Notified with the next expanded id list whenever expansion changes. */
    onExpandedChange?: (ids: string[]) => void;
    /** Uncontrolled: the id selected on first render. */
    defaultSelectedId?: string | null;
    /** Controlled selection. When set, `onSelect` owns the updates. */
    selectedId?: string | null;
    /** Notified with the id of a newly selected node. */
    onSelect?: (id: string) => void;
  };

/**
 * The tree. The hierarchy is a prop; expansion and selection are React state
 * (controlled or uncontrolled), so nothing in render is time-dependent or
 * random and there is nothing to hydrate.
 */
export function TreeView({
  className,
  defaultExpandedIds,
  defaultSelectedId = null,
  expandedIds,
  label,
  material = "adaptive",
  nodes,
  onExpandedChange,
  onSelect,
  selectedId: selectedIdProp,
  size = "md",
  variant = "default",
  ...props
}: TreeViewProps) {
  const rawId = React.useId();
  const summaryId = `mq-tree-${rawId.replace(/:/g, "")}`;

  const isControlledExpansion = expandedIds !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? []),
  );
  const expandedSet = React.useMemo(
    () => (isControlledExpansion ? new Set(expandedIds) : uncontrolledExpanded),
    [isControlledExpansion, expandedIds, uncontrolledExpanded],
  );

  const isControlledSelection = selectedIdProp !== undefined;
  const [uncontrolledSelected, setUncontrolledSelected] = React.useState<string | null>(
    defaultSelectedId,
  );
  const selectedId = isControlledSelection ? selectedIdProp : uncontrolledSelected;

  // Roving tabindex: the one treeitem that is tabbable. Kept in sync with DOM
  // focus so tabbing back into the tree lands where the user last was.
  const [focusedId, setFocusedId] = React.useState<string | null>(() => nodes[0]?.id ?? null);

  const itemRefs = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const setItemRef = React.useCallback(
    (id: string) => (element: HTMLLIElement | null) => {
      if (element) itemRefs.current.set(id, element);
      else itemRefs.current.delete(id);
    },
    [],
  );

  const visible = React.useMemo(() => flattenVisible(nodes, expandedSet), [nodes, expandedSet]);
  const { total, depth } = React.useMemo(() => measureTree(nodes), [nodes]);

  // Guarantee exactly one tabbable item even if the focused node was hidden by a
  // collapse: fall back to the first visible item.
  const tabbableId =
    focusedId !== null && visible.some((item) => item.id === focusedId)
      ? focusedId
      : (visible[0]?.id ?? null);

  const setExpansion = React.useCallback(
    (id: string, next: boolean) => {
      const nextSet = new Set(expandedSet);
      if (next) nextSet.add(id);
      else nextSet.delete(id);
      if (!isControlledExpansion) setUncontrolledExpanded(nextSet);
      onExpandedChange?.([...nextSet]);
    },
    [expandedSet, isControlledExpansion, onExpandedChange],
  );

  const toggleExpanded = React.useCallback(
    (id: string) => setExpansion(id, !expandedSet.has(id)),
    [expandedSet, setExpansion],
  );

  const selectItem = React.useCallback(
    (id: string) => {
      if (!isControlledSelection) setUncontrolledSelected(id);
      onSelect?.(id);
    },
    [isControlledSelection, onSelect],
  );

  const focusItem = React.useCallback((id: string) => {
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  }, []);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      const target = event.target as HTMLElement | null;
      const currentId = target?.getAttribute?.("data-node-id");
      if (!currentId) return;

      const flat = flattenVisible(nodes, expandedSet);
      const index = flat.findIndex((item) => item.id === currentId);
      if (index === -1) return;
      const current = flat[index];
      const isExpanded = expandedSet.has(current.id);

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          focusItem(flat[Math.min(index + 1, flat.length - 1)].id);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          focusItem(flat[Math.max(index - 1, 0)].id);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          if (current.hasChildren && !isExpanded) {
            setExpansion(current.id, true);
          } else if (current.hasChildren && isExpanded) {
            const child = flat[index + 1];
            if (child && child.level > current.level) focusItem(child.id);
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          if (current.hasChildren && isExpanded) {
            setExpansion(current.id, false);
          } else if (current.parentId) {
            focusItem(current.parentId);
          }
          break;
        }
        case "Home": {
          event.preventDefault();
          if (flat.length > 0) focusItem(flat[0].id);
          break;
        }
        case "End": {
          event.preventDefault();
          if (flat.length > 0) focusItem(flat[flat.length - 1].id);
          break;
        }
        case "Enter":
        case " ":
        case "Spacebar": {
          event.preventDefault();
          selectItem(current.id);
          if (current.hasChildren) toggleExpanded(current.id);
          break;
        }
        default:
          break;
      }
    },
    [nodes, expandedSet, focusItem, setExpansion, selectItem, toggleExpanded],
  );

  const geom = SIZE_GEOM[size];

  const renderList = (list: TreeNode[], level: number): React.ReactNode =>
    list.map((node, index) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = hasChildren && expandedSet.has(node.id);
      const isSelected = node.id === selectedId;
      const isTabbable = node.id === tabbableId;

      return (
        <li
          key={node.id}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-level={level}
          aria-posinset={index + 1}
          aria-selected={isSelected}
          aria-setsize={list.length}
          className={cn(
            "list-none outline-none",
            // The visible focus ring is drawn on the row only (a direct child),
            // not the whole treeitem box — a `>` selector keeps it off the nested
            // group so focusing a parent never rings its descendants.
            "[&:focus-visible>[data-row]]:outline-2 [&:focus-visible>[data-row]]:outline-offset-[-2px]",
            "[&:focus-visible>[data-row]]:outline-[var(--mq-ring,#171817)]",
            "forced-colors:[&:focus-visible>[data-row]]:outline-[Highlight]",
          )}
          data-node-id={node.id}
          ref={setItemRef(node.id)}
          role="treeitem"
          tabIndex={isTabbable ? 0 : -1}
        >
          <div
            className={cn(
              "flex select-none items-center gap-[6px] rounded-[8px] pe-[8px]",
              "py-[var(--mq-row-py,6px)] cursor-pointer",
              "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
              "hover:[background-color:var(--mq-row-hover,rgba(23,24,23,0.05))]",
              isSelected
                ? cn(
                    "font-semibold [background-color:var(--mq-selected,rgba(63,91,217,0.14))]",
                    "text-[color:var(--mq-selected-text,#1c1c19)]",
                    "forced-colors:[background-color:Highlight] forced-colors:text-[HighlightText]",
                  )
                : "font-normal",
            )}
            data-row=""
            onClick={() => {
              focusItem(node.id);
              selectItem(node.id);
            }}
            style={{ paddingInlineStart: geom.base + (level - 1) * geom.indent }}
          >
            {hasChildren ? (
              // Decorative twistie: it toggles on click but carries no state of
              // its own to assistive tech — `aria-expanded` on the treeitem does.
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center justify-center"
                onClick={(event) => {
                  event.stopPropagation();
                  focusItem(node.id);
                  toggleExpanded(node.id);
                }}
              >
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    "h-[var(--mq-icon,16px)] w-[var(--mq-icon,16px)] shrink-0",
                    "[stroke:var(--mq-chevron,#7a786f)] forced-colors:[stroke:CanvasText]",
                    // Standalone `rotate` property (never `transform`), so the
                    // matching `transition-[rotate]` animates it. Resting value is
                    // the final orientation for the current state.
                    "[rotate:0deg] transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
                    isExpanded && "[rotate:90deg]",
                  )}
                  strokeWidth={2.25}
                />
              </span>
            ) : (
              <span aria-hidden="true" className="w-[var(--mq-icon,16px)] shrink-0" />
            )}
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
          </div>

          {isExpanded ? (
            <ul className="m-0 list-none p-0" role="group">
              {renderList(node.children as TreeNode[], level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <div
      {...props}
      className={cn(treeVariants({ variant, size }), className)}
      data-material={material}
    >
      {/* Supplementary spoken summary; the tree structure below is authoritative. */}
      <p className={SR_ONLY} id={summaryId}>
        {`${label}: tree with ${total} ${total === 1 ? "item" : "items"} across ${depth} ${
          depth === 1 ? "level" : "levels"
        }. Use the arrow keys to move between items and expand or collapse groups.`}
      </p>

      <ul
        aria-describedby={summaryId}
        aria-label={label}
        className="m-0 list-none p-0"
        onKeyDown={handleKeyDown}
        role="tree"
      >
        {renderList(nodes, 1)}
      </ul>
    </div>
  );
}

export { treeVariants };
