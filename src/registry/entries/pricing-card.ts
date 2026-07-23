import { PricingCardPreview } from "@/registry/previews/pricing-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the pricing-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "pricing-card",
  name: "Pricing Card",
  nameEs: "Tarjeta de precios",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A single plan card with four material recipes: a semantic heading, a price with billing period, a checked feature list, and one call to action. The featured plan is marked by a 'Most popular' badge and a stronger elevation, never by colour alone.",
  descriptionEs:
    "Una tarjeta de un solo plan con cuatro recetas de material: un encabezado semántico, un precio con periodo de facturación, una lista de características con marcas de verificación y una única llamada a la acción. El plan destacado se marca con una insignia 'Más popular' y una elevación más fuerte, nunca solo con color.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "featured", label: "Featured", labelEs: "Destacado" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a semantic <article> labelled by the plan heading. The plan name is a real heading whose rank is overridable via the headingLevel prop, because the correct level depends on the surrounding document outline. The price is text (amount plus period), and the features are a real <ul>/<li> list where each check icon is decorative (aria-hidden) so the feature text alone carries the meaning. The call to action is a real <button>, or an <a> when an href is given, with an accessible name; it is never nested inside another link or button, and it sits on its own z-layer so it is always the clickable target. The featured state is never signalled by colour alone: a visible 'Most popular' badge (text plus a decorative icon) states it in the reading order, and a stronger elevation raises the card, so the emphasis reaches both sighted and assistive-tech users. Focus is visible: the card outlines on :focus-within (and on a data-focus attribute for documentation) so tabbing to the CTA rings the card, while the CTA carries its own :focus-visible ring. Motion is suppressed under prefers-reduced-motion, where the hover lift and press are cancelled with no looping animation. In forced-colors mode shadows and translucency are discarded, a system-coloured border keeps the card's bounds, the badge keeps a border and system text, and focus maps to Highlight. Contrast: on every filled material the heading, price, description and feature text measure at or above 4.5:1 against the surface, and the glass recipe carries its own tint so that holds over a white and a black backdrop alike.",
  a11yEs:
    "Renderiza un <article> semántico etiquetado por el encabezado del plan. El nombre del plan es un encabezado real cuyo rango se puede cambiar con la propiedad headingLevel, porque el nivel correcto depende del esquema del documento. El precio es texto (importe más periodo) y las características son una lista real <ul>/<li> donde cada icono de verificación es decorativo (aria-hidden), de modo que el texto de la característica por sí solo transmite el significado. La llamada a la acción es un <button> real, o un <a> cuando se indica un href, con un nombre accesible; nunca se anida dentro de otro enlace o botón y se sitúa en su propia capa z para ser siempre el objetivo clicable. El estado destacado nunca se señala solo con color: una insignia visible 'Más popular' (texto más un icono decorativo) lo indica en el orden de lectura, y una elevación más fuerte eleva la tarjeta, así la énfasis llega tanto a personas videntes como a usuarios de tecnología de asistencia. El foco es visible: la tarjeta se resalta en :focus-within (y con un atributo data-focus para la documentación) al tabular hacia el CTA, mientras que el CTA lleva su propio anillo :focus-visible. El movimiento se suprime bajo prefers-reduced-motion, donde se cancelan la elevación al pasar el cursor y la pulsación sin ninguna animación en bucle. En forced-colors se descartan sombras y translucidez, un borde con color de sistema mantiene los límites de la tarjeta, la insignia conserva un borde y texto de sistema, y el foco se asigna a Highlight. Contraste: en cada material con relleno, el encabezado, el precio, la descripción y el texto de características miden 4,5:1 o más contra la superficie, y la receta de vidrio lleva su propio tinte para que eso se cumpla igual sobre fondo blanco que negro.",
  sourcePath: "src/registry/ui/pricing-card.tsx",
  Preview: PricingCardPreview,
};
