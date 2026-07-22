import { WordRotatePreview } from "@/registry/previews/word-rotate-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Word Rotate. */
export const entry: RegistryEntry = {
  slug: "word-rotate",
  name: "Word Rotate",
  nameEs: "Rotador de palabras",
  category: "text",
  materials: ["adaptive"],
  description:
    "An inherited word slot that flips through a list without shifting the surrounding line.",
  descriptionEs:
    "Un espacio de palabra heredado que rota una lista sin desplazar la línea que lo rodea.",
  variants: [{ id: "vertical", label: "Vertical", labelEs: "Vertical" }],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: {
    npm: ["motion", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The animated and width-reserving copies are aria-hidden; one plain current-word node remains in the accessibility tree. Announcements are opt-in with announce because continuously rotating marketing copy should not repeatedly interrupt assistive technology. Font, size and color inherit from the host. prefers-reduced-motion cancels the interval and stabilizes the first word; CSS media overrides also neutralize transform, opacity and blur before hydration. forced-colors keeps static CanvasText. The host foreground/background pair must maintain at least 4.5:1 contrast.",
  a11yEs:
    "Las copias animada y de reserva de ancho son aria-hidden; un único nodo de palabra actual permanece en el árbol de accesibilidad. Los anuncios son opcionales con announce porque el texto promocional en rotación continua no debe interrumpir repetidamente a la tecnología de asistencia. Fuente, tamaño y color se heredan del host. prefers-reduced-motion cancela el intervalo y estabiliza la primera palabra; los overrides CSS también neutralizan transform, opacidad y desenfoque antes de hidratar. forced-colors mantiene CanvasText estático. El par primer plano/fondo del host debe mantener al menos 4,5:1.",
  sourcePath: "src/registry/ui/word-rotate.tsx",
  Preview: WordRotatePreview,
};
