import { BlurInTextPreview } from "@/registry/previews/blur-in-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "blur-in-text",
  name: "Blur In Text",
  nameEs: "Texto desde desenfoque",
  category: "text",
  materials: ["adaptive"],
  description: "Inherited text that settles from blur, opacity and a small standalone translate into a crisp final state through a local CSS keyframe.",
  descriptionEs: "Texto heredado que pasa de desenfoque, opacidad y un pequeño translate independiente a un estado final nítido mediante un keyframe CSS local.",
  variants: [
    { id: "soft", label: "Soft", labelEs: "Suave" },
    { id: "dramatic", label: "Dramatic", labelEs: "Dramático" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The real final text is the only content node and is present in the accessibility tree even while CSS changes its visual opacity and filter. The inline box is laid out at final dimensions before animation, so blur and standalone translate cannot cause CLS. prefers-reduced-motion and forced-colors disable animation, filter and translate, leaving fully opaque crisp text immediately. Foreground and typography inherit from the host; its contrast must be at least 4.5:1.",
  a11yEs: "El texto final real es el único nodo de contenido y está presente en el árbol accesible aun mientras CSS cambia opacidad y filtro visuales. La caja inline se calcula con dimensiones finales antes de animar, así que blur y translate independiente no causan CLS. prefers-reduced-motion y forced-colors desactivan animación, filtro y translate, dejando texto nítido y totalmente opaco de inmediato. Primer plano y tipografía se heredan del host; su contraste debe ser al menos 4,5:1.",
  sourcePath: "src/registry/ui/blur-in-text.tsx",
  Preview: BlurInTextPreview,
};
