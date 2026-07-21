import { RadioPreview } from "@/registry/previews/radio-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the radio component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "radio",
  name: "Radio Group",
  nameEs: "Grupo de opciones",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A group of mutually exclusive options with four material recipes, two treatments and three sizes. Native radios sharing a name do the work, so arrow-key navigation, the single tab stop and the exclusivity itself all come from the browser.",
  descriptionEs:
    "Un grupo de opciones mutuamente excluyentes con cuatro recetas de material, dos tratamientos y tres tamaños. Radios nativos que comparten un name hacen el trabajo, así que la navegación con flechas, el tab stop único y la propia exclusividad vienen del navegador.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "card", label: "Card", labelEs: "Tarjeta" },
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
    "Real <input type=\"radio\"> elements sharing a name do the work. That one attribute is what gives arrow-key navigation within the group, a single tab stop for the whole group, and mutual exclusivity — none of it is reimplemented, so none of it can be reimplemented wrongly. Each option is wrapped in a real <label>, which associates the text without matching ids and makes the whole row a hit target. The group is a role=\"radiogroup\" labelled through aria-labelledby; a plain element carries the role rather than a fieldset because a fieldset's default border and legend placement have to be undone before it can be styled, and the grouping is announced the same either way. aria-invalid sits on the group, where the error belongs, and the control reads it through a descendant selector rather than duplicating it per option, so what is drawn and what assistive tech is told cannot drift apart. Options can be disabled individually or all at once from the group. The selection dot is aria-hidden: the native input already exposes checked, and announcing it twice would fight the control's own name. Motion is suppressed under prefers-reduced-motion. In forced-colors mode the fill is discarded, so the state is carried by the dot itself — drawn in a system colour and shown by opacity, which that mode does not override — with a system-coloured border keeping the control perceivable. Contrast: an unselected radio is identified only by its border, so that border is held to the 3:1 WCAG 1.4.11 asks of a control boundary, against both its own surface and the Morphiq paper background — the tightest is clay at 3.68:1 against the control and 3.80:1 against the page. The selection dot measures 5.03:1 at its lowest against the filled control — glass, where its wash lightens the fill — and 16.32:1 at its highest, well past the same 3:1 bar. Every figure was re-measured after the redesign changed the surfaces, and the tightest ones improved rather than eroded: clay's border was raised from 0.70 to 0.78 alpha precisely to pay for a warmer, darker control, taking the component's closest reading from 3.09:1 to 3.80:1. Where a material paints a gradient the measurement is taken at its worst point rather than an average — the dark end for the unselected skeuo socket, the lit end for the dot sitting on it. Motion: the dot springs in on scale and opacity from a fifth of its size, on a curve that carries it a touch past full before settling, while the ring answers with a change of depth; the ring also swells under the pointer and squashes when pressed. The two are treated differently under prefers-reduced-motion because they mean different things — the dot is what says selected, so it keeps its end state and loses only the travel, while the press is pure feedback nobody has to read and is cancelled outright. The error message measures 6.42:1 or better on those surfaces, and the label inherits the host's colour rather than pinning one, since it sits on the page's surface and not on ours.",
  a11yEs:
    "El trabajo lo hacen elementos <input type=\"radio\"> reales que comparten un name. Ese único atributo es lo que da la navegación con flechas dentro del grupo, un tab stop único para todo el grupo y la exclusividad mutua — nada de eso está reimplementado, así que nada de eso puede reimplementarse mal. Cada opción va envuelta en un <label> real, que asocia el texto sin necesidad de ids coincidentes y convierte toda la fila en área de pulsación. El grupo es un role=\"radiogroup\" etiquetado mediante aria-labelledby; el rol lo lleva un elemento simple y no un fieldset porque el borde por defecto y la colocación del legend de un fieldset hay que deshacerlos antes de poder estilizarlo, y la agrupación se anuncia igual de las dos formas. aria-invalid va en el grupo, que es donde pertenece el error, y el control lo lee con un selector de descendiente en vez de duplicarlo en cada opción, de modo que lo que se dibuja y lo que se le dice a la tecnología de asistencia no pueden divergir. Las opciones se pueden deshabilitar una a una o todas a la vez desde el grupo. El punto de selección lleva aria-hidden: el input nativo ya expone el estado marcado, y anunciarlo dos veces competiría con el nombre del propio control. El movimiento se suprime bajo prefers-reduced-motion. En forced-colors se descarta el relleno, así que el estado lo transmite el propio punto — dibujado con un color de sistema y mostrado por opacidad, que ese modo no anula — con un borde de color de sistema que mantiene perceptible el control. Contraste: un radio sin seleccionar se identifica solo por su borde, así que a ese borde se le exige el 3:1 que WCAG 1.4.11 pide al límite de un control, tanto contra su propia superficie como contra el fondo papel de Morphiq — el más ajustado es clay con 3,68:1 contra el control y 3,80:1 contra la página. El punto de selección mide 5,03:1 en su caso más bajo sobre el control relleno — el vidrio, donde su velo aclara el relleno — y 16,32:1 en el más alto, holgadamente por encima de ese mismo 3:1. Todas las cifras se volvieron a medir después de que el rediseño cambiara las superficies, y las más ajustadas mejoraron en vez de erosionarse: el borde de clay se subió de 0,70 a 0,78 de alfa justamente para pagar un control más cálido y oscuro, llevando la lectura más cercana del componente de 3,09:1 a 3,80:1. Donde un material pinta un degradado, la medición se toma en su peor punto y no en un promedio: el extremo oscuro para el casquillo de skeuo sin seleccionar, y el extremo iluminado para el punto que se apoya en él. Movimiento: el punto entra con resorte en escala y opacidad desde un quinto de su tamaño, con una curva que lo lleva un poco más allá del tamaño final antes de asentarse, mientras el anillo responde con un cambio de profundidad; el anillo además se hincha bajo el puntero y se aplasta al pulsar. Los dos se tratan distinto bajo prefers-reduced-motion porque significan cosas distintas: el punto es lo que dice seleccionado, así que conserva su estado final y solo pierde el recorrido, mientras que la pulsación es puro feedback que nadie necesita leer y se cancela del todo. El mensaje de error mide 6,42:1 o más sobre esas superficies, y la etiqueta hereda el color del anfitrión en vez de fijar uno, porque va sobre la superficie de la página y no sobre la nuestra.",
  sourcePath: "src/registry/ui/radio.tsx",
  Preview: RadioPreview,
};
