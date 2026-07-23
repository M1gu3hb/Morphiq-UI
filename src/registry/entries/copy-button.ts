import { CopyButtonPreview } from "@/registry/previews/copy-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the copy-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "copy-button",
  name: "Copy Button",
  nameEs: "Botón de copiar",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A click-to-copy action with four material recipes and three sizes that swaps from a Copy glyph and \"Copy\" to a Check glyph and \"Copied\" on success, announcing the copy in a polite live region before reverting.",
  descriptionEs:
    "Una acción de copiar al hacer clic con cuatro recetas de material y tres tamaños que cambia de un ícono de copiar y \"Copy\" a un ícono de check y \"Copied\" al tener éxito, anunciando la copia en una región activa cortés antes de volver al estado inicial.",
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
    "Built on a native <button> with type=\"button\", so focus, keyboard activation and the disabled state come for free. Focus is shown with a 2px offset ring on :focus-visible (mirrored on data-focus for docs) and is never removed. The idle/copied distinction is never carried by colour alone: it swaps both the icon (a Copy glyph to a Check glyph) and the visible text (\"Copy\" to \"Copied\"), and success is announced in a persistent role=\"status\" aria-live=\"polite\" region reading \"Copied to clipboard\". The icon-only form forwards aria-label — or falls back to the current label text — so the control is never left unnamed, and its icons are aria-hidden. navigator.clipboard is feature-detected and touched only inside the click handler, so SSR and unsupported or insecure contexts never throw; the revert timer is cleared on unmount and on re-copy. Under prefers-reduced-motion the hover/press travel is dropped while the pressed inset well still applies instantly, preserving the tactile feedback. In forced-colors the fills and shadows are discarded but the border is pinned to CanvasText, the focus ring to Highlight, and the copied state is marked with the system Highlight colour. Labels meet or exceed 4.5:1 contrast on every material, reusing the Button's measured primary-intent tokens.",
  a11yEs:
    "Construido sobre un <button> nativo con type=\"button\", así que el foco, la activación por teclado y el estado deshabilitado funcionan sin esfuerzo. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (replicado en data-focus para la documentación) y nunca se elimina. La distinción inactivo/copiado nunca se transmite solo con color: cambia tanto el ícono (de copiar a check) como el texto visible (\"Copy\" a \"Copied\"), y el éxito se anuncia en una región persistente role=\"status\" aria-live=\"polite\" que dice \"Copied to clipboard\". La forma de solo ícono reenvía aria-label — o recurre al texto de la etiqueta actual — para que el control nunca quede sin nombre, y sus íconos son aria-hidden. navigator.clipboard se detecta por característica y se accede solo dentro del manejador de clic, así que el SSR y los contextos no compatibles o inseguros nunca lanzan error; el temporizador de reversión se limpia al desmontar y al recopiar. Bajo prefers-reduced-motion se elimina el desplazamiento de hover/pulsación mientras el pozo interior de presión se aplica al instante, preservando la retroalimentación táctil. En forced-colors se descartan los rellenos y las sombras pero el borde se fija a CanvasText, el anillo de foco a Highlight y el estado copiado se marca con el color Highlight del sistema. Las etiquetas cumplen o superan un contraste de 4,5:1 en cada material, reutilizando los tokens de intención primaria medidos del Button.",
  sourcePath: "src/registry/ui/copy-button.tsx",
  Preview: CopyButtonPreview,
};
