import { DataTablePreview } from "@/registry/previews/data-table-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Data Table. */
export const entry: RegistryEntry = {
  slug: "data-table",
  name: "Data Table",
  nameEs: "Tabla de Datos",
  category: "data",
  materials: ["adaptive"],
  description:
    "A real, sortable HTML table with a caption, scoped headers, zebra striping and an optional sticky header. Each sortable column exposes live aria-sort and a keyboard-operable sort button that cycles ascending, descending and unsorted; the sort is a stable comparator tie-broken by input order. Material-agnostic single style that adapts to light and dark.",
  descriptionEs:
    "Una tabla HTML real y ordenable con leyenda, encabezados con scope, filas cebra y un encabezado fijo opcional. Cada columna ordenable expone aria-sort en vivo y un botón de orden operable por teclado que alterna ascendente, descendente y sin orden; el orden usa un comparador estable con desempate por el orden de entrada. Estilo único agnóstico al material que se adapta a claro y oscuro.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Built on native table semantics, so the visual and the accessible structure are the same object: a real <table> with a <caption> that names it (shown, or exposed only to assistive tech via an sr-only class), a <thead>/<tbody> split, <th scope=\"col\"> on every column header and <th scope=\"row\"> on the row-header column. Every sortable column carries the live aria-sort state (ascending, descending or none) on its header cell, and its sort control is a genuine <button>, so Tab reaches it and Enter or Space cycles ascending, descending and unsorted; the button's accessible name spells out the column and its current direction (\"Sort by <column>, sorted ascending\"). Sort direction is shown by the shape of an arrow-up, arrow-down or neutral chevron glyph paired with aria-sort, never by colour alone, and the glyph is aria-hidden because the state is already carried in text. The comparator is deterministic — numeric columns compare as numbers, others via localeCompare — and stable, tie-broken by original input order. The sort buttons show a visible focus ring on :focus-visible. Zebra striping and the hover tint are decorative background fills; the data reads without them. A sticky header keeps an opaque background so it covers rows as they scroll beneath it. Colours adapt to the light and dark scheme, and body text, header text and the visible caption all measure at or above 4.5:1 against their surfaces. Under prefers-reduced-motion the colour transitions are removed, and in forced-colors mode fills are discarded while system-coloured borders keep every bound and the sort glyph is drawn in CanvasText.",
  a11yEs:
    "Construida sobre semántica nativa de tabla, así que lo visual y la estructura accesible son el mismo objeto: una <table> real con una <caption> que la nombra (visible, o expuesta solo a tecnologías de asistencia mediante una clase sr-only), separación <thead>/<tbody>, <th scope=\"col\"> en cada encabezado de columna y <th scope=\"row\"> en la columna de encabezado de fila. Cada columna ordenable lleva el estado aria-sort en vivo (ascending, descending o none) en su celda de encabezado, y su control de orden es un <button> genuino, de modo que Tab lo alcanza y Enter o Espacio alternan ascendente, descendente y sin orden; el nombre accesible del botón detalla la columna y su dirección actual (\"Ordenar por <columna>, orden ascendente\"). La dirección del orden se muestra por la forma de un glifo de flecha arriba, flecha abajo o galón neutro junto con aria-sort, nunca solo por color, y el glifo es aria-hidden porque el estado ya va en texto. El comparador es determinista — las columnas numéricas comparan como números, las demás con localeCompare — y estable, con desempate por el orden de entrada original. Los botones de orden muestran un anillo de foco visible en :focus-visible. Las filas cebra y el tinte de hover son rellenos decorativos; los datos se leen sin ellos. Un encabezado fijo mantiene un fondo opaco para cubrir las filas que se desplazan bajo él. Los colores se adaptan al esquema claro y oscuro, y el texto del cuerpo, el de los encabezados y la leyenda visible miden 4,5:1 o más contra sus superficies. Bajo prefers-reduced-motion se eliminan las transiciones de color, y en forced-colors se descartan los rellenos mientras bordes con color de sistema mantienen cada límite y el glifo de orden se dibuja en CanvasText.",
  sourcePath: "src/registry/ui/data-table.tsx",
  Preview: DataTablePreview,
};
