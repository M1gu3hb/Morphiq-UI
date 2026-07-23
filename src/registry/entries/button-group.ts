import { ButtonGroupPreview } from "@/registry/previews/button-group-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the button-group component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "button-group",
  name: "Button Group",
  nameEs: "Grupo de botones",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A segmented toolbar of native buttons sharing one surface and border, with roving-tabindex keyboard navigation, four material press recipes, two orientations, and three sizes.",
  descriptionEs:
    "Una barra de herramientas segmentada de botones nativos que comparten una superficie y un borde, con navegación por teclado de tabulación itinerante, cuatro recetas de material con física de pulsación, dos orientaciones y tres tamaños.",
  variants: [
    { id: "horizontal", label: "Horizontal", labelEs: "Horizontal" },
    { id: "vertical", label: "Vertical", labelEs: "Vertical" },
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
    "Renders a role=\"toolbar\" container that takes a required accessible name (aria-label or aria-labelledby) and an aria-orientation, wrapping native <button> members. Focus moves with a roving tabindex: exactly one member is tabbable at a time, ArrowRight/ArrowLeft (horizontal) or ArrowDown/ArrowUp (vertical) move focus between enabled members, and Home/End jump to the first and last; disabled members are skipped and the tab stop follows the last-focused member. Each member is a real <button> carrying its own accessible name — visible text, or a forwarded aria-label for icon-only members — and keeps native Enter/Space activation and the :disabled state for free. Focus is shown with a 2px offset outline on :focus-visible (mirrored on data-focus for docs) and is never removed; the focused member is raised above its neighbours so the ring is never clipped by the shared, negative-margin-collapsed border. A member may opt into aria-pressed to act as a selectable toolbar control: its selected state is carried by an inset pressed depth and, under forced-colors, a system Highlight fill — never by colour alone — alongside whatever icon or text the caller supplies. Under prefers-reduced-motion the hover lift and press travel are dropped, but the pressed inset well is still applied instantly, so the tactile feedback survives. In forced-colors mode fills and shadows are discarded while the member bounds are kept with a CanvasText border and the focus ring uses Highlight. Every material's label meets at least 4.5:1 contrast.",
  a11yEs:
    "Renderiza un contenedor con role=\"toolbar\" que requiere un nombre accesible (aria-label o aria-labelledby) y una aria-orientation, envolviendo miembros <button> nativos. El foco se mueve con tabulación itinerante: exactamente un miembro es tabulable a la vez, ArrowRight/ArrowLeft (horizontal) o ArrowDown/ArrowUp (vertical) mueven el foco entre los miembros habilitados, y Home/End saltan al primero y al último; los miembros deshabilitados se omiten y la parada de tabulación sigue al último miembro enfocado. Cada miembro es un <button> real con su propio nombre accesible — texto visible o un aria-label reenviado para miembros con solo icono — y conserva la activación nativa con Enter/Espacio y el estado :disabled sin coste. El foco se muestra con un contorno de 2px con desplazamiento en :focus-visible (reflejado en data-focus para la documentación) y nunca se elimina; el miembro enfocado se eleva por encima de sus vecinos para que el anillo no lo recorte el borde compartido colapsado con margen negativo. Un miembro puede optar por aria-pressed para actuar como control seleccionable: su estado seleccionado se transmite mediante una profundidad de pulsación hundida y, bajo forced-colors, un relleno de sistema Highlight — nunca solo por color — junto al icono o texto que aporte el consumidor. Bajo prefers-reduced-motion se elimina el desplazamiento de hover y pulsación, pero el pozo hundido de la pulsación se aplica al instante, de modo que la retroalimentación táctil se conserva. En modo forced-colors se descartan rellenos y sombras mientras los límites del miembro se mantienen con un borde CanvasText y el anillo de foco usa Highlight. La etiqueta de cada material cumple un contraste de al menos 4,5:1.",
  sourcePath: "src/registry/ui/button-group.tsx",
  Preview: ButtonGroupPreview,
};
