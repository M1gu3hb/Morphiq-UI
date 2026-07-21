import { TextareaPreview } from "@/registry/previews/textarea-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the textarea component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "textarea",
  name: "Textarea",
  nameEs: "Área de texto",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A multi-line text field with four material recipes, three treatments and three sizes. Ships as a bare control plus a composed field that wires the label, the description and the error state together, and can grow with its content instead of scrolling.",
  descriptionEs:
    "Un campo de texto multilínea con cuatro recetas de material, tres tratamientos y tres tamaños. Se entrega como control desnudo más un campo compuesto que conecta la etiqueta, la descripción y el estado de error, y puede crecer con su contenido en vez de hacer scroll.",
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
    "Renders a native <textarea>, so typing, selection, spellcheck, form submission, the mobile keyboard and the browser's own resize handle are the platform's rather than a reimplementation. It holds no state of its own: pass value + onChange to control it, or defaultValue to let the DOM own it. The resize handle is left in place by default, because taking away a control the user already has is a regression; it is only removed under autoResize, where a manually dragged height would immediately be overwritten by the measured one. autoResize keeps `rows` as a floor, so the field never starts smaller than the space reserved for it, and it re-measures on mount and whenever a controlled value changes, so a field populated programmatically is the right size before anyone types. TextareaField renders a real <label htmlFor> bound to the control and composes aria-describedby rather than overwriting it, so a caller's own description survives. The single source of truth for the error state is aria-invalid — the error styling keys off that same attribute, so what is shown and what assistive tech is told cannot drift apart. The message region is always mounted, even when empty, because an aria-live region has to exist before its text arrives for the announcement to be reliable. Focus combines a 2px offset :focus-visible outline with a material-specific inset well: clay and skeuo press inward, glass gains contained depth and adaptive uses a restrained contact inset. The error colour remains authoritative while invalid. prefers-reduced-motion removes the interpolation but preserves that final focus state; forced-colors removes the tactile shadows, material gradient and backdrop filter while a system-coloured border and outline keep the field bounds, focus and invalid state perceivable. Contrast: typed text and placeholder both measure at or above 4.5:1 against the control's own surface on every material and in both the default and filled treatments — placeholders are held to the body-text bar, not the softer one decorative grey usually gets. Conservative checks against the darkest gradient endpoint or backdrop produce these placeholder / typed-text minima: clay 4.80:1 / 9.81:1, glass 5.12:1 / 7.03:1, skeuo 5.47:1 / 9.55:1, adaptive light 6.59:1 / 14.98:1 and adaptive dark 7.01:1 / 12.24:1. The warm skeuo resting border measures 3.12:1 against its darkest filled endpoint. The underline treatment has no surface of its own by design, so its contrast comes from the page: measured 6.22:1 to 12.17:1 for placeholders and 12.71:1 upward for text on the Morphiq paper background and on white. The label and helper text inherit the host's colour rather than pinning one, since they sit on the page's surface and not on ours; the error message keeps an explicit colour because there the colour carries meaning, and it measures 6.42:1 or better on those same surfaces.",
  a11yEs:
    "Renderiza un <textarea> nativo, así que la escritura, la selección, el corrector ortográfico, el envío del formulario, el teclado móvil y el propio tirador de redimensionado del navegador son de la plataforma y no una reimplementación. No guarda estado propio: pasa value + onChange para controlarlo, o defaultValue para que lo gestione el DOM. El tirador de redimensionado se conserva por defecto, porque quitarle al usuario un control que ya tenía es un retroceso; solo se elimina con autoResize, donde una altura arrastrada a mano sería sobrescrita de inmediato por la medida. autoResize mantiene `rows` como suelo, así que el campo nunca arranca más pequeño que el espacio reservado, y vuelve a medir al montarse y cada vez que cambia un value controlado, de modo que un campo rellenado por código tiene el tamaño correcto antes de que nadie escriba. TextareaField renderiza un <label htmlFor> real asociado al control y compone aria-describedby en vez de sobrescribirlo, así que una descripción propia de quien lo usa sobrevive. La única fuente de verdad del estado de error es aria-invalid — el estilo de error se apoya en ese mismo atributo, de modo que lo que se ve y lo que se le dice a la tecnología de asistencia no pueden desincronizarse. La región del mensaje está siempre montada, incluso vacía, porque una región aria-live tiene que existir antes de que llegue su texto para que el anuncio sea fiable. El foco combina un contorno de 2px desplazado en :focus-visible con un pozo interior específico del material: clay y skeuo se hunden, glass gana profundidad contenida y adaptive usa un contacto sobrio. El color de error sigue siendo autoritativo mientras el control es inválido. prefers-reduced-motion elimina la interpolación pero conserva ese estado final de foco; forced-colors quita las sombras táctiles, el gradiente del material y el filtro de fondo mientras un borde y contorno de sistema mantienen perceptibles los límites, el foco y el estado inválido. Contraste: tanto el texto escrito como el placeholder miden 4,5:1 o más contra la superficie del propio control en cada material y en los tratamientos por defecto y relleno — al placeholder se le exige la misma vara que al texto de cuerpo, no la más blanda que suele tolerarse para el gris decorativo. Las comprobaciones conservadoras contra el extremo más oscuro del gradiente o fondo dan estos mínimos placeholder / texto escrito: clay 4,80:1 / 9,81:1, glass 5,12:1 / 7,03:1, skeuo 5,47:1 / 9,55:1, adaptive claro 6,59:1 / 14,98:1 y adaptive oscuro 7,01:1 / 12,24:1. El borde skeuo cálido en reposo mide 3,12:1 contra el extremo más oscuro del relleno. El tratamiento subrayado no tiene superficie propia por diseño, así que su contraste viene de la página: medido entre 6,22:1 y 12,17:1 para placeholders y desde 12,71:1 para el texto, sobre el fondo papel de Morphiq y sobre blanco. La etiqueta y el texto de ayuda heredan el color del anfitrión en vez de fijar uno, porque van sobre la superficie de la página y no sobre la nuestra; el mensaje de error sí conserva un color explícito porque ahí el color transmite significado, y mide 6,42:1 o más sobre esas mismas superficies.",
  sourcePath: "src/registry/ui/textarea.tsx",
  Preview: TextareaPreview,
};
