import { HeroVideoDialogPreview } from "@/registry/previews/hero-video-dialog-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Hero Video Dialog. */
export const entry: RegistryEntry = {
  slug: "hero-video-dialog",
  name: "Hero Video Dialog",
  nameEs: "Diálogo de video hero",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile video poster whose named play control opens a native modal dialog with a focused player and predictable dismissal.",
  descriptionEs:
    "Un póster de video táctil cuyo control play abre un diálogo modal nativo con reproductor enfocado y cierre predecible.",
  variants: [
    { id: "cinema", label: "Cinema", labelEs: "Cine" },
    { id: "editorial", label: "Editorial", labelEs: "Editorial" },
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
    "The poster image requires meaningful alt text and the native play button names the video. HTMLDialogElement.showModal supplies a true top-layer modal and Escape cancellation; explicit Tab/Shift+Tab wrapping keeps focus between the close control and player. The close button receives initial focus, the video pauses on close, and focus returns to the play trigger. The dialog is labelled by its title and optionally described by its summary. prefers-reduced-motion removes dialog/backdrop animation and blur, while forced-colors restores system surfaces, controls and boundaries. Material copy stays above 4.5:1 and controls use explicit focus outlines.",
  a11yEs:
    "La miniatura requiere alt significativo y el botón play nativo nombra el video. HTMLDialogElement.showModal aporta modal real en top layer y cancelación con Escape; el ciclo explícito de Tab/Shift+Tab mantiene el foco entre Cerrar y el reproductor. El botón cerrar recibe foco inicial, el video se pausa al cerrar y el foco vuelve al disparador. El diálogo se etiqueta con su título y opcionalmente se describe con el resumen. prefers-reduced-motion elimina animación y blur; forced-colors recupera superficies, controles y límites del sistema. El texto material supera 4,5:1 y los controles usan contornos explícitos.",
  sourcePath: "src/registry/ui/hero-video-dialog.tsx",
  Preview: HeroVideoDialogPreview,
};
