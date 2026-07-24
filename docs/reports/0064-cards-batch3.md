# 0064 · Cards (tanda 3) · 10 componentes

- **Ronda:** R19 · Sección Cards (tanda 3)
- **Ejecutor:** Claude Code (en paralelo con Codex · Efectos tanda 3)
- **Rama:** `feat/cards-batch3` → PR contra `main`
- **PR:** #63
- **Gate:** `npm run check` → `{"components":215,...,"status":"ok"}` (build genera 10 rutas SSG nuevas)
- **Base:** `main` a 205 entradas (tras mergear #61 text-batch3 + #60 feedback-batch2 en el Paso 0). 205 + 10 = **215**.

## Resumen

Diez tarjetas, las diez con superficie → los cuatro materiales (`clay/glass/skeuo/adaptive`) con
profundidad real (skeuo en greige cálido `#e6e3da`, `adaptive` gira con `dark:`). Tamaños
`sm/md/lg`, variante única `default`.

**Fuente/licencia (todas):** código original en estilo Morphiq, inspirado en patrones de proyectos
**MIT** (magicui, animata, smoothui, kokonutui); no copiado. Atribución fina la mantiene el
orquestador en `docs/CREDITS.md` (no editado en esta ronda).

**Contrato común de a11y (las 10):** cada tarjeta es `<article>` (o `<figure>` para una cita) con un
encabezado real de **nivel configurable** (nunca `h3` hardcodeado); toda imagen lleva `alt`
significativo dentro de un pozo `aspect-ratio` que reserva su caja antes de cargar (garantía
anti-CLS); el estado (guardado, asistiendo, gustado, revelado) va por `aria-pressed` **más** texto
y/o ícono distinto — **nunca solo por color**; los conteos son texto real; las confirmaciones se
anuncian por una región `aria-live="polite"` presente desde el primer render; `reduced-motion`
descarta el recorrido pero conserva el estado final; `forced-colors` mantiene límites
(`CanvasText`), limpia gradientes/blur y repinta rellenos con significado a colores de sistema;
contraste ≥ 4.5:1. Sin dependencia `motion`; las diez declaran exactamente
`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (las diez importan íconos).

**Patrón de enlace de tarjeta entera.** Donde la tarjeta completa navega se usa `STRETCHED_LINK`:
el `<a>` vive **dentro del encabezado** (el título es su nombre accesible) y su `::after` cubre la
tarjeta; los demás controles se sitúan en `z-10`, por encima de esa capa, así que **nada
interactivo se anida dentro del enlace** y cada control conserva su propio foco. La tarjeta enlazada
añade `:focus-within` para que tabular al enlace ilumine la tarjeta; una tarjeta inerte no lo hace
(anillaría dos veces el mismo foco).

**SSR/SSG-safe:** ninguna llama `Date.now()`/`new Date()` en render — las fechas llegan por props y
se pintan como `<time dateTime={iso}>`; las imágenes de las previews son SVG inline en `data:` URI,
nunca de red.

## Las 10 tarjetas

### 1. Testimonial Card (`testimonial-card`)
- **Técnica:** `<figure>` + `<blockquote>` + `<figcaption>` (el emparejamiento HTML correcto para una
  cita y su fuente, por eso la atribución va fuera del blockquote). Avatar en pozo cuadrado fijo con
  `width`/`height` intrínsecos.
- **a11y:** el rating **no** son estrellas solas — el valor va como texto ("4.5 out of 5") y las
  estrellas son `aria-hidden`. Voto "Helpful" con `aria-pressed` + etiqueta que cambia + ícono
  relleno/contorno. Encabezado `sr-only` cuando no hay titular visible, para que la navegación por
  encabezados siga alcanzando la tarjeta.

### 2. Blog Card (`blog-card`)
- **Técnica:** portada real en pozo `aspect-[16/10]` con `width`/`height`; chip de categoría como
  span plano (un chip-enlace anidaría un interactivo bajo la capa estirada).
- **a11y:** `STRETCHED_LINK` en el encabezado; `coverAlt` es prop **obligatoria**; fecha en `<time>`
  desde props. Toggle "Save" con `aria-pressed` + etiqueta que cambia + ícono.

### 3. Feature Card (`feature-card`)
- **Técnica:** tarjeta de glifo (sin `<img>`), con `stretchLink` conmutable (por defecto enlazada).
- **a11y:** el ícono es decorativo (`aria-hidden`) y nunca porta significado solo — lo dice el
  título. El estado no disponible se enuncia como **línea de texto visible**, no por atenuación.

### 4. Event Card (`event-card`)
- **Técnica:** bloque de fecha destacado (día + mes) con portada opcional.
- **a11y:** la fecha es `<time dateTime>` real con una fecha completa `sr-only` junto al bloque
  grande (que por sí solo se leería como fragmentos). CTA con `aria-pressed`, etiqueta que cambia
  ("Attend" → "Attending") y confirmación por `aria-live`.

### 5. File Card (`file-card`)
- **Técnica:** miniatura en pozo cuadrado fijo; menú de acciones hand-rolled sobre el patrón de
  `split-button`.
- **a11y:** el disparador de acciones tiene nombre accesible que **incluye el nombre del archivo**
  ("Actions for report.pdf") — sin eso, una lista de archivos tendría N botones idénticos.
  `aria-haspopup`/`aria-expanded`; menú con foco itinerante, `Arrow`/`Home`/`End`, `Escape` que
  devuelve el foco. La acción destructiva se marca con **texto**, no con color.

### 6. Weather Card (`weather-card`)
- **Técnica:** sin imagen ráster; glifos de condición y tira de pronóstico como lista real.
- **a11y:** la condición **nunca** es ícono/color solo — la palabra ("Partly cloudy") es texto
  visible junto al glifo `aria-hidden`. Las unidades se deletrean para lectores (que "24°" no se lea
  como "24 signo de grado"); cada día del pronóstico nombra su weekday en texto.

### 7. Swipe Cards (`swipe-cards`)
- **Técnica:** pila deslizable con arrastre hand-rolled (pointer events + `setPointerCapture`,
  desplazamiento por `translate` inline y transición desactivada durante el drag).
- **a11y:** **el arrastre nunca es la única vía** — hay botones reales Reject/Accept y teclado
  completo (ArrowLeft rechaza, ArrowRight acepta, cediendo ante inputs/sliders/contenteditable). El
  avance se anuncia por `aria-live` + `role="progressbar"` con `aria-valuetext` ("N of M reviewed").
  El **foco se preserva** en cada decisión (nunca cae a `<body>` al desmontarse la tarjeta superior);
  las tarjetas de abajo son `inert` + `aria-hidden`. Bajo `reduced-motion` no hay fling: la tarjeta
  decidida desaparece y el anuncio hace el trabajo.
- **Decisión de diseño notable:** aquí **no** se usa `STRETCHED_LINK` a propósito — una capa
  `::after` a sangre completa se tragaría el `pointerdown` y mataría el arrastre; el enlace va en
  `z-10` dentro del encabezado.

### 8. Post Card (`post-card`)
- **Técnica:** publicación social con media opcional en pozo `aspect-ratio` y fila de acciones.
- **a11y:** "Like" es `<button aria-pressed>` con etiqueta que cambia y **conteo en texto**;
  `aria-live` anuncia el cambio ("Liked. 41 likes."). Comment y Share llevan nombre accesible que
  incluye su conteo. Timestamp en `<time>` desde props.

### 9. Coupon Card (`coupon-card`)
- **Técnica:** los recortes del ticket son una **máscara CSS** (`radial-gradient`) más una regla
  discontinua `aria-hidden` — no una imagen, así que funciona sobre cualquier fondo y no hay caja
  que reservar.
- **a11y:** el código es **texto real seleccionable** (nunca imagen ni `user-select-none`); el botón
  copiar nombra el código ("Copy code SPRING25") y anuncia por `aria-live`; si el código empieza
  oculto, el control es `aria-expanded` y el código **no está en el árbol de accesibilidad** hasta
  revelarse. Bajo `forced-colors` la máscara puede ignorarse, así que se conserva un borde real.

### 10. Progress Card (`progress-card`)
- **Técnica:** tarjeta de meta con métrica grande, barra y línea de estado; valores por props y con clamp.
- **a11y:** `role="progressbar"` + `aria-valuemin/max/now` + `aria-valuetext` que deletrea la lectura
  ("$3,200 of $5,000, 64 percent"); esas aria props y `role` van **`Omit`** del tipo público para que
  un consumidor no las desincronice. El "n de N" y la palabra de estado son texto real, así que el
  **color solo refuerza**. Relleno vs pista se distinguen por más que el tono
  (`Highlight`/`GrayText` en forced-colors).

## Proceso (según restricciones de la ronda)

Proceso mínimo indicado: **sin verificación en navegador**, **sin pase de revisión adversarial ni
sub-agentes/workflow de review** (el orquestador audita), **sin TDD**, **sin git worktree**. La
**generación** se hizo con workflows de generación (un agente por componente, leyendo las
referencias en D: y reutilizando las recetas verbatim) — trabajo primario, no revisión. Durante el
desarrollo, `lint`/`typecheck` rápidos; **un solo `npm run check`** completo al cierre.

### Interrupción por límite de sesión (sin pérdida de trabajo)
La generación completó 6/10 y cuatro agentes cayeron por el límite. Al reanudar, la inspección en
disco mostró que **`post-card` sí había escrito sus 3 archivos** (falló solo al retornar) y que
`swipe-cards`, `coupon-card` y `progress-card` tenían su `ui` **completo** (cierre y `export`
correctos), faltándoles preview+entry. Un segundo workflow los completó leyendo cada `ui` existente
para clavar props y cierre de dependencias. No se regeneró ni se perdió trabajo válido.

### Corrección previa al gate
Lint marcó un warning en `swipe-cards`: `resetLabelledBy` se destructuraba pero nunca se usaba.
Estaba tipado `never` —así que ningún consumidor podía pasarlo— y por tanto quitarlo del spread al
DOM no lograba nada: era una prop no-op en la API pública. Se eliminaron la desestructuración y la
intersección de tipo. Lint y typecheck quedaron sin errores **ni warnings**.

## Nota de entorno (árbol compartido con Codex) — regla nueva aplicada

Tras el incidente de R18 (un `git clean -fd` borró del disco los archivos sin trackear), esta ronda
se ejecutó con la regla dura de **commitear y empujar temprano**: en cuanto hubo material se
commitearon los 24 archivos disponibles (7 tarjetas completas + los 3 `ui` huérfanos) y se
**empujaron a origin** antes de correr nada más; los 6 archivos del segundo pase se commitearon y
empujaron en cuanto existieron. En ningún momento hubo trabajo mío como untracked vulnerable, y
cuando el límite de sesión cortó la generación **no se perdió nada**.

Se respetaron las demás reglas del árbol compartido: `HEAD` apareció varias veces en
`feat/effects-batch3` (Codex) y se volvió a `feat/cards-batch3` antes de cada gate/commit; **no se
corrió `git clean` ni `git checkout -- .`** en ningún momento; **no se lanzó `npm ci`**
(`node_modules` estaba sano y una instalación en paralelo lo habría vaciado); el WIP de Codex
(`click-spark`, 3 archivos sin trackear) se dejó **intacto** y nunca se stageó. `git add` fue solo
de mis 31 archivos explícitos (nunca `-A`); no se tocó `docs/CREDITS.md`, `schema.ts`,
`verify-registry`, `package.json` ni ningún `ui/*` existente.
