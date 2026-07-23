import { VideoPlayerPreview } from "@/registry/previews/video-player-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "video-player",
  name: "Video Player",
  nameEs: "Reproductor de video",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A four-material native video player with custom play, scrub, volume and caption controls plus documented keyboard shortcuts.",
  descriptionEs: "Un reproductor de video nativo en cuatro materiales con controles propios de reproducción, avance, volumen y subtítulos, más atajos de teclado.",
  variants: [{ id: "cinema", label: "Cinema", labelEs: "Cine" }, { id: "minimal", label: "Minimal", labelEs: "Mínimo" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The named video sits inside a labelled, focusable player. Native buttons and ranges expose play/pause, elapsed time, scrubbing, volume and caption state. Space/K toggles playback, arrows seek five seconds, M mutes and C toggles an available track. Reduced motion removes control scaling and forced colors restores system controls and boundaries.",
  a11yEs: "El video nombrado vive en un reproductor etiquetado y enfocable. Botones y rangos nativos exponen reproducción, tiempo, avance, volumen y subtítulos. Espacio/K reproduce, flechas avanzan cinco segundos, M silencia y C conmuta la pista disponible. Movimiento reducido elimina escalado y colores forzados restaura controles.",
  sourcePath: "src/registry/ui/video-player.tsx",
  Preview: VideoPlayerPreview,
};
