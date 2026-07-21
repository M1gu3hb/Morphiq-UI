import { TogglePreview } from "@/registry/previews/toggle-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the toggle component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
    slug: "toggle",
    name: "Toggle",
    nameEs: "Interruptor",
    category: "inputs",
    materials: ["clay", "glass", "skeuo", "adaptive"],
    description:
      "An on/off switch with four material recipes, three presentations, and three sizes. Works controlled or uncontrolled, and rides on a native button so keyboard and hit-testing are the browser's, not a reimplementation.",
    descriptionEs:
      "Un interruptor on/off con cuatro recetas de material, tres presentaciones y tres tamaños. Funciona controlado o no controlado, y va montado sobre un button nativo para que el teclado y el área de pulsación sean los del navegador, no una reimplementación.",
    variants: [
      { id: "default", label: "Default", labelEs: "Por defecto" },
      { id: "labeled", label: "Labeled", labelEs: "Con texto" },
      { id: "icon", label: "Icon", labelEs: "Con icono" },
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
      "Renders a native <button type=\"button\"> carrying role=\"switch\" and aria-checked, so both Space and Enter toggle it, it sits in the tab order, and its hit area is the browser's — none of that is reimplemented. The accessible name comes from the visible text child; pass aria-label or aria-labelledby instead when the switch ships without one. The ON/OFF captions in the labeled variant and the glyphs in the icon variant are aria-hidden, because aria-checked already conveys the state and announcing it twice would fight the control's own name. Loading sets aria-busy and blocks activation while deliberately keeping the control focusable, so the busy announcement stays reachable; disabled uses the native attribute, which is correct for a form control. The thumb transition is suppressed under prefers-reduced-motion, and in forced-colors mode the track and thumb switch to system colors so the control does not collapse into an empty outline once fills are discarded. Contrast: every caption measures at or above 4.5:1 against the track it sits on, and the glass recipes carry their own tint so that holds over a white and a black backdrop alike. The visible text label inherits the host's color rather than pinning one, so it stays legible on whatever surface the switch is placed on.",
    a11yEs:
      "Renderiza un <button type=\"button\"> nativo con role=\"switch\" y aria-checked, así que tanto Espacio como Enter lo alternan, entra en el orden de tabulación y su área de pulsación es la del navegador — nada de eso está reimplementado. El nombre accesible sale del texto visible que recibe como hijo; si el interruptor va sin texto, pasa aria-label o aria-labelledby. Las leyendas ON/OFF de la variante con texto y los glifos de la variante con icono llevan aria-hidden, porque aria-checked ya comunica el estado y anunciarlo dos veces competiría con el nombre del propio control. El estado de carga activa aria-busy y bloquea la activación manteniendo el control enfocable a propósito, para que el anuncio de ocupado siga siendo alcanzable; deshabilitado usa el atributo nativo, que es lo correcto en un control de formulario. La transición del thumb se suprime bajo prefers-reduced-motion, y en forced-colors la pista y el thumb pasan a colores de sistema para que el control no se quede en un contorno vacío al descartarse los rellenos. Contraste: cada leyenda mide 4,5:1 o más contra la pista sobre la que va, y las recetas de vidrio llevan su propio tinte para que eso se cumpla igual sobre fondo blanco que negro. La etiqueta de texto visible hereda el color del anfitrión en vez de fijar uno, así que sigue legible sobre cualquier superficie donde se coloque el interruptor.",
    sourcePath: "src/registry/ui/toggle.tsx",
    Preview: TogglePreview,
  };
