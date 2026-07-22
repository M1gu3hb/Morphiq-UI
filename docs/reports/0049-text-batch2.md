# Reporte 0049 — Texto/Tipografía, tanda 2

- **Autor:** Codex
- **Fecha:** 2026-07-22
- **Rama:** `feat/text-batch2` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar siete efectos de texto originales, accesibles, sin CLS y respetuosos de movimiento reducido y colores forzados, sin modificar infraestructura ni componentes existentes.

## Objetivo

Expandir el registry autoensamblado de 83 a 90 componentes con Count Up, Text Scramble,
Sparkles Text, Blur In Text, Letter Swap, Text Highlight y Aurora Text. Los siete son efectos
tipográficos agnósticos al material, usan únicamente `adaptive` y preservan el texto final como
contenido accesible desde el primer render.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `count-up`
- `text-scramble`
- `sparkles-text`
- `blur-in-text`
- `letter-swap`
- `text-highlight`
- `aurora-text`

Cada entry usa `category: "text"`, `materials: ["adaptive"]`, variantes y tamaños cubiertos por
su preview, texto bilingüe y manifiesto fiel de dependencias. Todos usan React/CSS y utilidades
existentes; ninguno necesita `motion`. Se añadió únicamente este reporte fuera de sus tríos. No
se modificó schema, generator, verifier, package.json, CREDITS ni ningún UI preexistente.

## Cómo se hizo

### 1. Count Up

- **Inspiración/licencia:** contadores de Magic UI y Animata (MIT), reinterpretados con API,
  formato y capas accesibles originales en estilo Morphiq; no se copió código.
- **Técnica:** `requestAnimationFrame` con easing cúbico, inicio por `IntersectionObserver` y
  formato `Intl.NumberFormat` con separadores, decimales, prefijo y sufijo.
- **Texto final accesible:** una capa `sr-only` contiene el valor final desde el SSR; el número
  cambiante es `aria-hidden`, así que un lector de pantalla no recibe anuncios repetidos.
- **Reduced motion/sin CLS:** con movimiento reducido se muestra directamente el valor final y no
  se inicia el contador. Una copia invisible del valor final reserva el ancho y alto completos.

### 2. Text Scramble

- **Inspiración/licencia:** efectos de decodificación de Animata/Magic UI (MIT), con secuencia y
  markup escritos desde cero.
- **Técnica:** un intervalo determinista resuelve progresivamente cada posición usando un alfabeto
  configurable; termina una vez y limpia el temporizador.
- **Texto final accesible:** el texto resuelto existe en `sr-only` desde el inicio; los glifos
  intermedios son una capa `aria-hidden`.
- **Reduced motion/sin CLS:** una copia invisible del texto final reserva el layout. En
  `prefers-reduced-motion` o colores forzados solo se presenta la copia final nítida.

### 3. Sparkles Text

- **Inspiración/licencia:** decoraciones de texto de Magic UI (MIT), recreadas con posiciones y
  tiempos deterministas.
- **Técnica:** destellos CSS absolutos con una animación local de opacidad y escala; densidad
  `subtle` o `dense` sin JavaScript ni dependencia animada.
- **Texto final accesible:** el texto real es el único contenido semántico; todas las chispas
  tienen `aria-hidden`.
- **Reduced motion/sin CLS:** el adorno se oculta por completo con movimiento reducido o colores
  forzados. Al estar fuera de flujo, nunca cambia la caja del texto.

### 4. Blur In Text

- **Inspiración/licencia:** entradas tipográficas de Animata (MIT), implementadas originalmente
  con CSS.
- **Técnica:** una animación de una sola pasada combina `opacity`, `filter: blur()` y la propiedad
  individual `translate`, evitando confundirla con `transform` en Tailwind 4.
- **Texto final accesible:** se anima el nodo de texto real; el contenido y su nombre accesible
  están presentes desde SSR, sin duplicados semánticos.
- **Reduced motion/sin CLS:** la regla reduce deja `opacity: 1`, `filter: none` y `translate: 0`.
  La caja final se reserva desde el primer layout porque el nodo nunca sale del flujo.

### 5. Letter Swap

- **Inspiración/licencia:** rollover lettering de Animata (MIT), con interacción y semántica
  originales.
- **Técnica:** cada celda recorta dos copias visuales de una letra; hover o foco traslada solo el
  contenido interior mediante `translate`. Las variantes `smooth` y `staggered` cambian el ritmo.
- **Texto final accesible:** una única palabra completa `sr-only` proporciona el nombre; las
  letras duplicadas son `aria-hidden`. El contenedor solo entra al tab order cuando el consumidor
  opta por `focusable`, evitando crear una parada de foco decorativa.
- **Reduced motion/sin CLS:** reduced-motion fija todas las letras en su posición final y elimina
  transiciones. Cada celda conserva el ancho de su glifo durante el intercambio.

### 6. Text Highlight

- **Inspiración/licencia:** resaltados editoriales de Magic UI/Animata (MIT), recreados con
  semántica HTML nativa.
- **Técnica:** las frases objetivo usan `<mark>` y una capa decorativa barre mediante
  `clip-path`; las variantes son marcador y subrayado.
- **Texto final accesible:** la oración real nunca se oculta y `<mark>` conserva el significado
  del resaltado aun sin pintura. La capa animada es `aria-hidden`.
- **Reduced motion/sin CLS:** movimiento reducido presenta el resaltado completo de inmediato;
  forced-colors oculta la pintura y usa el color de sistema `Highlight`. La capa absoluta no
  participa en el layout.

### 7. Aurora Text

