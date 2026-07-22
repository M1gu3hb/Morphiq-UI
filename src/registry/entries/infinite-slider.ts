import { InfiniteSliderPreview } from "@/registry/previews/infinite-slider-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Infinite Slider. */
export const entry: RegistryEntry = {
  slug: "infinite-slider",
  name: "Infinite Slider",
  nameEs: "Slider infinito",
  category: "media",
  materials: ["adaptive"],
  description:
    "A seamless, dependency-free strip for logos or media cards with configurable direction, duration and pause-on-hover behaviour.",
  descriptionEs:
    "Una tira continua y sin dependencias para logotipos o tarjetas multimedia, con dirección, duración y pausa al pasar el cursor configurables.",
  variants: [
    { id: "left", label: "Left", labelEs: "Izquierda" },
    { id: "right", label: "Right", labelEs: "Derecha" },
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
    "The primary track owns the accessible content; the duplicate is aria-hidden and inert, preventing repeated labels or controls in the accessibility tree. Stable source order is preserved while CSS translates both tracks. prefers-reduced-motion and forced-colors stop the loop and hide the duplicate, leaving one readable row. Pause-on-hover is an enhancement rather than the only stop mechanism. The owned adaptive surface provides 17.3:1 text contrast; callers remain responsible for the accessible names and contrast of supplied item content.",
  a11yEs:
    "La pista primaria contiene el contenido accesible; el duplicado lleva aria-hidden e inert, evitando etiquetas o controles repetidos en el árbol de accesibilidad. El orden fuente permanece estable mientras CSS traslada ambas pistas. prefers-reduced-motion y forced-colors detienen el bucle y ocultan el duplicado, dejando una fila legible. La pausa al hover es una mejora, no el único mecanismo de parada. La superficie adaptive propia ofrece contraste 17,3:1; quien integra responde por nombres y contraste del contenido suministrado.",
  sourcePath: "src/registry/ui/infinite-slider.tsx",
  Preview: InfiniteSliderPreview,
};
