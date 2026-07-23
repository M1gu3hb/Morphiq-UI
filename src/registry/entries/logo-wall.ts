import { LogoWallPreview } from "@/registry/previews/logo-wall-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "logo-wall",
  name: "Logo Wall",
  nameEs: "Muro de logos",
  category: "media",
  materials: ["adaptive"],
  description: "A static responsive logo grid with uniform optical spacing, optional links and framed or monochrome treatment.",
  descriptionEs: "Una rejilla estática y responsiva de logos con espaciado óptico uniforme, enlaces opcionales y tratamiento enmarcado o monocromo.",
  variants: [{ id: "framed", label: "Framed", labelEs: "Enmarcado" }, { id: "mono", label: "Monochrome", labelEs: "Monocromo" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The semantic list has an accessible group label and every logo image requires the organization's full name as alt text. Optional links retain native focus order and visible outlines. Reduced motion removes filter transitions; forced colors clears filters and restores system borders.",
  a11yEs: "La lista semántica tiene etiqueta de grupo y cada logo requiere el nombre completo de la organización como alt. Los enlaces opcionales conservan orden y foco visible. Movimiento reducido elimina transiciones de filtro; colores forzados limpia filtros y restaura bordes.",
  sourcePath: "src/registry/ui/logo-wall.tsx",
  Preview: LogoWallPreview,
};
