import { ConfirmDialogPreview } from "@/registry/previews/confirm-dialog-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Confirm Dialog component. */
export const entry: RegistryEntry = {
  slug: "confirm-dialog",
  name: "Confirm Dialog",
  nameEs: "Diálogo de confirmación",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A focus-trapped confirmation modal with a dimmed backdrop, Cancel and Confirm buttons, a default or danger tone, three sizes, and controlled or trigger-driven open state.",
  descriptionEs:
    "Un modal de confirmación con foco atrapado, fondo atenuado, botones Cancelar y Confirmar, tono predeterminado o de peligro, tres tamaños y apertura controlada o mediante disparador.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "The panel is role=\"dialog\" with aria-modal=\"true\", labelled by its title through aria-labelledby and, when a description is present, described by it through aria-describedby, both ids from React.useId(). Opening moves focus to the Cancel button, the safe default for a destructive confirm; Tab and Shift+Tab are trapped so focus cycles within the panel and nothing outside it is reachable. Escape cancels, a click on the backdrop cancels, and on every close focus returns to the trigger element (or to whatever held focus when the dialog opened). Body scroll is locked while the dialog is open. Cancel and Confirm are real buttons with accessible names, and the destructive meaning of the danger tone is carried by the Confirm label and a decorative warning glyph, never by colour alone. The entrance is a scale-and-fade keyframe; under prefers-reduced-motion it is dropped and the dialog is simply present, fully open. Forced-colors mode uses Canvas, CanvasText and a system border for the panel, keeps the backdrop perceivable, and marks the primary Confirm button with Highlight so it stays distinguishable from Cancel once fills are discarded. Title and description contrast at or above 4.5:1 on every material, including both skeuo gradient stops, glass over its tint, and both adaptive colour schemes. Ids come from React.useId() and no timers or random values run during render, so the component is SSR-safe.",
  a11yEs:
    "El panel es role=\"dialog\" con aria-modal=\"true\", etiquetado por su título mediante aria-labelledby y, cuando hay descripción, descrito por ella mediante aria-describedby, con ids de React.useId(). Al abrir, el foco pasa al botón Cancelar, la opción segura ante una confirmación destructiva; Tab y Shift+Tab quedan atrapados para que el foco circule dentro del panel y nada fuera de él sea alcanzable. Escape cancela, un clic en el fondo cancela y en cada cierre el foco regresa al disparador (o a lo que tuviera el foco al abrir). El desplazamiento del cuerpo se bloquea mientras el diálogo está abierto. Cancelar y Confirmar son botones reales con nombres accesibles, y el significado destructivo del tono de peligro lo aporta la etiqueta de Confirmar y un glifo de advertencia decorativo, nunca solo el color. La entrada es un fotograma de escala y desvanecimiento; con prefers-reduced-motion se omite y el diálogo aparece presente y abierto. El modo de colores forzados usa Canvas, CanvasText y un borde de sistema en el panel, mantiene el fondo perceptible y marca el botón principal Confirmar con Highlight para que siga distinguiéndose de Cancelar cuando se descartan los rellenos. Título y descripción contrastan al menos 4,5:1 en cada material, incluidos ambos extremos del gradiente skeuo, glass sobre su tinte y los dos esquemas adaptive. Los ids provienen de React.useId() y no se ejecutan temporizadores ni valores aleatorios durante el render, por lo que el componente es seguro para SSR.",
  sourcePath: "src/registry/ui/confirm-dialog.tsx",
  Preview: ConfirmDialogPreview,
};
