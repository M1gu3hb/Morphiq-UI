import { SkeletonPreview } from "@/registry/previews/skeleton-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the skeleton component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "skeleton",
  name: "Skeleton",
  nameEs: "Esqueleto",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A loading placeholder in four material recipes, three shapes and three sizes. Its shimmer keyframes travel inside the component rather than in a global stylesheet, so copying the file is the whole install, and reduced motion leaves a calm static block instead of a pulse.",
  descriptionEs:
    "Un marcador de carga en cuatro recetas de material, tres formas y tres tamaños. Sus keyframes de brillo viajan dentro del componente en vez de en una hoja de estilos global, así que copiar el archivo es toda la instalación, y con movimiento reducido queda un bloque estático y tranquilo en lugar de un parpadeo.",
  variants: [
    { id: "line", label: "Line", labelEs: "Línea" },
    { id: "circle", label: "Circle", labelEs: "Círculo" },
    { id: "rect", label: "Block", labelEs: "Bloque" },
  ],
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
    "A skeleton stands for content that is not there yet, so it announces nothing: each placeholder carries aria-hidden and the region around it is what speaks. Wrap the loading area in aria-busy with aria-live=\"polite\", or role=\"status\" when the wait is worth interrupting for, and give that region a name — the preview does exactly this, with a visually hidden label, because once the bars are silenced that name is the only thing a screen reader has to read. Marking each bar instead would announce \"loading\" once per bar, which is noise rather than information. Under prefers-reduced-motion the animation stops and the gradient is dropped, leaving a flat, still block: a placeholder that keeps pulsing is precisely what someone with a motion sensitivity asked not to see, so the reduced state is static rather than a slower blink. In forced-colors mode backgrounds are discarded, which would leave the placeholder occupying space while showing nothing, so it falls back to a GrayText outline that keeps the shape legible. Contrast: a decorative placeholder is exempt from WCAG 1.4.11, and these fills are deliberately quiet, but a skeleton nobody can see is just a blank page — so each material is held to a self-imposed floor of 1.35:1 against the surface it sits on. Measured worst case per material: clay 1.38:1 and skeuo 1.41:1 against the Morphiq paper background, adaptive 1.37:1 on paper in light and 1.38:1 against the ink surface in dark. Glass is the awkward one, because a translucent fill takes its lightness from whatever is behind it and no single tint survives both a white and a black backdrop; it carries a dark wash that measures 1.36:1 over paper and 1.37:1 over white, plus a bright edge that measures 4.63:1 over black, where the wash alone would manage only 1.04:1.",
  a11yEs:
    "Un esqueleto representa contenido que todavía no está, así que no anuncia nada: cada marcador lleva aria-hidden y quien habla es la región que lo rodea. Envuelve el área de carga en aria-busy con aria-live=\"polite\", o role=\"status\" cuando la espera merece interrumpir, y dale un nombre a esa región — la vista previa hace justamente eso, con una etiqueta oculta visualmente, porque una vez silenciadas las barras ese nombre es lo único que un lector de pantalla tiene para leer. Marcar cada barra en su lugar anunciaría \"cargando\" una vez por barra, que es ruido y no información. Bajo prefers-reduced-motion la animación se detiene y se descarta el degradado, dejando un bloque plano y quieto: un marcador que sigue latiendo es exactamente lo que alguien con sensibilidad al movimiento pidió no ver, así que el estado reducido es estático y no un parpadeo más lento. En forced-colors se descartan los fondos, lo que dejaría al marcador ocupando espacio sin mostrar nada, así que recurre a un contorno GrayText que mantiene legible la forma. Contraste: un marcador decorativo está exento de la 1.4.11 de WCAG, y estos rellenos son deliberadamente discretos, pero un esqueleto que nadie puede ver no es más que una página en blanco — así que cada material se somete a un suelo propio de 1,35:1 contra la superficie sobre la que se apoya. Peor caso medido por material: clay 1,38:1 y skeuo 1,41:1 sobre el fondo papel de Morphiq, adaptive 1,37:1 sobre papel en claro y 1,38:1 contra la superficie tinta en oscuro. El vidrio es el incómodo, porque un relleno translúcido toma su luminosidad de lo que tiene detrás y ningún tinte único sobrevive a un fondo blanco y a uno negro a la vez; lleva un lavado oscuro que mide 1,36:1 sobre papel y 1,37:1 sobre blanco, más un borde luminoso que mide 4,63:1 sobre negro, donde el lavado por sí solo apenas llegaría a 1,04:1.",
  sourcePath: "src/registry/ui/skeleton.tsx",
  Preview: SkeletonPreview,
};
