# Reporte 0029 — Rediseño táctil: Checkbox y Radio

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `redesign/checkbox-radio` · **Commit final:** ver PR
- **Tipo:** refactor visual (rediseño, sin cambio de comportamiento)
- **Prompt recibido:** Rediseño táctil de Checkbox y Radio al estándar ya validado con los pilotos Select y Toggle. Los dos estaban entre los más planos (0–1 sombras, sin movimiento). Aviso explícito: son controles de 16–22px y la distinción entre materiales **debe leerse aún a ese tamaño**.

## Paso 0

PRs #27 (Select) y #26 (Toggle) mergeados por mí. `main` al día, **22 entradas** confirmadas,
rama `redesign/checkbox-radio` desde `main`, `npm ci` y `npm run check` verde en preflight
(`components:22`).

## Qué se hizo

- `src/registry/ui/checkbox.tsx` — cuatro recetas reales, palomita con resorte, guion animado,
  pop de pulsación.
- `src/registry/previews/checkbox-preview.tsx` — **añadido un espécimen sin marcar** (ver más
  abajo: sin él el rediseño era literalmente invisible en la galería).
- `src/registry/entries/checkbox.ts` — solo el texto `a11y` (cifras remedidas + contrato de
  movimiento).
- `src/registry/ui/radio.tsx` — cuatro recetas reales, punto con resorte, pop de pulsación.
- `src/registry/entries/radio.ts` — solo el texto `a11y`.
- `docs/reports/0029-redesign-checkbox-radio.md` — este reporte.

`src/registry/previews/radio-preview.tsx` **no se tocó**: ya muestra un grupo con un radio
seleccionado y dos sin seleccionar, así que los anillos vacíos —donde vive la mitad del trabajo
de material— ya se veían.

Nada compartido. Ni `globals.css`, ni `schema.ts`, ni `package.json`, ni otro componente.

## El punto de partida

Ambos eran **color y nada más**: cero sombras, cero gradientes, cero movimiento salvo un fundido
de opacidad de 150ms. Los cuatro materiales se distinguían solo por el tono del relleno.

---

# La parte difícil: que se distingan a 16–22px

Un control de 18px no tiene sitio para una pila de sombras suaves. La lección de este rediseño
es que **a este tamaño la diferencia tiene que ser estructural, no tonal**: la dirección de un
degradado, la presencia o ausencia de una pared lateral, la temperatura de la tinta. Esas se
leen de un vistazo; cuatro capas de sombra difusa a 0.1 de alfa, no.

Lo que se usó, y por qué sobrevive al tamaño:

| | superficie | estructura que lo delata a 18px | tinta |
|---|---|---|---|
| **clay** | plana cálida `#f7e9de` | **pared lateral dura** `0 2px 0 #e6cdb9` — 2px sobre 18px es más del 10% del alto | marrón cálido, **nunca negro** |
| **glass** | translúcida + **velo** `rgba(255,255,255,0.60)→0.04` | **filo especular** de 1px al 0.98 arriba | violeta-negra fría `rgba(24,20,40,…)` |
| **skeuo** | **degradado `#dad6cc → #f2efe7`** | va de **oscuro a claro**: bajo una luz cenital eso lee como **hundido** | acromática (negro/blanco puros) |
| **adaptive** | plana | **dos capas**, sin degradado, sin pared | neutra |

La inversión del degradado de skeuo es la pieza clave. Con la parte sombreada arriba, la caja
vacía deja de ser "otro pad levantado" y pasa a ser un **pozo mecanizado** — el contraste más
inmediato posible contra el inflado de clay, y perfectamente legible a 16px.

**El vidrio no lleva `backdrop-blur`.** Es una divergencia deliberada respecto a los dos
pilotos, que sí lo llevan. A 16–22px un desenfoque de fondo es indistinguible de un color de
fondo translúcido, y cuesta una capa de compositor **por casilla** en una página que puede tener
docenas. El velo y el filo hacen el trabajo que el desenfoque no haría. Dicho claro para que se
pueda revertir si el dueño prefiere coherencia literal con los pilotos.

---

# Componente 1 — Checkbox

## Animación de firma

**La palomita entra con resorte**, no con un fundido: `scale` + `opacity` sobre
`cubic-bezier(0.22,1.55,0.36,1)` a 200ms. La caja **se hincha bajo el puntero** (`scale 1.06`) y
**se aplasta al pulsar** (`scale 0.92`).

`scale`, no `transform`: Tailwind 4 escribe las utilidades de escala en la propiedad
independiente, así que una transición que nombrara `transform` no animaría nada.

**El guion del estado mixto se anima con `@keyframes` propios**, no con una transición, y la
razón es una diferencia real de ciclo de vida: la palomita está **siempre montada** y solo
oculta, así que puede transicionar; el guion **solo existe mientras el control está mixto**, y
una transición no tiene desde dónde arrancar en el fotograma en que un elemento aparece. Los
keyframes viajan dentro del componente vía el izado deduplicado de React 19 — **verificado: 3
casillas en la página emiten 1 sola regla y 1 sola etiqueta `<style>`**.

