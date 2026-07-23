import { NoiseOverlayPreview } from "@/registry/previews/noise-overlay-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "noise-overlay", name: "Noise Overlay", nameEs: "Capa de Grano", category: "effects", materials: ["adaptive"],
  description: "A configurable fine or coarse grain layer from one inline SVG turbulence data URI, adding texture without extra nodes or movement.",
  descriptionEs: "Una capa configurable de grano fino o grueso generada por un único data URI SVG de turbulencia, que añade textura sin nodos extra ni movimiento.",
  variants: [{ id: "fine", label: "Fine", labelEs: "Fino" }, { id: "coarse", label: "Coarse", labelEs: "Grueso" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The texture is one aria-hidden, pointer-transparent layer above paint but below no semantic content; children remain in their own foreground stacking context. Opacity is clamped to 0–.32 and the owned text remains high contrast. It is static, so reduced motion has nothing to stop; forced colors removes the grain and restores CanvasText on Canvas.",
  a11yEs: "La textura es una sola capa con aria-hidden que deja pasar el puntero; los hijos permanecen en su propio contexto frontal. La opacidad se limita a 0–.32 y el texto conserva alto contraste. Es estática, así que movimiento reducido no necesita detener nada; forced-colors elimina el grano y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/noise-overlay.tsx", Preview: NoiseOverlayPreview,
};
