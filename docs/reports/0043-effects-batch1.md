# Reporte 0043 — Efectos, tanda 1

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `feat/effects-batch1` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar Marquee, Border Beam, Orbiting Circles, Animated Beam, Shine Border, Glow Effect y Box Reveal como efectos agnósticos al material, self-contained, accesibles y estables bajo reduced-motion y forced-colors.

## Objetivo

Expandir el registry autoensamblado de 41 a 48 componentes con la primera tanda de la categoría
`effects`. Cada efecto debía mantener el contenido en una capa semántica legible, demostrar el
movimiento real sin transiciones fantasma y generar su ficha SSG sin tocar infraestructura.

## Qué se hizo

Se crearon exclusivamente los 21 archivos propios —entry, UI y preview— de:

- `marquee`
- `border-beam`
- `orbiting-circles`
- `animated-beam`
- `shine-border`
- `glow-effect`
- `box-reveal`

Los siete declaran `category: "effects"`, `materials: ["adaptive"]`, variantes y tamaños cubiertos
por su preview. Se añade únicamente este reporte. No se editaron CREDITS, schema, scripts,
package.json, archivos generados ni componentes existentes.

## Cómo se hizo

### Marquee

**Inspiración:** Marquee de MagicUI, licencia MIT; implementación original. Dos keyframes locales
animan la propiedad individual `translate` en horizontal o vertical. La primera pista contiene el
contenido accesible y las copias que aseguran el loop continuo son `aria-hidden` e `inert`; así no
duplican etiquetas ni foco. Admite `repeat`, duración, reversa y pause-on-hover.

En Chromium el loop horizontal produjo `CSSAnimation: mq-marquee-x` sobre `translate`; al elegir
Vertical cambió a `mq-marquee-y`, y hover llevó `playState` a `paused`. Reduced-motion detiene la
primera pista y oculta las copias, dejando una sola fila estática. Forced-colors hace lo mismo y
recupera Canvas/CanvasText.

### Border Beam

**Inspiración:** Border Beam de MagicUI, MIT; código rederivado. Un paquete de luz recorre un
`offset-path: rect(...)` mediante `offset-distance`. El contenedor del haz usa dos máscaras y
`mask-composite: exclude`, por lo que solo se pinta el grosor de borde configurable. El contenido
queda en una capa opaca superior.

La sonda observó el path normalizado por Chromium como `inset(... round 24px)`, distancia en curso
y `CSSAnimation: mq-border-beam` únicamente sobre `offsetDistance`. La variante Reverse computó
`animation-direction: reverse`. Reduced-motion congela la distancia en `0%`; forced-colors quita
el haz y deja el borde del sistema.

### Orbiting Circles

**Inspiración:** Orbiting Circles de MagicUI, MIT; implementación original. Cada child se coloca
una sola vez alrededor del centro. Un keyframe `transform` rota, traslada por `--mq-radius` y
contrarrota para mantener el contenido vertical; delay negativo reparte la fase. Radio, tamaño,
velocidad, duración y sentido son configurables, y el círculo guía es decorativo.

En movimiento se observaron cuatro items distribuidos y `CSSAnimation: mq-orbit` sobre
`transform`; la matriz cambió tras 140 ms. Counterclockwise computó dirección inversa. Bajo
reduced-motion no se apilan: desaparece la animación y los transforms inline quedan en los cuatro
puntos cardinales (`±94px`). Forced-colors detiene el anillo y conserva superficies del sistema.

### Animated Beam

**Inspiración:** Animated Beam de MagicUI, MIT; no se copió su fuente. El componente mide
`containerRef`, `fromRef` y `toRef` con un `ResizeObserver`, recalcula en un solo
`requestAnimationFrame` y limpia observer, listener y frame al desmontar. Dibuja una ruta SVG
recta o cuadrática; un trazo con `pathLength=100`, gradiente y dash recorre la geometría mediante
`stroke-dashoffset`. No necesita Motion.

