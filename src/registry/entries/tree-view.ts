import { TreeViewPreview } from "@/registry/previews/tree-view-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Tree View. */
export const entry: RegistryEntry = {
  slug: "tree-view",
  name: "Tree View",
  nameEs: "Vista de Árbol",
  category: "data",
  materials: ["adaptive"],
  description:
    "A collapsible hierarchical tree built from a {id,label,children?}[] prop, with a full WAI-ARIA tree role model, roving-tabindex arrow-key navigation, and a rotating chevron whose orientation — never colour — carries the expanded state.",
  descriptionEs:
    "Un árbol jerárquico colapsable construido desde una prop {id,label,children?}[], con el modelo de roles WAI-ARIA de árbol completo, navegación con teclas de flecha por tabindex móvil, y un chevron que rota cuyo orientación —nunca el color— transmite el estado expandido.",
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
    "The visual is the accessible widget: the root is role=\"tree\" with an aria-label, each node is a role=\"treeitem\" carrying aria-level, aria-setsize, aria-posinset and aria-selected, parents also carry aria-expanded, and every child list is a role=\"group\", so a screen reader reads the real hierarchy, position and state. Expansion is never carried by colour: it is announced by aria-expanded and shown to sighted users by the chevron's orientation, a shape that rotates ninety degrees when open, so the open and closed states survive with colour off. Selection is never carried by colour either: it is announced by aria-selected and shown by a heavier font weight in addition to the tint, so it reads without perceiving the fill. Keyboard model with roving tabindex: exactly one treeitem is tabbable, ArrowUp and ArrowDown move to the previous and next visible item, ArrowRight expands a collapsed parent then steps into its first child, ArrowLeft collapses an open parent then steps out to its parent, Home and End jump to the first and last visible item, and Enter or Space select the item while toggling a parent open; a supplementary sr-only summary states the item count and depth. The chevron rotation is a state transition whose resting value is the final orientation for the current state, so SSR, no-JS and reduced motion all show the correct chevron, and motion-reduce:transition-none drops the travel. In forced-colors mode the chevron becomes CanvasText, the selected row becomes Highlight and HighlightText and the focus ring becomes Highlight, so structure and state stay perceivable once fills are discarded. Row text meets 4.5:1 against a light and a dark surface. Every value is a prop and ids come from useId, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El elemento visual es el widget accesible: la raíz es role=\"tree\" con un aria-label, cada nodo es un role=\"treeitem\" que lleva aria-level, aria-setsize, aria-posinset y aria-selected, los padres además llevan aria-expanded, y cada lista de hijos es un role=\"group\", así que un lector de pantalla lee la jerarquía, posición y estado reales. La expansión nunca la transmite el color: la anuncia aria-expanded y se muestra a las personas videntes mediante la orientación del chevron, una forma que rota noventa grados al abrirse, así que los estados abierto y cerrado sobreviven sin color. La selección tampoco la transmite el color: la anuncia aria-selected y se muestra con un peso de fuente más fuerte además del tinte, así que se lee sin percibir el relleno. Modelo de teclado con tabindex móvil: exactamente un treeitem es tabulable, ArrowUp y ArrowDown se mueven al elemento visible anterior y siguiente, ArrowRight expande un padre colapsado y luego entra en su primer hijo, ArrowLeft colapsa un padre abierto y luego sale a su padre, Home y End saltan al primer y último elemento visible, y Enter o Espacio seleccionan el elemento mientras alternan un padre abierto; un resumen sr-only complementario indica la cantidad de elementos y la profundidad. La rotación del chevron es una transición de estado cuyo valor en reposo es la orientación final del estado actual, así que SSR, sin-JS y movimiento reducido muestran el chevron correcto, y motion-reduce:transition-none elimina el recorrido. En modo forced-colors el chevron pasa a CanvasText, la fila seleccionada pasa a Highlight y HighlightText y el anillo de foco pasa a Highlight, así que la estructura y el estado siguen siendo perceptibles una vez descartados los rellenos. El texto de fila cumple 4,5:1 sobre una superficie clara y una oscura. Cada valor es una prop y los ids provienen de useId, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/tree-view.tsx",
  Preview: TreeViewPreview,
};
