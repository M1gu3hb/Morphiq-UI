"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Morphiq Sidebar
 *
 * A vertical side navigation. Its links are grouped under labelled sections, and
 * every section is a real disclosure: a `<button aria-expanded aria-controls>`
 * that opens and closes a region of links, animated with `grid-template-rows`
 * (0fr → 1fr) so the panel eases to its natural height without a max-height
 * guess. The whole rail can also collapse to an icon strip via an optional,
 * labelled toggle — a second disclosure whose `aria-expanded` reflects whether
 * the sidebar is open.
 *
 * Self-contained by design: all four material recipes live in this file, every
 * local custom property carries a literal fallback, and no class comes from the
 * site's global stylesheet.
 *
 * Data-driven API:
 *
 *   <Sidebar
 *     aria-label="Workspace"
 *     activeId="overview"
 *     collapsible
 *     groups={[
 *       { id: "main", label: "Workspace", icon: <Home />, links: [
 *         { id: "overview", label: "Overview", href: "/", icon: <LayoutGrid /> },
 *         { id: "usage",    label: "Usage",    href: "/usage", icon: <Activity /> },
 *       ] },
 *     ]}
 *     material="clay" size="md"
 *   />
 *
 * Group open/closed state is uncontrolled (seeded from each group's
 * `defaultOpen`, which defaults to open). The rail collapse is uncontrolled by
 * `defaultCollapsed` or controlled by `collapsed` + `onCollapsedChange`. The
 * active link is whichever id matches `activeId`; it takes `aria-current="page"`
 * plus a heavier weight and a reserved left rule, so its state is never carried
 * by colour alone.
 *
 * Every link with an `href` renders as a real `<a>`, so the browser owns
 * keyboard activation, middle-click and open-in-new-tab; a link without one
 * renders as a `<button>`. Because sections and links are icon + label, a
 * collapsed rail keeps each accessible name (the label goes visually hidden, not
 * removed) and shows the glyph. Provide an `icon` for the best rail; without one
 * a monogram of the label's first letter stands in.
 *
 * Local theming knobs (each use includes a literal fallback):
 *
 *   --mq-panel        sidebar surface
 *   --mq-brd          panel border + section separators
 *   --mq-grad         surface wash (`none` when flat)
 *   --mq-shadow       panel depth
 *   --mq-blur         backdrop blur (glass only)
 *   --mq-head         section label
 *   --mq-muted        section eyebrow / idle glyph
 *   --mq-link         idle link label
 *   --mq-hover-bg     hover wash on a row
 *   --mq-active-bg    active link wash
 *   --mq-active-text  active link label
 *   --mq-active-rule  the reserved rule colour when active
 *   --mq-ring         focus ring
 */

