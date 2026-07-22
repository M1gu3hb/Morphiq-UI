import { FloatingLabelInputPreview } from "@/registry/previews/floating-label-input-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the floating label input.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "floating-label-input",
  name: "Floating Label Input",
  nameEs: "Campo con etiqueta flotante",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A text field whose label starts as a placeholder and floats up, shrinking, the moment the control is focused or holds a value. The float is pure CSS keyed off :placeholder-shown — no value tracking — and animates only transform properties, so it never triggers layout. Four material recipes, three treatments and three sizes.",
  descriptionEs:
    "Un campo de texto cuya etiqueta empieza como marcador de posición y flota hacia arriba, encogiéndose, en cuanto el control recibe foco o contiene un valor. El flotado es CSS puro apoyado en :placeholder-shown — sin rastreo de valor — y solo anima propiedades de transformación, así que nunca provoca reflujo. Cuatro recetas de material, tres tratamientos y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "filled", label: "Filled", labelEs: "Relleno" },
    { id: "underline", label: "Underline", labelEs: "Subrayado" },
  ],
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
    "Built on a native <input>, so typing, selection, autofill, form submission and the mobile keyboard are the browser's rather than a reimplementation. It holds no state of its own: pass value + onChange to control it, or defaultValue to let the DOM own it. The visible label is a real <label htmlFor> bound to the control — the float is purely a visual effect layered on top, never the mechanism of association — and it is the accessible name; the control's single-space placeholder is decorative, present only so :placeholder-shown can distinguish empty from filled and drive the float in CSS with no value-tracking JavaScript. aria-invalid is the single source of truth for the error state: the control border, the floated label and the message all key off that same attribute, so what is shown and what assistive tech is told cannot drift apart. aria-describedby is composed rather than overwritten, so a caller's own description survives. The message region is always mounted, even when empty, because an aria-live=polite region has to exist before its text arrives for the announcement to be reliable; ids come from React.useId so render is deterministic and SSR-safe. The label rises with the standalone translate and scale properties only — never font-size — so the motion stays on the compositor and triggers no layout; prefers-reduced-motion removes the interpolation but preserves the final floated position, and forced-colors swaps the material surface for a solid Canvas chip under CanvasText, clears the tactile shadows, gradient and backdrop filter, and keeps a system-coloured border, an Highlight focus outline and a Mark invalid border so bounds, focus and error stay perceivable. Focus adds a 2px offset :focus-visible outline over a material-specific inset well: clay and skeuo press inward, glass gains contained depth, adaptive uses a restrained contact inset. Contrast: the resting label uses --mq-placeholder and the floated label --mq-text, and both measure at or above 4.5:1 against the control's own surface on every material — a floated label is informative, so it is held to the body-text bar, not the softer one decorative grey usually gets. The error label and message measure comfortably above that on each surface. The underline treatment has no surface of its own by design, so its label contrast comes from the page.",
  a11yEs:
    "Construido sobre un <input> nativo, así que la escritura, la selección, el autocompletado, el envío del formulario y el teclado móvil son los del navegador y no una reimplementación. No guarda estado propio: pasa value + onChange para controlarlo, o defaultValue para que lo gestione el DOM. La etiqueta visible es un <label htmlFor> real asociado al control —el flotado es solo un efecto visual superpuesto, nunca el mecanismo de asociación— y es el nombre accesible; el placeholder de un solo espacio del control es decorativo, presente únicamente para que :placeholder-shown distinga vacío de relleno y accione el flotado en CSS sin JavaScript que rastree el valor. aria-invalid es la única fuente de verdad del estado de error: el borde del control, la etiqueta flotada y el mensaje se apoyan en ese mismo atributo, de modo que lo que se ve y lo que se le dice a la tecnología de asistencia no pueden desincronizarse. aria-describedby se compone en vez de sobrescribirse, así que una descripción propia de quien lo usa sobrevive. La región del mensaje está siempre montada, incluso vacía, porque una región aria-live=polite tiene que existir antes de que llegue su texto para que el anuncio sea fiable; los ids vienen de React.useId, así que el render es determinista y seguro en SSR. La etiqueta sube solo con las propiedades independientes translate y scale —nunca font-size— así que el movimiento se queda en el compositor y no provoca reflujo; prefers-reduced-motion elimina la interpolación pero conserva la posición flotada final, y forced-colors cambia la superficie del material por un chip Canvas sólido bajo CanvasText, quita las sombras táctiles, el gradiente y el filtro de fondo, y mantiene un borde de sistema, un contorno de foco Highlight y un borde inválido Mark para que límites, foco y error sigan perceptibles. El foco añade un contorno :focus-visible de 2px desplazado sobre un pozo interior específico del material: clay y skeuo se hunden, glass gana profundidad contenida, adaptive usa un contacto sobrio. Contraste: la etiqueta en reposo usa --mq-placeholder y la etiqueta flotada --mq-text, y ambas miden 4,5:1 o más contra la superficie del propio control en cada material —una etiqueta flotada es informativa, así que se le exige la vara del texto de cuerpo, no la más blanda que suele tolerarse para el gris decorativo. La etiqueta y el mensaje de error miden holgadamente por encima de eso en cada superficie. El tratamiento subrayado no tiene superficie propia por diseño, así que el contraste de su etiqueta viene de la página.",
  sourcePath: "src/registry/ui/floating-label-input.tsx",
  Preview: FloatingLabelInputPreview,
};
