# Reporte 0013 — Componente Tabs

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-tabs` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 7. Construir Tabs sobre `@radix-ui/react-tabs`, creando solo sus tres archivos, en paralelo con Codex que construye Alert.

## Objetivo

Añadir una superficie con pestañas al registry apoyando la mecánica accesible en Radix, y
aportar apariencia sin pelearse con ella.

## Qué se hizo

**Paso 0 (autónomo).** Los PRs #10 (Input) y #11 (Badge) ya estaban mergeados cuando llegué
(Codex se adelantó); el comando fue idempotente y siguió. `main` quedó en `23a0f5b` con las
cinco entradas.

**Tres archivos, ninguno compartido:** `ui/tabs.tsx`, `previews/tabs-preview.tsx`,
`entries/tabs.ts`. Ni `index.ts`, ni `generated.ts`, ni `verify-registry.mjs`, ni
`package.json`. `git status` al terminar: solo adiciones.

## Cómo se hizo

### API componible y el mapeo a Radix

Cuatro exports que corresponden 1:1 con los primitivos: `Tabs`, `TabsList`, `TabsTrigger`,
`TabsContent`. Cada uno envuelve su primitivo y le añade clases; ninguno reimplementa
comportamiento.

Lo que aporta Radix y **no** se toca: `role="tablist" | "tab" | "tabpanel"`, el emparejamiento
`aria-controls` ↔ `aria-labelledby`, el tabindex móvil, la navegación con flechas / Inicio /
Fin, y un panel enfocable. Sus props pasan tal cual, incluido `activationMode="manual"` para
superficies con paneles caros.

Lo que aporta este archivo: apariencia, y **el anillo de foco del panel** — Radix lo hace
enfocable pero no lo estiliza, así que sin eso el foco sería invisible.

**`material`, `variant` y `size` se declaran una sola vez, en la raíz.** Los tokens de material
bajan por herencia CSS; los dos ejes de presentación llegan a las partes por un contexto de
React de tres líneas. La alternativa era repetirlos en cada `TabsTrigger`, que es justo la
clase de repetición que alguien acaba escribiendo inconsistente. El contexto de Radix es
privado y con scope, así que no servía.

### Ejes

- **`variant: default | pill | underline`** — los tres modismos reales: control segmentado con
  pista, píldoras sueltas, y subrayado.
- **`size: sm | md | lg`** — 28/34/42 px de alto, con padding, tipografía, radio y el padding
  de la pista proporcionales. Verificado en el DOM: 28/34/42, `px` 10/14/18, `font-size`
  11/12/13, radio 8/10/13, padding de lista 3/4/5.

### Un detalle de caja que resuelve tres cosas a la vez

El trigger lleva **siempre** `border-b-2 border-b-transparent`, en los tres tratamientos. Ese
borde reservado es: el indicador del tratamiento `underline` cuando está activo; la marca de
pestaña activa en `forced-colors` (donde los rellenos se descartan y un fondo no sirve de
nada); y espacio ya contabilizado, así que ninguna variante cambia el modelo de caja ni
desplaza la fila al activarse.

### Self-containment

Paleta en `MATERIAL_TOKENS` declarada en la raíz, siempre con fallback literal; cero clases de
`globals.css`, cero vars de `:root`. `verify-registry` lo comprueba solo y pasa.

Donde un tratamiento **no** tiene pista propia (`pill`, `underline`), la etiqueta inactiva
hereda `currentColor` en vez de fijar un color que sería una suposición sobre la página —
misma decisión que las variantes fantasma/contorno de Button y Card. La activa sí puede fijar
color en `pill`, porque tiene relleno propio.

### Estado nunca por color solo

En `underline` el estado activo no se distingue únicamente por color: combina la regla de
acento, un cambio de peso (`bold` → `extrabold`) y de opacidad (70% → 100%).

### Cobertura de transición

`transition-[background-color,color,box-shadow,border-color,opacity]` — exactamente lo que
cambia y nada más. `opacity` está en la lista porque **sí** cambia en los tres tratamientos:
el fundido de deshabilitado (45%) aplica a todos, y `underline` además atenúa la pestaña
inactiva. Verificado con `getAnimations()` sobre el build de producción:

| Propiedad cambiada | `CSSTransition` creada |
| --- | --- |
| `background-color` | sí |
| `color` | sí |
| `box-shadow` | sí |
| `border-bottom-color` | sí |
| `opacity` | sí |
| `translate` (no declarada) | **no** |

### Contraste activo/inactivo

Calculado con la fórmula WCAG sobre los valores fuente y contrastado contra los colores
computados en el DOM, que coincidieron.

| Material | Inactiva (sobre su pista) | Activa (sobre su relleno) |
| --- | --- | --- |
| clay | 6.88:1 | 6.44:1 |
| glass | **5.03:1** (peor fondo) | 9.44:1 |
| skeuo | 7.94:1 | 14.34:1 |
| adaptive | 6.59:1 | 17.08:1 |
| adaptive oscuro | 7.51:1 | 9.82:1 |

- Mínimo absoluto: **glass inactiva 5.03:1**, compuesta sobre el peor fondo posible — para eso
  el vidrio lleva tinte propio.
- `pill`/`underline`: la inactiva hereda del anfitrión; con el 70% de opacidad que la atenúa
  mide **6.16:1** sobre el papel de Morphiq (6.57:1 sobre blanco).
- La regla de acento es indicador no textual: mínimo **4.1:1** (clay), por encima del 3:1 que
  pide WCAG.
- Deshabilitada al 45%: WCAG exime del requisito a los controles inactivos.

## Resultado esperado vs. real

- **Esperado:** Tabs en el registry, `/components/tabs` estática, `verify-registry` con
  `components:6`. **Real:** cumplido exactamente. Build de 13 páginas; `tabs.html`
  prerenderizada con `role="tablist"`, `role="tab"` y `role="tabpanel"` ya en el HTML.

## Bugs / obstáculos y cómo se resolvieron

1. **`opacity` faltaba en la lista de transición.** Detectado al revisar mi propio código
   antes de medir: `underline` atenúa la inactiva al 70% y `disabled` baja al 45%, o sea que
   `opacity` cambia de estado en los tres tratamientos y tenía que estar declarada. Añadida.
2. **Falsa alarma investigada a fondo: "la pestaña deshabilitada no se atenúa".** El DOM
   reportaba `opacity: 1` con la clase presente y el elemento haciendo match de `:disabled`.
   Antes de tocar nada fui descartando: la clase estaba, `t.matches('.opacity-70')` daba
   `true`, no había estilo inline, ninguna regla de hoja de estilos que hiciera match ponía
   `opacity`, y **el mismo nodo clonado fuera del árbol medía 0.7**. La causa resultó ser el
   entorno: `getAnimations()` mostró dos `CSSTransition` en `playState: "running"` con
   **`currentTime: 0`** — el compositor del panel de vista previa está congelado (el mismo
   artefacto de rAF que documenté en los reportes 0004, 0006 y 0007). Una transición detenida
   en t=0 informa el valor **inicial**, no el final. Al cancelar las animaciones, la opacidad
   pasó a 0.7 al instante. **No era un bug del componente**; lo dejo escrito porque es una
   trampa cara: en este entorno `getComputedStyle` miente sobre cualquier propiedad que esté
   en una transición.
3. **Falsa alarma descartada leyendo la fuente de Radix: `tabIndex: -1` en las tres
   pestañas.** Parecía que el grupo no era alcanzable con Tab. Leyendo
   `@radix-ui/react-roving-focus` está la respuesta: `tabIndex: isTabbingBackOut ||
   focusableItemsCount === 0 ? -1 : 0` en el **contenedor**. Confirmado en el DOM: el
   `[role="tablist"]` tiene `tabIndex: 0` y delega. Es el diseño documentado de roving focus,
   no un fallo. Verifiqué además que `ArrowRight` mueve el foco de verdad (el elemento activo
   pasó a la pestaña "Activity").
4. **Fallo de gate autoinfligido.** Lancé `npm run check` en primer plano mientras el gate de
   preflight seguía corriendo en segundo plano; Next 16 tiene un lockfile que impide dos
   builds simultáneos. Es la tercera vez que me tropiezo con correr dos cosas a la vez sobre
   el mismo proyecto. Re-ejecutado en limpio: verde.

## Verificación (gate)

`npm run check` en verde (**exit code 0**):

- `registry:gen` — `{"entries":6,"slugs":["badge","button","card","input","tabs","toggle"]}`.
- `lint` ✅ · `typecheck` ✅ · `test:studio` ✅ `status:"ok"`.
- `test:registry` — ✅ `{"components":6,"selfContained":true,"guards":"ok","status":"ok"}`.
- `build` — ✅ 13 páginas, sin warnings; `/components/tabs` entre las rutas `● (SSG)` y
  `.next/server/app/components/tabs.html` presente.

Verificación adicional, hecha **contra el build de producción** (`npm run start`) y no solo
contra el dev server, precisamente por el artefacto del punto 2:

- **ARIA:** 3 tabs / 3 paneles, `aria-selected`, `data-state`, `aria-controls` que resuelve al
  panel y `aria-labelledby` que apunta de vuelta al trigger, panel con `tabIndex: 0`.
- **Roving focus:** contenedor con `tabIndex: 0`, ítems a `-1`, `ArrowRight` mueve el foco.
- **Variantes:** `default` con pista `#efe7db`, radio 14 y activa `#ff9077`/`#4a1d13` con
  sombra; `pill` sin pista, triggers redondos, activa con relleno; `underline` sin pista, con
  hairline inferior y la activa marcando `#c9482f`, inactiva al 70%.
