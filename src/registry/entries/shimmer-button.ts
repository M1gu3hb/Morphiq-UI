import { ShimmerButtonPreview } from "@/registry/previews/shimmer-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Shimmer Button. */
export const entry: RegistryEntry = {
  slug: "shimmer-button",
  name: "Shimmer Button",
  nameEs: "Botón Shimmer",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile native button whose self-contained CSS highlight continuously travels around the material edge without washing over the label.",
  descriptionEs:
    "Un botón nativo y táctil cuyo brillo CSS autocontenido recorre continuamente el borde del material sin pasar sobre la etiqueta.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Renders a native <button> with type=\"button\" by default, preserving keyboard activation, form semantics and the native disabled contract. A 2px offset :focus-visible outline remains immediate and switches to the system Highlight colour in forced-colors mode. The travelling highlight is confined to the perimeter, so it never changes the label's contrast; prefers-reduced-motion stops the loop and every tactile transition, leaving the same static edge and state. Disabled buttons stop the animation, cannot activate and visibly lose emphasis. Text contrast against the stable inner surface is at least 4.5:1 in all four recipes, including both adaptive colour schemes; the animated edge is decorative and carries no state or meaning.",
  a11yEs:
    "Renderiza un <button> nativo con type=\"button\" por defecto, por lo que conserva la activación por teclado, la semántica de formulario y el contrato nativo de deshabilitado. Un contorno inmediato de 2 px con :focus-visible cambia al color de sistema Highlight en forced-colors. El brillo viajero está confinado al perímetro, así que nunca modifica el contraste de la etiqueta; prefers-reduced-motion detiene el bucle y todas las transiciones táctiles, dejando el mismo borde y estado estáticos. Los botones deshabilitados detienen la animación, no se pueden activar y pierden énfasis visual. El contraste del texto contra la superficie interior estable es de al menos 4,5:1 en las cuatro recetas, incluidos ambos esquemas de adaptive; el borde animado es decorativo y no comunica estado ni significado.",
  sourcePath: "src/registry/ui/shimmer-button.tsx",
  Preview: ShimmerButtonPreview,
};