Eso también es por lo que **sobrevive la regla de "se renderiza exactamente una marca"**: era
tentador renderizar las dos y dejar que compitieran reglas `peer-*`, pero el comentario original
explica que el orden de emisión de Tailwind decidiría el ganador. Se conserva.

## Degradación en `reduced-motion` — y por qué es distinta para cada cosa

Los dos pilotos hacen cosas opuestas aquí, y **los dos están aprobados**: Select conserva el
estado final, Toggle cancela el suyo. No es una contradicción, es que animan cosas distintas, y
este componente necesita las dos:

- **La palomita conserva su estado final.** Es lo que dice "marcado". Solo pierde el recorrido.
- **El pop de pulsación se cancela del todo** (`motion-reduce:peer-active:scale-100`). Es puro
  feedback; nadie tiene que leerlo.

---

# Componente 2 — Radio

## Animación de firma

**El punto entra con resorte desde un quinto de su tamaño** (`scale 0.2 → 1`) sobre
`cubic-bezier(0.34,1.56,0.64,1)` a 250ms — una curva más elástica que la de la palomita, porque
el punto es más pequeño (7px en `md`) y necesita más gesto para leerse. **El anillo responde con
un cambio de profundidad** en el mismo movimiento: la sombra pasa de la receta vacía a la llena.

Mismo pop de pulsación en el anillo, y el mismo reparto en `reduced-motion`: el punto conserva
su estado final, la pulsación se cancela.

---

# Verificación (build de producción, `getAnimations()`)

Cancelando o terminando las transiciones antes de leer estilos, porque el compositor del panel
está congelado.

> **Nota de método.** La primera pasada de medición dio un resultado absurdo — los cuatro
> materiales con el relleno coral de clay. No era un bug del componente: había leído los estilos
> **sin** terminar las transiciones en vuelo, así que `background-color` y `box-shadow` (las dos
> propiedades que ahora animo) devolvían su valor **inicial**, mientras `background-image` (que
> deliberadamente no se anima) se actualizaba al instante. El artefacto es exactamente el que ya
> mordió en rondas anteriores; lo dejo escrito porque es la trampa más fácil de repetir.

## Los cuatro materiales, medidos en la caja **vacía**

| material | `background-color` | `background-image` | capas propias | capa que lo delata |
|---|---|---|---|---|
| clay | `rgb(247,233,222)` | ninguna | 4 | `rgb(230,205,185) 0 2px 0` — la pared |
| glass | `rgba(255,255,255,0.66)` | velo `0.6 → 0.04` | 4 | filo `rgba(255,255,255,0.98) 0 1px 0 inset` |
| skeuo | `rgb(230,227,218)` | **`rgb(218,214,204) → rgb(242,239,231)`** | 4 | pozo `rgba(0,0,0,0.34) 0 2px 3px inset` |
| adaptive | plano | ninguna | 2 | solo contacto |

(El degradado de skeuo sale **oscuro arriba, claro abajo**: confirmado el hundido.)

## Movimiento

| Comprobación | Resultado |
|---|---|
| Propiedades animadas de la caja/anillo | `background-color`, `border-*-color`, `box-shadow` (150ms) |
| Propiedades animadas de la marca/punto | `opacity`, `scale` — nada fantasma |
| Palomita | `scale 0.4 → 1`, `opacity 0 → 1`, 200ms |
| **Overshoot de la palomita** | **1.016** a 150ms (se pasa de 1 y vuelve) |
| Punto del radio | `scale 0.2 → 1`, `opacity 0 → 1`, 250ms |
| **Overshoot del punto** | **1.078**, pico a 140ms |
| Pop de pulsación | regla `scale: 0.92` sobre `:active ~ *`, presente y coincidente |
| `reduced-motion` | `transition-none` + `scale-100` en hover **y** active (pulsación cancelada) |
| `forced-colors` | `border-color: canvastext`, `background-color: canvas` (caja) y `canvastext` (punto) — **colores de sistema opuestos**, más `background-image: none` y `shadow-none` |
| Keyframes del guion | **1 regla y 1 `<style>`** con 3 casillas en la página |

`scale` está en la lista de transición de la caja pero no aparece en la lista de animaciones al
marcar: es correcto, solo cambia en hover y al pulsar. No es fantasma — cambia de verdad, en
otro estado.

---

# NO se regresó nada

## Contraste — remedido, no heredado

Cambié superficies, así que **todo se volvió a medir**. Y el titular es que **la cifra más
ajustada del componente mejoró**:

