import { ScrollRevealPreview } from "@/registry/previews/scroll-reveal-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "scroll-reveal",
  name: "Scroll Reveal",
  nameEs: "Revelado al Desplazar",
  category: "effects",
  materials: ["adaptive"],
  description: "An IntersectionObserver wrapper that reveals already-accessible content with a controlled lift or soft-focus transition.",
  descriptionEs: "Un contenedor con IntersectionObserver que revela contenido ya accesible mediante una transición controlada de elevación o enfoque.",
  variants: [
    { id: "lift", label: "Lift", labelEs: "Elevar" },
    { id: "soften", label: "Soften", labelEs: "Enfocar" },
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
  a11y: "Content is rendered visible in the server HTML and remains in normal reading and focus order. IntersectionObserver only changes decorative opacity, translate and blur after hydration; no JavaScript, reduced motion and forced colors all preserve the final visible state.",
  a11yEs: "El contenido se renderiza visible en el HTML del servidor y conserva el orden normal de lectura y foco. IntersectionObserver solo cambia opacidad, desplazamiento y desenfoque decorativos después de hidratar; sin JavaScript, movimiento reducido y colores forzados mantienen el estado final visible.",
  sourcePath: "src/registry/ui/scroll-reveal.tsx",
  Preview: ScrollRevealPreview,
};
