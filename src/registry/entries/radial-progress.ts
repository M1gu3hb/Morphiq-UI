import { RadialProgressPreview } from "@/registry/previews/radial-progress-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the radial-progress component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "radial-progress",
  name: "Radial Progress",
  nameEs: "Progreso radial",
  category: "data",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A circular percentage gauge with four material recipes and three sizes: a track ring, a value arc that draws on mount, the percentage as centred text, and a label — carrying native progressbar semantics and drawn entirely by hand in SVG.",
  descriptionEs:
    "Un medidor circular de porcentaje con cuatro recetas de material y tres tamaños: un anillo de pista, un arco de valor que se dibuja al montarse, el porcentaje como texto centrado y una etiqueta — con semántica nativa de barra de progreso y dibujado a mano por completo en SVG.",
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
    "The gauge is a native role=\"progressbar\" carrying aria-valuenow, aria-valuemin=0, aria-valuemax=100, aria-valuetext and aria-label, which — together with an sr-only summary sentence — is the authoritative accessible source. The decorative SVG is aria-hidden, and so are the visible percentage and label, so a screen reader hears the value once rather than three times. Colour is never the sole carrier of meaning: the percentage is real, centred text (held at or above 4.5:1 against every material's surface), and the value arc reads at or above 3:1 against that surface. The arc draws on mount without JavaScript: its resting stroke-dashoffset is already the final value, so SSR, no-JS and reduced-motion all render the correct full arc, and the entrance is expressed with the CSS @starting-style variant transitioning from the empty circumference; prefers-reduced-motion drops that transition and lands directly on the final value with no draw or count-up. The gauge is a passive readout, so there is no keyboard interaction to document. In forced-colors mode shadows and translucency are discarded, the skeuo gradient is cleared by hand, a system-coloured border keeps the gauge's bounds, the track ring is drawn in CanvasText and the value arc in Highlight so both stay perceivable, and the text falls to CanvasText.",
  a11yEs:
    "El medidor es un role=\"progressbar\" nativo que lleva aria-valuenow, aria-valuemin=0, aria-valuemax=100, aria-valuetext y aria-label, lo que — junto con una frase de resumen sr-only — es la fuente accesible autoritativa. El SVG decorativo es aria-hidden, y también lo son el porcentaje y la etiqueta visibles, así que un lector de pantalla oye el valor una sola vez en lugar de tres. El color nunca es el único portador de significado: el porcentaje es texto real y centrado (mantenido en 4,5:1 o más contra la superficie de cada material) y el arco de valor se lee en 3:1 o más contra esa superficie. El arco se dibuja al montarse sin JavaScript: su stroke-dashoffset en reposo ya es el valor final, así que SSR, sin-JS y reduced-motion renderizan el arco completo correcto, y la entrada se expresa con la variante CSS @starting-style que transiciona desde la circunferencia vacía; prefers-reduced-motion elimina esa transición y aterriza directamente en el valor final sin dibujo ni conteo. El medidor es una lectura pasiva, por lo que no hay interacción de teclado que documentar. En forced-colors se descartan sombras y translucidez, el degradado skeuo se limpia a mano, un borde con color de sistema mantiene los límites del medidor, el anillo de pista se dibuja en CanvasText y el arco de valor en Highlight para que ambos sigan siendo perceptibles, y el texto cae a CanvasText.",
  sourcePath: "src/registry/ui/radial-progress.tsx",
  Preview: RadialProgressPreview,
};
