# Reporte 0031 — Rediseño táctil: Tabs y Accordion

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `redesign/tabs-accordion` · **Commit final:** ver PR
- **Tipo:** refactor visual (rediseño, sin cambio de comportamiento)
- **Prompt recibido:** Rediseño táctil de Tabs y Accordion al estándar ya validado con los pilotos (Select, Toggle) y la ronda de form controls (Checkbox, Radio, Input, Textarea). El auditor los midió planos.

## Paso 0

PRs #29 (Checkbox+Radio) y #28 (Input+Textarea) mergeados por mí. `main` al día, **22 entradas**
confirmadas, rama `redesign/tabs-accordion` desde `main`, `npm ci` y `npm run check` verde en
preflight (`components:22`).

## Qué se hizo

- `src/registry/ui/tabs.tsx` — cuatro recetas reales (canal + chip) y el indicador deslizante.
- `src/registry/previews/tabs-preview.tsx` — **arreglado un bug previo** que dejaba a 3 de los 4
  materiales sin ninguna pestaña activa (ver abajo).
- `src/registry/ui/accordion.tsx` — cuatro recetas reales, separación de profundidad
  abierto/cerrado y feedback de pulsación.
- `docs/reports/0031-redesign-tabs-accordion.md` — este reporte.

`entries/tabs.ts` y `entries/accordion.ts` **no se tocaron**: las dependencias no cambian (no se
añadió ninguna) y las cifras de contraste tampoco, porque **no cambié ningún color de texto ni de
borde** — solo se añadió profundidad (sombras y degradados) sobre las superficies existentes.

Nada compartido.

---

# Componente 1 — Tabs

## Las cuatro recetas: canal y chip

El modelo físico es un **control segmentado**: la lista es un **canal hundido** y la pestaña
activa es un **chip que va montado en él**. Eso da un relato coherente y, sobre todo, distingue
los materiales por estructura y no por tono.

| | canal (lista) | chip (activo) |
|---|---|---|
| **clay** | degradado sombreado arriba (`rgba(151,92,58,0.12)→rgba(255,255,255,0.34)`) = hundido | inflado, con **pared lateral dura** `0 2px 0 #c9482f`. Tinta marrón cálida |
| **glass** | translúcido + velo, **filo especular** de 1px, sombra fría en capas | velo propio, tinta violeta-negra, **sin pared** — el vidrio no tiene extrusión |
| **skeuo** | degradado `#c4c0b7→#dbd7ce` (**oscuro→claro** = hundido) | degradado `#fbfaf6→#e6e3da` (**lit→body** = elevado), pared `#a8a49b`, tinta acromática |
| **adaptive** | sin degradado, **dos capas** | sin degradado, dos capas, sombra de contacto |

El degradado de skeuo va en **direcciones opuestas** en el canal y en el chip: es la misma lectura
de dos sentidos que ya distingue a skeuo en Checkbox y Select, y aquí hace que el chip parezca
literalmente encajado en la ranura.

## Animación de firma: el indicador que se desliza

**No existía nada que pudiera deslizarse.** Hoy la pestaña activa se pintaba directamente
(`data-[state=active]:bg-*`), así que hubo que introducir un elemento indicador desde cero.

Cómo funciona:

- Un `<span aria-hidden>` posicionado en absoluto dentro de la lista, medido desde la geometría
  real de la pestaña activa (`offsetLeft` / `offsetWidth`).
- Se observa **`data-state` con un `MutationObserver`**, no una prop `value`: así funciona igual
  en modo controlado y no controlado, sin que el componente tenga que saber en cuál está.
- Un `ResizeObserver` cubre las dos formas de invalidar una medición sin que cambie ningún
  estado: que el contenedor haga reflow, y que una webfont cargue después del primer pintado.
- Anima **`translate` y `width`** — `translate`, no `transform`, porque Tailwind 4 escribe ahí sus
  utilidades y una transición que nombrara `transform` no animaría nada.

