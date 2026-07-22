import { EmptyStatePreview } from "@/registry/previews/empty-state-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Empty State component. */
export const entry: RegistryEntry = {
  slug: "empty-state",
  name: "Empty State",
  nameEs: "Estado vacío",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "A centred zero-data panel: a decorative illustration, a real heading whose rank is overridable, an explanatory paragraph and one caller-supplied action. Material-agnostic, with a single adaptive palette that follows the colour scheme in three sizes.",
  descriptionEs:
    "Un panel centrado para el estado sin datos: una ilustración decorativa, un encabezado real con rango ajustable, un párrafo explicativo y una acción proporcionada por quien lo usa. Independiente del material, con una única paleta adaptable que sigue el esquema de color en tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The title renders as a genuine heading whose rank is overridable through headingLevel (1–6, default 2), because the correct level is a property of the page's outline and not of the component; a hardcoded rank would break that outline wherever the panel is nested. The illustration is always decorative and carries aria-hidden, so the state's meaning is carried by the heading and description text — never by an icon shape or by colour alone. The action is supplied by the caller as a real button or link, so it brings its own accessible name and its own visible focus ring; Empty State owns no focus state, traps nothing and restores nothing. It is static content rather than a transient or asynchronous status, so it deliberately declares no live region: a screen reader meets it by navigating headings, the way any empty view is met, and announcing a persistent panel through role=\"status\" would be noise. The single entrance animation (a short fade and rise on the panel, a scaled fade on the illustration) is pure decoration layered over content already in the DOM, so under prefers-reduced-motion it is dropped outright and the panel and glyph are simply present at their final position, size and opacity — no looping motion survives. In forced-colors mode the surface fill and shadows are discarded and replaced with a CanvasText border and Canvas background so the panel keeps its bounds, and the heading, description and illustration are painted in CanvasText so nothing disappears when author colours are removed. Contrast: the adaptive palette keeps both the heading (#1c1c19 on #f7f6f2 light, #f1efe9 on #232327 dark) and the muted description (#55554e light, #b9b7b0 dark) at or above 4.5:1 against the surface in both colour schemes.",
  a11yEs:
    "El título se representa como un encabezado real cuyo rango es ajustable mediante headingLevel (1–6, por defecto 2), porque el nivel correcto es una propiedad del esquema de la página y no del componente; un rango fijo rompería ese esquema allí donde el panel esté anidado. La ilustración es siempre decorativa y lleva aria-hidden, así que el significado del estado lo transmiten el texto del encabezado y de la descripción, nunca la forma de un icono ni el color por sí solo. La acción la proporciona quien lo usa como un botón o enlace real, de modo que aporta su propio nombre accesible y su propio anillo de foco visible; Empty State no guarda estado de foco, no atrapa nada y no restaura nada. Es contenido estático y no un estado transitorio o asíncrono, por lo que declara deliberadamente que no hay región viva: un lector de pantalla lo encuentra navegando por encabezados, como se encuentra cualquier vista vacía, y anunciar un panel permanente con role=\"status\" sería ruido. La única animación de entrada (una breve aparición y ascenso del panel y una aparición escalada de la ilustración) es pura decoración sobre contenido que ya está en el DOM, así que bajo prefers-reduced-motion se elimina por completo y el panel y el glifo quedan simplemente presentes en su posición, tamaño y opacidad finales, sin que sobreviva ningún movimiento en bucle. En el modo de colores forzados se descartan el relleno de superficie y las sombras y se sustituyen por un borde CanvasText y un fondo Canvas para que el panel conserve sus límites, y el encabezado, la descripción y la ilustración se pintan en CanvasText para que nada desaparezca al quitarse los colores de autor. Contraste: la paleta adaptable mantiene tanto el encabezado (#1c1c19 sobre #f7f6f2 en claro, #f1efe9 sobre #232327 en oscuro) como la descripción atenuada (#55554e en claro, #b9b7b0 en oscuro) en 4,5:1 o más frente a la superficie en ambos esquemas de color.",
  sourcePath: "src/registry/ui/empty-state.tsx",
  Preview: EmptyStatePreview,
};
