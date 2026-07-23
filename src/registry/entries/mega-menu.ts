import { MegaMenuPreview } from "@/registry/previews/mega-menu-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the mega-menu component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "mega-menu",
  name: "Mega Menu",
  nameEs: "Megamenú",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A horizontal bar of triggers that drop a full-width panel of grouped link columns beneath the bar. Hand-rolled with no portal: the panel is absolutely positioned inside a relative, isolated wrapper and only one panel is ever open at a time. Each trigger is a real disclosure button with aria-haspopup, aria-expanded and a rotating caret; each column is a real heading over a list of real anchors. Four material recipes and three sizes.",
  descriptionEs:
    "Una barra horizontal de disparadores que despliegan un panel a todo el ancho con columnas de enlaces agrupados bajo la barra. Hecho a mano y sin portal: el panel se posiciona en absoluto dentro de un contenedor relativo y aislado, y solo hay un panel abierto a la vez. Cada disparador es un botón de divulgación real con aria-haspopup, aria-expanded y un cursor que rota; cada columna es un encabezado real sobre una lista de anclas reales. Cuatro recetas de material y tres tamaños.",
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
    "The bar is a nav element with an accessible label — a real landmark. Every top-level item is a real <button> carrying aria-haspopup=\"true\", aria-expanded that reflects its open state, and aria-controls that points at the panel only while it is mounted; its open state is never colour alone, since aria-expanded and a caret that rotates 180 degrees both carry it. The panel is a role=\"region\" labelled by its trigger, holding one real heading per column (its rank is a prop so it fits the surrounding outline) over a list whose accessible name is that heading. Every destination is a real <a href> with a visible label, so the browser handles Enter, middle-click and open-in-new-tab; a link marked current takes aria-current=\"page\" plus a heavier weight and a reserved left rule, so the active page is never signalled by colour alone. Keyboard: Tab reaches every trigger in source order; Enter, Space or ArrowDown opens a trigger's panel and moves focus to the first link; ArrowUp and ArrowDown rove among the links with focus actually moving (roving tabindex), Home and End jump to the ends; Escape closes and returns focus to the trigger, and Tab or a pointer press outside closes. Only one panel is open at a time. Focus shows a 2px offset ring on :focus-visible using the material's ring token and is never removed; the focused link is also washed via real :focus. Under prefers-reduced-motion the panel's entrance drop is dropped but its resting open state is the keyframe end-state, so the panel still appears fully open and the caret still rotates. In forced-colors fills, gradients, backdrop blur and shadows are discarded: the bar and panel keep their bounds with a CanvasText border, the panel backs onto Canvas, the open trigger is marked with a system colour on a top border that is always reserved in the box model, a current link keeps its reserved rule in CanvasText, hovered and focused links take a Highlight fill with HighlightText, informative glyphs use CanvasText and the focus ring switches to Highlight. Contrast: on every material the trigger label, column heading, link label and sub-copy all measure at or above 4.5:1 against their surface, and the adaptive recipe ships a dark-scheme palette that holds the same ratios. Disabled triggers fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "La barra es un elemento nav con una etiqueta accesible: un punto de referencia real. Cada elemento de nivel superior es un <button> real con aria-haspopup=\"true\", aria-expanded que refleja su estado abierto y aria-controls que apunta al panel solo mientras está montado; su estado abierto nunca es solo color, ya que lo transmiten aria-expanded y un cursor que rota 180 grados. El panel es un role=\"region\" etiquetado por su disparador, con un encabezado real por columna (su rango es una prop para que encaje en el esquema del documento) sobre una lista cuyo nombre accesible es ese encabezado. Cada destino es un <a href> real con una etiqueta visible, así que el navegador maneja Enter, el clic central y abrir en pestaña nueva; un enlace marcado como actual lleva aria-current=\"page\" además de un peso más fuerte y una regla izquierda reservada, así que la página activa nunca se señala solo con color. Teclado: Tab alcanza cada disparador en el orden del código; Enter, Espacio o Flecha abajo abren el panel de un disparador y mueven el foco al primer enlace; Flecha arriba y abajo recorren los enlaces moviendo el foco de verdad (tabindex itinerante), Inicio y Fin van a los extremos; Escape cierra y devuelve el foco al disparador, y Tab o una pulsación fuera cierran. Solo hay un panel abierto a la vez. El foco muestra un anillo de 2px con desplazamiento en :focus-visible usando el token de anillo del material y nunca se elimina; el enlace enfocado también se lava mediante :focus real. Bajo prefers-reduced-motion se descarta la caída de entrada del panel, pero su estado abierto en reposo es el final del fotograma clave, así que el panel aparece completamente abierto y el cursor sigue rotando. En forced-colors se descartan rellenos, degradados, desenfoque de fondo y sombras: la barra y el panel mantienen sus límites con un borde CanvasText, el panel se apoya en Canvas, el disparador abierto se marca con un color de sistema sobre un borde superior siempre reservado en el modelo de caja, un enlace actual mantiene su regla reservada en CanvasText, los enlaces al pasar o enfocar toman un relleno Highlight con HighlightText, los glifos informativos usan CanvasText y el anillo de foco cambia a Highlight. Contraste: en cada material la etiqueta del disparador, el encabezado de columna, la etiqueta del enlace y el texto de apoyo miden 4,5:1 o más contra su superficie, y la receta adaptativa incluye una paleta para esquema oscuro que mantiene las mismas proporciones. Los disparadores deshabilitados bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/mega-menu.tsx",
  Preview: MegaMenuPreview,
};
