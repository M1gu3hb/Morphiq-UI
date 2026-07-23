import { AnnouncementBanner } from "@/registry/ui/announcement-banner";
import type { PreviewProps } from "@/registry/schema";

type SurfaceMaterial = "clay" | "glass" | "skeuo" | "adaptive";
type AnnouncementVariant = "inline" | "floating";
type AnnouncementSize = "sm" | "md" | "lg";
const MATERIALS: readonly string[] = ["clay", "glass", "skeuo", "adaptive"];
const VARIANTS: readonly string[] = ["inline", "floating"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asMaterial(value: string): SurfaceMaterial {
  return (MATERIALS.includes(value) ? value : "adaptive") as SurfaceMaterial;
}
function asVariant(value: string): AnnouncementVariant {
  return (VARIANTS.includes(value) ? value : "inline") as AnnouncementVariant;
}
function asSize(value: string): AnnouncementSize {
  return (SIZES.includes(value) ? value : "md") as AnnouncementSize;
}

export function AnnouncementBannerPreview({ material, variant, size, state }: PreviewProps) {
  return (
    <AnnouncementBanner
      aria-busy={state === "loading" || undefined}
      className={state === "disabled" ? "pointer-events-none w-full opacity-60" : "w-full"}
      dismissible={state !== "disabled"}
      material={asMaterial(material)}
      message={state === "error" ? "A service interruption is being investigated. Status updates are available." : undefined}
      size={asSize(size)}
      variant={asVariant(variant)}
    />
  );
}
