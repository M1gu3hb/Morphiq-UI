import { SplitRevealTextPreview } from "@/registry/previews/split-reveal-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "split-reveal-text",
  name: "Split Reveal Text",
  nameEs: "Texto revelado por cortes",
  category: "text",
  materials: ["adaptive"],
  description: "Characters emerge through individual clipping windows with soft or dramatic vertical travel and deterministic stagger.",
  descriptionEs: "Los caracteres emergen por ventanas de recorte individuales con recorrido vertical suave o dramático y escalonado determinista.",
  variants: [
    { id: "soft", label: "Soft", labelEs: "Suave" },
    { id: "dramatic", label: "Dramatic", labelEs: "Dramático" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The full phrase is available immediately through the root aria-label; split glyphs are aria-hidden and never announced separately. Inline clipping cells reserve every final glyph before animation. Reduced motion and forced colors skip clipping and transform, showing the final opaque text at once with inherited contrast.",
  a11yEs: "La frase completa está disponible de inmediato mediante el aria-label de la raíz; los glifos divididos usan aria-hidden y nunca se anuncian por separado. Las celdas inline reservan cada glifo final antes de animar. Movimiento reducido y forced colors omiten recorte y transformación, mostrando de inmediato el texto final opaco con contraste heredado.",
  sourcePath: "src/registry/ui/split-reveal-text.tsx",
  Preview: SplitRevealTextPreview,
};
