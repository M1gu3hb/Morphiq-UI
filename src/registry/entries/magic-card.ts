import { MagicCardPreview } from "@/registry/previews/magic-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Magic Card. */
export const entry: RegistryEntry = {
  slug: "magic-card",
  name: "Magic Card",
  nameEs: "Tarjeta Mágica",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic tactile card whose gradient border lights up under the pointer through two local CSS coordinates, clipped to the ring with a mask and settling to an even static border with no pointer or reduced motion.",
  descriptionEs:
    "Una tarjeta semántica y táctil cuyo borde con gradiente se ilumina bajo el puntero mediante dos coordenadas CSS locales, recortado al anillo con una máscara y que vuelve a un borde estático uniforme sin puntero o con movimiento reducido.",
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
    "Renders a semantic <article> and never invents button semantics for a container that may hold headings, links or controls. Pointer coordinates only feed an aria-hidden decorative ring, so content, reading order and activation never depend on the lit border. The card is not added to the tab order by default; callers can pass tabIndex when the surface itself needs focus, while :focus-within also outlines it and reveals the border as a real descendant receives keyboard focus. With no pointer the ring settles to an even static gradient, and prefers-reduced-motion pins it there and removes the tactile lift. forced-colors removes gradients, translucency, shadows and the decorative ring, then restores a CanvasText boundary and system Highlight outline. Primary and secondary text stay at least 4.5:1 against every owned material surface, including both adaptive schemes, since the content sits on the opaque surface and never on the ring; the visible material boundaries are at least 3:1 against their surfaces.",
  a11yEs:
    "Renderiza un <article> semántico y nunca inventa semántica de botón para un contenedor que puede albergar encabezados, enlaces o controles. Las coordenadas del puntero solo alimentan un anillo decorativo con aria-hidden, así que el contenido, el orden de lectura y la activación nunca dependen del borde iluminado. La tarjeta no entra al orden de tabulación por defecto; quien la usa puede pasar tabIndex cuando la superficie necesite foco, mientras :focus-within también la contornea y revela el borde cuando un descendiente real recibe foco de teclado. Sin puntero el anillo vuelve a un gradiente estático uniforme, y prefers-reduced-motion lo fija ahí y elimina la elevación táctil. forced-colors quita degradados, translucidez, sombras y el anillo decorativo, y recupera un límite CanvasText y un contorno Highlight del sistema. El texto primario y secundario se mantienen al menos 4,5:1 contra cada superficie material propia, incluidos ambos esquemas de adaptive, porque el contenido va sobre la superficie opaca y nunca sobre el anillo; los límites visibles de material alcanzan al menos 3:1 contra sus superficies.",
  sourcePath: "src/registry/ui/magic-card.tsx",
  Preview: MagicCardPreview,
};
