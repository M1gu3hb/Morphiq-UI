import { WaveTextPreview } from "@/registry/previews/wave-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "wave-text",
  name: "Wave Text",
  nameEs: "Texto ondulado",
  category: "text",
  materials: ["adaptive"],
  description: "A continuous sine-like wave travels across letters using deterministic CSS delays and inherited typography.",
  descriptionEs: "Una onda continua de apariencia senoidal recorre las letras con delays CSS deterministas y tipografía heredada.",
  variants: [
    { id: "gentle", label: "Gentle", labelEs: "Suave" },
    { id: "tidal", label: "Tidal", labelEs: "Intensa" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The complete phrase is the root aria-label and the staggered glyph row is aria-hidden, so assistive technology receives one stable string. Inline glyphs reserve their final width before animation and prevent CLS. prefers-reduced-motion and forced-colors stop every transform at the readable final position while preserving inherited contrast.",
  a11yEs: "La frase completa es el aria-label de la raíz y la fila de glifos escalonados usa aria-hidden, así que la tecnología asistiva recibe una cadena estable. Los glifos inline reservan su ancho final antes de animar y evitan CLS. prefers-reduced-motion y forced-colors detienen cada transformación en la posición final legible conservando el contraste heredado.",
  sourcePath: "src/registry/ui/wave-text.tsx",
  Preview: WaveTextPreview,
};
