import { ShinyTextPreview } from "@/registry/previews/shiny-text-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Shiny Text. */
export const entry: RegistryEntry = {
  slug: "shiny-text",
  name: "Shiny Text",
  nameEs: "Texto brillante",
  category: "text",
  materials: ["adaptive"],
  description:
    "Inherited text with a self-contained translucent highlight sweeping across an aria-hidden clipped copy while the readable foreground remains intact.",
  descriptionEs:
    "Texto heredado con un brillo translúcido autocontenido que recorre una copia recortada y aria-hidden mientras el primer plano legible permanece intacto.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: {
    npm: ["clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The semantic text remains a normal currentColor layer and is exposed once to assistive technology. The animated duplicate is aria-hidden, pointer-ignoring and translucent, so the effect never replaces the inherited foreground that supplies contrast. Font size, weight and color inherit from the host. prefers-reduced-motion removes the highlight layer entirely; forced-colors does the same and preserves CanvasText. The caller remains responsible for choosing an inherited foreground with at least 4.5:1 contrast against its context.",
  a11yEs:
    "El texto semántico permanece como una capa currentColor normal y se expone una sola vez a las tecnologías de asistencia. La copia animada es aria-hidden, ignora el puntero y es translúcida, así que el efecto nunca reemplaza el primer plano heredado que aporta contraste. Tamaño, peso y color se heredan del host. prefers-reduced-motion elimina por completo la capa de brillo; forced-colors hace lo mismo y conserva CanvasText. Quien integra mantiene la responsabilidad de elegir un primer plano heredado con contraste mínimo de 4,5:1 contra su contexto.",
  sourcePath: "src/registry/ui/shiny-text.tsx",
  Preview: ShinyTextPreview,
};
