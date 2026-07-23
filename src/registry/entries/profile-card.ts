import { ProfileCardPreview } from "@/registry/previews/profile-card-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the profile-card component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "profile-card",
  name: "Profile Card",
  nameEs: "Tarjeta de perfil",
  category: "cards",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A person surface with an avatar, a real heading for the name, a role line, a short bio and a row of named social links, plus an optional primary action — four material recipes and three densities.",
  descriptionEs:
    "Una superficie de persona con avatar, un encabezado real para el nombre, una línea de rol, una biografía breve y una fila de enlaces sociales con nombre, más una acción principal opcional: cuatro recetas de material y tres densidades.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Built from semantic HTML: the card is an <article>, the person's name is a real heading whose rank is overridable via the headingLevel prop (default h3) so it matches the surrounding document outline, the role and bio are <p> elements, and the social links are a <ul> of real <a> elements. Each social link carries an accessible name through aria-label (the icon inside is aria-hidden and decorative), and the optional primary action is a real <a> (when it has an href) or a <button type=\"button\"> with its label as its accessible name. The avatar is an <img> with author-supplied alt (empty by default, since the name is already in the heading); when no image is given, an initials avatar is drawn as a role=\"img\" span labelled with the person's name. Because the card holds several independent controls it is deliberately not whole-clickable — there is no stretched-link overlay and no :focus-within ring on the container; instead every link and button shows its own :focus-visible ring, and the card also exposes a data-focus hook for documentation. Nothing is carried by color alone: the role, bio and every link and action are spelled out in text. Contrast holds at or above 4.5:1 on every filled material for the name, role and bio — the glass recipe carries its own muted tint so this survives over a white or a black backdrop — and the inverted action button reuses the surface tokens to keep its label legible on each material and in adaptive dark. Motion is compositor-only (a small translate lift on hover) and is cancelled under prefers-reduced-motion; in forced-colors mode shadows and translucency are discarded while system-colored borders keep the card and each control perceivable and the focus ring switches to Highlight.",
  a11yEs:
    "Construida con HTML semántico: la tarjeta es un <article>, el nombre de la persona es un encabezado real cuyo rango es ajustable con la prop headingLevel (h3 por defecto) para encajar con el esquema del documento, el rol y la biografía son elementos <p>, y los enlaces sociales son una <ul> de elementos <a> reales. Cada enlace social lleva un nombre accesible mediante aria-label (el icono interior es aria-hidden y decorativo), y la acción principal opcional es un <a> real (cuando tiene href) o un <button type=\"button\"> con su etiqueta como nombre accesible. El avatar es un <img> con alt provisto por el autor (vacío por defecto, ya que el nombre está en el encabezado); cuando no hay imagen se dibuja un avatar de iniciales como span role=\"img\" etiquetado con el nombre de la persona. Como la tarjeta contiene varios controles independientes, a propósito no es clicable en su totalidad: no hay superposición de enlace estirado ni anillo :focus-within en el contenedor; en su lugar cada enlace y botón muestra su propio anillo :focus-visible, y la tarjeta expone además un hook data-focus para la documentación. Nada se transmite solo con color: el rol, la biografía y cada enlace y acción se expresan en texto. El contraste se mantiene en 4,5:1 o más en cada material con relleno para el nombre, el rol y la biografía —la receta de vidrio lleva su propio tinte atenuado para que esto se cumpla sobre fondo blanco o negro— y el botón de acción invertido reutiliza los tokens de la superficie para mantener su etiqueta legible en cada material y en el modo oscuro adaptativo. El movimiento es solo de composición (un leve desplazamiento al pasar el cursor) y se cancela bajo prefers-reduced-motion; en forced-colors se descartan sombras y translucidez mientras los bordes con color de sistema mantienen perceptibles la tarjeta y cada control, y el anillo de foco cambia a Highlight.",
  sourcePath: "src/registry/ui/profile-card.tsx",
  Preview: ProfileCardPreview,
};
