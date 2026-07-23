# Reporte 0053 — Efectos, tanda 2

- **Autor:** Codex
- **Fecha:** 2026-07-22
- **Rama:** `feat/effects-batch2` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar siete efectos originales, self-contained, accesibles y estables bajo movimiento reducido y colores forzados, sin modificar infraestructura ni componentes existentes.

## Objetivo

Expandir el registry autoensamblado de 111 a 118 componentes con Ripple Effect, Confetti,
Noise Overlay, Spotlight, Scratch to Reveal, Pulse Ring y Animated List. Los siete debían usar
`category: "effects"`, un único material `adaptive`, mantener el contenido legible e interactivo y
exponer una API clara para las interacciones disparables.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `ripple-effect`
- `confetti`
- `noise-overlay`
- `spotlight`
- `scratch-to-reveal`
- `pulse-ring`
- `animated-list`

Cada entry declara `materials: ["adaptive"]`, variantes y tamaños cubiertos por su preview, textos
bilingües, notas de accesibilidad reales y un manifiesto fiel de dependencias. Todos usan React,
CVA y CSS/SVG local; ninguno necesita `motion`. Los previews de efectos amplios o disparables
quedan contenidos en superficies `relative` con `overflow-hidden`.

## Cómo se hizo

### 1. Ripple Effect

- **Inspiración/licencia:** ripples de interacción de Magic UI y Animata (MIT), reescritos desde
  cero con geometría, tiempos y API originales.
- **Técnica:** `pointerdown` calcula coordenadas locales, monta una onda radial y
  `onAnimationEnd` la elimina. El estado se limita a seis ondas; `trigger` permite reproducir una
  onda centrada desde fuera.
- **Contenido y acceso:** la capa es `aria-hidden` y `pointer-events:none`; los children conservan
  eventos, teclado y foco visible.
- **Reduced-motion:** sustituye el barrido de 620 ms por `mq-ripple-highlight`, un realce breve de
  160 ms. Forced-colors suprime la capa decorativa.

### 2. Confetti

- **Inspiración/licencia:** ráfagas de celebración de Magic UI (MIT), con distribución
  determinista y receta CSS originales.
- **Técnica:** `trigger` vuelve a identificar una tanda de partículas y reinicia los keyframes. La
  cantidad configurable se acota a 8–36 nodos; el preview usa 24. Cada pieza termina en opacidad
  cero y nunca crece el DOM entre disparos.
- **Contenido y acceso:** el campo completo es `aria-hidden`, no recibe puntero y se pinta detrás
  de los children; el botón de demo sigue siendo un botón nativo.
- **Reduced-motion:** oculta la celebración completa, pero deja intacto el resultado y el foco.

### 3. Noise Overlay

- **Inspiración/licencia:** overlays de grano de interfaces editoriales MIT, reinterpretados como
  un efecto Morphiq sin assets externos.
- **Técnica:** una sola capa usa un SVG `feTurbulence` embebido en data URI. `opacity` se acota a
  0–0.32 y las variantes `fine`/`coarse` cambian escala y mezcla sin crear nodos extra.
- **Contenido y acceso:** la textura es `aria-hidden`, pointer-transparent y queda encima del
  fondo pero debajo del contenido interactivo.
- **Reduced-motion:** no hay animación que detener; forced-colors elimina el grano.

### 4. Spotlight

- **Inspiración/licencia:** spotlights interactivos de Magic UI/Animata (MIT), implementados con
  eventos y gradiente originales y separados del `glow-effect` ambiental existente.
- **Técnica:** el puntero actualiza `--mq-x`/`--mq-y` directamente sobre el nodo; un gradiente
  radial revela una zona localizada. No usa `setState`, RAF ni una librería de motion.
- **Contenido y acceso:** el gradiente es `aria-hidden` y no intercepta eventos. El contenedor
  conserva `focus-within` para navegación por teclado.
- **Reduced-motion:** deja el foco centrado y estable; al salir del panel también vuelve a 50/50.
  Forced-colors limpia el efecto.

