import { AvatarPreview } from "@/registry/previews/avatar-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Avatar component. */
export const entry: RegistryEntry = {
  slug: "avatar",
  name: "Avatar",
  nameEs: "Avatar",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "An identity image with three shapes, three sizes, four tactile material frames, and an accessible initials or icon fallback that remains visible until the image loads.",
  descriptionEs:
    "Una imagen de identidad con tres formas, tres tamaños, cuatro marcos materiales táctiles y un fallback accesible de iniciales o icono que permanece visible hasta cargar la imagen.",
  variants: [
    { id: "circle", label: "Circle", labelEs: "Círculo" },
    { id: "rounded", label: "Rounded", labelEs: "Redondeado" },
    { id: "squircle", label: "Squircle", labelEs: "Squircle" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Requires alt for every use: describe the person when the image carries identity, or pass alt=\"\" when it is decorative. While an image is absent, loading or failed, the fallback exposes role=\"img\" and uses the full name (or alt) as its accessible label; visible initials and the generic icon are aria-hidden, so assistive technology never has to pronounce an abbreviation or infer identity from a symbol. Decorative fallbacks are fully aria-hidden. The real image remains aria-hidden and visually transparent until its exact src fires onLoad, then replaces the fallback; onError keeps the labelled fallback. Native image props and callbacks are composed through imageProps. Documentation focus receives a visible 2px outline. Hover adds an immediate material-coloured outline and transitions only a subtle 1.04 scale; prefers-reduced-motion keeps the outline while removing that movement, and disabled avatars do not scale. Forced-colors preserves a CanvasText system border, uses Highlight for the hover outline and removes ornamental shadows. Initials and icon foregrounds measure at least 9.36:1 across all four material fallback surfaces and both adaptive schemes.",
  a11yEs:
    "Exige alt en cada uso: describe a la persona cuando la imagen comunica identidad, o pasa alt=\"\" cuando sea decorativa. Mientras la imagen no exista, cargue o falle, el fallback expone role=\"img\" y usa el nombre completo (o alt) como etiqueta accesible; las iniciales visibles y el icono genérico llevan aria-hidden, así que la tecnología de asistencia no necesita pronunciar una abreviatura ni inferir identidad desde un símbolo. Los fallbacks decorativos quedan completamente ocultos para accesibilidad. La imagen real permanece con aria-hidden y visualmente transparente hasta que su src exacto dispara onLoad; entonces sustituye el fallback, mientras onError conserva el fallback etiquetado. imageProps compone props y callbacks nativos de imagen. El foco de documentación recibe un outline visible de 2px. En hover aparece de inmediato un contorno del material y solo transiciona una escala sutil de 1,04; prefers-reduced-motion conserva el contorno pero elimina ese movimiento, y los avatares deshabilitados no escalan. Forced-colors conserva un borde de sistema CanvasText, usa Highlight para el contorno de hover y elimina sombras ornamentales. El foreground de iniciales e icono mide al menos 9,36:1 en las cuatro superficies de fallback y ambos esquemas adaptive.",
  sourcePath: "src/registry/ui/avatar.tsx",
  Preview: AvatarPreview,
};
