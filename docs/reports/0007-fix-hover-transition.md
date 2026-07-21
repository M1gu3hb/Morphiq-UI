# Reporte 0007 — Fix `translate`/`transform` en hover/active + guard estático

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `fix/hover-transition` (desde `main`) · **Commit final:** ver PR
- **Tipo:** fix
- **Prompt recibido:** Fase 1, Ronda 4. Corregir en `button.tsx` y `card.tsx` la transición que anima `transform` cuando el movimiento real ocurre en `translate`, y añadir un guard estático en `scripts/verify-registry.mjs` para que no reaparezca.

## Objetivo

Que la elevación al hover y el hundido al presionar de Button y Card se animen de verdad en
vez de saltar, y dejar una comprobación automática que impida que el mismo error vuelva a
entrar en cualquier componente futuro del registry.

## Qué se hizo

**Paso 0 (autónomo).** `main` no tenía el Toggle todavía. Mergeé el PR #5 yo mismo
(`gh pr ready 5`, `gh pr merge 5 --merge --delete-branch`), hice `git pull` y confirmé que
`button.tsx`, `card.tsx`, `toggle.tsx` y `scripts/verify-registry.mjs` estaban presentes y
que el registry tenía las 3 entradas. `main` quedó en `9b2783f` con el gate en verde antes
de ramificar.

**Tarea 1 — el fix.** Una línea en cada archivo:

```
- transition-[transform,box-shadow,background-color,backdrop-filter]
+ transition-[translate,box-shadow,background-color,backdrop-filter]
```

`transform` se eliminó en vez de dejarse junto a `translate` porque **ninguno de los dos
archivos usa `transform` para nada**: verificado con grep de `transform`, `rotate-`,
`scale-`, `skew-`, `[transform:`, `perspective`, `origin-` y `preserve-3d` — cero
coincidencias fuera de la propia lista de transición. Estaba animando una propiedad que el
componente nunca escribe. No se cambió ningún valor de diseño.

**Tarea 2 — el guard.** `transitionPropertyLeaks()` en `scripts/verify-registry.mjs`, más
sus auxiliares `styleTokens`, `isStateScopedTranslate`, `arbitraryTransitionProperties` y
`transitionCoversTranslate`. Se ejecuta por cada `sourcePath` del registry y falla con
archivo y línea.

## Cómo se hizo

### La causa

En Tailwind 4 las utilidades `translate-*` **no** escriben `transform`; escriben la propiedad
CSS independiente `translate`. Comprobado en el CSS emitido:

```css
.translate-x-0{--tw-translate-x:0px;translate:var(--tw-translate-x) var(--tw-translate-y)}
```

Así que `transition-[transform,…]` junto a `hover:-translate-y-[2px]` declara una transición
sobre una propiedad que nunca cambia. El navegador no tiene nada que interpolar y el
movimiento aparece de golpe.

**Matiz importante que descubrí y que condicionó el diseño del guard:** solo la forma
*arbitraria* cae en la trampa. Las utilidades con nombre sí incluyen `translate` — extraído
del propio Tailwind:

```
transition-transform  ->  transition-property: transform, translate, scale, rotate
transition (bare)     ->  …, transform, translate, scale, rotate, filter, …
transition-all        ->  all
```

Es decir, `transition-transform` habría funcionado; `transition-[transform]` no. El guard
tiene que distinguirlas o produciría falsos positivos sobre código correcto.

### Cómo verifiqué que ahora sí anima

No me fié del build. El problema es que el panel de vista previa de este entorno tiene el
renderizador throttleado —`requestAnimationFrame` directamente no dispara: una sonda que
contaba frames durante 250 ms se quedó colgada hasta el timeout—, así que **muestrear el
valor a mitad de la transición no prueba nada aquí**: el reloj no avanza y el valor se queda
congelado en el inicial. Es el mismo artefacto que ya documenté en los reportes 0004 y 0006.

