"use client";

import * as React from "react";
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Morphiq Sidebar Nav Tree
 *
 * The nested, collapsible navigation a documentation site puts down its left
 * edge: branches disclose child links and further sub-branches at arbitrary
 * depth, and every destination is a real `<a href>`. It renders recursively —
 * a branch renders the same node renderer again at `depth + 1`, and `depth` is
 * what drives the indent — so the shape of the tree is entirely data, not markup.
 *
 * This is NAVIGATION, not a selection widget: there is deliberately no
 * `role="tree"`, no roving tabindex and no typeahead. The markup is a plain
 * `<nav>` wrapping real `<ul>` / `<li>` lists, each branch label is a
 * `<button aria-expanded aria-controls>` toggling its nested list, and the
 * current page is an anchor carrying `aria-current="page"`. (The selection-widget
 * reading of the same shape is the separate Tree View component.)
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet. The one runtime dependency beyond React and `cn` is
 * lucide-react, for the branch caret and the folder / file glyphs.
 *
 *   <SidebarNavTree
 *     aria-label="Documentation"
 *     items={[
 *       { id: "start", label: "Getting started", defaultOpen: true, children: [
 *         { id: "install", label: "Installation", href: "/docs/install" },
 *         { id: "theming", label: "Theming", href: "/docs/theming", current: true },
 *       ] },
 *     ]}
 *     material="clay"
 *     size="md"
 *   />
 *
 * Disclosure state is uncontrolled by default and seeded twice over: a branch
 * opens if it asked to (`defaultOpen`) or if it contains the current page, so the
 * active leaf is always reachable on first paint. Pass `expanded` +
 * `onExpandedChange` to drive it from outside instead.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-panel        tree surface
 *   --mq-brd          panel border
 *   --mq-grad         surface wash (`none` when flat)
 *   --mq-shadow       panel depth
 *   --mq-blur         backdrop blur (glass only)
 *   --mq-head         branch label
 *   --mq-muted        caret / idle glyph
 *   --mq-link         leaf label
 *   --mq-hover-bg     hover wash on a row
 *   --mq-active-bg    current-page wash
 *   --mq-active-text  current-page label
 *   --mq-active-rule  the reserved rule colour on the current page
 *   --mq-path-rule    the reserved rule colour on an ancestor of the current page
 *   --mq-rail         nesting guide hairline
 *   --mq-rail-on      that hairline where it traces the active path
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the root nav; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-panel:#efe7db] [--mq-brd:rgba(120,80,55,0.20)] [--mq-blur:0px]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.05))]",
    // A raised panel: a bright top filo, a faint warm underline, a soft cast.
    // Warm brown ink throughout — clay never casts black.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(120,60,40,0.10),0_2px_12px_rgba(90,60,45,0.14)]",
    "[--mq-head:#33261e] [--mq-muted:#6a5346] [--mq-link:#5b4a3c]",
    "[--mq-hover-bg:rgba(255,255,255,0.55)]",
    "[--mq-active-bg:rgba(255,144,119,0.20)] [--mq-active-text:#4a1d13]",
    "[--mq-active-rule:#c9482f] [--mq-path-rule:rgba(201,72,47,0.42)]",
    "[--mq-rail:rgba(120,80,55,0.26)] [--mq-rail-on:rgba(201,72,47,0.55)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-panel:rgba(255,255,255,0.62)] [--mq-brd:rgba(255,255,255,0.75)] [--mq-blur:14px]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion. The panel frosts whatever sits behind it.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_20px_rgba(24,20,40,0.14)]",
    "[--mq-head:#1e1e1b] [--mq-muted:#36362f] [--mq-link:#2f2f29]",
    "[--mq-hover-bg:rgba(255,255,255,0.48)]",
    "[--mq-active-bg:rgba(255,255,255,0.62)] [--mq-active-text:#1b1c1b]",
    "[--mq-active-rule:#171817] [--mq-path-rule:rgba(23,24,23,0.40)]",
    "[--mq-rail:rgba(23,24,23,0.18)] [--mq-rail-on:rgba(23,24,23,0.55)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-panel:#e6e3da] [--mq-brd:rgba(25,25,23,0.28)] [--mq-blur:0px]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-grad:linear-gradient(180deg,#f0ede5,#dcd8ce)]",
    // A hard 1px bevel of light along the top, an achromatic machined shade
    // below, then a tight cast. The cold counterpart to clay's warm.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-2px_4px_rgba(0,0,0,0.10),0_2px_10px_rgba(38,36,31,0.20)]",
    "[--mq-head:#23231f] [--mq-muted:#4a4943] [--mq-link:#33322d]",
    "[--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:#f6f4ee] [--mq-active-text:#23231f]",
    "[--mq-active-rule:#3f3e39] [--mq-path-rule:rgba(63,62,57,0.55)]",
    "[--mq-rail:rgba(25,25,23,0.22)] [--mq-rail-on:rgba(35,35,31,0.62)]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the labels that sit on it.
  adaptive: [
    "[--mq-panel:#f7f6f3] [--mq-brd:rgba(23,24,23,0.14)] [--mq-blur:0px]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-grad:none]",
    "[--mq-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_3px_rgba(20,20,18,0.08)]",
    "[--mq-head:#1c1c19] [--mq-muted:#55554e] [--mq-link:#55554e]",
    "[--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:rgba(23,24,23,0.07)] [--mq-active-text:#1c1c19]",
    "[--mq-active-rule:#1c1c19] [--mq-path-rule:rgba(28,28,25,0.35)]",
    "[--mq-rail:rgba(23,24,23,0.16)] [--mq-rail-on:rgba(28,28,25,0.55)]",
    "[--mq-ring:#171817]",
    "dark:[--mq-panel:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_3px_rgba(0,0,0,0.45)]",
    "dark:[--mq-head:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-link:#b9b7b0]",
    "dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:rgba(255,255,255,0.11)] dark:[--mq-active-text:#f1efe9]",
    "dark:[--mq-active-rule:#f1efe9] dark:[--mq-path-rule:rgba(241,239,233,0.35)]",
    "dark:[--mq-rail:rgba(255,255,255,0.18)] dark:[--mq-rail-on:rgba(241,239,233,0.55)]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type SidebarNavTreeMaterial = keyof typeof MATERIAL_TOKENS;
type SidebarNavTreeVariant = "default";
type SidebarNavTreeSize = "sm" | "md" | "lg";

/**
 * Geometry the recursion needs as NUMBERS rather than classes.
 *
 * `step` is the indent one level of nesting adds. It is deliberately
 * `glyph + gap`, which makes a child row start exactly where its parent's label
 * starts: the child's own leading glyph then lands under the parent's, which is
 * the alignment that makes a deep tree readable instead of ragged.
 *
 * `rowPad` is the first level's inset, and `RULE_W` is the reserved rule every
 * row keeps in its box model (see `rowBase`).
 */
const SIZE_METRICS = {
  sm: { glyph: 14, rowPad: 8, step: 22 },
  md: { glyph: 16, rowPad: 10, step: 25 },
  lg: { glyph: 18, rowPad: 12, step: 28 },
} as const;

/** Width of the reserved left rule, in px. Part of every row's box model. */
const RULE_W = 3;

const rootVariants = cva(
  [
    "block w-full max-w-full overflow-hidden text-left",
    "rounded-[var(--mq-radius,16px)] border border-[var(--mq-brd,rgba(120,80,55,0.20))]",
    "bg-[var(--mq-panel,#efe7db)] [background-image:var(--mq-grad,none)]",
    "backdrop-blur-[var(--mq-blur,0px)]",
    "shadow-[var(--mq-shadow,inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(120,60,40,0.10),0_2px_12px_rgba(90,60,45,0.14))]",
    // Fills, gradients, shadows and blur are all discarded or meaningless once
    // the OS paints high-contrast, so clear the ornament and keep a real border.
    "forced-colors:border-[CanvasText] forced-colors:[background-image:none]",
    "forced-colors:shadow-none forced-colors:backdrop-blur-none",
  ].join(" "),
  {
    variants: {
      // One treatment today: a real axis so the registry, the docs switcher and a
      // future treatment all have a seam.
      variant: { default: "" },
      size: {
        sm: "[--mq-radius:13px]",
        md: "[--mq-radius:16px]",
        lg: "[--mq-radius:20px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

const listVariants = cva("m-0 flex list-none flex-col gap-[2px]", {
  variants: {
    size: { sm: "p-[5px]", md: "p-[6px]", lg: "p-[7px]" },
  },
  defaultVariants: { size: "md" },
});

/**
 * What a branch toggle and a leaf link share.
 *
 * Both reserve a 3px left rule that is transparent until it means something, so
 * marking the current page (or the path down to it) never changes the box model,
 * never shifts a row, and survives into forced-colors where fills do not.
 * `paddingInlineStart` is applied inline from `depth`, so it is intentionally
 * absent here.
 */
const rowBase = [
  "relative flex w-full items-center no-underline appearance-none bg-transparent text-left",
  "cursor-pointer rounded-[9px] tracking-[-0.01em]",
  "border-l-[3px] border-l-transparent",
  // Exactly the two properties the states change: the wash and the label.
  // Weight changes instantly and is not animated.
  "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
  "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
  "hover:text-[color:var(--mq-active-text,#4a1d13)]",
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
  "focus-visible:outline-[var(--mq-ring,#171817)]",
  // A parallel hook the docs preview uses to hold the ring open for inspection.
  "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[-2px]",
  "data-[focus=true]:outline-[var(--mq-ring,#171817)]",
  "forced-colors:text-[CanvasText] forced-colors:focus-visible:outline-[Highlight]",
  "disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

/** A branch toggle: caret, optional folder glyph, label. Heavier than a leaf. */
const branchVariants = cva(
  [
    rowBase,
    "group/branch font-semibold text-[color:var(--mq-head,#33261e)]",
    // On the path down to the current page: heavier weight AND the reserved rule
    // takes a muted accent, so an ancestor reads as "you are in here" without
    // ever being mistaken for the page itself.
    "data-[path=true]:font-extrabold",
    "data-[path=true]:border-l-[var(--mq-path-rule,rgba(201,72,47,0.42))]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[38px] gap-[8px] pr-[10px] text-[length:12px]",
        md: "min-h-[44px] gap-[9px] pr-[12px] text-[length:13px]",
        lg: "min-h-[50px] gap-[10px] pr-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** A leaf: a real destination. Marked four ways when it is the current page. */
const leafVariants = cva(
  [
    rowBase,
    "group/leaf font-medium text-[color:var(--mq-link,#5b4a3c)]",
    // Current page: weight, colour, wash AND the reserved rule — never colour
    // alone, and the rule is what forced-colors can still paint.
    "data-[current=true]:font-bold",
    "data-[current=true]:text-[color:var(--mq-active-text,#4a1d13)]",
    "data-[current=true]:bg-[var(--mq-active-bg,rgba(255,144,119,0.20))]",
    "data-[current=true]:border-l-[var(--mq-active-rule,#c9482f)]",
    "forced-colors:data-[current=true]:border-l-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[38px] gap-[8px] pr-[10px] text-[length:12px]",
        md: "min-h-[44px] gap-[9px] pr-[12px] text-[length:13px]",
        lg: "min-h-[50px] gap-[10px] pr-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * The nesting guide: a hairline dropped from a branch's caret through every row
 * it contains. It is pure decoration — the structure is already in the list
 * markup — so it is aria-hidden, and it thickens and warms only where it traces
 * the path down to the current page.
 */
const railClass = [
  "pointer-events-none absolute inset-y-[3px] w-px rounded-full",
  "bg-[var(--mq-rail,rgba(120,80,55,0.26))]",
  "data-[path=true]:w-[2px] data-[path=true]:bg-[var(--mq-rail-on,rgba(201,72,47,0.55))]",
  "forced-colors:bg-[CanvasText]",
].join(" ");

/**
 * The disclosed region.
 *
 * Height is animated with `grid-template-rows: 0fr → 1fr` over an
 * `overflow-hidden` wrapper — the modern way to ease to a content's natural
 * height with no max-height guess that clips a long branch or adds dead easing
 * time to a short one, and no measuring in JavaScript. Opacity rides along so a
 * branch fades rather than wipes.
 *
 * Under reduced motion the transition is dropped and both END STATES survive
 * untouched: a closed branch is closed, an open one is fully open.
 */
const panelClass = [
  "grid grid-rows-[0fr] opacity-0",
  "data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100",
  "transition-[grid-template-rows,opacity] duration-[240ms]",
  "ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
].join(" ");

export type SidebarNavTreeNode = {
  /** Stable identity: React key, disclosure state and active-path matching. */
  id: string;
  label: React.ReactNode;
  /**
   * Child nodes. A node WITH children is a branch — it renders as a disclosure
   * button and any `href` on it is ignored. A node without children is a leaf.
   */
  children?: readonly SidebarNavTreeNode[];
  /** Leaf destination. Without one the leaf renders as a `<button>`. */
  href?: string;
  /** Optional leading glyph (any node), overriding the folder / file default. */
  icon?: React.ReactNode;
  /** Marks the current page: `aria-current="page"` plus the active look. */
  current?: boolean;
  /** Seeds a branch open on first render. Ancestors of `current` open anyway. */
  defaultOpen?: boolean;
  /** Renders the row inert and dimmed. It stays in the tab order as disabled. */
  disabled?: boolean;
  /** Called when a link-less leaf is chosen. */
  onSelect?: () => void;
};

type TreeContextValue = {
  activePath: ReadonlySet<string>;
  icons: boolean;
  isOpen: (id: string) => boolean;
  metrics: { glyph: number; rowPad: number; step: number };
  setOpen: (id: string, next: boolean) => void;
  size: SidebarNavTreeSize;
  toggle: (id: string) => void;
};

const TreeContext = React.createContext<TreeContextValue | null>(null);

function useTree(part: string) {
  const context = React.useContext(TreeContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <SidebarNavTree>`);
  return context;
}

function hasChildren(node: SidebarNavTreeNode): node is SidebarNavTreeNode & {
  children: readonly SidebarNavTreeNode[];
} {
  return node.children !== undefined && node.children.length > 0;
}

/** Ids of every branch between the root and the node marked `current`. */
function findActivePath(
  nodes: readonly SidebarNavTreeNode[],
  trail: readonly string[] = [],
): string[] | null {
  for (const node of nodes) {
    if (node.current) return [...trail];
    if (hasChildren(node)) {
      const found = findActivePath(node.children, [...trail, node.id]);
      if (found) return found;
    }
  }
  return null;
}

/** Branches that should start open: they asked to, or they hold the current page. */
function seedExpanded(
  nodes: readonly SidebarNavTreeNode[],
  path: ReadonlySet<string>,
  out: string[] = [],
): string[] {
  for (const node of nodes) {
    if (!hasChildren(node)) continue;
    if (node.defaultOpen === true || path.has(node.id)) out.push(node.id);
    seedExpanded(node.children, path, out);
  }
  return out;
}

/** The leading glyph slot. Decoration: the label is the accessible name. */
function NodeGlyph({
  branch,
  node,
  open,
}: {
  branch: boolean;
  node: SidebarNavTreeNode;
  open: boolean;
}) {
  const { icons, metrics } = useTree("NodeGlyph");
  if (node.icon === undefined && !icons) return null;

  const fallback = branch ? (
    open ? (
      <FolderOpen strokeWidth={2} />
    ) : (
      <Folder strokeWidth={2} />
    )
  ) : (
    <FileText strokeWidth={2} />
  );

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center [&_svg]:size-full",
        "text-[color:var(--mq-muted,#6a5346)]",
        // The glyph follows its row's label into the active colour rather than
        // staying muted while the text beside it goes bold.
        "group-data-[current=true]/leaf:text-[color:var(--mq-active-text,#4a1d13)]",
        "group-data-[path=true]/branch:text-[color:var(--mq-active-text,#4a1d13)]",
        "forced-colors:text-[CanvasText]",
      )}
      style={{ height: `${metrics.glyph}px`, width: `${metrics.glyph}px` }}
    >
      {node.icon ?? fallback}
    </span>
  );
}

/** A destination. A real anchor whenever it has somewhere to go. */
function TreeLeaf({ depth, node }: { depth: number; node: SidebarNavTreeNode }) {
  const { metrics, size } = useTree("TreeLeaf");
  const isCurrent = node.current === true;

  const inner = (
    <>
      <NodeGlyph branch={false} node={node} open={false} />
      <span className="min-w-0 flex-1 truncate">{node.label}</span>
    </>
  );
  const shared = {
    "aria-current": isCurrent ? ("page" as const) : undefined,
    className: leafVariants({ size }),
    "data-current": isCurrent ? "true" : undefined,
    style: {
      paddingInlineStart: `${metrics.rowPad + depth * metrics.step}px`,
    } satisfies React.CSSProperties,
  };

  return (
    <li className="list-none">
      {node.href !== undefined && node.disabled !== true ? (
        <a {...shared} href={node.href} onClick={node.onSelect}>
          {inner}
        </a>
      ) : (
        <button {...shared} disabled={node.disabled} onClick={node.onSelect} type="button">
          {inner}
        </button>
      )}
    </li>
  );
}

/** A branch: a disclosure toggle over a nested list that may branch again. */
function TreeBranch({
  depth,
  node,
}: {
  depth: number;
  node: SidebarNavTreeNode & { children: readonly SidebarNavTreeNode[] };
}) {
  const { activePath, isOpen, metrics, setOpen, size, toggle } = useTree("TreeBranch");
  const panelId = React.useId();
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const rowStyle: React.CSSProperties = {
    paddingInlineStart: `${metrics.rowPad + depth * metrics.step}px`,
  };
  const open = isOpen(node.id);
  const onPath = activePath.has(node.id);
  // The guide drops from the caret's centre: past the reserved rule, past this
  // row's own indent, then half a glyph in.
  const railX = RULE_W + metrics.rowPad + depth * metrics.step + metrics.glyph / 2;

  /**
   * ArrowRight opens a closed branch, ArrowLeft closes an open one — the two
   * keys a reader coming from a file explorer expects. Enter and Space need no
   * handling at all: the toggle is a real `<button>`.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight" && !open) {
      event.preventDefault();
      setOpen(node.id, true);
      return;
    }
    if (event.key === "ArrowLeft" && open) {
      event.preventDefault();
      setOpen(node.id, false);
    }
  }

  /**
   * Escape inside a disclosed branch collapses it and hands focus back to the
   * toggle that opened it. Propagation stops here so the innermost branch is the
   * one that closes, and so the key never also dismisses a drawer or dialog the
   * tree happens to live inside.
   */
  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(node.id, false);
    buttonRef.current?.focus();
  }

  return (
    <li className="list-none">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={branchVariants({ size })}
        data-path={onPath ? "true" : undefined}
        data-state={open ? "open" : "closed"}
        disabled={node.disabled}
        onClick={() => toggle(node.id)}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        style={rowStyle}
        type="button"
      >
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "shrink-0 text-[color:var(--mq-muted,#6a5346)]",
            // Tailwind v4 writes rotation to the STANDALONE `rotate` property, so
            // the transition names `rotate`. A `transition-[transform]` here would
            // animate nothing and the caret would snap.
            "[rotate:0deg] group-data-[state=open]/branch:[rotate:90deg]",
            "transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
            "group-data-[path=true]/branch:text-[color:var(--mq-active-text,#4a1d13)]",
            "forced-colors:text-[CanvasText]",
          )}
          size={metrics.glyph}
          strokeWidth={2.5}
        />
        <NodeGlyph branch={true} node={node} open={open} />
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
      </button>

      <div
        className={panelClass}
        data-state={open ? "open" : "closed"}
        onKeyDown={handlePanelKeyDown}
      >
        <div className="relative overflow-hidden">
          <span
            aria-hidden="true"
            className={railClass}
            data-path={onPath ? "true" : undefined}
            style={{ insetInlineStart: `${railX}px` }}
          />
          {/*
            The region stays mounted while closed so the disclosure has something
            to animate — and so `aria-controls` above always points at a node that
            exists. `inert` takes it out of the accessibility tree and the tab
            order meanwhile, so nobody can land inside a collapsed branch.
          */}
          <ul
            className="m-0 flex list-none flex-col gap-[2px] p-0"
            id={panelId}
            inert={!open || undefined}
            role="list"
          >
            {renderNodes(node.children, depth + 1)}
          </ul>
        </div>
      </div>
    </li>
  );
}

/**
 * The recursion itself: one level of nodes, each branch free to open another.
 * The split is decided here, so a branch component only ever sees a node that
 * genuinely has children and a leaf only ever sees one that does not.
 */
function renderNodes(nodes: readonly SidebarNavTreeNode[], depth: number) {
  return nodes.map((node) =>
    hasChildren(node) ? (
      <TreeBranch depth={depth} key={node.id} node={node} />
    ) : (
      <TreeLeaf depth={depth} key={node.id} node={node} />
    ),
  );
}

export type SidebarNavTreeProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "children" | "onChange"
> & {
  items: readonly SidebarNavTreeNode[];
  /** Uncontrolled seed. Replaces the derived one (defaultOpen + active path). */
  defaultExpanded?: readonly string[];
  /** Controlled open branch ids. When set, `onExpandedChange` owns updates. */
  expanded?: readonly string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Folder / file glyphs on rows that bring no `icon` of their own. */
  icons?: boolean;
  material?: SidebarNavTreeMaterial;
  variant?: SidebarNavTreeVariant;
  size?: SidebarNavTreeSize;
};

export function SidebarNavTree({
  "aria-label": ariaLabel = "Documentation",
  className,
  defaultExpanded,
  expanded,
  icons = true,
  items,
  material = "clay",
  onExpandedChange,
  ref,
  size = "md",
  variant = "default",
  ...props
}: SidebarNavTreeProps) {
  const activePath = React.useMemo(
    () => new Set<string>(findActivePath(items) ?? []),
    [items],
  );

  // Seeded once, lazily: a branch starts open if it asked to or if it holds the
  // current page, so the active leaf is on screen at first paint — including
  // before hydration, since this runs during the initial render.
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() =>
    defaultExpanded !== undefined
      ? [...defaultExpanded]
      : seedExpanded(items, new Set<string>(findActivePath(items) ?? [])),
  );

  const controlled = expanded !== undefined;
  const current = expanded ?? uncontrolled;
  const openIds = React.useMemo(() => new Set<string>(current), [current]);

  const commit = React.useCallback(
    (next: string[]) => {
      if (!controlled) setUncontrolled(next);
      onExpandedChange?.(next);
    },
    // `setUncontrolled` is listed even though a state setter is stable: the React
    // Compiler lint rule infers it as a dependency and refuses to preserve the
    // memoization when the written list disagrees with the inferred one.
    [controlled, onExpandedChange, setUncontrolled],
  );

  const setOpen = React.useCallback(
    (id: string, next: boolean) => {
      if (current.includes(id) === next) return;
      commit(next ? [...current, id] : current.filter((entry) => entry !== id));
    },
    [commit, current],
  );

  const toggle = React.useCallback(
    (id: string) => setOpen(id, !current.includes(id)),
    [current, setOpen],
  );

  const context = React.useMemo<TreeContextValue>(
    () => ({
      activePath,
      icons,
      isOpen: (id: string) => openIds.has(id),
      metrics: SIZE_METRICS[size],
      setOpen,
      size,
      toggle,
    }),
    [activePath, icons, openIds, setOpen, size, toggle],
  );

  return (
    <TreeContext.Provider value={context}>
      <nav
        {...props}
        aria-label={ariaLabel}
        className={cn(MATERIAL_TOKENS[material], rootVariants({ size, variant }), className)}
        data-material={material}
        ref={ref}
      >
        <ul className={listVariants({ size })} role="list">
          {renderNodes(items, 0)}
        </ul>
      </nav>
    </TreeContext.Provider>
  );
}

export type SidebarNavTreeVariantProps = VariantProps<typeof rootVariants>;

export { branchVariants, leafVariants, rootVariants };
