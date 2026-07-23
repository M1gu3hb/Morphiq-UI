import { ProgressBarGroupPreview } from "@/registry/previews/progress-bar-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Progress Bar Group. */
export const entry: RegistryEntry = {
  slug: "progress-bar",
  name: "Progress Bar Group",
  nameEs: "Grupo de Barras de Progreso",
  category: "data",
  materials: ["adaptive"],
  description:
    "A stack of labelled horizontal progress bars driven by an items:{label,value,max?,unit?,tone?}[] prop — each row a label, a recessed track with a filled bar, and the reading as real text — where every bar is a native role=\"progressbar\" and the fill grows on mount from a standalone scale.",
  descriptionEs:
    "Una pila de barras de progreso horizontales etiquetadas, alimentada por una prop items:{label,value,max?,unit?,tone?}[] —cada fila con una etiqueta, una pista hundida con una barra rellena y la lectura como texto real— donde cada barra es un role=\"progressbar\" nativo y el relleno crece al montar desde la propiedad estándar scale.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "Each bar is a native role=\"progressbar\" carrying aria-valuenow, aria-valuemin and aria-valuemax, an aria-valuetext that spells the reading (value of max, with percent), and an accessible name via aria-labelledby pointing at its visible label, so that native semantics — not a decorative drawing — is the authoritative accessible equivalent; the fill div is decoration and the visible value text duplicates aria-valuetext so it is aria-hidden to avoid a double announcement. Color is never the sole carrier of meaning: every row prints its value and max as visible text and is named by its label, so a row reads without perceiving the fill tone at all, and the per-item tone is reinforcement layered on top. Contrast: the value uses the primary text token and the denominator and caption the muted token, each at or above 4.5:1 against a light and a dark surface, and every fill tone clears the 3:1 bar asked of an informative graphic mark against the track in both schemes. Bars grow on mount reduced-motion-safe without JavaScript: a bar's resting scale is its final ratio, so SSR, no-JS and reduced motion all show the true value, and the from-empty entrance is expressed with the @starting-style (starting:) variant on the standalone scale property anchored to the left edge, with motion-reduce:transition-none landing straight on the final size and no setState-driven count-up. In forced-colors mode the fill becomes Highlight over a Canvas track bounded by a CanvasText border, and every label becomes CanvasText, so the proportion and the reading stay perceivable. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "Cada barra es un role=\"progressbar\" nativo que lleva aria-valuenow, aria-valuemin y aria-valuemax, un aria-valuetext que expresa la lectura (valor de máximo, con porcentaje) y un nombre accesible mediante aria-labelledby que apunta a su etiqueta visible, de modo que la semántica nativa —no un dibujo decorativo— es el equivalente accesible autorizado; el div de relleno es decoración y el texto de valor visible duplica aria-valuetext, así que se marca aria-hidden para evitar un doble anuncio. El color nunca es el único portador de significado: cada fila imprime su valor y máximo como texto visible y se nombra por su etiqueta, así que una fila se lee sin percibir el tono de relleno, y el tono por elemento es solo refuerzo. Contraste: el valor usa el token de texto primario y el denominador y el título el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, y cada tono de relleno supera el 3:1 pedido a un gráfico informativo sobre la pista en ambos esquemas. Las barras crecen al montar de forma segura para movimiento reducido sin JavaScript: el escalado en reposo de una barra es su proporción final, así que SSR, sin-JS y movimiento reducido muestran el valor real, y la entrada desde vacío se expresa con la variante @starting-style (starting:) sobre la propiedad estándar scale anclada al borde izquierdo, con motion-reduce:transition-none cayendo directo al tamaño final y sin cuenta ascendente por setState. En modo forced-colors el relleno pasa a Highlight sobre una pista Canvas delimitada por un borde CanvasText, y cada etiqueta a CanvasText, así que la proporción y la lectura siguen siendo perceptibles. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/progress-bar.tsx",
  Preview: ProgressBarGroupPreview,
};
