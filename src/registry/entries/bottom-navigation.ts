import { BottomNavigationPreview } from "@/registry/previews/bottom-navigation-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the bottom-navigation component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "bottom-navigation",
  name: "Bottom Navigation",
  nameEs: "Navegación inferior",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "An app-style bottom bar of 3–5 destinations, each a stacked icon over a short label, with a soft pill that slides to the active item. The pill is measured from the live geometry of the active item's icon slot, so it tracks reflow and late webfonts. Built to sit fixed at the bottom of a mobile viewport but renders in-flow by default. Uncontrolled by default, controllable by value, with four material recipes and three sizes.",
  descriptionEs:
    "Una barra inferior tipo app con 3–5 destinos, cada uno con un icono sobre una etiqueta corta, y una píldora suave que se desliza hasta el elemento activo. La píldora se mide a partir de la geometría real de la ranura del icono del elemento activo, así que sigue los reflujos y las fuentes web tardías. Pensada para quedar fija en la parte inferior de una vista móvil, pero se renderiza en flujo por defecto. No controlada por defecto, controlable por valor, con cuatro recetas de material y tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The bar is a nav element with an accessible label. Destinations are real anchors when given an href and real buttons otherwise, so they are keyboard-reachable in source order, focusable, and operable with Enter (and Space for the button form) without any synthetic key handling; the browser also handles middle-click and open-in-new-tab on the anchors. Each item stacks a Lucide glyph over a short text label; the glyph is aria-hidden so the label is the sole accessible name. The active item carries aria-current=\"page\", a heavier label weight and its own colour, so its state is never signalled by the sliding pill or by colour alone. Every item is at least 44px tall and 44px wide, a comfortable touch target on mobile. The sliding pill is aria-hidden decoration measured from the active item's icon slot and never enters the accessibility tree, so assistive technology hears exactly one active item. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed. Motion is suppressed under prefers-reduced-motion: the pill appears directly at the active item with no slide, and because it is armed only after its first measurement it never travels in from a corner even on first paint. With JavaScript off or before hydration the slider stays off and the active item paints its own lit icon slot, so the current item is marked at every stage. In forced-colors mode fills, gradients and shadows are discarded, so the active item is marked with a system colour on a border that is always reserved on the icon slot in the box model, the moving pill is pinned to Canvas so the CanvasText glyph keeps its contrast, and the focus ring switches to the Highlight system colour. Contrast: on every material the active label measures at or above 4.5:1 against its lit pill and the inactive label at or above 4.5:1 against the bar; the adaptive recipe also ships a dark-scheme palette that holds the same ratios. Disabled items fade to 45% and drop out of the tab order, which WCAG exempts from contrast as inactive controls.",
  a11yEs:
    "La barra es un elemento nav con una etiqueta accesible. Los destinos son anclas reales cuando reciben un href y botones reales en caso contrario, así que se alcanzan por teclado en el orden del código, son enfocables y se operan con Enter (y Espacio en la forma de botón) sin ningún manejo sintético de teclas; el navegador también gestiona el clic central y abrir en una pestaña nueva en las anclas. Cada elemento apila un glifo de Lucide sobre una etiqueta de texto corta; el glifo es aria-hidden para que la etiqueta sea el único nombre accesible. El elemento activo lleva aria-current=\"page\", un peso de etiqueta más fuerte y su propio color, así que su estado nunca se señala solo con la píldora deslizante ni solo con el color. Cada elemento mide al menos 44px de alto y 44px de ancho, un objetivo táctil cómodo en móvil. La píldora deslizante es decoración aria-hidden medida a partir de la ranura del icono del elemento activo y nunca entra en el árbol de accesibilidad, así que la tecnología de asistencia oye exactamente un elemento activo. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina. El movimiento se suprime bajo prefers-reduced-motion: la píldora aparece directamente en el elemento activo sin deslizarse y, como se arma solo tras su primera medición, nunca llega desde una esquina ni en la primera pintura. Con JavaScript desactivado o antes de la hidratación el deslizador queda apagado y el elemento activo pinta su propia ranura de icono iluminada, así que el elemento actual queda marcado en cada etapa. En forced-colors se descartan rellenos, degradados y sombras, así que el elemento activo se marca con un color de sistema sobre un borde siempre reservado en la ranura del icono dentro del modelo de caja, la píldora móvil se fija a Canvas para que el glifo CanvasText mantenga su contraste, y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material la etiqueta activa mide 4,5:1 o más contra su píldora iluminada y la etiqueta inactiva 4,5:1 o más contra la barra; la receta adaptativa además incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los elementos deshabilitados bajan al 45% y salen del orden de tabulación, lo que WCAG exime de contraste por ser controles inactivos.",
  sourcePath: "src/registry/ui/bottom-navigation.tsx",
  Preview: BottomNavigationPreview,
};
