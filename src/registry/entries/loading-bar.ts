import { LoadingBarPreview } from "@/registry/previews/loading-bar-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Loading Bar component. */
export const entry: RegistryEntry = {
  slug: "loading-bar",
  name: "Loading Bar",
  nameEs: "Barra de carga",
  category: "feedback",
  materials: ["adaptive"],
  description:
    "A thin indeterminate top progress bar in the NProgress idiom for route transitions: a highlighted segment creeps across the track via a hoisted keyframe, with an optional fixed prop to pin it to the top of the viewport. Agnostic — a single adaptive light/dark recipe in three thicknesses.",
  descriptionEs:
    "Una barra de progreso superior, fina e indeterminada, al estilo NProgress para transiciones de ruta: un segmento resaltado avanza por la pista mediante un keyframe incorporado, con una prop opcional fixed para fijarla al borde superior de la ventana. Agnóstica: una sola receta adaptable claro/oscuro en tres grosores.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminada" }],
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
    "The bar exposes role=\"progressbar\" with an aria-label that defaults to \"Loading\" and, deliberately, NO aria-valuenow — which is exactly how an indeterminate progressbar is expressed, so its meaning is carried by role and accessible name rather than by colour. An empty or whitespace-only label falls back to \"Loading\" so the bar is never nameless. The travelling segment is decorative and aria-hidden; the progressbar is not a live region, so it stays a passive indicator that never fires an announcement on mount, matching the Progress component. Under prefers-reduced-motion the creep is cancelled outright and a static partial bar (about 60% width, anchored at the inline-start) remains, still perceivable without any movement — the resting state is preserved rather than hidden. The creep animates the standalone translate and scale properties (with transform-origin left) rather than transform, so a caller's own transform cannot fight the animation, and the keyframe ships inside the component through React's deduplicated style hoisting so copying the file is the whole install. In forced-colors mode the author fill and the leading glow are discarded; the segment falls back to Highlight over a CanvasText track so the bar stays visible and its bounds perceivable. The adaptive accent measures well above 4.5:1 against its own track in both light (near-black on a faint wash) and dark (near-white on a translucent wash) schemes, and the bar is inert to the pointer so it never intercepts a click while a navigation is in flight.",
  a11yEs:
    "La barra expone role=\"progressbar\" con un aria-label que por defecto es \"Loading\" y, de forma deliberada, SIN aria-valuenow — que es justo como se expresa un progressbar indeterminado, de modo que su significado lo transmiten el rol y el nombre accesible y no el color. Un label vacío o solo con espacios recae en \"Loading\" para que la barra nunca quede sin nombre. El segmento que viaja es decorativo y lleva aria-hidden; el progressbar no es una región viva, así que se mantiene como indicador pasivo que nunca lanza un anuncio al montarse, igual que el componente Progress. Bajo prefers-reduced-motion el avance se cancela por completo y queda una barra parcial estática (alrededor del 60% de ancho, anclada al inicio), perceptible sin movimiento — se conserva el estado de reposo en lugar de ocultarlo. El avance anima las propiedades independientes translate y scale (con transform-origin left) en vez de transform, para que un transform propio de quien lo use no pelee con la animación, y el keyframe viaja dentro del componente mediante el izado deduplicado de estilos de React, así que copiar el archivo es toda la instalación. En modo forced-colors se descartan el relleno de autor y el brillo delantero; el segmento recae en Highlight sobre una pista CanvasText para que la barra siga visible y sus límites perceptibles. El acento adaptable mide muy por encima de 4,5:1 contra su propia pista tanto en claro (casi negro sobre un lavado tenue) como en oscuro (casi blanco sobre un lavado translúcido), y la barra es inerte al puntero para no interceptar clics mientras una navegación está en curso.",
  sourcePath: "src/registry/ui/loading-bar.tsx",
  Preview: LoadingBarPreview,
};
