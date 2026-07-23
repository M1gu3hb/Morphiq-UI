import { ScrollspyNavPreview } from "@/registry/previews/scrollspy-nav-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the scrollspy-nav component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "scrollspy-nav",
  name: "Scrollspy Nav",
  nameEs: "Navegación scrollspy",
  category: "navigation",
  materials: ["adaptive"],
  description:
    "An in-page anchor navigation whose current item lights up as the matching section scrolls into view, driven by an IntersectionObserver. A slim rail runs down the left edge and a lit thumb slides to the active row, measured from its live geometry so it tracks reflow and late webfonts. The current section is marked by that moving indicator, a heavier weight and aria-current — never by colour alone. Material-agnostic: one restrained adaptive recipe that follows the colour scheme, in three sizes.",
  descriptionEs:
    "Una navegación de anclas en la página cuyo elemento actual se ilumina cuando la sección correspondiente entra en vista, gobernada por un IntersectionObserver. Un riel delgado recorre el borde izquierdo y un pulgar iluminado se desliza hasta la fila activa, medido a partir de su geometría real para seguir los reflujos y las fuentes web tardías. La sección actual se marca con ese indicador en movimiento, un peso más fuerte y aria-current, nunca solo con color. Agnóstica de material: una única receta adaptativa sobria que sigue el esquema de color, en tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "The component is a nav landmark with an accessible label. Each item is a real anchor to an in-page section (href=\"#id\"), so it is reachable by Tab in source order, focusable, and activated with Enter by the browser without any synthetic key handling; middle-click and open-in-new-tab keep working. The section currently in view is tracked by an IntersectionObserver created only on the client and disconnected on cleanup, and its state is updated from the observer callback rather than during render, so there is no synchronous set-state in an effect body. The matching item is given aria-current=\"true\" together with a heavier weight and a sliding rail thumb, so the current section is never signalled by colour alone; missing target elements are skipped so a partial map never throws. The rail track and its thumb are aria-hidden decoration and never enter the accessibility tree, so assistive technology hears exactly one current item. Clicking an item scrolls its section into view; the smooth-scroll behaviour is only requested when the user has not asked for reduced motion, which is checked with matchMedia at click time, so prefers-reduced-motion callers jump instantly. The thumb animates only after it has measured the active row, so it never slides in from the top on first paint, and under prefers-reduced-motion its travel is dropped while it still appears at the active row. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed. In forced-colors mode the decorative rail and thumb are hidden and the active item is instead marked by a system-colour rule on a left border that is always reserved in the box model, while the focus ring switches to the Highlight system colour. Contrast: the active label measures at or above 4.5:1 and the inactive label at or above 4.5:1 against the page, and the adaptive recipe ships a dark-scheme palette that holds the same ratios. With JavaScript off or before hydration the anchors still jump to their sections natively and the initial item stays marked by weight and aria-current.",
  a11yEs:
    "El componente es un landmark nav con una etiqueta accesible. Cada elemento es un ancla real a una sección de la página (href=\"#id\"), así que se alcanza con Tab en el orden del código, es enfocable y se activa con Enter por el navegador sin ningún manejo sintético de teclas; el clic central y abrir en una pestaña nueva siguen funcionando. La sección visible se rastrea con un IntersectionObserver creado solo en el cliente y desconectado en la limpieza, y su estado se actualiza desde el callback del observador y no durante el render, así que no hay set-state síncrono en el cuerpo de un efecto. El elemento correspondiente recibe aria-current=\"true\" junto con un peso más fuerte y un pulgar de riel deslizante, así que la sección actual nunca se señala solo con color; los elementos objetivo ausentes se omiten para que un mapa parcial no falle. El riel y su pulgar son decoración aria-hidden y nunca entran en el árbol de accesibilidad, así que la tecnología de asistencia oye exactamente un elemento actual. Al pulsar un elemento su sección entra en vista; el desplazamiento suave solo se solicita cuando el usuario no ha pedido movimiento reducido, lo que se comprueba con matchMedia en el momento del clic, así que quienes prefieren movimiento reducido saltan al instante. El pulgar se anima solo después de medir la fila activa, así que nunca llega desde arriba en la primera pintura, y bajo prefers-reduced-motion se descarta su recorrido mientras sigue apareciendo en la fila activa. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina. En forced-colors se ocultan el riel y el pulgar decorativos y el elemento activo se marca con un color de sistema sobre un borde izquierdo siempre reservado en el modelo de caja, mientras el anillo de foco cambia al color de sistema Highlight. Contraste: la etiqueta activa mide 4,5:1 o más y la etiqueta inactiva 4,5:1 o más contra la página, y la receta adaptativa incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Con JavaScript desactivado o antes de la hidratación las anclas siguen saltando a sus secciones de forma nativa y el elemento inicial queda marcado por peso y aria-current.",
  sourcePath: "src/registry/ui/scrollspy-nav.tsx",
  Preview: ScrollspyNavPreview,
};
