import { AlertPreview } from "@/registry/previews/alert-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Alert component. */
export const entry: RegistryEntry = {
  slug: "alert",
  name: "Alert / Callout",
  nameEs: "Alerta / Aviso",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A structured page callout with five semantic tones, three sizes, decorative tone icons, an optional action, and explicit live-region urgency.",
  descriptionEs:
    "Un aviso estructurado para página con cinco tonos semánticos, tres tamaños, iconos tonales decorativos, acción opcional y urgencia explícita de región viva.",
  variants: [
    { id: "neutral", label: "Neutral", labelEs: "Neutral" },
    { id: "info", label: "Info", labelEs: "Información" },
    { id: "success", label: "Success", labelEs: "Éxito" },
    { id: "warning", label: "Warning", labelEs: "Advertencia" },
    { id: "danger", label: "Danger", labelEs: "Peligro" },
  ],
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
    "Requires a visible title and description children, and prefixes the accessible name with Note, Information, Success, Warning or Error so meaning never depends only on colour or icon shape; toneLabel localises or customises that prefix. Default tone icons are decorative and aria-hidden; pass icon={false} to remove one or provide a custom decorative icon. urgency=\"auto\" maps neutral/info/success to role=\"status\" with aria-live=\"polite\", and warning/danger to role=\"alert\" with aria-live=\"assertive\". The caller can override that policy with polite, assertive or off when product context is more important than tone; live regions are aria-atomic. The optional action slot accepts a real button or link but Alert owns no dismissal state, so focus restoration stays with the consumer that removes it. Forced-colors mode uses Canvas, CanvasText and a system border while removing ornamental shadows. Alert has no motion, so reduced-motion users receive the same immediate updates. Title and description share a tested foreground and measure at least 4.86:1 in every material/tone combination, including both skeuo gradient stops, glass over black and white, and both adaptive colour schemes.",
  a11yEs:
    "Exige un título visible y una descripción en children, y antepone al nombre accesible Note, Information, Success, Warning o Error para que el significado nunca dependa solo del color o de la forma del icono; toneLabel permite traducir o personalizar ese prefijo. Los iconos tonales predeterminados son decorativos y llevan aria-hidden; usa icon={false} para quitarlo o proporciona otro icono decorativo. urgency=\"auto\" asigna neutral/info/success a role=\"status\" con aria-live=\"polite\", y warning/danger a role=\"alert\" con aria-live=\"assertive\". Quien consume puede sustituir esa política por polite, assertive u off cuando el contexto del producto importe más que el tono; las regiones vivas usan aria-atomic. El slot de acción opcional acepta un botón o enlace real, pero Alert no guarda estado de cierre, así que restaurar el foco corresponde a quien lo elimina. El modo de colores forzados usa Canvas, CanvasText y un borde de sistema y elimina sombras ornamentales. Alert no tiene movimiento, por lo que quienes prefieren movimiento reducido reciben las mismas actualizaciones inmediatas. Título y descripción comparten un foreground probado y miden al menos 4,86:1 en cada combinación de material y tono, incluidos ambos extremos del gradiente skeuo, glass sobre negro y blanco y los dos esquemas adaptive.",
  sourcePath: "src/registry/ui/alert.tsx",
  Preview: AlertPreview,
};
