import { RippleBackgroundPreview } from "@/registry/previews/ripple-background-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "ripple-background",
  name: "Ripple Background",
  nameEs: "Fondo de Ondas Concéntricas",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A pure-CSS full-bleed background with four concentric rings that pulse outward on staggered keyframes, then freeze into a quiet static field under reduced motion.",
  descriptionEs: "Un fondo full-bleed en CSS puro con cuatro anillos concéntricos que laten hacia afuera en keyframes escalonados y se congelan en un campo estático suave con movimiento reducido.",
  variants: [{ id: "soft", label: "Soft", labelEs: "Suave" }, { id: "bold", label: "Bold", labelEs: "Intenso" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The rings are decorative and aria-hidden; children remain in a separate foreground layer with stable reading and focus order. The base exposes a high-contrast foreground colour independent from the ring paint. prefers-reduced-motion stops every keyframe and leaves faint static rings; forced-colors removes them and restores Canvas with CanvasText.",
  a11yEs: "Los anillos son decorativos y llevan aria-hidden; los hijos permanecen en una capa frontal con orden estable de lectura y foco. La base expone un color frontal de alto contraste independiente de la pintura de los anillos. prefers-reduced-motion detiene todos los keyframes y deja anillos estáticos tenues; forced-colors los elimina y restaura Canvas con CanvasText.",
  sourcePath: "src/registry/ui/ripple-background.tsx",
  Preview: RippleBackgroundPreview,
};
