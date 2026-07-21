# Reporte 0025 — Select y Spinner

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `feat/select-spinner` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 13. Dos componentes en una sesión — Select (slug `select`, categoría `inputs`) y Spinner (slug `spinner`, categoría `feedback`) — con un solo PR y un solo reporte combinado. Cada componente cumple el mismo estándar; no recortar por hacer dos.

## Objetivo

Añadir dos componentes de producción autocontenidos sin editar ningún archivo compartido.
Select completa la familia de campos de formulario junto a Input y Textarea; Spinner añade a
`feedback` un indicador de carga indeterminado, distinto de Skeleton (marcador de contenido)
y de Progress (barra determinada). Los dos debían medir contraste real antes de afirmar nada,
cubrir `forced-colors` y `prefers-reduced-motion`, y verificar la cobertura de transición.

## Paso 0 — `main` al día

- PR #22 (Textarea + Skeleton) mergeado.
- PR #23 (Breadcrumb + Pagination) marcado ready y mergeado.
- Las tres ramas de la limpieza (`chore/verify-registry`, `feat/component-card`,
  `feat/component-engine`) **ya no existían en el remoto**; los `|| true` las volvieron no-op,
  como estaba previsto.
- `feat/breadcrumb-pagination` y `feat/component-slider` siguen en el remoto. No estaban en la
  lista de limpieza y la primera está *checked out en el worktree de Codex*, así que no las
  toqué.
- `src/registry/entries/` con 18 entradas confirmado. Rama `feat/select-spinner` desde `main`.
  `npm ci` y `npm run check` verde en preflight (`components:18`).

## Qué se hizo

- `src/registry/ui/select.tsx` — `Select` (control) y `SelectField` (etiqueta + control +
  mensaje), cuatro materiales, tres tratamientos, tres tamaños, chevron propio.
- `src/registry/previews/select-preview.tsx` — copia distinta por material, estados `error` y
  `disabled`, cobertura de todos los ids.
- `src/registry/entries/select.ts` — entrada `inputs` con metadatos bilingües.
- `src/registry/ui/spinner.tsx` — `Spinner` con `arc | ring`, tres tamaños y `@keyframes`
  propios.
- `src/registry/previews/spinner-preview.tsx` — con y sin etiqueta visible.
- `src/registry/entries/spinner.ts` — entrada `feedback` con metadatos bilingües.
- `docs/reports/0025-select-y-spinner.md` — este reporte.

No se editó `package.json`, el índice generado, schema, scripts, app, globals ni ningún otro
componente. El índice que regeneran los hooks está gitignorado.

## Método

Antes de escribir código lancé una auditoría paralela de solo lectura sobre (a) las reglas
exactas de `verify-registry.mjs`, (b) el patrón de `textarea.tsx` como plantilla, (c) los
patrones de animación ya presentes, (d) las trampas de estilizar un `<select>` nativo y (e) la
accesibilidad real de un spinner. Esa auditoría encontró **dos defectos en código que yo ya
había escrito** — están documentados abajo, no reescritos como si nunca hubieran existido.

---

# Componente 1 — Select

## Por qué nativo, y qué estilizo vs. qué deja el SO

**Estilizo solo el control cerrado:** caja, borde, fondo, tipografía, y un chevron que dibujo
yo. **La lista abierta es del sistema operativo** y se queda intacta.

Eso no es una limitación aceptada a regañadientes, es la decisión. Lo que da el nativo gratis:

- Teclado completo por plataforma, incluida la **escritura predictiva** de varios caracteres
  con su búfer temporal, su ciclo al repetir letra y su vuelta al principio — un algoritmo
  quisquilloso que las reimplementaciones suelen hacer mal.
- Mapeo de rol correcto por lector de pantalla y sistema, estado expandido/colapsado, anuncio
  de posición ("elemento 3 de 12"), y comportamiento correcto en modo navegación **y** en modo
  formulario sin intervención del autor.