### 5. Scratch to Reveal

- **Inspiración/licencia:** tarjetas scratch/reveal de demos MIT, reconstruidas con SVG y una API
  controlada/no controlada original.
- **Técnica:** una máscara SVG recibe puntos durante pointer capture; conserva como máximo 80 y
  descarta muestras demasiado cercanas. `revealed`, `defaultRevealed` y `onReveal` permiten
  control externo.
- **Contenido y acceso:** el contenido real permanece en el DOM y en el árbol accesible desde el
  inicio. Un botón nativo “Reveal all” ofrece fallback completo de teclado; enfocar un control
  cubierto también revela la superficie. El estado se anuncia con `aria-live="polite"`.
- **Reduced-motion:** revelar cambia directamente al estado final; forced-colors elimina la
  cubierta y deja `Canvas`/`CanvasText`.

### 6. Pulse Ring

- **Inspiración/licencia:** indicadores live/recording de Magic UI (MIT), con composición y
  temporización propias.
- **Técnica:** tres anillos acotados animan únicamente `scale` y `opacity`, con desfase de 780 ms.
  El elemento focal permanece en una capa estable.
- **Contenido y acceso:** `role="status"` y `statusLabel` hacen explícito “Live” o “Recording”; el
  significado nunca depende solo del pulso o del color.
- **Reduced-motion:** los anillos quedan estáticos y tenues; forced-colors conserva un borde de
  sistema visible.

### 7. Animated List

- **Inspiración/licencia:** listas escalonadas de Magic UI y Animata (MIT), con API y keyframes
  originales.
- **Técnica:** mantiene `<ul>/<li>` reales, aplica delays deterministas según el índice y permite
  volver a reproducir mediante `animationKey`. Las variantes `slide`/`fade` y el `stagger`
  configurable no alteran el orden de datos.
- **Contenido y acceso:** no duplica ítems ni cambia el árbol semántico; todos los controles de
  cada fila permanecen interactivos.
- **Reduced-motion:** muestra todos los ítems inmediatamente en su posición final; forced-colors
  elimina animación y restaura superficie y bordes del sistema.

## Self-containment, rendimiento y contraste

Cada UI declara sus tokens `--mq-*` localmente y toda lectura `var()` lleva fallback literal. No
hay referencias a `:root`, globals.css ni clases del chrome del sitio. Las capas decorativas usan
`aria-hidden` y `pointer-events:none`; el contenido vive en una capa independiente. Los límites
explícitos son seis ondas simultáneas, 36 partículas de confetti y 80 puntos de scratch.

Contraste WCAG medido con luminancia relativa sRGB:

| Contexto | Texto / fondo | Ratio |
|---|---|---:|
| Superficie base | `#f5f7ff` / `#11131a` | 17.34:1 |
| Spotlight | `#f5f7ff` / `#0d1018` | 17.77:1 |
| Animated List | `#f5f7ff` / `#1a1d27` | 15.72:1 |
| Pulse Ring live | `#f5f7ff` / `#14532d` | 8.52:1 |
| Pulse Ring recording | `#f5f7ff` / `#881337` | 8.94:1 |
| Scratch silver, instrucción | `#11131a` / `#7b8190` | 4.76:1 |
| Scratch violet, instrucción | `#ddd6fe` / `#62558d` | 4.72:1 |
| Foco | `#a8ff78` / `#11131a` | 15.23:1 |

La primera medición de la instrucción plateada dio 2.79:1 (`#d7dae2` / `#7b8190`). Se cambió la
tinta local a `#11131a` sin alterar el resto del diseño y se volvió a medir en 4.76:1.

## Verificación de navegador y animaciones

Se levantó el build de producción y se recorrieron las siete rutas con Chromium del sistema
(canal Edge) a 390×844 y 1280×900. Resultado: 14/14 navegaciones HTTP 200, `h1` y preview visibles,
cero `console.error`, cero `pageerror` y cero overflow horizontal.

`getAnimations({ subtree: true })` y las interacciones reales devolvieron solo movimiento
intencional:

