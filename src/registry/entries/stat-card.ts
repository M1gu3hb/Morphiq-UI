import { StatCardPreview } from "@/registry/previews/stat-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the stat-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "stat-card",
  name: "Stat Card",
  nameEs: "Tarjeta de estadística",
  category: "data",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A KPI tile with four material recipes and three densities: a muted label, one large tabular value, a signed delta (arrow + sign + percentage) and an optional inline sparkline that stays legible without color.",
  descriptionEs:
    "Un mosaico KPI con cuatro recetas de material y tres densidades: una etiqueta atenuada, un valor grande con cifras tabulares, un delta con signo (flecha + signo + porcentaje) y una minigráfica opcional que se mantiene legible sin depender del color.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The label, value and delta are real text, not baked into the graphic. The delta never relies on color alone: a lucide arrow (up/down/minus) plus a signed percentage carry the direction, and the visible glyphs are aria-hidden while an sr-only phrase — \"up 12.5% vs last month\" — is what assistive tech announces. The inline sparkline is decoration layered over data the numbers already state, so its SVG is aria-hidden and an sr-only summary gives the point count, the from→to span and the trend as the authoritative equivalent. The value is rendered statically with no count-up, so SSR, no-JS and prefers-reduced-motion all show the final number; the sparkline's resting state is the fully drawn line (stroke-dashoffset 0) and its one-shot draw is expressed with @starting-style and cancelled under reduced motion, landing directly on the final line. Contrast: the value and label sit at or above 4.5:1 against every material surface — glass carries its own tint so that holds over a white and a black backdrop alike — and the positive/negative delta colors are each tuned to 4.5:1 so the colored text still meets body-text contrast. In forced-colors mode a system-colored border keeps the tile's bounds, the gradient and shadows are cleared, and the delta glyph and sparkline stroke fall to CanvasText.",
  a11yEs:
    "La etiqueta, el valor y el delta son texto real, no forman parte del gráfico. El delta nunca depende solo del color: una flecha de lucide (arriba/abajo/menos) más un porcentaje con signo transmiten la dirección, y los glifos visibles son aria-hidden mientras una frase sr-only — «up 12.5% vs last month» — es lo que anuncian las tecnologías de asistencia. La minigráfica es decoración sobre datos que las cifras ya indican, así que su SVG es aria-hidden y un resumen sr-only da el número de puntos, el rango de inicio→fin y la tendencia como equivalente autoritativo. El valor se renderiza de forma estática sin conteo animado, por lo que SSR, sin-JS y prefers-reduced-motion muestran el número final; el estado en reposo de la minigráfica es la línea totalmente dibujada (stroke-dashoffset 0) y su trazo de entrada se expresa con @starting-style y se cancela con movimiento reducido, quedando directamente en la línea final. Contraste: el valor y la etiqueta se mantienen en 4,5:1 o más contra cada superficie de material —el vidrio lleva su propio tinte para que se cumpla igual sobre fondo blanco que negro— y los colores del delta positivo/negativo están ajustados a 4,5:1 para que el texto coloreado siga cumpliendo el contraste de texto. En forced-colors un borde con color de sistema mantiene los límites del mosaico, se eliminan el degradado y las sombras, y el glifo del delta y el trazo de la minigráfica pasan a CanvasText.",
  sourcePath: "src/registry/ui/stat-card.tsx",
  Preview: StatCardPreview,
};
