import { TiltCardPreview } from "@/registry/previews/tilt-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Tilt 3D Card. */
export const entry: RegistryEntry = {
  slug: "tilt-card",
  name: "Tilt 3D Card",
  nameEs: "Tarjeta 3D Inclinable",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic tactile card that tilts toward the pointer in real 3D with a specular highlight, driven by local CSS custom properties and a single inline transform, springing back square and flattening under reduced motion.",
  descriptionEs:
    "Una tarjeta semántica y táctil que se inclina hacia el puntero en 3D real con un brillo especular, impulsada por propiedades CSS locales y un único transform en línea, que regresa recta con resorte y se aplana con movimiento reducido.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a semantic <article> and never invents button semantics for a container that may hold headings, links or controls. The tilt and the specular are decoration: the 3D rotation only leans the surface, content stays flat in reading order, and links and buttons inside stay clickable and keyboard-focusable because a transformed element is still hit-tested and tab order is untouched. The card is not added to the tab order by default; callers can pass tabIndex when the surface itself needs focus, while :focus-within also outlines it as a real descendant receives keyboard focus. The tilt only responds to the pointer and eases back to square on leave; prefers-reduced-motion removes it entirely so the card sits square. forced-colors removes gradients, translucency, shadows and the highlight, then restores a CanvasText boundary and system Highlight outline. Primary and secondary text stay at least 4.5:1 against every owned material surface, including both adaptive schemes; the visible material boundaries are at least 3:1 against their surfaces.",
  a11yEs:
    "Renderiza un <article> semántico y nunca inventa semántica de botón para un contenedor que puede albergar encabezados, enlaces o controles. La inclinación y el especular son decoración: la rotación 3D solo inclina la superficie, el contenido permanece plano en el orden de lectura, y los enlaces y botones internos siguen siendo clicables y enfocables por teclado porque un elemento transformado se sigue detectando y el orden de tabulación no cambia. La tarjeta no entra al orden de tabulación por defecto; quien la usa puede pasar tabIndex cuando la superficie necesite foco, mientras :focus-within también la contornea cuando un descendiente real recibe foco de teclado. La inclinación solo responde al puntero y regresa a recta al salir; prefers-reduced-motion la elimina por completo y la tarjeta queda recta. forced-colors quita degradados, translucidez, sombras y el brillo, y recupera un límite CanvasText y un contorno Highlight del sistema. El texto primario y secundario se mantienen al menos 4,5:1 contra cada superficie material propia, incluidos ambos esquemas de adaptive; los límites visibles de material alcanzan al menos 3:1 contra sus superficies.",
  sourcePath: "src/registry/ui/tilt-card.tsx",
  Preview: TiltCardPreview,
};
