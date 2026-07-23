import { SubscribeButtonPreview } from "@/registry/previews/subscribe-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the subscribe-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "subscribe-button",
  name: "Subscribe Button",
  nameEs: "Botón de suscripción",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A single native button that toggles between Subscribe and Subscribed with a confirmation, across four material recipes and three sizes; uncontrolled by default and fully controllable, with the surface settling from a call-to-action into a calmer material.",
  descriptionEs:
    "Un único botón nativo que alterna entre Suscribirse y Suscrito con una confirmación, en cuatro recetas de material y tres tamaños; no controlado por defecto y totalmente controlable, con la superficie que se asienta de una llamada a la acción a un material más calmado.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "A single real native <button> whose aria-pressed reflects the subscribed state. The state is never colour alone: the visible label changes (\"Subscribe\" -> \"Subscribed\"), the leading glyph swaps from Bell to BellRing, and a trailing Check confirmation appears — text, icon and ARIA all carry it together. An aria-live=\"polite\", aria-atomic region is present in the DOM before any text arrives and announces \"Subscribed\" / \"Unsubscribed\" the moment the value flips; it is kept out of the button so it never pollutes the button's accessible name. Because it is a real button, Enter and Space toggle it natively. It is uncontrolled by default and fully controllable via subscribed + onSubscribedChange. Focus is shown with a 2px offset ring on :focus-visible (and a parallel data-focus=\"true\" hook the docs surface can force) and is never removed with outline-none. Under prefers-reduced-motion the settle pop on the BellRing and Check is dropped and the hover lift and press travel are cancelled, but the label and icon still change, the surface still settles to its end state, and the pressed inset well still applies instantly on :active so the tactile feedback is preserved. In forced-colors the surface keeps its bounds with a CanvasText border, the focus ring becomes Highlight, informative glyphs use CanvasText, and the glass backdrop filter and skeuo gradient image are cleared so nothing sits over the system surface. Contrast: the call-to-action state inherits Button's measured primary tokens and the settled state its secondary tokens, so the label stays >= 4.5:1 on every material and in both states.",
  a11yEs:
    "Un único <button> nativo real cuyo aria-pressed refleja el estado suscrito. El estado nunca es solo color: la etiqueta visible cambia (\"Subscribe\" -> \"Subscribed\"), el glifo inicial pasa de Bell a BellRing y aparece un Check de confirmación al final — texto, icono y ARIA lo transmiten juntos. Una región aria-live=\"polite\" y aria-atomic está presente en el DOM antes de que llegue el texto y anuncia \"Subscribed\" / \"Unsubscribed\" en cuanto el valor cambia; se mantiene fuera del botón para no contaminar su nombre accesible. Al ser un botón real, Enter y Espacio lo alternan de forma nativa. No es controlado por defecto y es totalmente controlable mediante subscribed + onSubscribedChange. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (y un gancho paralelo data-focus=\"true\" que la documentación puede forzar) y nunca se elimina con outline-none. Bajo prefers-reduced-motion se descarta el rebote de asentamiento del BellRing y el Check y se cancelan la elevación al pasar y el recorrido de pulsación, pero la etiqueta y el icono siguen cambiando, la superficie sigue asentándose a su estado final y el hundimiento interior del estado pulsado se aplica al instante en :active, conservando la respuesta táctil. En forced-colors la superficie mantiene sus límites con un borde CanvasText, el anillo de foco pasa a Highlight, los glifos informativos usan CanvasText y se limpian el filtro de fondo del vidrio y la imagen de degradado del skeuo para que nada quede sobre la superficie del sistema. Contraste: el estado de llamada a la acción hereda los tokens primarios medidos del Button y el estado asentado sus tokens secundarios, de modo que la etiqueta se mantiene >= 4,5:1 en cada material y en ambos estados.",
  sourcePath: "src/registry/ui/subscribe-button.tsx",
  Preview: SubscribeButtonPreview,
};
