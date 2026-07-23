import { FunnelChartPreview } from "@/registry/previews/funnel-chart-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Funnel Chart. */
export const entry: RegistryEntry = {
  slug: "funnel-chart",
  name: "Funnel Chart",
  nameEs: "Gráfico de Embudo",
  category: "data",
  materials: ["adaptive"],
  description:
    "A vertical funnel of stages drawn by hand as centered CSS bars — each bar's width proportional to its value, with the stage label, its value and the conversion % from the previous stage all shown as text — and a real sr-only table (stage, value, conversion) as its accessible equivalent.",
  descriptionEs:
    "Un embudo vertical de etapas dibujado a mano con barras CSS centradas —el ancho de cada barra proporcional a su valor, con la etiqueta de la etapa, su valor y el porcentaje de conversión respecto a la etapa anterior mostrados como texto— y una tabla sr-only real (etapa, valor, conversión) como su equivalente accesible.",
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered: a <caption> names it and a header row labels the Stage, Value and Conversion columns, then one row per stage carries the exact figures via <th scope=\"row\"> and <td>, including the stage-to-stage conversion percentage. The drawn funnel is aria-hidden decoration layered on top, so a screen reader announces the table's precise numbers rather than trying to interpret a shape. Color is never the sole carrier of meaning: each stage prints its label, its value and its conversion from the previous stage as visible text, so the funnel reads as one series in one hue and the bar width is only a redundant restatement of a number already spelled out. Contrast: label and value text use the primary text token and the conversion connectors the muted token, each at or above 4.5:1 against a light and a dark surface, while the bar fill clears the 3:1 bar asked of an informative graphic in both schemes. Bars grow on mount reduced-motion-safe without JavaScript: a bar's resting state is its final width, so SSR, no-JS and reduced motion all show the true magnitude, and the from-zero entrance is expressed with the @starting-style (starting:) variant on the standalone scale property with a centered transform-origin, and motion-reduce:transition-none lands straight on the final width. In forced-colors mode each bar becomes a CanvasText block with a CanvasText border so its bounds stay perceivable, and every label, value and conversion becomes CanvasText. Conversion percentages are computed deterministically as current divided by previous with a divide-by-zero guard — the first stage, and any stage following a zero, show an em dash — and every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada: un <caption> la nombra y una fila de encabezado rotula las columnas Etapa, Valor y Conversión, y luego una fila por etapa lleva las cifras exactas mediante <th scope=\"row\"> y <td>, incluido el porcentaje de conversión entre etapas. El embudo dibujado es decoración aria-hidden superpuesta, así que un lector de pantalla anuncia los números precisos de la tabla en vez de intentar interpretar una forma. El color nunca es el único portador de significado: cada etapa imprime su etiqueta, su valor y su conversión respecto a la etapa anterior como texto visible, así que el embudo se lee como una serie de un solo tono y el ancho de la barra es solo una repetición redundante de un número ya escrito. Contraste: el texto de etiqueta y valor usa el token de texto primario y los conectores de conversión el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, mientras que el relleno de barra supera el 3:1 pedido a un gráfico informativo en ambos esquemas. Las barras crecen al montar de forma segura para movimiento reducido sin JavaScript: el estado en reposo de una barra es su ancho final, así que SSR, sin-JS y movimiento reducido muestran la magnitud real, y la entrada desde cero se expresa con la variante @starting-style (starting:) sobre la propiedad estándar scale con un transform-origin centrado, y motion-reduce:transition-none cae directo en el ancho final. En modo forced-colors cada barra pasa a ser un bloque CanvasText con borde CanvasText para que sus límites sigan siendo perceptibles, y cada etiqueta, valor y conversión pasa a CanvasText. Los porcentajes de conversión se calculan de forma determinista como actual dividido entre anterior con una protección de división por cero —la primera etapa, y cualquier etapa tras un cero, muestran una raya— y cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/funnel-chart.tsx",
  Preview: FunnelChartPreview,
};
