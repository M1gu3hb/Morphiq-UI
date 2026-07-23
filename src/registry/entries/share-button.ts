import { ShareButtonPreview } from "@/registry/previews/share-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the share-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "share-button",
  name: "Share Button",
  nameEs: "Botón de compartir",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A trigger that opens a focus-trapped popover of share destinations (X, Facebook, LinkedIn, Email) plus a Copy link action, across four material recipes and three sizes.",
  descriptionEs:
    "Un disparador que abre un popover con foco atrapado con destinos para compartir (X, Facebook, LinkedIn, correo) más una acción de copiar enlace, en cuatro recetas de material y tres tamaños.",
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
    "The trigger is a real native <button> with a visible text label, aria-haspopup=\"dialog\", aria-expanded that reflects the open state, and aria-controls that points at the popover only while it is mounted; its open state is never colour alone (aria-expanded plus the mounted dialog carry it). The surface is a role=\"dialog\" with aria-modal=\"true\", named by its visible heading via aria-labelledby. Each destination is a real anchor (or button) with a text label; its leading icon is aria-hidden. Focus is TRAPPED inside the popover: opening moves focus to the first control, and Tab / Shift+Tab wrap at the boundaries so focus never leaves. Escape closes and returns focus to the trigger (and stops propagation so an enclosing Escape-closable ancestor is not also dismissed); a pointer press outside closes. Copy link writes to an always-mounted aria-live=\"polite\" region (\"Link copied\") and shows a visible Check icon with a \"Copied\" label, so the confirmation is never carried by colour alone. Focus is shown with a 2px offset ring on :focus-visible (mirrored on data-[focus=true] for the docs) and is never removed; the focused destination is marked by a background wash driven by real :focus. Under prefers-reduced-motion the hover lift, press travel and the popover's entrance are dropped, but the pressed inset well still applies instantly on :active. In forced-colors the surfaces keep their bounds with a CanvasText border, the hovered/focused item takes a Highlight fill, the focus ring becomes Highlight, and informative glyphs use CanvasText. Contrast: every material inherits Button's measured primary tokens (>= 4.5:1) for the trigger label, and the popover pairs a dark ink with a light surface (or the reverse in adaptive dark) so item text stays >= 4.5:1.",
  a11yEs:
    "El disparador es un <button> nativo real con una etiqueta de texto visible, aria-haspopup=\"dialog\", aria-expanded que refleja el estado abierto y aria-controls que apunta al popover solo mientras está montado; su estado abierto nunca es solo color (lo transmiten aria-expanded y el diálogo montado). La superficie es un role=\"dialog\" con aria-modal=\"true\", nombrado por su encabezado visible mediante aria-labelledby. Cada destino es un enlace (o botón) real con etiqueta de texto; su icono inicial es aria-hidden. El foco queda ATRAPADO dentro del popover: al abrir, el foco pasa al primer control, y Tab / Shift+Tab dan la vuelta en los límites para que el foco nunca salga. Escape cierra y devuelve el foco al disparador (y detiene la propagación para no descartar también un ancestro cerrable con Escape); una pulsación fuera cierra. Copiar enlace escribe en una región aria-live=\"polite\" siempre montada (\"Link copied\") y muestra un icono de verificación visible con la etiqueta \"Copied\", así la confirmación nunca depende solo del color. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (reflejado en data-[focus=true] para la documentación) y nunca se elimina; el destino enfocado se marca con un fondo activado por :focus real. Bajo prefers-reduced-motion se descartan la elevación al pasar, el recorrido de pulsación y la entrada del popover, pero el hundimiento interior del estado pulsado se aplica al instante en :active. En forced-colors las superficies mantienen sus límites con un borde CanvasText, el elemento enfocado o bajo el cursor toma un relleno Highlight, el anillo de foco pasa a Highlight y los glifos informativos usan CanvasText. Contraste: cada material hereda los tokens primarios medidos del Button (>= 4,5:1) para la etiqueta del disparador, y el popover combina una tinta oscura con una superficie clara (o al revés en adaptive oscuro) para que el texto de los elementos se mantenga >= 4,5:1.",
  sourcePath: "src/registry/ui/share-button.tsx",
  Preview: ShareButtonPreview,
};
