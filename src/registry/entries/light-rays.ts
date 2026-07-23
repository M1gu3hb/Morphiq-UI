import { LightRaysPreview } from "@/registry/previews/light-rays-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "light-rays",
  name: "Light Rays",
  nameEs: "Rayos de luz",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "Configurable conic-gradient god rays that sweep gently from a bounded origin behind a protected content layer.",
  descriptionEs: "Rayos tipo god-rays con gradiente cónico que barren suavemente desde un origen acotado detrás de contenido protegido.",
  variants: [
    { id: "sunrise", label: "Sunrise", labelEs: "Amanecer" },
    { id: "cool", label: "Cool", labelEs: "Fría" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Rays, origin glow, and scrim are aria-hidden and pointer-transparent. Origin props are clamped to the component bounds, and a dark overlay protects at least 4.5:1 foreground contrast through the whole sweep. Reduced motion freezes rotation, scale, and opacity; forced colors hides all decorative layers and restores CanvasText.",
  a11yEs: "Rayos, brillo de origen y velo son aria-hidden y dejan pasar el puntero. El origen se limita al componente y una capa oscura protege al menos 4,5:1 durante todo el barrido. Movimiento reducido congela rotación, escala y opacidad; forced colors oculta todas las capas y restaura CanvasText.",
  sourcePath: "src/registry/ui/light-rays.tsx",
  Preview: LightRaysPreview,
};