**Degradación garantizada.** La lista lleva `data-slider="off"` hasta que el indicador consigue
medirse. Mientras tanto —antes de la hidratación, o con JavaScript desactivado del todo— cada
trigger sigue pintando su propio chip **exactamente como antes**. El deslizador solo toma el
relevo cuando puede posicionarse, así que la pestaña activa **nunca queda sin marcar**. Y cuando
lo toma, el chip del trigger se suprime (`group-data-[slider=on]/list:`) para que no queden dos.

**Degradación en `reduced-motion`:** el deslizamiento es adorno —la pestaña activa ya está marcada
por el color y el peso de su etiqueta— así que se elimina el recorrido por completo y el indicador
simplemente aparece donde le toca.

## Hallazgo 1 — armar la transición sin `requestAnimationFrame`

El indicador no debe deslizarse desde la esquina en su primer pintado, así que las transiciones
arrancan apagadas y se activan un commit después. Mi primera versión usaba
`requestAnimationFrame` para ese armado.

Dos problemas. Uno lo vi al medir: **en el panel de verificación rAF está congelado**, así que
`data-armed` nunca pasaba a `true`. El otro es real en producción: **rAF se estrangula hasta cero
en una pestaña de fondo**, de modo que un Tabs abierto ahí nunca se armaría y se quedaría sin
animar el resto de la vida de la página.

Reescrito como un **flag imperativo en el DOM** dentro de un efecto: no es estado de React (nunca
afecta a lo que se renderiza), no necesita un segundo render, y no depende de rAF. Además la
clase por defecto es `transition-none` y solo `data-[armed=true]` la enciende — así que si el
armado no llegara a ejecutarse nunca, el peor caso es "no anima", no "se desliza desde la esquina".

> Un intento intermedio (`setArmed(true)` dentro del efecto) lo rechazó el linter del repo:
> *"Calling setState synchronously within an effect can trigger cascading renders"*. El flag
> imperativo es también la respuesta correcta a eso.

## Hallazgo 2 — la vista previa dejaba 3 de 4 materiales sin pestaña activa

Al medir los materiales encontré que **ninguna pestaña estaba activa**: los tres triggers en
`inactive` y, en consecuencia, ningún indicador.

Causa, y es anterior a este rediseño: la vista previa monta `<Tabs defaultValue={panels[0].value}>`
**sin `key`**. `defaultValue` solo se lee al montar, pero **cada material nombra sus propios
paneles** (`Overview…`, `Session…`, `Channel A…`, `Summary…`). Al cambiar de material, la raíz
conserva el valor con el que se montó, ese valor ya no corresponde a ningún trigger, y el
componente se queda **sin pestaña activa**: sin chip, sin indicador, y con un `tablist` en el que
nada es tabulable.

Arreglado con `key={material}`. Keyed **solo** por material y no por `state`: un remount en cada
cambio de estado reconstruiría el elemento ya en su estado nuevo y el indicador no se vería
deslizarse nunca — que es exactamente la lección del piloto del Select.

**Verificado tras el arreglo:** los cuatro materiales tienen pestaña activa, indicador presente y
alineado a 0px.

## Verificación (build de producción, `getAnimations()`)

| Comprobación | Resultado |
|---|---|
| Propiedades animadas del indicador | **`translate` y `width`** — nada fantasma |
| Duración / curva | 320ms · `cubic-bezier(0.22, 1.25, 0.36, 1)` |
| ¿Interpola o salta? | interpola: de `88px` a `4px`, y **a mitad de vuelo mide `2.48px`** — se pasa del destino y vuelve, que es el resorte |
| Alineación con la pestaña activa | `dx 0`, `dy 0`, `dw 0` en los cuatro materiales |
| Chip del trigger cuando el deslizador está activo | `background-color: rgba(0,0,0,0)` — suprimido, no hay chip doble |
| `data-armed` tras montar | `"true"` |
| `aria-hidden` del indicador | `"true"` |
| Radix intacto | `role=tablist` · `role=tab` · `aria-controls` · `role=tabpanel` + `aria-labelledby` · `data-radix-collection-item` en los tres triggers |

