import { FloatingNavPreview } from "@/registry/previews/floating-nav-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the floating-nav component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 */
export const entry: RegistryEntry = {
  slug: "floating-nav",
  name: "Floating Nav",
  nameEs: "Navegación flotante",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A rounded, elevated navigation bar that hides on scroll-down and returns on scroll-up. Four material recipes and three sizes; it watches the window by default, or any scrollable pane through a ref. Hiding is a compositor-only slide plus fade, and reduced motion keeps the bar in place.",
  descriptionEs:
    "Una barra de navegación redondeada y elevada que se oculta al bajar y reaparece al subir. Cuatro recetas de material y tres tamaños; observa la ventana por defecto, o cualquier panel desplazable mediante una ref. El ocultamiento es un deslizamiento y desvanecimiento solo de composición, y el movimiento reducido mantiene la barra en su sitio.",
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
    "The bar is a <nav> landmark with an aria-label, so it is announced and reachable as named navigation. Each item is a real <a href> or <button>, in the tab order and operable with Enter (and Space for the buttons), and the active item carries aria-current=\"page\". Active state is never signalled by colour alone: it pairs the chip fill with a heavier font weight and the aria-current flag. Focus shows a 2px offset ring on :focus-visible and is never removed; the ring uses the material's ink colour and switches to the Highlight system colour in forced-colors mode. In forced-colors the chip fill, finish and shadow are discarded, so the active item is marked instead with a system colour on a bottom border that is reserved transparent in the box model of every item — the indication never depends on a background that mode throws away, and the bar keeps its outline through its border. The hide-on-scroll motion is decoration: under prefers-reduced-motion the scroll effect is skipped entirely and the bar stays visible in its resting state, while the transition is also disabled, so a reduced-motion reader always has the full navigation on screen. The content is only translated, never unmounted, so it is always present in the DOM and the accessibility tree. Contrast: idle and active labels both measure at or above 4.5:1 on every material — the lowest idle label is glass at 5.1:1 over its worst-case tint, and the lowest active label is clay at 6.4:1 on its chip.",
  a11yEs:
    "La barra es una región <nav> con aria-label, así que se anuncia y se alcanza como navegación con nombre. Cada elemento es un <a href> o un <button> real, dentro del orden de tabulación y operable con Enter (y Espacio para los botones), y el elemento activo lleva aria-current=\"page\". El estado activo nunca se transmite solo con color: acompaña el relleno del chip con un peso de fuente mayor y la marca aria-current. El foco muestra un anillo de 2px con desplazamiento en :focus-visible y nunca se elimina; el anillo usa el color de tinta del material y cambia al color de sistema Highlight en forced-colors. En forced-colors se descartan el relleno, el acabado y la sombra del chip, así que el elemento activo se marca con un color de sistema sobre un borde inferior reservado transparente en el modelo de caja de cada elemento — la indicación nunca depende de un fondo que ese modo descarta, y la barra conserva su contorno mediante su borde. El movimiento de ocultarse al desplazar es decorativo: bajo prefers-reduced-motion el efecto de scroll se omite por completo y la barra permanece visible en su estado de reposo, y la transición también se desactiva, así que quien usa movimiento reducido siempre tiene la navegación completa en pantalla. El contenido solo se traslada, nunca se desmonta, por lo que siempre está presente en el DOM y en el árbol de accesibilidad. Contraste: las etiquetas inactiva y activa miden 4,5:1 o más en cada material — la etiqueta inactiva más baja es la de vidrio con 5,1:1 sobre su peor tinte, y la activa más baja es la de clay con 6,4:1 en su chip.",
  sourcePath: "src/registry/ui/floating-nav.tsx",
  Preview: FloatingNavPreview,
};