/** Palette per material. Declared on the root; the parts inherit it. */
const MATERIAL_TOKENS = {
  clay: [
    "[--mq-panel:#efe7db] [--mq-brd:rgba(120,80,55,0.20)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.42),rgba(151,92,58,0.05))]",
    // A raised panel: a bright top filo, a faint warm underline and a soft cast.
    // Warm brown ink throughout — clay never casts black.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(120,60,40,0.10),0_2px_12px_rgba(90,60,45,0.14)]",
    "[--mq-blur:0px]",
    "[--mq-head:#33261e] [--mq-muted:#6a5346] [--mq-link:#5b4a3c]",
    "[--mq-hover-bg:rgba(255,255,255,0.55)]",
    "[--mq-active-bg:rgba(255,144,119,0.20)] [--mq-active-text:#4a1d13] [--mq-active-rule:#c9482f]",
    "[--mq-ring:#171817]",
  ].join(" "),
  glass: [
    "[--mq-panel:rgba(255,255,255,0.62)] [--mq-brd:rgba(255,255,255,0.75)]",
    "[--mq-grad:linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))]",
    // A 1px specular filo over a wide cool cast shadow. No side wall: glass has
    // no extrusion. The panel frosts whatever sits behind it.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(255,255,255,0.26),0_6px_20px_rgba(24,20,40,0.14)]",
    "[--mq-blur:14px]",
    "[--mq-head:#1e1e1b] [--mq-muted:#36362f] [--mq-link:#2f2f29]",
    "[--mq-hover-bg:rgba(255,255,255,0.48)]",
    "[--mq-active-bg:rgba(255,255,255,0.60)] [--mq-active-text:#1b1c1b] [--mq-active-rule:#171817]",
    "[--mq-ring:#171817]",
  ].join(" "),
  skeuo: [
    "[--mq-panel:#e6e3da] [--mq-brd:rgba(25,25,23,0.28)]",
    // The surface IS the gradient: lit over body, the moulded-plastic read.
    "[--mq-grad:linear-gradient(180deg,#f0ede5,#dcd8ce)]",
    // A hard 1px bevel of light along the top, an achromatic machined shade
    // below, then a tight cast. The cold counterpart to clay's warm.
    "[--mq-shadow:inset_0_1px_0_rgba(255,255,255,0.90),inset_0_-2px_4px_rgba(0,0,0,0.10),0_2px_10px_rgba(38,36,31,0.20)]",
    "[--mq-blur:0px]",
    "[--mq-head:#23231f] [--mq-muted:#4a4943] [--mq-link:#33322d]",
    "[--mq-hover-bg:rgba(255,255,255,0.45)]",
    "[--mq-active-bg:#f6f4ee] [--mq-active-text:#23231f] [--mq-active-rule:#3f3e39]",
    "[--mq-ring:#171817]",
  ].join(" "),
  // Polymorphic: no ornament. It adapts — the palette follows the colour scheme.
  // Safe here because every surface it names is opaque and flips together with
  // the text that sits on it.
  adaptive: [
    "[--mq-panel:#f7f6f3] [--mq-brd:rgba(23,24,23,0.14)]",
    // Explicitly `none` so a shared class's literal fallback cannot leak clay's
    // ornament onto the one material meant to have none.
    "[--mq-grad:none]",
    "[--mq-shadow:inset_0_0_0_rgba(20,20,18,0),0_1px_3px_rgba(20,20,18,0.08)]",
    "[--mq-blur:0px]",
    "[--mq-head:#1c1c19] [--mq-muted:#55554e] [--mq-link:#55554e]",
    "[--mq-hover-bg:rgba(23,24,23,0.05)]",
    "[--mq-active-bg:rgba(23,24,23,0.06)] [--mq-active-text:#1c1c19] [--mq-active-rule:#1c1c19]",
    "[--mq-ring:#171817]",
    "dark:[--mq-panel:#232327] dark:[--mq-brd:rgba(255,255,255,0.16)]",
    "dark:[--mq-shadow:inset_0_0_0_rgba(0,0,0,0),0_1px_3px_rgba(0,0,0,0.45)]",
    "dark:[--mq-head:#f1efe9] dark:[--mq-muted:#b9b7b0] dark:[--mq-link:#b9b7b0]",
    "dark:[--mq-hover-bg:rgba(255,255,255,0.08)]",
    "dark:[--mq-active-bg:rgba(255,255,255,0.10)] dark:[--mq-active-text:#f1efe9] dark:[--mq-active-rule:#f1efe9]",
    "dark:[--mq-ring:#f1efe9]",
  ].join(" "),
} as const;

type SidebarMaterial = keyof typeof MATERIAL_TOKENS;
type SidebarVariant = "default";
type SidebarSize = "sm" | "md" | "lg";

