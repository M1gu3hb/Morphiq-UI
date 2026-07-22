# Reporte 0040 — Sección Cards (tanda 1): Magic + Tilt3D + Neon Gradient

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `feat/cards-batch1` · **Commit final:** ver PR
- **Tipo:** feature (componentes nuevos)
- **Prompt recibido:** R7. Tres tarjetas nuevas en la categoría `cards` — Magic Card, Tilt 3D Card, Neon Gradient Card — código original en estilo Morphiq inspirado en librerías MIT. Tier animado disponible (declarar `motion`), pero lo que se pueda con CSS puro va self-contained sin dep.

## Paso 0

Proyecto en `D:\morphiq-ui`. PRs #36 y #37 mergeados por mí. `main` al día, **25 entradas**,
rama `feat/cards-batch1`, `npm ci` y `npm run check` verde. Imprimí la rama antes de cada gate y
cada commit (working tree compartido con Codex).

## Qué se hizo

Tres componentes, tres archivos propios cada uno (`ui/`, `previews/`, `entries/`), más un append a
`docs/CREDITS.md`. Los tres se construyeron sobre el patrón ya probado de `spotlight-card.tsx`:
`<article>` semántico, seguimiento del puntero por `setProperty` imperativo (sin estado React), las
mismas recetas de material (contraste ya validado), y la capa del efecto siempre `aria-hidden`.

**Decisión sobre `motion`:** los tres son **CSS puro, self-contained, cero deps**. El tilt invita a
usar `motion` (spring), pero un solo tilt se resuelve limpiamente con un `transition` sobre
`transform` y una curva con overshoot — sin el coste de una dependencia ni el riesgo de una
transición fantasma. `dependencies.npm` de los tres es solo
`["class-variance-authority","clsx","tailwind-merge"]`.

---

# Componente 1 — Magic Card (`magic-card`)

**Inspiración:** magicui `magic-card` (MIT). Código original.

**Receta / interacción.** El borde se ilumina bajo el puntero. La clave es un anillo con **máscara**:
un `<span>` a `inset-0` con `padding: 1.5px`, fondo = un `radial-gradient` posicionado en
`var(--mq-x)`/`var(--mq-y)` (el punto brillante que sigue al cursor) sobre un `linear-gradient` base
(el borde estático), y `mask-composite: exclude` que recorta el relleno a un anillo del grosor del
borde. El anillo hereda `border-radius`, cosa que `border-image` no puede. Los `--mq-x/--mq-y` se
escriben en `onPointerMove` con `setProperty` — sin re-render.

**Por material.** Cada uno tinta `--mq-magic`: clay coral `rgba(255,138,110,0.95)`, glass cian
`rgba(120,214,255,0.95)`, skeuo blanco sobre greige `#e6e3da`, adaptive verde. Superficie, borde y
sombra reutilizan las recetas de spotlight (profundidad real, greige cálido en skeuo).

**`reduced-motion` / sin cursor.** El anillo se fija a su opacidad base (`motion-reduce:!opacity-70`,
`transition-none`) → borde estático uniforme; sin puntero, `--mq-x/--mq-y` valen 50% (centrado).

**Verificado:** anillo con `mask-composite: exclude`, `padding: 1.5px`, `--mq-x` pasa de `50%` a
`11.11%` al mover el puntero. Lista de transición del card: `translate, box-shadow, backdrop-filter`
— anima `hover:-translate-y` y la sombra, ambos cubiertos, **sin fantasmas**.

---

# Componente 2 — Tilt 3D Card (`tilt-card`)

**Inspiración:** patrones de tilt de smoothui/magicui (MIT). Código original.

**Receta / interacción.** Inclinación 3D real. La transformación es **un único `transform` en línea**
(clase arbitraria `[transform:perspective(760px)_rotateX(var(--mq-rx,0deg))_rotateY(var(--mq-ry,0deg))]`),
no las utilidades `rotate-*`/`scale-*`. Esto es a propósito: en Tailwind 4 esas utilidades escriben
las propiedades **independientes** `rotate`/`scale`, mientras que un `transform` en una sola
declaración posee toda la propiedad y esquiva la trampa por completo. `onPointerMove` escribe
`--mq-rx/--mq-ry` (±9° en los bordes) y `--mq-x/--mq-y` (para el especular). El "resorte" es
`transition-[transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.22,1.25,0.36,1)]` — la
curva se pasa de largo y asienta.

**Especular.** Un `<span>` con `radial-gradient` en el cursor y `mix-blend-mode: screen`, que se
desliza por la cara. `aria-hidden`.

**a11y / teclado.** La inclinación y el especular son decoración: el contenido queda plano en el
orden de lectura, y enlaces/botones internos siguen clicables y enfocables (un elemento
transformado se sigue detectando; el orden de tabulación no cambia). `:focus-within` contornea la
tarjeta cuando un descendiente recibe foco.

**`reduced-motion`.** `motion-reduce:[transform:none]` — como es una clase, gana sobre la clase
base bajo el `@media`, así que la tarjeta queda **recta**. Verificado en el CSSOM: la regla
`transform: none` existe y coincide con la tarjeta.

