import { SidebarPreview } from "@/registry/previews/sidebar-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the sidebar component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "sidebar",
  name: "Sidebar",
  nameEs: "Barra lateral",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A vertical side navigation whose links are grouped under labelled sections, each section a real disclosure that eases open on a grid-rows animation. The whole rail collapses to an icon strip through an optional labelled toggle. Links are real anchors, the active one carries aria-current and a reserved rule, and everything ships in four material recipes across three sizes.",
  descriptionEs:
    "Una navegación lateral vertical cuyos enlaces se agrupan en secciones etiquetadas, cada sección una divulgación real que se abre con una animación de grid-rows. Todo el raíl se colapsa a una tira de iconos mediante un botón etiquetado opcional. Los enlaces son anclas reales, el activo lleva aria-current y una regla reservada, y todo se entrega en cuatro recetas de material en tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The whole component is a nav landmark with an accessible label. Each section header is a real button carrying aria-expanded and aria-controls that points at its region, and Enter and Space toggle it natively with no synthetic key handling. The region is animated with grid-template-rows so it eases to its content's height, and while closed it stays mounted but inert — removed from the accessibility tree and the tab order, so a keyboard user can never land inside a collapsed section. Every link with an href is a real anchor, so the browser owns keyboard activation, middle-click and open-in-new-tab; a link without one is a real button, and any leading icon is aria-hidden so the label stays the sole accessible name. The active link takes aria-current=\"page\" together with a heavier weight and a reserved left rule, so its state is never signalled by colour alone. Beyond Tab, Up and Down arrows (with Home and End) move focus between the toggle, the section headers and the reachable links as one vertical composite, skipping disabled items and anything inside a closed section. The optional rail toggle is a labelled button whose aria-expanded reflects whether the sidebar is open and whose aria-controls references the always-mounted body; collapsing to the rail hides label text visually but keeps every accessible name, and a glyph — the provided icon or a monogram fallback — keeps each row visible. Focus shows a 2px ring on :focus-visible using the material's ring token and is never removed; a parallel data-focus hook lets the docs force the focused look. Under prefers-reduced-motion the width change, the section open/close and the chevron rotation all drop their travel while keeping their end state, so the sidebar still opens, sections still expand and the chevron still points the right way. In forced-colors mode fills, gradients, shadows and backdrop blur are discarded, so the panel keeps a CanvasText border, the active link is marked by a system colour on the reserved rule held permanently in the box model, glyphs and labels render in CanvasText, and the focus ring switches to the Highlight system colour. Contrast: on every material the idle and active labels and the section eyebrows measure at or above 4.5:1 against their surface, and the adaptive recipe ships a dark-scheme palette that holds the same ratios. Disabled links fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "Todo el componente es un punto de referencia nav con una etiqueta accesible. Cada encabezado de sección es un botón real con aria-expanded y aria-controls que apunta a su región, y Enter y Espacio lo alternan de forma nativa sin manejo sintético de teclas. La región se anima con grid-template-rows para ajustarse a la altura de su contenido, y mientras está cerrada permanece montada pero inerte —fuera del árbol de accesibilidad y del orden de tabulación— para que un usuario de teclado nunca caiga dentro de una sección colapsada. Cada enlace con href es un ancla real, así que el navegador gestiona la activación por teclado, el clic central y abrir en nueva pestaña; un enlace sin href es un botón real, y cualquier icono inicial es aria-hidden para que la etiqueta sea el único nombre accesible. El enlace activo lleva aria-current=\"page\" junto con un peso más fuerte y una regla izquierda reservada, así que su estado nunca se señala solo con el color. Además de Tab, las flechas Arriba y Abajo (con Inicio y Fin) mueven el foco entre el botón de colapso, los encabezados de sección y los enlaces alcanzables como un único compuesto vertical, saltando los elementos deshabilitados y todo lo que esté dentro de una sección cerrada. El botón de raíl opcional es un botón etiquetado cuyo aria-expanded refleja si la barra está abierta y cuyo aria-controls referencia el cuerpo siempre montado; al colapsar al raíl se oculta visualmente el texto de las etiquetas pero se conserva cada nombre accesible, y un glifo —el icono proporcionado o un monograma de respaldo— mantiene cada fila visible. El foco muestra un anillo de 2px en :focus-visible usando el token de anillo del material y nunca se elimina; un gancho paralelo data-focus permite forzar el aspecto enfocado en la documentación. Bajo prefers-reduced-motion el cambio de ancho, la apertura y cierre de secciones y la rotación del chevron descartan su recorrido conservando su estado final, así que la barra sigue abriéndose, las secciones siguen expandiéndose y el chevron sigue apuntando correctamente. En forced-colors se descartan rellenos, degradados, sombras y desenfoque de fondo, así que el panel mantiene un borde CanvasText, el enlace activo se marca con un color de sistema sobre la regla reservada mantenida siempre en el modelo de caja, los glifos y las etiquetas se pintan en CanvasText, y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material las etiquetas inactivas y activas y los rótulos de sección miden 4,5:1 o más contra su superficie, y la receta adaptativa incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los enlaces deshabilitados bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/sidebar.tsx",
  Preview: SidebarPreview,
};
