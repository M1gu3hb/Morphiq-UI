import { NumberStepperPreview } from "@/registry/previews/number-stepper-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the number stepper component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "number-stepper",
  name: "Number Stepper",
  nameEs: "Contador numérico",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A native number input flanked by − and + buttons with hold-to-repeat. It honours min, max and step, disables the button at each boundary, and writes through the real input so React value/onChange and uncontrolled forms see every step. Ships as a bare control plus a composed field that wires the label, description and error state together.",
  descriptionEs:
    "Un input numérico nativo flanqueado por botones − y + con repetición al mantener pulsado. Respeta min, max y step, desactiva el botón en cada límite y escribe sobre el input real para que value/onChange de React y los formularios no controlados vean cada paso. Se entrega como control desnudo más un campo compuesto que conecta la etiqueta, la descripción y el estado de error.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "filled", label: "Filled", labelEs: "Relleno" },
  ],
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
    "The value is a native <input type=number>, which the platform already exposes as a spinbutton — role, aria-valuenow, aria-valuemin/max and arrow-key stepping all come from the browser rather than a reimplementation. The component adds min, max and step attributes and keeps native form participation, autofill and the numeric mobile keyboard. The − and + buttons carry aria-label Decrease and Increase, their glyphs are aria-hidden, they are focusable and activate with Enter or Space (a keyboard user can equally step with the native arrow keys on the field itself), and each disables at its boundary (− at min, + at max) as well as when the control is disabled. Pressing a button steps once immediately and, on a sustained hold, begins an accelerating repeat; the repeat is driven from pointerdown and keydown and torn down on pointerup, pointerleave, pointercancel, blur and unmount, with the timers held in refs and cleared in an effect cleanup so nothing leaks. Buttons step the field by writing through the input's native value setter and dispatching a real bubbling input event, so a programmatic step is indistinguishable from a keystroke to React and to an uncontrolled form. aria-invalid is the single source of truth for the error look — the error styling keys off that same attribute, so what is shown and what assistive tech is told cannot drift. NumberStepperField renders a real <label htmlFor> bound to the field and composes aria-describedby rather than overwriting it; the message region is always mounted, even empty, because an aria-live region must exist before its text arrives for the announcement to be reliable. Focus combines a 2px offset :focus-visible outline with a material-specific inset well, and the buttons show a press that depresses 1px into a well while active. prefers-reduced-motion removes the travel but preserves the final focus and press states; forced-colors removes the tactile shadows, gradients and backdrop filters while a system-coloured border keeps the field and both button bounds perceivable, the invalid border switches to Mark, the focus outline to Highlight, and the button glyphs to CanvasText. Contrast: typed digits and placeholder both measure at or above 4.5:1 against the control's own surface on every material, and the − / + glyphs are informative controls held to that same 4.5:1 because they inherit the typed-digit colour rather than a decorative grey.",
  a11yEs:
    "El valor es un <input type=number> nativo, que la plataforma ya expone como spinbutton — el rol, aria-valuenow, aria-valuemin/max y el paso con las flechas vienen del navegador y no de una reimplementación. El componente añade los atributos min, max y step y conserva la participación en formularios, el autocompletado y el teclado numérico móvil nativos. Los botones − y + llevan aria-label Decrease e Increase, sus glifos son aria-hidden, son enfocables y se activan con Enter o Espacio (quien usa teclado también puede avanzar con las flechas nativas sobre el propio campo), y cada uno se desactiva en su límite (− en min, + en max) y cuando el control está deshabilitado. Al pulsar un botón se da un paso de inmediato y, al mantener pulsado, empieza una repetición que acelera; la repetición se dispara desde pointerdown y keydown y se desmonta en pointerup, pointerleave, pointercancel, blur y al desmontar, con los temporizadores guardados en refs y limpiados en la limpieza de un efecto para que nada quede colgado. Los botones actualizan el campo escribiendo a través del setter de value nativo del input y despachando un evento input real que burbujea, así que un paso programático es indistinguible de una pulsación de tecla para React y para un formulario no controlado. aria-invalid es la única fuente de verdad del estado de error — el estilo de error se apoya en ese mismo atributo, de modo que lo que se ve y lo que se le dice a la tecnología de asistencia no pueden desincronizarse. NumberStepperField renderiza un <label htmlFor> real asociado al campo y compone aria-describedby en vez de sobrescribirlo; la región del mensaje está siempre montada, incluso vacía, porque una región aria-live tiene que existir antes de que llegue su texto para que el anuncio sea fiable. El foco combina un contorno de 2px desplazado en :focus-visible con un pozo interior específico del material, y los botones muestran una pulsación que se hunde 1px en un pozo mientras están activos. prefers-reduced-motion elimina el recorrido pero conserva los estados finales de foco y pulsación; forced-colors quita las sombras táctiles, los gradientes y los filtros de fondo mientras un borde de sistema mantiene perceptibles los límites del campo y de ambos botones, el borde inválido pasa a Mark, el contorno de foco a Highlight y los glifos de los botones a CanvasText. Contraste: tanto los dígitos escritos como el placeholder miden 4,5:1 o más contra la superficie del propio control en cada material, y los glifos − / + son controles informativos sujetos a ese mismo 4,5:1 porque heredan el color del dígito escrito y no un gris decorativo.",
  sourcePath: "src/registry/ui/number-stepper.tsx",
  Preview: NumberStepperPreview,
};
