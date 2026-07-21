import { TooltipPreview } from "@/registry/previews/tooltip-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Tooltip component. */
export const entry: RegistryEntry = {
  slug: "tooltip",
  name: "Tooltip",
  nameEs: "Tooltip",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A composable Radix tooltip with hover and keyboard-focus mechanics, collision-aware placement, material bubble and arrow recipes, two contrast treatments and three sizes.",
  descriptionEs:
    "Un tooltip componible sobre Radix con mecánica de hover y foco de teclado, posicionamiento con colisiones, recetas materiales para burbuja y flecha, dos tratamientos de contraste y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "inverted", label: "Inverted", labelEs: "Invertido" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["@radix-ui/react-tooltip", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Provider, Root, Trigger and Content map directly to @radix-ui/react-tooltip rather than reimplementing interaction. Radix supplies role=\"tooltip\", aria-describedby while open, hover and keyboard-focus opening, Escape dismissal, pointer grace, side/align positioning and collision avoidance. TooltipTrigger supports asChild so the consumer keeps a real button or link as the focusable control. delayDuration passes through Provider and Root; side, align, sideOffset and collision props pass through Content. Content portals by default, while portalled={false} keeps bounded documentation previews inline without changing Radix mechanics. Entry motion transitions only opacity and the individual translate property selected by data-side; reduced motion zeroes both offsets and retains only the opacity transition. Forced-colors uses Canvas, CanvasText and a system border on both bubble and arrow. Every material/variant text pair measures at least 9.52:1, including glass composited over black and white, both skeuo gradient stops and both adaptive colour schemes. Tooltip content should supplement a concise trigger label, never hold essential or interactive information.",
  a11yEs:
    "Provider, Root, Trigger y Content mapean directamente a @radix-ui/react-tooltip en vez de reimplementar interacción. Radix aporta role=\"tooltip\", aria-describedby mientras está abierto, apertura por hover y foco de teclado, cierre con Escape, tolerancia de puntero, posicionamiento side/align y manejo de colisiones. TooltipTrigger admite asChild para conservar un botón o enlace real como control enfocable. delayDuration pasa por Provider y Root; side, align, sideOffset y las props de colisión pasan por Content. Content usa portal por defecto, mientras portalled={false} mantiene inline los previews acotados sin cambiar la mecánica de Radix. La entrada transiciona solo opacidad y la propiedad individual translate elegida por data-side; reduced motion lleva ambos offsets a cero y conserva solo la transición de opacidad. Forced-colors usa Canvas, CanvasText y un borde de sistema en burbuja y flecha. Cada par texto/material/variante mide al menos 9,52:1, incluidos glass compuesto sobre negro y blanco, ambos extremos del gradiente skeuo y los dos esquemas adaptive. El tooltip debe complementar una etiqueta breve del trigger, nunca contener información esencial o interactiva.",
  sourcePath: "src/registry/ui/tooltip.tsx",
  Preview: TooltipPreview,
};
