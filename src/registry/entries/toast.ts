import { ToastPreview } from "@/registry/previews/toast-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Toast component. */
export const entry: RegistryEntry = {
  slug: "toast",
  name: "Toast",
  nameEs: "Notificación emergente",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A transient notice that slides in, announces itself, and auto-closes with the countdown paused on hover or focus. Five semantic tones, three sizes, a labelled close button, and a fixed stacking viewport.",
  descriptionEs:
    "Un aviso transitorio que se desliza, se anuncia y se cierra solo, con la cuenta atrás en pausa al pasar el cursor o al recibir foco. Cinco tonos semánticos, tres tamaños, un botón de cierre etiquetado y un contenedor fijo para apilarlas.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Each toast is its own live region and prefixes its accessible name with a visually hidden tone word (Note, Information, Success, Warning or Error) so meaning never depends on colour or icon shape; toneLabel localises that prefix and the tone icon stays decorative and aria-hidden. urgency=\"auto\" maps neutral/info/success to role=\"status\" with aria-live=\"polite\" and warning/danger to role=\"alert\" with aria-live=\"assertive\"; polite, assertive or off override that policy when product context outweighs tone, and every live region is aria-atomic. The toast is non-modal and never steals focus. Auto-close pauses on pointer hover and on keyboard focus and resumes on leave, so a message is never lost mid-read; the timer lives in an effect and is cleared on pause and unmount, and duration=0 disables it entirely. The close button carries an explicit label and a visible focus ring, and the ToastViewport is a region landmark rather than a second live region so announcements are not doubled. The slide-in is decorative keyframe motion, so reduced-motion users get the toast immediately with no travel and no looping animation. Forced-colors mode swaps fills and shadows for Canvas, CanvasText and a system border, keeps the tone marker and the close glyph on CanvasText, and marks focus with Highlight. Title and description reuse the tested Alert foregrounds, which measure at least 4.86:1 in every material and tone, including both skeuo gradient stops and both adaptive colour schemes.",
  a11yEs:
    "Cada notificación es su propia región viva y antepone a su nombre accesible una palabra de tono oculta (Note, Information, Success, Warning o Error) para que el significado nunca dependa del color ni de la forma del icono; toneLabel traduce ese prefijo y el icono de tono permanece decorativo con aria-hidden. urgency=\"auto\" asigna neutral/info/success a role=\"status\" con aria-live=\"polite\" y warning/danger a role=\"alert\" con aria-live=\"assertive\"; polite, assertive u off sustituyen esa política cuando el contexto del producto pesa más que el tono, y toda región viva usa aria-atomic. La notificación no es modal y nunca roba el foco. El cierre automático se pausa al pasar el cursor y al recibir foco de teclado, y se reanuda al salir, para no perder un mensaje a mitad de lectura; el temporizador vive en un efecto y se limpia al pausar y al desmontar, y duration=0 lo desactiva por completo. El botón de cierre lleva una etiqueta explícita y un anillo de foco visible, y ToastViewport es un punto de referencia de región, no una segunda región viva, para no duplicar los anuncios. El deslizamiento de entrada es movimiento decorativo por keyframes, así que quienes prefieren movimiento reducido reciben la notificación de inmediato, sin traslado ni bucles. El modo de colores forzados cambia rellenos y sombras por Canvas, CanvasText y un borde de sistema, mantiene el marcador de tono y el glifo de cierre en CanvasText y marca el foco con Highlight. Título y descripción reutilizan los foregrounds probados de Alert, que miden al menos 4,86:1 en cada material y tono, incluidos ambos extremos del gradiente skeuo y los dos esquemas adaptive.",
  sourcePath: "src/registry/ui/toast.tsx",
  Preview: ToastPreview,
};
