import { FlipCardPreview } from "@/registry/previews/flip-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the flip-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "flip-card",
  name: "Flip Card",
  nameEs: "Tarjeta giratoria",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A two-sided card that turns in real 3D to reveal its back on hover, on keyboard focus, and on an explicit tap toggle, with all four material recipes on both faces and a reduced-motion cross-fade.",
  descriptionEs:
    "Una tarjeta de dos caras que gira en 3D real para revelar su reverso al pasar el cursor, al recibir foco de teclado y con un botón de giro para tocar, con las cuatro recetas de material en ambas caras y un fundido cruzado para movimiento reducido.",
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
    "Built from semantic HTML: FlipCardTitle renders a real heading whose rank is overridable via the level prop so it can match the document outline, the demo cover is an <img> with descriptive alt text, the back's facts are a <ul>, the timestamp is a <time dateTime>, and every action is a real <button> or <a> with an accessible name. Both faces are always in the DOM and are never display:none, so a control on the hidden back face stays in the tab order — tabbing to it flips the card into view because the whole card turns on :focus-within as well as on hover and on an explicit toggle <button>, and the focus ring is drawn on :focus-within (and forced-colors Highlight) so keyboard focus is always visible. The flip toggle is a real button carrying aria-pressed for its turned state and aria-describedby pointing at a visually-hidden hint that explains the two-sided affordance, so the interaction is never signalled by motion or colour alone. No <a> or <button> is nested inside another. Under prefers-reduced-motion the 3D rotation is replaced by an opacity cross-fade with both faces staying fully legible and no looping animation. In forced-colors mode shadows and the frosted backdrop are discarded while a system-coloured border keeps each face's bounds. Contrast: on every material both the title and the muted text measure at or above 4.5:1 against the surface, including the glass recipe over light and dark backdrops alike.",
  a11yEs:
    "Construida con HTML semántico: FlipCardTitle renderiza un encabezado real cuyo rango es ajustable mediante la prop level para encajar con el esquema del documento, la portada de ejemplo es un <img> con texto alternativo descriptivo, los datos del reverso son una <ul>, la marca de tiempo es un <time dateTime> y cada acción es un <button> o <a> real con nombre accesible. Ambas caras están siempre en el DOM y nunca en display:none, así que un control de la cara oculta permanece en el orden de tabulación: al tabular hacia él la tarjeta se gira para mostrarlo porque toda la tarjeta gira en :focus-within además de con el cursor y con un <button> de giro explícito, y el anillo de foco se dibuja en :focus-within (y con Highlight en forced-colors) para que el foco de teclado siempre sea visible. El botón de giro es un botón real con aria-pressed para su estado girado y aria-describedby que apunta a una pista oculta visualmente que explica la naturaleza de dos caras, de modo que la interacción nunca se señala solo con movimiento o color. Ningún <a> ni <button> se anida dentro de otro. Bajo prefers-reduced-motion la rotación 3D se sustituye por un fundido cruzado de opacidad con ambas caras plenamente legibles y sin animación en bucle. En forced-colors se descartan sombras y el fondo esmerilado mientras un borde con color de sistema mantiene los límites de cada cara. Contraste: en cada material tanto el título como el texto atenuado miden 4,5:1 o más contra la superficie, incluida la receta de vidrio sobre fondos claros y oscuros por igual.",
  sourcePath: "src/registry/ui/flip-card.tsx",
  Preview: FlipCardPreview,
};