| Componente | Conteo observado | Animación / transición |
|---|---:|---|
| Ripple Effect, tras click | 1 | `CSSAnimation: mq-ripple-effect`; el nodo pasó de 1 a 0 tras 850 ms |
| Confetti, tras disparar | 24 | `CSSAnimation: mq-confetti` |
| Noise Overlay | 0 | estático |
| Spotlight | 0 | actualiza custom properties; se verificó puntero → 50/50 al salir |
| Scratch to Reveal | 1 | `CSSTransition: opacity` al revelar |
| Pulse Ring | 3 | `CSSAnimation: mq-pulse-ring` |
| Animated List, tras replay | 3 | `CSSAnimation: mq-animated-list` |

El gesto real de scratch creó nueve círculos en la máscara y el contenido `MORPHIQ25` ya estaba
presente antes de revelar. El botón cambió `data-revealed` a `true`. En reposo con
`prefers-reduced-motion: reduce`, los siete subárboles devolvieron cero animaciones; el click de
Ripple emitió específicamente `animationstart: mq-ripple-highlight` y terminó antes de la
consulta posterior. Con `forced-colors: active` y movimiento reducido, los siete previews
quedaron visibles, sin animaciones y con `CanvasText`/`Canvas` del sistema.

## Resultado esperado vs. real

Se esperaban 118 componentes y siete rutas SSG nuevas. El resultado coincide: el registry reporta
118 entradas con self-containment y guards en verde, y Next genera 125/125 páginas estáticas. Los
siete componentes funcionan sin errores de runtime, overflow ni dependencias animadas.

## Bugs / obstáculos y cómo se resolvieron

- **Confetti y lint de React 19:** una primera versión sincronizaba estado dentro de un efecto para
  responder a `trigger`. Se eliminó el efecto; ahora las piezas se derivan directamente del trigger
  estable, sin render adicional ni temporizador.
- **Tipo de foco en Scratch:** comparar directamente destinos de eventos de tipos incompatibles
  fallaba en TypeScript. Se sustituyó por detección semántica con `closest()` sobre el marcador del
  botón de fallback.
- **Aserción de navegador demasiado específica:** el primer chequeo buscaba un copy que no usa el
  preview. Se inspeccionó el DOM real y se validó el contenido final `MORPHIQ25`, presente antes de
  retirar la máscara.
- **Realce reducido demasiado breve para muestreo:** `getAnimations()` corría después de los 160 ms
  del highlight. Un listener instalado antes del evento capturó `mq-ripple-highlight`, probando la
  ruta reducida sin depender del reloj.

## Verificación (gate)

- Prueba de aceptación RED — 21 archivos ausentes y 111/118 entradas antes de implementar.
- Prueba de aceptación GREEN — 21/21 archivos presentes y 118/118 entradas.
- `npm run lint` — verde, sin warnings.
- `npm run typecheck` — verde; route types y `tsc --noEmit`.
- `npm run test:studio` — verde (`status: "ok"`).
- `npm run test:registry` — `{"components":118,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — verde; 125/125 páginas, incluidas las siete fichas nuevas.
- `npm run check` — verde integral sobre `feat/effects-batch2`.

## Riesgos, deuda y pendientes

- Confetti y Scratch usan nodos DOM/SVG acotados. Montar muchas instancias simultáneas todavía
  puede aumentar paint cost; los límites 36/80 contienen el riesgo y una medición futura puede
  fijar un presupuesto por dispositivo.
- Spotlight escribe dos custom properties por movimiento de puntero sin provocar renders de
  React. Si se usa en superficies muy grandes, conviene medir antes de agregar throttling.
- `npm audit --audit-level=high` conserva tres avisos heredados del lockfile: PostCSS moderado,
  Next alto y `sharp` alto. npm propone `next@16.2.11`, fuera del rango actual; no se modificaron
  dependencias compartidas por el guardarraíl.
- No se añadió atribución a `docs/CREDITS.md` por guardarraíl; la inspiración y licencia quedan
  registradas por componente en este reporte.

## Estado final

Completo.
