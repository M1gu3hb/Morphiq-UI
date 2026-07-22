import { BarChartPreview } from "@/registry/previews/bar-chart-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Bar Chart. */
export const entry: RegistryEntry = {
  slug: "bar-chart",
  name: "Bar Chart",
  nameEs: "Gráfico de Barras",
  category: "data",
  materials: ["adaptive"],
  description:
    "A categorical bar chart drawn by hand as inline SVG — bars, axes, gridlines and labels computed from a {label,value}[] array — with vertical and horizontal orientations and a real sr-only table as its accessible equivalent.",
  descriptionEs:
    "Un gráfico de barras categórico dibujado a mano en SVG en línea —barras, ejes, líneas de cuadrícula y etiquetas calculadas a partir de un arreglo {label,value}[]— con orientaciones vertical y horizontal y una tabla sr-only real como su equivalente accesible.",
  variants: [
    { id: "vertical", label: "Vertical", labelEs: "Vertical" },
    { id: "horizontal", label: "Horizontal", labelEs: "Horizontal" },
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered: a <caption> names it, a header row labels the Category and Value columns, and one row per datum carries the exact figures via <th scope=\"row\"> and <td>. The decorative SVG chart is aria-hidden, so a screen reader announces the table's precise numbers rather than trying to interpret a drawing. Color is never the sole carrier of meaning: every bar prints its numeric value as visible text and is named by its category label on the axis, so the chart reads as one series in one hue without depending on the fill color at all. Contrast: value labels use the primary text token and category and tick labels the muted token, each at or above 4.5:1 against a light and a dark surface, and the bar fill clears the 3:1 bar asked of an informative graphic in both schemes. Bars grow on mount reduced-motion-safe without JavaScript: a bar's resting state is its final size, so SSR, no-JS and reduced motion all show the true value, and the from-zero entrance is expressed with the @starting-style (starting:) variant on the standalone scale property anchored to the baseline, with motion-reduce:transition-none landing straight on the final size. In forced-colors mode the bar fill becomes Highlight and the axes, gridlines and every label become CanvasText, so the measured quantities stay perceivable. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada: un <caption> la nombra, una fila de encabezado rotula las columnas Categoría y Valor, y una fila por dato lleva las cifras exactas mediante <th scope=\"row\"> y <td>. El gráfico SVG decorativo es aria-hidden, así que un lector de pantalla anuncia los números precisos de la tabla en vez de intentar interpretar un dibujo. El color nunca es el único portador de significado: cada barra imprime su valor numérico como texto visible y se nombra por su etiqueta de categoría en el eje, así que el gráfico se lee como una serie de un solo tono sin depender del color de relleno. Contraste: las etiquetas de valor usan el token de texto primario y las de categoría y marcas el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, y el relleno de barra supera el 3:1 pedido a un gráfico informativo en ambos esquemas. Las barras crecen al montar de forma segura para movimiento reducido sin JavaScript: el estado en reposo de una barra es su tamaño final, así que SSR, sin-JS y movimiento reducido muestran el valor real, y la entrada desde cero se expresa con la variante @starting-style (starting:) sobre la propiedad estándar scale anclada a la línea base, y motion-reduce:transition-none cae directo en el tamaño final. En modo forced-colors el relleno de barra pasa a Highlight y los ejes, líneas de cuadrícula y cada etiqueta a CanvasText, así que las cantidades medidas siguen siendo perceptibles. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/bar-chart.tsx",
  Preview: BarChartPreview,
};
