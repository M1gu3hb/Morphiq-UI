import { TextHighlightPreview } from "@/registry/previews/text-highlight-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "text-highlight",
  name: "Text Highlight",
  nameEs: "Texto resaltado",
  category: "text",
  materials: ["adaptive"],
  description: "Semantic keyword highlighting with a marker or underline that sweeps behind matching phrases without duplicating or replacing the text.",
  descriptionEs: "Resaltado semántico de palabras clave con marcador o subrayado que barre detrás de frases coincidentes sin duplicar ni sustituir el texto.",
  variants: [
    { id: "marker", label: "Marker", labelEs: "Marcador" },
    { id: "underline", label: "Underline", labelEs: "Subrayado" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The original sentence remains in normal reading order and matching phrases use native mark elements, so emphasis has semantic meaning beyond color. Only the sweeping background is aria-hidden and absolutely positioned behind the glyphs; it occupies no layout space. prefers-reduced-motion skips the sweep and leaves the completed highlight. forced-colors hides the painted layer and supplies a system Highlight underline. Text inherits the host foreground and must retain at least 4.5:1 contrast without the marker.",
  a11yEs: "La frase original permanece en orden normal de lectura y las coincidencias usan elementos mark nativos, por lo que el énfasis tiene significado semántico además del color. Solo el fondo que barre usa aria-hidden y posición absoluta detrás de los glifos; no ocupa espacio de layout. prefers-reduced-motion omite el barrido y conserva el resaltado completo. forced-colors oculta la capa pintada y aporta un subrayado Highlight del sistema. El texto hereda el primer plano del host y debe conservar al menos 4,5:1 sin el marcador.",
  sourcePath: "src/registry/ui/text-highlight.tsx",
  Preview: TextHighlightPreview,
};