| Medida | Antes | Ahora |
|---|---|---|
| Borde sin marcar, clay, contra su caja | 3,32:1 | **3,68:1** |
| Borde sin marcar, clay, contra la página | **3,09:1** | **3,80:1** |
| Borde sin marcar, skeuo (extremo oscuro) | — | 4,28:1 / 5,40:1 |
| Marca sobre relleno, mínimo | 6,44:1 (clay) | **5,03:1** (vidrio, cima del velo) |
| Marca sobre relleno, máximo | 16,32:1 | 16,32:1 |

El borde de clay se subió de **0,70 a 0,78** de alfa **precisamente para pagar** la caja más
cálida y oscura. Sin eso, warming la superficie habría dejado el borde en **3,13:1** — rozando
el suelo. Con eso, la lectura más cercana del componente pasó de 3,09:1 a 3,80:1.

El mínimo de la marca **bajó** de 6,44 a 5,03 porque el velo del vidrio aclara ligeramente el
relleno bajo una marca blanca. Sigue muy por encima del 3:1 y está dicho tal cual en la entrada;
no lo presento como mejora.

Donde un material pinta un degradado, la medición se toma **en su peor punto**, no en un
promedio: extremo oscuro para el pozo vacío de skeuo, extremo iluminado para la marca encima.

**23 combinaciones, 0 fallos.**

## Comportamiento y a11y (verificado en el DOM del build)

| Invariante | Estado | Evidencia |
|---|---|---|
| `<input type="checkbox">` / `type="radio"` nativos | intacto | `type` = `checkbox` / `radio` |
| Input real superpuesto (área de clic, foco, teclado) | intacto | `opacity: 0`, `position: absolute` |
| `CheckboxField` y asociación de etiqueta | intacto | los 3 especímenes envueltos en `<label>`, `aria-describedby` en el campo |
| `indeterminate` por ref | intacto | tercer espécimen `indeterminate: true` |
| Exactamente una marca por caja | intacto | verificado: 1 `<svg>` por caja |
| Marca / punto decorativos | intacto | `aria-hidden="true"` en los 3 |
| `aria-invalid` única fuente del error | intacto | sin cambios en esa ruta |
| Radios agrupados por `name` (flechas, tab stop único, exclusividad) | intacto | 3 radios, **mismo `name`**, exactamente 1 `checked` |
| `role="radiogroup"` con etiqueta | intacto | `role=radiogroup`, con nombre accesible |
| Controlado / no controlado | intacto | no se tocó esa lógica |
| Self-containment | intacto | `verify-registry` `selfContained:true`; toda variable con fallback literal |

**Añadido, no quitado, en `forced-colors`:** las sombras se descartan solas, pero **las imágenes
de fondo no**. El degradado de skeuo y el velo de vidrio ahora se limpian a mano
(`forced-colors:[background-image:none]` + `forced-colors:shadow-none`), o habrían quedado sobre
una superficie de color de sistema para la que nunca se diseñaron.

## El preview del Checkbox no mostraba ninguna casilla vacía

Merece su propio apartado porque casi se me pasa. La galería mostraba **una casilla marcada y
una mixta**, y ninguna vacía. El rediseño pone la mayor parte del carácter de cada material en
**la caja vacía** — el pad inflado de clay, el pozo de skeuo, el frost del vidrio — así que el
trabajo habría sido *literalmente invisible* en la única superficie donde el dueño lo revisa.

Añadido un tercer espécimen sin marcar. Ahora se ven vacía / llena / mixta en fila.

---

## Gate

```
npm run check
{"components":22,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
```

`components:22` como corresponde a un rediseño. `/components/checkbox` y `/components/radio`
siguen prerenderizándose como SSG.

## Lo que no se pudo verificar

- **No pude ver el resultado.** Igual que en el piloto del Select, la captura de pantalla del
  panel no está disponible; toda la verificación es de **estilos computados y CSSOM**, que da
  valores exactos. Puedo demostrar que cada capa vale lo que dice y que los cuatro materiales
  difieren estructuralmente, **no que el conjunto se vea bien a 18px** — que es justamente el
  riesgo que el prompt señalaba. Es lo que la revisión en vivo tiene que juzgar.
- **`prefers-reduced-motion` y `forced-colors` no se activaron de verdad**; se confirmó que las
  reglas existen y coinciden con los elementos reales.
- **Solo Chromium.** Sin lector de pantalla real.
- El hover y la pulsación se verificaron por las **reglas CSS** (presentes y coincidentes con el
  elemento), no sintetizando eventos de puntero.
- **`pointer-coarse` sin decidir.** Select le puso `min-h-[48px]` a adaptive; Toggle no lleva
  nada. Estos controles miden 16–22px y el área táctil real la da el `<label>` que los envuelve,
  que sí es grande — pero **no lo he medido** y no he añadido densidad por puntero para no
  divergir de los pilotos por mi cuenta. Lo dejo señalado para que se decida arriba.
