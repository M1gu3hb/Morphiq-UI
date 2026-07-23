import { NewsletterSignupPreview } from "@/registry/previews/newsletter-signup-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "newsletter-signup",
  name: "Newsletter Signup",
  nameEs: "Suscripción al boletín",
  category: "blocks",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A tactile newsletter capture card with a real email form, stacked or inline layouts, and explicit idle, sending, success, and error feedback.",
  descriptionEs: "Una tarjeta táctil de captura de correo con formulario real, layouts apilado o en línea y feedback explícito de reposo, envío, éxito y error.",
  variants: [
    { id: "stacked", label: "Stacked", labelEs: "Apilada" },
    { id: "inline", label: "Inline", labelEs: "En línea" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Uses a real form, a programmatically associated email label, native email validation, aria-invalid and aria-describedby for errors, and a polite live region for sending outcomes. The submit control is a native button and exposes a disabled state while sending. Meaning is carried by status text rather than icons or color alone; reduced motion stops the spinner and interaction transitions, forced colors restores field and button boundaries, and every material keeps text contrast at or above 4.5:1.",
  a11yEs: "Usa un formulario real, label de correo asociado programáticamente, validación nativa de email, aria-invalid y aria-describedby para errores, y una región live polite para resultados. El envío es un botón nativo y expone estado deshabilitado mientras envía. El significado lo lleva el texto de estado, no solo iconos o color; movimiento reducido detiene spinner y transiciones, forced colors restaura límites de campo y botón y cada material mantiene contraste textual de 4,5:1 o más.",
  sourcePath: "src/registry/ui/newsletter-signup.tsx",
  Preview: NewsletterSignupPreview,
};
