import { FileUploadPreview } from "@/registry/previews/file-upload-preview";
import type { RegistryEntry } from "@/registry/schema";

/**
 * Registry entry for the file-upload component.
 *
 * One entry per file, exported as `entry`, living at
 * `src/registry/entries/<slug>.ts` where the file name IS the slug.
 * `scripts/gen-registry.mjs` discovers these files and assembles
 * `src/registry/generated.ts`, so adding a component never means editing a file
 * another author may be editing at the same time.
 */
export const entry: RegistryEntry = {
  slug: "file-upload",
  name: "File Upload",
  nameEs: "Carga de archivos",
  category: "inputs",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A drag-and-drop zone wrapped around a real multiple file input, with a removable file list, deterministic human-readable sizes and a per-file upload meter. Four material recipes and three sizes; the drag layer is a pure enhancement over a keyboard-operable label.",
  descriptionEs:
    "Una zona de arrastrar y soltar construida sobre un input de archivos múltiple real, con una lista de archivos eliminables, tamaños legibles deterministas y un medidor de subida por archivo. Cuatro recetas de material y tres tamaños; la capa de arrastre es una mejora sobre una etiqueta operable con teclado.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "The drop zone is a real <label> wrapping a native <input type=file multiple>, so pointer click, keyboard (Tab to the input, then Enter or Space to open the OS picker), form participation and the platform file dialog are the browser's rather than a reimplementation — drag-and-drop is a pure enhancement layered on top, and a keyboard-only user is never worse off than a pointer user. The input carries an explicit accessible name via aria-labelledby to the visible field label, and aria-describedby is composed (not overwritten) so it points at both the constraints line and, when present, the error message while preserving any description the caller passes. aria-invalid is the single source of truth for the error look: the drop-zone border keys off the input's aria-invalid through :has, so what is shown and what assistive tech is told cannot drift, and a file rejected for size or type both sets it and prints a reason. Two polite live regions work in parallel: the message region is always mounted so its announcement is reliable, and a separate visually-hidden status region announces files added and removed without clobbering a persistent error. Each row exposes the file name, a deterministic human-readable size and a Remove button labelled with the file name; when uploading, a role=progressbar with aria-valuemin/now/max is paired with a visible percent so the level is never conveyed by colour alone. Focus surfaces a 2px offset outline plus a material-specific inset well on the label, driven by the hidden input's :focus-visible. prefers-reduced-motion removes the drag-highlight, row-enter and meter transitions but preserves their final state — the highlight still shows, the row still appears, the meter still fills. forced-colors clears the material gradient, tactile shadows and backdrop filter while a system-coloured dashed CanvasText border keeps the target's bounds, a Highlight border marks the active drag, a Mark border marks the invalid state and the remove glyph and file icons keep a CanvasText colour. Contrast follows Input: primary copy uses --mq-text and the constraints line uses --mq-placeholder, both measured at or above 4.5:1 against the control's own surface on every material.",
  a11yEs:
    "La zona de arrastre es un <label> real que envuelve un <input type=file multiple> nativo, así que el clic con puntero, el teclado (Tab hasta el input y luego Enter o Espacio para abrir el selector del sistema), la participación en formularios y el diálogo de archivos de la plataforma son del navegador y no una reimplementación — arrastrar y soltar es una mejora añadida encima, y quien solo usa teclado nunca queda en desventaja frente a quien usa puntero. El input lleva un nombre accesible explícito mediante aria-labelledby hacia la etiqueta visible, y aria-describedby se compone (no se sobrescribe) para apuntar tanto a la línea de restricciones como, cuando existe, al mensaje de error, conservando cualquier descripción que pase quien lo usa. aria-invalid es la única fuente de verdad del estado de error: el borde de la zona se apoya en el aria-invalid del input mediante :has, de modo que lo que se ve y lo que se le dice a la tecnología de asistencia no pueden desincronizarse, y un archivo rechazado por tamaño o tipo lo activa e imprime un motivo. Dos regiones live corteses funcionan en paralelo: la región del mensaje está siempre montada para que su anuncio sea fiable, y una región de estado oculta anuncia archivos añadidos y eliminados sin pisar un error persistente. Cada fila muestra el nombre del archivo, un tamaño legible determinista y un botón Eliminar etiquetado con el nombre; al subir, un role=progressbar con aria-valuemin/now/max se acompaña de un porcentaje visible para que el nivel no dependa solo del color. El foco muestra un contorno desplazado de 2px más un pozo interior específico del material en la etiqueta, impulsado por el :focus-visible del input oculto. prefers-reduced-motion elimina las transiciones de resaltado de arrastre, de entrada de fila y del medidor pero conserva su estado final — el resaltado sigue apareciendo, la fila sigue apareciendo, el medidor sigue llenándose. forced-colors quita el gradiente del material, las sombras táctiles y el filtro de fondo mientras un borde discontinuo CanvasText del sistema mantiene los límites, un borde Highlight marca el arrastre activo, un borde Mark marca el estado inválido y el glifo de eliminar y los iconos de archivo conservan un color CanvasText. El contraste sigue al de Input: el texto principal usa --mq-text y la línea de restricciones usa --mq-placeholder, ambos medidos en 4,5:1 o más contra la superficie del propio control en cada material.",
  sourcePath: "src/registry/ui/file-upload.tsx",
  Preview: FileUploadPreview,
};
