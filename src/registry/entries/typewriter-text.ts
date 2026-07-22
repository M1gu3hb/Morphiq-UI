import { TypewriterTextPreview } from "@/registry/previews/typewriter-text-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Typewriter Text. */
export const entry: RegistryEntry = {
  slug: "typewriter-text",
  name: "Typewriter Text",
  nameEs: "Texto mecanografiado",
  category: "text",
  materials: ["adaptive"],
  description:
    "A compact phrase-aware typewriter that types, pauses, deletes and advances without announcing every visual character.",
  descriptionEs:
    "Una máquina de escribir compacta y consciente de frases que escribe, pausa, borra y avanza sin anunciar cada carácter visual.",
  variants: [
    { id: "loop", label: "Loop", labelEs: "Bucle" },
    { id: "once", label: "Once", labelEs: "Una vez" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: {
    npm: ["motion", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Visual characters and the blinking cursor are aria-hidden. A separate atomic polite live region exposes the complete current phrase, so screen readers never receive one announcement per keystroke; announcements can be disabled. The longest phrase reserves layout width without entering the accessibility tree. Font and color inherit from the host. prefers-reduced-motion renders the first phrase in full, stops every timeout and freezes the cursor. forced-colors keeps inherited CanvasText and a solid system cursor. The host foreground/background pair must provide at least 4.5:1 contrast.",
  a11yEs:
    "Los caracteres visuales y el cursor parpadeante son aria-hidden. Una región viva polite, atómica y separada expone la frase actual completa, por lo que los lectores de pantalla nunca reciben un anuncio por tecla; los anuncios se pueden desactivar. La frase más larga reserva el ancho sin entrar al árbol de accesibilidad. Fuente y color se heredan del host. prefers-reduced-motion muestra completa la primera frase, detiene todos los timeouts y congela el cursor. forced-colors conserva CanvasText heredado y un cursor sólido del sistema. El par primer plano/fondo del host debe aportar al menos 4,5:1.",
  sourcePath: "src/registry/ui/typewriter-text.tsx",
  Preview: TypewriterTextPreview,
};