- **Estados:** `focus` → `outline solid 2px`; `disabled` → `disabled` nativo y, una vez
  cancelada la transición congelada, opacidad 0.45.
- **Transición:** las cinco propiedades declaradas crean `CSSTransition`; `translate`, no.

**Lo que no verifiqué:** sin revisión visual pixel a pixel (la captura del entorno sigue dando
timeout). La activación por teclado se comprobó moviendo el foco con flechas, pero no pude
sintetizar una pulsación real de Enter/Espacio — el arnés entrega eventos con `key` vacío, como
documenté en el reporte 0006.

## Riesgos, deuda y pendientes

- **El contexto de presentación acopla las partes a `<Tabs>`.** `TabsList`/`TabsTrigger` fuera
  de un `<Tabs>` caen a `default`/`md` en vez de fallar. Radix ya exige esa anidación, así que
  no añade una restricción nueva, pero el fallback es silencioso.
- **`activationMode` por defecto es `automatic`** (el de Radix): las flechas activan y montan
  el panel. Para paneles caros hay que pasar `manual` explícitamente; está documentado en el
  JSDoc y en `a11y`, pero no hay nada que lo imponga.
- **`underline` con muchas pestañas desborda**: la lista es `w-full` sin scroll horizontal. Un
  `overflow-x-auto` con scroll por teclado sería el siguiente escalón; no lo añadí para no
  inventar comportamiento fuera del encargo.
- **El color de acento es fijo por material** (con rama oscura solo en `adaptive`), como
  `--mq-ring` en el resto de la librería. Asume superficie clara.
- **Sin cobertura E2E propia** del comportamiento de teclado. Un test de Playwright que tabule
  al grupo y recorra con flechas sería valioso, y ahí sí se podrían sintetizar teclas de
  verdad.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0012.

## Estado final

Completo. Tabs entregado con 4 materiales × 3 tratamientos × 3 tamaños sobre los primitivos de
Radix, gate verde con `components:6`, `/components/tabs` estática, y sin tocar un solo archivo
compartido.
