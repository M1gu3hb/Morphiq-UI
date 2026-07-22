import { ProgressStepsPreview } from "@/registry/previews/progress-steps-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Progress Steps component. */
export const entry: RegistryEntry = {
  slug: "progress-steps",
  name: "Progress Steps",
  nameEs: "Pasos de Progreso",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "A horizontal step indicator built from an ordered list, marking completed, current and pending steps with connectors and a check glyph, in three sizes.",
  descriptionEs:
    "Un indicador de pasos horizontal construido con una lista ordenada, que marca los pasos completados, actual y pendientes con conectores y un icono de verificación, en tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "The indicator is an ordered list: an <ol> of <li> steps, so the count and sequence are conveyed structurally. Each step is named by its visible label, and a visually hidden status word — Completed, Current step or Pending, all overridable through statusLabels for localisation — prefixes that label so meaning never rests on colour alone. State is carried by three signals at once: a check glyph plus a solid fill for completed, a solid ring and an underlined label plus aria-current=\"step\" for the current step, and a dashed marker for pending. Markers, their numbers and the connector rules are decorative and aria-hidden, because the label and status word already carry every step's identity. Forced-colors mode keeps the whole indicator legible without the fills it discards: the completed marker and its filled connector take Highlight, the current marker's border and outline take CanvasText, and the connector tracks take CanvasText, while background washes are cleared by hand. The current marker's spring keyframe animates only the standalone scale property and the connector fill transitions only scale, and prefers-reduced-motion removes both while leaving every completed connector filled and every marker at rest, so the resting state that reports progress is preserved. Label and description foregrounds sit at or above 4.5:1 in both the light and dark adaptive palettes.",
  a11yEs:
    "El indicador es una lista ordenada: un <ol> de pasos <li>, de modo que el número y la secuencia se transmiten de forma estructural. Cada paso se nombra por su etiqueta visible, y una palabra de estado oculta visualmente — Completed, Current step o Pending, todas sustituibles mediante statusLabels para la localización — antecede a esa etiqueta para que el significado nunca dependa solo del color. El estado se transmite con tres señales a la vez: un icono de verificación más un relleno sólido para completado, un anillo sólido y una etiqueta subrayada más aria-current=\"step\" para el paso actual, y un marcador punteado para pendiente. Los marcadores, sus números y las líneas conectoras son decorativos y llevan aria-hidden, porque la etiqueta y la palabra de estado ya portan la identidad de cada paso. El modo de colores forzados mantiene todo el indicador legible sin los rellenos que descarta: el marcador completado y su conector relleno toman Highlight, el borde y el contorno del marcador actual toman CanvasText y las pistas de los conectores toman CanvasText, mientras los fondos se limpian a mano. El keyframe de resorte del marcador actual anima solo la propiedad independiente scale y el relleno del conector transiciona solo scale, y prefers-reduced-motion elimina ambos dejando cada conector completado relleno y cada marcador en reposo, de modo que se preserva el estado en reposo que informa del progreso. Los primeros planos de etiqueta y descripción se sitúan en 4,5:1 o por encima en las paletas adaptativas clara y oscura.",
  sourcePath: "src/registry/ui/progress-steps.tsx",
  Preview: ProgressStepsPreview,
};
