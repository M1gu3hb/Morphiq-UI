import { NeonGradientCardPreview } from "@/registry/previews/neon-gradient-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Neon Gradient Card. */
export const entry: RegistryEntry = {
  slug: "neon-gradient-card",
  name: "Neon Gradient Card",
  nameEs: "Tarjeta Neón",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic tactile card wrapped in an animated neon frame — a blurred conic gradient that rotates behind an opaque surface through a local keyframe, tinted per material, freezing to a static glow under reduced motion.",
  descriptionEs:
    "Una tarjeta semántica y táctil envuelta en un marco de neón animado — un gradiente cónico desenfocado que rota detrás de una superficie opaca mediante un keyframe local, tintado por material, que se congela en un brillo estático con movimiento reducido.",
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
    "Renders a semantic <article> for the content, wrapped in a decorative container that carries the neon frame. The glow is an aria-hidden layer painted behind an opaque surface, so the content sits on solid material and its legibility never depends on the neon. The wrapper is not added to the tab order; :focus-within outlines it as a real descendant receives keyboard focus, and callers can pass tabIndex when the surface itself needs focus. The keyframe travels with the component and is deduplicated, so a wall of cards emits one rule; prefers-reduced-motion freezes the frame to a static glow, and forced-colors removes the gradient frame and translucency and restores a CanvasText boundary and system Highlight outline. Primary and secondary text stay at least 4.5:1 against every owned material surface, including both adaptive schemes, because the frame is behind the opaque surface; the visible material boundaries are at least 3:1 against their surfaces.",
  a11yEs:
    "Renderiza un <article> semántico para el contenido, envuelto en un contenedor decorativo que lleva el marco de neón. El brillo es una capa con aria-hidden pintada detrás de una superficie opaca, así que el contenido va sobre material sólido y su legibilidad nunca depende del neón. El envoltorio no entra al orden de tabulación; :focus-within lo contornea cuando un descendiente real recibe foco de teclado, y quien la usa puede pasar tabIndex cuando la superficie necesite foco. El keyframe viaja con el componente y se deduplica, así que un muro de tarjetas emite una sola regla; prefers-reduced-motion congela el marco en un brillo estático, y forced-colors quita el marco degradado y la translucidez y recupera un límite CanvasText y un contorno Highlight del sistema. El texto primario y secundario se mantienen al menos 4,5:1 contra cada superficie material propia, incluidos ambos esquemas de adaptive, porque el marco va detrás de la superficie opaca; los límites visibles de material alcanzan al menos 3:1 contra sus superficies.",
  sourcePath: "src/registry/ui/neon-gradient-card.tsx",
  Preview: NeonGradientCardPreview,
};