**Verificado:** el `transform` computado es `matrix3d(...)` (perspectiva+rotación aplicadas),
`transition-property: transform, box-shadow`, `--mq-rx` = 6.30° al mover, especular con
`mix-blend-mode: screen`.

> **Nota de método honesta.** Al probar el reset en `pointerleave`, `--mq-rx` **no** volvía a 0 con
> un evento sintético. Antes de "arreglarlo" comparé con `spotlight-card` (ya en producción, usa
> `onMouseLeave`): **tampoco** resetea bajo dispatch sintético (`--mq-x` se queda en 84.80%). Es un
> **artefacto del harness** — React sintetiza `pointerleave`/`mouseleave` a partir de secuencias
> reales de puntero con `relatedTarget` que el panel no reproduce; en un navegador real ambos
> resetean. No es un bug de mi tilt.

---

# Componente 3 — Neon Gradient Card (`neon-gradient-card`)

**Inspiración:** magicui `neon-gradient-card` (MIT). Código original.

**Receta / interacción.** Un marco de neón animado. Un `<span>` con `conic-gradient` tintado,
`blur-[11px]` y `animate-[mq-neon-spin_7s_linear_infinite]` que **rota** (`@keyframes` propio
`to{rotate:1turn}`). Al estar desenfocado, las esquinas del cuadrado giratorio no se notan y se lee
como un halo de luz que circula.

**El neón va DETRÁS de una superficie opaca.** La estructura es un `<div>` contenedor con el
`<span>` de neón **primero** en el DOM y un `<article>` opaco **después** — por orden de pintado el
neón queda debajo y solo su sangrado (`-inset-[3px]` + blur) asoma como marco. **Sin `z-index`
negativo** (que pintaría por encima del fondo). El texto va sobre el `<article>` sólido, así que su
**contraste nunca depende del neón**.

**Por material.** Tres paradas `--mq-neon-1..3` por material (clay cálido, glass frío, skeuo
violeta/verde, adaptive verde con volteo `dark:`).

**`@keyframes` self-contained.** Viaja dentro del componente vía el izado deduplicado de React 19
(`<style href precedence>`). **Verificado: 1 regla y 1 etiqueta `<style>`** por página, y el
`<style>` queda fuera del `<article>`.

**`reduced-motion`.** `motion-reduce:animate-none` → marco estático. **`forced-colors`.** El neón es
una imagen de fondo (que forced-colors **no** descarta), así que se limpia a mano con
`forced-colors:hidden`; el `<article>` recupera `border-[CanvasText]`, `bg-[Canvas]`, texto de
sistema.

**Verificado:** neón detrás de la superficie, `mq-neon-spin` corriendo 7s, `blur(11px)`, cónico;
superficie opaca `rgb(246,231,221)` con texto `rgb(51,38,30)`.

---

# Contraste (medido)

Los tres reutilizan la paleta de spotlight (contraste ya validado). Remedí las superficies (neon
subió glass a 0.82). **Mínimo 5,92:1** (clay muted); todo ≥ 4,5:1:

| material | texto | muted |
|---|---|---|
| clay | 12,11 | 5,92 |
| skeuo | 12,29 | 7,04 |
| adaptive claro / oscuro | 17,08 / 13,62 | 7,51 / 7,80 |
| glass (peor fondo: negro) | 10,95 | 7,98 |

---

## Gate

```
npm run check
{"components":28,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully · ✓ Generating static pages (35/35)
```

`components:28` como se esperaba (25 + 3). `/components/{magic-card,tilt-card,neon-gradient-card}`
prerenderizan como SSG. `getAnimations()` sin fantasmas en los tres.

## a11y / self-containment (verificado)

- Los tres renderizan un `<article>` semántico; nunca inventan semántica de botón.
- La capa del efecto es siempre `aria-hidden`; el contenido va por `children` en un envoltorio
  aparte.
- `tabIndex` opcional (las previews lo pasan); `:focus-within` contornea con foco de descendiente.
- Self-contained: cada `var()` con fallback literal, sin `:root`/`globals.css`. `selfContained:true`.
- `forced-colors` y `reduced-motion` cubiertos en los tres.

## Lo que no se pudo verificar

- **No pude ver el resultado** con mis ojos (la captura del panel no está disponible); toda la
  verificación es de estilos computados y CSSOM — valores exactos, pero no una mirada.
- **`reduced-motion` y `forced-colors` no se activaron de verdad**; confirmé que las reglas existen
  y coinciden con los elementos reales.
- **Solo Chromium**, sin lector de pantalla real.
- **El reset en `pointerleave`/`mouseleave` no se pudo probar** con eventos sintéticos (artefacto
  del harness, compartido con el spotlight-card ya en producción — ver nota arriba). El
  seguimiento del puntero en `move` sí se verificó.

## Nota de entorno

El sintetizador de mi investigación afirmó que `spotlight-card.tsx` no existía y que no había
allowlist en `verify-registry` — **ambas cosas son falsas** para este checkout (leí el archivo, y
la allowlist entró en R6/#37). No me guié por esas afirmaciones confusas; mis lecturas directas y
el gate verde son la fuente de verdad. Mis tres cards usan los 4 materiales del core y cero deps
nuevas, así que serían válidas en cualquiera de los dos estados.
