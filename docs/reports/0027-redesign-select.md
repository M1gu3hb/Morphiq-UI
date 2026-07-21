# Reporte 0027 — Rediseño táctil del Select (PILOTO)

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `redesign/select` · **Commit final:** ver PR
- **Tipo:** refactor visual (rediseño, sin cambio de comportamiento)
- **Prompt recibido:** Rediseño táctil, piloto. Subir la calidad visual del Select al nivel del Button sin romper nada de lo que ya funciona. El eje `material` estaba casi vacío (`clay: ""`, `skeuo: ""`, `adaptive: ""`) y el componente no tenía movimiento.

## Objetivo

Que el Select se sienta físico y que los cuatro materiales se distingan **claramente**. Es un
piloto: el dueño lo revisa en vivo y aprueba el estándar antes de rodarlo al resto.

## Paso 0

`main` al día, 22 entradas confirmadas, rama `redesign/select` desde `main`, `npm ci` y
`npm run check` verde en preflight (`components:22`).

## Qué se hizo

- `src/registry/ui/select.tsx` — cuatro recetas de material reales, animación de firma y pozo
  de foco.
- `src/registry/previews/select-preview.tsx` — un cambio en la `key` para que el estado `focus`
  se pueda ver animar.
- `src/registry/entries/select.ts` — solo el texto `a11y` (cifras de contraste remedidas +
  contrato de movimiento). `dependencies` sin cambios: no se importa nada nuevo.
- `docs/reports/0027-redesign-select.md` — este reporte.

Nada compartido. No se tocó `globals.css`, `schema.ts`, `package.json` ni ningún otro
componente.

## El punto de partida

```tsx
material: {
  clay: "",
  glass: "backdrop-blur-[16px] backdrop-saturate-[170%]",
  skeuo: "",
  adaptive: "",
},
```

Tres de los cuatro materiales eran la cadena vacía. Cambiar de material no cambiaba nada
salvo en vidrio. El campo era una caja plana con un borde de 1px.

---

# Las cuatro recetas nuevas

Estudié `button.tsx`, `card.tsx`, `alert.tsx`, `slider.tsx` y `docs/style-research.md` antes de
escribir. Un dato que cambió el diseño: **el ancla de escala correcta es el thumb del Slider,
no la Card.** El Select mide 34/40/46px de alto; las cifras de Card/Button son el techo, no el
objetivo. Las sombras de abajo están calibradas entre ambos.

**Estructura común.** Cada material declara el **mismo número de capas de sombra en el mismo
orden de `inset`** en reposo, hover y foco. No es pulcritud: `box-shadow` solo interpola cuando
las listas de capas coinciden; si el número o la bandera `inset` difiere en cualquier posición,
el navegador se rinde y hace un salto discreto — el pozo aparecería de golpe en vez de
hundirse. Las capas que aún no se quieren se declaran a tamaño y alfa cero, no se omiten.

**La narrativa es la misma en los cuatro:** en reposo el campo está por encima del papel, el
hover lo eleva un poco, y el foco lo **hunde en un pozo** — la sombra exterior se colapsa
mientras la interior se profundiza. Lo que cambia es el vocabulario.

### clay — pigmento inflado

- Superficie cálida y saturada: `#f7e9de` (antes `#fdf6f0`, casi papel blanco).
- **Brillo interno difuso arriba** (`inset 0 3px 4px rgba(255,255,255,0.78)`) — un bloom, nunca
  una línea fina.
- **Sombra interna cálida abajo** (`inset 0 -4px 7px rgba(140,90,60,0.14)`). La tinta es marrón
  cálido en todas las capas: **clay nunca proyecta negro.**
- **Pared lateral del bloque**: `0 3px 0 var(--mq-edge,#dcc4b2)` — sombra dura, sin desenfoque.
  Es el rasgo más identificativo del material en este sistema y era justo lo que le faltaba.