La prueba que sí es concluyente e independiente del reloj: preguntarle al navegador si
*creó* una transición. Al cambiar la propiedad, `element.getAnimations()` devuelve el objeto
`CSSTransition` correspondiente si —y solo si— esa propiedad está en `transition-property`.

Resultado en el DOM real, para los dos componentes:

| Componente | `transitionProperty` computada | Al cambiar `translate` | Al cambiar `transform` |
| --- | --- | --- | --- |
| Button | `translate, box-shadow, background-color, -webkit-backdrop-filter, backdrop-filter` | `CSSTransition` sobre `translate`, `running`, 200 ms | ninguna |
| Card | idéntica | `CSSTransition` sobre `translate` | ninguna |

Como control, cambiar `box-shadow` en el Button sí crea su `CSSTransition` — o sea, la
sonda distingue correctamente propiedades dentro y fuera de la lista. Antes del fix el
resultado habría sido el inverso: transición sobre `transform` (que nunca cambia) y ninguna
sobre `translate`.

### Cómo funciona el guard

Por cada `sourcePath` recoge los tokens de clase que la suite ya considera "estilo"
(argumentos de `cn`/`clsx`/`cva`/`tv` y atributos `className`) y falla solo si se cumplen
las tres cosas a la vez:

1. hay algún `translate-*` aplicado **bajo una variante** (`hover:`, `active:`,
   `data-[state=…]:`, …), es decir movimiento pensado como cambio de estado y no como
   desplazamiento estático;
2. hay algún `transition-[…]` arbitrario que nombra `transform`, que es el autor pidiendo
   explícitamente que ese movimiento se anime;
3. **nada** en el archivo cubre `translate`.

"Cubre `translate`" incluye `transition`, `transition-all` y `transition-transform`, porque
las tres expanden a listas que ya lo contienen (ver arriba). Solo la forma arbitraria se
compara literalmente.

**La unidad es el archivo, no el literal.** Las clases de un componente se reparten entre la
base de `cva`, sus `variants` y sus `compoundVariants`, así que la transición y el
`translate` del mismo elemento viven rutinariamente en literales distintos. Un guard
por-literal no habría detectado justo el bug que existe para detectar.

### Riesgo de falso positivo, y cómo se acota

El caso que podría dar falso positivo: un archivo donde un elemento anime un `transform` real
(rotate/scale) mientras **otro** elemento distinto haga `translate` de estado sin querer
animarlo. Hoy ningún componente hace eso. Se acota de tres formas:

- La condición 2 exige que alguien nombre `transform` explícitamente: un archivo que
  simplemente nunca transiciona su `translate` no se toca — es una decisión legítima.
- La condición 3 silencia el guard en cuanto algo cubra `translate`.
- Escape explícito documentado: el marcador `mq-allow-untransitioned-translate` en un
  comentario desactiva la comprobación para ese archivo. Es greppable, a diferencia de
  aflojar la regla para todos.

### Verificación del propio guard

No basta con que pase; hay que probar que **falla cuando debe**. Matriz ejecutada:

| Escenario | Resultado |
| --- | --- |
| Los 3 componentes corregidos | ✅ pasa — `{"components":3,…,"status":"ok"}` |
| Bug reinyectado en `button.tsx` | ✅ falla · `src/registry/ui/button.tsx:63 … (first at line 69)` |
| Bug reinyectado en `card.tsx` | ✅ falla · `src/registry/ui/card.tsx:77 … (first at line 86)` |
| Marcador de opt-out con el bug presente | ✅ pasa (escape honrado) |

Los archivos manipulados se restauraron desde copia en cada caso, y el estado final quedó
limpio (`node scripts/verify-registry.mjs` → `status:"ok"`).

**El Toggle es un control negativo real, no un aprobado vacío.** Verificado sin tocar el
archivo: `toggle.tsx` sí tiene un `translate` de estado
(`data-[state=checked]:translate-x-[var(--mq-travel,20px)]`), o sea que **llega** a la
comprobación de cobertura, y pasa precisamente porque su lista es
`transition-[translate,background-color]`. Si el guard estuviera mal escrito, el Toggle
saltaría.

