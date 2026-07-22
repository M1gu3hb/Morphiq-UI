import { TubelightNavbarPreview } from "@/registry/previews/tubelight-navbar-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the tubelight-navbar component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "tubelight-navbar",
  name: "Tubelight Navbar",
  nameEs: "Barra de navegación tubelight",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A horizontal navigation where a glowing tube of light slides to the active item. The bar is a shallow trough; the indicator is a soft lit wash topped by a short bright lamp bar whose glow blooms downward, measured from the live geometry of the active item so it tracks reflow and late webfonts. Uncontrolled by default, controllable by value, with four material recipes and three sizes.",
  descriptionEs:
    "Una navegación horizontal donde un tubo de luz brillante se desliza hasta el elemento activo. La barra es una cubeta poco profunda; el indicador es un lavado tenue iluminado coronado por una corta barra-lámpara brillante cuyo resplandor cae hacia abajo, medido a partir de la geometría real del elemento activo para seguir los reflujos y las fuentes web tardías. No controlada por defecto, controlable por valor, con cuatro recetas de material y tres tamaños.",
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
    "The bar is a nav element with an accessible label. Items are real anchors when given an href and real buttons otherwise, so they are keyboard-reachable in source order, focusable, and operable with Enter (and Space for the button form) without any synthetic key handling. The active item carries aria-current=\"page\" and a heavier weight, so its state is never signalled by the sliding glow alone; any leading icon is aria-hidden so the label is the sole accessible name. The indicator and its lamp bar are aria-hidden decoration and never enter the accessibility tree, so assistive technology hears exactly one active item. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed. Motion is suppressed under prefers-reduced-motion: the tube appears directly at the active item with no slide, and because it is armed only after its first measurement it never travels in from a corner even on first paint. With JavaScript off or before hydration the slider stays off and the active item paints its own lit wash, so the current item is marked at every stage. In forced-colors mode fills, gradients and shadows are discarded, so the active item is marked with a system colour on a top border that is always reserved in the box model, the lamp bar is repainted with the Highlight system colour while the wash is pinned to Canvas so the CanvasText label keeps its contrast, and the focus ring switches to the Highlight system colour. Contrast: on every material the active label measures at or above 4.5:1 against its lit wash and the inactive label at or above 4.5:1 against the bar; the adaptive recipe also ships a dark-scheme palette that holds the same ratios. Disabled items fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "La barra es un elemento nav con una etiqueta accesible. Los elementos son anclas reales cuando reciben un href y botones reales en caso contrario, así que se alcanzan por teclado en el orden del código, son enfocables y se operan con Enter (y Espacio en la forma de botón) sin ningún manejo sintético de teclas. El elemento activo lleva aria-current=\"page\" y un peso más fuerte, así que su estado nunca se señala solo con el resplandor deslizante; cualquier icono inicial es aria-hidden para que la etiqueta sea el único nombre accesible. El indicador y su barra-lámpara son decoración aria-hidden y nunca entran en el árbol de accesibilidad, así que la tecnología de asistencia oye exactamente un elemento activo. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina. El movimiento se suprime bajo prefers-reduced-motion: el tubo aparece directamente en el elemento activo sin deslizarse y, como se arma solo tras su primera medición, nunca llega desde una esquina ni en la primera pintura. Con JavaScript desactivado o antes de la hidratación el deslizador queda apagado y el elemento activo pinta su propio lavado iluminado, así que el elemento actual queda marcado en cada etapa. En forced-colors se descartan rellenos, degradados y sombras, así que el elemento activo se marca con un color de sistema sobre un borde superior siempre reservado en el modelo de caja, la barra-lámpara se repinta con el color de sistema Highlight mientras el lavado se fija a Canvas para que la etiqueta CanvasText mantenga su contraste, y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material la etiqueta activa mide 4,5:1 o más contra su lavado iluminado y la etiqueta inactiva 4,5:1 o más contra la barra; la receta adaptativa además incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los elementos deshabilitados bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/tubelight-navbar.tsx",
  Preview: TubelightNavbarPreview,
};
