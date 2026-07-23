import { AnnouncementBannerPreview } from "@/registry/previews/announcement-banner-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "announcement-banner",
  name: "Announcement Banner",
  nameEs: "Banner de anuncio",
  category: "blocks",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A tactile announcement region with concise copy, a native CTA, optional dismissal, and an explicit focus-return target.",
  descriptionEs: "Una región táctil de anuncio con texto conciso, CTA nativo, cierre opcional y destino explícito para devolver el foco.",
  variants: [
    { id: "inline", label: "Inline", labelEs: "En línea" },
    { id: "floating", label: "Floating", labelEs: "Flotante" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The banner is a named region, the CTA is a native anchor, and dismissal is a native button with an accessible name. Callers can provide focusAfterDismissRef so focus moves to the next meaningful control after the region disappears; onDismiss also supports controlled workflows. The text carries the announcement meaning independently of icon or color. Reduced motion removes interaction transitions, forced colors restores system boundaries, and all material recipes maintain at least 4.5:1 text contrast.",
  a11yEs: "El banner es una región nombrada, el CTA es un anchor nativo y el cierre es un botón nativo con nombre accesible. El consumidor puede pasar focusAfterDismissRef para mover el foco al siguiente control significativo cuando desaparece; onDismiss también permite flujos controlados. El texto lleva el significado sin depender de icono o color. Movimiento reducido elimina transiciones, forced colors restaura límites y todos los materiales mantienen al menos 4,5:1.",
  sourcePath: "src/registry/ui/announcement-banner.tsx",
  Preview: AnnouncementBannerPreview,
};
