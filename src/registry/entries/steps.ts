import { StepsPreview } from "@/registry/previews/steps-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Steps component. */
export const entry: RegistryEntry = {
  slug: "steps",
  name: "Steps",
  nameEs: "Pasos",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A semantic ordered progress sequence with completed, current and pending states, dot or numbered markers, three sizes, and horizontal or vertical orientation.",
  descriptionEs:
    "Una secuencia semántica y ordenada de progreso con estados completado, actual y pendiente, marcadores de puntos o numerados, tres tamaños y orientación horizontal o vertical.",
  variants: [
    { id: "default", label: "Dots", labelEs: "Puntos" },
    { id: "numbered", label: "Numbered", labelEs: "Numerados" },
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
    "Steps renders a native ol with one li per supplied item. The current li carries aria-current=\"step\"; a visually hidden status prefix names every item as Completed, Current step or Pending, and statusLabels localizes those words. Completed markers combine a filled shape and decorative check, the current marker combines a double outline, heavier underlined label and current-step semantics, and pending markers use an outlined dashed shape, so no state depends on colour or icon alone. Connectors and marker artwork are aria-hidden; list order and visible labels remain the readable content. The default horizontal layout can be switched to vertical without changing semantics. There is intentionally no animation or transition, so reduced-motion users receive the same immediate update and getAnimations() stays empty. Forced-colors maps completed/current/pending markers and connectors to Highlight, CanvasText and GrayText. Primary, muted and pending text exceed 4.5:1 and every marker/connector exceeds 3:1 against its owned material surface, including dark adaptive.",
  a11yEs:
    "Steps renderiza un ol nativo con un li por elemento recibido. El li actual lleva aria-current=\"step\"; un prefijo visualmente oculto nombra cada elemento como Completado, Paso actual o Pendiente, y statusLabels permite localizar esas palabras. Los marcadores completados combinan forma rellena y check decorativo, el actual combina doble contorno, etiqueta más gruesa y subrayada y semántica de paso actual, y los pendientes usan forma delineada discontinua, por lo que ningún estado depende solo del color o del ícono. Los conectores y dibujos del marcador usan aria-hidden; el orden de la lista y las etiquetas visibles conservan el contenido legible. La disposición horizontal predeterminada puede cambiarse a vertical sin alterar la semántica. No hay animación ni transición intencionalmente, así que el movimiento reducido recibe la misma actualización inmediata y getAnimations() permanece vacío. Forced-colors asigna marcadores y conectores completados, actuales y pendientes a Highlight, CanvasText y GrayText. El texto principal, atenuado y pendiente supera 4,5:1 y cada marcador/conector supera 3:1 contra su superficie material propia, incluido adaptive oscuro.",
  sourcePath: "src/registry/ui/steps.tsx",
  Preview: StepsPreview,
};
