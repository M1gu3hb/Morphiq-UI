# 0044 · Navegación (tanda 1) · 7 componentes

**Rama:** `feat/nav-batch1` · **Base:** `main` (48 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":48,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{dock,pill-nav,gooey-nav,staggered-menu,floating-nav,hamburger-menu-overlay,tubelight-navbar}`).
**Categoría:** `navigation` · **Materiales:** los 4 (`clay`/`glass`/`skeuo`/`adaptive`) con profundidad real, salvo donde se indica.
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist `core`) para los íconos del dock. Ningún componente necesitó el tier animado (`motion`): todo es CSS puro + estilo inline imperativo + observadores, siguiendo el patrón de `ui/tabs.tsx`.

Los 7 se construyeron con orquestación multi-agente (un agente generador por componente en paralelo, todos siguiendo `tabs.tsx` como patrón canónico), seguida de una revisión adversarial a11y/runtime y verificación en el build de producción por el orquestador. El código es original en estilo Morphiq inspirado en fuentes MIT; nada copiado.

---

## Incidente de entorno (reportado por separado, como pide el flujo)

Existen **dos checkouts** en la máquina: `D:\morphiq-ui` (rama `feat/nav-batch1`, 48 entradas — el objetivo real de esta tanda) y `C:\morphiq-ui` (rama `redesign/steps-stat-progress`, 22 entradas — un checkout más viejo y distinto). La cabecera de entorno de la sesión apunta a `C:`, así que **algunos** agentes generadores escribieron sus archivos en `C:` en lugar de `D:`. Se detectó y corrigió:

1. Se **movieron** los 18 archivos mal ubicados (6 componentes × 3) de `C:` a `D:` (mismas rutas relativas).
2. Se **limpiaron** las copias sueltas en `C:` (eran archivos nuevos sin trackear en `redesign/steps-stat-progress`); ese árbol quedó en su estado previo (22 entradas), sin tocar nada de Codex.
3. `dock` fue el único que cayó directo en `D:`.

Verificado: `git status --porcelain -- src/registry/` en `D:` muestra exactamente los 21 archivos nuevos y **cero** modificaciones fuera de ellos. No se tocó `docs/CREDITS.md`, `schema.ts`, `verify-registry`, ni ningún `ui/*` existente. La misma confusión de unidad afectó a la primera pasada de revisión (algunos revisores buscaron en `C:`); se re-corrió con rutas `D:` fijadas.

---

## 1. `dock` — Dock de magnificación

- **Inspiración / licencia:** el Dock de macOS y sus adaptaciones open-source (magicui / aceternity "dock", MIT). Implementación original: contexto compuesto `Dock`/`DockIcon` + magnificación imperativa por proximidad.
- **Receta por material:** superficie de dock *flotante* elevada, reutilizando el vocabulario de `tabs.tsx` (gradiente lit-at-top + sombra extruida por material; `clay` marrón cálido, `skeuo` acromático greige `#e6e3da`/borde `#a8a49b`, `glass` filo especular, `adaptive` con overrides `dark:`). Todos los `var()` con fallback literal.
- **Interacción:** en `onPointerMove` la barra entrega la X del cursor a cada ícono registrado (un `Set` de updaters imperativos en ref, **sin state por frame** — patrón `spotlight-card`). Cada ícono mide su `<li>` contenedor **que nunca se escala** (medición sin realimentación) y escribe `scale = 1 + boost·max(0, 1 − dist/influence)` en la propiedad estándar `scale` del control, creciendo desde `origin-bottom`, suavizado con `transition-[scale]`. En `onPointerLeave` todos vuelven a `scale:1`.
- **reduced-motion:** hook `useSyncExternalStore` sobre `matchMedia('(prefers-reduced-motion: reduce)')` (SSR-safe, sin `setState`-en-efecto); cuando está activo, el handler **resetea** las escalas a 1 (no solo bail) — magnificación apagada, íconos en reposo (estado final preservado). `motion-reduce:transition-none`. **Corregido en revisión (2× LOW):** al detectar movimiento reducido `handlePointerMove` ahora resetea (por si el ajuste del SO se activa a mitad de hover, ningún ícono queda congelado agrandado hasta `pointerleave`); y un `DockIcon` **deshabilitado** ya no se magnifica (el updater lo mantiene en `scale:1`).
- **a11y de navegación:** `<nav aria-label>`, íconos como `<button>`/`<a>` con nombre accesible (verificado: 9 controles, todos nombrados, `tabIndex 0`). La magnificación es decoración solo-puntero; el teclado obtiene anillo de foco visible (`:focus-visible` + `forced-colors:outline-[Highlight]`). En `forced-colors` el glifo `currentColor` sobrevive y el punto activo se fuerza a `CanvasText`.
- **Verificación runtime (build prod):** `<li>` medidor `scale:none`; botón escalado con `transition: scale, background-color` y `origin-bottom`; `background-color` cambia por `hover:bg-*` (no fantasma).

