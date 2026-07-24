import { GlareHoverPreview } from "@/registry/previews/glare-hover-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "glare-hover",
  name: "Glare Hover",
  nameEs: "Reflejo al Hover",
  category: "effects",
  materials: ["adaptive"],
  description: "A diagonal CSS reflection crosses a surface on hover or focus-within with exact translate and opacity coverage.",
  descriptionEs: "Un reflejo diagonal CSS cruza una superficie con hover o focus-within y cobertura exacta de translate y opacidad.",
  variants: [
    { id: "silver", label: "Silver", labelEs: "Plateado" },
    { id: "warm", label: "Warm", labelEs: "Cálido" },
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
  a11y: "The reflection is aria-hidden and pointer-transparent. It responds equally to hover and focus within without adding a redundant tab stop; reduced motion leaves a faint static highlight and forced colors removes it while preserving the surface boundary.",
  a11yEs: "El reflejo lleva aria-hidden y deja pasar el puntero. Responde por igual a hover y foco interno sin añadir una parada redundante; movimiento reducido deja un realce estático tenue y colores forzados lo elimina conservando el límite.",
  sourcePath: "src/registry/ui/glare-hover.tsx",
  Preview: GlareHoverPreview,
};
