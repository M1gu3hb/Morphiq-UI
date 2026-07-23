import { LogoWall, type LogoWallItem } from "@/registry/ui/logo-wall";
import type { PreviewProps } from "@/registry/schema";

type LogoVariant = "framed" | "mono";
type LogoSize = "sm" | "md" | "lg";
const LOGOS: readonly LogoWallItem[] = [
  { id: "north", src: "https://dummyimage.com/180x64/e9eef8/20263a&text=NORTH", alt: "North Studio logo" },
  { id: "luma", src: "https://dummyimage.com/180x64/f4eadc/35261d&text=LUMA", alt: "Luma Works logo" },
  { id: "arc", src: "https://dummyimage.com/180x64/e6f4ed/173a2a&text=ARC", alt: "Arc Systems logo" },
  { id: "mono", src: "https://dummyimage.com/180x64/eee8f7/31234a&text=MONO", alt: "Mono Labs logo" },
  { id: "atlas", src: "https://dummyimage.com/180x64/f5e7e7/4a2020&text=ATLAS", alt: "Atlas Company logo" },
  { id: "field", src: "https://dummyimage.com/180x64/e7f0f5/18323f&text=FIELD", alt: "Field Group logo" },
  { id: "kin", src: "https://dummyimage.com/180x64/f4f0df/3f3616&text=KIN", alt: "Kin Collective logo" },
  { id: "form", src: "https://dummyimage.com/180x64/e9e9e7/272724&text=FORM", alt: "Form Office logo" },
];

export function LogoWallPreview({ material, variant, size }: PreviewProps) {
  return <LogoWall className="w-[min(620px,100%)]" logos={LOGOS} material={material} size={(["sm", "md", "lg"].includes(size) ? size : "md") as LogoSize} variant={(["framed", "mono"].includes(variant) ? variant : "framed") as LogoVariant} />;
}
