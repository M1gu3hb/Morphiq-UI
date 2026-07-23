import { LineChartPreview } from "@/registry/previews/line-chart-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Line Chart. */
export const entry: RegistryEntry = {
  slug: "line-chart",
  name: "Line Chart",
  nameEs: "Gráfico de Líneas",
  category: "data",
  materials: ["adaptive"],
  description:
    "A multi-series line chart drawn by hand as inline SVG — polylines, x/y axes, gridlines, tick labels, per-point markers and a legend computed from a {name,color?,data:number[]}[] array — with a real sr-only series × points table as its accessible equivalent.",
  descriptionEs:
    "Un gráfico de líneas multiserie dibujado a mano en SVG en línea —polilíneas, ejes x/y, líneas de cuadrícula, etiquetas de marcas, marcadores por punto y una leyenda calculadas a partir de un arreglo {name,color?,data:number[]}[]— con una tabla sr-only real de series × puntos como su equivalente accesible.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered as a series × points grid: a <caption> names it, the header row labels the series column and one column per x position with <th scope=\"col\">, and each series is a row whose <th scope=\"row\"> holds the name and one <td> per point holds the exact figure. The decorative SVG chart and the legend are aria-hidden, so a screen reader announces the table's precise numbers rather than trying to interpret a drawing. Color is never the sole carrier of meaning: each legend entry pairs its colored line-swatch with the series name in text, and the table carries every value in words, so the chart reads without perceiving any hue. Contrast: legend names use the primary text token and axis and tick labels the muted token, each at or above 4.5:1 against a light and a dark surface, and the six series hues each clear the 3:1 bar asked of an informative mark in both schemes. Lines draw on mount reduced-motion-safe without JavaScript: a line's resting state is the fully drawn path (stroke-dashoffset:0), so SSR, no-JS and reduced motion all show the complete series, and the one-shot draw is expressed with the @starting-style (starting:) variant from offset 1 to 0 with pathLength=1 so no measurement is needed, and motion-reduce:transition-none lands immediately on the final line. In forced-colors mode the decorative gridline and fill colors are dropped and the lines, markers, legend swatches, axes and labels repaint to CanvasText, so the trends stay perceivable with the series still separable via the table. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada como una cuadrícula de series × puntos: un <caption> la nombra, la fila de encabezado rotula la columna de series y una columna por posición x con <th scope=\"col\">, y cada serie es una fila cuyo <th scope=\"row\"> lleva el nombre y un <td> por punto lleva la cifra exacta. El gráfico SVG decorativo y la leyenda son aria-hidden, así que un lector de pantalla anuncia los números precisos de la tabla en vez de intentar interpretar un dibujo. El color nunca es el único portador de significado: cada entrada de la leyenda acompaña su muestra de línea coloreada con el nombre de la serie en texto, y la tabla lleva cada valor en palabras, así que el gráfico se lee sin percibir ningún tono. Contraste: los nombres de la leyenda usan el token de texto primario y las etiquetas de eje y marcas el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, y los seis tonos de serie superan el 3:1 pedido a una marca informativa en ambos esquemas. Las líneas se dibujan al montar de forma segura para movimiento reducido sin JavaScript: el estado en reposo de una línea es el trazo completo (stroke-dashoffset:0), así que SSR, sin-JS y movimiento reducido muestran la serie completa, y el trazado de una sola pasada se expresa con la variante @starting-style (starting:) de offset 1 a 0 con pathLength=1 para no necesitar medición, y motion-reduce:transition-none cae de inmediato en la línea final. En modo forced-colors se descartan los colores decorativos de cuadrícula y relleno y las líneas, marcadores, muestras de la leyenda, ejes y etiquetas se repintan como CanvasText, así que las tendencias siguen siendo perceptibles con las series aún separables mediante la tabla. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/line-chart.tsx",
  Preview: LineChartPreview,
};
