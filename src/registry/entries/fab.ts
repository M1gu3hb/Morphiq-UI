import { FabPreview } from "@/registry/previews/fab-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the FAB component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "fab",
  name: "FAB",
  nameEs: "Botón de acción flotante",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A circular, prominently elevated floating action button with four material recipes, three sizes, and an optional speed-dial that reveals a menu of labelled actions above it.",
  descriptionEs:
    "Un botón de acción flotante circular y muy elevado con cuatro recetas de material, tres tamaños y un marcado rápido opcional que despliega un menú de acciones etiquetadas encima de él.",
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
    "Renders a native <button> with type=\"button\" by default, so focus, keyboard activation and the :disabled look come from the platform. Because the control is icon-only, an accessible name is required — aria-label is a required prop and is forwarded to the button. Focus is shown with a 2px offset ring on :focus-visible and via a data-focus attribute for documentation, and is never removed. When an actions list is supplied the FAB becomes a menu button: it exposes aria-haspopup=\"menu\", aria-expanded, and aria-controls, and opens a role=\"menu\" of role=\"menuitem\" buttons above it. Roving tabindex plus ArrowDown/ArrowUp (wrapping), Home and End move focus between actions; Escape closes and returns focus to the FAB; an outside pointer press or choosing an action also closes it; ArrowDown/ArrowUp on the closed trigger open the dial onto the first/last action. State is never carried by colour alone: the open state folds the plus glyph 45 degrees into a cross and is announced through aria-expanded, and every action carries a visible text label beside its icon. Under prefers-reduced-motion the hover lift, the press travel and the staggered reveal are dropped, but the pressed inset well on :active still applies instantly and the actions still appear — the tactile feedback is preserved, only the animation is removed. In forced-colors the discarded fills and shadows fall back to a CanvasText border for the control's bounds, a Highlight focus ring, and informative glyphs painted in the system text colour. Contrast: every material reuses the button's primary-intent tokens, which measure at or above 4.5:1 for the glyph and any label on each surface.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, así que el foco, la activación por teclado y el aspecto :disabled vienen de la plataforma. Como el control solo tiene icono, se exige un nombre accesible: aria-label es una prop obligatoria y se reenvía al botón. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible y mediante un atributo data-focus para la documentación, y nunca se elimina. Cuando se pasa una lista de acciones, el FAB se convierte en un botón de menú: expone aria-haspopup=\"menu\", aria-expanded y aria-controls, y abre un role=\"menu\" de botones role=\"menuitem\" encima de él. Un tabindex rotatorio junto con ArrowDown/ArrowUp (con envoltura), Home y End mueven el foco entre acciones; Escape cierra y devuelve el foco al FAB; un clic fuera o elegir una acción también lo cierra; ArrowDown/ArrowUp sobre el disparador cerrado abren el marcado hacia la primera/última acción. El estado nunca depende solo del color: el estado abierto pliega el glifo de más 45 grados en una cruz y se anuncia mediante aria-expanded, y cada acción lleva una etiqueta de texto visible junto a su icono. Bajo prefers-reduced-motion se eliminan el ascenso al pasar el cursor, el recorrido de pulsación y la revelación escalonada, pero el hueco hundido en :active se aplica igual al instante y las acciones siguen apareciendo — se conserva la respuesta táctil y solo se quita la animación. En forced-colors, los rellenos y sombras descartados recurren a un borde CanvasText para los límites del control, un anillo de foco Highlight y glifos informativos pintados con el color de texto del sistema. Contraste: cada material reutiliza los tokens de intención primaria del botón, que miden 4,5:1 o más para el glifo y cualquier etiqueta sobre cada superficie.",
  sourcePath: "src/registry/ui/fab.tsx",
  Preview: FabPreview,
};