- Sombra ambiental ancha debajo.
- **La extrusión es el relato**: crece a `5px` en hover (el bloque se eleva) y se **colapsa a
  `1px` en el foco** (se hunde).

### glass — panel refractivo

- Tinte translúcido propio (`rgba(255,255,255,0.66)`) + `backdrop-blur-[18px] saturate-[170%]`.
  Subí el blur de 16 a 18 para alinearlo con Card, que es la referencia de superficie; era una
  decisión pendiente y la tomo explícitamente.
- **Filo de luz especular de 1px, sin desenfoque**, cuya **geometría nunca cambia** entre
  estados — solo su intensidad (0.85 → 0.95). Es lo que distingue vidrio de clay.
- Un velo vertical (`--mq-grad`) para que el panel lea como una lámina que atrapa la luz.
- **Sin capa de extrusión, nunca.** El vidrio no tiene pared lateral.
- Tinta fría violeta-negra `rgba(24,20,40,…)` y la sombra más ancha y atmosférica del conjunto.
- En hover el blur sube a 22px: el panel se "espesa" al acercarse.

### skeuo — plástico moldeado

- **La superficie es un degradado** `linear-gradient(180deg,#f2efe7,#dcd8ce)` (lit → body). El
  material *es* el degradado.
- Bisel de luz duro de 1px arriba, **sombra interna acromática** abajo (`rgba(0,0,0,…)`) — el
  contraste con la tinta cálida de clay es la mitad de lo que separa a los dos de un vistazo.
- Pared lateral **más baja que la de clay** (`0 3px 0 #a8a49b`) y sombra proyectada más ceñida.

### adaptive — sobrio por definición

`docs/style-research.md` es tajante: polimorfismo **no es un acabado visual**, y llamarlo "otro
preset de sombras sería engañoso". Así que adaptive se queda casi plano y su identidad la dan
el comportamiento, no el ornamento:

- **Dos capas**, no cinco. Sin degradado, sin extrusión, sin bisel, sin `backdrop-filter`.
- Una sombra de contacto que **crece al hover** (`0 1px 2px` → `0 6px 16px`).
- Único material con volteo `dark:` completo.
- Único con densidad por puntero: `pointer-coarse:min-h-[48px]`, que **solo agranda** — el
  padding sigue siendo del eje de tamaño, así que no puede encoger `lg` en táctil.

### Por qué ahora se distinguen (medido en el build)

| | fondo | degradado | backdrop-filter | capas de sombra propias |
|---|---|---|---|---|
| clay | `#f7e9de` | no | ninguno | **5** (con pared lateral) |
| glass | `rgba(255,255,255,.66)` | sí, velo blanco | `blur(18px) saturate(1.7)` | **4** (sin pared) |
| skeuo | degradado `#f2efe7→#dcd8ce` | sí, el material | ninguno | **5** (con pared) |
| adaptive | `#ffffff` / `#232327` | no | ninguno | **2** |

---

# Animación de firma

**El chevron gira 180° al recibir el foco**, y el campo gana su pozo a la vez.

- Se anima la propiedad **`rotate`**, no `transform`. Tailwind 4 escribe `rotate-*` en la
  propiedad independiente `rotate`; una transición que nombrara `transform` no animaría nada y
  el glifo saltaría. La lista es `transition-[rotate,opacity]`.
- El chevron es **hermano siguiente** del `<select>`, así que se alcanza con `peer-*`:
  `peer-focus-visible:rotate-180` y `peer-data-[focus=true]:rotate-180` — el segundo para que
  el estado `focus` de la galería también gire.
- **Informa del foco, no de si la lista está abierta.** Un `<select>` nativo no expone ninguna
  señal portable de "abierto", así que afirmarlo con movimiento sería mentir. Sigue con
  `aria-hidden`.

**Degradación en `reduced-motion`:** se quita el recorrido y **se conserva el estado final**.
El chevron sigue girando y el pozo sigue hundiéndose, solo que llegan de golpe. Apagar también
el estado final habría quitado una señal de foco a alguien que solo pidió que parara el
movimiento.