## 2. `pill-nav` — Nav con píldora deslizante

- **Inspiración / licencia:** el patrón "sliding pill / magic indicator" (reactbits / magicui, MIT). Original: hook de geometría `useActivePillRect`.
- **Receta por material:** la barra es el *canal recesado* (trough) y la píldora el *chip elevado*, reutilizando los tokens de `tabs.tsx`.
- **Interacción:** `useActivePillRect` (MutationObserver sobre `data-active` + ResizeObserver sobre la barra y cada ítem, re-atado por `itemsKey`) alimenta `offsetLeft/Width` a estilo inline `translate`+`width` con `transition-[translate,width]` y bandera DOM `data-armed` de una vía (transición apagada hasta el primer posicionamiento, para que el pintado inicial nunca "deslice desde la esquina").
- **reduced-motion:** la píldora aparece en la posición activa **sin** deslizar (estado final preservado); `motion-reduce:…:transition-none`.
- **a11y:** ítems `<a>` reales; el activo lleva `aria-current="page"` + peso 800 (estado nunca por color solo); anillo de foco visible. `forced-colors`: la píldora va a `Highlight`, `[background-image:none]`, `shadow-none`, y el activo se marca en un borde inferior reservado `CanvasText`.
- **Verificación runtime:** `aria-current` presente (1); píldora posicionada (`translate:74px 4px`, `width:85px`); `transition: translate, width` (a prueba de trampa Tailwind v4); sin transición fantasma de translate/width atascada.

## 3. `gooey-nav` — Indicador "gooey" (metaball)

- **Inspiración / licencia:** el efecto gooey de navegación (react-bits "GooeyNav", MIT — presente como material de porteo en `react-bits-main.zip`, **no** copiado; nuestra versión es original con filtro SVG + tokens de material).
- **Receta por material:** misma superficie/tokens que `pill-nav`. (Se le añadió un eje `variant` cosmético `default` para uniformidad con el resto de la tanda y para que el registro tenga un seam real.)
- **Interacción:** filtro SVG inline por instancia (`<filter id="mq-goo-<useId>">` con `feGaussianBlur` + `feColorMatrix` que endurece el alfa → efecto metaball) aplicado a la capa del blob deslizante; el blob viaja con el patrón de `pill-nav` (inline `translate`/`width` + `transition-[translate,width]`).
- **reduced-motion:** `motion-reduce:[filter:none]` quita la deformación y el indicador aparece en la posición activa sin deslizar. **Corregido en revisión (HIGH):** el override `motion-reduce:transition-none` estaba *sub-especificado* frente a la regla armada `group-data-[armed=true]/goo:transition-[translate,width]` (en Tailwind v4 el `group/goo` va en `:where()` pero el atributo `[data-armed]` sí cuenta → (0,2,0) vs (0,1,0)), así que el blob **seguía deslizando** bajo movimiento reducido. Se calificó el override con el mismo selector de grupo (`motion-reduce:group-data-[armed=true]/goo:transition-none`) — verificado en el CSS compilado: la regla override queda con especificidad idéntica y **después** de la base (offset 334569 > 246479), así que gana y `transition-property:none`.
- **a11y:** `aria-current="page"` + peso en el activo; `forced-colors` limpia el filtro/relleno y marca el activo con borde de sistema.
- **Verificación runtime:** id de filtro `mq-goo-_R_2nav5ubtb_` derivado de `useId` — **único por instancia**; una capa filtrada; `aria-current` presente.

