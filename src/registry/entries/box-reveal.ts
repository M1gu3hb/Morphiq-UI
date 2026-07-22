import { BoxRevealPreview } from "@/registry/previews/box-reveal-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Box Reveal. */
export const entry: RegistryEntry = {
  slug: "box-reveal",
  name: "Box Reveal",
  nameEs: "Revelado por caja",
  category: "effects",
  materials: ["adaptive"],
  description:
    "An opaque content wrapper revealed on mount by a configurable color block that sweeps across and exits from either direction.",
  descriptionEs:
    "Un wrapper de contenido opaco revelado al montar por un bloque de color configurable que barre y sale desde cualquier dirección.",
  variants: [
    { id: "left", label: "From left", labelEs: "Desde la izquierda" },
    { id: "right", label: "From right", labelEs: "Desde la derecha" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The color block is pointer-ignoring and aria-hidden. Semantic children remain present exactly once in normal DOM order throughout the visual reveal; opacity affects only presentation and never removes content from assistive technology. The wrapper adds no interactive role and descendants retain native focus. prefers-reduced-motion skips both keyframes, leaves content fully opaque and hides the block. forced-colors does the same while restoring Canvas/CanvasText. Owned text exceeds 4.5:1 on the opaque surface.",
  a11yEs:
    "El bloque de color ignora el puntero y es aria-hidden. Los children semánticos permanecen presentes exactamente una vez en el orden DOM normal durante todo el revelado visual; la opacidad solo afecta la presentación y nunca elimina contenido de la tecnología de asistencia. El wrapper no añade rol interactivo y los descendientes conservan su foco nativo. prefers-reduced-motion omite ambos keyframes, deja el contenido totalmente opaco y oculta el bloque. forced-colors hace lo mismo mientras restaura Canvas/CanvasText. El texto propio supera 4,5:1 sobre la superficie opaca.",
  sourcePath: "src/registry/ui/box-reveal.tsx",
  Preview: BoxRevealPreview,
};