- **Autocompletado del navegador y del gestor de contraseñas.** Un listbox en JS lo rompe.
- El **selector nativo del SO en móvil** (rueda en iOS, hoja en Android).
- Se dibuja en la capa del SO: **nunca lo recorta un `overflow`, nunca necesita portal, nunca
  tiene un bug de z-index.** Sin colisiones, sin bloqueo de scroll, sin trampa de foco.

Reimplementarlo exigiría Radix (dependencia nueva que no vamos a agregar) o escribir a mano
roving tabindex, typeahead, posicionamiento, portales y restauración de foco — y aun así se
pierden el autocompletado y el selector móvil. Un renderizado que no controlamos es un precio
justo por un comportamiento que no podemos igualar.

**Lo que el consumidor no puede tematizar:** ancho, alto, padding, borde, sombra, animación y
posición del desplegable; y el estilo de `<option>`/`<optgroup>` es parcial o ignorado según
motor y sistema. El contrato visual termina en la caja cerrada, y así está documentado.

## El chevron: por qué un `<svg>` y no un data URI

`appearance-none` quita la flecha nativa, así que hay que dibujarla. La opción habitual copiada
de internet es `background-image: url("data:image/svg+xml,…")`. **No sirve aquí, y la razón es
categórica:**

Un SVG referenciado por `url()` — data URI incluido — se carga como **documento independiente
en modo estático seguro**. No ve el DOM, la cascada ni las propiedades personalizadas del
documento que lo referencia. `fill='var(--mq-chevron)'` dentro del data URI ni siquiera lo
parsea el documento externo: son caracteres dentro de un token URL. Dentro del SVG, `--mq-chevron`
no existe, la declaración es inválida y `fill` cae al valor inicial: **negro**. `currentColor`
falla por lo mismo — resuelve contra el `color` del propio SVG, no del anfitrión. Muchos
fragmentos que circulan están rotos así y solo parecen correctos porque el color quemado
coincide por casualidad.

`mask-image` tampoco: la máscara se aplica al **elemento entero**, y no se puede enmascarar el
`<select>` sin recortar todo el control. Como **los pseudo-elementos no se renderizan en un
`<select>`** en ningún motor, la máscara necesitaría igualmente un elemento aparte — perdiendo
su única ventaja y añadiendo un fallo en `forced-colors` (el relleno viene de `background-color`,
que se fuerza al color de fondo del sistema: el chevron desaparece).

**Solución: un `<svg>` en línea, hermano del control**, con `stroke="currentColor"` y el color
desde `var(--mq-chevron)`. Mismo documento, cascada real. Y en `forced-colors` se adapta solo,
porque `color`, `fill` y `stroke` son propiedades forzadas.

Se coloca con **grid** (`[grid-area:1/1]` en ambos hijos) en vez de posicionamiento absoluto,
para no traducir nada: Tailwind 4 escribe `translate-*` en la propiedad `translate`, y no tener
ningún `translate` en el archivo elimina de raíz la posibilidad de desalinear
`transform`/`translate` más adelante. Lleva `pointer-events-none` y `aria-hidden`.

## Hallazgo 1 (auditoría): la trampa de `size`

`HTMLSelectElement.size` es un atributo nativo que significa **número de filas visibles**. Un
valor mayor que 1 convierte el desplegable en una lista incrustada en la página: otro widget,
sin popup y sin chevron.

El eje visual de todo componente Morphiq se llama `size`. Colisión directa. Sin `Omit`, el tipo
ni siquiera compila (`'"sm"' no es asignable a 'number'`); y peor, si `size` no se
desestructura antes del `{...props}`, React escribe `size="sm"` en el DOM — HTML lo parsea como
entero, falla, usa 1, y *parece* funcionar mientras se envía HTML inválido.

Hecho: `Omit<React.ComponentPropsWithRef<"select">, "size">` y `size` desestructurado.
**Verificado en el DOM del build de producción: `getAttribute("size")` → `null`.**

## Hallazgo 2 (auditoría): el popup ilegible en Firefox

Firefox deriva los colores de la lista abierta de los colores computados del propio control.
Mi tratamiento `underline` usa `bg-transparent` y `glass` es translúcido — con eso el
desplegable puede salir ilegible en Firefox. Es el único punto donde estilizar el control
cerrado se filtra a la parte que dibuja el SO.

