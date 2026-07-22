import { GlowEffectPreview } from "@/registry/previews/glow-effect-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Glow Effect. */
export const entry: RegistryEntry = {
  slug: "glow-effect",
  name: "Glow Effect",
  nameEs: "Efecto de resplandor",
  category: "effects",
  materials: ["adaptive"],
  description:
    "An opaque content surface with a radial glow behind it that either follows the pointer through local coordinates or breathes in place.",
  descriptionEs:
    "Una superficie de contenido opaca con un resplandor radial detrás que sigue al puntero mediante coordenadas locales o respira en su sitio.",
  variants: [
    { id: "follow", label: "Follow", labelEs: "Seguir" },
    { id: "pulse", label: "Pulse", labelEs: "Pulso" },
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
    "The radial light is pointer-ignoring and aria-hidden behind an opaque content surface; it never supplies meaning, focus or contrast. Pointer coordinates are local custom properties and reset to center on leave. The wrapper adds no control role, while real descendants keep their native focus and trigger a visible focus-within outline. prefers-reduced-motion prevents pointer tracking, forces centered coordinates and stops the pulse; forced-colors removes the glow and restores Canvas/CanvasText with a Highlight focus outline. Owned text exceeds 4.5:1 on the surface.",
  a11yEs:
    "La luz radial ignora el puntero y es aria-hidden detrás de una superficie de contenido opaca; nunca aporta significado, foco ni contraste. Las coordenadas del puntero son propiedades locales y vuelven al centro al salir. El wrapper no añade rol de control, mientras los descendientes reales conservan su foco nativo y activan un contorno focus-within visible. prefers-reduced-motion impide el seguimiento, fuerza coordenadas centradas y detiene el pulso; forced-colors elimina el resplandor y restaura Canvas/CanvasText con contorno Highlight. El texto propio supera 4,5:1 sobre la superficie.",
  sourcePath: "src/registry/ui/glow-effect.tsx",
  Preview: GlowEffectPreview,
};
