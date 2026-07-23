# 0058 · Acciones (tanda 3) · 10 componentes

- **Ronda:** R16 · Sección Acciones (tanda 3)
- **Ejecutor:** Claude Code (en paralelo con Codex · Bloques tanda 2)
- **Rama:** `feat/actions-batch3` → PR contra `main`
- **PR:** #57
- **Gate:** `npm run check` → `{"components":155,...,"status":"ok"}` (build genera 10 rutas SSG nuevas)
- **Base:** `main` a 145 entradas (tras mergear #55 media + #54 data en el Paso 0). 145 + 10 = **155**.

## Resumen

Diez controles de acción con superficie, en los cuatro materiales (`clay/glass/skeuo/adaptive`)
con profundidad real y física de press, tamaños `sm/md/lg`, variante única `default`. Todos los
menús y popovers están **hand-rolled** (no hay Radix de menu/popover/dialog en la allowlist):
elementos nativos + ARIA, posicionamiento propio (`absolute` dentro de un contenedor
`relative`/`isolate`, sin portales globales ni fugas `:root`), foco itinerante (roving tabindex),
`Arrow`/`Home`/`End`, `Escape` y click-fuera para cerrar, foco de retorno al disparador y foco
atrapado donde aplica un popover tipo diálogo.

**Fuente/licencia (todos):** código original en estilo Morphiq, inspirado en patrones de
proyectos **MIT** (magicui, animata, smoothui, seraui, kokonutui, motion-primitives, cmdk,
patrón split-button propio); no copiado. Atribución fina la mantiene el orquestador en
`docs/CREDITS.md` (no editado en esta ronda).

**Contrato común de a11y (los 10):** nombre accesible en todo control; el estado **nunca** se
transmite solo por color (texto + ícono + ARIA: `aria-pressed`/`aria-expanded`/`aria-checked`/
`aria-activedescendant`); teclado completo; `aria-live="polite"` para confirmaciones
(copiado, voto, reacción, me gusta, suscripción); `prefers-reduced-motion` descarta recorrido/
partículas pero conserva el estado final y el hundimiento `:active` instantáneo;
`forced-colors` conserva límites (`CanvasText`), ítem activo `Highlight`/`HighlightText`, anillo
`Highlight`; contraste ≥ 4.5:1. Recetas de material y física de press reutilizadas **verbatim**
(adaptando nombres) de `split-button.tsx` / `button.tsx`. Sin dependencia `motion`
(animaciones puras CSS/keyframes); deps por componente: `class-variance-authority`, `clsx`,
`tailwind-merge`, `lucide-react` (+ `src/lib/cn.ts`).

## Los 10 componentes

### 1. Dropdown Menu (`dropdown-menu`)
- **Técnica:** botón disparador (label + chevron que rota) que abre un `role="menu"` de
  `role="menuitem"`; separadores opcionales vía unión discriminada (`<hr>` con `role="separator"`,
  saltado por la navegación). Keyframe de entrada con `<style href precedence>`.
- **a11y:** `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` solo montado; roving tabindex
  (el activo `tabIndex 0`), `Arrow/Home/End` saltando deshabilitados y separadores, `Enter/Space`
  activan, `Escape`+`Tab` cierran y devuelven el foco (con `stopPropagation`), pointerdown fuera cierra.

### 2. Context Menu (`context-menu`)
- **Técnica:** región objetivo focalizable que abre el menú en `contextmenu` (clic derecho) en las
  coordenadas del puntero (clamp dentro del contenedor); misma superficie de menú que dropdown.
- **a11y:** región con `aria-haspopup="menu"` y nombre accesible; apertura por teclado con
  `Shift+F10` y tecla de menú (en el centro de la región); `Escape` cierra y devuelve el foco a la
  región; mismo modelo de menú (roving, `Arrow/Home/End`, `Enter/Space`, click-fuera).

### 3. Command Menu (`command-menu`)
- **Técnica:** paleta ⌘K: disparador abre un panel posicionado (no portal) con input de filtro sobre
  una lista de comandos agrupada y desplazable; filtro por subcadena en memoria; atajo `⌘K`/`Ctrl+K`
  a nivel documento mientras está montado. Selección **virtual** (el input conserva el foco DOM).
- **a11y:** input `role="combobox"` + `aria-activedescendant`/`aria-controls`/`aria-expanded`; lista
  `role="listbox"` de `role="option"` (`aria-selected`); grupos `role="group"`; `aria-live` anuncia el
  conteo de resultados; `Arrow`/`Enter`/`Escape`; foco de retorno al disparador.
  *(Refactor: seating del activo y reset del filtro en los handlers, no en efectos — sin
  `set-state-in-effect`.)*

### 4. Like Button (`like-button`)
- **Técnica:** botón corazón con conteo en vivo; no-controlado por defecto y controlable; ráfaga de
  partículas decorativa (`aria-hidden`) totalmente suprimida bajo `reduced-motion`.
- **a11y:** `aria-pressed`, nombre dinámico (`"Like"`/`"Unlike"`), conteo en texto (cifras tabulares),
  corazón relleno vs contorno (forma, no color) y `aria-live` ("Liked, N likes").

### 5. Share Button (`share-button`)
- **Técnica:** popover hand-rolled con destinos (X, Facebook, LinkedIn, Email construidos desde
  `url`+`shareTitle`) + "Copiar enlace"; **foco atrapado** mientras está abierto; copia vía
  `navigator.clipboard` guardado (fallback `execCommand`), solo dentro del handler (SSG-safe).
- **a11y:** `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`; `Tab`/`Shift+Tab` ciclan
  dentro; `Escape`/click-fuera cierran y devuelven el foco; `aria-live` ("Link copied").
  *(Refactor: limpieza de confirmación/timer en el cierre, no en efecto.)*

### 6. Speed Dial (`speed-dial`)
- **Técnica:** FAB que expande acciones apiladas verticalmente con stagger (fade + leve subida) y
  rota `+`→`×`; distinto del `fab` simple. Bajo `reduced-motion` aparecen sin salto (solo opacidad).
- **a11y:** FAB con `aria-haspopup="menu"`, `aria-expanded`; acciones `role="menuitem"` con
  `aria-label` propio; roving `Arrow/Home/End`, `Escape`+`Tab` cierran y devuelven el foco; el
  estado lo lleva `aria-expanded` + el ícono, no el color.

### 7. Theme Toggle (`theme-toggle`)
- **Técnica:** interruptor claro/oscuro con crossfade sol/luna (`opacity`+`rotate`, transición que
  nombra ambos); estado **solo en memoria**/prop, sin `localStorage` ni mutación de `documentElement`.
- **a11y:** `role="switch"` + `aria-checked`; nombre accesible; `aria-live` ("Dark mode on/off"); los
  dos íconos marcan el estado; `reduced-motion` hace el cambio instantáneo conservando el ícono correcto.

### 8. Reaction Picker (`reaction-picker`)
- **Técnica:** popover horizontal estilo mensajería con reacciones (emoji unicode `aria-hidden`);
  elegir una fija la reacción actual y cierra.
- **a11y:** disparador `aria-haspopup="menu"`, `aria-expanded`; cada reacción es `role="menuitem"` con
  **etiqueta textual** (`aria-label`, p. ej. "Love") — el emoji nunca es el único portador; roving
  **horizontal** `ArrowLeft/Right`+`Home/End`; `Escape`/click-fuera; `aria-live` ("Reacted with Love").

### 9. Vote Buttons (`vote-buttons`)
- **Técnica:** voto arriba/abajo estilo foro con marcador en vivo; arriba/abajo son toggles mutuamente
  exclusivos (al invertir, el marcador cambia en 2). El marcador siempre sobre superficie con contraste medido.
- **a11y:** `role="group"`; dos botones con nombre distinto (`"Upvote"`/`"Downvote"`) y `aria-pressed`;
  la dirección la lleva la flecha + etiqueta (no el color); `aria-live` anuncia el total ("Score N").

### 10. Subscribe Button (`subscribe-button`)
- **Técnica:** toggle suscribir↔suscrito con confirmación; no-controlado por defecto y controlable;
  breve animación de asentamiento al suscribir (suprimida bajo `reduced-motion`, el label/ícono cambian igual).
- **a11y:** `aria-pressed`; el **label visible** cambia (`Subscribe`→`Subscribed`) y el glifo
  (`Bell`→`BellRing`/`Check`), así el estado es texto+ícono, no color; `aria-live` ("Subscribed"/"Unsubscribed").

## Proceso (según restricciones de la ronda)

Se siguió el proceso mínimo indicado: **sin verificación en navegador**, **sin pase de revisión
adversarial ni sub-agentes/workflow de review** (el orquestador audita), **sin TDD**, **sin git
worktree** (registro colisión-cero, trabajo directo en `D:\morphiq-ui`). La **generación** se hizo con
un workflow de generación (un agente por componente, cada uno leyendo las referencias en D: y
reutilizando las recetas verbatim) — trabajo primario, no una revisión. Durante el desarrollo se usaron
`npm run lint`/`typecheck` rápidos; **un solo `npm run check`** completo al cierre.

### Correcciones previas al gate
El lint (regla React 19 `react-hooks/set-state-in-effect`) marcó tres `setState` síncronos dentro de
efectos en `command-menu` (2) y `share-button` (1). Se corrigieron moviendo las transiciones de estado
a los handlers que las causan (helpers `openPanel`/`handleQueryChange`/`enabledIndicesFor` y
`closePopover`), como hace el patrón de referencia `split-button`. Lint y typecheck en verde tras el fix.

## Nota de entorno (árbol compartido con Codex)

`D:\morphiq-ui` es un working tree compartido; `gen-registry` descubre todas las `entries/*.ts` en disco.
Durante la ronda, el `HEAD` compartido apareció varias veces en la rama de Codex (`feat/media-batch2`,
`feat/blocks-batch2`); en cada gate/commit se imprimió la rama y se volvió a `feat/actions-batch3` (regla
permanente). Los 10 componentes de Bloques de Codex estaban **committeados en su rama**, así que el
`checkout` a mi rama los sacó limpiamente del árbol y el conteo quedó exacto en `main(145)+10 = 155` sin
necesidad de apartar untracked. `git add` fue **solo** de mis 30 archivos explícitos (nunca `-A`); no se
tocó `docs/CREDITS.md`, `schema.ts`, `verify-registry`, `package.json` ni ningún `ui/*` existente.
