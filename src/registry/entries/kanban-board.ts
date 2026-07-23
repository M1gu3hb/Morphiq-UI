import { KanbanBoardPreview } from "@/registry/previews/kanban-board-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Kanban Board. */
export const entry: RegistryEntry = {
  slug: "kanban-board",
  name: "Kanban Board",
  nameEs: "Tablero Kanban",
  category: "data",
  materials: ["adaptive"],
  description:
    "A kanban board of columns and cards where cards move between columns via real buttons and the keyboard — drag is only an optional enhancement — driven by a columns:{id,title,cards[]}[] prop, with labelled lists, a text card count and a polite live announcer.",
  descriptionEs:
    "Un tablero kanban de columnas y tarjetas donde las tarjetas se mueven entre columnas mediante botones reales y el teclado —el arrastre es solo una mejora opcional— a partir de una prop columns:{id,title,cards[]}[], con listas rotuladas, un conteo de tarjetas en texto y un anunciador aria-live cortés.",
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
    "Each column is a labelled list: a real <h3> heading names it and an <ul role=\"list\"> named via aria-labelledby holds one role=\"listitem\" card each, so assistive tech reads the board as structured lists rather than undifferentiated boxes. Every card carries real <button> move controls whose aria-label spells the destination, for example Move 'Ship pipeline' to Done; the buttons sit in the tab order so the whole board is operable by keyboard with no drag, and a button is disabled at the ends (the first column has no move-left). An aria-live=\"polite\" region announces each move as Moved <card> to <column>, so a keyboard or screen-reader user hears the result. Colour is never the sole carrier of meaning: a column's card count is shown as text (a numeric chip for sighted readers plus an sr-only \"N cards\" in the heading), the move direction is carried by an arrow icon shape paired with the button's text label, and the optional drop-target highlight is backed by a border rather than a tint alone. Focus is preserved across a move: after a card jumps columns, focus lands on the same-direction button in its new column, or the opposite one when the card now sits at an end, so keyboard operation never dead-ends. The card entrance is reduced-motion-safe without JavaScript: a card's resting state is its final position, so SSR, no-JS and reduced motion show it, and the mount rise and fade are expressed with the @starting-style (starting:) variant on the standalone translate property plus opacity with a matching transition and motion-reduce:transition-none. In forced-colors mode fills and shadows are discarded, so column, card and button bounds are kept with CanvasText borders, the focus ring becomes Highlight and the drop target is marked with a Highlight border. Contrast: card, heading, count and description text all clear 4.5:1 in both colour schemes. Every id comes from React.useId() and every figure is a prop, so nothing in render depends on the current time or randomness.",
  a11yEs:
    "Cada columna es una lista rotulada: un encabezado <h3> real la nombra y un <ul role=\"list\"> nombrado mediante aria-labelledby contiene una tarjeta role=\"listitem\" por elemento, así que la tecnología de asistencia lee el tablero como listas estructuradas en vez de cajas indiferenciadas. Cada tarjeta lleva controles de movimiento con <button> reales cuyo aria-label deletrea el destino, por ejemplo Move 'Ship pipeline' to Done; los botones están en el orden de tabulación, así que todo el tablero se opera con teclado sin arrastrar, y un botón se deshabilita en los extremos (la primera columna no tiene mover-izquierda). Una región aria-live=\"polite\" anuncia cada movimiento como Moved <tarjeta> to <columna>, así que un usuario de teclado o lector de pantalla escucha el resultado. El color nunca es el único portador de significado: el conteo de tarjetas de una columna se muestra como texto (un chip numérico para quienes ven más un \"N cards\" sr-only en el encabezado), la dirección del movimiento la lleva la forma del icono de flecha junto con la etiqueta de texto del botón, y el resaltado opcional de destino de soltado se respalda con un borde y no solo con un tinte. El foco se preserva en un movimiento: tras saltar de columna, el foco cae en el botón de la misma dirección en su nueva columna, o en el opuesto cuando la tarjeta queda en un extremo, así que la operación por teclado nunca queda sin salida. La entrada de la tarjeta es segura para movimiento reducido sin JavaScript: el estado en reposo de una tarjeta es su posición final, así que SSR, sin-JS y movimiento reducido la muestran, y el ascenso y desvanecimiento al montar se expresan con la variante @starting-style (starting:) sobre la propiedad estándar translate más opacity con una transición correspondiente y motion-reduce:transition-none. En modo forced-colors los rellenos y sombras se descartan, así que los límites de columna, tarjeta y botón se mantienen con bordes CanvasText, el anillo de foco pasa a Highlight y el destino de soltado se marca con un borde Highlight. Contraste: el texto de tarjeta, encabezado, conteo y descripción supera 4,5:1 en ambos esquemas de color. Cada id proviene de React.useId() y cada cifra es una prop, por lo que nada en el render depende de la hora actual ni del azar.",
  sourcePath: "src/registry/ui/kanban-board.tsx",
  Preview: KanbanBoardPreview,
};
