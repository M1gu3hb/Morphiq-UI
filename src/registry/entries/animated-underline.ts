import { AnimatedUnderlinePreview } from "@/registry/previews/animated-underline-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "animated-underline",
  name: "Animated Underline",
  nameEs: "Subrayado animado",
  category: "text",
  materials: ["adaptive"],
  description: "A configurable underline that draws once on entrance or expands on hover and deliberate keyboard focus.",
  descriptionEs: "Un subrayado configurable que se dibuja al entrar o se expande con hover y foco de teclado deliberado.",
  variants: [
    { id: "interaction", label: "Interaction", labelEs: "Interacción" },
    { id: "entrance", label: "Entrance", labelEs: "Entrada" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The original text stays in normal reading order; the underline is aria-hidden and never carries meaning alone. Interactive mode does not add a tab stop unless focusable or tabIndex is supplied. Tailwind 4's standalone scale property is covered by transition-[scale]. Reduced motion leaves the underline fully drawn, and forced-colors paints it with CanvasText.",
  a11yEs: "El texto original permanece en orden normal de lectura; el subrayado usa aria-hidden y nunca porta significado por sí solo. El modo interactivo no agrega una parada de tabulación salvo que se pase focusable o tabIndex. La propiedad scale independiente de Tailwind 4 está cubierta por transition-[scale]. Movimiento reducido deja el subrayado completo y forced-colors lo pinta con CanvasText.",
  sourcePath: "src/registry/ui/animated-underline.tsx",
  Preview: AnimatedUnderlinePreview,
};
