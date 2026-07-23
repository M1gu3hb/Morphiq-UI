import { NeonTextPreview } from "@/registry/previews/neon-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "neon-text",
  name: "Neon Text",
  nameEs: "Texto neón",
  category: "text",
  materials: ["adaptive"],
  description: "Live neon lettering with layered text shadows and a restrained CSS flicker in cyan or magenta.",
  descriptionEs: "Letras de neón vivo con sombras de texto en capas y un parpadeo CSS contenido en cian o magenta.",
  variants: [
    { id: "cyan", label: "Cyan", labelEs: "Cian" },
    { id: "magenta", label: "Magenta", labelEs: "Magenta" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The real text node remains the sole accessible and contrast-bearing content; shadows are paint only and occupy no layout space. prefers-reduced-motion disables flicker while keeping a static glow. forced-colors removes every shadow and uses CanvasText, so the label remains visible without neon color.",
  a11yEs: "El nodo de texto real sigue siendo el único contenido accesible y portador de contraste; las sombras solo pintan y no ocupan espacio. prefers-reduced-motion desactiva el parpadeo conservando un brillo estático. forced-colors elimina todas las sombras y usa CanvasText, por lo que la etiqueta sigue visible sin depender del neón.",
  sourcePath: "src/registry/ui/neon-text.tsx",
  Preview: NeonTextPreview,
};
