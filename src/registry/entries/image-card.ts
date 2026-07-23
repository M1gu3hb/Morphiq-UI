import { ImageCardPreview } from "@/registry/previews/image-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the image-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "image-card",
  name: "Image Card",
  nameEs: "Tarjeta con imagen",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A photo framed by one of four tactile materials, with a semantic title and caption set over the image on a gradient scrim that guarantees the overlay text's contrast no matter what colours are in the picture. Optional stretched link makes the whole card one accessible target.",
  descriptionEs:
    "Una foto enmarcada por uno de cuatro materiales táctiles, con un título semántico y un pie de foto sobre la imagen apoyados en un degradado de oscurecimiento (scrim) que garantiza el contraste del texto superpuesto sin importar los colores de la foto. Un enlace extendido opcional convierte toda la tarjeta en un único destino accesible.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The photo is a real <img> with required, descriptive alt text (a purely decorative image would pass alt=\"\"). The overlay title is a real heading whose rank is overridable via the headingLevel prop, because the correct level depends on the surrounding document outline; the caption is a <p> and an optional timestamp is a <time dateTime>. Legibility of the overlay text never depends on the photo: a gradient scrim tracks the text box so every text pixel sits over a dark backing strong enough that the near-white title and caption clear 4.5:1 against any image. When href is set the whole card becomes a single stretched link — one <a> covering the card, named by the title via aria-labelledby, never nested inside another link or button, and leaving room for inner controls to stay clickable on a higher z-index. The card draws its focus ring on :focus-within so tabbing to that link outlines the card, and on :focus-visible and a data-focus attribute too. Under prefers-reduced-motion the hover lift and image zoom are cancelled while the final state stays legible, and no looping animation runs. In forced-colors mode the shadows and gradient scrim are discarded, so the overlay text switches to CanvasText over a solid Canvas backing and stays readable, a system-coloured border keeps the card's bounds, and the real image is left untouched.",
  a11yEs:
    "La foto es un <img> real con texto alternativo obligatorio y descriptivo (una imagen puramente decorativa usaría alt=\"\"). El título superpuesto es un encabezado real cuyo rango se puede sobrescribir con la prop headingLevel, porque el nivel correcto depende del esquema del documento; el pie de foto es un <p> y una marca de tiempo opcional es un <time dateTime>. La legibilidad del texto superpuesto nunca depende de la foto: un degradado de oscurecimiento sigue la caja de texto para que cada píxel de texto quede sobre un respaldo oscuro suficiente para que el título y el pie casi blancos superen 4,5:1 sobre cualquier imagen. Cuando se define href, toda la tarjeta se convierte en un único enlace extendido: un solo <a> que cubre la tarjeta, nombrado por el título mediante aria-labelledby, nunca anidado dentro de otro enlace o botón, y dejando espacio para que controles internos sigan siendo clicables en una capa superior. La tarjeta dibuja su anillo de foco con :focus-within para que al tabular a ese enlace se resalte la tarjeta, y también con :focus-visible y un atributo data-focus. Con prefers-reduced-motion se cancelan el levantamiento al pasar el cursor y el zoom de la imagen mientras el estado final permanece legible, y no se ejecuta ninguna animación en bucle. En modo forced-colors se descartan las sombras y el degradado, así que el texto superpuesto cambia a CanvasText sobre un respaldo sólido Canvas y sigue siendo legible, un borde con color de sistema mantiene los límites de la tarjeta y la imagen real no se altera.",
  sourcePath: "src/registry/ui/image-card.tsx",
  Preview: ImageCardPreview,
};
