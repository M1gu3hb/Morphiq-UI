import { SpinnerPreview } from "@/registry/previews/spinner-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the spinner component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a
 * file that another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "spinner",
  name: "Spinner",
  nameEs: "Indicador de carga",
  category: "feedback",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A compact indeterminate loading indicator in four material recipes, two arc treatments and three sizes. Its rotation keyframes travel inside the component, and the wait is announced through real text rather than a label the live region would never read.",
  descriptionEs:
    "Un indicador de carga indeterminado y compacto en cuatro recetas de material, dos tratamientos de arco y tres tamaños. Sus keyframes de rotación viajan dentro del componente, y la espera se anuncia con texto real en vez de una etiqueta que la región viva nunca leería.",
  variants: [
    { id: "arc", label: "Arc", labelEs: "Arco" },
    { id: "ring", label: "Ring", labelEs: "Anillo" },
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
    "The ring is decorative and carries aria-hidden; the wrapper is the role=\"status\" live region, and it always contains real text — either the visible label or a visually hidden fallback. That distinction is the whole component: a live region is announced by its contents, not by its name, so a role=\"status\" whose only child is aria-hidden and whose meaning sits in aria-label passes a static audit — the name is right there in the accessibility tree — and then says nothing at all when it mounts. Firefox is explicit about this, mapping a nameless status to a role that skips subtree name computation entirely. The hidden text uses the clip-rect sr-only technique rather than display:none or visibility:hidden, either of which would remove it from the accessibility tree and reintroduce the same silence. No redundant aria-live is set, since role=\"status\" already implies polite and atomic. Announcing a status at all is the genuine requirement here — WCAG 2.2 SC 4.1.3 Status Messages, Level AA — and a purely visual spinner fails it. Under prefers-reduced-motion the rotation stops outright and a still two-tone ring remains; the meaning does not depend on the movement because the text is present either way. That is a deliberate choice against the common alternative of a slow opacity pulse or a merely slowed rotation, both of which keep animating something when the preference asked for the opposite. Nothing in WCAG compels either option — honouring the preference at all sits at AAA, and the only binding rule is SC 2.3.1, that nothing flash above 3Hz, which a static ring satisfies trivially and a pulse only satisfies if tuned deliberately. The rotation keyframes ship inside the component through React's deduplicated style hoisting, so copying the file is the whole install, and they animate the standalone rotate property rather than transform, so a caller's own transform does not fight the animation for the same property. In forced-colors mode the arc and the track are given two different system colours, GrayText and CanvasText, because the border technique would otherwise collapse into a single uniform ring once author colours are discarded and the arc would become invisible. Contrast: WCAG 1.4.11 applies — the spinner is not decoration, it is the only thing on screen saying the interface is still alive — and the arc measures at least 3:1 against its own track on every material. Measured: adaptive 12.64:1 in light and 8.89:1 in dark, skeuo 6.32:1, clay 5.46:1, and glass 4.29:1 at worst, that last figure being the translucent track composited over pure black, where a lighter track failed the bar outright.",
  a11yEs:
    "El aro es decorativo y lleva aria-hidden; el contenedor es la región viva con role=\"status\", y siempre contiene texto real — la etiqueta visible o un sustituto oculto visualmente. Esa distinción es todo el componente: una región viva se anuncia por su contenido y no por su nombre, así que un role=\"status\" cuyo único hijo lleva aria-hidden y cuyo significado vive en aria-label pasa una auditoría estática — el nombre está ahí, en el árbol de accesibilidad — y luego no dice absolutamente nada al montarse. Firefox lo hace explícito, asignando a un status sin nombre un rol que se salta por completo el cálculo de nombre a partir del subárbol. El texto oculto usa la técnica sr-only de recorte y no display:none ni visibility:hidden, cualquiera de los cuales lo sacaría del árbol de accesibilidad y reintroduciría el mismo silencio. No se declara un aria-live redundante, porque role=\"status\" ya implica polite y atomic. Anunciar un estado es aquí el requisito de verdad — WCAG 2.2 SC 4.1.3 Mensajes de estado, nivel AA — y un indicador solo visual lo incumple. Bajo prefers-reduced-motion la rotación se detiene del todo y queda un aro bicolor quieto; el significado no depende del movimiento porque el texto está presente igualmente. Es una decisión deliberada frente a la alternativa habitual de un pulso lento de opacidad o una rotación simplemente más lenta, que siguen animando algo cuando la preferencia pedía lo contrario. Nada en WCAG obliga a ninguna de las dos — respetar la preferencia siquiera está en nivel AAA, y la única regla vinculante es la SC 2.3.1, que nada parpadee por encima de 3Hz, que un aro estático cumple de forma trivial y un pulso solo cumple si se ajusta con cuidado. Los keyframes de rotación viajan dentro del componente mediante el izado deduplicado de estilos de React, así que copiar el archivo es toda la instalación, y animan la propiedad independiente rotate en vez de transform, de modo que un transform propio de quien lo use no pelea con la animación por la misma propiedad. En forced-colors el arco y la pista reciben dos colores de sistema distintos, GrayText y CanvasText, porque si no la técnica de bordes colapsaría en un aro uniforme al descartarse los colores de autor y el arco se volvería invisible. Contraste: la 1.4.11 de WCAG sí aplica — el indicador no es decoración, es lo único en pantalla que dice que la interfaz sigue viva — y el arco mide al menos 3:1 contra su propia pista en cada material. Medido: adaptive 12,64:1 en claro y 8,89:1 en oscuro, skeuo 6,32:1, clay 5,46:1 y vidrio 4,29:1 en el peor caso, esa última cifra siendo la pista translúcida compuesta sobre negro puro, donde una pista más clara incumplía el listón directamente.",
  sourcePath: "src/registry/ui/spinner.tsx",
  Preview: SpinnerPreview,
};
