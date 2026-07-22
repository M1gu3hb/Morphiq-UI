import { ImageComparisonPreview } from "@/registry/previews/image-comparison-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Image Comparison. */
export const entry: RegistryEntry = {
  slug: "image-comparison",
  name: "Image Comparison",
  nameEs: "Comparador de imágenes",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile before-and-after viewer with a pointer-draggable, touch-friendly and fully keyboard-operable reveal divider.",
  descriptionEs:
    "Un visor táctil de antes y después con divisor arrastrable por puntero, compatible con toque y completamente operable por teclado.",
  variants: [
    { id: "labels", label: "With labels", labelEs: "Con etiquetas" },
    { id: "clean", label: "Clean", labelEs: "Limpio" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Both source images require meaningful alt text. The divider exposes role=slider with min, max, current value and a value text that names both sides. Left/Right and Down/Up move by step, Page keys move by ten steps, and Home/End reach the limits; pointer capture provides the same control for mouse and touch. Visible labels supplement rather than replace image alternatives. prefers-reduced-motion removes divider and clip transitions, while forced-colors restores a system boundary, divider, knob and Highlight focus outline. Labels use white on a 74% black scrim (at least 10.3:1).",
  a11yEs:
    "Ambas imágenes requieren texto alt significativo. El divisor expone role=slider con mínimo, máximo, valor actual y un texto de valor que nombra ambos lados. Izquierda/derecha y abajo/arriba avanzan por step, Page avanza diez pasos y Home/End llega a los límites; pointer capture ofrece el mismo control para mouse y toque. Las etiquetas visibles complementan, no sustituyen, los alternativos. prefers-reduced-motion elimina las transiciones y forced-colors recupera límite, divisor, perilla y foco Highlight del sistema. Las etiquetas usan blanco sobre velo negro al 74% (al menos 10,3:1).",
  sourcePath: "src/registry/ui/image-comparison.tsx",
  Preview: ImageComparisonPreview,
};
