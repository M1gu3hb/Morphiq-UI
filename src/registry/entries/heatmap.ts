import { HeatmapPreview } from "@/registry/previews/heatmap-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Heatmap. */
export const entry: RegistryEntry = {
  slug: "heatmap",
  name: "Heatmap",
  nameEs: "Mapa de Calor",
  category: "data",
  materials: ["adaptive"],
  description:
    "A contributions-style grid of intensity cells drawn by hand as inline SVG — a flat {label,value}[] array arranged column-major and bucketed into five discrete levels with a Less→More legend, and a real sr-only table as its accessible equivalent.",
  descriptionEs:
    "Una cuadrícula estilo contribuciones de celdas de intensidad dibujada a mano en SVG en línea —un arreglo plano {label,value}[] dispuesto por columnas y agrupado en cinco niveles discretos con una leyenda Menos→Más— y una tabla sr-only real como su equivalente accesible.",
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
    "The authoritative accessible equivalent is a real sr-only <table>, always rendered: a <caption> names it, a header row labels the Label and Value columns, and one row per datum carries the exact figures via <th scope=\"row\"> and <td>. The decorative SVG grid is aria-hidden, so a screen reader announces the table's precise numbers rather than trying to interpret a drawing. Color is never the sole carrier of meaning: every cell's title spells out its label, its exact value and its intensity level as a word, and the legend labels its ramp Less to More with a word per swatch, so the data reads without perceiving any fill. This is a static display, not an interactive widget, so it exposes no keyboard model; the only motion is a cell's hover outline, expressed with transition-[stroke] and disabled by motion-reduce:transition-none, and nothing draws or grows on mount. Contrast: the row and legend labels use the muted token at or above 4.5:1 against a light and a dark surface, and each of the five discrete fills clears the 3:1 bar asked of an informative mark in both schemes. In forced-colors mode fills are discarded, so filled cells switch to CanvasText and keep a fill-opacity ramp from 0.35 to 1 so the five levels stay distinguishable without color, empty cells drop to Canvas, the hairline and labels become CanvasText and the hover outline becomes Highlight, so bounds and levels persist. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El equivalente accesible autorizado es una <table> sr-only real, siempre renderizada: un <caption> la nombra, una fila de encabezado rotula las columnas Etiqueta y Valor, y una fila por dato lleva las cifras exactas mediante <th scope=\"row\"> y <td>. La cuadrícula SVG decorativa es aria-hidden, así que un lector de pantalla anuncia los números precisos de la tabla en vez de intentar interpretar un dibujo. El color nunca es el único portador de significado: el title de cada celda detalla su etiqueta, su valor exacto y su nivel de intensidad como palabra, y la leyenda rotula su rampa de Menos a Más con una palabra por muestra, así que los datos se leen sin percibir ningún relleno. Es una visualización estática, no un widget interactivo, por lo que no expone modelo de teclado; el único movimiento es el contorno de una celda al pasar el cursor, expresado con transition-[stroke] y desactivado por motion-reduce:transition-none, y nada se dibuja ni crece al montar. Contraste: las etiquetas de fila y leyenda usan el token atenuado con al menos 4,5:1 sobre una superficie clara y una oscura, y cada uno de los cinco rellenos discretos supera el 3:1 pedido a un gráfico informativo en ambos esquemas. En modo forced-colors los rellenos se descartan, así que las celdas con datos pasan a CanvasText y conservan una rampa de fill-opacity de 0,35 a 1 para que los cinco niveles sigan siendo distinguibles sin color, las celdas vacías pasan a Canvas, la línea divisoria y las etiquetas pasan a CanvasText y el contorno al pasar el cursor a Highlight, así que los límites y los niveles se conservan. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/heatmap.tsx",
  Preview: HeatmapPreview,
};
