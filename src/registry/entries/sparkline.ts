import { SparklinePreview } from "@/registry/previews/sparkline-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Sparkline. */
export const entry: RegistryEntry = {
  slug: "sparkline",
  name: "Sparkline",
  nameEs: "Minigráfico",
  category: "data",
  materials: ["adaptive"],
  description:
    "A hand-drawn inline-SVG trend chart — line plus filled area — computed deterministically from a numeric array, with a signed delta and an sr-only summary as the accessible source.",
  descriptionEs:
    "Un minigráfico de tendencia en SVG en línea, dibujado a mano —línea más área rellena— calculado de forma determinista a partir de un arreglo numérico, con un delta con signo y un resumen sr-only como fuente accesible.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The decorative SVG is aria-hidden; an sr-only text summary is the authoritative source and states the point count, the trend as a WORD (up / down / no change), the percentage or absolute change, and the from→to values. Trend is never carried by color alone: the visible delta pairs the color with a directional arrow icon and a signed magnitude, so a red or green cue always travels with a shape and a sign. The positive and negative colors are tuned to at least 4.5:1 against a light and a dark surface so the colored delta figure meets body-text contrast, and the line stroke clears the 3:1 bar for an informative glyph. The line's resting state is the fully drawn path (stroke-dashoffset:0), so SSR, no-JS and reduced motion all show the complete trend; the one-shot draw is expressed with the @starting-style (starting:) variant and pathLength=1, and motion-reduce:transition-none lands immediately on the final line with no measurement. forced-colors mode drops the decorative area fill and baseline and repaints the line, endpoint and arrow as CanvasText so the trend stays perceivable. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El SVG decorativo es aria-hidden; un resumen de texto sr-only es la fuente autorizada e indica la cantidad de puntos, la tendencia como PALABRA (subida / bajada / sin cambio), el porcentaje o el cambio absoluto y los valores de origen→destino. La tendencia nunca depende solo del color: el delta visible acompaña el color con un icono de flecha direccional y una magnitud con signo, de modo que una señal roja o verde siempre viaja con una forma y un signo. Los colores positivo y negativo se ajustan a un mínimo de 4,5:1 sobre una superficie clara y una oscura para que la cifra del delta cumpla el contraste de texto, y el trazo de la línea supera el umbral de 3:1 para un glifo informativo. El estado en reposo de la línea es el trazo completo (stroke-dashoffset:0), así que SSR, sin-JS y movimiento reducido muestran la tendencia completa; el trazado de una sola pasada se expresa con la variante @starting-style (starting:) y pathLength=1, y motion-reduce:transition-none cae de inmediato en la línea final sin medición. El modo forced-colors descarta el relleno del área y la línea base decorativas y repinta la línea, el punto final y la flecha como CanvasText para que la tendencia siga siendo perceptible. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/sparkline.tsx",
  Preview: SparklinePreview,
};
