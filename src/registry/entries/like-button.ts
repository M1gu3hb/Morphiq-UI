import { LikeButtonPreview } from "@/registry/previews/like-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the like-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "like-button",
  name: "Like Button",
  nameEs: "Botón de me gusta",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A heart toggle with a live count, uncontrolled by default and fully controllable, across four material recipes and three sizes, with a decorative burst on like and a polite announcement of the new total.",
  descriptionEs:
    "Un interruptor de corazón con un contador en vivo, no controlado por defecto y totalmente controlable, en cuatro recetas de material y tres tamaños, con una explosión decorativa al dar me gusta y un anuncio cortés del nuevo total.",
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
    "A single native <button> exposed as a toggle: aria-pressed reflects the liked state and the accessible name is dynamic (aria-label \"Like\" when off, \"Unlike\" when on). The liked/unliked distinction is never colour alone — it is carried by aria-pressed, the dynamic name, and above all the heart's shape (a filled heart when liked, an outline heart when not) — and the count sits beside it as real, tabular-figure text. After every toggle a polite, atomic live region (present in the DOM before any text arrives) announces the outcome and new total, e.g. \"Liked, 129 likes\" / \"Removed like, 128 likes\", with correct singular/plural. Keyboard support is the native button's: Tab reaches it and Enter or Space activates it. Focus is shown with a 2px offset ring on :focus-visible (mirrored on a data-focus attribute for docs) and is never removed. Under prefers-reduced-motion the celebratory burst is not rendered at all and the heart pop and press travel are dropped, yet the count still updates, the fill still flips, and the pressed inset well still applies instantly on :active so the tactile feedback survives. In forced-colors the surface keeps its bounds with a CanvasText border, the heart glyph uses CanvasText (its filled-vs-outline shape still distinguishes state), the decorative burst is hidden, and the focus ring becomes Highlight. Contrast: every material inherits Button's measured primary tokens (>= 4.5:1) for the label/count, and each material's filled-heart tint (--mq-heart) is chosen to clear 4.5:1 against that same surface (clay #7a0b1c, glass a light rose, skeuo a light salmon, adaptive a bright rose that flips to deep crimson in dark mode).",
  a11yEs:
    "Un único <button> nativo expuesto como interruptor: aria-pressed refleja el estado de me gusta y el nombre accesible es dinámico (aria-label \"Like\" cuando está inactivo, \"Unlike\" cuando está activo). La distinción entre con y sin me gusta nunca es solo color: la transmiten aria-pressed, el nombre dinámico y sobre todo la forma del corazón (relleno con me gusta, contorno sin él), y el contador aparece junto a él como texto real con cifras tabulares. Tras cada cambio, una región viva cortés y atómica (presente en el DOM antes de que llegue cualquier texto) anuncia el resultado y el nuevo total, p. ej. \"Liked, 129 likes\" / \"Removed like, 128 likes\", con el singular/plural correcto. El soporte de teclado es el del botón nativo: Tab lo alcanza y Enter o Espacio lo activan. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (replicado en un atributo data-focus para la documentación) y nunca se elimina. Bajo prefers-reduced-motion la explosión celebratoria no se renderiza y se descartan el rebote del corazón y el recorrido de pulsación, pero el contador se actualiza igual, el relleno cambia igual y el hundimiento interior del estado pulsado se aplica al instante en :active, conservando la respuesta táctil. En forced-colors la superficie mantiene sus límites con un borde CanvasText, el glifo del corazón usa CanvasText (su forma de relleno frente a contorno sigue distinguiendo el estado), la explosión decorativa se oculta y el anillo de foco pasa a Highlight. Contraste: cada material hereda los tokens primarios medidos del Button (>= 4,5:1) para la etiqueta y el contador, y el tinte del corazón relleno de cada material (--mq-heart) se elige para superar 4,5:1 sobre esa misma superficie (clay #7a0b1c, glass un rosa claro, skeuo un salmón claro, adaptive un rosa vivo que pasa a carmesí intenso en modo oscuro).",
  sourcePath: "src/registry/ui/like-button.tsx",
  Preview: LikeButtonPreview,
};
