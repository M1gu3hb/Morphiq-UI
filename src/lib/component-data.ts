/**
 * The four material styles every core component ships recipes for. This is the
 * type that flows through the whole catalog: `entry.materials`, the detail-page
 * switcher and `PreviewProps.material` all use it, and every component's own
 * `material` prop is a subset of it.
 *
 * `liquid-glass` is deliberately NOT a member here. Adding it would force every
 * one of the 22 components (all under `src/registry/ui`) to accept it, and this
 * branch is scoped not to touch those files while Codex works in parallel. It
 * is instead a fifth *style family* (`StyleFamilySlug` below), piloted as a
 * component-local material on Button and Card. Promoting it to a first-class
 * catalog material is a follow-up that has to run on its own, editing every
 * component and preview at once — see docs/reports/0037.
 */
export type StyleSlug = "clay" | "glass" | "skeuo" | "adaptive";

/**
 * Every style family the site knows about, including the ones not yet wired as
 * a catalog-wide material. A superset of `StyleSlug`; used by `styleFamilies`
 * and the Studio, never as a component's `material` prop.
 */
export type StyleFamilySlug = StyleSlug | "liquid-glass";

type StyleFamily<Slug extends StyleFamilySlug> = {
  slug: Slug;
  number: string;
  name: string;
  description: string;
  descriptionEs: string;
};

/**
 * The families rendered catalog-wide today — the four that every surface (the
 * home grid, the Studio and `SurfacePreview`) already knows how to draw, so the
 * slug stays `StyleSlug`. The fifth is deferred to the coordinated round that
 * wires liquid-glass end to end, because those consumers each assume four; its
 * identity ships now, decoupled, as `pilotStyleFamily`.
 */
export const styleFamilies: Array<StyleFamily<StyleSlug>> = [
  {
    slug: "clay",
    number: "01",
    name: "Claymorphism",
    description: "Inflated geometry, broad radii, and nested light that feels soft and dimensional.",
    descriptionEs: "Geometría inflada, radios amplios y luz anidada que se siente suave y dimensional.",
  },
  {
    slug: "glass",
    number: "02",
    name: "Glassmorphism",
    description: "Translucent layers with real backdrop context, sharp edges, and controlled diffusion.",
    descriptionEs: "Capas translúcidas con contexto real, bordes definidos y difusión controlada.",
  },
  {
    slug: "skeuo",
    number: "03",
    name: "Skeuomorphism",
    description: "Physical controls, material cues, and familiar mechanics—modernized, not nostalgic cosplay.",
    descriptionEs: "Controles físicos, señales materiales y mecánicas familiares, modernizadas sin disfraz nostálgico.",
  },
  {
    slug: "adaptive",
    number: "04",
    name: "Polymorphic",
    description: "Components that change element, density, and presentation according to context.",
    descriptionEs: "Componentes que cambian elemento, densidad y presentación según el contexto.",
  },
];

/**
 * The fifth style family, piloted on Button and Card ahead of the catalog-wide
 * wiring. Its name and description live here — decoupled from `styleFamilies`
 * so it does not force the four-family assumption baked into the home grid, the
 * Studio and `SurfacePreview`. A later round spreads this into `styleFamilies`
 * and teaches those surfaces to draw it.
 */
export const pilotStyleFamily: StyleFamily<"liquid-glass"> = {
  slug: "liquid-glass",
  number: "05",
  name: "Liquid Glass",
  description:
    "Refractive glass that bends the backdrop through an SVG displacement filter, with chromatic edges and a specular rim; falls back to a frosted blur where the filter is unsupported.",
  descriptionEs:
    "Vidrio refractivo que curva el fondo con un filtro de desplazamiento SVG, con bordes cromáticos y un filo especular; cae a un desenfoque esmerilado donde el filtro no está soportado.",
};

export const componentLibrary: Array<{
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  style: StyleSlug;
  specimen: "button" | "card" | "toggle" | "player" | "dial" | "nav";
  tags: string[];
}> = [
  {
    slug: "soft-launch-button",
    name: "Soft launch button",
    nameEs: "Botón de lanzamiento suave",
    description: "A pressure-aware clay CTA with a readable pressed state.",
    descriptionEs: "Un CTA de arcilla con presión visual y un estado pulsado claramente legible.",
    style: "clay",
    specimen: "button",
    tags: ["Action", "Motion"],
  },
  {
    slug: "prism-account-card",
    name: "Prism account card",
    nameEs: "Tarjeta prisma de cuenta",
    description: "A glass surface that keeps contrast stable over saturated backgrounds.",
    descriptionEs: "Una superficie de vidrio que mantiene contraste estable sobre fondos saturados.",
    style: "glass",
    specimen: "card",
    tags: ["Card", "Data"],
  },
  {
    slug: "studio-control-dial",
    name: "Studio control dial",
    nameEs: "Dial de control de estudio",
    description: "A keyboard-friendly rotary control with physical affordance.",
    descriptionEs: "Un control giratorio accesible por teclado con una señal física clara.",
    style: "skeuo",
    specimen: "dial",
    tags: ["Input", "Control"],
  },
  {
    slug: "context-switch",
    name: "Context switch",
    nameEs: "Interruptor contextual",
    description: "Changes density and label strategy at container breakpoints.",
    descriptionEs: "Cambia densidad y estrategia de etiquetas según el tamaño de su contenedor.",
    style: "adaptive",
    specimen: "toggle",
    tags: ["Adaptive", "Input"],
  },
  {
    slug: "frosted-player",
    name: "Frosted player",
    nameEs: "Reproductor esmerilado",
    description: "A compact media surface with clear hierarchy and tactile controls.",
    descriptionEs: "Una superficie multimedia compacta con jerarquía clara y controles táctiles.",
    style: "glass",
    specimen: "player",
    tags: ["Media", "Card"],
  },
  {
    slug: "molded-navigation",
    name: "Molded navigation",
    nameEs: "Navegación moldeada",
    description: "A chunky mobile navigation bar with thumb-friendly targets.",
    descriptionEs: "Una barra de navegación móvil robusta con objetivos cómodos para el pulgar.",
    style: "clay",
    specimen: "nav",
    tags: ["Navigation", "Mobile"],
  },
];
