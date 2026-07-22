import { PricingTablePreview } from "@/registry/previews/pricing-table-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "pricing-table",
  name: "Pricing Table",
  nameEs: "Tabla de precios",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive three-plan pricing section with a clearly identified featured plan, accessible monthly/annual switch, feature lists and per-plan actions.",
  descriptionEs: "Una sección responsive de tres planes con plan destacado identificado explícitamente, switch mensual/anual accesible, listas de funciones y acciones por plan.",
  variants: [
    { id: "standard", label: "Standard", labelEs: "Estándar" },
    { id: "quiet", label: "Quiet", labelEs: "Discreto" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The billing control is a native button exposed as role=switch with aria-checked and a stable accessible name. Plans are a real list, features are nested lists, and each plan has its own descriptive heading and link. The featured plan says “Most popular” in text rather than relying on elevation or violet color. Keyboard focus is visible on the switch and every action; reduced motion removes thumb and surface transitions, forced colors restores system borders, and all prices, descriptions and controls maintain at least 4.5:1 text contrast.",
  a11yEs: "El control de facturación es un botón nativo expuesto como role=switch con aria-checked y nombre accesible estable. Los planes son una lista real, las funciones son listas anidadas y cada plan tiene titular y enlace descriptivos. El plan destacado dice «Más popular» en texto en vez de depender de elevación o color violeta. El foco de teclado es visible en el switch y cada acción; movimiento reducido elimina transiciones del thumb y superficies, forced colors restaura bordes del sistema y precios, descripciones y controles mantienen al menos 4,5:1 de contraste textual.",
  sourcePath: "src/registry/ui/pricing-table.tsx",
  Preview: PricingTablePreview,
};
