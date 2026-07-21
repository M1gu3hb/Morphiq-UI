import { Breadcrumb, type BreadcrumbLinkItem } from "@/registry/ui/breadcrumb";
import type { PreviewProps } from "@/registry/schema";

/** Full and collapsed breadcrumb examples for the component catalog. */

type BreadcrumbVariant = "default" | "solid";
type BreadcrumbSize = "sm" | "md" | "lg";

const VARIANTS: readonly string[] = ["default", "solid"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

const FULL_PATH: readonly BreadcrumbLinkItem[] = [
  { id: "home", href: "#home", label: "Home" },
  { id: "components", href: "#components", label: "Components" },
  { id: "navigation", href: "#navigation", label: "Navigation" },
];

const LONG_PATH: readonly BreadcrumbLinkItem[] = [
  { id: "home", href: "#home", label: "Home" },
  { id: "products", href: "#products", label: "Products" },
  { id: "workspace", href: "#workspace", label: "Workspace" },
  { id: "settings", href: "#settings", label: "Settings" },
  { id: "navigation", href: "#navigation", label: "Navigation" },
];

function asVariant(value: string): BreadcrumbVariant {
  return (VARIANTS.includes(value) ? value : "default") as BreadcrumbVariant;
}

function asSize(value: string): BreadcrumbSize {
  return (SIZES.includes(value) ? value : "md") as BreadcrumbSize;
}

export function BreadcrumbPreview({ material, size, state, variant }: PreviewProps) {
  const resolvedSize = asSize(size);
  const resolvedVariant = asVariant(variant);
  const focusProps = state === "focus" ? { "data-focus": "true" } : undefined;
  const fullPath = FULL_PATH.map((item) =>
    item.id === "components" ? { ...item, linkProps: focusProps } : item,
  );

  return (
    <div className="grid w-[min(620px,100%)] gap-[16px]" data-breadcrumb-preview="">
      <div className="grid gap-[6px]">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase">Full path</span>
        <Breadcrumb
          aria-busy={state === "loading" || undefined}
          current={{ id: "breadcrumb", label: "Breadcrumb" }}
          items={fullPath}
          material={material}
          size={resolvedSize}
          variant={resolvedVariant}
        />
      </div>
      <div className="grid gap-[6px]">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase">
          Collapsed path
        </span>
        <Breadcrumb
          aria-label="Collapsed breadcrumb"
          current={{ id: "details", label: "Details" }}
          items={LONG_PATH}
          material={material}
          maxItems={4}
          size={resolvedSize}
          variant={resolvedVariant}
        />
      </div>
    </div>
  );
}
