import { BreadcrumbPreview } from "@/registry/previews/breadcrumb-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Breadcrumb component. */
export const entry: RegistryEntry = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  nameEs: "Migas de navegación",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic breadcrumb trail with four tactile materials, optional middle-level collapse, decorative separators and three responsive sizes.",
  descriptionEs:
    "Una ruta semántica de migas con cuatro materiales táctiles, colapso opcional de niveles intermedios, separadores decorativos y tres tamaños responsivos.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "solid", label: "Solid", labelEs: "Sólido" },
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
    "The component renders nav with a configurable accessible label, followed by ol and one li per visible level. Every intermediate level is a real anchor; the last level is plain text with aria-current=\"page\", so the current location cannot be activated accidentally. Separators are aria-hidden and never become part of a link name. maxItems preserves the first and trailing levels and replaces the hidden middle with a non-interactive ellipsis whose accessible label reports the number of hidden levels; consumers needing direct access to hidden destinations should replace that disclosure pattern with a real menu. Links use native Tab and Enter behavior, persistent underlines, hover feedback and an explicit focus-visible ring. Preview focus is represented through the same outline recipe, not duplicated CSS. Only background-color and color transition because those are the only hover properties that change; prefers-reduced-motion removes the transition. Current location uses weight and a bottom border, not color alone. Forced-colors maps the surface, link and current indicator to Canvas, LinkText and Highlight. Link contrast is at least 5.74:1 on every owned material surface; separators are decorative but still use a visible high-contrast token.",
  a11yEs:
    "El componente renderiza nav con etiqueta accesible configurable, seguido de ol y un li por nivel visible. Cada nivel intermedio es un enlace real; el último es texto plano con aria-current=\"page\", por lo que la ubicación actual no se activa por accidente. Los separadores usan aria-hidden y nunca forman parte del nombre del enlace. maxItems conserva el primer nivel y los niveles finales y sustituye el centro oculto por una elipsis no interactiva cuya etiqueta accesible comunica cuántos niveles se ocultaron; quien necesite acceso directo a esos destinos debe sustituir este patrón informativo por un menú real. Los enlaces conservan Tab y Enter nativos, subrayado persistente, feedback hover y anillo focus-visible explícito. El foco del preview usa la misma receta de outline, sin CSS duplicado. Solo transicionan background-color y color porque son las únicas propiedades que cambian en hover; prefers-reduced-motion elimina la transición. La ubicación actual usa peso y borde inferior, no solo color. Forced-colors asigna superficie, enlace e indicador actual a Canvas, LinkText y Highlight. El contraste del enlace es al menos 5,74:1 en cada superficie propia; los separadores son decorativos pero mantienen un token claramente visible.",
  sourcePath: "src/registry/ui/breadcrumb.tsx",
  Preview: BreadcrumbPreview,
};
