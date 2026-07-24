import { ParallaxScrollPreview } from "@/registry/previews/parallax-scroll-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "parallax-scroll",
  name: "Parallax Scroll",
  nameEs: "Parallax al Desplazar",
  category: "effects",
  materials: ["adaptive"],
  description: "A bounded layer composition maps viewport position to independent CSS translate speeds with no animation runtime.",
  descriptionEs: "Una composición acotada de capas asigna la posición del viewport a velocidades independientes de translate CSS sin runtime de animación.",
  variants: [
    { id: "depth", label: "Depth", labelEs: "Profundidad" },
    { id: "drift", label: "Drift", labelEs: "Deriva" },
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
  a11y: "Layers remain in DOM source order and the wrapper does not alter focus or reading semantics. Server rendering shows the aligned final composition; reduced motion and forced colors reset every layer to zero translate while preserving all content.",
  a11yEs: "Las capas permanecen en orden fuente y el contenedor no altera foco ni semántica de lectura. El render del servidor muestra la composición alineada; movimiento reducido y colores forzados reinician toda capa a translate cero y conservan el contenido.",
  sourcePath: "src/registry/ui/parallax-scroll.tsx",
  Preview: ParallaxScrollPreview,
};
