import { BadgePreview } from "@/registry/previews/badge-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Badge component. */
export const entry: RegistryEntry = {
  slug: "badge",
  name: "Badge",
  nameEs: "Insignia",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A compact status and category label with five semantic tones, three sizes, an optional leading dot, and four self-contained material recipes.",
  descriptionEs:
    "Una etiqueta compacta para estados y categorías con cinco tonos semánticos, tres tamaños, punto inicial opcional y cuatro recetas de material autocontenidas.",
  variants: [
    { id: "neutral", label: "Neutral", labelEs: "Neutral" },
    { id: "success", label: "Success", labelEs: "Éxito" },
    { id: "warning", label: "Warning", labelEs: "Advertencia" },
    { id: "danger", label: "Danger", labelEs: "Peligro" },
    { id: "info", label: "Info", labelEs: "Información" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a plain <span> by default and does not assign a role that could misrepresent category metadata as a live announcement. Tone changes presentation only: visible children must name the state or category, and icon-only usage must provide aria-label, so meaning never depends on colour. Pass role=\"status\" when the text is a live status, as the preview does. The optional dot is aria-hidden. asChild can move the styles onto a semantic element chosen by the caller; focus-visible and forced documentation focus receive a 2px offset ring. Forced-colors mode replaces fills and shadows with Canvas, CanvasText and a system border. The component has no motion, so reduced-motion users receive the same immediate state updates. Every material/tone text pair measures at least 4.86:1, including both skeuo gradient stops, glass composited over black and white, and both adaptive colour schemes.",
  a11yEs:
    "Renderiza un <span> simple por defecto y no asigna un rol que pueda presentar metadatos de categoría como un anuncio en vivo. El tono solo cambia la presentación: los hijos visibles deben nombrar el estado o categoría, y el uso con solo icono debe incluir aria-label, para que el significado nunca dependa del color. Usa role=\"status\" cuando el texto sea un estado en vivo, como hace el preview. El punto opcional lleva aria-hidden. asChild puede trasladar los estilos al elemento semántico que elija quien consume el componente; focus-visible y el foco forzado de documentación reciben un anillo de 2px con desplazamiento. El modo de colores forzados reemplaza rellenos y sombras con Canvas, CanvasText y un borde de sistema. El componente no tiene movimiento, por lo que las actualizaciones también son inmediatas para quienes prefieren movimiento reducido. Cada par texto/material/tono mide al menos 4,86:1, incluidos ambos extremos del gradiente skeuo, glass compuesto sobre negro y blanco y los dos esquemas de color adaptive.",
  sourcePath: "src/registry/ui/badge.tsx",
  Preview: BadgePreview,
};
