import { DockPreview } from "@/registry/previews/dock-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the dock component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "dock",
  name: "Dock",
  nameEs: "Dock",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A macOS-style dock: a row of icon controls that magnify with the pointer's horizontal proximity, the closest icon growing most and the effect falling off smoothly with distance. Four material recipes and three sizes. The magnification is compositor-only — written straight to each control's scale property, never through React state — and is skipped entirely under reduced motion, leaving a plain, fully usable row.",
  descriptionEs:
    "Un dock al estilo de macOS: una fila de controles con icono que se magnifican según la cercanía horizontal del puntero, creciendo más el icono más próximo y atenuándose el efecto de forma suave con la distancia. Cuatro recetas de material y tres tamaños. La magnificación es solo de composición — se escribe directamente en la propiedad scale de cada control, nunca a través del estado de React — y se omite por completo con movimiento reducido, dejando una fila sencilla y plenamente utilizable.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "The bar is a nav landmark carrying an aria-label, wrapping a list of real controls — a <button> for each item, or an <a href> when a destination is given — so assistive tech announces a navigation list of N items and every item is reachable by keyboard. Each control takes its accessible name from the required label prop; the icon is decorative and aria-hidden, so meaning never depends on the glyph. The current destination carries aria-current=\"page\" and a running dot, so its state is conveyed by structure rather than colour alone. Magnification is a pointer-only affordance: the bar reads the cursor's viewport X on pointermove and each icon writes a scale to its own element imperatively — it never changes tab order, focus, or what a screen reader perceives, and it is decoration layered on a control that already works without it. Keyboard focus moves control to control and shows a 2px offset ring on :focus-visible that is never removed; the same visible-label tooltip appears on hover and on keyboard focus. Under prefers-reduced-motion the magnification is turned off (the pointer handler makes no scale changes), the scale and tooltip-fade transitions are suppressed, and the dock rests at its resting size — never delayed, never hidden. In forced-colors mode the glyph stays on currentColor and survives, the bar gradient is cleared by hand and its border carries the boundary on CanvasText, the active dot is forced to CanvasText so the current item stays marked once fills are discarded, and the focus ring switches to Highlight. Contrast: the icon ink measures at or above 4.5:1 on every material against its own bar surface — clay ink #5b4a3c on #efe7db at 6.9:1, skeuo #33322d on its light gradient above 8:1, glass #2f2f29 over its worst-case tint above 5:1, and adaptive #55554e on #f1f0ec in light and #b9b7b0 on #26262a in dark both above 5:1. Disabled controls fade to 45%, which WCAG exempts from contrast as an inactive control.",
  a11yEs:
    "La barra es un landmark nav con aria-label que envuelve una lista de controles reales — un <button> por cada elemento, o un <a href> cuando se indica un destino — así la tecnología de asistencia anuncia una lista de navegación de N elementos y cada uno es alcanzable con el teclado. Cada control toma su nombre accesible de la prop label obligatoria; el icono es decorativo y aria-hidden, por lo que el significado nunca depende del glifo. El destino actual lleva aria-current=\"page\" y un punto indicador, de modo que su estado se transmite por estructura y no solo por color. La magnificación es una prestación exclusiva del puntero: la barra lee la X del cursor en pointermove y cada icono escribe una escala en su propio elemento de forma imperativa — nunca cambia el orden de tabulación, el foco ni lo que percibe un lector de pantalla, y es decoración sobre un control que ya funciona sin ella. El foco por teclado pasa de control en control y muestra un anillo de 2px con desplazamiento en :focus-visible que nunca se elimina; el mismo rótulo visible en forma de tooltip aparece al pasar el cursor y al enfocar con el teclado. Con prefers-reduced-motion la magnificación se desactiva (el manejador del puntero no cambia ninguna escala), se suprimen las transiciones de escala y de desvanecimiento del tooltip, y el dock permanece en su tamaño de reposo — nunca demorado, nunca oculto. En forced-colors el glifo se mantiene en currentColor y sobrevive, el degradado de la barra se limpia a mano y su borde traza el límite con CanvasText, el punto activo se fuerza a CanvasText para que el elemento actual siga marcado cuando se descartan los rellenos, y el anillo de foco pasa a Highlight. Contraste: la tinta del icono mide 4,5:1 o más en cada material contra su propia superficie — tinta clay #5b4a3c sobre #efe7db a 6,9:1, skeuo #33322d sobre su degradado claro por encima de 8:1, glass #2f2f29 sobre su tinte de peor caso por encima de 5:1, y adaptive #55554e sobre #f1f0ec en claro y #b9b7b0 sobre #26262a en oscuro, ambos por encima de 5:1. Los controles deshabilitados bajan al 45%, que WCAG exime de contraste por ser un control inactivo.",
  sourcePath: "src/registry/ui/dock.tsx",
  Preview: DockPreview,
};
