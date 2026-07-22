# Reporte 0051 — Fondos, tanda 2

- **Autor:** Codex
- **Fecha:** 2026-07-22
- **Rama:** `feat/backgrounds-batch2` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar siete fondos full-bleed originales, ligeros, self-contained y accesibles, sin modificar infraestructura ni componentes existentes.

## Objetivo

Expandir el registry autoensamblado de 97 a 104 componentes con Ripple Background, Animated
Gradient, Flickering Grid, Wavy Background, Particles, Interactive Grid y Hexagon Pattern. Todos
debían usar un único estilo `adaptive`, CSS/React puro, contenido independiente del adorno y una
salida estable bajo movimiento reducido y colores forzados.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `ripple-background`
- `animated-gradient`
- `flickering-grid`
- `wavy-background`
- `particles`
- `interactive-grid`
- `hexagon-pattern`

Cada entry usa `category: "backgrounds"`, `materials: ["adaptive"]`, variantes y tamaños cubiertos
por su preview, texto bilingüe y un manifiesto fiel de dependencias. Los siete usan React, CVA y
CSS local; ninguno importa `motion`. Los previews quedan acotados por el propio contenedor
`relative isolate overflow-hidden` y un ancho máximo de 420 px. Se añadió únicamente este reporte
fuera de sus tríos.

## Cómo se hizo

### 1. Ripple Background

- **Inspiración/licencia:** fondos ripple de Magic UI y Animata (MIT), reinterpretados con
  composición, tiempos y API originales en estilo Morphiq; no se copió código.
- **Técnica CSS:** cuatro anillos concéntricos animan las propiedades independientes `scale` y
  `opacity` con retrasos de 1.2 s. Solo existen cuatro nodos decorativos.
- **Contenido legible:** los anillos son `aria-hidden` y van bajo una capa de children separada. El
  texto usa un par base de alto contraste que no depende del color del anillo.
- **Reduced-motion/forced-colors:** movimiento reducido cancela los cuatro keyframes y deja
  anillos tenues estáticos; colores forzados los oculta y restaura Canvas/CanvasText.

### 2. Animated Gradient

- **Inspiración/licencia:** mallas cromáticas de Magic UI (MIT), reescritas desde cero y
  deliberadamente distintas de Aurora Background.
- **Técnica CSS:** tres gradientes radiales nítidos animan `background-position` y un
  `hue-rotate()` de solo 16 grados; no se usa una hoja desenfocada tipo aurora.
- **Contenido legible:** una capa uniforme `rgba(3,7,18,.64)` se interpone entre la malla y el
  contenido. Aun suponiendo blanco puro detrás, blanco frontal conserva 6.28:1.
- **Reduced-motion/forced-colors:** reduced-motion congela posición y tono; forced-colors elimina
  gradiente y scrim y usa colores de sistema.

### 3. Flickering Grid

- **Inspiración/licencia:** flickering grids de Magic UI (MIT), con campo, delays y API originales.
- **Técnica CSS:** 36 celdas en `subtle` o 48 en `dense`; delays y duraciones se derivan del índice,
  por lo que SSR e hidratación son deterministas. No existe `Math.random()` ni un nodo por píxel.
- **Contenido legible:** la matriz completa pertenece a un único wrapper `aria-hidden`; el preview
  muestra su texto sobre una superficie oscura opaca elevada.
- **Reduced-motion/forced-colors:** reduced-motion elimina los 36/48 keyframes y fija una opacidad
  baja; forced-colors oculta toda la matriz.

### 4. Wavy Background

- **Inspiración/licencia:** fondos ondulados de Animata/Magic UI (MIT), recreados con geometría
  propia.
- **Técnica CSS/SVG:** tres paths sinusoidales amplios derivan mediante la propiedad `translate`,
  cada uno con velocidad y fase distintas. El SVG usa `preserveAspectRatio="xMidYMid slice"` y no
  depende de canvas, WebGL ni IDs globales.