Corregido coloreando las opciones directamente:
`[&>option]:bg-[var(--mq-surface,#fdf6f0)] [&>option]:text-[color:var(--mq-text,#33261e)]`,
con un `--mq-surface` **opaco por material** (el vidrio recibe `#f4f7f8`, porque un popup no
puede ser translúcido sobre nada). Se respeta donde importa y se ignora donde no.

> Al añadirlo cometí y detecté un error propio: usé `--mq-surface` sin definirlo en
> `MATERIAL_TOKENS`, así que los cuatro materiales habrían caído al literal de clay. Lo
> encontró la revisión de contrato antes del gate.

## Hallazgo 3 (auditoría): altura por motor

Safari **normaliza `padding-block` en un `<select>`** y centra el texto por su cuenta, mientras
Chrome y Firefox lo respetan. Un padding vertical simétrico —el patrón que usan Input y
Textarea— da por tanto **una altura distinta por motor**.

Corregido: altura explícita (`h-[34px] / h-[40px] / h-[46px]`) con `py-0`, y que el motor
centre. Es la única divergencia deliberada respecto a Input/Textarea, y es por corrección
entre navegadores, no por gusto.

## Hallazgo 4 (mío, en verificación): el placeholder nunca se seleccionaba

Al leer el estado `error` en el navegador, `select.value` era `"Production"`, no `""`. El
placeholder no se mostraba nunca.

**Causa:** la opción placeholder es `disabled`, y el algoritmo de reinicio del navegador elige
**la primera opción que no esté deshabilitada**. Sin un valor inicial explícito, se salta el
placeholder y selecciona en silencio la primera opción real. Un consumidor que pasara
`placeholder="…"` y nada más **no vería jamás su placeholder** — y `required` tampoco
protegería, porque el control ya tiene un valor.

Corregido **en el componente**, no en la demo, para que el comportamiento correcto sea el que
sale de fábrica:

```tsx
const startsEmpty = placeholder != null && value === undefined && defaultValue === undefined;
```

Solo se aplica cuando quien lo usa no ha dicho qué debe estar seleccionado, así que no pisa ni
el uso controlado ni un `defaultValue` propio.

Había además un segundo defecto encima, en el preview: `defaultValue` **solo se lee al montar**,
y mi `key` era solo `material`, así que cambiar al estado `error` no remontaba y el valor
anterior se quedaba. Ahora la clave es `${material}-${state}`.

**Verificado tras el arreglo:** estado por defecto → `value: "Production"`, texto `#33261e`;
estado error → `value: ""`, `placeholderSelected: true`, y el color pasa a `rgb(106,83,70)` =
`#6a5346` = `--mq-placeholder`, es decir la regla `:has(option[value='']:checked)` sí dispara.

## Hallazgo 5 (mío, en verificación): `leading-*` descartado por `tailwind-merge`

`line-height` se hereda, así que un control cuyo texto se desplaza según la página anfitriona
no es autocontenido. Añadí `leading-normal` en la base — y el computado siguió siendo `19.5px`.

Dos errores encadenados:

1. **`leading-normal` en Tailwind es la razón `1.5`, no la palabra clave CSS `normal`.** Para el
   keyword hace falta `leading-[normal]`.
2. Aun corrigiendo eso seguía sin aplicarse: **`tailwind-merge` considera que un `text-[…]`
   posterior entra en conflicto con un `leading-*` anterior y lo descarta.** Como el eje `size`
   se declara después de la base, mi `leading` moría siempre. Es exactamente el mismo defecto
   que se documentó en la Ronda 1 de este repo.

Corregido plegando la altura de línea en la clase de tamaño: `text-[13px]/[normal]`.
**Verificado: `line-height: normal` en los tres tamaños.**

## Contraste (medido, luego escrito)

Reutiliza la paleta ya probada de Input/Textarea y añade `--mq-chevron`. Al chevron se le exige
**4,5:1**, no el 3:1 que la 1.4.11 de WCAG permitiría para un glifo: es la única señal
permanente de que el control se abre.

