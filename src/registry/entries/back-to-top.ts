import { BackToTopPreview } from "@/registry/previews/back-to-top-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the back-to-top component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "back-to-top",
  name: "Back To Top",
  nameEs: "Volver arriba",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A floating disc that stays out of the way until the reader scrolls past a threshold, then rises into the corner with a progress ring traced around its rim that fills as the page is read. Pressing it carries the reader smoothly back to the top, or instantly when reduced motion is requested. It watches the window by default and any scrollable element by ref, stays mounted while hidden so its entrance can transition, and ships four material recipes across three sizes that all clear the 44px touch target.",
  descriptionEs:
    "Un disco flotante que se mantiene apartado hasta que la persona lectora pasa un umbral de desplazamiento; entonces se eleva hacia la esquina con un anillo de progreso trazado en su borde que se llena a medida que se lee la página. Al pulsarlo devuelve suavemente al inicio, o de forma instantánea cuando se pide movimiento reducido. Observa la ventana por defecto y cualquier elemento desplazable mediante una ref, permanece montado mientras está oculto para que su entrada pueda transicionar, e incluye cuatro recetas de material en tres tamaños que superan todos el objetivo táctil de 44px.",
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
    "The control is a real button of type=\"button\" carrying an accessible name — \"Back to top\" by default, replaceable through the label or aria-label props — so it is announced as a command rather than as a destination. It stays mounted while hidden so its entrance can transition, but while hidden it is inert and pointer-transparent: it leaves the tab order and the accessibility tree entirely, so it is never a silent tab stop and is never announced before the reader has scrolled far enough for it to mean anything. Keyboard operation is entirely native — Enter and Space activate it with no synthetic key handling — and because it is a single control there is no roving focus to manage. The progress ring is decoration and nothing else: the SVG is aria-hidden, so assistive technology hears the button's name and no duplicated percentage, and the arrow glyph is aria-hidden for the same reason. Focus shows a 2px ring at a 3px offset on :focus-visible using the material's own ring token, and the UA outline is never removed without that replacement; the docs preview can force the same ring through a parallel data hook. Motion is suppressed under prefers-reduced-motion in both places it exists: the appearance transition on opacity, translate and scale is dropped while the end state is kept, so the disc simply is where it belongs, and the scroll itself falls back from smooth to an instant jump after a guarded matchMedia read taken in the click handler rather than during render. Every size clears the 44px minimum touch target (44, 52 and 60px discs) and each keeps a comfortable inset from the corner. In forced-colors mode the gradient, the shadow stack and the backdrop blur are all discarded, so the disc keeps its bounds through a border that is always reserved in the box model and repaints with CanvasText, the ring track falls back to GrayText while the filled arc repaints with Highlight, the arrow glyph repaints with CanvasText, and the focus ring switches to the Highlight system colour. Contrast: on every material the arrow measures at or above 4.5:1 against the disc it sits on, and the adaptive recipe ships a dark-scheme palette that holds the same ratio. The disabled state fades to 45% only while the disc is shown, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "El control es un botón real de type=\"button\" con un nombre accesible — «Back to top» por defecto, reemplazable mediante las props label o aria-label — así que se anuncia como una orden y no como un destino. Permanece montado mientras está oculto para que su entrada pueda transicionar, pero mientras está oculto es inert y transparente al puntero: sale por completo del orden de tabulación y del árbol de accesibilidad, así que nunca es una parada de tabulación silenciosa ni se anuncia antes de que la persona lectora haya desplazado lo suficiente como para que signifique algo. La operación por teclado es totalmente nativa — Enter y Espacio lo activan sin manejo sintético de teclas — y, al ser un único control, no hay foco itinerante que gestionar. El anillo de progreso es decoración y nada más: el SVG es aria-hidden, así que la tecnología de asistencia oye el nombre del botón y ningún porcentaje duplicado, y el glifo de la flecha es aria-hidden por la misma razón. El foco muestra un anillo de 2px con 3px de desplazamiento en :focus-visible usando el token de anillo del propio material, y el contorno del navegador nunca se elimina sin ese reemplazo; la vista previa de la documentación puede forzar el mismo anillo mediante un gancho de datos paralelo. El movimiento se suprime bajo prefers-reduced-motion en los dos lugares donde existe: se descarta la transición de aparición sobre opacity, translate y scale conservando el estado final, así que el disco simplemente está donde corresponde, y el propio desplazamiento pasa de suave a un salto instantáneo tras una lectura protegida de matchMedia hecha en el manejador de clic y no durante el renderizado. Todos los tamaños superan el objetivo táctil mínimo de 44px (discos de 44, 52 y 60px) y cada uno conserva un margen cómodo respecto a la esquina. En forced-colors se descartan el degradado, la pila de sombras y el desenfoque de fondo, así que el disco conserva sus límites mediante un borde siempre reservado en el modelo de caja que se repinta con CanvasText, la pista del anillo recurre a GrayText mientras el arco relleno se repinta con Highlight, el glifo de la flecha se repinta con CanvasText, y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material la flecha mide 4,5:1 o más contra el disco sobre el que se apoya, y la receta adaptativa incluye una paleta para esquema oscuro que mantiene la misma proporción. El estado deshabilitado baja al 45% solo mientras el disco está visible, algo que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/back-to-top.tsx",
  Preview: BackToTopPreview,
};