**Reparto de trabajo en el foco (decisión deliberada).** El archivo ya sostenía que "un anillo
de foco tiene que estar en el instante en que llega el foco, no aparecer con un fundido", y el
pozo sí se anima. No es contradicción: el **contorno es la señal de referencia** — sin animar,
con color de sistema en `forced-colors`, y lo que un usuario de teclado necesita. El **pozo es
la reacción del material**, y es lo primero que `forced-colors` descarta. Una señal de la que
nada depende puede tomarse 200ms; la que lo sostiene todo, no.

## Hallazgo 1 — el pozo de foco no existía (clases generadas por interpolación)

Escribí un helper:

```tsx
function focusWell(shadow: string) {
  return `focus-visible:shadow-[${shadow}] data-[focus=true]:shadow-[${shadow}]`;
}
```

Compilaba, el gate pasaba, y **las clases aparecían en el DOM**. Pero al medir en el navegador,
la sombra no cambiaba al enfocar y `getAnimations()` no reportaba ninguna transición.

Causa: **Tailwind encuentra las clases escaneando el texto fuente; nunca ejecuta el módulo.**
Un nombre de clase construido por interpolación es un nombre que Tailwind no ve, así que la
regla **nunca se emite**. Lo confirmé consultando el CSSOM: las únicas reglas
`focus-visible:shadow-*` generadas eran las del tratamiento `underline`, que sí escribí como
literales.

Es un fallo especialmente traicionero: cuesta cero en runtime, se ve perfectamente correcto en
revisión de código, la clase llega al DOM — y nada la estiliza.

Corregido escribiendo las cuatro parejas de foco como literales completos y eliminando el
helper. **Verificado tras el arreglo:** los cuatro materiales animan.

## Hallazgo 2 — el estado `focus` de la galería remontaba el componente

La `key` del preview era `${material}-${state}`, así que pasar de `default` a `focus`
**desmontaba y remontaba** el `<select>`. Un remount reconstruye el elemento ya enfocado: el
cambio de profundidad y el giro del chevron — las dos cosas que ese estado existe para
mostrar — no llegaban a animarse nunca.

Corregido a `${material}-${isError ? "error" : "ok"}`: sigue remontando al cruzar dentro o
fuera del caso de error (que es lo que el fix del placeholder necesita), pero ya no al cambiar
de foco.

## Verificación de movimiento (build de producción, `getAnimations()`)

Cancelando animaciones antes de leer estilos, porque el compositor del panel está congelado.

| Comprobación | clay | glass | skeuo | adaptive |
|---|---|---|---|---|
| Propiedades animadas | `box-shadow`, `rotate` | idem | idem | idem |
| ¿Propiedades fantasma? | no | no | no | no |
| Pozo aplicado | sí | sí | sí | sí |
| `rotate` del chevron | `none` → `180deg` (200ms) | idem | idem | idem |

**Prueba de que las capas encajan** (lo que demuestra que interpola en vez de saltar): parando
la transición justo a la mitad, los valores son fraccionarios e intermedios en los cuatro
materiales — p. ej. la extrusión de clay mide **1.32px** a medio camino entre 3px y 1px, y el
pozo de adaptive **2.52px / 5.87px** entre 0 y 3px/7px. Si las listas de capas no coincidieran,
el valor intermedio sería idéntico a uno de los extremos.

Las cinco propiedades de la lista (`border-color`, `background-color`, `box-shadow`,
`backdrop-filter`, `opacity`) cambian todas en algún estado real: borde en foco/error, fondo al
cambiar material o tratamiento, sombra en hover/foco, `backdrop-filter` en el hover de vidrio,
opacidad al deshabilitar. `background-image` se dejó **fuera** a propósito: un degradado no
interpola contra `none`, así que listarlo compraría un salto discreto disfrazado de animación.

---

# NO se regresó nada (verificado en el DOM del build)

