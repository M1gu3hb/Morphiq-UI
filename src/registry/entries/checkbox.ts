import { CheckboxPreview } from "@/registry/previews/checkbox-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the checkbox component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "checkbox",
  name: "Checkbox",
  nameEs: "Casilla",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A checkbox with four material recipes, two shapes and three sizes, including the mixed state. A real native input does the work and is only made transparent over the drawn box, so the visual state is driven by :checked and :indeterminate rather than mirrored in React.",
  descriptionEs:
    "Una casilla con cuatro recetas de material, dos formas y tres tamaños, incluido el estado mixto. Un input nativo real hace el trabajo y solo se vuelve transparente sobre la caja dibujada, así que el estado visual lo dirigen :checked e :indeterminate en vez de copiarse en React.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "rounded", label: "Rounded", labelEs: "Redonda" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "A real <input type=\"checkbox\"> does the work: it is laid transparent over the drawn box rather than replaced, so the keyboard, focus, form submission and the label association are the browser's, not a reimplementation. The drawn box reads the input's own :checked and :indeterminate pseudo-classes, so what is painted cannot disagree with what assistive tech is told — there is no React copy of the state to fall out of sync. indeterminate is exposed as a prop because it is a DOM property and never an attribute, so it is written to the node in an effect; it is re-applied when checked changes, since toggling clears the mixed state natively. CheckboxField wraps the row in a real <label>, which associates the text without matching ids and makes the whole row a hit target; it composes aria-describedby rather than overwriting it, and aria-invalid is the single source of the error look. The tick and the dash are aria-hidden: the native input already exposes checked and mixed, and announcing them twice would fight the control's own name. Motion is suppressed under prefers-reduced-motion. In forced-colors mode the fill is discarded, so the state is carried by the mark itself — drawn in a system colour and shown by opacity, which that mode does not override — with a system-coloured border keeping the box perceivable. Contrast: the mark measures at or above 3:1 against its filled box on every material, the lowest being clay at 6.44:1 and the highest adaptive at 16.32:1, comfortably past the 3:1 WCAG asks of a non-text indicator. The unchecked box is identified only by its border, so that border is held to the same 3:1 against both its own surface and the Morphiq paper background: the tightest is clay at 3.32:1 against the box and 3.09:1 against the page. The error message measures 6.42:1 or better on those surfaces. The label inherits the host's colour rather than pinning one, since it sits on the page's surface and not on ours.",
  a11yEs:
    "Un <input type=\"checkbox\"> real hace el trabajo: se coloca transparente sobre la caja dibujada en vez de sustituirse, así que el teclado, el foco, el envío del formulario y la asociación de la etiqueta son los del navegador y no una reimplementación. La caja dibujada lee las pseudoclases :checked e :indeterminate del propio input, de modo que lo que se pinta no puede contradecir lo que se le dice a la tecnología de asistencia — no hay una copia del estado en React que pueda desincronizarse. indeterminate se expone como prop porque es una propiedad del DOM y nunca un atributo, así que se escribe en el nodo mediante un efecto; se vuelve a aplicar cuando cambia checked, ya que alternar la casilla borra el estado mixto de forma nativa. CheckboxField envuelve la fila en un <label> real, lo que asocia el texto sin necesidad de ids coincidentes y convierte toda la fila en área de pulsación; compone aria-describedby en vez de sobrescribirlo, y aria-invalid es la única fuente del aspecto de error. La marca y el guion llevan aria-hidden: el input nativo ya expone marcado y mixto, y anunciarlo dos veces competiría con el nombre del propio control. El movimiento se suprime bajo prefers-reduced-motion. En forced-colors se descarta el relleno, así que el estado lo transmite la propia marca — dibujada con un color de sistema y mostrada por opacidad, que ese modo no anula — con un borde de color de sistema que mantiene perceptible la caja. Contraste: la marca mide 3:1 o más contra su caja rellena en cada material, con el mínimo en clay con 6,44:1 y el máximo en adaptive con 16,32:1, holgadamente por encima del 3:1 que WCAG pide a un indicador no textual. La casilla sin marcar se identifica solo por su borde, así que a ese borde se le exige el mismo 3:1 contra su propia superficie y contra el fondo papel de Morphiq: el más ajustado es clay con 3,32:1 contra la caja y 3,09:1 contra la página. El mensaje de error mide 6,42:1 o más sobre esas superficies. La etiqueta hereda el color del anfitrión en vez de fijar uno, porque va sobre la superficie de la página y no sobre la nuestra.",
  sourcePath: "src/registry/ui/checkbox.tsx",
  Preview: CheckboxPreview,
};
