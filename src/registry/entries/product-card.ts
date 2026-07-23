import { ProductCardPreview } from "@/registry/previews/product-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the product card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "product-card",
  name: "Product Card",
  nameEs: "Tarjeta de producto",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A commerce card with an image, a semantic heading, price, a star rating whose value is carried in text, and a real Add-to-cart button — with a stretched-link pattern so the whole surface can lead to the product without trapping the button.",
  descriptionEs:
    "Una tarjeta de comercio con imagen, encabezado semántico, precio, una valoración de estrellas cuyo valor va en texto y un botón real de Añadir al carrito — con un patrón de enlace extendido para que toda la superficie lleve al producto sin atrapar el botón.",
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
    "The product image is a real <img> with descriptive alt text (decorative flags on it are hidden). The title is a semantic heading whose rank is overridable via headingLevel because the correct level depends on the surrounding document outline. The rating is conveyed by TEXT, never by star-count or gold colour alone: the visible \"4.5 · 128 reviews\" carries the value and count, the numeric value also exposes an aria-label (\"Rated 4.5 of 5\"), and the gold stars are aria-hidden decoration clipped to the exact fractional fill. The Add control is a real <button> with an accessible name that contains its visible label (\"Add … to cart\"), its icon hidden. When href is set the whole card becomes ONE link via the stretched-link pattern — a single title <a> whose ::after overlay covers the card — and the Add button is raised on relative z-10 so it stays independently clickable and focusable; no <a> or <button> is ever nested inside another. Interactive cards draw the focus ring on :focus-within as well as :focus-visible, so tabbing to the link or the button outlines the whole card; inert cards skip that to avoid double-ringing the button. The badge and featured flags are text, so no state is signalled by colour alone. The hover lift and image zoom are suppressed under prefers-reduced-motion, and a system-coloured border keeps the card's bounds visible in forced-colors mode, where shadows and translucency are discarded and the Add button falls back to ButtonFace/ButtonText. Contrast: on every material the title, price and muted review text measure at or above 4.5:1 against the surface, and the glass recipe carries its own tint so that holds over a white and a black backdrop alike.",
  a11yEs:
    "La imagen del producto es un <img> real con texto alternativo descriptivo (los distintivos decorativos sobre ella se ocultan). El título es un encabezado semántico cuyo rango es configurable mediante headingLevel, porque el nivel correcto depende del esquema del documento. La valoración se transmite por TEXTO, nunca solo por el número de estrellas ni por el color dorado: el visible \"4.5 · 128 reviews\" lleva el valor y el conteo, el valor numérico además expone un aria-label (\"Rated 4.5 of 5\"), y las estrellas doradas son decoración aria-hidden recortada a la fracción exacta de relleno. El control de Añadir es un <button> real con un nombre accesible que contiene su etiqueta visible (\"Add … to cart\"), con su icono oculto. Cuando se define href, toda la tarjeta se convierte en UN enlace mediante el patrón de enlace extendido — un único <a> del título cuyo ::after cubre la tarjeta — y el botón de Añadir se eleva con relative z-10 para seguir siendo clicable y enfocable de forma independiente; nunca se anida un <a> o <button> dentro de otro. Las tarjetas interactivas dibujan el anillo de foco tanto en :focus-within como en :focus-visible, así que tabular al enlace o al botón resalta toda la tarjeta; las tarjetas inertes lo omiten para no duplicar el anillo del botón. El distintivo y las marcas destacadas son texto, así que ningún estado se señala solo con color. El levantamiento al pasar el ratón y el zoom de la imagen se suprimen bajo prefers-reduced-motion, y un borde con color de sistema mantiene visibles los límites de la tarjeta en forced-colors, donde se descartan sombras y translucidez y el botón de Añadir recurre a ButtonFace/ButtonText. Contraste: en cada material el título, el precio y el texto atenuado de reseñas miden 4,5:1 o más contra la superficie, y la receta de vidrio lleva su propio tinte para que eso se cumpla igual sobre fondo blanco que negro.",
  sourcePath: "src/registry/ui/product-card.tsx",
  Preview: ProductCardPreview,
};
