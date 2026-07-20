import { ButtonPreview } from "@/registry/previews/button-preview";
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
