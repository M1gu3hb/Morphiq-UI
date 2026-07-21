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
    "A composable Radix tooltip with hover and keyboard-focus mechanics, collision-aware placement, unchanged material bubble and arrow recipes, and side-aware scale, opacity and translate motion for opening and closing.",
  descriptionEs:
    "Un tooltip componible sobre Radix con mecánica de hover y foco de teclado, posicionamiento con colisiones, recetas materiales intactas para burbuja y flecha, y movimiento lateral de escala, opacidad y desplazamiento al abrir y cerrar.",
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
    "Provider, Root, Trigger and Content still map directly to @radix-ui/react-tooltip rather than reimplementing interaction. Radix supplies role=\"tooltip\", aria-describedby while open, hover and keyboard-focus opening, Escape dismissal, pointer grace, side/align positioning and collision avoidance. TooltipTrigger supports asChild so the consumer keeps a real button or link as the focusable control. delayDuration passes through Provider and Root; side, align, sideOffset and collision props pass through Content. Content portals by default, while portalled={false} keeps bounded documentation previews inline without changing Radix mechanics. Local enter and exit keyframes follow Radix data-state and data-side: delayed-open uses 180ms, instant-open 140ms and closed 120ms, and only opacity, the individual scale property and side-aware translate move. Under prefers-reduced-motion an important animation override beats the more-specific state selector, leaving the final open state with zero active animations. Forced-colors clears background images, backdrop filters and shadows before using Canvas, CanvasText and a system border on bubble and arrow. No material or colour token changed; every material/variant text pair remains at least 9.52:1, including glass composited over black and white, both skeuo gradient stops and both adaptive colour schemes. Tooltip content should supplement a concise trigger label, never hold essential or interactive information.",
  a11yEs:
    "Provider, Root, Trigger y Content siguen mapeando directamente a @radix-ui/react-tooltip en vez de reimplementar interacción. Radix aporta role=\"tooltip\", aria-describedby mientras está abierto, apertura por hover y foco de teclado, cierre con Escape, tolerancia de puntero, posicionamiento side/align y manejo de colisiones. TooltipTrigger admite asChild para conservar un botón o enlace real como control enfocable. delayDuration pasa por Provider y Root; side, align, sideOffset y las props de colisión pasan por Content. Content usa portal por defecto, mientras portalled={false} mantiene inline los previews acotados sin cambiar la mecánica de Radix. Los keyframes locales de entrada y salida siguen data-state y data-side de Radix: delayed-open usa 180 ms, instant-open 140 ms y closed 120 ms, y sólo se mueven opacidad, la propiedad individual scale y translate según el lado. Bajo prefers-reduced-motion, un override importante vence al selector de estado más específico y deja el estado abierto final con cero animaciones activas. Forced-colors limpia background images, backdrop filters y sombras antes de usar Canvas, CanvasText y un borde de sistema en burbuja y flecha. No cambió ningún token de material o color; cada par texto/material/variante conserva al menos 9,52:1, incluidos glass compuesto sobre negro y blanco, ambos extremos del gradiente skeuo y los dos esquemas adaptive. El tooltip debe complementar una etiqueta breve del trigger, nunca contener información esencial o interactiva.",
  sourcePath: "src/registry/ui/tooltip.tsx",
  Preview: TooltipPreview,
};
