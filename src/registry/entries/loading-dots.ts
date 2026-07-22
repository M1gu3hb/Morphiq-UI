import { LoadingDotsPreview } from "@/registry/previews/loading-dots-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the loading-dots component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "loading-dots",
  name: "Loading Dots",
  nameEs: "Puntos de carga",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "Three staggered dots that read as a beat of typing or thinking, in a bounce or a pulse and three sizes. Material-agnostic — a single adaptive palette follows the colour scheme — and announced through real text so it never depends on the animation to carry meaning.",
  descriptionEs:
    "Tres puntos escalonados que se leen como un compás de escritura o de pensamiento, en rebote o pulso y en tres tamaños. Es agnóstico de material — una única paleta adaptable sigue el esquema de color — y se anuncia con texto real, así que nunca depende de la animación para transmitir su significado.",
  variants: [
    { id: "bounce", label: "Bounce", labelEs: "Rebote" },
    { id: "pulse", label: "Pulse", labelEs: "Pulso" },
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
    "The dots are decorative and carry aria-hidden; the wrapper is the role=\"status\" live region, and it always contains real text — either the visible label or a visually hidden fallback that defaults to \"Loading\". That distinction is the whole point: a live region is announced by its contents, not by its name, so a role=\"status\" whose only child is aria-hidden and whose meaning sits in aria-label passes a static audit — the name is right there in the accessibility tree — and then says nothing at all when it mounts. The hidden text uses the clip-rect sr-only technique rather than display:none or visibility:hidden, either of which would remove it from the accessibility tree and reintroduce that silence. No redundant aria-live is set, since role=\"status\" already implies polite and atomic, which is the right urgency for a transient asynchronous wait rather than the assertive alert role reserved for errors. Meaning never depends on colour or on the motion: it is carried by text, so the indicator is fully understood by a screen reader and by anyone who cannot perceive the animation. Under prefers-reduced-motion the bounce and the pulse both stop outright and three still dots remain at full size and full opacity — the resting frame of each keyframe is the dot's own default, so freezing the loop leaves the indicator present and legible rather than a slower blink. The keyframes ship inside the component through React's deduplicated style hoisting, so copying the file is the whole install, and they animate the standalone translate, scale and opacity properties rather than transform, so a caller's own transform never fights the animation for the same property. In forced-colors mode author fills are discarded, which would leave three invisible holes, so each dot is painted in CanvasText and the label in CanvasText to stay a solid, legible mark. Contrast: WCAG 1.4.11 applies because the dots are an informative graphic, not decoration, and the ink dot measures well above the 3:1 floor against the page in both schemes — roughly 15:1 in light and 13:1 in dark at rest.",
  a11yEs:
    "Los puntos son decorativos y llevan aria-hidden; el contenedor es la región viva con role=\"status\", y siempre contiene texto real — la etiqueta visible o un sustituto oculto visualmente que por defecto dice \"Loading\". Esa distinción es lo esencial: una región viva se anuncia por su contenido y no por su nombre, así que un role=\"status\" cuyo único hijo lleva aria-hidden y cuyo significado vive en aria-label pasa una auditoría estática — el nombre está ahí, en el árbol de accesibilidad — y luego no dice nada al montarse. El texto oculto usa la técnica sr-only de recorte y no display:none ni visibility:hidden, cualquiera de los cuales lo sacaría del árbol de accesibilidad y reintroduciría ese silencio. No se declara un aria-live redundante, porque role=\"status\" ya implica polite y atomic, que es la urgencia correcta para una espera asíncrona transitoria en lugar del rol assertive de alerta reservado a los errores. El significado nunca depende del color ni del movimiento: lo lleva el texto, así que el indicador se entiende por completo con un lector de pantalla y para quien no pueda percibir la animación. Bajo prefers-reduced-motion tanto el rebote como el pulso se detienen del todo y quedan tres puntos quietos a tamaño y opacidad plenos — el fotograma de reposo de cada keyframe es el valor por defecto del punto, de modo que congelar el bucle deja el indicador presente y legible en vez de un parpadeo más lento. Los keyframes viajan dentro del componente mediante el izado deduplicado de estilos de React, así que copiar el archivo es toda la instalación, y animan las propiedades independientes translate, scale y opacity en vez de transform, de modo que un transform propio de quien lo use nunca pelea con la animación por la misma propiedad. En forced-colors se descartan los rellenos de autor, lo que dejaría tres huecos invisibles, así que cada punto se pinta con CanvasText y la etiqueta con CanvasText para seguir siendo una marca sólida y legible. Contraste: la 1.4.11 de WCAG aplica porque los puntos son un gráfico informativo y no decoración, y el punto tinta mide muy por encima del suelo de 3:1 contra la página en ambos esquemas — alrededor de 15:1 en claro y 13:1 en oscuro en reposo.",
  sourcePath: "src/registry/ui/loading-dots.tsx",
  Preview: LoadingDotsPreview,
};
