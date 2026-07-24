import { CursorFollower } from "@/registry/ui/cursor-follower";
import type { PreviewProps } from "@/registry/schema";

type FollowerVariant = "ring" | "crosshair";
type EffectSize = "sm" | "md" | "lg";
const VARIANTS: readonly string[] = ["ring", "crosshair"];
const SIZES: readonly string[] = ["sm", "md", "lg"];

function asVariant(value: string): FollowerVariant {
  return (VARIANTS.includes(value) ? value : "ring") as FollowerVariant;
}

function asSize(value: string): EffectSize {
  return (SIZES.includes(value) ? value : "md") as EffectSize;
}

export function CursorFollowerPreview({ material, size, variant }: PreviewProps) {
  return (
    <CursorFollower className="w-[min(400px,100%)]" material={material} size={asSize(size)} variant={asVariant(variant)}>
      <p className="m-0 text-[11px] font-extrabold tracking-[0.14em] text-[#a8ff78] uppercase">Pointer companion</p>
      <h3 className="m-0 mt-[8px] max-w-[275px] text-[23px]/[1.08] font-extrabold tracking-[-0.04em]">A delayed ring, never a replacement cursor</h3>
      <a className="mt-auto w-fit rounded-full border border-white/20 bg-white/10 px-[14px] py-[8px] text-[12px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#a8ff78]" href="#cursor-follower-preview">
        Keyboard-safe link
      </a>
    </CursorFollower>
  );
}
