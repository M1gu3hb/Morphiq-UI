import { TabsPreview } from "@/registry/previews/tabs-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the tabs component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "tabs",
  name: "Tabs",
  nameEs: "Pestañas",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A composable tabbed surface with four material recipes, three treatments and three sizes. The keyboard mechanics are Radix's — roving tabindex, arrow keys, the tablist/tab/tabpanel wiring — and this component supplies appearance without fighting any of it.",
  descriptionEs:
    "Una superficie con pestañas componible, con cuatro recetas de material, tres tratamientos y tres tamaños. La mecánica de teclado es la de Radix — tabindex móvil, flechas y el cableado tablist/tab/tabpanel — y este componente aporta apariencia sin pelearse con nada de eso.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "pill", label: "Pill", labelEs: "Píldora" },
    { id: "underline", label: "Underline", labelEs: "Subrayado" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["@radix-ui/react-tabs", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Built on @radix-ui/react-tabs, so the behaviour is the primitive's rather than a reimplementation: role=\"tablist\", role=\"tab\" and role=\"tabpanel\", the aria-controls and aria-labelledby pairing, a roving tabindex where only the active tab is in the tab order, arrow / Home / End navigation, and a panel that is focusable so a keyboard user can reach content holding no controls of its own. That panel focus is given a visible ring here, because Radix makes the panel focusable but does not style it. activationMode passes through, so a tabbed surface with expensive panels can require Enter or Space instead of mounting on arrow. Focus shows a 2px offset ring on :focus-visible and is never removed. Motion is suppressed under prefers-reduced-motion. In forced-colors mode fills are discarded, so the active tab is marked with a system colour on a bottom border that is already reserved in the box model in every treatment — the indication never depends on a background that mode throws away. State is never carried by colour alone: the underline treatment pairs its accent rule with a weight and opacity change. Contrast: active and inactive labels both measure at or above 4.5:1 on every material. The lowest is the glass inactive label at 5.03:1 against its own tint composited over the worst-case backdrop, and the lowest active label is clay at 6.44:1. Where a treatment has no track of its own — pill and underline — the inactive label inherits the host's colour instead of pinning one; at the 70% opacity used to de-emphasise it that still measures 6.16:1 on the Morphiq paper background. The accent rule is a non-text indicator and measures 4.1:1 at its lowest, above the 3:1 that WCAG asks of it. Disabled tabs fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "Construido sobre @radix-ui/react-tabs, así que el comportamiento es el de la primitiva y no una reimplementación: role=\"tablist\", role=\"tab\" y role=\"tabpanel\", el emparejamiento aria-controls con aria-labelledby, un tabindex móvil donde solo la pestaña activa entra en el orden de tabulación, navegación con flechas / Inicio / Fin, y un panel enfocable para que quien usa teclado alcance contenido que no tiene controles propios. A ese foco del panel se le da aquí un anillo visible, porque Radix lo hace enfocable pero no lo estiliza. activationMode se pasa tal cual, así que una superficie con paneles costosos puede exigir Enter o Espacio en vez de montarse con las flechas. El foco muestra un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina. El movimiento se suprime bajo prefers-reduced-motion. En forced-colors se descartan los rellenos, así que la pestaña activa se marca con un color de sistema sobre un borde inferior que ya está reservado en el modelo de caja en los tres tratamientos — la indicación nunca depende de un fondo que ese modo tira. El estado nunca se transmite solo con color: el tratamiento subrayado acompaña su regla de acento con un cambio de peso y de opacidad. Contraste: las etiquetas activa e inactiva miden 4,5:1 o más en cada material. El mínimo es la etiqueta inactiva de vidrio con 5,03:1 contra su propio tinte compuesto sobre el peor fondo posible, y la etiqueta activa más baja es la de clay con 6,44:1. Donde un tratamiento no tiene pista propia — píldora y subrayado — la etiqueta inactiva hereda el color del anfitrión en vez de fijar uno; con el 70% de opacidad que la atenúa sigue midiendo 6,16:1 sobre el fondo papel de Morphiq. La regla de acento es un indicador no textual y mide 4,1:1 en su punto más bajo, por encima del 3:1 que le pide WCAG. Las pestañas deshabilitadas bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/tabs.tsx",
  Preview: TabsPreview,
};
