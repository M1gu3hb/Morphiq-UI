import { HamburgerMenuOverlayPreview } from "@/registry/previews/hamburger-menu-overlay-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the hamburger menu overlay.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "hamburger-menu-overlay",
  name: "Hamburger Menu Overlay",
  nameEs: "Menú hamburguesa a pantalla completa",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A hamburger button whose three lines fold into an X and open a full-screen overlay of navigation links. Four material recipes, three sizes. The overlay is a modal dialog with a focus trap, Escape-to-close that returns focus to the trigger, backdrop and link dismissal, and a body-scroll lock — no runtime dependency beyond React.",
  descriptionEs:
    "Un botón hamburguesa cuyas tres líneas se pliegan en una X y abren una superposición a pantalla completa de enlaces de navegación. Cuatro recetas de material y tres tamaños. La superposición es un diálogo modal con trampa de foco, cierre con Escape que devuelve el foco al disparador, descarte por fondo o enlace y bloqueo del desplazamiento del cuerpo — sin dependencias de tiempo de ejecución más allá de React.",
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
    "The trigger is a real <button> carrying aria-label, aria-expanded and aria-controls pointing at the overlay by an id from React.useId(), so assistive tech announces the collapsed/expanded state and the relationship. The three lines are aria-hidden decoration; the fold into an X is conveyed by aria-expanded, not by the shape. The overlay is role=\"dialog\" with aria-modal=\"true\" and its own aria-label. Focus moves into the dialog on open and is trapped: Tab cycles within it and Shift+Tab wraps the other way. Escape closes the overlay and returns focus to the trigger; clicking the backdrop or any link closes it too. Body scroll is locked while open and restored on close. Every menu item is a real <a href> or <button>, so Enter, Space and the browser's own navigation work unaided, and the current page carries aria-current=\"page\". The active state is never signalled by colour alone — it pairs the accent colour with a heavier weight and a reserved left rule that lives in the box model. Focus shows a 2px offset outline on :focus-visible and is never removed. Motion is suppressed under prefers-reduced-motion: the X still forms and the overlay still opens with every link present, only the travel and the staggered reveal are dropped. In forced-colors mode the lines are painted in CanvasText, the backdrop falls back to a solid Canvas with its gradient cleared, link text uses CanvasText, the active marker becomes a CanvasText left rule, and focus rings switch to Highlight — so nothing depends on a fill or shadow that mode discards. Link labels meet 4.5:1 against the overlay surface on every material.",
  a11yEs:
    "El disparador es un <button> real con aria-label, aria-expanded y aria-controls que apunta a la superposición mediante un id de React.useId(), de modo que la tecnología de asistencia anuncia el estado contraído/expandido y la relación. Las tres líneas son decoración con aria-hidden; el plegado en X lo transmite aria-expanded, no la forma. La superposición es role=\"dialog\" con aria-modal=\"true\" y su propio aria-label. El foco entra en el diálogo al abrir y queda atrapado: Tab circula dentro y Shift+Tab envuelve en sentido contrario. Escape cierra la superposición y devuelve el foco al disparador; hacer clic en el fondo o en cualquier enlace también la cierra. El desplazamiento del cuerpo se bloquea mientras está abierta y se restaura al cerrar. Cada elemento del menú es un <a href> o un <button> real, así que Enter, Espacio y la navegación propia del navegador funcionan sin ayuda, y la página actual lleva aria-current=\"page\". El estado activo nunca se indica solo con color: combina el color de acento con un peso más grueso y una regla izquierda reservada que vive en el modelo de caja. El foco muestra un contorno de 2px con desplazamiento en :focus-visible y nunca se elimina. El movimiento se suprime bajo prefers-reduced-motion: la X se forma igual y la superposición se abre con todos los enlaces presentes, solo se descartan el recorrido y la aparición escalonada. En forced-colors las líneas se pintan en CanvasText, el fondo recurre a un Canvas sólido con su degradado eliminado, el texto de los enlaces usa CanvasText, el marcador activo se convierte en una regla izquierda CanvasText y los anillos de foco pasan a Highlight — así nada depende de un relleno o sombra que ese modo descarta. Las etiquetas de los enlaces cumplen 4,5:1 sobre la superficie de la superposición en cada material.",
  sourcePath: "src/registry/ui/hamburger-menu-overlay.tsx",
  Preview: HamburgerMenuOverlayPreview,
};