Un detalle que salió en esta verificación: el guard reportaba cada hallazgo **dos veces**.
Causa: `styleLiterals` alcanza el mismo literal por dos caminos —la llamada `cva(...)` y otra
vez a través del identificador `buttonVariants` dentro de `cn(buttonVariants(...))`—. Se
resolvió deduplicando los tokens por posición en el fuente y ordenándolos, que además hace
estable el "first at line". `globalClassLeaks` ya tenía que lidiar con lo mismo por su cuenta.

## Resultado esperado vs. real

- **Esperado:** hover/active animados en Button y Card, guard que pasa con los 3 componentes
  y atrapa la regresión. **Real:** cumplido y verificado en el DOM real, no solo compilando.
- **Diferencia:** el prompt planteaba dejar `transform` si se usaba de verdad. No se usa en
  ninguno de los dos archivos, así que se eliminó, según la propia instrucción.

## Bugs / obstáculos y cómo se resolvieron

1. **Hallazgos duplicados del guard** (detallado arriba): `styleLiterals` visita el mismo
   literal dos veces. Solución: deduplicar por posición.
2. **La prueba de interpolación no es posible en este entorno.** `requestAnimationFrame` no
   dispara en el panel de vista previa (la sonda de frames se colgó hasta el timeout), así
   que las transiciones no avanzan y muestrear valores intermedios devuelve siempre el valor
   inicial. Solución: cambiar a una prueba independiente del reloj con `getAnimations()`,
   que además es más precisa porque responde exactamente a la pregunta "¿el navegador
   transiciona esta propiedad?".

## Verificación (gate)

`npm run check` en verde (**exit code 0**), corrido antes de empezar y tras los cambios.

- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios.
- `npm run test:studio` — ✅ `{"templates":5,…,"status":"ok"}`.
- `npm run test:registry` — ✅ `{"components":3,"selfContained":true,"guards":"ok","status":"ok"}`,
  ya **incluyendo el guard nuevo**.
- `npm run build` — ✅ Next 16.2.10 Turbopack, 10 páginas, sin warnings, con
  `/components/button`, `/components/card` y `/components/toggle` bajo `● (SSG)`.

## Riesgos, deuda y pendientes

- **El guard es sintáctico, no semántico.** Ve tokens de clase, no CSS resuelto. No detecta,
  por ejemplo, un `transition` correcto anulado más tarde por `tailwind-merge`, ni clases
  construidas dinámicamente (que además Tailwind tampoco generaría). Es la clase de error
  para la que sirve, no una garantía general.
- **Solo cubre `translate` vs `transform`.** La misma familia de error existe para
  `scale-*` y `rotate-*`, que en Tailwind 4 también escriben propiedades independientes
  (`scale`, `rotate`). Hoy ningún componente las usa; cuando alguno lo haga, extender
  `isStateScopedTranslate` a esas dos es casi copiar y pegar. Lo dejo anotado en vez de
  añadir código sin caso de uso.
- **Observación fuera del alcance, no la toqué:** `button.tsx` anima `hover:brightness-[1.08]`
  en el material `skeuo`, pero `filter` no está en su lista de transición, así que ese brillo
  también salta. Es exactamente el mismo patrón de error con otra propiedad. No entra en el
  encargo de esta ronda (que es `translate`/`transform`) y cambiarlo alteraría la sensación
  del material, así que lo reporto para que el orquestador decida.
- **No hay revisión visual pixel a pixel** (la captura de pantalla del entorno sigue dando
  timeout) ni prueba de interpolación real; ver arriba por qué, y qué se hizo en su lugar.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0006.

## Estado final

Completo. Fix aplicado y verificado en los dos componentes, guard integrado al gate y probado
en sus cuatro escenarios (pasa limpio, atrapa ambos bugs reinyectados, honra el opt-out), sin
tocar ningún archivo fuera del guardarraíl.
