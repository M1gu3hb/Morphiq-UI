import { NotificationCardPreview } from "@/registry/previews/notification-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the notification-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "notification-card",
  name: "Notification Card",
  nameEs: "Tarjeta de notificación",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A compact notification surface with four material recipes: a leading avatar or tone icon, an actor heading, a message, a machine-readable timestamp, and accept/dismiss actions where the tone is carried by an icon and a text label rather than colour.",
  descriptionEs:
    "Una superficie de notificación compacta con cuatro recetas de material: un avatar o icono de tono al frente, un encabezado del actor, un mensaje, una marca de tiempo legible por máquina y acciones de aceptar/descartar donde el tono se transmite mediante un icono y una etiqueta de texto, no por color.",
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
    "Renders a semantic <article>. The actor is a real heading whose rank is overridable via the headingLevel prop, because the correct level depends on the surrounding document outline, and the article is named by that heading with aria-labelledby. The tone (info/success/warning) is conveyed by both an icon shape and a visible text label, never by colour alone, and the tone icon uses currentColor so it survives forced-colors as CanvasText. The timestamp is a <time dateTime> so it is machine-readable; the leading avatar is an <img> with real alt text (an empty alt marks it decorative). Accept and dismiss are real <button> elements with accessible names supplied through aria-label. Because this is a container that holds its own controls rather than a whole-clickable card, it deliberately does not draw a :focus-within ring, so tabbing between the buttons never double-outlines the card; each button carries its own visible focus-visible ring, and the card keeps a focus-visible/data-focus ring for when it is itself focused. Passing live opts the card into a polite role=\"status\" region so a notification that arrives dynamically is announced. Motion is suppressed under prefers-reduced-motion, and a system-coloured border keeps the card's bounds and the tone icon's meaning visible in forced-colors mode, where shadows and translucency are discarded. Contrast: on every filled material the actor, message and muted meta measure at or above 4.5:1 against the surface, and the glass recipe carries its own tint so that holds over a light and a dark backdrop alike.",
  a11yEs:
    "Renderiza un <article> semántico. El actor es un encabezado real cuyo rango se puede sobrescribir mediante la propiedad headingLevel, porque el nivel correcto depende del esquema del documento circundante, y el artículo se nombra con ese encabezado mediante aria-labelledby. El tono (info/success/warning) se transmite tanto con la forma de un icono como con una etiqueta de texto visible, nunca solo por color, y el icono de tono usa currentColor para sobrevivir en forced-colors como CanvasText. La marca de tiempo es un <time dateTime> para que sea legible por máquina; el avatar al frente es un <img> con texto alt real (un alt vacío lo marca como decorativo). Aceptar y descartar son elementos <button> reales con nombres accesibles proporcionados mediante aria-label. Como es un contenedor que alberga sus propios controles y no una tarjeta enteramente clicable, deliberadamente no dibuja un anillo :focus-within, así que tabular entre los botones nunca duplica el contorno de la tarjeta; cada botón lleva su propio anillo focus-visible visible, y la tarjeta conserva un anillo focus-visible/data-focus para cuando ella misma recibe el foco. Pasar live activa una región role=\"status\" cortés para que una notificación que llega dinámicamente sea anunciada. El movimiento se suprime bajo prefers-reduced-motion, y un borde con color de sistema mantiene visibles los límites de la tarjeta y el significado del icono de tono en forced-colors, donde se descartan sombras y translucidez. Contraste: en cada material con relleno, el actor, el mensaje y la meta atenuada miden 4,5:1 o más contra la superficie, y la receta de vidrio lleva su propio tinte para que eso se cumpla igual sobre fondo claro que oscuro.",
  sourcePath: "src/registry/ui/notification-card.tsx",
  Preview: NotificationCardPreview,
};
