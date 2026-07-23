import { ContextMenuPreview } from "@/registry/previews/context-menu-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the context-menu component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "context-menu",
  name: "Context Menu",
  nameEs: "Menú contextual",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A right-click menu over a target region that opens at the pointer — clamped to stay inside its wrapper — across four material recipes and three sizes, with full roving-focus menu keyboard support.",
  descriptionEs:
    "Un menú contextual sobre una región objetivo que se abre en el puntero — ajustado para permanecer dentro de su contenedor — en cuatro recetas de material y tres tamaños, con soporte de teclado de foco itinerante completo.",
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
    "The target region is a focusable element (tabIndex 0) that advertises its menu with aria-haspopup=\"menu\" and a required accessible name (aria-label), backed by a visible \"Right-click to open the menu\" hint so the affordance is never colour alone. It opens on the contextmenu event (right-click), which is cancelled so the platform menu is replaced by ours at the pointer, and also from the keyboard while the region is focused — Shift+F10 or the ContextMenu key — in which case it opens at the region's centre. The menu is a role=\"menu\" of role=\"menuitem\" buttons with a full roving-focus keyboard model: opening moves focus to the first item; ArrowDown/ArrowUp move focus among items (skipping disabled ones), Home/End jump to the ends, Enter/Space activate (the items are real buttons), Escape and Tab close and return focus to the region, and a pointer press outside closes. The open menu is clamped within the wrapper so it never overflows its bounds. Focus is shown with a 2px offset ring on :focus-visible (and a parallel data-[focus=true] hook for docs) and is never removed; the focused menu item is marked by a background wash driven by real :focus. Under prefers-reduced-motion the region's hover lift and press travel and the menu's entrance are dropped, but the pressed inset well still applies instantly on :active so the tactile feedback is preserved. In forced-colors the region and menu keep their bounds with a CanvasText border, the active menu item takes a Highlight/HighlightText fill, the focus ring becomes Highlight, informative glyphs use CanvasText, and background images and backdrop blur are cleared. Contrast: every material inherits Button's measured primary tokens (>= 4.5:1) for the region label, and each menu pairs a dark ink with a light surface (or the reverse in adaptive dark) so item text stays >= 4.5:1.",
  a11yEs:
    "La región objetivo es un elemento enfocable (tabIndex 0) que anuncia su menú con aria-haspopup=\"menu\" y un nombre accesible obligatorio (aria-label), respaldado por una pista visible «Right-click to open the menu» para que la posibilidad nunca sea solo color. Se abre con el evento contextmenu (clic derecho), que se cancela para reemplazar el menú del sistema por el nuestro en el puntero, y también desde el teclado mientras la región tiene el foco — Shift+F10 o la tecla ContextMenu — en cuyo caso se abre en el centro de la región. El menú es un role=\"menu\" de botones role=\"menuitem\" con un modelo de teclado de foco itinerante completo: al abrir, el foco pasa al primer elemento; Flecha abajo/arriba mueven el foco entre elementos (saltando los deshabilitados), Inicio/Fin van a los extremos, Enter/Espacio activan (los elementos son botones reales), Escape y Tab cierran y devuelven el foco a la región, y una pulsación fuera cierra. El menú abierto se ajusta dentro del contenedor para que nunca desborde sus límites. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (y un gancho paralelo data-[focus=true] para la documentación) y nunca se elimina; el elemento enfocado se marca con un fondo activado por :focus real. Bajo prefers-reduced-motion se descartan la elevación al pasar y el recorrido de pulsación de la región y la entrada del menú, pero el hundimiento interior del estado pulsado se aplica al instante en :active, conservando la respuesta táctil. En forced-colors la región y el menú mantienen sus límites con un borde CanvasText, el elemento activo del menú toma un relleno Highlight/HighlightText, el anillo de foco pasa a Highlight, los glifos informativos usan CanvasText y se limpian las imágenes de fondo y el desenfoque. Contraste: cada material hereda los tokens primarios medidos del Button (>= 4,5:1) para la etiqueta de la región, y cada menú combina una tinta oscura con una superficie clara (o al revés en adaptive oscuro) para que el texto de los elementos se mantenga >= 4,5:1.",
  sourcePath: "src/registry/ui/context-menu.tsx",
  Preview: ContextMenuPreview,
};
