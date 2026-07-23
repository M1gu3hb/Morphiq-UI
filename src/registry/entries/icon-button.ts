import { IconButtonPreview } from "@/registry/previews/icon-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the icon-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "icon-button",
  name: "Icon Button",
  nameEs: "Botón de icono",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A compact, fixed-footprint action holding a single icon — square or circular — with the four tactile material recipes, three sizes, and a required accessible name.",
  descriptionEs:
    "Una acción compacta de tamaño fijo que contiene un solo icono — cuadrado o circular — con las cuatro recetas de material táctil, tres tamaños y un nombre accesible obligatorio.",
  variants: [
    { id: "square", label: "Square", labelEs: "Cuadrado" },
    { id: "circle", label: "Circle", labelEs: "Círculo" },
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
    "Renders a native <button> with type=\"button\" by default, so focus, Enter/Space activation and the :disabled state all come from the platform. Because an icon carries no text, aria-label is required at the type level — an icon-only control with no accessible name will not compile. Focus is shown with a 2px offset ring on :focus-visible (mirrored on data-focus for documentation) and is never removed. The variant chooses the shape (square with a size-tuned radius, or a full circle) while the footprint stays a fixed square, h == w, at every size (32/40/48px); the child icon is scaled to match and marked aria-hidden so it is never announced twice. Each material keeps its own press physics: a resting shadow, a hover lift, and an :active sink into a pressed inset well (clay ~3px, skeuo ~4px, glass/adaptive ~1px). Under prefers-reduced-motion the hover/press travel is dropped but the inset well is still applied instantly, so the tactile feedback is preserved. In forced-colors mode fills and shadows are discarded and a CanvasText border keeps the control's bounds while the focus ring switches to Highlight. The adaptive material grows to a 48px square touch target on coarse pointers. Contrast: every material meets or exceeds 4.5:1 for its icon against its surface, reusing the Button's measured primary-intent tokens.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, así que el foco, la activación con Enter/Espacio y el estado :disabled provienen de la plataforma. Como un icono no lleva texto, aria-label es obligatorio a nivel de tipo — un control de solo icono sin nombre accesible no compila. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (reflejado en data-focus para la documentación) y nunca se elimina. La variante elige la forma (cuadrado con un radio ajustado al tamaño, o un círculo completo) mientras la huella se mantiene como un cuadrado fijo, h == w, en cada tamaño (32/40/48px); el icono hijo se escala en consecuencia y se marca aria-hidden para que no se anuncie dos veces. Cada material conserva su física de pulsación: una sombra en reposo, una elevación al pasar el cursor y un hundimiento en :active hacia un pozo interior pulsado (clay ~3px, skeuo ~4px, glass/adaptive ~1px). Bajo prefers-reduced-motion se elimina el recorrido de hover/pulsación pero el pozo interior se aplica al instante, preservando la respuesta táctil. En forced-colors se descartan rellenos y sombras y un borde CanvasText conserva los límites del control mientras el anillo de foco cambia a Highlight. El material adaptativo crece a un objetivo táctil cuadrado de 48px en punteros gruesos. Contraste: cada material alcanza o supera 4,5:1 para su icono sobre su superficie, reutilizando los tokens de intención primaria medidos del Button.",
  sourcePath: "src/registry/ui/icon-button.tsx",
  Preview: IconButtonPreview,
};
