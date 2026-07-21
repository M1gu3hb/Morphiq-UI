import { AccordionPreview } from "@/registry/previews/accordion-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the accordion component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "accordion",
  name: "Accordion",
  nameEs: "Acordeón",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A composable disclosure list with four material recipes, three treatments and three sizes. Single or multiple panels open, controlled or uncontrolled, with height animated from the content's own size rather than a guessed maximum — and no runtime dependency beyond React.",
  descriptionEs:
    "Una lista desplegable componible con cuatro recetas de material, tres tratamientos y tres tamaños. Uno o varios paneles abiertos, controlada o no controlada, con la altura animada a partir del tamaño real del contenido en vez de un máximo adivinado — y sin más dependencia en tiempo de ejecución que React.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "separated", label: "Separated", labelEs: "Separado" },
    { id: "flush", label: "Flush", labelEs: "Al ras" },
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
    "Each header is a real <button> inside a heading element, so Enter and Space activate it, it sits in the tab order, and screen-reader users get the document outline they navigate by. The heading rank is a prop rather than hardcoded, because only the page knows which level fits its outline. The button carries aria-expanded and aria-controls; the panel is a region with a matching id and aria-labelledby pointing back at its header. Up and Down move between headers with Home and End jumping to the ends, per the APG disclosure pattern; Enter and Space need no custom handling because the trigger is a native button. A collapsed panel stays mounted so its height transition has something to animate, but it is marked inert — removed from the accessibility tree and the tab order — so a keyboard user can never land inside a closed panel. Height animates from grid-template-rows 0fr to 1fr over an overflow-hidden wrapper, which reaches the content's own height without a max-height guess; under prefers-reduced-motion that transition, the chevron rotation and the header wash are all suppressed. In forced-colors mode the item borders and separators switch to system colours so the rows stay delineated once fills are discarded, and the focus ring switches to Highlight. Contrast: heading and body copy both measure at or above 4.5:1 on every material. The lowest is the glass body at 5.14:1 against its own tint composited over the worst-case backdrop; headings never drop below 7.05:1. The flush treatment has no surface of its own and its text lands on the page, where the same tokens measure 6.53:1 or better on the Morphiq paper background and on white.",
  a11yEs:
    "Cada encabezado es un <button> real dentro de un elemento de encabezado, así que Enter y Espacio lo activan, entra en el orden de tabulación y quien usa lector de pantalla obtiene el esquema del documento por el que navega. El rango del encabezado es una prop y no algo fijo, porque solo la página sabe qué nivel encaja en su esquema. El botón lleva aria-expanded y aria-controls; el panel es una región con el id correspondiente y aria-labelledby apuntando de vuelta a su encabezado. Arriba y Abajo se mueven entre encabezados, con Inicio y Fin saltando a los extremos, según el patrón de divulgación de la APG; Enter y Espacio no necesitan manejo propio porque el disparador es un botón nativo. Un panel cerrado sigue montado para que su transición de altura tenga algo que animar, pero se marca inert — fuera del árbol de accesibilidad y del orden de tabulación — así que quien usa teclado nunca puede caer dentro de un panel cerrado. La altura se anima con grid-template-rows de 0fr a 1fr sobre un envoltorio con overflow-hidden, lo que alcanza la altura real del contenido sin adivinar un max-height; bajo prefers-reduced-motion se suprimen esa transición, el giro del chevrón y el lavado del encabezado. En forced-colors los bordes y separadores pasan a colores de sistema para que las filas sigan delimitadas cuando se descartan los rellenos, y el anillo de foco pasa a Highlight. Contraste: el encabezado y el cuerpo miden 4,5:1 o más en cada material. El mínimo es el cuerpo de vidrio con 5,14:1 contra su propio tinte compuesto sobre el peor fondo posible; los encabezados nunca bajan de 7,05:1. El tratamiento al ras no tiene superficie propia y su texto cae sobre la página, donde los mismos tokens miden 6,53:1 o más sobre el fondo papel de Morphiq y sobre blanco.",
  sourcePath: "src/registry/ui/accordion.tsx",
  Preview: AccordionPreview,
};
