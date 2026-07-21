import { SelectPreview } from "@/registry/previews/select-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the select component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "select",
  name: "Select",
  nameEs: "Selector",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A dropdown built on a native select, with four material recipes, three treatments and three sizes. Only the closed control is styled — the open list is left to the operating system, which is what keeps type-ahead, autofill and the mobile picker working.",
  descriptionEs:
    "Un desplegable construido sobre un select nativo, con cuatro recetas de material, tres tratamientos y tres tamaños. Solo se estiliza el control cerrado — la lista abierta la dibuja el sistema operativo, que es lo que mantiene funcionando la escritura predictiva, el autocompletado y el selector móvil.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "filled", label: "Filled", labelEs: "Relleno" },
    { id: "underline", label: "Underline", labelEs: "Subrayado" },
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
    "Renders a native <select>, so keyboard opening, arrow-key movement, multi-character type-ahead with its wrap-around and repeat-letter rules, screen-reader role mapping and position announcements, form participation, browser and password-manager autofill, and the platform's own picker on touch devices are all the browser's rather than a reimplementation. Only the closed control is styled: the open list is drawn by the operating system outside the page, so it can never be clipped by an overflow, never needs a portal, and never has a z-index bug — a rendering we do not control is a fair trade for behaviour no JavaScript listbox matches. The chevron is a real inline <svg> painted with currentColor rather than a background-image data URI, because a data URI is loaded as an independent document that cannot see the page's custom properties or currentColor, which would leave the glyph stuck at one colour; drawing it as an element also means forced-colors adapts it automatically, since colour, fill and stroke are all forced properties. It is marked aria-hidden, because the native control already announces itself. The prop list deliberately omits the native size attribute: on a <select> that means visible row count, and a value above 1 turns the control into an in-page list box, so the axis name is claimed for the visual scale and the native attribute dropped rather than quietly shadowed. Height is set explicitly with zero vertical padding, because Safari normalises padding-block on a select and centres the text itself while Chrome and Firefox honour it, which would otherwise give a different control height per engine. SelectField renders a real <label htmlFor> bound to the control and composes aria-describedby rather than overwriting it. The single source of truth for the error state is aria-invalid — used in preference to the :invalid pseudo-class, which matches on first paint and would render every untouched required control in error colour before anyone had touched the form. The message region is always mounted, even when empty, because an aria-live region has to exist before its text arrives for the announcement to be reliable. Focus shows a 2px offset ring on :focus-visible that turns the error colour while invalid. Motion is suppressed under prefers-reduced-motion, and in forced-colors mode a system-coloured border keeps the control's bounds perceivable once fills are discarded, with the invalid state switching to Mark. Options carry an explicit opaque background because Firefox paints the open list from the control's own colours, which would otherwise leave the popup unreadable under the transparent underline treatment and the translucent glass one. Padding, margins and the chevron lane use logical properties throughout, so the control mirrors under RTL. Contrast: the selected option's text measures at or above 4.5:1 against the control's own surface on every material and in both the default and filled treatments, and the chevron — an informative glyph rather than decoration — is held to that same 4.5:1 rather than the 3:1 WCAG 1.4.11 would allow, measuring 5.93:1 at worst (glass, composited over pure black) and 7.17:1 or better on the opaque materials.",
  a11yEs:
    "Renderiza un <select> nativo, así que la apertura por teclado, el movimiento con flechas, la escritura predictiva de varios caracteres con sus reglas de ciclo y repetición, el mapeo de rol y los anuncios de posición para lectores de pantalla, la participación en formularios, el autocompletado del navegador y del gestor de contraseñas, y el selector propio de la plataforma en dispositivos táctiles son del navegador y no una reimplementación. Solo se estiliza el control cerrado: la lista abierta la dibuja el sistema operativo fuera de la página, así que nunca la recorta un overflow, nunca necesita un portal y nunca tiene un problema de z-index — un renderizado que no controlamos es un precio justo por un comportamiento que ningún listbox en JavaScript iguala. El chevron es un <svg> en línea pintado con currentColor y no una imagen de fondo con data URI, porque un data URI se carga como documento independiente que no puede ver las propiedades personalizadas de la página ni currentColor, lo que dejaría el glifo clavado en un solo color; dibujarlo como elemento también hace que forced-colors lo adapte solo, ya que color, fill y stroke son propiedades forzadas. Lleva aria-hidden, porque el control nativo ya se anuncia. La lista de props omite deliberadamente el atributo nativo size: en un <select> significa número de filas visibles, y un valor mayor que 1 convierte el control en una lista incrustada, así que el nombre del eje se reserva para la escala visual y el atributo nativo se elimina en vez de quedar tapado en silencio. La altura se fija explícitamente con padding vertical cero, porque Safari normaliza padding-block en un select y centra el texto por su cuenta mientras Chrome y Firefox lo respetan, lo que si no daría una altura distinta por motor. SelectField renderiza un <label htmlFor> real asociado al control y compone aria-describedby en vez de sobrescribirlo. La única fuente de verdad del estado de error es aria-invalid — preferido a la pseudoclase :invalid, que coincide desde el primer pintado y teñiría de color de error todos los controles obligatorios sin tocar antes de que nadie hubiera tocado el formulario. La región del mensaje está siempre montada, incluso vacía, porque una región aria-live tiene que existir antes de que llegue su texto para que el anuncio sea fiable. El foco muestra un anillo de 2px con desplazamiento en :focus-visible que pasa al color de error mientras es inválido. El movimiento se suprime bajo prefers-reduced-motion, y en forced-colors un borde con color de sistema mantiene perceptibles los límites del control cuando se descartan los rellenos, con el estado inválido pasando a Mark. Las opciones llevan un fondo opaco explícito porque Firefox pinta la lista abierta a partir de los colores del propio control, lo que si no dejaría el desplegable ilegible bajo el tratamiento subrayado transparente y el de vidrio translúcido. Los rellenos, márgenes y el carril del chevron usan propiedades lógicas, así que el control se refleja en RTL. Contraste: el texto de la opción seleccionada mide 4,5:1 o más contra la superficie del propio control en cada material y en los tratamientos por defecto y relleno, y el chevron — un glifo informativo y no decorativo — se somete a ese mismo 4,5:1 en vez del 3:1 que permitiría la 1.4.11 de WCAG, midiendo 5,93:1 en el peor caso (vidrio, compuesto sobre negro puro) y 7,17:1 o mejor en los materiales opacos.",
  sourcePath: "src/registry/ui/select.tsx",
  Preview: SelectPreview,
};
