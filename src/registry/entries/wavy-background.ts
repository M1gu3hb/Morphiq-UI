import { WavyBackgroundPreview } from "@/registry/previews/wavy-background-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "wavy-background",
  name: "Wavy Background",
  nameEs: "Fondo Ondulado",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "Three broad SVG sine curves drift at distinct speeds behind content, creating a calm layered current with only three painted paths and pure CSS keyframes.",
  descriptionEs: "Tres curvas sinusoidales SVG amplias derivan a distintas velocidades detrás del contenido y crean una corriente en capas con solo tres trazos pintados y keyframes CSS puros.",
  variants: [{ id: "calm", label: "Calm", labelEs: "Calma" }, { id: "vivid", label: "Vivid", labelEs: "Vívida" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The SVG is aria-hidden, cannot receive pointer events and contains only decorative paths. Children stay above the waves in DOM and paint order. prefers-reduced-motion stops all path translation at the authored position; forced-colors hides the SVG and restores a system Canvas surface with CanvasText.",
  a11yEs: "El SVG lleva aria-hidden, no recibe eventos de puntero y solo contiene trazos decorativos. Los hijos permanecen sobre las ondas en orden DOM y de pintura. prefers-reduced-motion detiene toda traslación en la posición definida; forced-colors oculta el SVG y restaura una superficie Canvas del sistema con CanvasText.",
  sourcePath: "src/registry/ui/wavy-background.tsx",
  Preview: WavyBackgroundPreview,
};
