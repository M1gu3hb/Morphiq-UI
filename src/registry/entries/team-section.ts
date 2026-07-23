import { TeamSectionPreview } from "@/registry/previews/team-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "team-section",
  name: "Team Section",
  nameEs: "Sección de equipo",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive team directory with stable avatars, member roles and bios, semantic list structure, and accessible social links.",
  descriptionEs: "Un directorio de equipo responsive con avatares estables, roles y biografías, estructura de lista semántica y enlaces sociales accesibles.",
  variants: [
    { id: "grid", label: "Grid", labelEs: "Rejilla" },
    { id: "compact", label: "Compact", labelEs: "Compacta" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Members are exposed as a real list of articles with h3 names. Every avatar has descriptive alt text plus explicit width and height to prevent layout shift. Icon-only social links have full accessible names and visible keyboard focus. Reduced motion removes hover transitions, forced colors restores card and image boundaries, and roles, bios, and controls maintain at least 4.5:1 text contrast.",
  a11yEs: "Los miembros se exponen como una lista real de articles con nombres h3. Cada avatar tiene alt descriptivo y ancho y alto explícitos para evitar layout shift. Los enlaces sociales solo-icono tienen nombres accesibles completos y foco visible. Movimiento reducido elimina transiciones hover, forced colors restaura límites de tarjetas e imágenes y roles, biografías y controles mantienen al menos 4,5:1.",
  sourcePath: "src/registry/ui/team-section.tsx",
  Preview: TeamSectionPreview,
};
