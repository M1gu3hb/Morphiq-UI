# Reporte 0045 — Galería/Media, tanda 1

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `feat/media-batch1` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar Carousel, Image Comparison, Infinite Slider, Scroll Stack, Layered Stack, Avatar Circles y Hero Video Dialog como componentes media originales, accesibles, self-contained y estables bajo reduced-motion y forced-colors.

## Objetivo

Expandir el registry autoensamblado de 55 a 62 componentes con la primera tanda de la categoría
`media`. Los componentes con superficie debían cubrir clay, glass, skeuo cálido y adaptive; los
patrones agnósticos debían usar adaptive, sin tocar infraestructura ni archivos existentes.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `carousel`
- `image-comparison`
- `infinite-slider`
- `scroll-stack`
- `layered-stack`
- `avatar-circles`
- `hero-video-dialog`

Carousel, Image Comparison y Hero Video Dialog declaran los cuatro materiales. Infinite Slider,
Scroll Stack, Layered Stack y Avatar Circles son agnósticos y declaran `adaptive`. Cada entry usa
`category: "media"`, expone variantes/tamaños cubiertos por su preview y declara exactamente las
dependencias importadas. Solo Layered Stack usa el tier animado `motion`; los otros seis se
resuelven con React, CSS y APIs nativas.

## Cómo se hizo

### Carousel

**Inspiración/licencia:** patrón de carrusel de WAI-ARIA APG como referencia de comportamiento y
los carruseles táctiles del mapa de expansión; implementación original, sin trasladar código.

Renderiza una región nombrada con `aria-roledescription="carousel"`, slides con IDs estables,
botones anterior/siguiente, puntos y estado anunciado. Flechas izquierda/derecha y swipe mediante
Pointer Events llegan al mismo cambio de índice. El autoplay es opcional y usa un interval con
cleanup; estados de hover y focus-within se rastrean por separado, por lo que cualquiera pausa el
reloj hasta salir realmente de ambos.

Los slides activos producen `CSSTransition` únicamente para `opacity` y la propiedad individual
`translate`. La prueba observó avance 1→2 por autoplay, luego la posición permaneció en 2 durante
5,2 s de hover y otros 5,2 s de foco. Teclado avanzó al slide 2 y swipe al 3. Reduced-motion dejó
cero animaciones; forced-colors devolvió Canvas/CanvasText, borde del sistema y sin sombras.

### Image Comparison

**Inspiración/licencia:** patrón before/after común en bibliotecas media MIT del mapa; API y código
originales.

Dos imágenes ocupan el mismo viewport y la capa Before se recorta con `clip-path`. El divisor usa
Pointer Capture para mouse/touch y `role="slider"` con min/max/now/valuetext. Flechas avanzan por
`step`, PageUp/PageDown por diez pasos y Home/End llegan a los límites. Las etiquetas visibles
complementan los dos `alt`; no sustituyen su significado.

Teclado cambió 46→47 y el drag llegó a 76. `getAnimations()` observó `CSSTransition:left` en el
divisor y `CSSTransition:clip-path` en la capa; durante drag ambas transiciones se desactivan para
no introducir latencia. Reduced-motion produjo cero animaciones. La preview se corrigió para que
Before sea gris y After conserve color.

### Infinite Slider

**Inspiración/licencia:** Infinite Slider de Motion Primitives, MIT; implementación original con
CSS local, sin importar su fuente.

Dos pistas idénticas viajan con `mq-infinite-slider` y la segunda cierra el loop. Solo la primera
es accesible; la copia lleva `aria-hidden` e `inert`. Dirección, duración, tamaño y pause-on-hover
son configurables. Chromium observó dos pistas, `CSSAnimation:mq-infinite-slider` en marcha y
`playState:paused` bajo hover. Reduced-motion y forced-colors detienen la animación y ocultan la
copia, dejando una sola lista visual.

### Scroll Stack

**Inspiración/licencia:** Scroll Stack de React Bits (MIT + Commons Clause), usado únicamente como
inspiración conceptual conforme a la política del repo; no se copió ni portó código.

Es una región desplazable con una lista en orden de documento. Cada `article` usa posicionamiento
CSS `sticky`; offsets y espaciado se derivan del índice, sin listener de scroll. La escala inicial
es un adorno mediante variables locales y clases, por lo que `motion-reduce:scale-100` sí puede
anularla. El navegador confirmó tres listitems, `position:sticky`, desplazamiento real de 220 px y
escala computada 1 bajo reduced-motion. Forced-colors conserva límites explícitos.

