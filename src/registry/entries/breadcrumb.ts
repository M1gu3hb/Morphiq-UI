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
    "The component renders nav with a configurable accessible label, followed by ol and one li per visible level. Every intermediate level is a real anchor; the last level is plain text with aria-current=\"page\", so the current location cannot be activated accidentally. Separators are aria-hidden and never become part of a link name. maxItems preserves the first and trailing levels and replaces the hidden middle with a non-interactive ellipsis whose accessible label reports the number of hidden levels; consumers needing direct access to hidden destinations should replace that disclosure pattern with a real menu. Links use native Tab and Enter behavior, persistent underlines and an explicit focus-visible ring. On hover or keyboard focus, a decorative ::before pill expands behind the link by animating only scale, opacity and box-shadow; the anchor itself animates only color. prefers-reduced-motion removes both transitions but leaves the final pill and focus outline visible immediately. The current location is a non-interactive material chip distinguished by shape, fill, depth and heavier weight, not color alone. Forced-colors clears shell, pill and chip gradients, backdrop filters and shadows, then maps surfaces, links and the current indicator to Canvas, LinkText and Highlight. Conservative contrast minima for link / interactive pill / current chip are: clay 7.81:1, glass 4.80:1, skeuo 8.34:1, adaptive light 11.24:1 and adaptive dark 9.13:1. Separators are decorative but still use a visible high-contrast token.",
  a11yEs:
    "El componente renderiza nav con etiqueta accesible configurable, seguido de ol y un li por nivel visible. Cada nivel intermedio es un enlace real; el último es texto plano con aria-current=\"page\", por lo que la ubicación actual no se activa por accidente. Los separadores usan aria-hidden y nunca forman parte del nombre del enlace. maxItems conserva el primer nivel y los niveles finales y sustituye el centro oculto por una elipsis no interactiva cuya etiqueta accesible comunica cuántos niveles se ocultaron; quien necesite acceso directo a esos destinos debe sustituir este patrón informativo por un menú real. Los enlaces conservan Tab y Enter nativos, subrayado persistente y anillo focus-visible explícito. En hover o foco de teclado, una píldora decorativa ::before se expande detrás del enlace animando solo scale, opacity y box-shadow; el ancla anima únicamente color. prefers-reduced-motion elimina ambas transiciones pero deja visibles de inmediato la píldora final y el contorno de foco. La ubicación actual es un chip material no interactivo que se distingue por forma, relleno, profundidad y mayor peso, no solo por color. Forced-colors elimina gradientes, backdrop filters y sombras del contenedor, píldora y chip, y asigna superficies, enlaces e indicador actual a Canvas, LinkText y Highlight. Los mínimos conservadores de contraste para enlace / píldora interactiva / chip actual son: clay 7,81:1, glass 4,80:1, skeuo 8,34:1, adaptive claro 11,24:1 y adaptive oscuro 9,13:1. Los separadores son decorativos pero mantienen un token claramente visible.",
  sourcePath: "src/registry/ui/breadcrumb.tsx",
  Preview: BreadcrumbPreview,
};
