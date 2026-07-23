import { VoteButtonsPreview } from "@/registry/previews/vote-buttons-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the vote-buttons component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "vote-buttons",
  name: "Vote Buttons",
  nameEs: "Botones de voto",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A forum-style up/down voter with a live score between two mutually exclusive toggles, across four material recipes and three sizes, where flipping a vote moves the total by two.",
  descriptionEs:
    "Un votador de foro con puntuación en vivo entre dos interruptores mutuamente excluyentes, en cuatro recetas de material y tres tamaños, donde cambiar el voto mueve el total en dos.",
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
    "Two real native <button>s sit in a recessed well, each with a distinct required accessible name (aria-label, default \"Upvote\" / \"Downvote\") and aria-pressed that reflects whether that direction is active; the pair is wrapped in a role=\"group\" with its own aria-label (default \"Vote\"). The two directions are mutually exclusive toggles: pressing up while down is active flips the running total by two. Direction is carried by the ArrowBigUp / ArrowBigDown glyph and the label, never by colour; the active (voted) state is carried by an outline-to-solid icon FILL change, a scale, a pressed-in inset well and aria-pressed — never by colour alone. The score is real text inside an aria-live=\"polite\", aria-atomic region that is present before any change and announces the new total (a visually hidden \"Score \" prefix makes it read \"Score 42\"); the digits use tabular figures so the layout never jumps. Keyboard: Enter and Space toggle each button natively. Focus is shown with a 2px offset ring on :focus-visible (and a parallel data-focus hook for docs) and is never removed with outline-none. Under prefers-reduced-motion the hover lift, press travel and the score bump are dropped, but the pressed inset still applies instantly on :active so the tactile feedback is preserved. In forced-colors the surfaces keep their bounds with a CanvasText border, a voted key takes a Highlight fill with a HighlightText glyph, the focus ring becomes Highlight, and arrows fall back to CanvasText. Contrast: every arrow inherits Button's measured primary tokens (>= 4.5:1) on its surface, each active accent is contrast-checked on that surface, and the score pairs a dark ink with the lighter well (or the reverse in adaptive dark) so it stays >= 4.5:1.",
  a11yEs:
    "Dos <button> nativos reales se alojan en un pozo hundido, cada uno con un nombre accesible obligatorio y distinto (aria-label, por defecto \"Upvote\" / \"Downvote\") y aria-pressed que refleja si esa dirección está activa; el par se envuelve en un role=\"group\" con su propio aria-label (por defecto \"Vote\"). Las dos direcciones son interruptores mutuamente excluyentes: pulsar arriba mientras abajo está activo mueve el total en dos. La dirección la transmiten el glifo ArrowBigUp / ArrowBigDown y la etiqueta, nunca el color; el estado activo (votado) lo transmiten un cambio de RELLENO del icono de contorno a sólido, una escala, un pozo interior hundido y aria-pressed, nunca solo el color. La puntuación es texto real dentro de una región aria-live=\"polite\", aria-atomic presente antes de cualquier cambio y que anuncia el nuevo total (un prefijo \"Score \" oculto visualmente hace que se lea \"Score 42\"); las cifras usan números tabulares para que el diseño no salte. Teclado: Enter y Espacio alternan cada botón de forma nativa. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (y un gancho data-focus paralelo para la documentación) y nunca se elimina con outline-none. Bajo prefers-reduced-motion se descartan la elevación al pasar, el recorrido de pulsación y el rebote de la puntuación, pero el hundimiento interior se aplica al instante en :active, conservando la respuesta táctil. En forced-colors las superficies mantienen sus límites con un borde CanvasText, una tecla votada toma un relleno Highlight con un glifo HighlightText, el anillo de foco pasa a Highlight y las flechas recurren a CanvasText. Contraste: cada flecha hereda los tokens primarios medidos del Button (>= 4,5:1) sobre su superficie, cada acento activo se verifica sobre esa superficie, y la puntuación combina una tinta oscura con el pozo más claro (o al revés en adaptive oscuro) para mantenerse >= 4,5:1.",
  sourcePath: "src/registry/ui/vote-buttons.tsx",
  Preview: VoteButtonsPreview,
};