| Medida | Valor |
|---|---|
| Texto de la opción seleccionada, peor caso en cualquier material/tratamiento | **7,05:1** |
| Chevron, peor material opaco (skeuo) | **7,17:1** |
| Chevron clay / adaptive claro / adaptive oscuro | 7,23 / 7,95 / 8,23:1 |
| Chevron vidrio, peor caso (compuesto sobre negro puro) | **5,93:1** |

## Verificación en navegador (build de producción)

Contra `next start`, cancelando `getAnimations()` antes de leer estilos computados.

| Comprobación | Resultado |
|---|---|
| `appearance` | `none` |
| `transition-property` | `border-color, background-color, opacity` (sin fantasmas) |
| Altura sm / md / lg | 34 / 40 / 46px, `padding-block: 0px` en los tres |
| `padding-inline-start` / `-end` sm/md/lg | 10/30 · 13/36 · 16/42 px |
| Chevron sm / md / lg | 14 / 16 / 18px, dentro del carril (hueco derecho 13px en md) |
| Chevron | `aria-hidden="true"`, `pointer-events: none`, color `#5c463a` |
| Atributo nativo `size` en el DOM | **`null`** (no se filtró) |
| `line-height` | `normal` en los tres tamaños |
| Placeholder | primer hijo, `disabled`, `hidden`, `value=""` |
| Estado error | `aria-invalid="true"`, borde y mensaje ambos `rgb(156,47,34)` |
| Deshabilitado | control y **chevron** ambos a `opacity: 0.55` |
| `<label for>` / `aria-describedby` / región de mensaje | ligados, compuesto, montada con `aria-live="polite"` |
| `forced-colors` | `border-color: canvastext` presente y coincide con el elemento |
| `prefers-reduced-motion` | `transition-property: none` presente y coincide |

Nota metodológica: la primera lectura dijo que el chevron **no** se atenuaba al deshabilitar.
Era falso — había cancelado las animaciones del `<select>` pero no las del propio chevron, y el
compositor congelado del panel devuelve el valor **inicial** de una transición sin cancelar.
Cancelándolas: `0.55`. La regla siempre estuvo bien.

---

# Componente 2 — Spinner

## Cómo se anima

`@keyframes` propios dentro del componente, emitidos con el izado deduplicado de React 19
(`<style href precedence>`), igual que Skeleton. Progress, que es de Codex, usa un `<style>`
pelado sin `href`: funciona, pero emite una etiqueta por instancia. La forma deduplicada es
mejor y es la que uso.

Animo la propiedad **`rotate`** y no `transform: rotate(...)`, para que un `transform` propio de
quien lo use no pelee con la animación por la misma propiedad. Al ser una animación y no una
transición, la trampa Tailwind 4 de `transition-[…]` no aplica: los keyframes fijan la propiedad
directamente.

**Truco de bordes para el bicolor:** el aro es el `border` de una caja con `border-radius: 50%`;
los cuatro lados se encuentran en inglete a 45°, así que cada lado es un cuadrante de 90°. La
**pista** es el color del atajo `border` en los cuatro lados; el **arco** se consigue
sobrescribiendo el color de uno (`arc`, 90°) o de dos adyacentes (`ring`, 180°) **después** del
atajo. Dos tonos, dos propiedades, sin gradiente, sin máscara y sin elemento extra.

## `reduced-motion`: estático, y por qué

`motion-reduce:animate-none`. La rotación se detiene del todo y queda un aro bicolor quieto.

Es una decisión deliberada **contra** la recomendación más común, que es sustituir por un pulso
lento de opacidad o simplemente ralentizar el giro. Ambas siguen animando algo cuando la
preferencia pedía lo contrario, y el prompt de esta ronda pedía explícitamente que el "cargando"
lo comunique el rol/texto y no el giro.

Honestamente, en términos normativos: **nada en WCAG obliga a ninguna de las dos opciones.**
Respetar `prefers-reduced-motion` siquiera está en nivel AAA (SC 2.3.3). Lo único vinculante es
la **SC 2.3.1**, que nada parpadee por encima de 3 Hz — que un aro estático cumple trivialmente
y un pulso solo cumple si se ajusta con cuidado. El coste es real y lo digo: un aro congelado es
una señal de "sigo trabajando" más débil que uno en movimiento. Por eso el texto no es opcional.

