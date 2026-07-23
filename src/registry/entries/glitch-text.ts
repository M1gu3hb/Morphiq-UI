import { GlitchTextPreview } from "@/registry/previews/glitch-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "glitch-text",
  name: "Glitch Text",
  nameEs: "Texto glitch",
  category: "text",
  materials: ["adaptive"],
  description: "Readable text with two clipped RGB-split layers that break into brief signal glitches without changing the line box.",
  descriptionEs: "Texto legible con dos capas RGB recortadas que producen fallos breves de señal sin cambiar la caja de línea.",
  variants: [
    { id: "signal", label: "Signal", labelEs: "Señal" },
    { id: "burst", label: "Burst", labelEs: "Ráfaga" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The root exposes one full aria-label while every visual copy is aria-hidden, preventing duplicate or character-by-character announcements. The base visual text permanently reserves the final line box. prefers-reduced-motion removes both glitch layers; forced-colors does the same and preserves CanvasText. Legibility depends on the inherited foreground/background pair, not the RGB offsets.",
  a11yEs: "La raíz expone un único aria-label completo mientras todas las copias visuales usan aria-hidden, evitando anuncios duplicados o letra por letra. El texto visual base reserva siempre la caja final. prefers-reduced-motion elimina ambas capas glitch; forced-colors hace lo mismo y conserva CanvasText. La legibilidad depende del par de primer plano/fondo heredado, no de los desplazamientos RGB.",
  sourcePath: "src/registry/ui/glitch-text.tsx",
  Preview: GlitchTextPreview,
};
