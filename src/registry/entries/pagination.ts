import { PaginationPreview } from "@/registry/previews/pagination-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry entry for the self-contained Pagination component. */
export const entry: RegistryEntry = {
  slug: "pagination",
  name: "Pagination",
  nameEs: "Paginación",
  category: "navigation",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A controlled, button-based pagination bar with long-range ellipses, boundary-aware controls, four tactile materials and three sizes.",
  descriptionEs:
    "Una barra de paginación controlada y basada en botones, con elipsis para rangos largos, controles conscientes de los límites, cuatro materiales táctiles y tres tamaños.",
  variants: [
    { id: "default", label: "Default", labelEs: "Por defecto" },
    { id: "solid", label: "Solid", labelEs: "Sólido" },
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
    "The root is nav with a configurable accessible label and the controls live in a real ul/li list. Page, Previous page and Next page controls are native type=button elements, so Tab, Enter and Space work without a custom keyboard model. The active page has aria-current=\"page\" and is distinguished by a pressed material fill, inset depth, heavier weight and a persistent underline, not color alone. Previous is natively disabled on page one and Next on the final page; the optional disabled prop disables every control. Decorative arrow SVGs and range ellipses are aria-hidden, while each button keeps a textual accessible name. Long ranges expose five numbered destinations around the boundary or current page plus decorative ellipses. Hover lifts through the standalone translate property while background-color, border-color, box-shadow and glass backdrop-filter respond; active press changes only translate and box-shadow. The current state additionally changes color and remains visibly pressed. prefers-reduced-motion removes interpolation and all translate travel while preserving the current fill, underline and inset shadow. Conservative minima for normal text / active text / active surface against its shell are: clay 9.83:1 / 7.41:1 / 5.36:1; glass 8.08:1 / 11.72:1 / 8.08:1; skeuo 10.15:1 / 6.80:1 / 4.98:1; adaptive light 17.80:1 / 17.80:1 / 15.30:1; adaptive dark 13.05:1 / 16.06:1 / 11.67:1. Forced-colors clears gradients, backdrop filters and shadows, uses ButtonFace/ButtonText, adds a Highlight outline to the current page and maps disabled controls to GrayText.",
  a11yEs:
    "La raíz es nav con etiqueta accesible configurable y los controles viven en una lista ul/li real. Los controles de página, Página anterior y Página siguiente son elementos nativos type=button, por lo que Tab, Enter y Espacio funcionan sin un modelo de teclado propio. La página activa usa aria-current=\"page\" y se distingue por relleno material hundido, profundidad interior, mayor peso y subrayado persistente, no solo por color. Anterior queda deshabilitado de forma nativa en la primera página y Siguiente en la última; la prop disabled opcional deshabilita todos los controles. Los SVG de flecha y las elipsis de rango son aria-hidden, mientras cada botón conserva un nombre accesible textual. Los rangos largos muestran cinco destinos numerados alrededor del límite o la página actual y elipsis decorativas. Hover eleva mediante la propiedad standalone translate mientras responden background-color, border-color, box-shadow y el backdrop-filter de glass; el press activo cambia solo translate y box-shadow. El estado actual cambia además color y permanece visiblemente hundido. prefers-reduced-motion elimina interpolación y todo recorrido translate, pero conserva el relleno, subrayado y sombra interior de la página actual. Los mínimos conservadores para texto normal / texto activo / superficie activa contra su contenedor son: clay 9,83:1 / 7,41:1 / 5,36:1; glass 8,08:1 / 11,72:1 / 8,08:1; skeuo 10,15:1 / 6,80:1 / 4,98:1; adaptive claro 17,80:1 / 17,80:1 / 15,30:1; adaptive oscuro 13,05:1 / 16,06:1 / 11,67:1. Forced-colors elimina gradientes, backdrop filters y sombras, usa ButtonFace/ButtonText, añade un outline Highlight a la página actual y asigna GrayText a controles deshabilitados.",
  sourcePath: "src/registry/ui/pagination.tsx",
  Preview: PaginationPreview,
};
