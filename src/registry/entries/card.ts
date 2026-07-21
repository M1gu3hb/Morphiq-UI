import { CardPreview } from "@/registry/previews/card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
    slug: "card",
    name: "Card",
    nameEs: "Tarjeta",
    category: "cards",
    materials: ["clay", "glass", "skeuo", "adaptive"],
    description:
      "A composable surface with four material recipes, three elevations, three densities, and header/body/footer parts that inherit the card's tokens without any context provider.",
    descriptionEs:
      "Una superficie componible con cuatro recetas de material, tres elevaciones, tres densidades y partes de encabezado/cuerpo/pie que heredan los tokens de la tarjeta sin ningún proveedor de contexto.",
    variants: [
      { id: "default", label: "Default", labelEs: "Por defecto" },
      { id: "elevated", label: "Elevated", labelEs: "Elevada" },
      { id: "outline", label: "Outline", labelEs: "Contorno" },
    ],
    sizes: [
      { id: "sm", label: "Small", labelEs: "Pequeña" },
      { id: "md", label: "Medium", labelEs: "Mediana" },
      { id: "lg", label: "Large", labelEs: "Grande" },
    ],
    dependencies: {
      npm: ["@radix-ui/react-slot", "class-variance-authority", "clsx", "tailwind-merge"],
      internal: ["src/lib/cn.ts"],
    },
    a11y:
      "Renders a plain <div> and stays a container: it never fakes button semantics, because a role=\"button\" wrapper makes its contents presentational to some assistive tech and cannot legally hold the links and buttons a card usually contains. For a card that is entirely one link, asChild renders it as an <a> and keyboard activation is the browser's. CardTitle defaults to <h3> but takes asChild so the heading rank can match the surrounding document outline. The interactive variant draws its focus ring on :focus-within as well as :focus-visible, so tabbing to a control inside the card outlines the card too; inert cards deliberately skip that to avoid double-ringing the same focus. Loading sets aria-busy behind an inert aria-hidden wash; disabled sets aria-disabled and drops the hover affordance. Motion is suppressed under prefers-reduced-motion, and a system-colored border keeps the card's bounds visible in forced-colors mode, where shadows and translucency are discarded. Contrast: on every filled material both the title and the muted description measure at or above 4.5:1 against the surface, and the glass recipes carry their own tint so that holds over a white and a black backdrop alike. The outline variant is transparent by design and inherits the host's text color rather than pinning one.",
    a11yEs:
      "Renderiza un <div> plano y se mantiene como contenedor: nunca finge semántica de botón, porque un envoltorio con role=\"button\" vuelve presentacional su contenido para parte de las tecnologías de asistencia y no puede contener legalmente los enlaces y botones que una tarjeta suele llevar. Para una tarjeta que es enteramente un enlace, asChild la renderiza como <a> y la activación por teclado es la del navegador. CardTitle usa <h3> por defecto pero acepta asChild para que el rango del encabezado encaje con el esquema del documento. La variante interactiva dibuja su anillo de foco tanto en :focus-within como en :focus-visible, así que tabular a un control interno también resalta la tarjeta; las tarjetas inertes lo omiten a propósito para no duplicar el anillo sobre el mismo foco. El estado de carga activa aria-busy tras un velo inerte con aria-hidden; deshabilitada activa aria-disabled y pierde la señal de hover. El movimiento se suprime bajo prefers-reduced-motion, y un borde con color de sistema mantiene visibles los límites de la tarjeta en forced-colors, donde se descartan sombras y translucidez. Contraste: en cada material con relleno, tanto el título como la descripción atenuada miden 4,5:1 o más contra la superficie, y las recetas de vidrio llevan su propio tinte para que eso se cumpla igual sobre fondo blanco que negro. La variante de contorno es transparente por diseño y hereda el color de texto del anfitrión en vez de fijar uno.",
    sourcePath: "src/registry/ui/card.tsx",
    Preview: CardPreview,
  };
