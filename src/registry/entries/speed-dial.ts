import { SpeedDialPreview } from "@/registry/previews/speed-dial-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the speed-dial component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "speed-dial",
  name: "Speed Dial",
  nameEs: "Marcación rápida",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A floating action button that expands a vertical stack of secondary actions above it, with a staggered rise, a plus-to-x toggle glyph, four material recipes, three sizes, and full menu-button keyboard support.",
  descriptionEs:
    "Un botón de acción flotante que despliega hacia arriba una pila vertical de acciones secundarias, con una entrada escalonada, un glifo que pasa de más a equis, cuatro recetas de material, tres tamaños y soporte de teclado completo de botón-menú.",
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
    "A floating action button that toggles a vertical stack of secondary actions above it. The FAB is a real native <button> with a required accessible name (aria-label, default \"Actions\"), aria-haspopup=\"menu\", aria-expanded that reflects the open state, and aria-controls that points at the menu only while it is mounted. Its open state is never colour alone: aria-expanded plus a plus-to-x glyph (a cross-fading, rotating icon) carry it. The revealed actions form a role=\"menu\" of role=\"menuitem\" buttons, each with its own aria-label; a decorative floating label repeats that name for sighted users. Keyboard: Click/Enter/Space open the menu and focus the action nearest the FAB; ArrowUp opens onto that first action and ArrowDown opens onto the last; within the open menu ArrowUp/ArrowDown rove focus between items (focus MOVES to the item, skipping disabled ones), Home/End jump to the ends, Enter/Space activate (the items are real buttons), Escape and Tab close and return focus to the FAB, and a pointer press outside closes. Focus is shown with a 2px offset ring that is never removed; the roving item is marked by a ring driven by real :focus. Under prefers-reduced-motion the actions still appear but with an opacity-only fade and NO translate rise, the plus/x glyph swaps instantly, and the pressed inset still applies on :active so the tactile feedback is preserved. In forced-colors the FAB and each action keep their bounds with a CanvasText border, the focused action takes a Highlight/HighlightText fill, the focus ring becomes Highlight, and informative glyphs use CanvasText. Contrast: every material keeps glyph and label contrast >= 4.5:1 — the FAB inherits Button's measured primary tokens, and each action pairs a dark ink with a light menu surface (reversed in adaptive dark).",
  a11yEs:
    "Un botón de acción flotante que alterna una pila vertical de acciones secundarias por encima de él. El FAB es un <button> nativo real con un nombre accesible obligatorio (aria-label, por defecto \"Actions\"), aria-haspopup=\"menu\", aria-expanded que refleja el estado abierto y aria-controls que apunta al menú solo mientras está montado. Su estado abierto nunca es solo color: lo transmiten aria-expanded y un glifo que pasa de más a equis (un icono que se funde y rota). Las acciones reveladas forman un role=\"menu\" de botones role=\"menuitem\", cada uno con su propio aria-label; una etiqueta flotante decorativa repite ese nombre para las personas videntes. Teclado: Clic/Enter/Espacio abren el menú y enfocan la acción más cercana al FAB; Flecha arriba abre sobre esa primera acción y Flecha abajo sobre la última; dentro del menú abierto Flecha arriba/abajo mueven el foco entre elementos (el foco SE MUEVE al elemento, saltando los deshabilitados), Inicio/Fin van a los extremos, Enter/Espacio activan (los elementos son botones reales), Escape y Tab cierran y devuelven el foco al FAB, y una pulsación fuera cierra. El foco se muestra con un anillo de 2px con desplazamiento que nunca se elimina; el elemento itinerante se marca con un anillo activado por :focus real. Bajo prefers-reduced-motion las acciones aún aparecen pero con un fundido solo de opacidad y SIN elevación de traslación, el glifo más/equis se intercambia al instante, y el hundimiento interior aún se aplica en :active conservando la respuesta táctil. En forced-colors el FAB y cada acción mantienen sus límites con un borde CanvasText, la acción enfocada toma un relleno Highlight/HighlightText, el anillo de foco pasa a Highlight y los glifos informativos usan CanvasText. Contraste: cada material mantiene el contraste de glifo y etiqueta >= 4,5:1: el FAB hereda los tokens primarios medidos del Button y cada acción combina una tinta oscura con una superficie clara (invertida en adaptive oscuro).",
  sourcePath: "src/registry/ui/speed-dial.tsx",
  Preview: SpeedDialPreview,
};