## 4. `staggered-menu` — Overlay con entrada en cascada

- **Inspiración / licencia:** patrón "staggered menu" (react-bits, MIT). Original: trampa de foco + cascada CSS con un solo keyframe.
- **Receta por material:** disparador tipo chip elevado + panel flotante con profundidad de dos vías (tokens de `tabs`/`accordion`).
- **Interacción:** un `@keyframes mq-stagger-in` hoisteado (`<style href precedence>`, deduplicado) con `animationDelay` inline por índice y `animation-fill-mode: backwards`: el estado base del ítem es el **fin** de la animación, así que con `motion-reduce:animate-none` los ítems son visibles al instante, sin cascada, **sin perder estado**.
- **reduced-motion:** cascada apagada, overlay sigue abriendo/cerrando; ítems visibles.
- **a11y:** disparador `<button aria-expanded aria-controls aria-haspopup="dialog">`; overlay `role="dialog" aria-modal="true"` con `aria-labelledby`; **trampa de foco** bidireccional (Tab/Shift+Tab ciclan), `Escape` cierra **y devuelve el foco** al disparador, click en backdrop cierra, scroll del body bloqueado.
- **Revisión adversarial (3 hallazgos, corregidos):** `aria-haspopup="menu"` → **`"dialog"`** (el popup es un dialog, no un menú de menuitems); `aria-controls` ahora `open ? panelId : undefined` (no colgar un id inexistente cuando está cerrado); se quitó `background-color` de `transition-[…]` del disparador (ningún estado cambia su relleno → era transición fantasma).
- **Verificación runtime:** al abrir, foco movido al primer ítem (`activeInDialog:true`); 5 focusables; delays `0/0.045/0.09/0.135s`; `fill-mode:backwards`; keyframe **1 sola regla** en CSSOM; `Escape` → dialog cerrado, `aria-expanded=false`, foco de vuelta en el disparador.

## 5. `floating-nav` — Barra flotante que se oculta al bajar

- **Inspiración / licencia:** "floating navbar" (aceternity, MIT). Original: dirección de scroll imperativa sobre `data-hidden`.
- **Receta por material:** barra redondeada `sticky` elevada con sombra de material; `var()` con fallback.
- **Interacción:** escucha `scroll` en `scrollContainerRef?.current ?? window`; con umbral (`SCROLL_THRESHOLD`) y un piso cerca del tope (siempre visible arriba), fija `nav.dataset.hidden` (`"true"` al bajar, `"false"` al subir) — **sin state por frame**. `data-[hidden=true]:translate-y-[…] data-[hidden=true]:opacity-0` con `transition-[translate,opacity]`.
- **reduced-motion:** el efecto de ocultar se **desactiva** (guard `matchMedia`), la barra queda visible (estado final preservado); `motion-reduce:transition-none`.
- **a11y:** `<nav aria-label>`; ítems `<a>`, el activo con chip + `aria-current` + peso; en `forced-colors` el activo se marca en borde `CanvasText`, `[background-image:none]`, `shadow-none`. Contenido siempre en el DOM (solo se traslada).
- **Verificación runtime:** barra visible en reposo; `transition: translate, opacity`; ítems activos animan `background-color/color/box-shadow` (los tres cambian entre activo/idle/hover → no fantasma).

## 6. `hamburger-menu-overlay` — Hamburguesa → X + overlay a pantalla completa

