import { StatsSectionPreview } from "@/registry/previews/stats-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "stats-section",
  name: "Stats Section",
  nameEs: "Sección de métricas",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive metric band with semantic definition-list relationships and an optional requestAnimationFrame count-up that respects reduced motion.",
  descriptionEs: "Una banda responsive de métricas con relaciones semánticas de lista de definición y count-up opcional con requestAnimationFrame que respeta movimiento reducido.",
  variants: [
    { id: "cards", label: "Cards", labelEs: "Tarjetas" },
    { id: "band", label: "Band", labelEs: "Banda" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Metrics use a native dl with dt labels followed by dd values and details. Each animated data element exposes the final formatted value through aria-label while its changing visual counter is aria-hidden, preventing noisy repeated announcements and ensuring meaning never depends on color. With prefers-reduced-motion the first animation frame writes the final value and no count-up runs. Animation frames are cancelled on cleanup, forced colors restores system surfaces, and all labels, details and figures meet at least 4.5:1 (large figures exceed 3:1).",
  a11yEs: "Las métricas usan un dl nativo con etiquetas dt seguidas de valores y detalles dd. Cada elemento data animado expone el valor final formateado mediante aria-label mientras su contador visual cambiante usa aria-hidden, evitando anuncios repetidos y garantizando que el significado nunca dependa del color. Con prefers-reduced-motion el primer frame escribe el valor final y no se ejecuta count-up. Los frames se cancelan al desmontar, forced colors restaura superficies del sistema y etiquetas, detalles y cifras alcanzan al menos 4,5:1 (las cifras grandes superan 3:1).",
  sourcePath: "src/registry/ui/stats-section.tsx",
  Preview: StatsSectionPreview,
};
