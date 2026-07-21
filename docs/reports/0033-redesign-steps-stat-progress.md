# Reporte 0033 — Rediseño táctil: Steps, Stat y Progress

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `redesign/steps-stat-progress` · **Commit final:** ver PR
- **Tipo:** refactor visual (rediseño, sin cambio de comportamiento)
- **Prompt recibido:** Última ronda del rediseño táctil. Tres componentes, un PR y un reporte. Instrucción explícita: usar el **greige cálido acromático** de `select.tsx`/`tabs.tsx` para skeuo y no agrandar la deriva.

## Paso 0

PRs #30 (Tabs+Accordion) y #31 (Breadcrumb+Pagination) mergeados por mí. `main` al día, **22
entradas** confirmadas, rama `redesign/steps-stat-progress` desde `main`, `npm ci` y
`npm run check` verde.

> **Nota:** durante el primer gate **HEAD se movió a `main`** (Codex trabajando en el mismo
> working tree). Lo detecté con `git branch --show-current`, volví a mi rama y repetí el gate.
> Por eso el aviso del prompt es real y no teórico.

## Qué se hizo

- `src/registry/ui/steps.tsx` — profundidad por material en marcadores y contenedor; conector
  que se llena; pulso de resorte en el marcador actual.
- `src/registry/ui/stat.tsx` — superficie con degradado y pared lateral; elevación al hover;
  entrada del delta.
- `src/registry/ui/progress.tsx` — pista recesada y gloss que recorre el relleno.
- `docs/reports/0033-redesign-steps-stat-progress.md` — este reporte.

**Ni las previews ni las entries se tocaron**, y por una razón concreta: **no cambié un solo
color de texto, de borde ni de relleno** en ninguno de los tres. Todo lo añadido es profundidad
(sombras, degradados, movimiento) sobre las superficies que ya existían. Las cifras de contraste
publicadas en las entradas siguen siendo exactamente las mismas y por eso no había nada que
actualizar.

## Decisión sobre skeuo (y por qué no cambié las superficies)

El encargo pedía el greige **cálido acromático**. Las superficies skeuo de estos tres ya estaban
en esa familia cálida (`#efede6` en Steps, `#ece9e1` en Stat, `#d6d0c4` en Progress) — la deriva
que preocupa es la **gris azulada fría** de `input`/`textarea`, que es otra cosa.

Así que apliqué la convención donde de verdad define el material y **donde no cuesta contraste**:

- **degradado** en la familia `#f2efe7 → #dcd8ce` (elevado) y `#c4c0b7 → #dbd7ce` (hundido),
- **pared lateral** `#a8a49b`, exactamente la de `select`/`tabs`/`accordion` — no inventé una quinta,
- **tinta acromática** (`rgba(0,0,0,…)`, `rgba(37,36,31,…)`), nunca marrón cálido.

Retintar además las superficies habría movido cada ratio pista/relleno y marcador/etiqueta que las
entradas fijan por escrito. No me pareció un precio que valiera la pena pagar en la última ronda,
y lo dejo señalado para la pasada de unificación del orquestador.

---

# Componente 1 — Steps

## Recetas nuevas

| | superficie / marcador | delator |
|---|---|---|
| **clay** | wash cálido sobre el contenedor; marcador con bloom, sombra interna cálida y **pared dura** `0 2px 0 #e0bcac` | tinta marrón, nunca negra |
| **glass** | wash blanco; **filo especular** de 1px cuya geometría no cambia entre estados | tinta violeta-negra fría, **sin pared** |
| **skeuo** | degradado `#f2efe7→#dcd8ce` (lit→body); pared `#a8a49b` | tinta acromática |
| **adaptive** | sin degradado (`none` explícito), **dos capas** | solo sombra de contacto |

## Animaciones de firma

**1. El conector se llena.** El conector es un `border`, y un borde no puede crecer desde un
extremo: está o no está. Así que la vía discontinua se queda como **pista** y encima crece una
línea sólida que escala desde cero (`scale-x` con `origin-left`; en vertical, `scale-y` con
`origin-top`). `scale`, no `transform` — Tailwind 4 escribe ahí sus utilidades.

**2. El marcador actual aterriza con resorte.** Keyframes propios
(`0.82 → 1.06 → 1`, `cubic-bezier(0.34,1.56,0.64,1)`) y no una transición, porque el marcador ya
está montado y solo cambia de estado: una transición no tiene desde dónde arrancar cuando el
estado del que depende es el mismo con el que se renderiza.

