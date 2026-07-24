import { ClickSparkPreview } from "@/registry/previews/click-spark-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "click-spark",
  name: "Click Spark",
  nameEs: "Chispa al Clic",
  category: "effects",
  materials: ["adaptive"],
  description: "A pointer-origin spark burst that decorates clicks without intercepting the surface interaction.",
  descriptionEs: "Una ráfaga de chispas desde el puntero que decora el clic sin interceptar la interacción de la superficie.",
  variants: [
    { id: "star", label: "Star", labelEs: "Estrella" },
    { id: "ember", label: "Ember", labelEs: "Brasa" },
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
  a11y: "Spark nodes are aria-hidden and pointer-transparent; the wrapper adds no role or tab stop and preserves the consumer pointer handler. Reduced motion and forced colors suppress the burst while native focus and activation remain intact.",
  a11yEs: "Las chispas llevan aria-hidden y dejan pasar el puntero; el contenedor no añade rol ni parada de tabulación y conserva el manejador del consumidor. Movimiento reducido y colores forzados suprimen la ráfaga sin alterar foco ni activación nativos.",
  sourcePath: "src/registry/ui/click-spark.tsx",
  Preview: ClickSparkPreview,
};
