import { MeteorsPreview } from "@/registry/previews/meteors-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Meteors background. */
export const entry: RegistryEntry = {
  slug: "meteors",
  name: "Meteors",
  nameEs: "Meteoros",
  category: "backgrounds",
  materials: ["adaptive"],
  description:
    "A full-bleed container with meteors streaking diagonally behind its content in pure CSS — thin gradient streaks translated by a local keyframe, positioned and timed from the index so the field is deterministic and server-safe. Material-agnostic single style; stops under reduced motion and clears under forced colors.",
  descriptionEs:
    "Un contenedor full-bleed con meteoros que cruzan en diagonal detrás de su contenido en CSS puro — finas estelas de gradiente desplazadas por un keyframe local, posicionadas y temporizadas por el índice para que el campo sea determinista y seguro en el servidor. Estilo único agnóstico al material; se detiene con movimiento reducido y se limpia con forced-colors.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "A decorative full-bleed background. The meteors are an aria-hidden layer behind the content, so reading order, focus and activation never depend on them, and children sit on a z-indexed content layer that carries its own contrast. Positions and timing are derived from the index rather than a random source, so the server and client render the same field and hydration never mismatches. The streak keyframe travels with the component and is deduplicated. prefers-reduced-motion stops every streak to a static field, and forced-colors removes them entirely and restores a system Canvas surface with CanvasText content. Being material-agnostic it ships a single fixed palette; the demo content is chosen to stay at least 4.5:1 against the surface, and callers own the contrast of their own content, which the effect never overrides because it sits behind an opaque base.",
  a11yEs:
    "Un fondo decorativo full-bleed. Los meteoros son una capa con aria-hidden detrás del contenido, así que el orden de lectura, el foco y la activación nunca dependen de ellos, y los hijos van en una capa de contenido con z-index que lleva su propio contraste. Las posiciones y la temporización se derivan del índice y no de una fuente aleatoria, así que el servidor y el cliente renderizan el mismo campo y la hidratación nunca se desincroniza. El keyframe de la estela viaja con el componente y se deduplica. prefers-reduced-motion detiene cada estela en un campo estático, y forced-colors las quita por completo y restaura una superficie Canvas del sistema con contenido CanvasText. Al ser agnóstico al material entrega una paleta fija única; el contenido de demostración se elige para mantener al menos 4,5:1 contra la superficie, y quien lo usa es dueño del contraste de su propio contenido, que el efecto nunca pisa porque va detrás de una base opaca.",
  sourcePath: "src/registry/ui/meteors.tsx",
  Preview: MeteorsPreview,
};
