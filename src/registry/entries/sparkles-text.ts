import { SparklesTextPreview } from "@/registry/previews/sparkles-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "sparkles-text",
  name: "Sparkles Text",
  nameEs: "Texto con destellos",
  category: "text",
  materials: ["adaptive"],
  description: "Untouched readable text surrounded by a deterministic field of subtle or dense CSS sparkles, with no runtime animation dependency.",
  descriptionEs: "Texto legible intacto rodeado por un campo determinista de destellos CSS sutiles o densos, sin dependencia de animación en runtime.",
  variants: [
    { id: "subtle", label: "Subtle", labelEs: "Sutil" },
    { id: "dense", label: "Dense", labelEs: "Denso" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The original text is rendered once as ordinary inherited content. Every sparkle lives in one aria-hidden, pointer-events-none absolute layer, so decoration never alters the accessible name, reading order, hit area or line box. Positions and timing are fixed rather than random. prefers-reduced-motion and forced-colors remove all sparkles while leaving the text untouched. The host controls a foreground/background pair of at least 4.5:1; sparkles carry no meaning.",
  a11yEs: "El texto original se renderiza una sola vez como contenido heredado ordinario. Cada destello vive en una capa absoluta aria-hidden y pointer-events-none, así que la decoración nunca altera el nombre accesible, orden de lectura, área de interacción ni caja de línea. Posiciones y tiempos son fijos, no aleatorios. prefers-reduced-motion y forced-colors eliminan todos los destellos dejando intacto el texto. El host controla un par primer plano/fondo de al menos 4,5:1; los destellos no comunican significado.",
  sourcePath: "src/registry/ui/sparkles-text.tsx",
  Preview: SparklesTextPreview,
};
