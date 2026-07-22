import { StaggeredMenuPreview } from "@/registry/previews/staggered-menu-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the staggered-menu component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "staggered-menu",
  name: "Staggered Menu",
  nameEs: "Menú escalonado",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A trigger button that opens a modal overlay whose items enter in a staggered cascade. Four material recipes and three sizes, with a real focus trap, Escape-to-close, and a cascade that collapses to an instant reveal under reduced motion.",
  descriptionEs:
    "Un botón que abre una superposición modal cuyos elementos entran en cascada escalonada. Cuatro recetas de material y tres tamaños, con una trampa de foco real, cierre con Escape, y una cascada que se reduce a una aparición instantánea con movimiento reducido.",
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
    'The trigger is a real <button> carrying aria-haspopup, aria-expanded, and aria-controls pointing at the overlay id (from React.useId(), so it is stable across SSR). The overlay is a modal dialog: role=\"dialog\", aria-modal=\"true\", and aria-labelledby a visible title. Opening it moves focus to the first menu item; a keydown handler on the dialog cycles focus with Tab and Shift+Tab so focus never leaves the panel; Escape closes the dialog and returns focus to the trigger, as does a click on the dim backdrop. Body scroll is locked while the dialog is open and restored on close. Menu rows are real <a href> links or <button>s; the row for the current page carries aria-current=\"page\" and pairs it with a heavier weight and a reserved left rule, so the active state is never signalled by colour alone. Disabled rows are inert, non-focusable, and skipped by the focus trap. Focus shows a 2px offset ring on :focus-visible and is never removed. The staggered entrance is decoration: under prefers-reduced-motion the per-item cascade, the panel rise, and the backdrop fade are all cancelled with motion-reduce and every element resolves to its visible resting state, because each item\'s base styles are the end state and the keyframe uses backwards fill. In forced-colors mode fills, gradients, and shadows are discarded by the OS, so the trigger falls back to a ButtonText-bordered button, the panel to a Canvas surface with a CanvasText border, the active row to a CanvasText left rule, and every focus ring to Highlight — the panel and its state never depend on a background the mode throws away. Contrast: labels and titles resolve to the material\'s ink over its own surface and measure at or above 4.5:1 on every recipe.',
  a11yEs:
    'El disparador es un <button> real con aria-haspopup, aria-expanded y aria-controls apuntando al id de la superposición (de React.useId(), estable en SSR). La superposición es un diálogo modal: role=\"dialog\", aria-modal=\"true\" y aria-labelledby a un título visible. Al abrirla el foco pasa al primer elemento del menú; un manejador de teclado en el diálogo cicla el foco con Tab y Shift+Tab para que nunca salga del panel; Escape cierra el diálogo y devuelve el foco al disparador, igual que un clic en el fondo atenuado. El desplazamiento del cuerpo se bloquea mientras el diálogo está abierto y se restaura al cerrar. Las filas son enlaces <a href> o <button> reales; la fila de la página actual lleva aria-current=\"page\" acompañado de mayor peso y una regla izquierda reservada, así que el estado activo nunca se indica solo con color. Las filas deshabilitadas son inertes, no enfocables y las omite la trampa de foco. El foco muestra un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina. La entrada escalonada es decorativa: bajo prefers-reduced-motion se cancelan con motion-reduce la cascada por elemento, la subida del panel y el desvanecido del fondo, y cada elemento se resuelve a su estado de reposo visible, porque las bases de cada elemento son el estado final y el keyframe usa relleno backwards. En forced-colors el sistema descarta rellenos, degradados y sombras, así que el disparador queda como un botón con borde ButtonText, el panel como una superficie Canvas con borde CanvasText, la fila activa con una regla izquierda CanvasText, y cada anillo de foco como Highlight — el panel y su estado nunca dependen de un fondo que ese modo descarta. Contraste: etiquetas y títulos se resuelven a la tinta del material sobre su propia superficie y miden 4,5:1 o más en cada receta.',
  sourcePath: "src/registry/ui/staggered-menu.tsx",
  Preview: StaggeredMenuPreview,
};
