import { GaugePreview } from "@/registry/previews/gauge-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Gauge. */
export const entry: RegistryEntry = {
  slug: "gauge",
  name: "Gauge",
  nameEs: "Medidor",
  category: "data",
  materials: ["adaptive"],
  description:
    "A semicircular (180°) meter drawn by hand as inline SVG — a track, a value arc that fills from the minimum, a needle that points at the value, the reading as text, and optional legended colour zones — carrying role=\"meter\" with a full accessible equivalent.",
  descriptionEs:
    "Un medidor semicircular (180°) dibujado a mano en SVG en línea —una pista, un arco de valor que se llena desde el mínimo, una aguja que apunta al valor, la lectura como texto y zonas de color opcionales con leyenda— que lleva role=\"meter\" con un equivalente accesible completo.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "The gauge is a native role=\"meter\" carrying aria-valuenow, aria-valuemin and aria-valuemax, an aria-valuetext that spells the reading and its current zone, and an aria-label that names it; that, plus an always-rendered sr-only summary sentence, is the authoritative source, and every visual part — the decorative SVG and the visible label, current zone and legend — is aria-hidden so nothing is announced twice. Colour is never the sole carrier of meaning: the reading is printed as real numeric text, the needle encodes the value by position, min and max ticks label the scale, and each colour zone is paired with a text label and a numeric range in the legend and named in aria-valuetext and the summary, so a zone is never colour-alone. Contrast holds: the numeric reading uses the primary text token and the labels the muted token, each at or above 4.5:1 against a light and a dark surface, and the value arc and zone bands clear the 3:1 bar asked of an informative graphic mark. The arc and needle draw on mount reduced-motion-safe without JavaScript: the value arc's resting stroke-dashoffset is the final value and the needle's resting rotate is the final angle, so SSR, no-JS and reduced motion all show the true reading, and the entrances are expressed with the @starting-style (starting:) variant — the arc from an empty offset and the needle from the minimum angle — over transition-[stroke-dashoffset] and transition-[rotate], with motion-reduce:transition-none landing straight on the value. In forced-colors mode the value arc becomes Highlight while the track, needle and every label become CanvasText, so the reading stays perceivable. Every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "El medidor es un role=\"meter\" nativo que lleva aria-valuenow, aria-valuemin y aria-valuemax, un aria-valuetext que expresa la lectura y su zona actual, y un aria-label que lo nombra; eso, junto con una oración de resumen sr-only siempre renderizada, es la fuente autorizada, y cada parte visual —el SVG decorativo y la etiqueta, la zona actual y la leyenda visibles— es aria-hidden para que nada se anuncie dos veces. El color nunca es el único portador de significado: la lectura se imprime como texto numérico real, la aguja codifica el valor por posición, las marcas de mínimo y máximo rotulan la escala, y cada zona de color se acompaña de una etiqueta de texto y un rango numérico en la leyenda y se nombra en aria-valuetext y el resumen, así que una zona nunca depende solo del color. El contraste se mantiene: la lectura numérica usa el token de texto primario y las etiquetas el token atenuado, cada uno con al menos 4,5:1 sobre una superficie clara y una oscura, y el arco de valor y las bandas de zona superan el 3:1 pedido a un gráfico informativo. El arco y la aguja se dibujan al montar de forma segura para movimiento reducido sin JavaScript: el stroke-dashoffset en reposo del arco es el valor final y el rotate en reposo de la aguja es el ángulo final, así que SSR, sin-JS y movimiento reducido muestran la lectura real, y las entradas se expresan con la variante @starting-style (starting:) —el arco desde un desfase vacío y la aguja desde el ángulo mínimo— sobre transition-[stroke-dashoffset] y transition-[rotate], y motion-reduce:transition-none cae directo en el valor. En modo forced-colors el arco de valor pasa a Highlight mientras que la pista, la aguja y cada etiqueta pasan a CanvasText, así que la lectura sigue siendo perceptible. Cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/gauge.tsx",
  Preview: GaugePreview,
};