## Hallazgo 6 (auditoría): `role="status"` que no anuncia nada

Este era un bug real en código que yo ya había escrito.

Mi primera versión ponía `role="status"` con `aria-label={srLabel}` y, como único hijo, el aro
con `aria-hidden`. **Eso no anuncia nada.**

Una región viva se anuncia por su **contenido**, no por su **nombre**. Si el único hijo está
`aria-hidden` y no hay nodo de texto, la cadena a anunciar es vacía → silencio. Y el fallo es
especialmente traicionero porque **una auditoría estática pasa**: el nombre accesible está ahí,
visible en el árbol de accesibilidad y en axe. Firefox además asigna a un `status` sin nombre un
rol que se salta por completo el cálculo de nombre a partir del subárbol.

Corregido: la región **siempre contiene texto real** — la etiqueta visible, o un
`<span className="sr-only">{srLabel}</span>`. `sr-only` es la técnica de recorte;
`display:none` o `visibility:hidden` lo sacarían del árbol de accesibilidad y reintroducirían el
mismo silencio.

También quité el `aria-live="polite"` explícito: `role="status"` ya implica `polite` y `atomic`,
y mi comentario justificaba el duplicado con una afirmación sobre lectores antiguos que no podía
verificar. Fuera la redundancia y fuera la afirmación.

Anunciar el estado es **el** requisito real aquí: **WCAG 2.2 SC 4.1.3, nivel AA**. Un indicador
solo visual lo incumple.

## `forced-colors`

El truco de bordes tiene un fallo propio en alto contraste: al descartarse los colores de autor,
los cuatro lados se fuerzan al **mismo** color de sistema y el aro se vuelve uniforme — el arco
desaparece y el spinner parece un anillo estático roto.

Mitigado dando **dos colores de sistema distintos**: `GrayText` a la pista y `CanvasText` al
arco (y al segundo lado en `ring`). **Verificado en el CSSOM:** las dos reglas existen y ambas
coinciden con el elemento real.

## Contraste arco/pista (medido)

Aquí la 1.4.11 **sí** aplica: el spinner no es decoración, es lo único en pantalla que dice que
la interfaz sigue viva. Suelo 3:1.

| Material | Arco / pista | Ratio |
|---|---|---|
| adaptive (claro) | `#171817` / `#d8dad5` | **12,64:1** |
| adaptive (oscuro) | `#f5f3ee` / `#42443f` | **8,89:1** |
| skeuo | `#3f4641` / `#d6d0c4` | **6,32:1** |
| clay | `#9f2f23` / `#f0dcd0` | **5,46:1** |
| glass | `#0b3f4c` / `rgba(255,255,255,0.62)` | **4,29:1** (peor caso, sobre negro puro) |

El vidrio obligó a rediseñar: con pista al 45% y 55% de blanco el arco caía a **1,57:1 y 2,23:1**
sobre fondo negro — incumplimiento claro. Subir la pista a 0,62 y oscurecer el arco lo lleva a
4,29:1 en el peor caso.

## Verificación en navegador (build de producción)

| Comprobación | Resultado |
|---|---|
| Regiones `role="status"` en la página | 2 |
| Contenido de texto de cada una | `"Loading results"` (sr-only) y `"Publishing…"` (visible) |
| `aria-label` presente | **no** (el nombre lo lleva el texto) |
| `aria-live` explícito | **no** (implícito en el rol) |
| Aro | `aria-hidden="true"` |
| Keyframes: etiquetas `<style>` / reglas en CSSOM | **1 / 1** con 2 instancias en página |
| Animación | `mq-spinner-rotate`, `0.85s`, `infinite`, `playState: "running"` |
| Variante `arc` | solo `border-top` en color de arco |
| Variante `ring` | `border-top` **y** `border-right` en color de arco |
| Colores clay | arco `rgb(159,47,35)` = `#9f2f23`, pista `rgb(240,220,208)` = `#f0dcd0` |
| Colores glass | arco `rgb(11,63,76)`, pista `rgba(255,255,255,0.62)` |
| Diámetro sm / md / lg | 16 / 22 / 32px, grosor 3px en md |
| `prefers-reduced-motion` | `animation: … none` presente y coincide |
| `forced-colors` | `border-color: graytext` **y** `border-top-color: canvastext`, ambas coinciden |

