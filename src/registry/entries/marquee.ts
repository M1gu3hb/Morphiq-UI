import { MarqueePreview } from "@/registry/previews/marquee-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Marquee. */
export const entry: RegistryEntry = {
  slug: "marquee",
  name: "Marquee",
  nameEs: "Marquesina",
  category: "effects",
  materials: ["adaptive"],
  description:
    "A seamless horizontal or vertical content loop with configurable direction, speed, repetition and pause-on-hover behavior.",
  descriptionEs:
    "Un bucle continuo de contenido horizontal o vertical con dirección, velocidad, repetición y pausa al pasar el cursor configurables.",
  variants: [
    { id: "horizontal", label: "Horizontal", labelEs: "Horizontal" },
    { id: "vertical", label: "Vertical", labelEs: "Vertical" },
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
    "The first track owns the accessible content; every repeated track is aria-hidden and inert, so duplicate labels and controls never enter the accessibility tree or tab order. Source order remains stable while CSS moves the visual tracks. pauseOnHover is a convenience rather than the only stop mechanism: prefers-reduced-motion disables the loop and hides all copies after the first. forced-colors also stops motion, removes duplicate tracks and restores a Canvas/CanvasText surface. The owned preview surface keeps at least 4.5:1 text contrast; callers remain responsible for children they supply. Interactive controls are best placed outside a continuously moving marquee.",
  a11yEs:
    "La primera pista contiene el contenido accesible; cada pista repetida es aria-hidden e inert, así que las etiquetas y controles duplicados nunca entran al árbol de accesibilidad ni al orden de tabulación. El orden fuente permanece estable mientras CSS mueve las pistas visuales. pauseOnHover es una comodidad y no el único mecanismo de parada: prefers-reduced-motion desactiva el bucle y oculta todas las copias después de la primera. forced-colors también detiene el movimiento, elimina las pistas duplicadas y restaura una superficie Canvas/CanvasText. La superficie propia de la preview mantiene al menos 4,5:1; quien integra sigue siendo responsable de sus children. Es preferible colocar controles interactivos fuera de una marquesina en movimiento continuo.",
  sourcePath: "src/registry/ui/marquee.tsx",
  Preview: MarqueePreview,
};
