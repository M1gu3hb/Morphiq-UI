import { AnimatedListPreview } from "@/registry/previews/animated-list-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "animated-list", name: "Animated List", nameEs: "Lista Animada", category: "effects", materials: ["adaptive"],
  description: "A semantic list whose stable keyed items enter with a configurable CSS stagger; animationKey offers explicit replay while new item ids animate naturally.",
  descriptionEs: "Una lista semántica cuyos ítems con claves estables entran con stagger CSS configurable; animationKey permite repetir explícitamente y los ids nuevos se animan de forma natural.",
  variants: [{ id: "slide", label: "Slide", labelEs: "Deslizar" }, { id: "fade", label: "Fade", labelEs: "Desvanecer" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The component renders a real ul/li structure in source order; animation never reorders nodes, changes focus or creates announcements. Item ids supply stable keys, and animationKey intentionally replays the sequence. Reduced motion and forced colors remove every keyframe and expose all items immediately at full opacity, with CanvasText boundaries preserved.",
  a11yEs: "El componente renderiza estructura real ul/li en orden fuente; la animación nunca reordena nodos, cambia foco ni crea anuncios. Los ids aportan claves estables y animationKey repite la secuencia intencionalmente. Movimiento reducido y forced-colors eliminan cada keyframe y muestran todos los ítems al instante con opacidad completa y bordes CanvasText.",
  sourcePath: "src/registry/ui/animated-list.tsx", Preview: AnimatedListPreview,
};
