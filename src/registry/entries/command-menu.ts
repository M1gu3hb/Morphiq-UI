import { CommandMenuPreview } from "@/registry/previews/command-menu-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the command-menu component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "command-menu",
  name: "Command Menu",
  nameEs: "Menú de comandos",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A ⌘K-style command palette: a trigger opens a panel with a filter input above a grouped, scrollable command list, filtered in memory, across four material recipes and three sizes, with a full combobox keyboard model.",
  descriptionEs:
    "Una paleta de comandos estilo ⌘K: un disparador abre un panel con un campo de filtro sobre una lista de comandos agrupada y desplazable, filtrada en memoria, en cuatro recetas de material y tres tamaños, con un modelo de teclado de combobox completo.",
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
    "A trigger <button> carries a visible label (its accessible name), aria-haspopup=\"dialog\", aria-expanded that reflects the open state, aria-controls that points at the panel only while it is mounted, and aria-keyshortcuts advertising ⌘K / Ctrl+K; a document-level ⌘K / Ctrl+K listener (registered only while mounted, SSR-safe) toggles the palette. Opening moves DOM focus to the filter input and keeps it there. The input is a role=\"combobox\" with aria-expanded, aria-autocomplete=\"list\", aria-controls pointing at the role=\"listbox\", and aria-activedescendant pointing at the active option's stable id; selection is VIRTUAL — focus is never moved onto an option. Each command is a role=\"option\" with a stable id and aria-selected on the active one; commands are clustered in role=\"group\" regions named by aria-label, with an aria-hidden visible heading so the name is not announced twice. Keyboard: ArrowDown/ArrowUp move aria-activedescendant through the visible options (wrapping, skipping disabled), Enter runs the active command, Escape closes and returns focus to the trigger (and stops propagation so it does not also close an enclosing dialog), Tab closes, and a pointer press outside closes. Filtering is a case-insensitive substring over the labels; an empty-state row is shown when nothing matches and a visually-hidden aria-live=\"polite\" region announces the result count. The active option is never signalled by colour alone: aria-selected pairs with the wash. Focus is shown with a 2px offset ring on :focus-visible (and a data-[focus=true] mirror for docs) and is never removed. Under prefers-reduced-motion the panel entrance and the trigger's hover lift and press travel are dropped, but the pressed inset well still applies instantly on :active. In forced-colors the panel keeps its bounds with a CanvasText border on a Canvas fill, the active option takes a Highlight/HighlightText mark, the focus ring becomes Highlight, and informative glyphs use CanvasText while washes and backdrop blur are cleared. Contrast: every material keeps Button's measured primary tokens (>= 4.5:1) for the trigger label, and each panel pairs a dark ink with a light surface (or the reverse in adaptive dark) so option text, group headings and the input placeholder all stay >= 4.5:1.",
  a11yEs:
    "Un <button> disparador lleva una etiqueta visible (su nombre accesible), aria-haspopup=\"dialog\", aria-expanded que refleja el estado abierto, aria-controls que apunta al panel solo mientras está montado y aria-keyshortcuts que anuncia ⌘K / Ctrl+K; un listener de nivel documento para ⌘K / Ctrl+K (registrado solo mientras está montado, seguro para SSR) alterna la paleta. Al abrir, el foco del DOM pasa al campo de filtro y permanece ahí. El campo es un role=\"combobox\" con aria-expanded, aria-autocomplete=\"list\", aria-controls que apunta al role=\"listbox\" y aria-activedescendant que apunta al id estable de la opción activa; la selección es VIRTUAL: el foco nunca se mueve a una opción. Cada comando es un role=\"option\" con un id estable y aria-selected en el activo; los comandos se agrupan en regiones role=\"group\" nombradas por aria-label, con un encabezado visible aria-hidden para no anunciar el nombre dos veces. Teclado: Flecha abajo/arriba mueven aria-activedescendant por las opciones visibles (con envoltura, saltando las deshabilitadas), Enter ejecuta el comando activo, Escape cierra y devuelve el foco al disparador (y detiene la propagación para no cerrar también un diálogo contenedor), Tab cierra y una pulsación fuera cierra. El filtrado es una subcadena sin distinción de mayúsculas sobre las etiquetas; se muestra una fila de estado vacío cuando nada coincide y una región aria-live=\"polite\" oculta anuncia el recuento de resultados. La opción activa nunca se señala solo con color: aria-selected acompaña al fondo. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (y un espejo data-[focus=true] para la documentación) y nunca se elimina. Bajo prefers-reduced-motion se descartan la entrada del panel y la elevación y el recorrido de pulsación del disparador, pero el hundimiento interior del estado pulsado se aplica al instante en :active. En forced-colors el panel mantiene sus límites con un borde CanvasText sobre un relleno Canvas, la opción activa toma una marca Highlight/HighlightText, el anillo de foco pasa a Highlight y los glifos informativos usan CanvasText mientras se limpian los fondos y el desenfoque. Contraste: cada material conserva los tokens primarios medidos del Button (>= 4,5:1) para la etiqueta del disparador, y cada panel combina una tinta oscura con una superficie clara (o al revés en adaptive oscuro) para que el texto de las opciones, los encabezados de grupo y el marcador de posición se mantengan >= 4,5:1.",
  sourcePath: "src/registry/ui/command-menu.tsx",
  Preview: CommandMenuPreview,
};