### Layered Stack

**Inspiración/licencia:** patrón de card stack presente en librerías MIT del mapa; interacción y
composición originales en estilo Morphiq.

La tarjeta superior es un `motion.article` arrastrable en X. Offset o velocidad por encima del
umbral descartan la tarjeta; un botón nativo “Next card” ofrece la misma operación a teclado. Las
capas inferiores son decorativas, `aria-hidden` e `inert`, y una región live anuncia título y
posición. Motion mostró una `Animation` de resorte y tanto swipe real como botón revelaron
“Texture”. `useReducedMotion` desactiva `dragListener` y usa duración cero: la nueva tarjeta aparece
sin animaciones. Solo este entry declara `motion`, coincidiendo importado === declarado.

### Avatar Circles

**Inspiración/licencia:** Avatar Circles de MagicUI, MIT; código original.

La raíz es una lista nombrada. Cada imagen tiene `alt`; una fuente ausente o fallida cambia a
iniciales con `role="img"` y nombre completo. El overflow visible `+N` está oculto al lector y su
`li` anuncia “N more people”. La preview mostró cinco elementos: tres imágenes, un fallback “SR”
y `+2` con `aria-label="2 more people"`. Hover generó solo `CSSTransition` para `translate` y
`box-shadow`; reduced-motion devolvió cero y translate 0 px.

### Hero Video Dialog

**Inspiración/licencia:** Hero Video Dialog de MagicUI, MIT; implementación original basada en
`HTMLDialogElement`, no en el código de la fuente.

Una miniatura con alt y botón play nombrado abre `<dialog>` mediante `showModal()`. Cerrar recibe
foco inicial; Tab/Shift+Tab se envuelven explícitamente entre Cerrar y el `<video>`, Escape conserva
el cancel nativo, el video se pausa al cerrar y el foco vuelve al disparador. La ventana está
etiquetada por título y descripción. La prueba encontró un hueco real de Chromium —Shift+Tab desde
el primer control caía en `body`— y se añadió el ciclo explícito; después todas las posiciones
quedaron dentro del modal.

La entrada normal produce `CSSAnimation:mq-video-dialog-in`; reduced-motion la anuló por completo
y quitó el backdrop blur. Forced-colors convirtió póster/diálogo en Canvas/CanvasText con borde de
sistema. El alt de la demo se corrigió para describir el castillo que realmente aparece.

### Contraste, self-containment y movimiento

No se usan variables de `:root`, clases de globals.css ni `var()` sin fallback literal. Todos los
efectos se resuelven dentro del sourcePath distribuible. Contrastes calculados sobre las
superficies propias:

| Superficie | Primario | Secundario |
|---|---:|---:|
| clay `#f7e7dc` | `#33261e` · 12,12:1 | `#634b3d` · 6,69:1 |
| glass `#14181f` | `#ffffff` · 17,79:1 | `#d3d9e5` · 12,56:1 |
| skeuo cálido `#e6e3da` | `#23231f` · 12,29:1 | `#555149` · 6,15:1 |
| adaptive `#171817` | `#f7f6f2` · 16,46:1 | `#c8c6bf` · 10,42:1 |
| media oscura `#0e1016` | `#f5f7ff` · 17,78:1 | — |
| tarjeta Layered `#1a1e27` | — | `#c8ccd8` · 10,39:1 |
| fallback Avatar `#272a31` | `#f7f6f2` · 13,28:1 | — |

| Componente | Evidencia normal de `getAnimations()` | Reduced-motion |
|---|---|---:|
| Carousel | `CSSTransition` · `opacity`, `translate` | 0 |
| Image Comparison | `CSSTransition` · `left`, `clip-path` | 0 |
| Infinite Slider | `CSSAnimation` · `mq-infinite-slider` | 0 |
| Scroll Stack | sticky nativo, sin animación | escala 1 |
| Layered Stack | `Animation` de Motion | 0 |
| Avatar Circles | `CSSTransition` · `box-shadow`, `translate` | 0 |
| Hero Video Dialog | `CSSAnimation` · `mq-video-dialog-in` | 0 |

