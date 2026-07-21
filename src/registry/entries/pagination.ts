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
    "The root is nav with a configurable accessible label and the controls live in a real ul/li list. Page, Previous page and Next page controls are native type=button elements, so Tab, Enter and Space work without a custom keyboard model. The active page has aria-current=\"page\" and is distinguished by fill, heavier weight and a persistent underline, not color alone. Previous is natively disabled on page one and Next on the final page; the optional disabled prop disables every control. Decorative arrow SVGs and range ellipses are aria-hidden, while each button keeps a textual accessible name. Long ranges expose five numbered destinations around the boundary or current page plus decorative ellipses. Only background-color, color, box-shadow and border-color transition because those are the properties hover/current states change; prefers-reduced-motion removes the cosmetic transition. Every active text/fill pair exceeds 7:1 and the active border exceeds 3:1 against its surface. Forced-colors uses ButtonFace/ButtonText, adds an inset Highlight outline to the current page and maps disabled controls to GrayText.",
  a11yEs:
    "La raíz es nav con etiqueta accesible configurable y los controles viven en una lista ul/li real. Los controles de página, Página anterior y Página siguiente son elementos nativos type=button, por lo que Tab, Enter y Espacio funcionan sin un modelo de teclado propio. La página activa usa aria-current=\"page\" y se distingue por relleno, mayor peso y subrayado persistente, no solo por color. Anterior queda deshabilitado de forma nativa en la primera página y Siguiente en la última; la prop disabled opcional deshabilita todos los controles. Los SVG de flecha y las elipsis de rango son aria-hidden, mientras cada botón conserva un nombre accesible textual. Los rangos largos muestran cinco destinos numerados alrededor del límite o la página actual y elipsis decorativas. Solo transicionan background-color, color, box-shadow y border-color porque son las propiedades que cambian en hover/current; prefers-reduced-motion elimina la transición cosmética. Cada par texto/relleno activo supera 7:1 y el borde activo supera 3:1 contra su superficie. Forced-colors usa ButtonFace/ButtonText, añade un outline Highlight interior a la página actual y asigna GrayText a controles deshabilitados.",
  sourcePath: "src/registry/ui/pagination.tsx",
  Preview: PaginationPreview,
};
