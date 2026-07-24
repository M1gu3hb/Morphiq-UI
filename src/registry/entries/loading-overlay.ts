import { LoadingOverlayPreview } from "@/registry/previews/loading-overlay-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Loading Overlay component. */
export const entry: RegistryEntry = {
  slug: "loading-overlay",
  name: "Loading Overlay",
  nameEs: "Superposición de carga",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A section-scoped scrim that covers its own children while they load, with a hand-rolled spinner, a message panel in all four materials, and an inert, aria-busy content wrapper instead of a global portal.",
  descriptionEs:
    "Una cortina acotada a su sección que cubre a sus propios hijos mientras cargan, con un spinner dibujado a mano, un panel de mensaje en los cuatro materiales y un contenedor de contenido inert y aria-busy en lugar de un portal global.",
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
    'The overlay is a role="status" live region with an explicit aria-live="polite" and aria-atomic="true", and it always contains real text — the visible message (plus an optional muted detail line) or a visually hidden srMessage fallback that defaults to "Loading". Text rather than aria-label is deliberate: a live region is announced by its contents, so a region whose only child is aria-hidden passes a static audit and then announces nothing. Polite rather than assertive, because a wait is not an error and must not interrupt what is being read. While loading, the wrapper around the covered children carries aria-busy="true" and the inert attribute, which removes that subtree from the tab order, the accessibility tree and the pointer path, so a keyboard user can never focus a control hidden behind the scrim; when loading is false both attributes are omitted entirely and the overlay is unmounted, leaving nothing in the accessibility tree. The busy state is never carried by colour alone: it is stated in words by the message or the sr-only fallback, exposed programmatically by aria-busy, and shown by shape — the spinner is a gapped ring rather than a full circle, and the panel physically occupies the region. Under prefers-reduced-motion the veil fade, the panel rise and the rotation are all cancelled with motion-reduce:animate-none, and because every keyframe ends on the resting visual state the scrim, the panel, the message and a still two-tone ring all remain fully rendered, so the busy state survives while the movement stops. In forced-colors mode the backdrop filter and every background image are cleared, the veil repaints to Canvas, the panel border to CanvasText, the spinner track to GrayText and its arc to CanvasText so the two tones stay separable, and all glyphs to CanvasText; a caller who makes the region focusable gets a Highlight outline. Message and detail clear 4.5:1 against their own panel on every material, including both skeuo gradient stops, glass over a white and a black backdrop, and both adaptive colour schemes, and the spinner arc clears 3:1 against its own track. The component holds no state, no timers and no clock reads, so server and client always render the same tree.',
  a11yEs:
    'La superposición es una región viva con role="status", aria-live="polite" explícito y aria-atomic="true", y siempre contiene texto real: el mensaje visible (más una línea de detalle atenuada opcional) o un texto alternativo srMessage oculto visualmente cuyo valor por defecto es "Loading". Usar texto en lugar de aria-label es deliberado: una región viva se anuncia por su contenido, así que una región cuyo único hijo lleva aria-hidden supera una auditoría estática y luego no anuncia nada. Es polite y no assertive porque una espera no es un error y no debe interrumpir lo que se está leyendo. Mientras carga, el contenedor que envuelve al contenido cubierto lleva aria-busy="true" y el atributo inert, que saca ese subárbol del orden de tabulación, del árbol de accesibilidad y de la ruta del puntero, de modo que quien navega por teclado nunca puede enfocar un control oculto tras la cortina; cuando loading es false ambos atributos desaparecen por completo y la superposición se desmonta, sin dejar nada en el árbol de accesibilidad. El estado de ocupado nunca depende solo del color: se enuncia con palabras en el mensaje o en el texto solo para lectores, se expone mediante aria-busy y se muestra por forma, ya que el spinner es un anillo con hueco y no un círculo completo y el panel ocupa físicamente la región. Con prefers-reduced-motion se cancelan el fundido de la cortina, la entrada del panel y la rotación mediante motion-reduce:animate-none, y como cada keyframe termina en el estado visual de reposo, la cortina, el panel, el mensaje y un anillo bitono estático siguen totalmente renderizados: el estado de ocupado permanece y solo se detiene el movimiento. En el modo de colores forzados se eliminan el filtro de fondo y todas las imágenes de fondo, la cortina se repinta con Canvas, el borde del panel con CanvasText, la pista del spinner con GrayText y su arco con CanvasText para que ambos tonos sigan siendo distinguibles, y todos los glifos con CanvasText; si quien consume hace enfocable la región, obtiene un contorno Highlight. Mensaje y detalle superan 4,5:1 sobre su propio panel en cada material, incluidos ambos extremos del gradiente skeuo, glass sobre fondo blanco y negro y los dos esquemas adaptive, y el arco del spinner supera 3:1 sobre su propia pista. El componente no guarda estado, no usa temporizadores y no lee el reloj, así que servidor y cliente renderizan siempre el mismo árbol.',
  sourcePath: "src/registry/ui/loading-overlay.tsx",
  Preview: LoadingOverlayPreview,
};