| Fix | Estado | Evidencia medida |
|---|---|---|
| 1. `size` nativo omitido del tipo/props | intacto | `getAttribute("size")` → `null` |
| 2. `<option>` con `--mq-surface` opaco (popup de Firefox) | intacto | fondo de `option` = `rgb(247,233,222)`, color `rgb(51,38,30)` |
| 3. Altura explícita + `py-0` (Safari) | intacto | `height: 40px`, `padding-block: 0px/0px` |
| 4. Placeholder `disabled` con `value=""` que sí resetea | intacto | en estado error: `value === ""`, `placeholderSelected: true`, y es `firstElementChild`, `disabled`, `hidden` |
| 5. `leading` plegado en `text-[…]/[normal]` | intacto | `line-height: normal` |

Y además: `<select>` nativo ✓ · `appearance: none` ✓ · `Select`/`SelectField` sin cambios de
API ✓ · `aria-invalid` como única fuente del error (`aria-invalid="true"`, borde
`rgb(156,47,34)`) ✓ · chevron `aria-hidden="true"` ✓ · teclado nativo intacto (no se tocó nada
del control) ✓ · `forced-colors` ✓ · propiedades lógicas para RTL ✓.

**Un añadido a `forced-colors`:** las sombras se descartan solas, pero las **imágenes de fondo
no** — se conservan intactas. El degradado de skeuo y el velo de vidrio habrían quedado encima
de una superficie de color de sistema para la que nunca se diseñaron, así que ahora se limpian
a mano con `forced-colors:[background-image:none]`.

## Contraste — remedido, no heredado

El rediseño cambió las superficies, así que **todas las cifras se volvieron a medir**. Suelo
autoimpuesto de **4,5:1 también para el chevron**, en vez del 3:1 que la 1.4.11 de WCAG
permitiría para un glifo.

**48 combinaciones, 0 fallos.** Mínimo absoluto **5,25:1** (placeholder de clay sobre el
tratamiento relleno).

| Material | texto (peor) | placeholder (peor) | chevron (peor) |
|---|---|---|---|
| clay | 10,74 | **5,25** | 6,45 |
| skeuo (medido en el **extremo oscuro** del degradado) | 9,55 | 5,47 | 6,49 |
| glass (peor fondo: negro puro, pie del velo) | 7,05 | — | **5,93** |
| adaptive (claro y oscuro) | 12,24 | 6,59 | 7,95 |

En skeuo la superficie es un degradado, así que la medición se toma en su **punto más
oscuro** — el peor caso — y no en un promedio.

---

## Gate

```
npm run check
{"components":22,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
✓ Generating static pages (31/31)
```

`components:22` como se esperaba (es un rediseño, no un componente nuevo). `/components/select`
sigue prerenderizándose como SSG.

## Lo que no se pudo verificar

- **No pude ver el resultado.** La herramienta de captura del panel agotó el tiempo dos veces
  (renderer sin responder, la misma limitación de compositor congelado de rondas anteriores).
  Toda la verificación de este reporte es de **estilos computados y del CSSOM**, que da valores
  exactos, pero **no he mirado el componente con mis ojos**. Para un rediseño visual eso es una
  laguna real: puedo demostrar que cada capa vale lo que dice valer y que los cuatro materiales
  difieren numéricamente, no que el conjunto se vea bien. Es justo lo que la revisión en vivo
  del dueño tiene que juzgar.
- **`prefers-reduced-motion` y `forced-colors` no se activaron de verdad.** Se confirmó que las
  reglas existen y coinciden con el elemento real, que es evidencia de que aplicarían.
- **Solo Chromium.** El comportamiento del popup de Firefox y la normalización de altura de
  Safari siguen viniendo de investigación, no de medición propia en esos motores.
- **Sin lector de pantalla real.**
- El giro del chevron se probó por el hook `data-focus` y por la regla `peer-focus-visible` en
  el CSSOM; **no tabulando de verdad**, porque el panel entrega eventos de teclado con
  `event.key` vacío.
