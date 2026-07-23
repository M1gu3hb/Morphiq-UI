import { DropdownMenuPreview } from "@/registry/previews/dropdown-menu-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the dropdown-menu component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "dropdown-menu",
  name: "Dropdown Menu",
  nameEs: "Menú desplegable",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A single trigger button that discloses a menu of actions, across four material recipes and three sizes, with optional item icons, disabled items, group separators, and full menu-button keyboard support.",
  descriptionEs:
    "Un único botón disparador que despliega un menú de acciones, en cuatro recetas de material y tres tamaños, con iconos opcionales, elementos deshabilitados, separadores de grupo y soporte de teclado completo de botón-menú.",
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
    "Built from one real native <button> trigger whose accessible name is its visible label. It declares aria-haspopup=\"menu\", aria-expanded that reflects the open state, and aria-controls that points at the menu only while it is mounted. Its open state is never colour alone: aria-expanded and a rotating chevron carry it. Clicking the trigger, or pressing ArrowDown/ArrowUp on it, opens the menu on the first/last item and moves focus into it. The surface is a role=\"menu\" of role=\"menuitem\" buttons (with optional <hr> separators, role=\"separator\", between groups) and a full roving-focus keyboard model — ArrowDown/ArrowUp move focus among items (skipping disabled items and separators), Home/End jump to the ends, Enter/Space activate (the items are real buttons), Escape and Tab close and return focus to the trigger, and a pointer press outside closes. The menu is labelled by the trigger via aria-labelledby. Focus is shown with a 2px offset ring on :focus-visible and is never removed; the focused menu item is marked by a background wash driven by real :focus. Under prefers-reduced-motion the hover lift, the press travel, the chevron turn and the menu's entrance are dropped, but the pressed inset well still applies instantly on :active so the tactile feedback is preserved. In forced-colors the surfaces keep their bounds with a CanvasText border, the active menu item takes a Highlight/HighlightText fill, the focus ring becomes Highlight, and informative glyphs use CanvasText. Contrast: every material inherits Button's measured primary tokens (>= 4.5:1) for the trigger label, and each menu pairs a dark ink with a light surface (or the reverse in adaptive dark) so item text stays >= 4.5:1.",
  a11yEs:
    "Construido con un único <button> nativo real como disparador cuyo nombre accesible es su etiqueta visible. Declara aria-haspopup=\"menu\", aria-expanded que refleja el estado abierto y aria-controls que apunta al menú solo mientras está montado. Su estado abierto nunca es solo color: lo transmiten aria-expanded y un chevron que rota. Al hacer clic en el disparador, o al pulsar Flecha abajo/arriba sobre él, se abre el menú en el primer/último elemento y el foco pasa a él. La superficie es un role=\"menu\" de botones role=\"menuitem\" (con separadores <hr> opcionales, role=\"separator\", entre grupos) y un modelo de teclado de foco itinerante completo: Flecha abajo/arriba mueven el foco entre elementos (saltando los deshabilitados y los separadores), Inicio/Fin van a los extremos, Enter/Espacio activan (los elementos son botones reales), Escape y Tab cierran y devuelven el foco al disparador, y una pulsación fuera cierra. El menú se etiqueta desde el disparador mediante aria-labelledby. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina; el elemento enfocado se marca con un fondo activado por :focus real. Bajo prefers-reduced-motion se descartan la elevación al pasar, el recorrido de pulsación, el giro del chevron y la entrada del menú, pero el hundimiento interior del estado pulsado se aplica al instante en :active, conservando la respuesta táctil. En forced-colors las superficies mantienen sus límites con un borde CanvasText, el elemento activo del menú toma un relleno Highlight/HighlightText, el anillo de foco pasa a Highlight y los glifos informativos usan CanvasText. Contraste: cada material hereda los tokens primarios medidos del Button (>= 4,5:1) para la etiqueta del disparador, y cada menú combina una tinta oscura con una superficie clara (o al revés en adaptive oscuro) para que el texto de los elementos se mantenga >= 4,5:1.",
  sourcePath: "src/registry/ui/dropdown-menu.tsx",
  Preview: DropdownMenuPreview,
};
