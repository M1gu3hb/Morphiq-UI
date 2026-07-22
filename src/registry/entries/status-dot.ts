import { StatusDotPreview } from "@/registry/previews/status-dot-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Status Dot component. */
export const entry: RegistryEntry = {
  slug: "status-dot",
  name: "Status Dot",
  nameEs: "Punto de estado",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "A presence indicator for online, away, busy and offline that carries each status through a colour, a distinct shape and a real text label — never colour alone — with an optional decorative pulse and three sizes.",
  descriptionEs:
    "Un indicador de presencia para en línea, ausente, ocupado y desconectado que transmite cada estado con un color, una forma distinta y una etiqueta de texto real —nunca solo con color—, con un pulso decorativo opcional y tres tamaños.",
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
    "The wrapper is a role=\"status\" live region, which implies aria-live=\"polite\" and aria-atomic, so a presence that changes in place is announced politely — never assertively, because presence is never urgent. Crucially the region is announced by its contents, a real text label, not by a name: an aria-label on a status region passes a static audit yet stays silent when it updates, which is the exact failure this avoids. Status is never carried by colour alone. Each of the four presences pairs its colour with a distinct shape — online a filled disc, away a half-moon, busy a disc with a horizontal slot, offline a hollow ring — and with the status word as text, so the meaning survives for colour-blind users, in greyscale, and in forced-colors mode. The glyph is decorative and carries aria-hidden; the label carries the meaning, and labelHidden keeps it as a visually hidden but announced sr-only text node using the clip-rect technique rather than display:none or visibility:hidden, either of which would remove it from the accessibility tree. The label colour holds at least 4.5:1 against a light and a dark surface, and each dot colour holds at least 3:1 as a non-text graphic under WCAG 1.4.11 in both colour schemes. The optional pulse is pure decoration on the already-hidden glyph and animates the standalone scale and opacity properties, so it never fights a caller's transform; under prefers-reduced-motion it stops outright — its resting opacity is zero, so nothing is left frozen over the dot — and the dot is simply present, its meaning unchanged because that lives in the shape and the label. In forced-colors mode the glyph repaints as CanvasText and the carved negative space of the busy slot and offline ring keeps each shape distinct, while the decorative pulse fill is dropped. No time-dependent or random value is read in render, so there is nothing to hydrate.",
  a11yEs:
    "El contenedor es una región viva con role=\"status\", que implica aria-live=\"polite\" y aria-atomic, de modo que una presencia que cambia en su sitio se anuncia con cortesía —nunca de forma assertive, porque la presencia nunca es urgente—. Y lo esencial: la región se anuncia por su contenido, una etiqueta de texto real, no por un nombre: un aria-label en una región de estado pasa una auditoría estática y aun así calla al actualizarse, que es justo el fallo que aquí se evita. El estado nunca depende solo del color. Cada una de las cuatro presencias acompaña su color con una forma distinta —en línea un disco lleno, ausente una media luna, ocupado un disco con una ranura horizontal, desconectado un aro hueco— y con la palabra del estado como texto, así el significado sobrevive para personas con daltonismo, en escala de grises y en modo de colores forzados. El glifo es decorativo y lleva aria-hidden; la etiqueta porta el significado, y labelHidden la mantiene como un nodo de texto sr-only oculto pero anunciado con la técnica de recorte, no con display:none ni visibility:hidden, que lo quitarían del árbol de accesibilidad. El color de la etiqueta mantiene al menos 4,5:1 sobre una superficie clara y una oscura, y cada color de punto mantiene al menos 3:1 como gráfico no textual según la WCAG 1.4.11 en ambos esquemas de color. El pulso opcional es pura decoración sobre el glifo ya oculto y anima las propiedades independientes scale y opacity, por lo que nunca pelea con un transform de quien lo use; bajo prefers-reduced-motion se detiene del todo —su opacidad en reposo es cero, así que no queda nada congelado sobre el punto— y el punto simplemente está presente, con su significado intacto porque vive en la forma y la etiqueta. En modo de colores forzados el glifo se repinta como CanvasText y el espacio negativo tallado de la ranura de ocupado y del aro de desconectado mantiene cada forma distinta, mientras se descarta el relleno decorativo del pulso. En el render no se lee ningún valor dependiente del tiempo ni aleatorio, así que no hay nada que hidratar.",
  sourcePath: "src/registry/ui/status-dot.tsx",
  Preview: StatusDotPreview,
};
