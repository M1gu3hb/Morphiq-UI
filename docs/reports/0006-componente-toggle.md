# Reporte 0006 — Componente Toggle

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-toggle` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 3. Construir el Toggle (switch on/off accesible) replicando el patrón de Button y Card, respetando el guardarraíl porque Codex trabaja en paralelo.

## Objetivo

Añadir el tercer componente de producción al registry — un switch on/off — cumpliendo el
contrato que `scripts/verify-registry.mjs` ya verifica automáticamente, y sin tocar la
superficie genérica.

## Qué se hizo

- `src/registry/ui/toggle.tsx` — el componente.
- `src/registry/previews/toggle-preview.tsx` — preview `PreviewProps` que cubre los 3
  `variant` y los 3 `size`.
- `src/registry/index.ts` — entrada `toggle` después de `card`.
- `docs/reports/0006-componente-toggle.md` — este reporte.

Nada más. No se tocó `schema.ts`, los componentes existentes, `component-detail.tsx`, el
route `[slug]`, el catálogo, `globals.css`, `package.json`, `scripts/` ni `tests/`.

**Nota de preflight:** al empezar, `main` seguía sin la fundación (PRs #2/#3/#4 abiertos).
Me detuve y lo reporté; Miguel autorizó los merges por CLI y los ejecuté (`gh pr ready 4`,
`gh pr merge 2/3/4 --merge --delete-branch`). `main` quedó en `971b9a0` con el gate completo
en verde —incluida la primera ejecución de `verify-registry` contra Card, que era el riesgo
señalado en el reporte 0004: pasó (`{"components":2,…,"status":"ok"}`)—. Recién entonces
ramifiqué.

## Cómo se hizo

**El eje `variant`: `default | labeled | icon`.** No es decoración: son las tres formas en
que un switch comunica su estado en productos reales.

- `default` — solo pista y thumb. El estado se lee por posición y color.
- `labeled` — leyendas ON/OFF dentro de la pista. Redunda el estado en texto para quien no
  distingue bien el color. Los textos son props (`onLabel`/`offLabel`, por defecto
  `"ON"`/`"OFF"`), no literales incrustados, porque el producto es bilingüe.
- `icon` — glifo de check/cruz dentro del thumb. Misma redundancia sin ensanchar la pista.

`labeled` es el único que cambia geometría, y solo ensancha `--mq-track-w`; el recorrido del
thumb se recalcula solo (ver abajo), así que no hay que reescribir la geometría por variante.

**Geometría derivada.** `--mq-travel` se calcula:
`calc(var(--mq-track-w,46px) - var(--mq-thumb,20px) - calc(var(--mq-pad,3px) * 2))`.
Los tres tamaños fijan ancho/alto/thumb y el recorrido cae solo; `labeled` solo pisa el ancho.
Verificado en navegador: 36×20/14, 46×26/20, 58×32/26, y con `labeled` la pista pasa a 70px
en `md` con el thumb llegando al extremo correcto.

**Accesibilidad del switch — la parte delicada.**

- Es un `<button type="button">` nativo con `role="switch"` y `aria-checked`. Esa es la
  decisión importante: **el teclado y el área de pulsación no están reimplementados**. Un
  `<div>` con `tabIndex` y manejadores de tecla propios es la forma habitual de romper esto;
  el botón nativo ya responde a Espacio y a Enter, entra en el orden de tabulación y se
  comporta bien con lectores de pantalla.
- El nombre accesible sale del hijo de texto visible. Las leyendas ON/OFF y los glifos van
  con `aria-hidden`, porque `aria-checked` ya comunica el estado; exponerlos también lo
  anunciaría dos veces y competiría con el nombre del control. Verificado: con `labeled`, el
  nombre accesible sigue siendo `"Haptics"`, no `"ON Haptics"`.
- Controlado y no controlado: `checked` (controlado), `defaultChecked` (no controlado),
  `onCheckedChange` siempre.
- `disabled` usa el atributo nativo — correcto para un control de formulario, que sí debe
  salir del orden de tabulación. `loading`, en cambio, mantiene el foco y bloquea la
  activación en el manejador, siguiendo la lección del Button (reporte 0003): un elemento
  deshabilitado se desenfoca y silenciaría el anuncio de `aria-busy`.
- `prefers-reduced-motion` suprime la transición del thumb; `forced-colors` pasa pista y
  thumb a colores de sistema para que el control no quede en un contorno vacío al descartarse
  los rellenos.

**Self-containment.** Igual que Button y Card: paleta y geometría en variables `--mq-*`
declaradas sobre el propio control, **siempre** con fallback literal. `verify-registry` lo
comprueba de forma automática y pasa. Dependencias declaradas: `class-variance-authority`,
`clsx`, `tailwind-merge` e `internal: ["src/lib/cn.ts"]` — exactamente el cierre transitivo
de imports (la suite falla tanto por dependencias que faltan como por dependencias fantasma,
así que **no** declaré `@radix-ui/react-slot`: este componente no usa `Slot`).

## Resultado esperado vs. real

- **Esperado:** Toggle en el registry, `/components/toggle` estática, gate verde con
  `test:registry`. **Real:** cumplido. El build pasa a 10 páginas y lista
  `/components/toggle` bajo `● (SSG)`; `verify-registry` reporta `{"components":3,
  "selfContained":true,"guards":"ok","status":"ok"}`.
- **Diferencia:** el prompt proponía `default | labeled` "o la forma que decidas
  justificar". Añadí un tercero (`icon`) porque es un patrón real y distinto, no una
  variación de relleno.

## Bugs / obstáculos y cómo se resolvieron

1. **El thumb no se animaba — saltaba.** Síntoma: `transitionProperty` en el thumb era
   `"transform, background-color"` mientras la propiedad que realmente cambiaba era
   `translate`. Causa: en Tailwind v4 las utilidades `translate-x-*` escriben la propiedad
   **`translate`**, no `transform`. Verificado en el CSS emitido:
   `.translate-x-0{--tw-translate-x:0px;translate:var(--tw-translate-x) var(--tw-translate-y)}`.
   Transicionar `transform` no anima nada. Solución: `transition-[translate,background-color]`.
   Confirmado tras el fix: `transitionProperty: "translate, background-color"`.
2. **Contraste del glifo por debajo de AA.** Pinté el check con el color de la pista
   encendida (`--mq-track-on`), pero el glifo va sobre el **thumb**, no sobre la pista: medía
   **2.13:1** en clay y **1.43:1** en skeuo, bajo el 3:1 que WCAG 1.4.11 pide a gráficos no
   textuales. Solución: token propio `--mq-icon` elegido contra el thumb en cada material
   (y que se invierte en adaptive oscuro, donde el thumb pasa a ser oscuro). Tras el fix, el
   mínimo es 13.72:1.
3. **El thumb desaparecería en adaptive oscuro.** Con esquema oscuro la pista encendida es
   casi blanca, así que un thumb blanco se fundía con ella. Solución:
   `dark:data-[state=checked]:[--mq-thumb-bg:#171817]` (y el glifo invierte con él).
4. **`calc()` con espacios.** `calc(a - b)` necesita espacios alrededor de los operadores;
   escritos sin escapar, Tailwind produciría una declaración inválida que se descarta en
   silencio. Se usó el escape `_`. Verificado: el navegador computa
   `calc(46px - 20px - calc(3px * 2))`.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), corrido antes de empezar y tras cada tanda.

- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios.
- `npm run test:studio` — ✅ `{"templates":5,…,"status":"ok"}`.
- `npm run test:registry` — ✅ `{"components":3,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ Next 16.2.10 Turbopack, **10 páginas**, sin warnings, con
  `/components/button`, `/components/card` y `/components/toggle` bajo `● (SSG)`.

Verificación adicional contra el DOM real:

- **Semántica:** `<button type="button" role="switch">`, `aria-checked` alterna
  `true`↔`false` al activar, `data-state` acompaña.
- **Nombre accesible:** `"Haptics"` del hijo de texto; las 2 leyendas de `labeled` y el SVG
  de `icon` llevan `aria-hidden="true"` y no contaminan el nombre.
- **Recorrido del thumb:** `translate` pasa de `0px` a `20px` en `md`; los tres tamaños
  calculan 16/20/26px.
- **Contraste WCAG calculado sobre los valores fuente:** las 10 leyendas ON/OFF (4 materiales
  + las 2 ramas de adaptive oscuro) van de **5.89:1** a **16.32:1**, ninguna bajo 4.5:1. Los
  glifos van de **13.72:1** a **17.8:1**, ninguno bajo el 3:1 de no-texto.
- **Estados:** `idle` alterna al hacer click; `loading` → `aria-busy="true"`, **sigue
  enfocable**, `disabled` nativo `false`, click cancelado y estado sin cambiar; `disabled` →
  `disabled` nativo `true`, fuera del orden de foco, sin cambio de estado.

**Lo que NO pude verificar y por qué.** No conseguí confirmar empíricamente la activación por
Espacio/Enter. Hice el experimento de control: creé un `<button>` vanilla, sin nada de
Morphiq, y tampoco se activó con las mismas pulsaciones. Los eventos llegan al DOM
(`isTrusted=true`) pero con **`event.key` vacío**, así que el navegador no puede mapearlos a
una activación. Es una limitación del arnés de automatización de este entorno, no del
componente: la activación por teclado aquí es la del `<button>` nativo —no hay manejador de
teclado propio que pueda romperla—, pero queda como comprobación pendiente en un navegador
real. Tampoco hay revisión visual pixel a pixel (la captura de pantalla del entorno vuelve a
dar timeout).

## Riesgos, deuda y pendientes

- **Hallazgo fuera de mi guardarraíl, para un follow-up:** `button.tsx` y `card.tsx` (ya en
  `main`) declaran `transition-[transform,…]` junto a `hover:-translate-y-[2px]`. Es el mismo
  bug que corregí en el Toggle: Tailwind v4 anima la propiedad `translate`, no `transform`,
  así que **su elevación al hover no se anima, salta**. No los toqué porque están fuera del
  guardarraíl de esta tarea. Fix de una palabra en cada uno: añadir `translate` a la lista de
  `transition-[…]`. Vale la pena que la suite de Codex lo detecte: "usa `translate-*` pero no
  transiciona `translate`" es una regla verificable estáticamente.
- **`verify-registry` no cubre contraste ni semántica ARIA.** Comprueba el contrato del
  registry y la autocontención, que es mucho, pero los dos bugs reales de esta ronda (glifo a
  1.43:1 y el thumb sin animar) habrían pasado el gate. Un chequeo de contraste sobre los
  tokens declarados sería el siguiente escalón de valor.
- **La activación por teclado depende del `<button>` nativo.** Es lo correcto, pero significa
  que si alguien en el futuro cambia el elemento raíz (p. ej. añadiendo `asChild`), hereda la
  obligación de reimplementar teclado. Deliberadamente **no** expuse `asChild` en el Toggle
  por eso.
- **`labeled` con textos largos.** `onLabel`/`offLabel` no truncan; una traducción larga
  desbordará la pista. Si se usa con textos que no sean ON/OFF, hay que ajustar
  `--mq-track-w` desde `className`.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0005.
  Sin impacto en el gate.

## Estado final

Completo. Toggle entregado con 4 materiales × 3 variantes × 3 tamaños, controlado y no
controlado, gate verde incluido `test:registry`, y sin tocar ningún archivo fuera del
guardarraíl.
