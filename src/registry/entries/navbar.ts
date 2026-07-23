import { NavbarPreview } from "@/registry/previews/navbar-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the navbar component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "navbar",
  name: "Navbar",
  nameEs: "Barra de navegación",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A responsive top navigation bar with a brand slot, a horizontal row of links, an optional call-to-action, and a hamburger toggle that discloses the links in a stacked panel below the bar. The layout responds to the width of its own container, not the viewport, so it folds to the mobile arrangement inside any narrow column. Active links carry aria-current plus a reserved rule, the CTA inlines Button's primary press physics, and four material recipes ship across three sizes.",
  descriptionEs:
    "Una barra de navegación superior responsiva con un espacio para la marca, una fila horizontal de enlaces, una llamada a la acción opcional y un botón de hamburguesa que despliega los enlaces en un panel apilado bajo la barra. La disposición responde al ancho de su propio contenedor, no al del viewport, así que se pliega a la variante móvil dentro de cualquier columna estrecha. Los enlaces activos llevan aria-current más una regla reservada, la CTA reutiliza la física de pulsación primaria del botón, y se incluyen cuatro recetas de material en tres tamaños.",
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
    "The bar is a nav landmark with an accessible label. Navigation items are real anchors when given an href and real buttons otherwise, so they are keyboard-reachable in source order, focusable, and operable with Enter (and Space for the button form) with no synthetic key handling; any leading icon is aria-hidden so the label is the sole accessible name. The active item carries aria-current=\"page\" together with a heavier weight and a reserved rule (a transparent border that colours only when active and is always kept in the box model), so its state is never signalled by colour alone. Below the bar's container breakpoint the horizontal links give way to a hamburger toggle: a real button exposing aria-expanded and, only while the panel is mounted, aria-controls pointing at it. The disclosed panel is a non-modal region, so focus is deliberately not trapped — Escape closes it and returns focus to the toggle, a pointer press outside closes it, choosing a link or the CTA closes it, and Tab continues through the page. Panel links are at least 44px tall for a comfortable touch target and mirror the active marking with a reserved left rule. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed; the docs preview can force that ring onto the active link via a parallel data hook. Motion is suppressed under prefers-reduced-motion: the panel and its rows appear fully open with no travel and the toggle glyphs swap without turning, because every entrance keyframe rests at the visible end state. In forced-colors mode fills, gradients, blur and shadows are discarded, so the bar and panel keep a system-colour border, the active item is marked on its reserved rule with CanvasText, the toggle glyph and icons repaint with CanvasText, and the focus ring switches to the Highlight system colour. Contrast: on every material the idle label measures at or above 4.5:1 against the bar, the active label at or above 4.5:1 against its wash, and the CTA label at or above 4.5:1 against its surface; the adaptive recipe also ships a dark-scheme palette that holds the same ratios. Disabled items and CTA fade, which WCAG exempts from contrast as inactive controls.",
  a11yEs:
    "La barra es una región de navegación con una etiqueta accesible. Los elementos son anclas reales cuando reciben un href y botones reales en caso contrario, así que se alcanzan por teclado en el orden del código, son enfocables y se operan con Enter (y Espacio en la forma de botón) sin manejo sintético de teclas; cualquier icono inicial es aria-hidden para que la etiqueta sea el único nombre accesible. El elemento activo lleva aria-current=\"page\" junto con un peso más fuerte y una regla reservada (un borde transparente que solo se colorea cuando está activo y se mantiene siempre en el modelo de caja), así que su estado nunca se señala solo con el color. Por debajo del punto de quiebre del contenedor de la barra, los enlaces horizontales ceden a un botón de hamburguesa: un botón real que expone aria-expanded y, solo mientras el panel está montado, aria-controls apuntando a él. El panel desplegado es una región no modal, así que el foco deliberadamente no queda atrapado: Escape lo cierra y devuelve el foco al botón, una pulsación fuera lo cierra, elegir un enlace o la CTA lo cierra, y Tab continúa por la página. Los enlaces del panel miden al menos 44px de alto para un objetivo táctil cómodo y reflejan la marca activa con una regla reservada a la izquierda. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina; la vista previa de la documentación puede forzar ese anillo sobre el enlace activo mediante un gancho de datos paralelo. El movimiento se suprime bajo prefers-reduced-motion: el panel y sus filas aparecen totalmente abiertos sin recorrido y los glifos del botón se intercambian sin girar, porque cada keyframe de entrada descansa en el estado final visible. En forced-colors se descartan rellenos, degradados, desenfoque y sombras, así que la barra y el panel conservan un borde de color de sistema, el elemento activo se marca en su regla reservada con CanvasText, el glifo del botón y los iconos se repintan con CanvasText, y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material la etiqueta inactiva mide 4,5:1 o más contra la barra, la etiqueta activa 4,5:1 o más contra su lavado, y la etiqueta de la CTA 4,5:1 o más contra su superficie; la receta adaptativa además incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los elementos y la CTA deshabilitados se atenúan, algo que WCAG exime de contraste por ser controles inactivos.",
  sourcePath: "src/registry/ui/navbar.tsx",
  Preview: NavbarPreview,
};
