import { GradientButtonPreview } from "@/registry/previews/gradient-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Gradient Button. */
export const entry: RegistryEntry = {
  slug: "gradient-button",
  name: "Gradient Button",
  nameEs: "Botón degradado",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile native button with coordinated CSS gradients flowing through its material edge and readable inner surface.",
  descriptionEs:
    "Un botón nativo y táctil con degradados CSS coordinados que fluyen por el borde del material y su superficie interior legible.",
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
    "Renders a native <button> with type=\"button\" by default, keyboard activation, a 2px offset :focus-visible outline and native disabled behavior. The animated gradients are decorative and never encode state. They stop, along with tactile transitions, under prefers-reduced-motion and when disabled. The label sits on the controlled inner gradient rather than the animated perimeter and maintains at least 4.5:1 contrast in all four materials and both adaptive schemes. Forced-colors removes the gradients and shadows in favor of system ButtonFace, ButtonText, ButtonText border and Highlight focus outline.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, activación por teclado, contorno :focus-visible separado de 2 px y comportamiento nativo de deshabilitado. Los degradados animados son decorativos y nunca codifican estado. Se detienen, junto con las transiciones táctiles, con prefers-reduced-motion y al estar deshabilitado. La etiqueta vive sobre el degradado interior controlado y no sobre el perímetro animado, con contraste mínimo de 4,5:1 en los cuatro materiales y ambos esquemas adaptive. Forced-colors elimina degradados y sombras a favor de ButtonFace, ButtonText, borde ButtonText y contorno Highlight del sistema.",
  sourcePath: "src/registry/ui/gradient-button.tsx",
  Preview: GradientButtonPreview,
};
