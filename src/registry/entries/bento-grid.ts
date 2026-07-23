import { BentoGridPreview } from "@/registry/previews/bento-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "bento-grid",
  name: "Bento Grid",
  nameEs: "Rejilla bento",
  category: "blocks",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "An asymmetric or balanced feature grid with mixed spans, tactile cell surfaces, semantic headings, and optional whole-cell links.",
  descriptionEs: "Una rejilla de funciones asimétrica o equilibrada con spans mixtos, superficies táctiles, encabezados semánticos y enlaces opcionales de celda completa.",
  variants: [
    { id: "asymmetric", label: "Asymmetric", labelEs: "Asimétrica" },
    { id: "balanced", label: "Balanced", labelEs: "Equilibrada" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The section is labelled by its h2 and every cell contains an h3. Linked cells are native anchors with visible focus; inert cells remain articles and never fake button semantics. Wide and tall spans change only visual layout, not source order. Hover elevation is disabled under reduced motion, forced colors restores cell boundaries, icons are decorative, and primary and muted copy maintain at least 4.5:1 contrast across all four materials.",
  a11yEs: "La sección está etiquetada por su h2 y cada celda contiene un h3. Las celdas enlazables son anchors nativos con foco visible; las inertes siguen siendo articles y no fingen semántica de botón. Los spans anchos y altos solo cambian el layout visual, no el orden fuente. Movimiento reducido elimina la elevación, forced colors restaura límites, los iconos son decorativos y el texto principal y secundario mantiene al menos 4,5:1 en los cuatro materiales.",
  sourcePath: "src/registry/ui/bento-grid.tsx",
  Preview: BentoGridPreview,
};
