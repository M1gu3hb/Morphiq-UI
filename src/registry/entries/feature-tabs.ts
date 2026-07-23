import { FeatureTabsPreview } from "@/registry/previews/feature-tabs-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "feature-tabs",
  name: "Feature Tabs",
  nameEs: "Pestañas de funciones",
  category: "blocks",
  materials: ["adaptive"],
  description: "A feature showcase using Radix tabs, roving keyboard focus, responsive panels, supporting bullet lists, and motion-safe decoration.",
  descriptionEs: "Un showcase de funciones con tabs de Radix, foco roving por teclado, paneles responsive, listas de apoyo y decoración segura.",
  variants: [
    { id: "pills", label: "Pills", labelEs: "Píldoras" },
    { id: "underline", label: "Underline", labelEs: "Subrayada" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["@radix-ui/react-tabs", "class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Radix supplies tablist, tab, and tabpanel semantics, aria-selected/controls wiring, activation, and Arrow/Home/End keyboard behavior. The selected trigger is explicitly the tab stop while inactive triggers are -1, preserving the canonical roving contract. Every panel has an h3 and readable bullets; color is not the only selected-state cue. Reduced motion stops the decorative pulse and transitions, forced colors marks controls and panels, and copy maintains at least 4.5:1 contrast.",
  a11yEs: "Radix aporta semántica tablist, tab y tabpanel, cableado aria-selected/controls, activación y teclado Flechas/Home/End. El trigger seleccionado es explícitamente el tab stop y los inactivos quedan en -1, preservando el contrato roving. Cada panel tiene h3 y bullets legibles; el color no es la única señal. Movimiento reducido detiene pulso y transiciones, forced colors marca controles y paneles y el texto mantiene al menos 4,5:1.",
  sourcePath: "src/registry/ui/feature-tabs.tsx",
  Preview: FeatureTabsPreview,
};
