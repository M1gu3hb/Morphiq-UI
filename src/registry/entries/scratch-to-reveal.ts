import { ScratchToRevealPreview } from "@/registry/previews/scratch-to-reveal-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "scratch-to-reveal", name: "Scratch to Reveal", nameEs: "Rascar para Revelar", category: "effects", materials: ["adaptive"],
  description: "An SVG-mask scratch surface with bounded pointer samples, a controlled revealed prop and a native Reveal all keyboard fallback while the underlying content stays semantic.",
  descriptionEs: "Una superficie rascable con máscara SVG y muestras de puntero acotadas, prop revealed controlable y fallback nativo Revelar todo, mientras el contenido inferior conserva semántica.",
  variants: [{ id: "silver", label: "Silver", labelEs: "Plateado" }, { id: "violet", label: "Violet", labelEs: "Violeta" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Underlying children stay in the DOM and accessibility tree from first render. A real Reveal all button precedes them in focus order, announces the revealed state through an existing polite live region and controls the content id; focusing covered child content also reveals it. The SVG cover is aria-hidden and points are capped at 80. Reduced motion removes the opacity transition; forced colors removes the cover so content is immediately visible.",
  a11yEs: "Los hijos permanecen en el DOM y árbol accesible desde el primer render. Un botón real Revelar todo los precede en el foco, anuncia el estado mediante una región live polite existente y controla el id del contenido; enfocar contenido cubierto también lo revela. La cubierta SVG lleva aria-hidden y los puntos se limitan a 80. Movimiento reducido quita la transición de opacidad; forced-colors elimina la cubierta para mostrar el contenido.",
  sourcePath: "src/registry/ui/scratch-to-reveal.tsx", Preview: ScratchToRevealPreview,
};
