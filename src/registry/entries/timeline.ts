import { TimelinePreview } from "@/registry/previews/timeline-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Timeline component. */
export const entry: RegistryEntry = {
  slug: "timeline",
  name: "Timeline",
  nameEs: "Línea de tiempo",
  category: "data",
  materials: ["adaptive"],
  description:
    "A semantic vertical timeline built from a real ordered list, with machine-readable timestamps, done/current/upcoming statuses shown by shape and text, three sizes, and a single adaptive light-and-dark style.",
  descriptionEs:
    "Una línea de tiempo vertical y semántica construida a partir de una lista ordenada real, con marcas de tiempo legibles por máquina, estados completado/actual/próximo mostrados por forma y texto, tres tamaños y un único estilo adaptable claro y oscuro.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "Timeline renders a native ol with one li per event, so order is conveyed structurally rather than visually. Each event stamps a real <time> element with a machine-readable dateTime, a title and an optional body. Status is never carried by colour alone: every event pairs a marker shape (a checked disc for done, an accented ringed disc with an inner dot for current, a dashed outline for upcoming) with a text tag whose words are localizable through statusLabels. The markers and the connecting lines are aria-hidden decoration; a visually hidden summary preceding the list states the total event count and how many are done, in progress and upcoming, so assistive tech gets the aggregate as authoritative data. There are no interactive controls, so no keyboard handling is required beyond the browser default. A subtle staggered entrance is expressed with @starting-style over opacity and translate; the resting state is the final value, so SSR, no-JS and prefers-reduced-motion all show the finished timeline, and motion-reduce cancels the travel. In forced-colors mode the surface, markers and connectors map to Canvas, Highlight, GrayText and CanvasText so bounds and statuses survive. All title, timestamp and description text exceeds 4.5:1 against the adaptive surface in both light and dark, and every marker and connector exceeds 3:1.",
  a11yEs:
    "Timeline renderiza un ol nativo con un li por evento, de modo que el orden se transmite estructuralmente y no solo de forma visual. Cada evento incluye un elemento <time> real con un dateTime legible por máquina, un título y un cuerpo opcional. El estado nunca se transmite solo por color: cada evento combina una forma de marcador (un disco con check para completado, un disco con anillo acentuado y punto interior para actual, y un contorno discontinuo para próximo) con una etiqueta de texto cuyas palabras se pueden localizar mediante statusLabels. Los marcadores y las líneas conectoras son decoración con aria-hidden; un resumen visualmente oculto que precede a la lista indica el total de eventos y cuántos están completados, en progreso y próximos, para que la tecnología de asistencia reciba el agregado como dato autoritativo. No hay controles interactivos, así que no se requiere manejo de teclado más allá del comportamiento predeterminado del navegador. Una entrada escalonada sutil se expresa con @starting-style sobre opacity y translate; el estado en reposo es el valor final, por lo que SSR, sin JS y prefers-reduced-motion muestran la línea de tiempo terminada, y motion-reduce cancela el desplazamiento. En modo forced-colors la superficie, los marcadores y los conectores se asignan a Canvas, Highlight, GrayText y CanvasText para que los límites y los estados se mantengan. Todo el texto de título, marca de tiempo y descripción supera 4,5:1 contra la superficie adaptable en claro y oscuro, y cada marcador y conector supera 3:1.",
  sourcePath: "src/registry/ui/timeline.tsx",
  Preview: TimelinePreview,
};