Chromium midió un `viewBox 430×230` y la curva real `M 60,164 Q 215,75 370,94`; la variante
Straight cambió a `M 60,164 L 370,94`. `getAnimations()` devolvió `mq-beam-flow` solo sobre
`strokeDashoffset`. Reduced-motion conserva la ruta medida y congela el dash; forced-colors usa
CanvasText en ambos trazos y cero animaciones.

### Shine Border

**Inspiración:** Shine Border de MagicUI, MIT; implementación original. Un
`conic-gradient` continuo se recorta al perímetro mediante la misma máscara content-box/border-box.
La propiedad registrada `--mq-shine-angle` avanza con `mq-shine-border`; duración, colores y
grosor son configurables. El contenido queda sobre una superficie opaca separada.

La prueba observó el ángulo interpolado, el gradiente cónico y `maskComposite: exclude`; la única
animación fue `mq-shine-border`. Reduced-motion deja un cuadro estático; forced-colors elimina el
anillo y restaura borde CanvasText.

### Glow Effect

**Inspiración:** Glow Effect de Motion Primitives, licencia MIT; interacción y CSS son originales.
La variante Follow escribe `--mq-x/--mq-y` en el wrapper sin estado React y posiciona un
`radial-gradient` desenfocado detrás de una superficie opaca. Pulse mantiene el centro y ejecuta
el keyframe local `mq-glow-pulse` sobre transform/opacidad. Los handlers públicos se preservan.

Mover el puntero al 82%/24% produjo exactamente esas coordenadas y actualizó el gradiente; Pulse
devolvió una CSSAnimation solo sobre `transform` y `opacity`. Reduced-motion impide el tracking,
fuerza 50%/50% y detiene el pulso. Forced-colors oculta el glow y conserva Canvas/CanvasText con
outline Highlight para descendientes enfocados.

### Box Reveal

**Inspiración:** patrón Box Reveal popularizado por MagicUI, licencia MIT; código original. El
contenido permanece siempre una vez en el DOM. `mq-box-content` controla solo su opacidad visual y
`mq-box-sweep` mueve una caja `aria-hidden` con la propiedad individual `translate`; el bloque
entra, cubre y sale. Dirección, color, duración y delay son configurables.

La sonda temprana observó ambas CSSAnimation y la caja en `translate:-95.45%`. From right invirtió
la dirección. Reduced-motion deja el contenido en `opacity:1`, oculta la caja y devuelve cero
animaciones; forced-colors aplica el mismo resultado sobre Canvas.

### Dependencias, contraste y self-containment

Los siete se resolvieron con CSS/React puro; **ninguno importa Motion**. Animated Beam usa APIs
nativas del navegador y el resto keyframes locales hoisteados/deduplicados por React 19. Cada
entry declara exactamente las primitivas realmente importadas (`class-variance-authority` cuando
hay ejes CVA, además de `clsx`/`tailwind-merge` por `cn`).

No existen lecturas de `:root`, globals.css ni clases del chrome; cada `var()` tiene fallback
literal. Los efectos son `aria-hidden` y están detrás/alrededor del contenido o, en Box Reveal,
solo lo cubren durante la presentación sin retirarlo del árbol accesible.

Contraste medido en las superficies opacas de las previews:

| Pareja | Ratio |
|---|---:|
| `#f4f6ff` / `#0e1016` | 17,63:1 |
| `#f5f7ff` / `#11131a` | 17,34:1 |
| secundario `#c8ccd8` / `#11131a` | 11,56:1 |
| nodos Beam `#f4f6ff` / `#1c202b` | 15,09:1 |
| secundario Orbit `#bcc2d2` / `#0e1016` | **10,67:1** |

El mínimo real supera ampliamente 4,5:1. Forced-colors computó negro/blanco del sistema.

### Cobertura de movimiento (`getAnimations()`)