**`reduced-motion`:** el reparto que ya aprobaron las rondas anteriores. El **relleno del conector
conserva su estado final** y solo pierde el recorrido — es lo que dice "este paso está hecho". El
**pulso se cancela del todo**: es adorno, y el paso ya está nombrado por `aria-current` y por el
texto oculto.

## Detalle estructural

Los keyframes viajan dentro del componente, pero **un `<style>` no es hijo válido de un `<ol>`**.
La raíz se envolvió en un fragmento para que el contrato `<ol>`/`<li>` quede intacto y React ice
la regla al `<head>` igualmente. **Verificado: no hay ningún `<style>` dentro del `<ol>`.**

---

# Componente 2 — Stat

## Recetas nuevas

Mismo vocabulario. Lo importante aquí es la **paridad de capas**: la pared lateral se declara en
`--mq-stat-shadow` **y** en `--mq-stat-shadow-hover`, con el mismo número de capas y el mismo
orden de `inset`. Eso es lo que permite que `box-shadow` interpole al pasar el puntero en vez de
intercambiarse de golpe. Verificado: 3 capas propias en reposo, 3 al hover.

## Animación de firma

**La tarjeta se eleva** (`-translate-y-[3px]`) y su sombra de contacto crece a la vez, para que el
movimiento y la profundidad cuenten lo mismo. `translate` está nombrado literalmente en la lista
de transición. **El delta entra** subiendo (`opacity` + `translate`) con keyframes, porque la cifra
se renderiza ya en su estado final y una transición no tendría desde dónde arrancar.

**`reduced-motion`:** las dos son adorno y se cancelan. La elevación vuelve a cero
(`motion-reduce:hover:translate-y-0`) y la entrada del delta desaparece — la tendencia la lleva el
texto oculto al lado, nunca el movimiento ni el color.

---

# Componente 3 — Progress

## Recetas nuevas

**La pista es un canal hundido y el relleno una superficie elevada** — la misma lectura de dos
sentidos que distingue a skeuo en el resto de la librería:

- **clay** pista `rgba(94,55,38,0.14)→rgba(255,255,255,0.30)` (sombreado arriba = hundido)
- **glass** wash blanco + `backdrop-blur(12px) saturate(1.35)` (ya lo tenía)
- **skeuo** pista `#c4c0b7→#dbd7ce`, **dark→light**, la receta de canal de `tabs.tsx`
- **adaptive** `none` explícito

## Animación de firma: el gloss

Un brillo que recorre el relleno, montado como **hijo** del indicador y no como fondo suyo. Dos
razones concretas: la variante `striped` ya es dueña de `background-image` y un fondo propio
habría peleado con ella; y como hijo lo recorta el `overflow-hidden` del propio relleno, así que
**el gloss se queda dentro de la parte rellena sea cual sea su anchura**.

**`reduced-motion`:** además de parar el barrido, **se descarta el degradado**. Si solo se parara
la animación quedaría una banda blanca aparcada cruzando la barra, que es peor que no tenerla. El
valor lo lleva `aria-valuenow` y la anchura del relleno, nunca el brillo.

## Lo que NO se rompió

La animación indeterminada por `translate` **sigue intacta y corriendo**, y `aria-valuenow` **se
sigue omitiendo** en ese modo. Verificado en el DOM.

**Mejora de paso:** el `<style>` de los keyframes no tenía `href`/`precedence`, así que emitía una
copia idéntica **por cada Progress de la página**. Ahora React lo deduplica: **2 reglas
(indeterminado + gloss) y 1 sola etiqueta `<style>`**.

---

# Verificación (build de producción, `getAnimations()`)

> **Nota de método.** El gloss y el indeterminado son animaciones **infinitas**, y `.finish()`
> lanza `InvalidStateError` sobre ellas. Hay que filtrar por `iterations !== Infinity` antes de
> asentar transiciones. El propio error fue la primera confirmación de que el gloss existe y es
> infinito.