---

# Revisión adversarial (antes del PR)

Además de la auditoría previa, pasé los seis archivos por una revisión con lentes
independientes (corrección, accesibilidad, contrato de registro, y verificación de las
afirmaciones numéricas), con refutación adversarial de cada hallazgo. Encontró **cuatro
defectos reales más** en código que yo ya había escrito y verificado:

## Hallazgo 7 — `label=""` deja la región viva muda otra vez

Había arreglado el caso de `aria-label` (hallazgo 6) pero dejé el guardián como
`label != null`. Con `label=""` — un `t("…")` que falla, o un `cond ? texto : ""` —
`"" != null` es verdadero, así que se tomaba la rama de "etiqueta visible" y se renderizaba
`<span></span>`: **región viva sin texto, silencio total**, la mismísima falla que el
componente existe para evitar. Y como el aro sí se ve, es invisible en revisión visual.

Lo mismo con `srLabel=""`: un parámetro por defecto solo cubre `undefined`, no la cadena
vacía.

Corregido con un predicado `rendersText()` que trata como vacío todo lo que React no pintaría
(`null`, `undefined`, booleanos, cadenas en blanco), y con un respaldo explícito para
`srLabel` en blanco. **Verificado: las dos regiones de la página tienen texto no vacío.**

## Hallazgo 8 — `aria-invalid` del consumidor se descartaba

`aria-invalid={invalid || undefined}` iba **después** de `{...props}` y sin desestructurar
`aria-invalid`. Un consumidor que escribiera `<Select aria-invalid={fieldState.invalid} />`
veía su valor reemplazado por `undefined`, y con él desaparecía también el borde de error,
porque el estilo se apoya en `aria-[invalid=true]`. Semántica y señal visual se perdían a la
vez, en silencio — y justo debajo de un comentario que presume de que `aria-invalid` es la
única fuente de verdad y de que el ARIA del consumidor se compone en vez de sobrescribirse.

Corregido: `aria-invalid` desestructurado y compuesto (`invalid || ariaInvalid || undefined`).

> **Fuera de mi guardarraíl:** `input.tsx` y `textarea.tsx` tienen exactamente el mismo patrón
> (`aria-invalid={invalid || undefined}` tras el spread). No los toqué porque no son míos en
> esta ronda. **Lo reporto para que se decida arriba.**

## Hallazgo 9 — `chevronVariants` sin pasar por `cn()`

Era el único cva del archivo que no pasaba por `tailwind-merge`. Resultado: la variante
`underline` emitía `me-[13px]` **y** `me-0` en la misma lista de clases, y quien ganaba lo
decidía el orden del stylesheet, no la intención. El comentario decía que el glifo queda a ras
del borde; el código no lo garantizaba.

Corregido envolviendo en `cn()`. **Verificado en el navegador:** con `underline` la clase
emitida es solo `me-0` y el computado es `margin-inline-end: 0px`; con `default`, `me-[13px]`
y 13px.

## Hallazgo 10 — el comentario del orden de ejes señalaba el par equivocado

Decía que `variant` va después de `size` para que `underline` pueda anular **el radio**. Es
falso: el eje de tamaño fija `--mq-radius` como propiedad personalizada, que `tailwind-merge`
no considera en conflicto con `rounded-none`, y las dos clases de radio viven en el mismo eje
mutuamente excluyente. El par que **sí** depende del orden es el **padding**: `ps-[2px]` de
`underline` contra `ps-[10px|13px|16px]` del tamaño.

Importa porque el comentario es una trampa: quien lo creyera y reordenara los ejes vería el
radio comportarse como está documentado y concluiría que el cambio es seguro, mientras cada
control `underline` recupera en silencio el padding de la caja. Comentario corregido para
nombrar el par real.

