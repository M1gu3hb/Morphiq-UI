import { FeatureCardPreview } from "@/registry/previews/feature-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the feature card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "feature-card",
  name: "Feature Card",
  nameEs: "Tarjeta de característica",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A single feature told properly: a decorative glyph in a material well, an optional eyebrow, a semantic heading, a description and an optional Learn more link — either as a stretched whole-card link or as the only interactive control on an otherwise inert card.",
  descriptionEs:
    "Una sola característica contada como corresponde: un glifo decorativo en un pozo material, un antetítulo opcional, un encabezado semántico, una descripción y un enlace opcional de Saber más — ya sea como enlace extendido de toda la tarjeta o como el único control interactivo de una tarjeta inerte.",
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
    "Each card is an <article> with a real heading whose rank is set by headingLevel, because the correct level depends on the surrounding document outline and can never be hardcoded. The glyph is pure ornament: its well is aria-hidden, so the icon is never the only carrier of meaning — the title says what the feature is. That well is a fixed box in both axes (size-[var(--mq-well)] with the glyph pinned to var(--mq-icon)), so the card's height is decided before the caller's node paints and nothing shifts on load; there is no <img> in the component, and a caller passing one should give it real alt text. Linking has two shapes and both are correct. By default the whole card is ONE link: a single <a> inside the heading, so the title is its accessible name, with a ::after overlay at inset-0 z-[1] making the entire surface clickable — and the visible \"Learn more\" row is then aria-hidden decoration, because announcing the same destination twice is noise. With stretchLink={false} the card goes inert and the footer becomes the only real <a>, raised on relative z-10 and named \"Learn more about <title>\" through an sr-only span, since the bare words are useless in a list of links. No <a> or <button> is ever nested inside another. Keyboard support is entirely native: Tab reaches the link and Enter follows it; there is no drag, no custom key handling and no focus trap. The stretched card draws its ring on :focus-within as well as :focus-visible so tabbing to the title outlines the whole clickable surface, while the inert card deliberately skips :focus-within so the standalone link is not double-ringed. States are carried by text, never by colour or opacity alone: an unavailable feature drops its link and renders a visible \"Unavailable\" line, and a busy card sets aria-busy plus a polite live region that is present and empty in the DOM from the first render so the announcement actually fires when the text arrives. Under prefers-reduced-motion the entry keyframes, the hover lift, the well rise and the arrow nudge are all switched off while every end state is kept, leaving a fully painted card. In forced-colors mode gradients, translucency, backdrop blur and shadows are cleared, the surface repaints to Canvas/CanvasText with a CanvasText border keeping its bounds, the decorative wash and shimmer are hidden, the unavailable marker uses GrayText, the standalone link uses LinkText, the focus ring uses Highlight, and the disabled dim is dropped so contrast is never eaten by opacity. Contrast: on every material the title, description and the accent-coloured eyebrow measure at or above 4.5:1 against their surface — 6.8:1 on clay, 5.2:1 on glass over a black backdrop (the worst case for a translucent pane), 7.0:1 on skeuo and 9.1:1 / 7.9:1 on adaptive light and dark.",
  a11yEs:
    "Cada tarjeta es un <article> con un encabezado real cuyo rango define headingLevel, porque el nivel correcto depende del esquema del documento y nunca puede fijarse en el código. El glifo es puro ornamento: su pozo lleva aria-hidden, así que el icono jamás es el único portador del significado — el título dice cuál es la característica. Ese pozo es una caja de tamaño fijo en ambos ejes (size-[var(--mq-well)] con el glifo anclado a var(--mq-icon)), de modo que la altura de la tarjeta queda decidida antes de que se pinte el nodo del llamador y nada se desplaza al cargar; el componente no incluye ningún <img>, y quien pase uno debe darle texto alternativo real. El enlazado tiene dos formas y ambas son correctas. Por defecto toda la tarjeta es UN enlace: un único <a> dentro del encabezado, para que el título sea su nombre accesible, con un ::after en inset-0 z-[1] que hace clicable toda la superficie — y entonces la fila visible de \"Learn more\" es decoración aria-hidden, porque anunciar el mismo destino dos veces es ruido. Con stretchLink={false} la tarjeta queda inerte y el pie pasa a ser el único <a> real, elevado con relative z-10 y nombrado \"Learn more about <título>\" mediante un span sr-only, ya que las palabras sueltas son inútiles en una lista de enlaces. Nunca se anida un <a> o un <button> dentro de otro. El soporte de teclado es totalmente nativo: Tab alcanza el enlace y Enter lo sigue; no hay arrastre, ni manejo de teclas propio, ni trampa de foco. La tarjeta extendida dibuja su anillo en :focus-within además de :focus-visible para que tabular al título resalte toda la superficie clicable, mientras que la tarjeta inerte omite :focus-within a propósito para no duplicar el anillo del enlace suelto. Los estados van en texto, nunca solo por color u opacidad: una característica no disponible pierde su enlace y muestra una línea visible \"Unavailable\", y una tarjeta ocupada activa aria-busy más una región aria-live=\"polite\" presente y vacía en el DOM desde el primer render, para que el anuncio se dispare de verdad cuando llegue el texto. Con prefers-reduced-motion se desactivan los fotogramas de entrada, el levantamiento al pasar el ratón, la subida del pozo y el desplazamiento de la flecha, conservando todos los estados finales y dejando la tarjeta completamente pintada. En forced-colors se eliminan degradados, translucidez, desenfoque de fondo y sombras, la superficie se repinta a Canvas/CanvasText con un borde CanvasText que mantiene sus límites, se ocultan el baño decorativo y el destello, el marcador de no disponible usa GrayText, el enlace suelto usa LinkText, el anillo de foco usa Highlight y se descarta el atenuado deshabilitado para que la opacidad no se coma el contraste. Contraste: en cada material el título, la descripción y el antetítulo con color de acento miden 4,5:1 o más contra su superficie — 6,8:1 en clay, 5,2:1 en glass sobre fondo negro (el peor caso de un panel translúcido), 7,0:1 en skeuo y 9,1:1 / 7,9:1 en adaptive claro y oscuro.",
  sourcePath: "src/registry/ui/feature-card.tsx",
  Preview: FeatureCardPreview,
};
