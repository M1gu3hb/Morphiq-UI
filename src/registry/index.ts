import { ButtonPreview } from "@/registry/previews/button-preview";
import { CardPreview } from "@/registry/previews/card-preview";
import { TogglePreview } from "@/registry/previews/toggle-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * The component registry.
 *
 * Additive by contract: a new component appends exactly one entry here and adds
 * its own files under `src/registry/ui/` (+ a preview under
 * `src/registry/previews/`). Nothing else in the app needs to change — the
 * catalog, the material filter and the `/components/[slug]` static routes all
 * derive from this array.
 *
 * Keep entries alphabetical by `slug` so parallel additions from different
 * authors conflict on separate lines instead of on the same one.
 */
export const registry: RegistryEntry[] = [
  {
    slug: "button",
    name: "Button",
    nameEs: "Botón",
    category: "actions",
    materials: ["clay", "glass", "skeuo", "adaptive"],
    description:
      "A production action control with four material recipes, three intents, three sizes, a loading state, and a polymorphic asChild escape hatch.",
    descriptionEs:
      "Un control de acción de producción con cuatro recetas de material, tres intenciones, tres tamaños, estado de carga y un escape polimórfico asChild.",
    variants: [
      { id: "primary", label: "Primary", labelEs: "Primaria" },
      { id: "secondary", label: "Secondary", labelEs: "Secundaria" },
      { id: "ghost", label: "Ghost", labelEs: "Fantasma" },
    ],
    sizes: [
      { id: "sm", label: "Small", labelEs: "Pequeño" },
      { id: "md", label: "Medium", labelEs: "Mediano" },
      { id: "lg", label: "Large", labelEs: "Grande" },
    ],
    dependencies: {
      npm: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
      internal: ["src/lib/cn.ts"],
    },
    a11y:
      "Renders a native <button> with type=\"button\" by default. Focus is shown with a 2px offset ring on :focus-visible and is never removed. Loading sets aria-busy and suppresses activation in the handlers while deliberately keeping the control focusable — the native disabled attribute is reserved for the disabled prop, because a disabled element is blurred and dropped from the tab order, which would silence the busy announcement it is meant to carry. Activation is blocked for pointer and for Enter/Space alike, including on the asChild path where the slotted element may be a link that ignores aria-disabled. Motion is suppressed under prefers-reduced-motion. Contrast: every filled material and intent measures at or above 4.5:1 (lowest is glass/ghost at 4.70:1 composited over pure black, highest is adaptive/primary at 16.32:1). The glass recipes carry their own tint precisely so legibility never depends on the backdrop behind them. The ghost intents are transparent by design, so their contrast comes from the surface you place them on: clay and skeuo ghost pin their own dark label (9.59:1 and 11.17:1 on Morphiq paper), while adaptive ghost inherits the host's text colour so it stays legible on a light or a dark surface.",
    a11yEs:
      "Renderiza un <button> nativo con type=\"button\" por defecto. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina. El estado de carga activa aria-busy y bloquea la activación en los manejadores, manteniendo el control enfocable a propósito — el atributo nativo disabled se reserva para la prop disabled, porque un elemento deshabilitado pierde el foco y sale del orden de tabulación, lo que silenciaría justo el anuncio de ocupado que debe transmitir. La activación se bloquea igual con puntero que con Enter/Espacio, incluso en la ruta asChild donde el elemento insertado puede ser un enlace que ignora aria-disabled. El movimiento se suprime bajo prefers-reduced-motion. Contraste: cada material e intención con relleno mide 4,5:1 o más (el mínimo es glass/ghost con 4,70:1 compuesto sobre negro puro; el máximo es adaptive/primary con 16,32:1). Las recetas de vidrio llevan su propio tinte justamente para que la legibilidad nunca dependa del fondo que tengan detrás. Las intenciones fantasma son transparentes por diseño, así que su contraste viene de la superficie donde las coloques: clay y skeuo fijan su propia etiqueta oscura (9,59:1 y 11,17:1 sobre el papel de Morphiq), mientras que adaptive hereda el color de texto del anfitrión para seguir legible sobre una superficie clara u oscura.",
    sourcePath: "src/registry/ui/button.tsx",
    Preview: ButtonPreview,
  },
  {
    slug: "card",
    name: "Card",
    nameEs: "Tarjeta",
    category: "cards",
    materials: ["clay", "glass", "skeuo", "adaptive"],
    description:
      "A composable surface with four material recipes, three elevations, three densities, and header/body/footer parts that inherit the card's tokens without any context provider.",
    descriptionEs:
      "Una superficie componible con cuatro recetas de material, tres elevaciones, tres densidades y partes de encabezado/cuerpo/pie que heredan los tokens de la tarjeta sin ningún proveedor de contexto.",
    variants: [
      { id: "default", label: "Default", labelEs: "Por defecto" },
      { id: "elevated", label: "Elevated", labelEs: "Elevada" },
      { id: "outline", label: "Outline", labelEs: "Contorno" },
    ],
    sizes: [
      { id: "sm", label: "Small", labelEs: "Pequeña" },
      { id: "md", label: "Medium", labelEs: "Mediana" },
      { id: "lg", label: "Large", labelEs: "Grande" },
    ],
    dependencies: {
      npm: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
      internal: ["src/lib/cn.ts"],
    },
    a11y:
      "Renders a plain <div> and stays a container: it never fakes button semantics, because a role=\"button\" wrapper makes its contents presentational to some assistive tech and cannot legally hold the links and buttons a card usually contains. For a card that is entirely one link, asChild renders it as an <a> and keyboard activation is the browser's. CardTitle defaults to <h3> but takes asChild so the heading rank can match the surrounding document outline. The interactive variant draws its focus ring on :focus-within as well as :focus-visible, so tabbing to a control inside the card outlines the card too; inert cards deliberately skip that to avoid double-ringing the same focus. Loading sets aria-busy behind an inert aria-hidden wash; disabled sets aria-disabled and drops the hover affordance. Motion is suppressed under prefers-reduced-motion, and a system-colored border keeps the card's bounds visible in forced-colors mode, where shadows and translucency are discarded. Contrast: on every filled material both the title and the muted description measure at or above 4.5:1 against the surface, and the glass recipes carry their own tint so that holds over a white and a black backdrop alike. The outline variant is transparent by design and inherits the host's text color rather than pinning one.",
    a11yEs:
      "Renderiza un <div> plano y se mantiene como contenedor: nunca finge semántica de botón, porque un envoltorio con role=\"button\" vuelve presentacional su contenido para parte de las tecnologías de asistencia y no puede contener legalmente los enlaces y botones que una tarjeta suele llevar. Para una tarjeta que es enteramente un enlace, asChild la renderiza como <a> y la activación por teclado es la del navegador. CardTitle usa <h3> por defecto pero acepta asChild para que el rango del encabezado encaje con el esquema del documento. La variante interactiva dibuja su anillo de foco tanto en :focus-within como en :focus-visible, así que tabular a un control interno también resalta la tarjeta; las tarjetas inertes lo omiten a propósito para no duplicar el anillo sobre el mismo foco. El estado de carga activa aria-busy tras un velo inerte con aria-hidden; deshabilitada activa aria-disabled y pierde la señal de hover. El movimiento se suprime bajo prefers-reduced-motion, y un borde con color de sistema mantiene visibles los límites de la tarjeta en forced-colors, donde se descartan sombras y translucidez. Contraste: en cada material con relleno, tanto el título como la descripción atenuada miden 4,5:1 o más contra la superficie, y las recetas de vidrio llevan su propio tinte para que eso se cumpla igual sobre fondo blanco que negro. La variante de contorno es transparente por diseño y hereda el color de texto del anfitrión en vez de fijar uno.",
    sourcePath: "src/registry/ui/card.tsx",
    Preview: CardPreview,
  },
  {
    slug: "toggle",
    name: "Toggle",
    nameEs: "Interruptor",
    category: "inputs",
    materials: ["clay", "glass", "skeuo", "adaptive"],
    description:
      "An on/off switch with four material recipes, three presentations, and three sizes. Works controlled or uncontrolled, and rides on a native button so keyboard and hit-testing are the browser's, not a reimplementation.",
    descriptionEs:
      "Un interruptor on/off con cuatro recetas de material, tres presentaciones y tres tamaños. Funciona controlado o no controlado, y va montado sobre un button nativo para que el teclado y el área de pulsación sean los del navegador, no una reimplementación.",
    variants: [
      { id: "default", label: "Default", labelEs: "Por defecto" },
      { id: "labeled", label: "Labeled", labelEs: "Con texto" },
      { id: "icon", label: "Icon", labelEs: "Con icono" },
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
      "Renders a native <button type=\"button\"> carrying role=\"switch\" and aria-checked, so both Space and Enter toggle it, it sits in the tab order, and its hit area is the browser's — none of that is reimplemented. The accessible name comes from the visible text child; pass aria-label or aria-labelledby instead when the switch ships without one. The ON/OFF captions in the labeled variant and the glyphs in the icon variant are aria-hidden, because aria-checked already conveys the state and announcing it twice would fight the control's own name. Loading sets aria-busy and blocks activation while deliberately keeping the control focusable, so the busy announcement stays reachable; disabled uses the native attribute, which is correct for a form control. The thumb transition is suppressed under prefers-reduced-motion, and in forced-colors mode the track and thumb switch to system colors so the control does not collapse into an empty outline once fills are discarded. Contrast: every caption measures at or above 4.5:1 against the track it sits on, and the glass recipes carry their own tint so that holds over a white and a black backdrop alike. The visible text label inherits the host's color rather than pinning one, so it stays legible on whatever surface the switch is placed on.",
    a11yEs:
      "Renderiza un <button type=\"button\"> nativo con role=\"switch\" y aria-checked, así que tanto Espacio como Enter lo alternan, entra en el orden de tabulación y su área de pulsación es la del navegador — nada de eso está reimplementado. El nombre accesible sale del texto visible que recibe como hijo; si el interruptor va sin texto, pasa aria-label o aria-labelledby. Las leyendas ON/OFF de la variante con texto y los glifos de la variante con icono llevan aria-hidden, porque aria-checked ya comunica el estado y anunciarlo dos veces competiría con el nombre del propio control. El estado de carga activa aria-busy y bloquea la activación manteniendo el control enfocable a propósito, para que el anuncio de ocupado siga siendo alcanzable; deshabilitado usa el atributo nativo, que es lo correcto en un control de formulario. La transición del thumb se suprime bajo prefers-reduced-motion, y en forced-colors la pista y el thumb pasan a colores de sistema para que el control no se quede en un contorno vacío al descartarse los rellenos. Contraste: cada leyenda mide 4,5:1 o más contra la pista sobre la que va, y las recetas de vidrio llevan su propio tinte para que eso se cumpla igual sobre fondo blanco que negro. La etiqueta de texto visible hereda el color del anfitrión en vez de fijar uno, así que sigue legible sobre cualquier superficie donde se coloque el interruptor.",
    sourcePath: "src/registry/ui/toggle.tsx",
    Preview: TogglePreview,
  },
];

export { findRegistryEntry } from "@/registry/schema";
export type {
  PreviewProps,
  PreviewState,
  RegistryCategory,
  RegistryDependencies,
  RegistryEntry,
  RegistryOption,
} from "@/registry/schema";
