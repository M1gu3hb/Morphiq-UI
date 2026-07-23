import { AreaChartPreview } from "@/registry/previews/area-chart-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Area Chart. */
export const entry: RegistryEntry = {
  slug: "area-chart",
  name: "Area Chart",
  nameEs: "Gráfico de Área",
  category: "data",
  materials: ["adaptive"],
  description:
    "A time-series area chart drawn by hand as inline SVG — a stroked line plus a gradient-filled area per series, from a zero baseline or as cumulative stacked bands — with a legend, a real sr-only table as its accessible equivalent, and areas that grow from the baseline on mount.",
  descriptionEs:
    "Un gráfico de área de series temporales dibujado a mano en SVG en línea —una línea trazada más un área con degradado por serie, desde una línea base cero o como bandas apiladas acumulativas— con leyenda, una tabla sr-only real como su equivalente accesible y áreas que crecen desde la línea base al montar.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "stacked", label: "Stacked", labelEs: "Apilado" },
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered: a <caption> names it, a header row carries the category (x-axis) labels, and one row per series — its name a <th scope=\"row\"> — carries the exact value for every category via <td>. The decorative SVG chart is aria-hidden, so a screen reader announces the table's precise numbers rather than trying to interpret a drawing. Color is never the sole carrier of meaning: every series hue is paired with its name in the visible legend and with a full row of values in the table, so a series is identifiable without perceiving its color at all. Contrast: legend text uses the primary text token at or above 4.5:1 against a light and a dark surface, axis and category labels use the muted token at the same bar, and each series line clears the 3:1 bar asked of an informative graphic in both schemes. Areas grow on mount reduced-motion-safe without JavaScript: the resting state is the final drawing, so SSR, no-JS and reduced motion all show the true values, and the from-baseline entrance is expressed with the @starting-style (starting:) variant on the standalone scale property, anchored to the baseline with transform-box:fill-box and transform-origin:bottom, with motion-reduce:transition-none landing straight on the final drawing. In forced-colors mode the decorative gradient areas are dropped and the series lines, gridlines, axis and every label repaint as CanvasText, so the trends stay perceivable while the legend names and sr-only table remain the full accessible source. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada: un <caption> la nombra, una fila de encabezado lleva las etiquetas de categoría (eje x) y una fila por serie —su nombre en un <th scope=\"row\">— lleva el valor exacto de cada categoría mediante <td>. El gráfico SVG decorativo es aria-hidden, así que un lector de pantalla anuncia los números precisos de la tabla en vez de intentar interpretar un dibujo. El color nunca es el único portador de significado: cada tono de serie se acompaña de su nombre en la leyenda visible y de una fila completa de valores en la tabla, de modo que una serie es identificable sin percibir su color. Contraste: el texto de la leyenda usa el token de texto primario con al menos 4,5:1 sobre una superficie clara y una oscura, las etiquetas de eje y categoría usan el token atenuado en el mismo umbral, y cada línea de serie supera el 3:1 pedido a un gráfico informativo en ambos esquemas. Las áreas crecen al montar de forma segura para movimiento reducido sin JavaScript: el estado en reposo es el dibujo final, así que SSR, sin-JS y movimiento reducido muestran los valores reales, y la entrada desde la línea base se expresa con la variante @starting-style (starting:) sobre la propiedad estándar scale, anclada a la línea base con transform-box:fill-box y transform-origin:bottom, y motion-reduce:transition-none cae directo en el dibujo final. En modo forced-colors se descartan las áreas de degradado decorativas y las líneas de serie, las líneas de cuadrícula, el eje y cada etiqueta se repintan como CanvasText, así que las tendencias siguen siendo perceptibles mientras los nombres de la leyenda y la tabla sr-only siguen siendo la fuente accesible completa. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/area-chart.tsx",
  Preview: AreaChartPreview,
};
