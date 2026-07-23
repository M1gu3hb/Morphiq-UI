import { ThemeTogglePreview } from "@/registry/previews/theme-toggle-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the theme-toggle component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "theme-toggle",
  name: "Theme Toggle",
  nameEs: "Alternador de tema",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A light/dark switch rendered as a role=\"switch\" button with a sun/moon crossfade thumb, across four material recipes and three sizes, keeping its state in memory or under your control.",
  descriptionEs:
    "Un interruptor claro/oscuro representado como un botón role=\"switch\" con un pulgar que funde sol y luna, en cuatro recetas de material y tres tamaños, que mantiene su estado en memoria o bajo tu control.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "A single native <button> with role=\"switch\" and aria-checked reflecting dark mode, plus a required accessible name (aria-label, default \"Dark mode\"). State is never carried by colour alone: a sun and a moon icon crossfade to mark light versus dark, aria-checked exposes the same state to assistive tech, and a polite aria-live region — mounted empty so it exists in the DOM before any text arrives, silent on first render — confirms \"Dark mode on\" / \"Dark mode off\" on each toggle. Being a real button it toggles natively on Enter and Space; focus is shown with a 2px offset ring on :focus-visible (and a parallel data-focus hook so the docs can force the focused look) that is never removed with outline-none. Under prefers-reduced-motion the thumb slide and the glyph rotate/fade are dropped via motion-reduce, but the correct glyph and thumb position are the transitions' resting end-state so they still show, and the track's deeper pressed inset applies instantly on :active so the tactile feedback is preserved. In forced-colors the track keeps its bounds with a CanvasText border on a Canvas fill, the thumb becomes a solid CanvasText mark with a Canvas glyph so its position still reads, and the focus ring becomes Highlight. Contrast: the visible sun/moon glyph uses each material's measured foreground token against its own thumb surface, staying >= 4.5:1 on clay, glass, skeuo and adaptive in both light and dark.",
  a11yEs:
    "Un único <button> nativo con role=\"switch\" y aria-checked que refleja el modo oscuro, además de un nombre accesible obligatorio (aria-label, por defecto \"Dark mode\"). El estado nunca depende solo del color: un icono de sol y uno de luna se funden para marcar claro frente a oscuro, aria-checked expone el mismo estado a la tecnología asistiva, y una región aria-live \"polite\" —montada vacía para existir en el DOM antes de que llegue el texto, silenciosa en el primer render— confirma \"Dark mode on\" / \"Dark mode off\" en cada cambio. Al ser un botón real, alterna de forma nativa con Enter y Espacio; el foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (y un gancho data-focus paralelo para que la documentación fuerce el aspecto enfocado) que nunca se elimina con outline-none. Bajo prefers-reduced-motion se descartan el deslizamiento del pulgar y el giro/fundido de los glifos mediante motion-reduce, pero el glifo correcto y la posición del pulgar son el estado final de reposo de las transiciones, así que siguen mostrándose, y el hundimiento interior más profundo de la pista se aplica al instante en :active, conservando la respuesta táctil. En forced-colors la pista mantiene sus límites con un borde CanvasText sobre un relleno Canvas, el pulgar se convierte en una marca sólida CanvasText con un glifo Canvas para que su posición siga leyéndose, y el anillo de foco pasa a Highlight. Contraste: el glifo visible de sol/luna usa el token de primer plano medido de cada material sobre su propia superficie de pulgar, manteniéndose >= 4,5:1 en clay, glass, skeuo y adaptive tanto en claro como en oscuro.",
  sourcePath: "src/registry/ui/theme-toggle.tsx",
  Preview: ThemeTogglePreview,
};