Forced-colors computó borde negro, fondo blanco y `box-shadow:none` en los siete componentes.

## Resultado esperado vs. real

- **Esperado:** 62 entries y siete rutas nuevas SSG.
- **Real:** `verify-registry` reportó exactamente 62 componentes self-contained con guards ok y
  Next generó 69/69 páginas estáticas.
- Las siete rutas respondieron HTTP 200, mostraron heading, preview y código real; no hubo
  `console.error` ni `pageerror`.
- La inspección visual cubrió las siete previews y el diálogo abierto; no se observaron recortes,
  texto ilegible ni controles ocultos.

## Bugs / obstáculos y cómo se resolvieron

1. **`npm ci` quedó incompleto y Windows bloqueó su `node_modules`.** La primera instalación agotó
   el timeout y el reintento encontró `ENOTEMPTY`; el árbol tampoco podía moverse por un handle del
   sistema. Se dejó ese checkout detached e intacto y se creó un worktree limpio en la misma rama.
   Allí `npm ci` terminó con exit 0 sin borrar datos del usuario.
2. **Autoplay podía reanudarse con foco.** Un booleano compartido permitía que `mouseleave`
   sobrescribiera el estado de foco. Se separaron `hovered` y `focusWithin`; la pausa ahora es la
   unión de ambos, demostrada con dos ventanas de 5,2 s.
3. **Reduced-motion no anulaba la entrada del diálogo.** `open:` tenía mayor especificidad que
   `motion-reduce:animate-none`. Se combinó como `motion-reduce:open:animate-none`; la prueba pasó
   de una animación a cero.
4. **El modal nativo dejaba foco en body con Shift+Tab.** Se implementó wrapping explícito entre
   sus controles. Escape y retorno de foco permanecieron nativos/predecibles.
5. **La demo de Comparison mostraba gris en ambos lados.** Picsum interpreta la presencia de
   `grayscale` aunque valga cero; se retiró el parámetro del lado After.

## Verificación (gate)

- `npm ci` — ✅ instalación limpia final, sin cambios en package.json/lockfile.
- Contrato TDD temporal fuera del repo — ✅ RED por Carousel ausente; GREEN final
  `{"components":7,"files":21,"status":"ok"}` sin relajar aserciones.
- ESLint dirigido, TypeScript y verify-registry tras cada componente/corrección — ✅.
- Revisión React — ✅ exports nombrados, hooks incondicionales, interval con cleanup, estado
  derivado local, refs seguras, handlers semánticos, imágenes con alt y keys estables.
- `npm run check` — ✅ lint, typecheck, verify-studio, verify-registry y build.
- Registry — ✅ `{"components":62,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next 16 / Turbopack — ✅ 69/69 páginas estáticas; las siete rutas nuevas son SSG.
- Playwright CLI + Chromium — ✅ HTTP 200, teclado, drag/swipe, autoplay, sticky, modal/foco,
  `getAnimations()`, reduced-motion, forced-colors, render visual y cero errores runtime.

`npm audit --audit-level=high` mantiene deuda transitiva ya presente en Next: PostCSS moderado y
dos avisos altos de sharp/libvips. El único fix automático propone forzar Next 9.3.3, incompatible
con Next 16 y fuera del guardarraíl; no se modificaron dependencias.

## Riesgos, deuda y pendientes

- Las previews dependen de imágenes Picsum/pravatar y un MP4 de MDN; una red sin salida conserva
  estructura, alt y controles, pero no carga esos medios remotos.
- Carousel monta todas sus imágenes para permitir transición inmediata. En galerías grandes, el
  consumidor debe aportar `loading`, tamaños responsivos o una estrategia de virtualización.
- Native `<dialog>` requiere navegadores modernos; la accesibilidad de teclado queda reforzada por
  el ciclo explícito, pero proyectos con soporte legado necesitarían un polyfill declarado.
- Scroll Stack necesita un ancestro desplazable con altura acotada cuando se desea apilar dentro
  de un panel; en página completa puede usar el viewport del documento.
- Layered Stack es el único componente con dependencia Motion; el resto mantiene CSS/React puro.
- La deuda transitiva de Next debe atenderse cuando exista una actualización compatible.

## Estado final

Completo. Los siete componentes, previews, entries y reporte están listos; gate y navegador real
permanecen verdes con 62 componentes.
