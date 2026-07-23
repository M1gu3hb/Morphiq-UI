import { DrawerNavPreview } from "@/registry/previews/drawer-nav-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the drawer-nav component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "drawer-nav",
  name: "Drawer Nav",
  nameEs: "Cajón de navegación",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A trigger button opens a bounded side panel that slides in from the left or right over a dimming backdrop, holding real navigation links. It shares the modal mechanics of the full-screen overlay — focus trap, Escape, focus return, body-scroll lock, backdrop click — around a smaller panel pinned to one edge. The active link is marked by aria-current, a heavier weight and a reserved rule, with four material recipes and three sizes.",
  descriptionEs:
    "Un botón activador abre un panel lateral acotado que se desliza desde la izquierda o la derecha sobre un fondo atenuado, con enlaces de navegación reales. Comparte la mecánica modal del panel a pantalla completa —trampa de foco, Escape, retorno de foco, bloqueo del desplazamiento del cuerpo, clic en el fondo— en torno a un panel más pequeño fijado a un borde. El enlace activo se marca con aria-current, un peso más fuerte y una regla reservada, con cuatro recetas de material y tres tamaños.",
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
    "The trigger is a real button carrying aria-haspopup=\"dialog\", aria-expanded reflecting the open state, and aria-controls that points at the panel only while it is mounted. Opening it mounts a role=\"dialog\" aria-modal=\"true\" surface named by its visible heading through aria-labelledby. Focus moves into the panel on open and is trapped: Tab and Shift+Tab cycle across the panel's controls and wrap at the ends, and no Tab escapes to the page behind. Escape closes the drawer, stops propagation so it never also dismisses an enclosing Escape-closable ancestor, and returns focus to the trigger; clicking the backdrop or any link closes it too, and body scroll is locked while it is open and restored on close. Every item is a real anchor when given an href and a real button otherwise, so it is keyboard-reachable in source order and operable with Enter (and Space for the button form) without synthetic key handling; the browser handles middle-click and open-in-new-tab for the anchors. The active item carries aria-current=\"page\", a heavier weight and a reserved left rule, so its state is never signalled by colour alone; any leading icon is aria-hidden so the label is the sole accessible name. Every drawer item clears a 44px minimum touch target for mobile navigation. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed; the docs preview can force the same ring through a data-focus attribute. Motion is suppressed under prefers-reduced-motion: the backdrop and panel appear without the fade or slide, but the drawer still opens fully at its edge and every link is present. In forced-colors mode fills, gradients, shadows and the backdrop dim are discarded, so the panel keeps its bounds with a CanvasText border over a solid Canvas surface, the active item is marked with a system colour on a left rule that is always reserved in the box model, glyphs are pinned to CanvasText, and the focus ring switches to the Highlight system colour. Contrast: on every material the link label measures at or above 4.5:1 against the panel and the active label at or above 4.5:1 against its wash; the adaptive recipe also ships a dark-scheme palette that holds the same ratios. A disabled trigger fades to 55%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "El activador es un botón real que lleva aria-haspopup=\"dialog\", aria-expanded que refleja el estado abierto y aria-controls que apunta al panel solo mientras está montado. Al abrirlo se monta una superficie role=\"dialog\" aria-modal=\"true\" nombrada por su encabezado visible mediante aria-labelledby. El foco entra en el panel al abrir y queda atrapado: Tab y Shift+Tab recorren los controles del panel y dan la vuelta en los extremos, y ningún Tab escapa a la página de detrás. Escape cierra el cajón, detiene la propagación para no descartar también un ancestro cerrable con Escape, y devuelve el foco al activador; hacer clic en el fondo o en cualquier enlace también lo cierra, y el desplazamiento del cuerpo se bloquea mientras está abierto y se restaura al cerrar. Cada elemento es un ancla real cuando recibe un href y un botón real en caso contrario, así que se alcanza por teclado en el orden del código y se opera con Enter (y Espacio en la forma de botón) sin manejo sintético de teclas; el navegador gestiona el clic central y abrir en pestaña nueva para las anclas. El elemento activo lleva aria-current=\"page\", un peso más fuerte y una regla izquierda reservada, así que su estado nunca se señala solo con el color; cualquier icono inicial es aria-hidden para que la etiqueta sea el único nombre accesible. Cada elemento del cajón alcanza un objetivo táctil mínimo de 44px para navegación móvil. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina; la vista previa de la documentación puede forzar el mismo anillo con un atributo data-focus. El movimiento se suprime bajo prefers-reduced-motion: el fondo y el panel aparecen sin el desvanecido ni el deslizamiento, pero el cajón se abre por completo en su borde y todos los enlaces están presentes. En forced-colors se descartan rellenos, degradados, sombras y la atenuación del fondo, así que el panel conserva sus límites con un borde CanvasText sobre una superficie Canvas sólida, el elemento activo se marca con un color de sistema en una regla izquierda siempre reservada en el modelo de caja, los glifos se fijan a CanvasText y el anillo de foco cambia al color de sistema Highlight. Contraste: en cada material la etiqueta del enlace mide 4,5:1 o más contra el panel y la etiqueta activa 4,5:1 o más contra su lavado; la receta adaptativa además incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Un activador deshabilitado baja al 55%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/drawer-nav.tsx",
  Preview: DrawerNavPreview,
};