| Comprobación | Resultado |
|---|---|
| **Steps** — `<ol>`/`<li>`, `aria-current="step"`, marcadores `aria-hidden` | intactos |
| Texto oculto de estado | `"Completed:"`, `"Current step:"`, `"Pending:"` — el estado no va solo por color |
| Conector completado / pendiente | `scale: 1` / `scale: 0`, `transition-property: scale` |
| Pulso del marcador actual | `animation-name: mq-step-pop` |
| `<style>` dentro del `<ol>` | **no** (fragmento) · 1 regla, 1 etiqueta |
| **Stat** — `<dl>`/`<dt>`/`<dd>` | intactos |
| Tendencia | icono `aria-hidden="true"` + `sr-only "Increase:"` — nunca solo color |
| `transition-property` | `box-shadow, border-color, translate` |
| Reglas de hover | `-translate-y-[3px]` y `shadow-[var(--mq-stat-shadow-hover…)]`, presentes y coincidentes |
| Capas propias | 3 en reposo (incluye pared `0 3px 0`), 3 al hover — paridad |
| Entrada del delta | `animation-name: mq-stat-delta` · 1 regla |
| **Progress** — `role="progressbar"`, `aria-valuemin/max/now` | `0` / `100` / `64` |
| Indeterminado | **`aria-valuenow` omitido** y `mq-progress-indeterminate` corriendo |
| Pista | degradado por material; glass conserva `blur(12px) saturate(1.35)` |
| Gloss | presente, `aria-hidden="true"`, `mq-progress-gloss`, `playState: "running"` |
| Relleno | `overflow: hidden` — el gloss queda dentro |
| Keyframes de Progress | 2 reglas, **1 etiqueta `<style>`** |

## Hallazgo: un token muerto

Declaré `--mq-fill-grad` en los cuatro materiales de Progress y **nunca lo consumí** — cablearlo
habría peleado con el `background-image` de la variante `striped`. Es exactamente el defecto que
la revisión de la ronda anterior marcó. Eliminado, y **audité los tres archivos**: no queda
ninguna variable declarada sin leer.

---

# NO se regresó nada

- **Steps:** `<ol>`→`<li>`, `aria-current="step"`, conectores y checks decorativos con
  `aria-hidden`, el `sr-only` que lleva el estado, y los colores de marcador/etiqueta.
- **Stat:** semántica `<dl>`/`<dt>`/`<dd>`, tendencia con icono `aria-hidden` + texto `sr-only`,
  y los colores de valor/etiqueta/delta.
- **Progress:** `role="progressbar"`, `aria-valuemin/max/now`, la omisión de `aria-valuenow` en
  indeterminado, la política determinado/indeterminado y sus keyframes, y los colores de
  pista/relleno.
- **Contraste:** ningún color cambió en ninguno de los tres, así que todas las cifras publicadas
  siguen siendo válidas.
- **Self-containment:** `selfContained:true`; toda variable nueva se consume con fallback literal.
- **`forced-colors`:** se añadió lo que faltaba — las imágenes de fondo **no** se descartan en ese
  modo, así que los degradados y el gloss se limpian a mano (`[background-image:none]`) o habrían
  pintado bandas sobre la paleta del sistema.

---

## Gate

```
npm run check
{"components":22,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
```

`components:22` como corresponde a un rediseño. Los tres siguen prerenderizándose como SSG.

## Lo que no se pudo verificar

- **No pude ver el resultado.** Como en las cinco rondas anteriores, la captura del panel no está
  disponible; todo es **estilos computados y CSSOM**, que da valores exactos pero no una mirada.
  Para un rediseño visual eso lo juzga la revisión en vivo.
- **`prefers-reduced-motion` y `forced-colors` no se activaron de verdad**; se confirmó que las
  reglas existen y coinciden con los elementos reales.
- **Solo Chromium**, sin lector de pantalla real.
- La elevación del Stat se verificó por la **regla CSS** (presente y coincidente con el elemento),
  no sintetizando un hover real.
- **El pulso del marcador y la entrada del delta se verificaron por `animation-name`**, no
  observando el recorrido: son animaciones de montaje y el compositor del panel está congelado.

## Para decidir arriba

La deriva de skeuo **sigue abierta en `input`/`textarea`** (gris azulado frío con tinta
`rgba(30,34,38,…)`), que es la que de verdad rompe la coherencia. Mis tres quedan en la familia
cálida acromática de `select`/`tabs`. Con esto los 22 componentes están rediseñados, así que la
pasada de unificación ya se puede hacer sobre un conjunto completo.
