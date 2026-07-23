import { ContactSectionPreview } from "@/registry/previews/contact-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "contact-section",
  name: "Contact Section",
  nameEs: "Sección de contacto",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive contact block combining direct contact details with a validated name, email, and message form.",
  descriptionEs: "Un bloque de contacto responsive que combina datos directos con un formulario validado de nombre, correo y mensaje.",
  variants: [
    { id: "split", label: "Split", labelEs: "Dividida" },
    { id: "stacked", label: "Stacked", labelEs: "Apilada" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "All controls have native associated labels, autocomplete hints, visible focus, aria-invalid, and field-specific aria-describedby errors. Invalid submission focuses the first failing field; submission outcomes are announced by a polite live region. Contact details are a real list and decorative icons are hidden. Reduced motion stops decorative control feedback, forced colors restores system fields and borders, and text and errors meet at least 4.5:1 contrast.",
  a11yEs: "Todos los controles tienen labels nativos asociados, sugerencias autocomplete, foco visible, aria-invalid y errores específicos mediante aria-describedby. Un envío inválido enfoca el primer campo con error; los resultados se anuncian en una región live polite. Los datos de contacto son una lista real y los iconos decorativos están ocultos. Movimiento reducido detiene feedback decorativo, forced colors restaura campos y bordes y textos y errores cumplen al menos 4,5:1.",
  sourcePath: "src/registry/ui/contact-section.tsx",
  Preview: ContactSectionPreview,
};
