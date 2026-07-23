import { ExpandableCardPreview } from "@/registry/previews/expandable-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Expandable Card. */
export const entry: RegistryEntry = {
  slug: "expandable-card",
  name: "Expandable Card",
  nameEs: "Tarjeta Expandible",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A disclosure card with four material recipes: an always-visible heading and a native trigger button reveal an expandable region using the CSS grid 0fr→1fr height trick, animating any natural content height without measuring it, and collapsing to instant under reduced motion.",
  descriptionEs:
    "Una tarjeta de divulgación con cuatro recetas de material: un encabezado siempre visible y un botón nativo revelan una región expandible con el truco de altura de grid CSS 0fr→1fr, animando cualquier altura natural de contenido sin medirla, y colapsando a instantáneo con movimiento reducido.",
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
    "The card title is a real heading whose rank is set through the headingLevel prop, because the correct rank depends on the surrounding document outline; it wraps a native <button> that carries aria-expanded and aria-controls pointing at the region id, exactly the APG disclosure pattern, so Enter and Space toggle it natively and the keyboard focus lands on a real control. The collapsed region is inert, which removes its content from the tab order and the accessibility tree while the CSS grid 0fr→1fr height animation still runs, so a screen reader never encounters clipped hidden content. The open/closed state is never carried by colour alone: aria-expanded exposes it programmatically and a ChevronDown rotates as a shape cue. Focus is visible through a real focus-visible ring on the trigger, and a documentation surface can synthesise the same look with data-focus on the card via a scoped group. Under prefers-reduced-motion the height and chevron transitions become instant with motion-reduce:transition-none while the final open or closed state is preserved, and no looping animation runs. In forced-colors mode shadows and translucency are discarded, a CanvasText border keeps the card's bounds, the reveal divider falls back to CanvasText, and the focus ring becomes the system Highlight. Contrast: on every filled material both the heading and the muted summary and body measure at or above 4.5:1 against the surface, and the glass recipe carries its own tint so that holds over a white and a black backdrop alike.",
  a11yEs:
    "El título de la tarjeta es un encabezado real cuyo rango se fija con la prop headingLevel, porque el rango correcto depende del esquema del documento; envuelve un <button> nativo que lleva aria-expanded y aria-controls apuntando al id de la región, exactamente el patrón de divulgación de APG, así que Enter y Espacio lo alternan de forma nativa y el foco de teclado cae en un control real. La región colapsada es inert, lo que retira su contenido del orden de tabulación y del árbol de accesibilidad mientras la animación de altura de grid CSS 0fr→1fr sigue funcionando, de modo que un lector de pantalla nunca encuentra contenido oculto recortado. El estado abierto o cerrado nunca se transmite solo por color: aria-expanded lo expone de forma programática y un ChevronDown rota como señal de forma. El foco es visible mediante un anillo focus-visible real en el disparador, y una superficie de documentación puede sintetizar el mismo aspecto con data-focus en la tarjeta a través de un grupo con alcance. Bajo prefers-reduced-motion las transiciones de altura y del chevron se vuelven instantáneas con motion-reduce:transition-none mientras se conserva el estado final abierto o cerrado, y ninguna animación en bucle se ejecuta. En forced-colors se descartan sombras y translucidez, un borde CanvasText mantiene los límites de la tarjeta, el divisor de la revelación recurre a CanvasText y el anillo de foco pasa a ser el Highlight del sistema. Contraste: en cada material con relleno, tanto el encabezado como el resumen y el cuerpo atenuados miden 4,5:1 o más contra la superficie, y la receta de vidrio lleva su propio tinte para que eso se cumpla igual sobre fondo blanco que negro.",
  sourcePath: "src/registry/ui/expandable-card.tsx",
  Preview: ExpandableCardPreview,
};
