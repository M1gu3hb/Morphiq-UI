import { AuroraBackgroundPreview } from "@/registry/previews/aurora-background-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Aurora Background. */
export const entry: RegistryEntry = {
  slug: "aurora-background",
  name: "Aurora Background",
  nameEs: "Fondo Aurora",
  category: "backgrounds",
  materials: ["adaptive"],
  description:
    "A full-bleed container that drifts soft aurora light behind its content with pure CSS — layered radial gradients on a blurred sheet whose position loops through a local keyframe. Material-agnostic single style; freezes under reduced motion and clears under forced colors.",
  descriptionEs:
    "Un contenedor full-bleed que desplaza luz de aurora suave detrás de su contenido con CSS puro — gradientes radiales sobre una capa desenfocada cuya posición se repite con un keyframe local. Estilo único agnóstico al material; se congela con movimiento reducido y se limpia con forced-colors.",
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
    "A decorative full-bleed background. The aurora is an aria-hidden layer behind the content, so reading order, focus and activation never depend on it, and children sit on a z-indexed content layer that carries its own contrast. The rotation keyframe travels with the component and is deduplicated, so many auroras on a page emit one rule. prefers-reduced-motion freezes the drift to a static gradient, and forced-colors removes the aurora entirely and restores a system Canvas surface with CanvasText content. Being material-agnostic it ships a single fixed palette rather than a per-material recipe; the demo content is chosen to stay at least 4.5:1 against the surface, and callers are responsible for the contrast of their own content, which the effect never overrides because it sits behind an opaque base.",
  a11yEs:
    "Un fondo decorativo full-bleed. La aurora es una capa con aria-hidden detrás del contenido, así que el orden de lectura, el foco y la activación nunca dependen de ella, y los hijos van en una capa de contenido con z-index que lleva su propio contraste. El keyframe de rotación viaja con el componente y se deduplica, así que muchas auroras en una página emiten una sola regla. prefers-reduced-motion congela el desplazamiento en un gradiente estático, y forced-colors quita la aurora por completo y restaura una superficie Canvas del sistema con contenido CanvasText. Al ser agnóstico al material entrega una paleta fija única en vez de una receta por material; el contenido de demostración se elige para mantener al menos 4,5:1 contra la superficie, y quien lo usa es responsable del contraste de su propio contenido, que el efecto nunca pisa porque va detrás de una base opaca.",
  sourcePath: "src/registry/ui/aurora-background.tsx",
  Preview: AuroraBackgroundPreview,
};
