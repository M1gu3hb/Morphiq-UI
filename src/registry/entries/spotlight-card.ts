import { SpotlightCardPreview } from "@/registry/previews/spotlight-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Spotlight Card. */
export const entry: RegistryEntry = {
  slug: "spotlight-card",
  name: "Spotlight Card",
  nameEs: "Tarjeta Spotlight",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic tactile card whose self-contained radial halo follows the pointer through two local CSS coordinates and returns to a centred keyboard-safe fallback.",
  descriptionEs:
    "Una tarjeta semántica y táctil cuyo halo radial autocontenido sigue al puntero mediante dos coordenadas CSS locales y vuelve a un respaldo centrado y seguro para teclado.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a semantic <article> and never invents button semantics for a container that may hold headings, links or controls. The card is not added to the tab order by default; callers can pass tabIndex when the surface itself needs focus, while :focus-within also outlines it as a real descendant receives keyboard focus. Pointer coordinates only affect an aria-hidden decorative layer, so content, reading order and activation never depend on the halo. With no pointer the fallback is centred, and prefers-reduced-motion turns the halo off and removes the tactile lift. forced-colors removes gradients, translucency, shadows and the decorative light, then restores a CanvasText boundary and system Highlight outline. Primary and secondary text remain at least 4.5:1 against every owned material surface, including both adaptive schemes; the visible material boundaries are at least 3:1 against their surfaces.",
  a11yEs:
    "Renderiza un <article> semántico y nunca inventa semántica de botón para un contenedor que puede albergar encabezados, enlaces o controles. La tarjeta no entra al orden de tabulación por defecto; quien la usa puede pasar tabIndex cuando la propia superficie necesite foco, mientras :focus-within también la contornea cuando un descendiente real recibe foco de teclado. Las coordenadas del puntero solo afectan una capa decorativa con aria-hidden, así que el contenido, el orden de lectura y la activación nunca dependen del halo. Sin puntero el respaldo queda centrado, y prefers-reduced-motion apaga el halo y elimina la elevación táctil. forced-colors quita degradados, translucidez, sombras y la luz decorativa, y recupera un límite CanvasText y un contorno Highlight del sistema. El texto primario y secundario mantienen al menos 4,5:1 contra cada superficie material propia, incluidos ambos esquemas de adaptive; los límites visibles de material alcanzan al menos 3:1 contra sus superficies.",
  sourcePath: "src/registry/ui/spotlight-card.tsx",
  Preview: SpotlightCardPreview,
};