| Componente | Animación observada | Propiedad |
|---|---|---|
| Marquee | `mq-marquee-x` / `mq-marquee-y` | `translate` |
| Border Beam | `mq-border-beam` | `offset-distance` |
| Orbiting Circles | `mq-orbit` | `transform` |
| Animated Beam | `mq-beam-flow` | `stroke-dashoffset` |
| Shine Border | `mq-shine-border` | custom angle registrado |
| Glow Pulse | `mq-glow-pulse` | `transform`, `opacity` |
| Box Reveal | `mq-box-content`, `mq-box-sweep` | `opacity`, `translate` |

No apareció ninguna `CSSTransition`: no hay transición Tailwind fantasma. En reduced-motion y
forced-colors, `getAnimations({subtree:true})` devolvió cero para las siete fichas.

## Resultado esperado vs. real

- **Esperado:** 48 entries y siete rutas nuevas SSG.
- **Real:** `verify-registry` reportó exactamente 48 componentes self-contained y Next generó
  55/55 páginas estáticas.
- Las siete rutas devolvieron HTTP 200, mostraron título, preview y fuente real, con cero
  `console.error`, cero `pageerror` y cero warnings.
- Se verificaron también Vertical, Reverse, Counterclockwise, Straight, Pulse y From right, no
  únicamente los defaults.

## Bugs / obstáculos y cómo se resolvieron

1. **`npm ci` y el primer baseline excedieron la ventana de salida de la terminal.** Los procesos
   hijos siguieron trabajando; se identificaron sin matar la instalación paralela de Claude Code,
   se esperó su cierre y se repitió `npm run check` completo con salida y exit 0.
2. **Un muestreo fijo no sirve para demostrar loops.** La verificación leyó directamente
   `getAnimations()`, keyframes, `playState`, geometría SVG, custom properties y matrices; no
   dedujo movimiento de una captura intermedia.
3. **La sesión conservaba español.** Los asserts de navegador comprobaron estructura, slug,
   preview y `<code>` real sin depender de copy traducible; los `h1` españoles coincidieron con
   las entries bilingües.

## Verificación (gate)

- `npm ci` — ✅ instalación limpia; package.json y lockfile sin cambios.
- Contrato TDD temporal fuera del repo — ✅ RED por Marquee ausente y GREEN final
  `{"components":7,"files":21,"status":"ok"}`.
- ESLint dirigido, TypeScript y verify-registry tras cada componente — ✅.
- Revisión React — ✅ exports nombrados, hooks incondicionales, observer/listener/RAF con cleanup,
  listas estáticas con keys seguras y efectos decorativos fuera del árbol accesible.
- `npm run check` — ✅ lint, typecheck, verify-studio, verify-registry y build.
- Registry — ✅ `{"components":48,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next 16 / Turbopack — ✅ 55/55 páginas estáticas; las siete rutas nuevas son SSG.
- Playwright CLI + Chromium — ✅ 200, variantes, geometría, puntero, movimiento,
  reduced-motion, forced-colors, contraste y cero errores.

`npm audit --audit-level=high` mantiene los tres advisories transitivos ya presentes en Next
(PostCSS moderado y dos de sharp/libvips altos). El fix automático propone Next 9.3.3 con
`--force`, una regresión incompatible y fuera del guardarraíl; no se cambiaron dependencias.

## Riesgos, deuda y pendientes

- Marquee duplica nodos para cerrar el loop; las copias son inert/aria-hidden, pero contenido con
  IDs propios también duplicaría esos IDs. La API documenta usar contenido visual no interactivo.
- `offset-path` y `@property` tienen fallback estático en navegadores antiguos: el contenido y el
  borde siguen visibles, aunque el recorrido o la interpolación puedan no animarse.
- Animated Beam calcula la geometría después de hidratar; los nodos y su semántica aparecen desde
  el HTML inicial, pero el conector visual se ajusta en el primer frame.
- Los hijos orbitales conservan su semántica una sola vez; controles interactivos en movimiento
  continuo se desaconsejan por usabilidad.
- La deuda transitiva de Next debe resolverse cuando exista una actualización compatible.

## Estado final

Completo. Los siete componentes, previews, entries y reporte están listos; gate y navegador real
permanecen verdes con 48 componentes.
