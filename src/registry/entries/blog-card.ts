import { BlogCardPreview } from "@/registry/previews/blog-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the blog card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "blog-card",
  name: "Blog Card",
  nameEs: "Tarjeta de blog",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A single post preview: a cover image in an aspect-ratio well, a category chip, a semantic heading, an excerpt, and an author and date footer — with a stretched-link pattern so the whole surface leads to the post while the Save toggle stays independently clickable.",
  descriptionEs:
    "Una vista previa de una sola entrada: imagen de portada en un pozo con relación de aspecto, distintivo de categoría, encabezado semántico, extracto y un pie con autor y fecha — con un patrón de enlace extendido para que toda la superficie lleve a la entrada mientras el botón de Guardar sigue siendo clicable de forma independiente.",
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
    "Each card is an <article> whose title is a real heading; the rank is set through headingLevel (default h3) rather than hardcoded, because the correct level depends on the surrounding document outline. When href is set the heading contains a single <a>, so the title text IS the accessible name of the whole-card link, and that <a> carries a transparent ::after overlay at inset-0 z-[1] that makes the entire surface clickable — nothing is ever nested inside it. Every other control sits at relative z-10 ABOVE that overlay so it stays independently clickable and independently focusable: the optional category link and the Save toggle. The category chip is a plain, pointer-events-none span by default, so clicks over it fall through to the card link. The cover is a real <img> with descriptive alt text inside an aspect-[16/10] well that also carries width and height attributes, so the box reserves its exact height before the image arrives and nothing below it shifts on load; the author avatar sits in a fixed-size square well for the same reason and takes alt=\"\" by default because the author's name is adjacent text. The Save control is a real <button> whose state is carried by aria-pressed AND by a different visible label (Save / Saved) AND by a different icon — never by the fill colour alone — with the post title appended as screen-reader-only text so its accessible name is unambiguous; Enter and Space work natively. Every toggle announces through an aria-live=\"polite\" region that is rendered from the first paint, before any text is put into it. The read affordance and the decorative cover sheen are aria-hidden, since the heading link already carries the destination. Under prefers-reduced-motion the entrance rise, the cover sheen, the hover lift, the image zoom and the arrow nudge are all cancelled while their END states remain, so the card is fully rendered and legible without any travel. In forced-colors mode a CanvasText border keeps the card's bounds once shadows and translucency are discarded, the skeuo gradient and the sheen's background-image are cleared, the glass backdrop blur is dropped, glyphs repaint to CanvasText and the Save button falls back to ButtonFace / ButtonText with Highlight / HighlightText when pressed; the focus ring becomes Highlight. Contrast: on every material the title, author, excerpt, date and accent all measure at or above 4.5:1 against the surface, the glass tokens are tinted so that holds over a white and a black backdrop alike, and the accent is verified twice — as text on the card and as the chip's fill under its own foreground.",
  a11yEs:
    "Cada tarjeta es un <article> cuyo título es un encabezado real; el rango se define con headingLevel (h3 por defecto) en vez de fijarse en el código, porque el nivel correcto depende del esquema del documento. Cuando se define href, el encabezado contiene un único <a>, de modo que el texto del título ES el nombre accesible del enlace de toda la tarjeta, y ese <a> lleva una capa ::after transparente en inset-0 z-[1] que hace clicable toda la superficie — nunca se anida nada dentro de él. Cualquier otro control se sitúa en relative z-10 POR ENCIMA de esa capa para seguir siendo clicable y enfocable de forma independiente: el enlace opcional de categoría y el conmutador Guardar. El distintivo de categoría es por defecto un <span> plano con pointer-events-none, así que los clics sobre él pasan al enlace de la tarjeta. La portada es un <img> real con texto alternativo descriptivo dentro de un pozo aspect-[16/10] que además lleva atributos width y height, de forma que la caja reserva su altura exacta antes de que llegue la imagen y nada de lo que hay debajo se desplaza al cargar; el avatar del autor ocupa un pozo cuadrado de tamaño fijo por la misma razón y usa alt=\"\" por defecto porque el nombre del autor está justo al lado como texto. El control Guardar es un <button> real cuyo estado se transmite con aria-pressed Y con una etiqueta visible distinta (Save / Saved) Y con un icono distinto — nunca solo con el color — con el título de la entrada añadido como texto solo para lectores de pantalla para que su nombre accesible sea inequívoco; Enter y Espacio funcionan de forma nativa. Cada cambio se anuncia mediante una región aria-live=\"polite\" presente desde el primer renderizado, antes de que llegue cualquier texto. La llamada a leer y el destello decorativo de la portada son aria-hidden, porque el enlace del encabezado ya lleva el destino. Con prefers-reduced-motion se cancelan la entrada ascendente, el destello, el levantamiento al pasar el ratón, el zoom de la imagen y el desplazamiento de la flecha, conservando sus estados FINALES, así que la tarjeta queda completamente renderizada y legible sin ningún recorrido. En forced-colors, un borde CanvasText mantiene los límites de la tarjeta cuando se descartan sombras y translucidez, se limpian el degradado de skeuo y la imagen de fondo del destello, se elimina el desenfoque del vidrio, los glifos se repintan en CanvasText y el botón Guardar recurre a ButtonFace / ButtonText, con Highlight / HighlightText cuando está pulsado; el anillo de foco pasa a Highlight. Contraste: en cada material el título, el autor, el extracto, la fecha y el acento miden 4,5:1 o más contra la superficie, los tokens de vidrio llevan su propio tinte para que eso se cumpla igual sobre fondo blanco que negro, y el acento se verifica dos veces — como texto sobre la tarjeta y como relleno del distintivo bajo su propio color de primer plano.",
  sourcePath: "src/registry/ui/blog-card.tsx",
  Preview: BlogCardPreview,
};
