import { HexagonPatternPreview } from "@/registry/previews/hexagon-pattern-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "hexagon-pattern",
  name: "Hexagon Pattern",
  nameEs: "Patrón Hexagonal",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A seamless hexagonal tessellation assembled from five repeated CSS gradients, with a full field and an optional radial edge fade — no SVG IDs or repeated DOM nodes.",
  descriptionEs: "Un teselado hexagonal continuo armado con cinco gradientes CSS repetidos, con campo completo y un desvanecido radial opcional en bordes, sin IDs SVG ni nodos DOM repetidos.",
  variants: [{ id: "solid", label: "Solid", labelEs: "Completo" }, { id: "faded", label: "Faded", labelEs: "Desvanecido" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The tessellation is one aria-hidden, pointer-transparent CSS layer behind children. It is static and causes no motion or layout change; prefers-reduced-motion therefore needs no behavioral override. forced-colors removes the pattern and restores CanvasText on Canvas while reading and focus order remain unchanged.",
  a11yEs: "El teselado es una sola capa CSS con aria-hidden que deja pasar el puntero detrás de los hijos. Es estático y no causa movimiento ni cambio de layout; por ello prefers-reduced-motion no necesita cambio de conducta. forced-colors elimina el patrón y restaura CanvasText sobre Canvas sin alterar lectura ni foco.",
  sourcePath: "src/registry/ui/hexagon-pattern.tsx",
  Preview: HexagonPatternPreview,
};