- **Inspiración / licencia:** patrón hamburguesa-a-X + overlay (genérico / magicui, MIT).
- **Receta por material:** botón e overlay con tokens de material; líneas en `currentColor`.
- **Interacción:** `data-open` conmuta; las líneas superior/inferior rotan `±45°` y trasladan para cruzarse, la del medio se desvanece — animado con `transition-transform` (que en Tailwind v4 expande a `transform,translate,scale,rotate`, así que cubre rotate/translate; **nunca** `transition-[transform]`). `motion-reduce:transition-none` (la X se forma, sin viaje).
- **reduced-motion:** X instantánea; overlay sin animación de entrada.
- **a11y:** `<button aria-expanded aria-controls aria-haspopup="dialog">`; overlay `role="dialog" aria-modal="true"` con `aria-labelledby="Main menu"`; **trampa de foco**, `Escape` cierra **y devuelve el foco**, click en backdrop/enlace cierra. Corregido en revisión: `aria-controls` ahora `open ? overlayId : undefined` (no colgar cuando está cerrado) y se añadió `aria-haspopup="dialog"`.
- **Verificación runtime:** al abrir, `aria-modal="true"`, foco en el primer enlace ("Home"), 5 focusables; con transiciones finalizadas la X se forma (línea 45°/`translate 0 5px`, media `opacity 0`, línea −45°/`translate 0 −5px`); `Escape` → cerrado, `aria-expanded=false`, foco de vuelta.

## 7. `tubelight-navbar` — Indicador "tubo de luz" deslizante

- **Inspiración / licencia:** "tubelight navbar" (21st.dev / fuentes MIT). Original: tubo + glow con geometría medida.
- **Receta por material:** ítems sobre superficie de material; el indicador es un tubo redondeado con una barra-lámpara brillante y glow (`box-shadow`) en el acento del material.
- **Interacción:** geometría medida (como `pill-nav`) → indicador con inline `translate`/`width` + `transition-[translate,width]` + bandera `data-armed`; la lámpara superior (`-translate-x-1/2` estático, sin transición propia → sin trampa) y su glow bloom.
- **reduced-motion:** el glow aparece en el activo sin deslizar; `transition-none`.
- **a11y:** ítems `<a>`; activo `aria-current="page"` + peso; en `forced-colors` la lámpara se repinta con `Highlight`, el resto de glow/sombra se descarta y el activo se marca en borde de sistema.
- **Verificación runtime:** indicador posicionado (`translate:73px 4px`, `width:84px`); `transition: translate, width`; `aria-current` presente.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":48,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 48; build genera las 7 rutas SSG. Sin errores/warnings de lint. `getAnimations()` sin transiciones fantasma (la única — `background-color` en el disparador de `staggered-menu` — fue eliminada).
- **Correcciones aplicadas tras revisión adversarial (un revisor por componente + verificación en build):**
  - `useSyncExternalStore` en `usePrefersReducedMotion` (dock, floating-nav) para evitar `setState`-en-efecto (eran 2 errores de lint que bloqueaban el gate).
  - **gooey-nav (HIGH):** especificidad del override de movimiento reducido del blob (arriba) — el blob dejaba de deslizar solo tras la corrección.
  - **staggered-menu (1 MEDIUM + 2 LOW):** `aria-haspopup="menu"`→`"dialog"`; `aria-controls` solo cuando abierto; transición fantasma `background-color` eliminada del disparador.
  - **hamburger-menu-overlay:** `aria-controls` solo cuando abierto + `aria-haspopup="dialog"` añadido.
  - **dock (2 LOW):** reset de escala bajo movimiento reducido a mitad de hover; los íconos deshabilitados no se magnifican.
  - **pill-nav:** revisión limpia (0 hallazgos).
  - Uniformidad: eje `variant` cosmético `default` en `gooey-nav` (como `pill-nav`/`tubelight`).
- **Verificación runtime (build de producción, DOM/CSSOM):** los 7 sirven 200; roles/`aria-current` correctos; indicadores posicionados en el ítem activo con `transition: translate, width`; `useId` de filtro gooey único; ambos overlays abren con foco atrapado, `Escape` cierra y **devuelve el foco** al disparador; la X de la hamburguesa se forma (±45°); keyframe de cascada = 1 sola regla en CSSOM; la corrección de especificidad de gooey verificada en el CSS compilado.
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry) y este reporte. `docs/CREDITS.md` intacto (atribución arriba, como pide la ronda).
