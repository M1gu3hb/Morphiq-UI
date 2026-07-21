import { StatPreview } from "@/registry/previews/stat-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Stat component. */
export const entry: RegistryEntry = {
  slug: "stat",
  name: "Stat",
  nameEs: "Estadística",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic KPI card with an associated label and value, optional caption, decorative icon slot, accessible trend delta, four tactile materials and three sizes.",
  descriptionEs:
    "Una tarjeta KPI semántica con etiqueta y valor asociados, leyenda opcional, espacio para ícono decorativo, tendencia accesible, cuatro materiales táctiles y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "outline", label: "Outline", labelEs: "Contorno" },
  ],
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
    "Stat uses a native dl whose grouping div contains dt followed by dd, preserving the label/value relationship without invented ARIA roles. The optional icon wrapper and arrow artwork are aria-hidden. A trend exposes a localized visually hidden word (Increase, Decrease or No change) before the visible signed delta, so direction remains explicit without colour or the arrow. Consumers can replace that word through trendLabel. All primary, muted, positive, negative and neutral text exceeds 4.5:1 against every owned surface, including glass over light/dark backdrops and both adaptive schemes. Forced-colors replaces material surfaces, shadows and trend colours with Canvas, CanvasText and system borders while the sign, arrow shape and hidden trend word remain. Hover changes only box-shadow and border-color; transition-property names exactly those properties, getAnimations() reports their CSS transitions, and prefers-reduced-motion removes them.",
  a11yEs:
    "Stat usa un dl nativo cuyo div de agrupación contiene dt seguido de dd, conservando la relación etiqueta/valor sin inventar roles ARIA. El contenedor opcional del ícono y el dibujo de flecha usan aria-hidden. Una tendencia expone una palabra localizada y visualmente oculta (Aumento, Disminución o Sin cambio) antes del delta visible con signo, así que la dirección permanece explícita sin depender del color ni de la flecha. Quien consume puede sustituir esa palabra con trendLabel. Todo el texto principal, atenuado, positivo, negativo y neutral supera 4,5:1 contra cada superficie propia, incluido glass sobre fondos claros/oscuros y ambos esquemas adaptive. Forced-colors sustituye superficies, sombras y colores de tendencia por Canvas, CanvasText y bordes del sistema mientras permanecen el signo, la forma de flecha y la palabra oculta. Hover cambia solo box-shadow y border-color; transition-property nombra exactamente esas propiedades, getAnimations() informa sus transiciones CSS y prefers-reduced-motion las elimina.",
  sourcePath: "src/registry/ui/stat.tsx",
  Preview: StatPreview,
};
