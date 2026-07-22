import { RainbowButtonPreview } from "@/registry/previews/rainbow-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Rainbow Button. */
export const entry: RegistryEntry = {
  slug: "rainbow-button",
  name: "Rainbow Button",
  nameEs: "Botón arcoíris",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile native button framed by a flowing spectral perimeter and soft halo while its label stays on a stable material surface.",
  descriptionEs:
    "Un botón nativo y táctil enmarcado por un perímetro espectral fluido y un halo suave, mientras su etiqueta permanece sobre una superficie estable.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "Renders a native <button> with type=\"button\" by default, keyboard activation, a separated :focus-visible outline and native disabled behavior. The moving spectrum and blurred halo are aria-hidden decoration, never state or meaning. prefers-reduced-motion freezes both loops and tactile transitions; disabled controls also stop and suppress the halo. The label remains on an opaque controlled surface with at least 4.5:1 contrast in every material and adaptive scheme. Forced-colors hides the halo and replaces gradients and shadows with system ButtonFace, ButtonText, ButtonText border and Highlight focus outline.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, activación por teclado, contorno :focus-visible separado y comportamiento nativo de deshabilitado. El espectro móvil y el halo difuso son decoración aria-hidden, nunca estado ni significado. prefers-reduced-motion congela ambos bucles y las transiciones táctiles; el control deshabilitado también se detiene y suprime el halo. La etiqueta permanece sobre una superficie opaca controlada con contraste mínimo de 4,5:1 en cada material y esquema adaptive. Forced-colors oculta el halo y reemplaza degradados y sombras por ButtonFace, ButtonText, borde ButtonText y contorno Highlight del sistema.",
  sourcePath: "src/registry/ui/rainbow-button.tsx",
  Preview: RainbowButtonPreview,
};
