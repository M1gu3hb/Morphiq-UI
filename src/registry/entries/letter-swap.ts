import { LetterSwapPreview } from "@/registry/previews/letter-swap-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "letter-swap",
  name: "Letter Swap",
  nameEs: "Intercambio de letras",
  category: "text",
  materials: ["adaptive"],
  description: "A vertical per-letter rollover on hover or explicit focus, with smooth or staggered timing and one stable accessible word.",
  descriptionEs: "Un rollover vertical por letra al pasar el cursor o recibir foco explícito, con tiempo uniforme o escalonado y una sola palabra accesible estable.",
  variants: [
    { id: "smooth", label: "Smooth", labelEs: "Uniforme" },
    { id: "staggered", label: "Staggered", labelEs: "Escalonado" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "A screen-reader-only whole word is the sole accessible text; duplicated visual glyphs are aria-hidden, so characters are never announced separately. The component does not enter the tab order by default, avoiding a decorative focus stop; focusable can be enabled deliberately or tabIndex supplied by the caller. Each clipped cell reserves one final glyph box, preventing CLS. Hover/focus animates only Tailwind 4's standalone translate property; reduced motion and forced colors lock it at zero while preserving the word and focus outline.",
  a11yEs: "Una palabra completa solo para lector es el único texto accesible; los glifos visuales duplicados usan aria-hidden, así que las letras nunca se anuncian por separado. El componente no entra al orden de tabulación por defecto, evitando una parada decorativa; focusable puede habilitarse de forma deliberada o el consumidor puede pasar tabIndex. Cada celda recortada reserva una caja final de glifo, evitando CLS. Hover/foco anima solo la propiedad translate independiente de Tailwind 4; movimiento reducido y forced colors la fijan en cero conservando palabra y contorno de foco.",
  sourcePath: "src/registry/ui/letter-swap.tsx",
  Preview: LetterSwapPreview,
};
