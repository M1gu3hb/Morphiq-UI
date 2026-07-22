import { AuroraTextPreview } from "@/registry/previews/aurora-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "aurora-text",
  name: "Aurora Text",
  nameEs: "Texto aurora",
  category: "text",
  materials: ["adaptive"],
  description: "Readable inherited text overlaid by a flowing multi-source aurora fill in ocean or sunset colors, animated entirely in local CSS.",
  descriptionEs: "Texto heredado legible cubierto por un relleno aurora fluido de múltiples fuentes en tonos océano o atardecer, animado enteramente con CSS local.",
  variants: [
    { id: "ocean", label: "Ocean", labelEs: "Océano" },
    { id: "sunset", label: "Sunset", labelEs: "Atardecer" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The original currentColor text remains present, readable and exposed exactly once. A separate aria-hidden copy carries the moving radial/linear aurora at controlled opacity, so the effect never replaces the contrast-bearing foreground or changes layout. prefers-reduced-motion freezes the gradient at a stable frame; forced-colors removes it and preserves CanvasText. The host owns typography and a foreground/background pair of at least 4.5:1, independent of aurora colors.",
  a11yEs: "El texto currentColor original permanece presente, legible y expuesto exactamente una vez. Una copia aria-hidden separada lleva la aurora radial/lineal móvil con opacidad controlada, así que el efecto nunca reemplaza el primer plano que aporta contraste ni cambia el layout. prefers-reduced-motion congela el degradado en un cuadro estable; forced-colors lo elimina y conserva CanvasText. El host controla tipografía y un par primer plano/fondo de al menos 4,5:1, independiente de los colores aurora.",
  sourcePath: "src/registry/ui/aurora-text.tsx",
  Preview: AuroraTextPreview,
};
