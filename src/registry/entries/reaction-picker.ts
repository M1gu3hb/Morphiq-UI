import { ReactionPickerPreview } from "@/registry/previews/reaction-picker-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the reaction-picker component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "reaction-picker",
  name: "Reaction Picker",
  nameEs: "Selector de reacciones",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A messaging-style emoji reaction control: an icon trigger discloses a horizontal popover of reaction buttons, across four material recipes and three sizes, with full roving-focus keyboard support.",
  descriptionEs:
    "Un control de reacciones estilo mensajería: un botón con icono despliega un popover horizontal de botones de reacción, en cuatro recetas de material y tres tamaños, con soporte de teclado de foco itinerante completo.",
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
    "A single native <button> trigger with a required accessible name (aria-label, default \"Add reaction\", which becomes \"Current reaction: <label>. Change reaction\" once one is chosen), plus aria-haspopup=\"menu\", aria-expanded that reflects the open state, and aria-controls that points at the popover only while it is mounted. Its open state is never colour alone: aria-expanded carries it, and the current reaction is shown by its own glyph riding on the trigger. The popover is a role=\"menu\" of role=\"menuitem\" buttons laid out horizontally, each with a TEXT accessible name via aria-label (\"Love\", \"Laugh\", …) while the emoji glyph itself is aria-hidden, so meaning is never carried by the glyph alone. A full roving-focus keyboard model drives it: Click/Enter/Space open and move focus to the first reaction, ArrowRight/ArrowLeft rove among items (skipping disabled ones), Home/End jump to the ends, Enter/Space activate (the items are real buttons), Escape and Tab close and return focus to the trigger, and a pointer press outside closes; ArrowDown/ArrowRight on the closed trigger open on the first reaction and ArrowUp/ArrowLeft on the last. The chosen reaction is confirmed through an aria-live=\"polite\" status region (\"Reacted with Love\") that is present in the DOM before the text arrives, and the current item is marked with aria-current plus an accent ring — not colour alone, its accessible name gains \", current reaction\". Focus is shown with a 2px offset ring on :focus-visible and is never removed; the focused item is also marked by a background wash driven by real :focus. Under prefers-reduced-motion the trigger's hover lift and press travel, the emoji's pop scale, and the popover's entrance are dropped, but the pressed inset well still applies instantly on :active so the tactile feedback is preserved. In forced-colors the surfaces keep their bounds with a CanvasText border, the active item takes a Highlight fill, the current item keeps a CanvasText border, the focus ring becomes Highlight, and the trigger glyph uses CanvasText. Contrast: every material inherits Button's measured primary tokens (>= 4.5:1) for the trigger glyph, and the popover ink stays >= 4.5:1 against its surface on each material; the emoji are non-text glyphs paired with text labels rather than informative graphics load-bearing for contrast.",
  a11yEs:
    "Un único <button> nativo como disparador con un nombre accesible obligatorio (aria-label, por defecto \"Add reaction\", que pasa a \"Current reaction: <etiqueta>. Change reaction\" al elegir una), además de aria-haspopup=\"menu\", aria-expanded que refleja el estado abierto y aria-controls que apunta al popover solo mientras está montado. Su estado abierto nunca es solo color: lo transmite aria-expanded, y la reacción actual se muestra con su propio glifo sobre el disparador. El popover es un role=\"menu\" de botones role=\"menuitem\" dispuestos en horizontal, cada uno con un nombre accesible de TEXTO mediante aria-label (\"Love\", \"Laugh\", …) mientras el emoji en sí es aria-hidden, de modo que el significado nunca recae en el glifo solo. Lo gobierna un modelo de teclado de foco itinerante completo: Clic/Enter/Espacio abren y mueven el foco a la primera reacción, Flecha derecha/izquierda recorren los elementos (saltando los deshabilitados), Inicio/Fin van a los extremos, Enter/Espacio activan (los elementos son botones reales), Escape y Tab cierran y devuelven el foco al disparador, y una pulsación fuera cierra; Flecha abajo/derecha sobre el disparador cerrado abren en la primera reacción y Flecha arriba/izquierda en la última. La reacción elegida se confirma mediante una región aria-live=\"polite\" (\"Reacted with Love\") presente en el DOM antes de que llegue el texto, y el elemento actual se marca con aria-current y un anillo de acento —no solo color: su nombre accesible añade \", current reaction\". El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina; el elemento enfocado también se marca con un fondo activado por :focus real. Bajo prefers-reduced-motion se descartan la elevación al pasar y el recorrido de pulsación del disparador, el escalado del emoji y la entrada del popover, pero el hundimiento interior del estado pulsado se aplica al instante en :active, conservando la respuesta táctil. En forced-colors las superficies mantienen sus límites con un borde CanvasText, el elemento activo toma un relleno Highlight, el elemento actual conserva un borde CanvasText, el anillo de foco pasa a Highlight y el glifo del disparador usa CanvasText. Contraste: cada material hereda los tokens primarios medidos del Button (>= 4,5:1) para el glifo del disparador, y la tinta del popover se mantiene >= 4,5:1 sobre su superficie en cada material; los emoji son glifos no textuales acompañados de etiquetas de texto y no gráficos informativos de los que dependa el contraste.",
  sourcePath: "src/registry/ui/reaction-picker.tsx",
  Preview: ReactionPickerPreview,
};
