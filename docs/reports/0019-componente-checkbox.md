# Reporte 0019 — Componente Checkbox

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-checkbox` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 10. Construir el Checkbox sobre un `<input type="checkbox">` nativo, creando solo sus tres archivos, en paralelo con Codex que construye Progress.

## Objetivo

Añadir una casilla de producción al registry sin reimplementar teclado ni foco, incluyendo el
estado mixto, y con la caja dibujada gobernada por el propio input.

## Qué se hizo

**Paso 0 (autónomo).** Mergeé los PRs #16 (Accordion) y #17 (Tooltip). `feat/component-avatar`
ya estaba borrada (el `|| true` idempotente absorbió el error). `main` quedó en `82025a4` con
las 10 entradas.

**Tres archivos, ninguno compartido:** `ui/checkbox.tsx`, `previews/checkbox-preview.tsx`,
`entries/checkbox.ts`. `git status` al terminar: solo adiciones.

## Cómo se hizo

### El input manda; la caja solo dibuja

El `<input type="checkbox">` no se sustituye: se vuelve transparente y se coloca **exactamente
encima** de la caja dibujada (`absolute inset-0 size-full opacity-0`). Conserva el área de
pulsación, el foco, el teclado, el envío del formulario y la asociación con la etiqueta.

Lo importante es que **el estado visual lo dirigen las pseudoclases nativas**, no una copia en
React: `peer-checked:` y `peer-indeterminate:` pintan el relleno. No hay estado espejo que
pueda desincronizarse de lo que la tecnología de asistencia oye.

### Un bug que evité antes de compilar

La primera versión ponía `peer-checked:opacity-100` en los SVG de la marca. **No habría
funcionado nunca**: `peer-*` genera un combinador de hermano general (`~`), y los SVG son
*descendientes* de la caja, no hermanos del input. La caja sí es hermana, así que la solución
fue que la caja traduzca el estado del peer a una custom property heredable:

```
caja:  [--mq-tick:0]  peer-checked:[--mq-tick:1]
marca: opacity-[var(--mq-tick,0)]
```

Confirmado en el CSS emitido:
`.peer-checked\:\[--mq-tick\:1\]:is(:where(.peer):checked~*){--mq-tick:1}` — el `~ *` apunta a
la caja, y la marca lee la variable por herencia. Verificado en vivo: la variable pasa de `1`
a `0` al desmarcar y la marca de `1` a `0` de opacidad.

**Se renderiza una sola marca a la vez.** Dibujar el tick y el guion a la vez y dejar que dos
reglas `peer-*` compitieran habría dependido del orden en que Tailwind las emite; el estado
mixto es una prop que ya conozco, así que la elección se hace en el JSX, donde es explícita.

### `indeterminate`

Es una **propiedad del DOM, nunca un atributo**, así que React no puede ponerla en JSX. Se
expone como prop y se escribe en el nodo en un efecto, con un ref propio fusionado con el que
pase el llamador. Se reaplica también cuando cambia `checked`, porque alternar la casilla borra
el estado mixto de forma nativa. Verificado en vivo: `input.indeterminate === true` y
`matches(':indeterminate') === true`, con la caja rellena.

### API de label y error

Misma forma que `InputField`, para que la librería se lea igual:

- **`Checkbox`** — el control solo. Necesita nombre de algún sitio (`aria-label`,
  `aria-labelledby`, o un `<label htmlFor>` externo).
- **`CheckboxField`** — la fila envuelta en un `<label>` real. Envolver en vez de usar
  `htmlFor` significa que la asociación no depende de ids coincidentes y que **toda la fila,
  texto incluido, es área de pulsación**.

`aria-describedby` se compone en vez de sobrescribirse; `aria-invalid` es la **única** fuente
del aspecto de error (`peer-aria-[invalid=true]:border-[var(--mq-error)]`), así que lo pintado
y lo anunciado no pueden divergir. La región del mensaje va siempre montada, incluso vacía,
por la misma razón que en Input: una región `aria-live` tiene que existir antes de que llegue
el texto.

La marca es `aria-hidden`: el input nativo ya expone *checked* y *mixed*, y anunciarlo dos
veces competiría con el nombre del control.

### `forced-colors`

En ese modo se descartan todos los rellenos, así que una caja que solo dijera "marcada" con su
fondo se leería vacía. Por eso **el estado lo lleva la propia marca**: se dibuja con
`CanvasText` y se muestra por **opacidad**, que `forced-colors` no anula. El borde pasa a
`CanvasText` para que la caja siga siendo perceptible.

### Contraste

Calculado con la fórmula WCAG sobre los valores fuente y contrastado contra los colores
computados en el DOM, que coincidieron.

**Marca sobre la caja rellena** (indicador no textual, ≥ 3:1):

| Material | Ratio |
| --- | --- |
| clay | 6.44:1 |
| glass | 10.15:1 (peor fondo) |
| skeuo | 13.1:1 |
| adaptive | 16.32:1 |
| adaptive oscuro | 15.48:1 |

**El borde de la casilla sin marcar, que es el hallazgo de esta ronda.** Una casilla vacía se
identifica **solo** por su borde, así que WCAG 1.4.11 se lo exige igual que a cualquier
indicador. Mis primeros valores lo suspendían: clay **1.8:1**, adaptive **2.05:1**, skeuo
**2.42:1**, y el borde blanco de glass daba literalmente **1:1** contra su propia caja — es
decir, invisible. Corregidos:

| Material | Borde | vs. su caja | vs. papel |
| --- | --- | --- | --- |
| clay | `rgba(120,80,55,0.70)` | 3.32:1 | 3.09:1 |
| glass | `rgba(23,24,23,0.65)` | 3.72:1 (peor fondo) | 5.42:1 |
| skeuo | `rgba(25,25,23,0.55)` | 3.65:1 | 4.07:1 |
| adaptive | `rgba(23,24,23,0.60)` | 4.66:1 | 4.05:1 |
| adaptive oscuro | `rgba(255,255,255,0.50)` | 4.98:1 | — |

En glass eso significó **cambiar el borde claro por uno oscuro**. Es un compromiso consciente:
el borde claro era más "vidrio", pero dejaba la casilla vacía prácticamente indistinguible de
su relleno. Para un control de formulario, la percepción del límite gana.

Mensaje de error: 6.42:1 o más sobre papel y blanco. La etiqueta hereda `currentColor` del
anfitrión, como en Input.

### Cobertura de transición

Caja: `transition-[background-color,border-color]`. Marca: `transition-[opacity]`. Nada más
cambia entre estados. Verificado con `getAnimations()`: cambiar `background-color` y
`border-color` crea `CSSTransition` reales; cambiar `translate` (no declarada) no crea ninguna.

## Resultado esperado vs. real

- **Esperado:** Checkbox en el registry, `/components/checkbox` estática, `verify-registry`
  con `components:11`, animaciones verificadas. **Real:** cumplido.
- **Diferencia:** el estado mixto **no** tiene equivalente en `PreviewState`, así que el
  preview lo muestra como un segundo espécimen debajo del principal en vez de sustituirlo.
  Añadir `indeterminate` a `PreviewState` tocaría `schema.ts`, que es compartido y está fuera
  del guardarraíl; no me pareció que justificara detener la ronda, porque a diferencia del
  caso `error` de la Ronda 6 aquí no hay ninguna mentira: ambos estados se ven a la vez.

## Bugs / obstáculos y cómo se resolvieron

1. **`peer-*` no alcanza descendientes** (arriba). Detectado leyendo mi propio código antes de
   compilar, no por un fallo del gate — el CSS habría compilado igual y la marca simplemente no
   habría aparecido nunca.
2. **Los bordes sin marcar suspendían WCAG 1.4.11** (arriba). Detectado al medir, no al mirar.
3. **Tres falsas alarmas por el compositor congelado.** El panel de vista previa deja las
   transiciones en `currentTime: 0`, o sea informando el valor **inicial**. Eso hizo parecer
   que (a) la caja indeterminada no se rellenaba, y (b) la marca seguía visible al desmarcar.
   En ambos casos `getAnimations()` mostró la transición atascada y, al cancelarla, el valor
   correcto apareció al instante. Es el mismo artefacto de los reportes 0004, 0006, 0007 y
   0017; a estas alturas lo compruebo por reflejo antes de acusar al componente.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), en `feat/component-checkbox`:

- `registry:gen` — 11 entradas, `checkbox` incluida.
- `lint` ✅ · `typecheck` ✅ · `test:studio` ✅ `status:"ok"`.
- `test:registry` — ✅ `{"components":11,"selfContained":true,"guards":"ok","status":"ok"}`.
- `build` — ✅ sin warnings, `/components/checkbox` entre las rutas `● (SSG)`.

Verificación funcional contra el **build de producción** (`npm run start`):

- **CSS emitido:** confirmadas todas las reglas `peer-*` que dudaba, incluida la composición
  `peer-aria-[invalid=true]` y `peer-indeterminate`, todas con el combinador `~ *` correcto.
- **Nativo:** `input[type=checkbox]` real, envuelto en `<label>`, `aria-describedby` resuelve.
- **Estado mixto:** `indeterminate === true`, `matches(':indeterminate')` y caja rellena.
- **Variable del tick:** `--mq-tick` 1 marcada / 0 sin marcar, con la marca a opacidad 1 / 0.
- **Variantes:** `default` radio 6px, `rounded` circular. **Tamaños:** 16/18/22 px con radios
  5/6/7.
- **Materiales:** los cuatro rellenos y colores de marca coinciden con los valores escritos, y
  la caja indeterminada usa el mismo relleno que la marcada.
- **Estados:** `Error` → `aria-invalid="true"` y borde `#9c2f22`; `Disabled` → `disabled`
  nativo; `Focus` → `data-focus="true"`.
