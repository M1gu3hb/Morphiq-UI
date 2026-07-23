import { BounceTextPreview } from "@/registry/previews/bounce-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "bounce-text",
  name: "Bounce Text",
  nameEs: "Texto con rebote",
  category: "text",
  materials: ["adaptive"],
  description: "Letters enter in sequence through a bounded spring-like CSS keyframe, with soft or elastic energy.",
  descriptionEs: "Las letras entran en secuencia mediante un keyframe CSS de resorte acotado, con energía suave o elástica.",
  variants: [
    { id: "soft", label: "Soft", labelEs: "Suave" },
    { id: "elastic", label: "Elastic", labelEs: "Elástico" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The complete string is exposed once by aria-label and all animated characters are aria-hidden. Their inline boxes reserve final width from the first render and avoid CLS. prefers-reduced-motion and forced-colors suppress every bounce, opacity ramp and transform, leaving the final readable text visible immediately.",
  a11yEs: "La cadena completa se expone una sola vez mediante aria-label y todos los caracteres animados usan aria-hidden. Sus cajas inline reservan el ancho final desde el primer render y evitan CLS. prefers-reduced-motion y forced-colors suprimen rebote, cambio de opacidad y transformación, dejando el texto final legible visible de inmediato.",
  sourcePath: "src/registry/ui/bounce-text.tsx",
  Preview: BounceTextPreview,
};
