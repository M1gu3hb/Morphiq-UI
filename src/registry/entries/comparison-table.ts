import { ComparisonTablePreview } from "@/registry/previews/comparison-table-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Comparison Table. */
export const entry: RegistryEntry = {
  slug: "comparison-table",
  name: "Comparison Table",
  nameEs: "Tabla Comparativa",
  category: "data",
  materials: ["adaptive"],
  description:
    "A plans × features comparison matrix rendered as a real <table>: plan columns as <th scope=\"col\">, feature rows as <th scope=\"row\">, boolean cells shown as a check or dash icon plus sr-only Included/Not included text, and a recommended column flagged by a text badge — with optional zebra rows and a sticky header.",
  descriptionEs:
    "Una matriz de comparación de planes × características representada como una <table> real: columnas de plan como <th scope=\"col\">, filas de característica como <th scope=\"row\">, celdas booleanas mostradas como un icono de check o guion más texto sr-only Incluido/No incluido, y una columna recomendada marcada con una insignia de texto —con filas cebra opcionales y encabezado fijo.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "The graphic is a real <table>, so the accessible equivalent and the visual are the same object: a <caption> names it (visible or sr-only), the plan columns are <th scope=\"col\"> and each feature row leads with <th scope=\"row\">, so a screen reader announces every cell already associated with both its feature and its plan. Color is never the sole carrier of meaning: a boolean cell is a check or a dash — two distinct shapes — each paired with sr-only \"Included\" or \"Not included\" text, so the answer reads without perceiving any color, while value cells simply print their text and a recommended plan is flagged by a text badge and boxed rails rather than hue alone. Contrast: body text, header text and the muted description and note text all measure at or above 4.5:1 against a light and a dark surface, and the check and dash glyphs clear the 3:1 bar asked of an informative graphic in both schemes. The table fades in on mount reduced-motion-safe without JavaScript: its resting state is fully opaque, so SSR, no-JS and reduced motion all show it, and the entrance is expressed with the @starting-style (starting:) variant on opacity with motion-reduce:transition-none landing straight on the final value; opacity is used rather than a transform so a sticky header is never trapped in a transformed containing block. In forced-colors mode the fills and shadow are discarded but the borders are kept as CanvasText, the check and dash glyphs become CanvasText, and the recommended plan's badge switches to the system Highlight pair so the selected column stays perceivable. Every value is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El gráfico es una <table> real, así que el equivalente accesible y lo visual son el mismo objeto: un <caption> la nombra (visible o sr-only), las columnas de plan son <th scope=\"col\"> y cada fila de característica comienza con <th scope=\"row\">, de modo que un lector de pantalla anuncia cada celda ya asociada tanto con su característica como con su plan. El color nunca es el único portador de significado: una celda booleana es un check o un guion —dos formas distintas— cada una acompañada de texto sr-only \"Incluido\" o \"No incluido\", así que la respuesta se lee sin percibir ningún color, mientras que las celdas de valor simplemente imprimen su texto y un plan recomendado se marca con una insignia de texto y rieles enmarcados en lugar de solo el tono. Contraste: el texto del cuerpo, el de encabezado y el texto atenuado de descripciones y notas miden al menos 4,5:1 sobre una superficie clara y una oscura, y los glifos de check y guion superan el 3:1 pedido a un gráfico informativo en ambos esquemas. La tabla aparece con un fundido al montar de forma segura para movimiento reducido sin JavaScript: su estado en reposo es totalmente opaco, así que SSR, sin-JS y movimiento reducido lo muestran, y la entrada se expresa con la variante @starting-style (starting:) sobre opacity con motion-reduce:transition-none cayendo directo al valor final; se usa opacity en vez de una transformación para que un encabezado fijo nunca quede atrapado en un bloque contenedor transformado. En modo forced-colors los rellenos y la sombra se descartan pero los bordes se mantienen como CanvasText, los glifos de check y guion pasan a CanvasText, y la insignia del plan recomendado cambia al par Highlight del sistema para que la columna seleccionada siga siendo perceptible. Cada valor es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/comparison-table.tsx",
  Preview: ComparisonTablePreview,
};