- **Borde sin marcar:** `rgba(120,80,55,0.7)` en vivo, o sea la corrección de contraste está
  aplicada.

**Lo que no verifiqué:** sin revisión visual pixel a pixel (la captura del entorno sigue dando
timeout). La activación con Espacio se apoya en el input nativo y no pude sintetizar
pulsaciones reales — el arnés entrega eventos con `key` vacío (reporte 0006); sí verifiqué el
alternado con clics reales sobre el input.

## Riesgos, deuda y pendientes

- **`PreviewState` no tiene `indeterminate`.** El preview lo enseña como segundo espécimen, lo
  cual funciona, pero si el registry acumula más estados propios de cada componente convendría
  que cada `RegistryEntry` declarara los suyos en vez de compartir una lista global. Ya lo
  anoté en el reporte 0015; esta ronda es el segundo caso.
- **El borde de glass es ahora oscuro**, no claro. Es lo correcto para la percepción del
  límite, pero cambia el carácter del material respecto a las otras piezas de vidrio de la
  librería. Si el diseño prefiere recuperar el borde claro, la salida sería un doble borde
  (halo claro por dentro, límite oscuro por fuera) a cambio de una sombra más que declarar.
- **El `ref` fusionado se recrea en cada render** porque lo escribí como callback inline en vez
  de memoizarlo. Es intencional: evita el choque con la regla del React Compiler que me costó
  tiempo en la Ronda 9, y el coste real es que React lo llama con `null` y con el nodo en cada
  render, lo cual aquí no tiene efecto observable.
- **La rama `feat/component-tooltip` quedó mergeada pero sin borrar.** No la toqué porque el
  prompt pedía borrar `feat/component-avatar` (que ya no existía) y no la menciona; confirmo
  que se puede borrar sin pérdida.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0018.

## Estado final

Completo. Checkbox entregado con 4 materiales × 2 formas × 3 tamaños, estado mixto incluido,
sobre un input nativo cuyo estado gobierna el dibujo, gate verde con `components:11` y sin
tocar un solo archivo compartido.