---

# Componente 2 — Accordion

Partía de **cero sombras** y cero degradados: solo siete tokens de color por material.

## Las cuatro recetas

Mismo vocabulario que el resto de la librería: clay inflado con pared lateral y tinta marrón
cálida; glass con filo especular de 1px, tinta violeta-negra fría y sin pared; skeuo con la
superficie hecha degradado lit→body, bisel duro y tinta acromática; adaptive con dos capas y nada
más.

## Separación de profundidad abierto / cerrado

Es la pieza que pedía el encargo y la que más se nota. **Cerrado**, la fila descansa sobre su
propia pared lateral. **Abierto**, la pared se colapsa y la sombra ambiental se extiende: una fila
abierta lee como **asentada**, no como sostenida en alto.

Las dos recetas declaran **las mismas cuatro capas en el mismo orden de `inset`**, que es lo que
permite que `box-shadow` interpole en vez de intercambiarse de golpe.

## Feedback de pulsación

Una fila a todo lo ancho **no puede aplastarse con `scale`** sin parecer un fallo de render, así
que se hunde: una sombra interna en el borde superior que lee como la fila aguantando el peso del
dedo. Tinta propia por material (`--mq-press`): cálida en clay, fría en vidrio, negra en skeuo y
adaptive.

Es puro feedback —nadie tiene que leerlo— así que **`reduced-motion` lo cancela del todo**, al
contrario que el giro del chevron, que es señal de estado y conserva su estado final. Ese reparto
es el mismo que ya aprobaron los dos pilotos, que discrepaban entre sí precisamente porque animan
cosas distintas.

## Lo que NO se tocó

El giro del chevron y el despliegue por `grid-template-rows` **ya estaban bien resueltos** y se
conservan intactos, incluidos el grupo nombrado `group/trigger` del que depende la rotación.

## Verificación (build de producción)

| Comprobación | Resultado |
|---|---|
| Propiedades animadas al abrir/cerrar | **`grid-template-rows`** (panel) y **`rotate`** (chevron), 200ms — nada fantasma |
| ¿El despliegue interpola? | sí: de `58.875px` a `0px`, con `1.52px` a mitad de vuelo |
| Chevron | `180deg` ↔ `none` |
| `aria-expanded` | alterna `true`/`false` |
| Panel | `role="region"`, `aria-labelledby`, `inert` cuando está cerrado |
| Superficies por material | clay `#f6e7dd` + degradado + pared `#dcc4b2` · glass translúcido + velo, tinta `rgba(24,20,40,…)`, sin pared · skeuo degradado `#eae7df→#d3cec4` + pared `#a8a49b` · **adaptive 2 capas, sin degradado** |
| Pulsación | regla `:active` presente y coincidente; `--mq-press` distinto por material |
| Transición del trigger | `background-color, box-shadow` |
| `forced-colors` | `border-color: canvastext` + `background-image: none` + `shadow-none` en la superficie |
| `reduced-motion` | `transition-property: none` presente y coincidente |

---

# NO se regresó nada

- **Tabs / Radix:** `@radix-ui/react-tabs` sigue siendo el motor; `role="tablist"`, `role="tab"`,
  `role="tabpanel"`, `aria-controls`, `aria-labelledby` y el registro
  `data-radix-collection-item` verificados en el DOM. **No se añadió ninguna dependencia** y
  `dependencies.npm` de la entrada queda igual.
- **Accordion:** `aria-expanded`, `aria-controls`, `role="region"`, `inert` al cerrar, el botón
  dentro del encabezado y el teclado — todo intacto.