- **Contenido legible:** el SVG es `aria-hidden`, no recibe puntero y queda detrás de una superficie
  de contenido estable.
- **Reduced-motion/forced-colors:** reduced-motion detiene los tres paths en la posición authored;
  forced-colors oculta el SVG completo.

### 5. Particles

- **Inspiración/licencia:** campos de partículas de Magic UI (MIT), con distribución y movimiento
  originales escritos en CSS.
- **Técnica CSS:** puntos deterministas animan `translate` y `opacity`; `count` es configurable
  pero se limita a 4–40 nodos, y `speed` se acota desde 0.4. El preview usa 22.
- **Contenido legible:** todo el campo es un wrapper `aria-hidden` y pointer-transparent; los
  children conservan su propia capa y la base nocturna aporta 18.10:1.
- **Reduced-motion/forced-colors:** reduced-motion congela los puntos con opacidad suave;
  forced-colors los elimina.

### 6. Interactive Grid

- **Inspiración/licencia:** rejillas interactivas de Magic UI/Animata (MIT), implementadas con una
  máscara y eventos originales.
- **Técnica CSS/React:** una capa base y otra brillante usan dos pares de `linear-gradient`; el
  puntero actualiza solo `--mq-x/--mq-y` y una máscara radial revela las líneas próximas. No existe
  un nodo por celda ni re-render de React por movimiento.
- **Contenido legible:** ambas capas son `aria-hidden` y pointer-transparent; los eventos burbujean
  sin bloquear controles hijos. El preview añade una superficie frontal opaca.
- **Reduced-motion/forced-colors:** sin cursor comienza centrado; al salir vuelve a 50/50.
  Reduced-motion sustituye el seguimiento por un halo centrado fijo y forced-colors limpia todas
  las capas.

### 7. Hexagon Pattern

- **Inspiración/licencia:** patrones geométricos de Magic UI/Animata (MIT), reconstruidos con una
  receta CSS propia.
- **Técnica CSS:** cinco `linear-gradient` repetidos forman el teselado completo en una sola capa;
  `faded` aplica una máscara radial opcional. No hay SVG, IDs ni nodos repetidos.
- **Contenido legible:** la capa es `aria-hidden`; las líneas usan baja opacidad sobre una base cuyo
  texto conserva 16.21:1 en claro y 16.69:1 en oscuro.
- **Reduced-motion/forced-colors:** es estático, por lo que no necesita animación que detener;
  forced-colors elimina el patrón y preserva los children.

## Self-containment, rendimiento y contraste

Cada UI declara sus tokens `--mq-*` localmente y toda lectura `var()` lleva fallback literal. No
hay referencias a `:root`, globals.css ni clases de chrome. Los efectos están contenidos por
`overflow-hidden`, son `aria-hidden` y se pintan debajo de los children. El mayor campo posible es
Particles con 40 puntos; Flickering Grid llega a 48 celdas, Ripple usa 4 nodos, Wavy 3 paths,
Interactive Grid 3 capas, Animated Gradient 2 capas y Hexagon una.

Contraste WCAG medido con luminancia relativa sRGB:

| Contexto | Texto / fondo | Ratio |
|---|---|---:|
| Base clara | `#171817` / `#f7f4ed` | 16.21:1 |
| Base oscura | `#f4f2eb` / `#10121a` | 16.69:1 |
| Base nocturna | `#f8fafc` / `#0b1020` | 18.10:1 |
| Peor caso de malla tras scrim | `#ffffff` / `#5e6067` | 6.28:1 |

El último par modela el caso conservador de una zona blanca de gradiente bajo el scrim uniforme;
aun así supera 4.5:1. Los previews de Flickering Grid, Wavy, Particles e Interactive Grid añaden
una superficie frontal propia, de modo que el copy nunca depende del adorno.

## Verificación de navegador y animaciones

