import { AudioPlayerPreview } from "@/registry/previews/audio-player-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "audio-player",
  name: "Audio Player",
  nameEs: "Reproductor de audio",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A tactile audio player with a bounded decorative waveform, native progress and volume controls, and four material recipes.",
  descriptionEs: "Un reproductor de audio táctil con onda decorativa acotada, controles nativos de progreso y volumen y cuatro recetas materiales.",
  variants: [{ id: "waveform", label: "Waveform", labelEs: "Onda" }, { id: "compact", label: "Compact", labelEs: "Compacto" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The labelled player exposes native play, progress and volume controls with visible elapsed/total time and a polite play-state announcement. Space toggles playback, arrows seek and M mutes outside range controls. The waveform is aria-hidden, reduced motion freezes it, and forced colors preserves controls and copy.",
  a11yEs: "El reproductor etiquetado expone controles nativos de reproducción, progreso y volumen, tiempo visible y anuncio del estado. Espacio reproduce, flechas buscan y M silencia fuera de los rangos. La onda es aria-hidden, movimiento reducido la congela y colores forzados conserva controles.",
  sourcePath: "src/registry/ui/audio-player.tsx",
  Preview: AudioPlayerPreview,
};
