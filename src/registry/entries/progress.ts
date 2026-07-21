import { ProgressPreview } from "@/registry/previews/progress-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Progress component. */
export const entry: RegistryEntry = {
  slug: "progress",
  name: "Progress",
  nameEs: "Progreso",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A determinate or indeterminate progressbar with four tactile material tracks, optional visible copy, two treatments and three thicknesses.",
  descriptionEs:
    "Una barra de progreso determinada o indeterminada con cuatro pistas materiales táctiles, texto visible opcional, dos tratamientos y tres grosores.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "striped", label: "Striped", labelEs: "Con franjas" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The root is a role=\"progressbar\" with a safe zero minimum and a validated positive maximum. Determinate mode clamps value into that range and exposes aria-valuenow; indeterminate mode is selected only by null or undefined and deliberately omits aria-valuenow. Consumers can supply aria-label and aria-valuetext; a string label becomes the accessible name, with a generic Progress fallback when no name is supplied. The optional visible label and value are aria-hidden because progressbar descendants are presentational by specification, while the authoritative value remains in ARIA, so meaning never depends on bar width, colour or stripes. Determinate movement changes only the individual translate property and names it in transition-property. Indeterminate mode uses local prefixed keyframes; prefers-reduced-motion removes both the transition and the infinite animation, leaving a static partial indicator. Forced-colors replaces material surfaces with Canvas, CanvasText and Highlight. Visible text exceeds 4.5:1 on supported surfaces, and every fill/track pair exceeds the 3:1 non-text contrast threshold; the minimum is 3.35:1 for the lighter skeuo stripe.",
  a11yEs:
    "La raíz usa role=\"progressbar\" con mínimo seguro de cero y un máximo positivo validado. El modo determinado limita value dentro de ese rango y expone aria-valuenow; el indeterminado se selecciona solo con null o undefined y omite aria-valuenow deliberadamente. Quien consume puede proporcionar aria-label y aria-valuetext; una etiqueta string se convierte en el nombre accesible, con el respaldo genérico \"Progress\" cuando no se proporciona nombre. La etiqueta y el valor visibles opcionales llevan aria-hidden porque los descendientes de progressbar son presentacionales por especificación, mientras el valor autoritativo permanece en ARIA, así que el significado nunca depende del ancho, color o franjas. El avance determinado cambia solo la propiedad individual translate y la declara en transition-property. El modo indeterminado usa keyframes locales con prefijo; prefers-reduced-motion elimina tanto la transición como la animación infinita y deja un indicador parcial estático. Forced-colors reemplaza las superficies materiales por Canvas, CanvasText y Highlight. El texto visible supera 4,5:1 sobre las superficies compatibles y cada par relleno/pista supera el umbral no textual de 3:1; el mínimo es 3,35:1 para la franja clara skeuo.",
  sourcePath: "src/registry/ui/progress.tsx",
  Preview: ProgressPreview,
};
