import { LoadingButtonPreview } from "@/registry/previews/loading-button-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the loading-button component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`.
 */
export const entry: RegistryEntry = {
  slug: "loading-button",
  name: "Loading Button",
  nameEs: "Botón de carga",
  category: "actions",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A native button with a pending state that keeps its width — the label reserves its box while a spinner is overlaid dead-centre, so activating it never shifts the layout.",
  descriptionEs:
    "Un botón nativo con estado pendiente que conserva su ancho — la etiqueta reserva su caja mientras un spinner se superpone al centro, así que activarlo nunca desplaza el diseño.",
  variants: [{ id: "default", label: "Default", labelEs: "Predeterminado" }],
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
    "Built on a native <button> with type=\"button\" by default, so focus, keyboard activation and the disabled state come for free. Its accessible name is the label you pass as children; icon-only usage should supply an aria-label. Focus is shown with a 2px offset ring on :focus-visible (mirrored on data-focus for docs) and is never removed. The pending state sets aria-busy=\"true\" and blocks activation for pointer and for Enter/Space in the handlers, while deliberately NOT setting the native disabled attribute — a disabled element is blurred and dropped from the tab order, which would silence the busy announcement it is meant to carry, so the control stays focusable while busy. Loading is never signalled by colour alone: an animated spinner glyph appears and, when loadingText is supplied, a visible word replaces the label plus an sr-only copy becomes the accessible name. There is no layout shift — the label reserves its box (opacity-0) and the spinner is overlaid absolutely, so the button width is identical idle and busy. Under prefers-reduced-motion the hover-lift and press travel are dropped but the pressed inset well still applies instantly on :active, and the spinner stops spinning while its presence and aria-busy still convey the state. In forced-colors mode the border is pinned to CanvasText so the bounds survive, the focus ring maps to Highlight, and the spinner strokes in CanvasText via currentColor. Contrast: every filled material meets or exceeds 4.5:1 for the label (clay 8.9:1, glass 4.7:1 over black, skeuo 12.6:1, adaptive 16.3:1 / dark 15.8:1), and the spinner shares the label colour.",
  a11yEs:
    "Construido sobre un <button> nativo con type=\"button\" por defecto, así que el foco, la activación por teclado y el estado deshabilitado funcionan de forma gratuita. Su nombre accesible es la etiqueta que pasas como children; el uso solo con icono debe aportar un aria-label. El foco se muestra con un anillo de 2px con desplazamiento en :focus-visible (replicado en data-focus para la documentación) y nunca se elimina. El estado pendiente activa aria-busy=\"true\" y bloquea la activación con puntero y con Enter/Espacio en los manejadores, sin poner a propósito el atributo nativo disabled — un elemento deshabilitado pierde el foco y sale del orden de tabulación, lo que silenciaría el anuncio de ocupado que debe transmitir, por eso el control permanece enfocable mientras está ocupado. La carga nunca se señala solo con color: aparece un spinner animado y, cuando se aporta loadingText, una palabra visible reemplaza la etiqueta junto con una copia sr-only que pasa a ser el nombre accesible. No hay desplazamiento del diseño — la etiqueta reserva su caja (opacity-0) y el spinner se superpone de forma absoluta, así que el ancho del botón es idéntico en reposo y ocupado. Bajo prefers-reduced-motion se eliminan el levantamiento al pasar el cursor y el recorrido de pulsación, pero el pozo hundido interior sigue aplicándose al instante en :active, y el spinner deja de girar mientras su presencia y aria-busy siguen transmitiendo el estado. En modo forced-colors el borde se fija a CanvasText para conservar los límites, el anillo de foco se asigna a Highlight y el spinner se traza en CanvasText mediante currentColor. Contraste: cada material con relleno alcanza o supera 4,5:1 para la etiqueta (clay 8,9:1, glass 4,7:1 sobre negro, skeuo 12,6:1, adaptive 16,3:1 / oscuro 15,8:1), y el spinner comparte el color de la etiqueta.",
  sourcePath: "src/registry/ui/loading-button.tsx",
  Preview: LoadingButtonPreview,
};
