import { DonutChartPreview } from "@/registry/previews/donut-chart-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Donut Chart. */
export const entry: RegistryEntry = {
  slug: "donut-chart",
  name: "Donut Chart",
  nameEs: "Gráfico de Anillo",
  category: "data",
  materials: ["adaptive"],
  description:
    "A ring chart drawn by hand as inline SVG — each slice a concentric circle carved with a normalized stroke-dasharray and placed by a cumulative rotation — with a text total at its centre, a value-and-percent legend, and a real sr-only table as its accessible equivalent.",
  descriptionEs:
    "Un gráfico de anillo dibujado a mano en SVG en línea —cada porción es un círculo concéntrico recortado con un stroke-dasharray normalizado y colocado mediante una rotación acumulada— con un total en texto en el centro, una leyenda con valor y porcentaje, y una tabla sr-only real como su equivalente accesible.",
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered: a <caption> names it, a header row labels the Category, Value and Share columns, one row per datum carries the exact figures via <th scope=\"row\"> and <td>, and a <tfoot> row carries the total. The decorative SVG ring and the visible legend are aria-hidden, so a screen reader announces the table's precise numbers and percentages rather than interpreting a drawing, and the legend is not double-announced. Color is never the sole carrier of meaning: the centre prints the total as text and every legend row pairs its colour swatch with the category label, the numeric value and the percent share, all as text, so the data reads without perceiving any hue. Contrast: the centre value and legend label and value use the primary text token while the caption and percent use the muted token, each at or above 4.5:1 against a light and a dark surface, and each slice colour clears the 3:1 bar asked of an informative graphic in both schemes. Slices draw on mount reduced-motion-safe without JavaScript: a slice's resting dash is its final arc, so SSR, no-JS and reduced motion all show the true share, and the from-nothing entrance is expressed with the @starting-style (starting:) variant as a constant stroke-dasharray of 0 1 growing to the resting dash, with a matching transition-[stroke-dasharray] and motion-reduce:transition-none landing straight on the final ring. In forced-colors mode the decorative track is dropped, every slice repaints to CanvasText with the largest slice marked in Highlight, and the legend text and swatch outlines become CanvasText, with the largest swatch outlined in Highlight, so the shares stay perceivable. Every figure is a prop and percentages are computed deterministically, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada: un <caption> la nombra, una fila de encabezado rotula las columnas Categoría, Valor y Proporción, una fila por dato lleva las cifras exactas mediante <th scope=\"row\"> y <td>, y una fila <tfoot> lleva el total. El anillo SVG decorativo y la leyenda visible son aria-hidden, así que un lector de pantalla anuncia los números y porcentajes precisos de la tabla en vez de interpretar un dibujo, y la leyenda no se anuncia dos veces. El color nunca es el único portador de significado: el centro imprime el total como texto y cada fila de la leyenda acompaña su muestra de color con la etiqueta de categoría, el valor numérico y la proporción en porcentaje, todo como texto, así que los datos se leen sin percibir ningún tono. Contraste: el valor del centro y la etiqueta y el valor de la leyenda usan el token de texto primario mientras que el subtítulo y el porcentaje usan el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, y cada color de porción supera el 3:1 pedido a un gráfico informativo en ambos esquemas. Las porciones se dibujan al montar de forma segura para movimiento reducido sin JavaScript: el trazo en reposo de una porción es su arco final, así que SSR, sin-JS y movimiento reducido muestran la proporción real, y la entrada desde la nada se expresa con la variante @starting-style (starting:) como un stroke-dasharray constante de 0 1 que crece hasta el trazo en reposo, con un transition-[stroke-dasharray] correspondiente y motion-reduce:transition-none que cae directo en el anillo final. En modo forced-colors se descarta la pista decorativa, cada porción se repinta a CanvasText con la porción mayor marcada en Highlight, y el texto de la leyenda y los contornos de las muestras pasan a CanvasText, con la muestra mayor contorneada en Highlight, para que las proporciones sigan siendo perceptibles. Cada cifra es una prop y los porcentajes se calculan de forma determinista, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/donut-chart.tsx",
  Preview: DonutChartPreview,
};
