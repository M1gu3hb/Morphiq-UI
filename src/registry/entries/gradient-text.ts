import { GradientTextPreview } from "@/registry/previews/gradient-text-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Gradient Text. */
export const entry: RegistryEntry = {
  slug: "gradient-text",
  name: "Gradient Text",
  nameEs: "Texto degradado",
  category: "text",
  materials: ["adaptive"],
  description:
    "Inherited text tinted by a flowing self-contained CSS gradient on an aria-hidden overlay, preserving the readable foreground underneath.",
  descriptionEs:
    "Texto heredado teñido por un degradado CSS fluido y autocontenido sobre una capa aria-hidden, conservando debajo el primer plano legible.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: {
    npm: ["clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The original currentColor text remains present, readable and exposed once; the moving gradient is a translucent aria-hidden copy. Typography and foreground inherit from the host. prefers-reduced-motion freezes the tint at one frame, while forced-colors removes it and preserves CanvasText. The effect carries no meaning and cannot replace the accessible label. The caller must provide an inherited foreground/background pair with at least 4.5:1 contrast; the retained base layer ensures the component does not depend on gradient colors for legibility.",
  a11yEs:
    "El texto currentColor original permanece presente, legible y expuesto una sola vez; el degradado móvil es una copia translúcida aria-hidden. Tipografía y primer plano se heredan del host. prefers-reduced-motion congela el tinte en un cuadro, mientras forced-colors lo elimina y conserva CanvasText. El efecto no comunica significado ni reemplaza la etiqueta accesible. Quien integra debe aportar un par primer plano/fondo heredado con al menos 4,5:1; la capa base conservada evita depender de los colores del degradado para la legibilidad.",
  sourcePath: "src/registry/ui/gradient-text.tsx",
  Preview: GradientTextPreview,
};
