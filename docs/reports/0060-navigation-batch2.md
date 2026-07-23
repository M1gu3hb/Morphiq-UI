# 0060 · Navegación (tanda 2) · 10 componentes

- **Ronda:** R17 · Sección Navegación (tanda 2)
- **Ejecutor:** Claude Code (en paralelo con Codex · Backgrounds tanda 3)
- **Rama:** `feat/navigation-batch2` → PR contra `main`
- **PR:** #59
- **Gate:** `npm run check` → `{"components":175,...,"status":"ok"}` (build genera 10 rutas SSG nuevas)
- **Base:** `main` a 165 entradas (tras mergear #56 blocks + #57 actions en el Paso 0). 165 + 10 = **175**.

## Resumen

Diez componentes de navegación. Los nueve con superficie llevan los cuatro materiales
(`clay/glass/skeuo/adaptive`) con profundidad real (skeuo en greige cálido `#e6e3da`, `adaptive`
gira con `dark:`); el agnóstico de anclas (`scrollspy-nav`) es `["adaptive"]`. Tamaños `sm/md/lg`,
variante única `default`. Todos los menús, mega-menús, cajones y menubars están **hand-rolled**
(no hay Radix de menu/popover/dialog/navigation-menu en la allowlist): elementos nativos + ARIA,
posicionamiento propio (`absolute`/`fixed` en contenedor `relative`/`isolate`), sin portales
globales ni fugas `:root`.

**Fuente/licencia (todos):** código original en estilo Morphiq, inspirado en patrones de proyectos
**MIT** (magicui, animata, smoothui, seraui, kokonutui, y los patrones WAI-ARIA Authoring Practices
para menubar/disclosure); no copiado. Atribución fina la mantiene el orquestador en
`docs/CREDITS.md` (no editado en esta ronda).

**Contrato común de a11y (los 10):** landmark `<nav aria-label>` donde aplica; destinos como
enlaces reales `<a href>` con nombre accesible (los controles de solo-estado son `<button>`);
`aria-current="page"`/`"true"` en el activo, **nunca por color solo** — siempre acompañado de peso
tipográfico y una regla de borde reservada en el box model (para que `forced-colors` pueda
marcarla); `aria-expanded` en todo disclosure/menú con `aria-controls` apuntando a la región solo
mientras está montada; `Escape` cierra con `stopPropagation` y devuelve el foco al disparador;
targets táctiles ≥ 44px en navegación móvil; `reduced-motion` descarta el recorrido pero conserva
el estado final; `forced-colors` conserva límites (`CanvasText`), marca el activo con color de
sistema y el anillo de foco en `Highlight`; contraste ≥ 4.5:1. Sin dependencia `motion`
(animaciones puras CSS/keyframes). SSR/SSG-safe: sin `localStorage`; `IntersectionObserver`,
scroll y `matchMedia` solo dentro de efectos con guarda o handlers.

## Los 10 componentes

### 1. Navbar (`navbar`)
- **Técnica:** barra responsive (marca + enlaces + CTA + toggle) que pliega a hamburguesa mediante
  **container query** (`@container`, breakpoint 38rem) en vez de viewport, así funciona dentro de
  cualquier columna estrecha. Activo por regla reservada + peso (no slider medido: el activo es la
  página actual, estática por ítem).
- **a11y:** `<nav aria-label>`; toggle con `aria-expanded`/`aria-controls` (solo montado);
  `aria-current="page"`; `Escape` cierra el panel y devuelve el foco al toggle; disclosure **no
  modal** (el foco no se atrapa, Tab fluye).

### 2. Sidebar (`sidebar`)
- **Técnica:** navegación lateral con secciones colapsables (disclosure por grupo) y colapso global
  a riel estrecho.
- **a11y:** `<nav aria-label>`; cada cabecera de sección es `<button aria-expanded aria-controls>`;
  `aria-current="page"` en el enlace activo; Tab alcanza toggle, cabeceras y enlaces; Enter/Space
  alternan (botones reales) y los enlaces navegan nativamente.

### 3. Mega Menu (`mega-menu`)
- **Técnica:** fila de disparadores; al activar uno se abre un panel **de ancho completo** con
  columnas de enlaces agrupados, posicionado en un contenedor `relative`/`isolate`. Un solo panel
  abierto a la vez; keyframe de entrada con `motion-reduce`.
- **a11y:** disparador `aria-haspopup`/`aria-expanded`/`aria-controls`; Enter/Space/ArrowDown abren
  y mueven el foco al primer enlace (teclado detectado vía `event.detail === 0`); flechas recorren,
  `Escape` cierra y devuelve el foco, click-fuera cierra.

### 4. Bottom Navigation (`bottom-navigation`)
- **Técnica:** barra inferior tipo app con ítems ícono+etiqueta e indicador activo; targets ≥ 44px.
- **a11y:** `<nav aria-label>`; ítems como `<a>`/`<button>` reales con `aria-current="page"`;
  activación nativa (sin manejo sintético de teclas); el indicador anima con `reduced-motion` que
  descarta el recorrido pero conserva la posición final.

### 5. Drawer Nav (`drawer-nav`)
- **Técnica:** cajón lateral acotado que desliza sobre un backdrop (distinto del overlay
  fullscreen `hamburger-menu-overlay`); el deslizamiento usa `translate` con su `transition-[translate]`.
- **a11y:** `role="dialog"` + `aria-modal="true"`; al abrir el foco cae en el primer focusable
  (botón cerrar); **Tab/Shift+Tab atrapados** ciclando dentro; `Escape` cierra y devuelve el foco al
  disparador; bloqueo de scroll del body; click en backdrop cierra.

### 6. Scrollspy Nav (`scrollspy-nav`) — `["adaptive"]`
- **Técnica:** nav de anclas que resalta la sección visible vía `IntersectionObserver` creado en un
  efecto con guarda y desconectado en el cleanup; `setActive` se llama desde el **callback** del
  observer (no síncrono en el efecto).
- **a11y:** enlaces reales `<a href="#seccion">`; `aria-current="true"` en el activo (peso + riel
  indicador, no color); el scroll suave respeta `prefers-reduced-motion` (consulta `matchMedia`
  guardada dentro del handler). **No usa íconos → no importa ni declara `lucide-react`.**

### 7. Menubar (`menubar`)
- **Técnica:** barra de menús de aplicación (Archivo/Editar/Ver) con submenús verticales,
  hand-rolled sobre el patrón WAI-ARIA menubar. Un submenú abierto a la vez.
- **a11y:** `role="menubar"` (`aria-orientation`) de `role="menuitem"` con `aria-haspopup`/
  `aria-expanded`; **una sola parada de tabulación** (roving tabindex); ArrowLeft/Right recorren
  arriba (con wrap, saltando deshabilitados), ArrowDown/Enter/Space abren en el primer ítem,
  Home/End a los extremos, ArrowLeft/Right dentro del submenú saltan al menú adyacente, `Escape`
  cierra y devuelve el foco al ítem superior; si todo está deshabilitado el foco cae en la
  superficie del menú (nunca se pierde).

### 8. Segmented Nav (`segmented-nav`)
- **Técnica:** control segmentado de selección única con **indicador deslizante medido** (técnica de
  `tubelight-navbar`: `offsetLeft`/`offsetWidth` → `translate`+`width` inline, `transition-[translate,width]`,
  bandera `data-armed` un commit después de la primera medición para que nunca entre desde la esquina).
- **a11y:** `role="tablist"` de `role="tab"` con `aria-selected`; roving tabindex (exactamente un
  segmento con `tabIndex 0`); flechas + Home/End mueven la selección y el foco. **No usa íconos → no
  declara `lucide-react`.** `reduced-motion` descarta el recorrido y el deslizador aterriza correcto.

### 9. Sidebar Nav Tree (`sidebar-nav-tree`)
- **Técnica:** árbol de navegación anidado estilo docs, renderizado recursivamente con `depth` para
  la sangría; ramas colapsables con animación de disclosure.
- **a11y:** `<nav aria-label>` con semántica real de listas (`ul`/`li`); cada rama es
  `<button aria-expanded aria-controls>`; hojas son `<a href>` con `aria-current="page"`, y la
  **ruta activa** se lee por ancestros expandidos + peso; el contenido de una rama colapsada queda
  `inert` (fuera del orden de tabulación); ArrowRight expande / ArrowLeft colapsa.
  **Deliberadamente NO usa `role="tree"`** — es navegación, no un widget de selección (eso es el
  `tree-view` de datos).

### 10. Back To Top (`back-to-top`)
- **Técnica:** botón flotante con anillo SVG de progreso de scroll (`stroke-dasharray`/`dashoffset`);
  un listener de scroll en efecto con guarda actualiza visibilidad y progreso desde el **callback**.
- **a11y:** `<button aria-label="Back to top">`; mientras está oculto es `inert` y sale del orden de
  tabulación (nunca una parada invisible); el anillo y la flecha son `aria-hidden` (decorativos);
  Enter/Space activan; el scroll suave degrada a salto instantáneo bajo `prefers-reduced-motion`
  (lectura de `matchMedia` guardada dentro del handler).

## Proceso (según restricciones de la ronda)

Proceso mínimo indicado: **sin verificación en navegador**, **sin pase de revisión adversarial ni
sub-agentes/workflow de review** (el orquestador audita), **sin TDD**, **sin git worktree**. La
**generación** se hizo con workflows de generación (un agente por componente, leyendo las
referencias en D: y reutilizando las recetas verbatim) — trabajo primario, no revisión. Durante el
desarrollo se usaron `npm run lint`/`typecheck` rápidos; **un solo `npm run check`** completo al cierre.

### Interrupción por límite de sesión (y recuperación)
La primera tanda de generación completó 5/10 y otros 5 agentes cayeron por el límite de sesión. Al
reanudar, la inspección en disco mostró que **`scrollspy-nav` sí había escrito sus 3 archivos**
(falló solo en el paso de retorno) y que `menubar` y `back-to-top` tenían su `ui` **completo**
(cierre y `export` correctos) faltándoles preview+entry. Se lanzó un segundo workflow de
completado: 2 agentes en modo "solo preview+entry" (leyendo el `ui` existente para clavar props y
el cierre de dependencias, sin tocarlo) y 2 en modo completo (`segmented-nav`, `sidebar-nav-tree`).
No se perdió ni se regeneró trabajo válido.

### Verificación previa al gate
Se comprobó mecánicamente el **cierre de dependencias** de los 10 contra la regla real de
`verify-registry` (closure transitivo que sigue `@/lib/cn` hacia `clsx`+`tailwind-merge`; estricto
en ambos sentidos, así que declarar de más también falla). `scrollspy-nav` y `segmented-nav` no
importan íconos y correctamente **no** declaran `lucide-react`; los otros ocho sí lo importan y lo
declaran. Ningún componente importa ni declara `motion`.

## Nota de entorno (árbol compartido con Codex)

`D:\morphiq-ui` es un working tree compartido; `gen-registry` descubre todas las `entries/*.ts` en
disco. Durante la ronda el `HEAD` compartido apareció en `main` y en ramas de Codex; en cada
gate/commit se imprimió la rama y se volvió a `feat/navigation-batch2`. Los 10 componentes de
Backgrounds de Codex estaban **committeados en su rama**, así que el `checkout` los sacó limpiamente
del árbol y el conteo quedó exacto en `main(165)+10 = 175` sin necesidad de apartar untracked.
Además, un `npm ci` **concurrente** de Codex vació `node_modules` a mitad de ronda; se esperó a que
completara (monitor en segundo plano) en vez de lanzar una instalación en paralelo que habría
corrompido ambas. `git add` fue **solo** de mis 31 archivos explícitos (nunca `-A`); no se tocó
`docs/CREDITS.md`, `schema.ts`, `verify-registry`, `package.json` ni ningún `ui/*` existente.
