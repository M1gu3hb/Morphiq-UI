import { ToggleButtonPreview } from "@/registry/previews/toggle-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the toggle-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "toggle-button",
  name: "Toggle Button",
  nameEs: "Botón de alternancia",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "An on/off action with four material recipes and three sizes whose pressed state sinks into a persistent per-material inset well and swaps a hollow Circle glyph for a Check, controlled or uncontrolled through aria-pressed.",
  descriptionEs:
    "Una acción de encendido/apagado con cuatro recetas de material y tres tamaños cuyo estado presionado se hunde en un pozo interior persistente por material y cambia un ícono de círculo hueco por un check, controlada o no controlada mediante aria-pressed.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Built on a native <button> with type=\"button\", so focus, Enter/Space activation and the :disabled state all come from the platform. The on/off state is exposed through aria-pressed, which reflects the current value in both the controlled (pressed + onPressedChange) and uncontrolled (defaultPressed) modes. Focus is shown with a 2px offset ring on :focus-visible (mirrored on data-focus for docs) and is never removed. The pressed state is never carried by colour alone: it swaps the leading glyph from a hollow Circle to a Check and holds a persistent, deeper inset well keyed on the pressed state rather than the momentary :active press — clay sinks ~3px into a warm well, skeuo ~4px onto a hard floor, and glass and adaptive dip ~1px. Under prefers-reduced-motion the hover/press travel is dropped while the pressed inset well is still applied instantly, so the tactile on feedback is preserved and only the animation is lost. In forced-colors the fills and shadows are discarded but the border is pinned to CanvasText, the focus ring to Highlight, and the pressed state is marked with the system Highlight colour so on stays distinguishable from off. Its icons are aria-hidden so they are never announced separately from the label. Labels meet or exceed 4.5:1 contrast on every material, reusing the Button's measured primary-intent tokens.",
  a11yEs:
    "Construido sobre un <button> nativo con type=\"button\", así que el foco, la activación con Enter/Espacio y el estado :disabled provienen de la plataforma. El estado encendido/apagado se expone mediante aria-pressed, que refleja el valor actual tanto en el modo controlado (pressed + onPressedChange) como en el no controlado (defaultPressed). El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (reflejado en data-focus para la documentación) y nunca se elimina. El estado presionado nunca se transmite solo con color: cambia el ícono principal de un círculo hueco a un check y mantiene un pozo interior persistente y más profundo, ligado al estado presionado en lugar de a la pulsación momentánea :active — clay se hunde ~3px en un pozo cálido, skeuo ~4px sobre un suelo duro, y glass y adaptive descienden ~1px. Bajo prefers-reduced-motion se elimina el desplazamiento de hover/pulsación mientras el pozo interior presionado se aplica al instante, así que la retroalimentación táctil de encendido se preserva y solo se pierde la animación. En forced-colors se descartan los rellenos y las sombras pero el borde se fija a CanvasText, el anillo de foco a Highlight y el estado presionado se marca con el color Highlight del sistema para que encendido se distinga de apagado. Sus íconos son aria-hidden para que nunca se anuncien por separado de la etiqueta. Las etiquetas cumplen o superan un contraste de 4,5:1 en cada material, reutilizando los tokens de intención primaria medidos del Button.",
  sourcePath: "src/registry/ui/toggle-button.tsx",
  Preview: ToggleButtonPreview,
};