const rootVariants = cva(
  [
    // `group/sb` lets rows react to the collapsed rail. `flex flex-col` stacks
    // the header over a scrollable body. The width animates between the full
    // panel and the rail; both are real tokens so the transition names `width`
    // against an actual change, never a phantom.
    "group/sb flex flex-col shrink-0 overflow-hidden",
    "w-[var(--mq-w,264px)] data-[collapsed=true]:w-[var(--mq-rail,64px)]",
    "transition-[width] duration-200 ease-out motion-reduce:transition-none",
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
      variant: { default: "" },
      size: {
        sm: "[--mq-w:224px] [--mq-rail:56px] [--mq-radius:13px]",
        md: "[--mq-w:264px] [--mq-rail:64px] [--mq-radius:16px]",
        lg: "[--mq-w:300px] [--mq-rail:72px] [--mq-radius:20px]",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** The top row: an optional heading and the rail toggle. */
const headerVariants = cva(
  "flex shrink-0 items-center gap-[8px] border-b border-[var(--mq-brd,rgba(120,80,55,0.20))] forced-colors:border-[CanvasText] group-data-[collapsed=true]/sb:justify-center",
  {
    variants: {
      size: {
        sm: "min-h-[42px] px-[8px]",
        md: "min-h-[48px] px-[10px]",
        lg: "min-h-[54px] px-[12px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** The section disclosure button. Uppercase eyebrow + chevron. */
const groupHeaderVariants = cva(
  [
    "flex w-full cursor-pointer appearance-none items-center bg-transparent",
    "rounded-[10px] font-bold uppercase tracking-[0.06em] text-left",
    "text-[color:var(--mq-muted,#6a5346)]",
    "transition-colors duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[-2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:text-[CanvasText]",
    "group-data-[collapsed=true]/sb:justify-center",
    "disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[34px] gap-[8px] px-[8px] text-[length:10px]",
        md: "min-h-[38px] gap-[10px] px-[10px] text-[length:11px]",
        lg: "min-h-[44px] gap-[12px] px-[12px] text-[length:12px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const linkVariants = cva(
  [
    "relative flex w-full items-center no-underline appearance-none bg-transparent text-left cursor-pointer",
    "rounded-[10px] tracking-[-0.01em] font-medium text-[color:var(--mq-link,#5b4a3c)]",
    // A reserved left rule, transparent until active. It marks the current page —
    // kept in the box model so forced-colors can colour it, and never the only
    // signal (weight + aria-current ride alongside).
    "border-l-[3px] border-l-transparent",
    "transition-colors duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
    // Active: weight, colour, wash AND the reserved rule.
    "aria-[current=page]:font-bold aria-[current=page]:text-[color:var(--mq-active-text,#4a1d13)]",
    "aria-[current=page]:bg-[var(--mq-active-bg,rgba(255,144,119,0.20))]",
    "aria-[current=page]:border-l-[var(--mq-active-rule,#c9482f)]",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "data-[focus=true]:outline-2 data-[focus=true]:outline-offset-[-2px] data-[focus=true]:outline-[var(--mq-ring,#171817)]",
    // Fills vanish in forced-colors, so the active item is marked with a system
    // colour on the reserved rule already held in the box model.
    "forced-colors:aria-[current=page]:border-l-[CanvasText] forced-colors:text-[CanvasText]",
    "forced-colors:focus-visible:outline-[Highlight]",
    "group-data-[collapsed=true]/sb:justify-center",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-45 disabled:cursor-not-allowed disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[36px] gap-[9px] pl-[9px] pr-[10px] text-[length:12px]",
        md: "min-h-[42px] gap-[10px] pl-[11px] pr-[12px] text-[length:13px]",
        lg: "min-h-[48px] gap-[12px] pl-[13px] pr-[14px] text-[length:14px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** The rail toggle: a compact square button. */
const toggleVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center",
    "rounded-[9px] border border-transparent bg-transparent text-[color:var(--mq-muted,#6a5346)]",
    "transition-colors duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-[var(--mq-hover-bg,rgba(255,255,255,0.55))]",
    "focus-visible:outline-2 focus-visible:outline-offset-[2px] focus-visible:outline-[var(--mq-ring,#171817)]",
    "forced-colors:focus-visible:outline-[Highlight] forced-colors:text-[CanvasText]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-[30px] [&_svg]:size-[16px]",
        md: "size-[34px] [&_svg]:size-[18px]",
        lg: "size-[38px] [&_svg]:size-[20px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SidebarLink = {
  /** Stable identity for React and for matching `activeId`. */
  id: string;
  label: string;
  /** When present the item renders as an anchor; otherwise a button. */
  href?: string;
  /** Optional leading icon (any node). Rendered aria-hidden before the label. */
  icon?: React.ReactNode;
  /** Renders the link inert and dimmed; it leaves the tab and arrow order. */
  disabled?: boolean;
};

export type SidebarGroup = {
  /** Stable identity for React and disclosure state. */
  id: string;
  label: string;
  /** Optional leading icon shown beside the section eyebrow and in the rail. */
  icon?: React.ReactNode;
  links: readonly SidebarLink[];
  /** Whether the section starts open. Defaults to open. */
  defaultOpen?: boolean;
};

export type SidebarProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onChange" | "children"
> & {
  groups: readonly SidebarGroup[];
  /** Id of the link marked as the current page. */
  activeId?: string;
  /** Optional brand / title node shown in the header row; hidden in the rail. */
  heading?: React.ReactNode;
  material?: SidebarMaterial;
  variant?: SidebarVariant;
  size?: SidebarSize;
  /** Show the rail toggle so the sidebar can shrink to an icon strip. */
  collapsible?: boolean;
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. When set, `onCollapsedChange` owns updates. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

/** First letter of a label, a stand-in glyph when a row has no icon. */
function Monogram({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-[1.15em] place-items-center rounded-[5px] text-[0.8em] font-bold [font-feature-settings:'ss01']"
    >
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** The leading glyph: the given icon, or a monogram fallback so the rail is never blank. */
function Glyph({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center [&_svg]:size-[1.15em] forced-colors:text-[CanvasText]"
    >
      {icon !== undefined ? icon : <Monogram label={label} />}
    </span>
  );
}

export function Sidebar({
  "aria-label": ariaLabel = "Sidebar",
  activeId,
  className,
  collapsed,
  collapsible = false,
  defaultCollapsed = false,
  groups,
  heading,
  material = "clay",
  onCollapsedChange,
  onKeyDown,
  ref,
  size = "md",
  variant = "default",
  ...props
}: SidebarProps) {
  const navRef = React.useRef<HTMLElement | null>(null);
  const groupsId = React.useId();

  // Group disclosure state is uncontrolled: seeded once from each group's
  // `defaultOpen` (defaulting to open) in a state initializer, never in an
  // effect, so nothing sets state during a commit.
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      groups.map((group) => [group.id, group.defaultOpen ?? true] as [string, boolean]),
    ),
  );

  const isCollapsedControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const isCollapsed = isCollapsedControlled ? collapsed : internalCollapsed;

  const toggleGroup = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (!isCollapsedControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  /**
   * Up/Down/Home/End move focus between every enabled control in the sidebar —
   * the toggle, the section headers and the reachable links — treating the whole
   * rail as one vertical composite. Enter and Space need no handling: the
   * triggers are real `<button>`s and the links are real anchors. Closed
   * sections are `inert`, so their links are skipped here as well as by Tab.
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const root = navRef.current;
    if (!root) return;
    const items = [
      ...root.querySelectorAll<HTMLElement>("[data-sidebar-focusable]"),
    ].filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        el.getAttribute("aria-disabled") !== "true" &&
        !el.closest("[inert]"),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    event.preventDefault();
    const last = items.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowDown"
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={cn(MATERIAL_TOKENS[material], rootVariants({ size, variant }), className)}
      data-collapsed={isCollapsed ? "true" : "false"}
      data-material={material}
      onKeyDown={handleKeyDown}
      ref={(node) => {
        navRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      {heading !== undefined || collapsible ? (
        <div className={headerVariants({ size })}>
          {heading !== undefined ? (
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-extrabold tracking-[-0.01em]",
                "text-[color:var(--mq-head,#33261e)] forced-colors:text-[CanvasText]",
                "text-[length:14px] group-data-[collapsed=true]/sb:sr-only",
              )}
            >
              {heading}
            </span>
          ) : (
            <span className="flex-1 group-data-[collapsed=true]/sb:hidden" />
          )}
          {collapsible ? (
            <button
              aria-controls={groupsId}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={toggleVariants({ size })}
              data-sidebar-focusable=""
              onClick={toggleCollapsed}
              type="button"
            >
              {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className="flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto p-[var(--mq-body-pad,8px)]"
        id={groupsId}
      >
        {groups.map((group, groupIndex) => {
          const groupOpen = open[group.id] ?? true;
          const headerId = `${groupsId}-h${groupIndex}`;
          const regionId = `${groupsId}-r${groupIndex}`;
          return (
            <div
              className={cn(
                "group/grp flex flex-col",
                groupIndex > 0
                  ? "mt-[2px] border-t border-[var(--mq-brd,rgba(120,80,55,0.20))] pt-[4px] forced-colors:border-[CanvasText]"
                  : "",
              )}
              data-state={groupOpen ? "open" : "closed"}
              key={group.id}
            >
              <button
                aria-controls={regionId}
                aria-expanded={groupOpen}
                className={groupHeaderVariants({ size })}
                data-sidebar-focusable=""
                id={headerId}
                onClick={() => toggleGroup(group.id)}
                type="button"
              >
                {group.icon !== undefined ? (
                  <Glyph icon={group.icon} label={group.label} />
                ) : null}
                <span className="min-w-0 flex-1 truncate group-data-[collapsed=true]/sb:sr-only">
                  {group.label}
                </span>
                {/* Chevron rotates with the STANDALONE `rotate` property, which
                    `transition-[rotate]` names; `transition-transform` would
                    animate nothing against it. Hidden in the rail, where the
                    section icon alone carries the affordance. */}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-[1.05em] shrink-0 group-data-[collapsed=true]/sb:hidden forced-colors:text-[CanvasText]",
                    "[rotate:0deg] group-data-[state=open]/grp:[rotate:-180deg]",
                    "transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
                  )}
                />
              </button>

              {/* The region stays mounted so the grid transition has something to
                  animate, but it is `inert` while closed — out of the a11y tree
                  and the tab order, so a keyboard user cannot land inside a
                  collapsed section. */}
              <div
                aria-labelledby={headerId}
                className={cn(
                  "grid grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
                  "transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                )}
                data-state={groupOpen ? "open" : "closed"}
                id={regionId}
                inert={!groupOpen || undefined}
                role="group"
              >
                <ul className="m-0 min-h-0 list-none overflow-hidden p-0">
                  {group.links.map((link) => {
                    const isActive = link.id === activeId;
                    const isDisabled = Boolean(link.disabled);
                    const inner = (
                      <>
                        <Glyph icon={link.icon} label={link.label} />
                        <span className="min-w-0 flex-1 truncate group-data-[collapsed=true]/sb:sr-only">
                          {link.label}
                        </span>
                      </>
                    );
                    return (
                      <li className="mt-[1px]" key={link.id}>
                        {link.href !== undefined && !isDisabled ? (
                          <a
                            aria-current={isActive ? "page" : undefined}
                            className={linkVariants({ size })}
                            data-sidebar-focusable=""
                            href={link.href}
                          >
                            {inner}
                          </a>
                        ) : (
                          <button
                            aria-current={isActive ? "page" : undefined}
                            className={linkVariants({ size })}
                            data-sidebar-focusable={isDisabled ? undefined : ""}
                            disabled={isDisabled}
                            type="button"
                          >
                            {inner}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export type SidebarVariantProps = VariantProps<typeof rootVariants>;

export { groupHeaderVariants, linkVariants, rootVariants };