- **Inspiración/licencia:** rellenos aurora de Magic UI (MIT), con gradiente, composición y API
  propios.
- **Técnica:** el texto base conserva `currentColor`; una copia decorativa superpone gradientes
  radiales/lineales y anima `background-position` y `filter`. Variantes `ocean` y `sunset`.
- **Texto final accesible:** el nodo base es legible y accesible siempre; la copia de color lleva
  `aria-hidden`, por lo que no duplica el nombre.
- **Reduced motion/sin CLS:** se congela el gradiente en movimiento reducido y se elimina la capa
  en forced-colors. Ambas copias comparten la misma celda del grid, reservando el tamaño final.

## Self-containment, contraste y forced colors

Cada UI declara sus tokens `--mq-*` en el propio componente y toda lectura `var()` incluye un
fallback literal. No hay referencias a `:root`, globals.css ni clases de chrome. Bajo
`forced-colors`, el texto usa `CanvasText`, las decoraciones se eliminan o se reemplazan por
colores de sistema y no queda ninguna animación activa.

Contraste WCAG medido con luminancia relativa sRGB para los pares usados por los previews:

| Contexto | Texto / fondo | Ratio |
|---|---|---:|
| Claro | `#171817` / `#ffffff` | 17.80:1 |
| Oscuro | `#f1efe9` / `#171817` | 15.48:1 |

Ambos superan 4.5:1. Los efectos se superponen sin sustituir el texto base; por tanto, el color
animado nunca es el único mecanismo que mantiene legible el contenido.

## Verificación de navegador, CLS y animaciones

Se levantó el build de producción y se recorrieron las siete rutas con Chromium a 390×900 y
1280×900. Resultado: 14/14 navegaciones HTTP 200, un `h1` por ficha, cero `console.error`, cero
`pageerror` y `scrollWidth === clientWidth` en todos los casos.

Mediciones antes/durante/después confirmaron cajas idénticas para los efectos que cambian texto:

| Componente | Caja inicial | Caja final | Cambio |
|---|---|---|---:|
| Count Up | 256.766×72 px | 256.766×72 px | 0 px |
| Text Scramble | 446.25×56.156 px | 446.25×56.156 px | 0 px |
| Letter Swap | 219.891×60 px | 219.891×60 px | 0 px |

`getAnimations()` observó únicamente la propiedad o keyframe intencional:

| Componente/estado | Animación observada |
|---|---|
| Count Up | `[]` (progresión por RAF, sin transición CSS fantasma) |
| Text Scramble | `[]` (intervalo de texto, sin transición CSS fantasma) |
| Letter Swap hover | `CSSTransition: translate` |
| Sparkles Text | `CSSAnimation: mq-sparkles-text-pop` |
| Blur In Text | `CSSAnimation: mq-blur-in-text` |
| Text Highlight | `CSSAnimation: mq-text-highlight-sweep` |
| Aurora Text | `CSSAnimation: mq-aurora-text-flow` |

Al emular `prefers-reduced-motion: reduce`, las siete fichas devolvieron cero animaciones en su
subárbol y mostraron el texto final. Al emular `forced-colors: active`, las siete conservaron
`CanvasText`, cero animaciones y las capas accesibles finales de Count Up, Text Scramble y Letter
Swap.

## Resultado esperado vs. real

Se esperaban 90 componentes y siete rutas SSG nuevas. El resultado real coincide: registry con
90 entradas, guards en verde y build con 97/97 páginas estáticas (90 fichas más rutas de la
aplicación). Los siete efectos renderizan sin errores, overflow ni cambio de layout en móvil y
escritorio.

## Bugs / obstáculos y cómo se resolvieron

- **Texto cambiante vs. nombre accesible estable:** animar el mismo nodo podía provocar anuncios
  repetidos. Se separó el texto final semántico de la capa visual cambiante con `sr-only` y
  `aria-hidden` donde correspondía.
- **Reserva de espacio para cadenas variables:** Count Up y Text Scramble podían cambiar ancho.
  Una copia invisible del resultado final dentro de la misma celda reserva sus dimensiones.
- **Tailwind 4 y translate:** Letter Swap usa explícitamente `transition-[translate]`; la prueba de
  hover confirmó `CSSTransition: translate`, no un `transform` fantasma.

## Verificación (gate)

- `npm run lint` — verde, sin warnings.
- `npm run typecheck` — verde; route types y `tsc --noEmit`.
- `npm run test:studio` — verde (`status: "ok"`).
- `npm run test:registry` — `{"components":90,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — verde; 97/97 páginas, incluidas las siete fichas nuevas.
- `npm run check` — verde integral sobre `feat/text-batch2`.

## Riesgos, deuda y pendientes

- `count-up` y `text-scramble` usan temporización visual de una sola pasada; un consumidor que
  quiera reactivarlos deberá remontar el componente o ampliar la API en una tarea futura.
- La comprobación sin CLS midió explícitamente los tres efectos con contenido variable; los demás
  mantienen el mismo nodo o usan capas absolutas/grid, por construcción fuera del flujo.
- `npm audit --audit-level=high` conserva 3 avisos heredados del lockfile: PostCSS moderado y dos
  altos de `sharp` transitivo vía Next. npm solo propone un downgrade rompiente a Next 9 con
  `--force`; no se alteraron dependencias fuera del guardarraíl y debe resolverse en una tarea de
  infraestructura cuando exista una versión compatible.
- No se añadió atribución a `docs/CREDITS.md` por guardarraíl; fuentes y licencias quedan
  registradas por componente en este reporte.

## Estado final

Completo.
