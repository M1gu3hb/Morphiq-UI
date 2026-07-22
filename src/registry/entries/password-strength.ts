import { PasswordStrengthPreview } from "@/registry/previews/password-strength-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the password-strength component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "password-strength",
  name: "Password Strength",
  nameEs: "Fortaleza de contraseña",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A password field with an in-field show/hide toggle and a live strength meter — a segmented bar plus a written level (Weak / Fair / Good / Strong). The score is derived deterministically from length and character variety, and the level is carried by text, never by colour alone. Four material recipes, two treatments and three sizes.",
  descriptionEs:
    "Un campo de contraseña con un botón mostrar/ocultar dentro del campo y un medidor de fortaleza en vivo — una barra segmentada más un nivel escrito (Débil / Aceptable / Buena / Fuerte). La puntuación se deriva de forma determinista de la longitud y la variedad de caracteres, y el nivel lo transmite el texto, nunca el color por sí solo. Cuatro recetas de material, dos tratamientos y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "filled", label: "Filled", labelEs: "Relleno" },
  ],
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
    "Built on a native <input>, so typing, selection, autofill, form submission and the mobile keyboard are the browser's rather than a reimplementation. The show/hide control is a real <button type=button> with aria-pressed reflecting visibility and a clear aria-label that swaps between Show password and Hide password; toggling only flips the same input's type between password and text, so the typed value is never lost. The component holds its own value for scoring but stays uncontrolled by default (defaultValue) and controllable through value + onChange. The strength score is computed deterministically from length and character variety — no randomness, so server and client render identically. The meter is exposed as role=meter with aria-valuemin=0, aria-valuemax=4, aria-valuenow set to the score and aria-valuetext set to the level word, and the same word is echoed into an aria-live=polite region so the level is announced as the user types; the level is therefore carried by text and never by segment colour alone, which only supplements it. aria-invalid is the single source of truth for the error look, so what is shown and what assistive tech is told cannot drift apart, and aria-describedby is composed rather than overwritten so it links the strength text, the helper or error message and any caller description together. Both the strength region and the message region are always mounted, even when empty, because an aria-live region has to exist before its text arrives for the announcement to be reliable. Focus draws a 2px offset :focus-visible outline that is never removed, plus a material-specific inset well. Contrast: typed text and placeholder both measure at or above 4.5:1 against the control's own surface on every material (clay, glass, skeuo, adaptive light and adaptive dark) — these are the Input recipe's own measured values — and the written level label uses the darkest ink token so it clears 4.5:1 without leaning on the bar's hue, as does the show/hide glyph. prefers-reduced-motion removes the bar-fill travel and the focus interpolation but preserves the final fill, level and focus state. forced-colors removes the tactile shadows, material gradient and backdrop filter: a system-coloured border and outline keep the field bounds, focus and invalid state perceivable, each meter segment keeps a CanvasText border, a filled segment is marked with the system Highlight, and the glyph is drawn in CanvasText.",
  a11yEs:
    "Construido sobre un <input> nativo, así que la escritura, la selección, el autocompletado, el envío del formulario y el teclado móvil son los del navegador y no una reimplementación. El control mostrar/ocultar es un <button type=button> real con aria-pressed que refleja la visibilidad y un aria-label claro que alterna entre Mostrar contraseña y Ocultar contraseña; alternar solo cambia el type del mismo input entre password y text, así que el valor escrito nunca se pierde. El componente guarda su propio valor para puntuar, pero por defecto no es controlado (defaultValue) y es controlable con value + onChange. La puntuación de fortaleza se calcula de forma determinista a partir de la longitud y la variedad de caracteres — sin aleatoriedad, de modo que el servidor y el cliente renderizan igual. El medidor se expone con role=meter con aria-valuemin=0, aria-valuemax=4, aria-valuenow igual a la puntuación y aria-valuetext igual a la palabra del nivel, y esa misma palabra se repite en una región aria-live=polite para que el nivel se anuncie mientras se escribe; el nivel lo transmite entonces el texto y nunca el color de los segmentos por sí solo, que únicamente lo complementa. aria-invalid es la única fuente de verdad del estado de error, así que lo que se ve y lo que se le dice a la tecnología de asistencia no pueden desincronizarse, y aria-describedby se compone en vez de sobrescribirse, de modo que enlaza el texto de fortaleza, el mensaje de ayuda o de error y cualquier descripción de quien lo usa. Tanto la región de fortaleza como la del mensaje están siempre montadas, incluso vacías, porque una región aria-live tiene que existir antes de que llegue su texto para que el anuncio sea fiable. El foco dibuja un contorno :focus-visible de 2px desplazado que nunca se elimina, más un pozo interior propio del material. Contraste: tanto el texto escrito como el placeholder miden 4,5:1 o más contra la superficie del propio control en cada material (clay, glass, skeuo, adaptive claro y adaptive oscuro) — son los valores medidos de la propia receta Input — y la etiqueta escrita del nivel usa el token de tinta más oscura para superar 4,5:1 sin apoyarse en el tono de la barra, igual que el glifo mostrar/ocultar. prefers-reduced-motion elimina el recorrido de llenado de la barra y la interpolación del foco pero conserva el llenado, el nivel y el estado de foco finales. forced-colors quita las sombras táctiles, el gradiente del material y el filtro de fondo: un borde y contorno de sistema mantienen perceptibles los límites, el foco y el estado inválido, cada segmento del medidor conserva un borde CanvasText, un segmento lleno se marca con el Highlight del sistema y el glifo se dibuja en CanvasText.",
  sourcePath: "src/registry/ui/password-strength.tsx",
  Preview: PasswordStrengthPreview,
};
