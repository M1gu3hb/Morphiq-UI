import { MagneticButtonPreview } from "@/registry/previews/magnetic-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Magnetic Button. */
export const entry: RegistryEntry = {
  slug: "magnetic-button",
  name: "Magnetic Button",
  nameEs: "Botón magnético",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile native button whose surface and label follow a precise pointer on coordinated springs before settling cleanly at rest.",
  descriptionEs:
    "Un botón nativo y táctil cuya superficie y etiqueta siguen un puntero preciso con resortes coordinados antes de volver suavemente al reposo.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["motion", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a native <button> with type=\"button\" by default, keyboard activation, a high-contrast :focus-visible outline and the native disabled contract. Pointer attraction is decorative, limited to mouse pointers and disabled by prefers-reduced-motion; keyboard and coarse-pointer users receive the same stationary control. Text contrast is at least 6.44:1 for clay, 14.25:1 for glass, 12.29:1 for warm skeuo and 16.32:1 for adaptive (15.48:1 in its light dark-mode recipe). Forced-colors replaces every material with system ButtonFace, ButtonText, ButtonText border and Highlight focus outline.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, activación por teclado, contorno :focus-visible de alto contraste y el contrato nativo de deshabilitado. La atracción del puntero es decorativa, se limita al mouse y se desactiva con prefers-reduced-motion; teclado y punteros gruesos reciben el mismo control inmóvil. El contraste del texto es al menos 6,44:1 en clay, 14,25:1 en glass, 12,29:1 en skeuo cálido y 16,32:1 en adaptive (15,48:1 en su receta clara de modo oscuro). Forced-colors reemplaza cada material por ButtonFace, ButtonText, borde ButtonText y contorno de foco Highlight del sistema.",
  sourcePath: "src/registry/ui/magnetic-button.tsx",
  Preview: MagneticButtonPreview,
};
