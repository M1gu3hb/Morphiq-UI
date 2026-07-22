import { GooeyNavPreview } from "@/registry/previews/gooey-nav-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the gooey-nav component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "gooey-nav",
  name: "Gooey Nav",
  nameEs: "Navegación gooey",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A horizontal navigation whose sliding active indicator is liquid: two flat blobs ride under an inline SVG metaball filter (Gaussian blur plus an alpha-contrast colour matrix), so they fuse with a stretching neck while the active item changes and settle into one clean pill at rest. The blob is measured from the live geometry of the active item, so it tracks reflow and late webfonts. Uncontrolled by default, controllable by value, with four material recipes and three sizes.",
  descriptionEs:
    "Una navegación horizontal cuyo indicador activo deslizante es líquido: dos gotas planas viajan bajo un filtro SVG de metaball en línea (desenfoque gaussiano más una matriz de color que contrasta el alfa), así que se fusionan con un cuello que se estira mientras cambia el elemento activo y se asientan en una sola píldora limpia en reposo. La gota se mide a partir de la geometría real del elemento activo, así que sigue los reflujos y las fuentes web tardías. No controlada por defecto, controlable por valor, con cuatro recetas de material y tres tamaños.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "The bar is a nav element with an accessible label. Items are real anchors when given an href and real buttons otherwise, so they are keyboard-reachable in source order, focusable, and operable with Enter (and Space for the button form) without any synthetic key handling. The active item carries aria-current=\"page\" and a heavier weight, so its state is never signalled by the liquid fill alone. The gooey indicator — the two blobs and the SVG metaball filter that fuses them — is aria-hidden decoration and never enters the accessibility tree, so assistive technology hears exactly one active item and no animation chatter. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed. Motion is suppressed under prefers-reduced-motion: the filter is cleared to none so there is no deformation, the transition is dropped so there is no slide, and the blob appears directly at the active item; because the layer is armed only after its first measurement, it never travels or stretches in from a corner even on first paint. With JavaScript off or before hydration the slider stays off and the active item paints its own chip, so the current item is marked at every stage. In forced-colors mode fills, gradients, shadows and the SVG filter are all discarded, so the decorative goo layer is hidden entirely and the active item is instead marked with a system colour (CanvasText) on a bottom border that is always reserved in the box model; the focus ring switches to the Highlight system colour. The active indication therefore never depends on a fill or filter the OS throws away. Contrast: on every material the active label measures at or above 4.5:1 against its blob and the inactive label at or above 4.5:1 against the bar; the adaptive recipe also ships a dark-scheme palette that holds the same ratios. Disabled items fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "La barra es un elemento nav con una etiqueta accesible. Los elementos son anclas reales cuando reciben un href y botones reales en caso contrario, así que se alcanzan por teclado en el orden del código, son enfocables y se operan con Enter (y Espacio en la forma de botón) sin ningún manejo sintético de teclas. El elemento activo lleva aria-current=\"page\" y un peso más fuerte, así que su estado nunca se señala solo con el relleno líquido. El indicador gooey — las dos gotas y el filtro SVG de metaball que las fusiona — es decoración aria-hidden y nunca entra en el árbol de accesibilidad, así que la tecnología de asistencia oye exactamente un elemento activo y ningún ruido de animación. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina. El movimiento se suprime bajo prefers-reduced-motion: el filtro se limpia a none para que no haya deformación, la transición se descarta para que no haya deslizamiento y la gota aparece directamente en el elemento activo; como la capa se arma solo tras su primera medición, nunca llega ni se estira desde una esquina, ni siquiera en la primera pintura. Con JavaScript desactivado o antes de la hidratación el deslizador queda apagado y el elemento activo pinta su propia ficha, así que el elemento actual queda marcado en cada etapa. En forced-colors se descartan rellenos, degradados, sombras y el filtro SVG, así que la capa gooey decorativa se oculta por completo y el elemento activo se marca en su lugar con un color de sistema (CanvasText) sobre un borde inferior siempre reservado en el modelo de caja; el anillo de foco cambia al color de sistema Highlight. La indicación de actividad, por tanto, nunca depende de un relleno o filtro que el sistema descarta. Contraste: en cada material la etiqueta activa mide 4,5:1 o más contra su gota y la etiqueta inactiva 4,5:1 o más contra la barra; la receta adaptativa además incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los elementos deshabilitados bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/gooey-nav.tsx",
  Preview: GooeyNavPreview,
};
