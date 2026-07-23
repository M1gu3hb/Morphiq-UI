import { SegmentedProgressPreview } from "@/registry/previews/segmented-progress-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Segmented Progress. */
export const entry: RegistryEntry = {
  slug: "segmented-progress",
  name: "Segmented Progress",
  nameEs: "Progreso segmentado",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "A compact discrete-progress readout: a bar split into N segments where the completed ones fill in, with the count and a status word beside it — distinct from the continuous progress bar and from the labelled stepper.",
  descriptionEs:
    "Una lectura compacta de progreso discreto: una barra dividida en N segmentos donde se rellenan los completados, con el conteo y una palabra de estado al lado; distinta de la barra de progreso continua y del stepper con etiquetas.",
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
    "The bar is a native role=\"progressbar\" carrying aria-valuemin=0, aria-valuemax=N and aria-valuenow=completed, plus an aria-valuetext that spells the reading and its state in words — \"Step 3 of 7, in progress\". role and all three aria-value attributes are Omitted from the public props type, so a caller cannot desync the announced value from the drawn one; only aria-valuetext and aria-label stay overridable, for localisation. progressbar is the correct role here rather than meter or status: this reports advancement through a task toward completion, not a standing measurement, and it is a passive readout with no live region of its own, so it never interrupts. Every segment is decorative and aria-hidden, and the visible \"3 of 7\" readout and status pill are aria-hidden too, so the same figure is never announced twice. State is never carried by colour alone: a completed and an outstanding segment differ by fill, by border token, and by shape — an outstanding segment draws a short hairline across its middle where a completed one shows a solid run — and the count plus the word Not started, In progress or Complete state the same thing in real text, so a reader who cannot separate the two hues loses nothing. Values are clamped into [0, N] before they reach either ARIA or the drawing, so 0, N and out-of-range inputs resolve identically in both; a fractional value partly fills a single segment. Reduced motion keeps the end state: the resting scale and opacity of every fill are its final value, set from an inline custom property, so SSR, no-JS and prefers-reduced-motion all render the true fill, with motion-reduce:transition-none and motion-reduce:animate-none simply dropping the sweep and the staggered entrance. In forced-colors mode an outstanding segment keeps a GrayText outline, a completed one a CanvasText outline and a Highlight fill, gradients and shadows are cleared, all text becomes CanvasText and the focus ring becomes Highlight. The component owns no interactive control, but if a caller makes it a tab stop it draws a two-pixel offset focus ring, mirrored on a data-focus attribute for documentation. Label, readout and status pill all measure at or above 4.5:1 in both colour schemes, and the filled run clears the 3:1 bar asked of an informative graphic mark against its own track.",
  a11yEs:
    "La barra es un role=\"progressbar\" nativo que lleva aria-valuemin=0, aria-valuemax=N y aria-valuenow=completados, más un aria-valuetext que expresa la lectura y su estado en palabras: \"Step 3 of 7, in progress\". role y los tres atributos aria-value se excluyen (Omit) del tipo público de props, así que quien lo consume no puede desincronizar el valor anunciado del dibujado; solo aria-valuetext y aria-label siguen siendo sustituibles, para localizar. progressbar es el rol correcto aquí y no meter ni status: informa del avance de una tarea hacia su término, no de una medición permanente, y es una lectura pasiva sin región viva propia, así que nunca interrumpe. Cada segmento es decorativo y lleva aria-hidden, y la lectura visible \"3 de 7\" y la píldora de estado también, para que la misma cifra no se anuncie dos veces. El estado nunca depende solo del color: un segmento completado y uno pendiente se distinguen por relleno, por token de borde y por forma —el pendiente dibuja una línea fina en su centro donde el completado muestra un tramo sólido— y el conteo junto a la palabra Not started, In progress o Complete dicen lo mismo en texto real, de modo que quien no distingue ambos tonos no pierde nada. Los valores se acotan a [0, N] antes de llegar a ARIA o al dibujo, así que 0, N y las entradas fuera de rango se resuelven igual en ambos; un valor fraccionario rellena parcialmente un único segmento. El movimiento reducido conserva el estado final: el scale y la opacity en reposo de cada relleno son su valor final, fijados desde una propiedad personalizada en línea, así que SSR, sin-JS y prefers-reduced-motion muestran el relleno real, y motion-reduce:transition-none y motion-reduce:animate-none solo eliminan el barrido y la entrada escalonada. En modo forced-colors un segmento pendiente conserva un contorno GrayText, uno completado un contorno CanvasText y un relleno Highlight, se limpian gradientes y sombras, todo el texto pasa a CanvasText y el anillo de foco a Highlight. El componente no tiene controles interactivos, pero si quien lo consume lo convierte en punto de tabulación dibuja un anillo de foco con dos píxeles de separación, replicado en un atributo data-focus para la documentación. Etiqueta, lectura y píldora de estado miden al menos 4,5:1 en ambos esquemas de color, y el tramo relleno supera el 3:1 exigido a un gráfico informativo frente a su propia pista.",
  sourcePath: "src/registry/ui/segmented-progress.tsx",
  Preview: SegmentedProgressPreview,
};
