import { InputOTPPreview } from "@/registry/previews/input-otp-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Input OTP. */
export const entry: RegistryEntry = {
  slug: "input-otp",
  name: "Input OTP",
  nameEs: "Entrada OTP",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A native multi-slot one-time-code field with numeric mobile input, SMS autofill, full-code paste, automatic focus advance and Backspace retreat.",
  descriptionEs:
    "Un campo nativo de código de un solo uso con varias casillas, teclado numérico móvil, autollenado SMS, pegado del código completo, avance automático del foco y retroceso con Backspace.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "Every slot is a native text <input> with inputMode=\"numeric\"; the first exposes autoComplete=\"one-time-code\" for platform SMS autofill, while the group and every numbered digit receive an accessible label. Typing advances focus, an empty Backspace clears and returns to the preceding slot, Arrow keys/Home/End remain available, and pasting a full code distributes it without replacing native focus semantics. A provided name is submitted exactly once through a native hidden input. The error contract is both aria-invalid and an optional polite text message, so it never depends on the red boundary alone. Focus gets an immediate 2px outline plus a material-specific tactile well. prefers-reduced-motion removes interpolation while retaining those final states; forced-colors replaces all fills and shadows with Field, FieldText, CanvasText, Highlight and Mark system colours. Digits remain at least 4.5:1 against every slot surface, including the focused surfaces and both adaptive colour schemes, and slot boundaries remain at least 3:1.",
  a11yEs:
    "Cada casilla es un <input> de texto nativo con inputMode=\"numeric\"; la primera expone autoComplete=\"one-time-code\" para el autollenado SMS de la plataforma, mientras el grupo y cada dígito numerado reciben una etiqueta accesible. Al escribir avanza el foco, Backspace sobre una casilla vacía limpia y vuelve a la anterior, las flechas/Home/End siguen disponibles y pegar un código completo lo distribuye sin sustituir la semántica nativa de foco. Si se proporciona name, el valor se envía una sola vez mediante un input hidden nativo. El contrato de error combina aria-invalid y un mensaje de texto polite opcional, así que nunca depende solo del borde rojo. El foco recibe un contorno inmediato de 2 px más un pozo táctil propio del material. prefers-reduced-motion elimina la interpolación conservando los estados finales; forced-colors sustituye rellenos y sombras por los colores de sistema Field, FieldText, CanvasText, Highlight y Mark. Los dígitos mantienen al menos 4,5:1 contra todas las superficies de casilla, incluidas las enfocadas y ambos esquemas adaptive, y los límites de casilla conservan al menos 3:1.",
  sourcePath: "src/registry/ui/input-otp.tsx",
  Preview: InputOTPPreview,
};