Se levantó el build de producción y se recorrieron las siete rutas con Chromium del sistema
(canal Edge) a 390×900 y 1280×900. Resultado: 14/14 navegaciones HTTP 200, un `h1` y preview visible
por ficha, cero `console.error`, cero `pageerror` y `scrollWidth === clientWidth` en todos los casos.

`getAnimations({ subtree: true })` devolvió únicamente los keyframes intencionales:

| Componente | Conteo | Animación observada |
|---|---:|---|
| Ripple Background | 4 | `CSSAnimation: mq-ripple-background` |
| Animated Gradient | 1 | `CSSAnimation: mq-animated-gradient` |
| Flickering Grid (`subtle`) | 36 | `CSSAnimation: mq-flickering-grid` |
| Wavy Background | 3 | `CSSAnimation: mq-wavy-background` |
| Particles (preview) | 22 | `CSSAnimation: mq-particles` |
| Interactive Grid | 0 | ninguna; actualiza custom properties |
| Hexagon Pattern | 0 | ninguna; patrón estático |

Con `prefers-reduced-motion: reduce`, los siete subárboles devolvieron cero animaciones y
mantuvieron todo el texto. Con `forced-colors: active`, los siete devolvieron cero animaciones,
`CanvasText` negro y `Canvas` blanco del sistema. En Interactive Grid se verificó la secuencia real
`50%/50% → 20%/30% → 50%/50%` al mover el puntero dentro y luego fuera; siguió con cero
animaciones CSS.

## Resultado esperado vs. real

Se esperaban 104 componentes y siete rutas SSG nuevas. El resultado coincide: registry con 104
entradas, self-containment y guards en verde, y build con 111/111 páginas estáticas. Los siete
fondos renderizan sin errores, overflow ni dependencias animadas.

## Bugs / obstáculos y cómo se resolvieron

- **Canal del navegador:** `playwright-cli --browser chromium` intentó usar el binario no instalado
  `chrome-for-testing`. La ayuda real del CLI mostró que los valores válidos son `chrome` y
  `msedge`; se seleccionó `msedge`, que reutiliza Chromium del sistema sin descargar binarios.
- **Parseo del primer script de barrido:** una expresión multilínea compleja no llegó a ejecutarse.
  Se redujo a una función mínima, se confirmó el contrato de `run-code` y se reconstruyó el mismo
  chequeo como una función compacta; las 14 navegaciones pasaron.

## Verificación (gate)

- Prueba de aceptación RED — 21 archivos ausentes y 97/104 entradas antes de implementar.
- Prueba de aceptación GREEN — 21/21 archivos presentes y 104/104 entradas.
- `npm run lint` — verde, sin warnings.
- `npm run typecheck` — verde; route types y `tsc --noEmit`.
- `npm run test:studio` — verde (`status: "ok"`).
- `npm run test:registry` — `{"components":104,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — verde; 111/111 páginas, incluidas las siete fichas nuevas.
- `npm run check` — verde integral sobre `feat/backgrounds-batch2`.

## Riesgos, deuda y pendientes

- Las capas con blur/sombra y muchos elementos pueden elevar paint cost si un consumidor monta
  numerosos fondos a pantalla completa. Los límites de 40 partículas y 48 celdas reducen el
  riesgo; una futura prueba de rendimiento puede fijar un presupuesto por dispositivo.
- Interactive Grid actualiza dos custom properties por evento de puntero sin setState; no hay
  re-render. Si se usa en superficies enormes podría añadirse throttling tras medir un caso real.
- `npm audit --audit-level=high` conserva 3 avisos heredados del lockfile: PostCSS moderado y dos
  altos de `sharp` transitivo vía Next. npm solo propone un downgrade rompiente a Next 9 con
  `--force`; no se modificaron dependencias fuera del guardarraíl.
- No se añadió atribución a `docs/CREDITS.md` por guardarraíl; las fuentes y licencias quedan
  registradas por componente en este reporte.

## Estado final

Completo.