## Hallazgo 11 — `errorText=""` marcaba el campo como inválido

Las librerías de formularios devuelven a menudo `""` en lugar de `null` para "sin error".
`errorText != null` lo tomaba como error: borde rojo, `aria-invalid="true"` y un
`aria-describedby` apuntando a un mensaje vacío. Corregido con la misma comprobación de texto
real.

## Lo que la revisión NO cambió

También propuso cosas que verifiqué y descarté; la refutación adversarial las tumbó o las
comprobé yo. El caso que más costó fue el del chevron atenuado: una primera lectura decía que
no se atenuaba, y era un artefacto del compositor congelado del panel, no un defecto.

---

## Gate

```
npm run check
{"entries":20,"slugs":[...,"select",...,"spinner",...]}
{"components":20,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
✓ Generating static pages (27/27)
```

`/components/select` y `/components/spinner` se prerenderizan como SSG
(`.next/server/app/components/select.html` y `spinner.html` existen). Ambos prerenderizan sin
romper: los dos son `"use client"` y el `<style>` izado de React se emite en el HTML del
servidor, verificado leyendo el HTML generado.

## Observación fuera de mi alcance (no la toqué)

En el panel, `prefers-color-scheme` es **dark** mientras el fondo del sitio sigue siendo el
papel claro `#f1efe9`. Por eso el material `adaptive` renderiza su paleta oscura sobre una
página clara. **No es de esta ronda ni de estos componentes:** es el mecanismo `dark:` de toda
la librería — `progress.tsx` usa exactamente el mismo — y el sitio no fija una clase `dark`, así
que Tailwind cae en `prefers-color-scheme`. Mis cifras de contraste no se ven afectadas porque
son internas al componente (arco vs. pista, texto vs. superficie propia), no contra la página.
Lo reporto porque tocarlo exigiría `globals.css` o la configuración, que están fuera del
guardarraíl.

## Lo que no se pudo verificar

- **No se activaron de verdad `prefers-reduced-motion` ni `forced-colors`.** El panel no expone
  esos ajustes. Lo que sí se hizo fue confirmar en el CSSOM que cada regla existe y que
  `el.matches(selector)` es verdadero contra el elemento real — evidencia de que aplicarían, no
  de que se vean bien aplicadas.
- **No se probó con lector de pantalla real.** Las afirmaciones sobre el anuncio de la región
  viva se apoyan en la estructura verificada en el DOM (rol correcto, texto real presente) y en
  la investigación, no en NVDA/JAWS/VoiceOver. El propio informe de investigación marca este
  punto como empírico y dependiente de versión.
- **Solo se probó en el motor del panel (Chromium).** Los hallazgos 2 (popup de Firefox) y 3
  (altura en Safari) son correcciones hechas **a partir de investigación, no de medición
  propia** en esos navegadores; en Chromium no se manifiestan. Están marcados como tales aquí
  para que no se lean como verificados.
- **`text-[13px]/[normal]` está verificado; el resto de la sintaxis con barra no.** Solo comprobé
  los tres tamaños que uso.
- **Zoom en iOS:** un tamaño de fuente menor de 16px en un control enfocado provoca zoom
  automático en Safari iOS. Los tres tamaños (12/13/14px) están por debajo. **No lo cambié**:
  Input y Textarea usan exactamente los mismos tamaños, así que arreglarlo solo en Select
  rompería la coherencia de la familia, y hacerlo bien es una decisión de librería
  (`text-base md:text-sm`) que afecta a archivos compartidos. Lo reporto para que se decida
  arriba. La solución que **no** hay que usar es `maximum-scale=1` en el viewport, porque anula
  el zoom con dos dedos.
- **`appearance: base-select`** (el select personalizable de Chromium, que sí permite estilar el
  popup) existe desde Chrome 135 pero es solo Chromium. Se construyó la ruta clásica como
  base, que es lo correcto para una librería de copiar y pegar; queda como posible mejora futura
  dentro de `@supports`.
