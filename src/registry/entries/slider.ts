import { SliderPreview } from "@/registry/previews/slider-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Slider component. */
export const entry: RegistryEntry = {
  slug: "slider",
  name: "Slider",
  nameEs: "Deslizador",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A Radix-powered single-value or range slider with four tactile materials, optional step ticks and value labels, and three sizes.",
  descriptionEs:
    "Un deslizador Radix de valor único o rango con cuatro materiales táctiles, marcas de paso y etiquetas de valor opcionales, y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "ticks", label: "Ticks", labelEs: "Con marcas" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["@radix-ui/react-slider", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Root, Track, Range and Thumb map directly to @radix-ui/react-slider; Morphiq does not reimplement pointer or keyboard mechanics. Each thumb is role=\"slider\" with aria-valuemin, aria-valuemax and aria-valuenow supplied by Radix. Arrow keys change by step, Page Up/Down use larger increments, Home/End reach the bounds, pointer dragging uses capture, and minStepsBetweenThumbs keeps a range ordered. Single-value mode renders one thumb; a two-item value/defaultValue renders two independently named thumbs. thumbLabels lets the caller provide domain-specific accessible names, with Value or Minimum/Maximum value fallbacks. Optional visible values mirror each thumb's live aria-valuenow through CSS generated content and never replace the ARIA value. Track and Range deliberately have no transition, so dragging never lags behind input; only the thumb's hover/press visuals transition, naming box-shadow, background-color, border-color and scale exactly. prefers-reduced-motion removes that cosmetic transition. Disabled is exposed by Radix and visibly fades the whole control. Forced-colors uses Canvas for the track, Highlight for the range and a ButtonFace thumb with Highlight border/focus outline, so parts remain distinguishable without material fills. Every range/track pair exceeds the 3:1 non-text contrast requirement; the lowest is glass at 5.01:1 after compositing its translucent track over black.",
  a11yEs:
    "Root, Track, Range y Thumb mapean directamente a @radix-ui/react-slider; Morphiq no reimplementa la mecánica de puntero ni teclado. Cada thumb usa role=\"slider\" con aria-valuemin, aria-valuemax y aria-valuenow proporcionados por Radix. Las flechas cambian según step, Page Up/Down usan incrementos mayores, Home/End llegan a los límites, el arrastre usa captura del puntero y minStepsBetweenThumbs mantiene ordenado un rango. El modo de valor único renderiza un thumb; value/defaultValue con dos elementos renderiza dos thumbs con nombres independientes. thumbLabels permite nombres accesibles propios del dominio, con los respaldos Value o Minimum/Maximum value. Los valores visibles opcionales reflejan el aria-valuenow vivo de cada thumb mediante contenido generado por CSS y nunca sustituyen el valor ARIA. Track y Range no tienen transición deliberadamente, así que el arrastre nunca queda detrás de la entrada; solo transicionan los estados visuales hover/press del thumb, nombrando exactamente box-shadow, background-color, border-color y scale. prefers-reduced-motion elimina esa transición cosmética. Disabled lo expone Radix y atenúa visualmente todo el control. Forced-colors usa Canvas para la pista, Highlight para el rango y un thumb ButtonFace con borde/anillo Highlight, así que las piezas siguen distinguiéndose sin los rellenos materiales. Cada par rango/pista supera el requisito no textual de 3:1; el mínimo es glass con 5,01:1 tras componer su pista translúcida sobre negro.",
  sourcePath: "src/registry/ui/slider.tsx",
  Preview: SliderPreview,
};
