import { TestimonialSectionPreview } from "@/registry/previews/testimonial-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "testimonial-section",
  name: "Testimonial Section",
  nameEs: "Sección de testimonios",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive testimonial grid or single spotlight with semantic quotations, portable avatar images and explicit author attribution.",
  descriptionEs: "Una rejilla responsive de testimonios o un testimonio destacado con citas semánticas, avatares portables y atribución explícita de autoría.",
  variants: [
    { id: "grid", label: "Grid", labelEs: "Rejilla" },
    { id: "spotlight", label: "Spotlight", labelEs: "Destacado" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Each story is a figure containing blockquote, figcaption and cite, so quotation and author remain structurally associated. Avatar images use empty alt because the adjacent cite already exposes the person’s name and role; duplicate speech is avoided. The quote icon is aria-hidden. Grid order matches DOM order on every viewport, forced colors restores card borders, and quotation, name, role and heading colors meet at least 4.5:1 against their owned surfaces.",
  a11yEs: "Cada historia es un figure que contiene blockquote, figcaption y cite, por lo que cita y autor permanecen asociados estructuralmente. Los avatares usan alt vacío porque el cite adyacente ya expone nombre y rol; se evita lectura duplicada. El ícono de cita usa aria-hidden. El orden visual coincide con el DOM en cada viewport, forced colors restaura bordes de tarjetas y colores de cita, nombre, rol y titular alcanzan al menos 4,5:1 contra sus superficies propias.",
  sourcePath: "src/registry/ui/testimonial-section.tsx",
  Preview: TestimonialSectionPreview,
};
