# Reporte 0021 — Componente Radio Group

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-radio` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 11. Construir el Radio Group sobre inputs nativos agrupados por `name`, creando solo sus tres archivos, en paralelo con Codex que construye Slider.

## Objetivo

Añadir un grupo de opciones excluyentes al registry sin reimplementar la navegación por
flechas ni la exclusividad, y aplicando la lección de contraste de borde que salió con el
Checkbox.

## Qué se hizo

**Paso 0 (autónomo).** Mergeé los PRs #18 (Checkbox) y #19 (Progress).
`feat/component-tooltip` ya estaba borrada — el `|| true` idempotente absorbió el error.
`main` quedó en `74e3814` con las 12 entradas.

**Tres archivos, ninguno compartido:** `ui/radio.tsx`, `previews/radio-preview.tsx`,
`entries/radio.ts`. `git status` al terminar: solo adiciones.

## Cómo se hizo

### Un atributo hace casi todo el trabajo

Los `<input type="radio">` comparten un `name`. Ese único atributo da **la navegación con
flechas dentro del grupo, el tab stop único y la exclusividad mutua**, todo del navegador.
Este archivo solo dibuja.

El `name` se genera con `useId()` si no se pasa, porque sin él no hay grupo: dos radios sin
`name` compartido no se excluyen entre sí. Verificado en el HTML prerenderizado: los tres
inputs comparten `name="_R_1anav5ubtb_"`.

Una nota sobre lo que **no** demuestra nada: los tres inputs reportan `tabIndex: 0`. El tab
stop único de un grupo de radios es comportamiento nativo del navegador y no se refleja en
`tabIndex`, así que ese valor no prueba ni desmiente nada; lo digo porque a primera vista
parece un fallo y no lo es.

### Agrupación accesible

`role="radiogroup"` sobre un elemento normal, etiquetado con `aria-labelledby`, en vez de
`<fieldset><legend>`. Ambos son válidos; elegí el rol porque el fieldset trae un borde por
defecto y una colocación de `legend` que hay que deshacer antes de poder estilizarlo, y la
agrupación se anuncia igual. Verificado: el `aria-labelledby` resuelve a "Deploy target" y el
`aria-describedby` al mensaje.

**`aria-invalid` va en el grupo**, que es donde pertenece el error de un conjunto de opciones.
Eso obligó a un selector distinto al del Checkbox: el grupo es un **ancestro**, no un hermano,
así que `peer-*` (combinador `~`) no llega. Se lee con `group-data-[invalid=true]/radio:`, que
compila a un combinador de descendiente. Confirmado en el CSS emitido:
`:is(:where(.group\/radio)[data-invalid=true] *)`.

### Los dos combinadores que hay que tener claros

Esta pieza usa **tres** relaciones distintas y cada una necesita su selector:

| Qué | Relación | Selector |
| --- | --- | --- |
| input → círculo | hermanos | `peer-checked:` (`~`) |
| círculo → punto | ancestro→descendiente | custom property heredada (`--mq-on`) |
| grupo → círculo | ancestro→descendiente | `group-data-[…]/radio:` (espacio) |
| input → tarjeta | descendiente→ancestro | `has-[:checked]:` (`:has()`) |

El punto vive **dentro** del círculo, así que `peer-*` nunca lo alcanzaría; el círculo (que sí
es hermano del input) traduce el estado a `--mq-on`, que el punto lee por herencia. Y la
tarjeta del variant `card` es **ancestro** del input, así que solo `:has()` puede subir. Las
cuatro reglas verificadas en el CSS emitido.

### Contraste

Calculado con la fórmula WCAG sobre los valores fuente y contrastado contra los computados en
el DOM, que coincidieron.

**Borde del radio sin seleccionar** — un radio vacío se identifica *solo* por su borde, así
que WCAG 1.4.11 se lo exige. Reutilicé los valores ya corregidos en el Checkbox:

| Material | vs. su superficie | vs. la página |
| --- | --- | --- |
| clay | 3.32:1 | 3.09:1 |
| glass | 3.72:1 (peor fondo) | 5.42:1 |
| skeuo | 3.65:1 | 4.07:1 |
| adaptive | 4.66:1 | 4.05:1 |
| adaptive oscuro | 4.98:1 | — |

**Punto de selección** sobre el control relleno (indicador no textual, ≥3:1): clay 6.44:1,
glass 10.15:1, skeuo 13.1:1, adaptive 16.32:1, adaptive oscuro 15.48:1.

**Mensaje de error:** 6.42:1 o más sobre papel y blanco. La etiqueta hereda `currentColor`.

### Cobertura de transición

Círculo: `transition-[background-color,border-color]`. Punto: `transition-[opacity]`. Tarjeta:
`transition-[box-shadow]`. Nada más cambia entre estados.

## Resultado esperado vs. real

- **Esperado:** Radio en el registry, `/components/radio` estática, `verify-registry` con
  `components:13`. **Real:** cumplido.

## Bugs / obstáculos y cómo se resolvieron

1. **El variant `card` era prácticamente invisible.** Al medirlo, el relleno de la tarjeta
   daba **1.05:1** contra el papel de Morphiq (clay) y el borde **1.56:1** — o sea, un
   rectángulo que no se ve, que es exactamente lo contrario de lo que un "card" debe hacer.
   Reforcé los bordes de tarjeta a ≥3:1 contra la página. Para clay hubo que **cambiar la base
   del color**: incluso a alfa 0.6 la base cálida original solo llegaba a 2.7:1, así que pasé
   a una base más oscura.
2. **La corrección anterior creó un problema nuevo, y lo detecté midiendo otra vez.** Mi
   primer diseño ponía el borde de la tarjeta seleccionada en `--mq-fill`; con el borde neutro
   ya reforzado, eso significaba que **seleccionar volvía la tarjeta menos visible** (clay:
   3.46:1 sin seleccionar → 1.92:1 seleccionada). Lo cambié por un anillo interior en el color
   de acento que se *añade* al borde fuerte, sin desplazar el layout. El indicador autoritativo
   del estado sigue siendo el radio, que es conforme; el anillo es refuerzo.
3. **Bug real en mi preview: al cambiar de material no quedaba nada seleccionado.** Cada
   material documenta un juego de opciones distinto (`preview/staging/production` vs
   `private/team/link`…), y el grupo es no controlado: al cambiar de material, el estado
   interno conservaba el valor anterior, que no existe en el nuevo juego, así que el grupo
   renderizaba sin selección. Detectado porque en la barrida por materiales solo clay mostraba
   el relleno de seleccionado. Resuelto con `key={material}` para que el grupo se vuelva a
   montar. **Es un fallo del preview, no del componente** — un grupo no controlado no puede
   saber que le cambiaron las opciones bajo los pies.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), en `feat/component-radio`:

- `registry:gen` — 13 entradas, `radio` incluida.
- `lint` ✅ · `typecheck` ✅ · `test:studio` ✅ · `build` ✅ sin warnings.
- `test:registry` — ✅ `{"components":13,"selfContained":true,"guards":"ok","status":"ok"}`.
- `/components/radio` entre las rutas `● (SSG)`.

Verificación funcional contra el **build de producción** (`npm run start`):

- **CSS emitido:** las cuatro relaciones de selector confirmadas —`:checked~*`,
  `--mq-on:1` + `opacity:var(--mq-on`, `:has(:checked)` y
  `:is(:where(.group\/radio)[data-invalid=true] *)`.
- **Estructura:** `role="radiogroup"`, `aria-labelledby` y `aria-describedby` resuelven, 3
  radios con un único `name`, cada uno envuelto en `<label>`, 3 círculos `aria-hidden`.
- **Exclusividad nativa:** seleccionar el tercero deselecciona el segundo; el punto pasa de
  `[0,1,0]` a `[0,0,1]` y `--mq-on` con él.
- **Borde sin seleccionar:** `rgba(120,80,55,0.7)` en vivo — la corrección aplicada.
- **Variantes:** `default` sin borde ni padding; `card` con superficie, borde
  `rgba(51,38,30,0.55)`, radio 12px y anillo en la seleccionada.
- **Tamaños:** círculo 16/18/22 px, texto 12/13/14.
- **Materiales:** los cuatro rellenos y bordes coinciden con lo escrito, y tras el arreglo del
  preview los cuatro muestran la opción 1 seleccionada.
- **Estados:** `Error` → `aria-invalid="true"` en el grupo y borde `#9c2f22` en los controles;
  `Disabled` → los tres inputs deshabilitados; `Focus` → un `data-focus`.

**Lo que no verifiqué:** sin revisión visual pixel a pixel (la captura del entorno sigue dando
timeout). **No pude probar la navegación con flechas con pulsaciones reales** — el arnés
entrega eventos de teclado con `key` vacío (documentado en el reporte 0006), así que sintetizar
`ArrowDown` no hace nada. La exclusividad sí la verifiqué con clics reales. Las flechas son
comportamiento nativo del navegador para radios con `name` compartido y aquí no hay ningún
manejador propio que pueda interferir, pero lo digo en vez de afirmar que lo probé.

## Riesgos, deuda y pendientes

- **Los bordes de tarjeta son ahora bastante marcados** (≥3:1 contra la página). Es lo que
  hace que el variant se vea, pero es un cambio de carácter respecto a las superficies suaves
  del resto de la librería. Si el diseño prefiere algo más discreto, la alternativa es
  aumentar el contraste del **relleno** de la tarjeta en vez del borde.
- **El anillo de selección del card usa `--mq-fill`**, que en clay mide 1.92:1 contra la
  página. No es una infracción —el estado lo comunica el radio, que sí es conforme— pero es
  refuerzo débil en ese material concreto.
- **`RadioGroup` no controlado con opciones cambiantes** deja una selección huérfana (punto 3).
  Podría defenderse solo: si el `value` actual no coincide con ningún hijo, limpiarlo. No lo
  implementé porque requiere que el grupo inspeccione a sus hijos, lo que acopla el
  contenedor a la forma de los ítems; el `key` en el sitio de uso es la solución idiomática.
  Queda anotado por si aparece en un consumidor real.
- **La rama `feat/component-progress` quedó mergeada pero sin borrar.** No la toqué porque el
  prompt pedía borrar `feat/component-tooltip` (que ya no existía) y no la menciona; confirmo
  que se puede borrar sin pérdida.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0020.

## Estado final

Completo. Radio Group entregado con 4 materiales × 2 tratamientos × 3 tamaños sobre inputs
nativos agrupados por `name`, con el borde del control conforme a 1.4.11 en los cuatro
materiales, gate verde con `components:13` y sin tocar un solo archivo compartido.
