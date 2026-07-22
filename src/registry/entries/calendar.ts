import { CalendarPreview } from "@/registry/previews/calendar-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Calendar. */
export const entry: RegistryEntry = {
  slug: "calendar",
  name: "Calendar",
  nameEs: "Calendario",
  category: "data",
  materials: ["adaptive"],
  description:
    "A selectable month grid built on the WAI-ARIA date-grid pattern: a real table[role=grid] with roving tabindex, full arrow/Home/End/PageUp/PageDown keyboard model, today and selection cues that never ride on colour alone, and a fully deterministic, SSR-safe date model. Material-agnostic single adaptive style, light and dark.",
  descriptionEs:
    "Una cuadrícula de mes seleccionable basada en el patrón de rejilla de fechas de WAI-ARIA: una tabla real con role=grid, tabindex móvil, modelo de teclado completo (flechas/Inicio/Fin/RePág/AvPág), señales de hoy y de selección que nunca dependen solo del color, y un modelo de fechas determinista y seguro para SSR. Estilo único adaptativo agnóstico al material, claro y oscuro.",
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
    "Follows the WAI-ARIA date-grid pattern. The month grid is a real <table role=\"grid\"> with role=\"row\" rows and role=\"gridcell\" cells; weekday headers are <th scope=\"col\"> carrying a visually-hidden full day name beside their abbreviation. A roving tabindex keeps exactly one day tabbable: ArrowLeft/Right move by one day, ArrowUp/Down by one week, Home/End jump to the start/end of the week, PageUp/PageDown change month, and Enter or Space select via native button activation — navigation across a month edge moves the visible month with the focus. Each day button's accessible name is its full date (weekday, month, day, year). State never depends on colour alone: today carries aria-current=\"date\" plus a ring (a shape) drawn in currentColor so it stays visible on plain and selected cells, the selected day carries aria-selected on its cell plus a filled and bolded treatment, and out-of-month days are native-disabled (non-tabbable) and dimmed to a still-legible muted colour. The month heading is an aria-live=\"polite\" region so month changes are announced, and an sr-only summary states the visible month, the current selection and the keyboard model as the grid's description. There is no draw or count-up animation, so the resting state is always the final state and reduced motion (which also cancels the hover/selection colour transition) shows the correct calendar; the component reads no wall clock (today, month and selection are props, and the grid is derived only from new Date with explicit args), so server, no-JS and hydrated renders agree. In forced-colors mode the surface fill and shadows are dropped while a CanvasText border keeps the bounds, the selected day uses Highlight/HighlightText, today falls back to a CanvasText border, and focus outlines use Highlight. All text is held at or above 4.5:1 against its surface in both colour schemes.",
  a11yEs:
    "Sigue el patrón de rejilla de fechas de WAI-ARIA. La cuadrícula del mes es una <table role=\"grid\"> real con filas role=\"row\" y celdas role=\"gridcell\"; los encabezados de día de la semana son <th scope=\"col\"> que llevan el nombre completo del día oculto visualmente junto a su abreviatura. Un tabindex móvil mantiene exactamente un día tabulable: Flecha izquierda/derecha mueve un día, Flecha arriba/abajo una semana, Inicio/Fin saltan al principio/fin de la semana, RePág/AvPág cambian de mes, y Enter o Espacio seleccionan mediante la activación nativa del botón — navegar cruzando el borde del mes mueve el mes visible junto con el foco. El nombre accesible de cada botón de día es su fecha completa (día de la semana, mes, día, año). El estado nunca depende solo del color: hoy lleva aria-current=\"date\" más un anillo (una forma) dibujado en currentColor para que siga visible en celdas normales y seleccionadas, el día seleccionado lleva aria-selected en su celda más un tratamiento relleno y en negrita, y los días fuera del mes están deshabilitados de forma nativa (no tabulables) y atenuados a un color apagado aún legible. El encabezado del mes es una región aria-live=\"polite\" para anunciar los cambios de mes, y un resumen solo para lectores de pantalla indica el mes visible, la selección actual y el modelo de teclado como descripción de la rejilla. No hay animación de dibujo ni conteo, así que el estado en reposo siempre es el estado final y el movimiento reducido (que también cancela la transición de color de hover/selección) muestra el calendario correcto; el componente no lee el reloj del sistema (hoy, mes y selección son props, y la cuadrícula se deriva solo de new Date con argumentos explícitos), por lo que los renders de servidor, sin JS e hidratado coinciden. En modo forced-colors se descartan el relleno de superficie y las sombras mientras un borde CanvasText conserva los límites, el día seleccionado usa Highlight/HighlightText, hoy recurre a un borde CanvasText, y los contornos de foco usan Highlight. Todo el texto se mantiene en 4,5:1 o más contra su superficie en ambos esquemas de color.",
  sourcePath: "src/registry/ui/calendar.tsx",
  Preview: CalendarPreview,
};
