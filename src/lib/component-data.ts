export type StyleSlug = "clay" | "glass" | "skeuo" | "adaptive";

export const styleFamilies: Array<{
  slug: StyleSlug;
  number: string;
  name: string;
  description: string;
  descriptionEs: string;
}> = [
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
