import { TextRevealPreview } from "@/registry/previews/text-reveal-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Text Reveal. */
export const entry: RegistryEntry = {
  slug: "text-reveal",
  name: "Text Reveal",
  nameEs: "Revelado de texto",
  category: "text",
  materials: ["adaptive"],
  description:
    "Inherited text revealed by words or Unicode characters with a viewport-aware staggered fade, blur and lift.",
  descriptionEs:
    "Texto heredado revelado por palabras o caracteres Unicode mediante fundido, desenfoque y elevación escalonados al entrar al viewport.",
  variants: [
    { id: "words", label: "Words", labelEs: "Palabras" },
    { id: "letters", label: "Letters", labelEs: "Letras" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: {
    npm: ["motion", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "A plain, unsplit text copy remains in the accessibility tree while every animated segment is aria-hidden, preserving exact reading order and spacing. Font, size and color inherit from the host. The reveal runs once by default when 45% enters the viewport. prefers-reduced-motion skips the hidden state and CSS media overrides keep every segment fully opaque, unblurred and stationary before hydration; forced-colors applies the same static geometry with CanvasText. The host foreground/background pair must maintain at least 4.5:1 contrast.",
  a11yEs:
    "Una copia de texto simple y sin segmentar permanece en el árbol de accesibilidad mientras cada segmento animado es aria-hidden, conservando orden de lectura y espacios exactos. Fuente, tamaño y color se heredan del host. El revelado corre una vez por defecto cuando 45% entra al viewport. prefers-reduced-motion omite el estado oculto y los overrides CSS mantienen cada segmento opaco, sin desenfoque e inmóvil antes de hidratar; forced-colors aplica la misma geometría estática con CanvasText. El par primer plano/fondo del host debe mantener al menos 4,5:1.",
  sourcePath: "src/registry/ui/text-reveal.tsx",
  Preview: TextRevealPreview,
};
