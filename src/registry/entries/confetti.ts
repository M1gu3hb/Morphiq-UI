import { ConfettiPreview } from "@/registry/previews/confetti-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "confetti", name: "Confetti", nameEs: "Confeti", category: "effects", materials: ["adaptive"],
  description: "A prop-triggered celebratory burst whose deterministic CSS pieces fan out from the centre, with count strictly clamped to 8–36.",
  descriptionEs: "Una ráfaga celebratoria disparada por prop cuyas piezas CSS deterministas salen del centro, con cantidad estrictamente limitada a 8–36.",
  variants: [{ id: "celebration", label: "Celebration", labelEs: "Celebración" }, { id: "warm", label: "Warm", labelEs: "Cálida" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Changing trigger replays a bounded burst without focus capture, announcements or control roles; pieces are aria-hidden and pointer-transparent, and finish at zero opacity. The surrounding content and its native controls remain fully interactive. Reduced motion suppresses the entire particle layer; forced colors does the same and preserves the system surface.",
  a11yEs: "Cambiar trigger repite una ráfaga acotada sin capturar foco, anuncios ni roles de control; las piezas llevan aria-hidden, dejan pasar el puntero y terminan con opacidad cero. El contenido y sus controles nativos siguen interactivos. Movimiento reducido suprime toda la capa de partículas; forced-colors hace lo mismo y conserva la superficie del sistema.",
  sourcePath: "src/registry/ui/confetti.tsx", Preview: ConfettiPreview,
};