- **Animaciones preexistentes:** `grid-template-rows` y el `rotate` del chevron conservados, con
  sus listas de transición y su `motion-reduce`.
- **Contraste:** **no se cambió ningún color de texto ni de borde** en ninguno de los dos
  componentes; solo se añadieron sombras y degradados. Las cifras de las entradas siguen siendo
  válidas y por eso no se tocaron.
- **Self-containment:** `verify-registry` sigue en `selfContained:true`; toda variable nueva se
  consume con fallback literal.
- **`forced-colors`:** además de lo que ya había, ahora se limpian a mano las **imágenes de
  fondo** (que `forced-colors` **no** descarta) y las sombras, en la lista de tabs, en el
  indicador y en las superficies del accordion.

## Limpieza: dos tokens muertos

La revisión detectó que había declarado `[--mq-edge:transparent]` en `glass` y `adaptive` de los
dos componentes, pero **ninguna de sus recetas lee `var(--mq-edge)`** — el vidrio no tiene pared
lateral por definición y adaptive tampoco. Eran tokens muertos. Eliminados.

---

## Gate

```
npm run check
{"components":22,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
```

`components:22` como corresponde a un rediseño. `/components/tabs` y `/components/accordion`
siguen prerenderizándose como SSG.

---

## Para decidir arriba (fuera de mi guardarraíl)

### 1. La paleta de skeuo se ha bifurcado en la librería

Contando lo que hay hoy en `main`, **skeuo tiene cuatro superficies distintas** y **dos tintas
distintas**:

| componente | superficie skeuo | tinta |
|---|---|---|
| `select`, `checkbox` | `#e6e3da` (greige cálido) | acromática |
| `input`, `textarea` | **`#e4e7ea` (gris azulado frío)** | **`rgba(30,34,38,…)`** |
| `accordion` | `#ddd9d0` | acromática |
| `tabs` (canal) | `#cfcbc2` | acromática |

Los dos primeros grupos son incompatibles: el propio comentario de `select.tsx` dice que la tinta
acromática *"es la mitad de lo que separa a skeuo de clay a simple vista"*. Yo he seguido a la
mayoría (greige cálido, tinta acromática) y **no he tocado los archivos de Codex**, pero esto
necesita una decisión antes de que la galería se vea incoherente.

### 2. `tabIndex` del roving de Radix: todas las pestañas en `-1`

Medido: los tres triggers tienen `tabindex="-1"`, incluido el activo — es decir, **no se puede
tabular hasta el tablist**. La entrada de Tabs afirma *"un roving tabindex donde solo la pestaña
activa está en el orden de tabulación"*.

**No lo causa mi cambio**, y lo comprobé en vez de suponerlo: quitando el indicador del DOM por
completo el valor sigue siendo `-1` en los tres, los triggers están correctamente registrados como
`data-radix-collection-item`, y nada de mi diff toca el cableado de foco. Lo reporto porque es una
afirmación de accesibilidad publicada que hoy no se sostiene, no porque sea de esta ronda.

## Lo que no se pudo verificar

- **No pude ver el resultado.** Como en las rondas anteriores, la captura de pantalla del panel no
  está disponible. Toda la verificación es de **estilos computados y CSSOM** — valores exactos —
  pero no he mirado los componentes. Para un rediseño visual eso lo tiene que juzgar la revisión
  en vivo.
- **`prefers-reduced-motion` y `forced-colors` no se activaron de verdad**; se confirmó que las
  reglas existen y coinciden con los elementos reales.
- **Solo Chromium**, sin lector de pantalla real.
- El deslizamiento se disparó con eventos de puntero sintéticos. Un detalle útil que salió de ahí:
  **Radix activa la pestaña en `pointerdown`, no en `click`** — un `.click()` a secas no cambia de
  pestaña.
- La pulsación del accordion se verificó por la **regla CSS** (presente y coincidente), no
  sintetizando un `:active` real.
