import { TextScramblePreview } from "@/registry/previews/text-scramble-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "text-scramble",
  name: "Text Scramble",
  nameEs: "Texto decodificado",
  category: "text",
  materials: ["adaptive"],
  description: "A deterministic one-pass decoder that resolves letters or symbols into final copy while keeping the complete accessible name stable from the start.",
  descriptionEs: "Un decodificador determinista de una pasada que resuelve letras o símbolos hasta el texto final, manteniendo estable el nombre accesible completo desde el inicio.",
  variants: [
    { id: "letters", label: "Letters", labelEs: "Letras" },
    { id: "symbols", label: "Symbols", labelEs: "Símbolos" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "A screen-reader-only copy exposes the complete final phrase from the first render; every intermediate glyph is aria-hidden. The random-looking sequence is deterministic by character index and progress, avoiding hydration drift. An invisible final copy reserves width before decoding, so no layout shift occurs. prefers-reduced-motion and forced-colors hide the cipher layer and show the final phrase directly. Font and foreground inherit from the host, which must maintain at least 4.5:1 contrast.",
  a11yEs: "Una copia solo para lector expone la frase final completa desde el primer render; cada glifo intermedio usa aria-hidden. La secuencia aparentemente aleatoria es determinista por índice y progreso, evitando diferencias de hidratación. Una copia final invisible reserva el ancho antes de decodificar, por lo que no hay cambio de layout. prefers-reduced-motion y forced-colors ocultan la capa cifrada y muestran directamente la frase final. Fuente y primer plano se heredan del host, que debe mantener al menos 4,5:1 de contraste.",
  sourcePath: "src/registry/ui/text-scramble.tsx",
  Preview: TextScramblePreview,
};
