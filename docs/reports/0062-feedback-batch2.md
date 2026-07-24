# 0062 · Feedback (tanda 2) · 10 componentes

- **Ronda:** R18 · Sección Feedback (tanda 2)
- **Ejecutor:** Claude Code (en paralelo con Codex · Texto tanda 3)
- **Rama:** `feat/feedback-batch2` → PR contra `main`
- **PR:** #60
- **Gate:** `npm run check` → `{"components":195,...,"status":"ok"}` (build genera 10 rutas SSG nuevas)
- **Base:** `main` a 185 entradas (tras mergear backgrounds-batch3 + navigation-batch2 #59 en el Paso 0). 185 + 10 = **195**.

## Resumen

Diez componentes de feedback. Los tres con superficie de panel (`result-state`, `loading-overlay`,
`status-summary`) llevan los cuatro materiales (`clay/glass/skeuo/adaptive`, skeuo en greige cálido
`#e6e3da`, `adaptive` gira con `dark:`); los siete inline/agnósticos (`rating`, `countdown-timer`,
`signal-bars`, `trend-indicator`, `inline-feedback`, `segmented-progress`, `save-indicator`) son
`["adaptive"]`. Tamaños `sm/md/lg`, variante única `default`.

**Fuente/licencia (todos):** código original en estilo Morphiq, inspirado en patrones de proyectos
**MIT** (magicui, animata, smoothui, kokonutui) y en las WAI-ARIA Authoring Practices para
`meter`/`progressbar`/`slider`/live regions; no copiado. Atribución fina la mantiene el orquestador
en `docs/CREDITS.md` (no editado en esta ronda).

**Contrato común de a11y (los 10):** rol correcto según el uso (`status`/`alert`/`progressbar`/
`meter`/`timer`/`slider`) con sus `aria-value*` y `aria-live`+`aria-atomic`; **el estado nunca es
solo color** — cada componente lo transmite por al menos tres canales redundantes (texto real
visible o `sr-only`, forma/glifo, y geometría como altura o relleno); `reduced-motion` descarta el
movimiento pero **conserva el estado final**; `forced-colors` mantiene límites (`CanvasText`),
repinta rellenos con significado a `Highlight` y las pistas a `GrayText`; contraste ≥ 4.5:1. Sin
dependencia `motion` (CSS/keyframes puros).

**SSR/SSG-safe:** ninguno llama `Date.now()`/`new Date()` **durante el render** (rompería la
hidratación en una página estática). Los dos que manejan tiempo lo resuelven así: `countdown-timer`
toma el objetivo por prop y hace la primera lectura de reloj **dentro del efecto**;
`save-indicator` recibe `savedAt` como prop y calcula el texto relativo en un efecto. Todos los
`setInterval` viven en efectos con limpieza, y los `setState` se hacen desde el **callback** del
timer, nunca síncronos en el cuerpo del efecto.

## Los 10 componentes

### 1. Rating (`rating`) — `["adaptive"]`
- **Técnica:** estrellas SVG **inline** (sin lucide) con medios pasos reales: el medio relleno es
  **geometría** — la estrella sólida vive dentro de una ventana `overflow-hidden` al 50% de ancho,
  no una opacidad (que se leería como color). Sin `clipPath` con id, así que dos ratings en la
  misma página nunca colisionan.
- **a11y:** patrón **`role="slider"`** (una sola parada de tabulación, paso 0.5) con
  `aria-valuemin/max/now` + `aria-valuetext` que deletrea "3.5 out of 5 stars"; flechas, PageUp/Down,
  Home/End; la vista previa por hover no muta el valor comprometido y se limpia al salir. El valor
  numérico también se imprime como texto visible.

### 2. Countdown Timer (`countdown-timer`) — `["adaptive"]`
- **Técnica:** grupos de dígitos con cifras tabulares y anillo/segmentos opcional; `setInterval` en
  efecto con limpieza, `setRemaining` desde el callback del tick.
- **a11y:** `role="timer"` — cuyo `aria-live` **implícito es `off`**, así que se opta explícitamente
  por `polite`+`aria-atomic`. Los dígitos visibles cambian cada segundo dentro de una capa
  `aria-hidden`, mientras la región viva recibe una frase `sr-only` **gruesa** (por minuto, más los
  últimos segundos y la finalización) para no inundar al lector de pantalla. `reduced-motion` sin flip.

### 3. Result State (`result-state`) — 4 materiales
- **Técnica:** panel grande de desenlace (ícono de tono, título como encabezado real de nivel
  configurable, descripción, acciones). Distinto de `empty-state`: esto es el **resultado** de una
  operación, no la ausencia de datos.
- **a11y:** mapeo de urgencia de `alert.tsx` — éxito/info/advertencia → `role="status"` (polite),
  error → `role="alert"` (assertive), con override; el ícono es decorativo y el tono se enuncia en
  una etiqueta `sr-only` ("Error: ") **dentro del encabezado**, así que el desenlace se pronuncia.

### 4. Loading Overlay (`loading-overlay`) — 4 materiales
- **Técnica:** scrim + panel con spinner **hand-rolled en SVG** (sin lucide, sin dependencia) sobre
  los children, dentro de un contenedor `relative`/`isolate` (sin portal global). Componente sin
  estado: totalmente controlado por props.
- **a11y:** mientras carga, el contenido cubierto lleva `aria-busy="true"` **y el atributo `inert`**,
  así que no se puede tabular a lo que está oculto tras el velo; el overlay es `role="status"`
  polite con mensaje real (`sr-only` "Loading" si no se pasa uno). Al terminar, `inert` y `aria-busy`
  desaparecen del árbol. Bajo `reduced-motion` el giro cede a un pulso calmo — el estado ocupado
  sigue transmitido por el texto y `aria-busy`.

### 5. Signal Bars (`signal-bars`) — `["adaptive"]`
- **Técnica:** barras ascendentes (sin íconos, elementos planos); componente sin estado ni efectos.
- **a11y:** `role="meter"` + `aria-valuemin/max/now` + `aria-valuetext` que deletrea "Good, 3 of 4";
  las barras son decorativas. El nivel se lee por **cuántas** están encendidas, por la **escalera de
  alturas** y por la etiqueta de texto — nunca por color. El nivel cero es un estado legítimo y se
  lee correctamente.

### 6. Trend Indicator (`trend-indicator`) — `["adaptive"]`
- **Técnica:** delta de KPI compacto con cifras tabulares; soporta semántica **invertida** (bajar es
  bueno: churn, tasa de error), desacoplando el tono de la dirección.
- **a11y:** `role="img"` con `aria-label` que enuncia la lectura completa como una frase ("Up 12.4
  percent versus last month, improvement."). La dirección viaja por tres canales sin color: la
  **forma** del glifo (tres glifos distintos), el **signo** en el número y el texto. Así el tono y la
  dirección nunca se contradicen para quien no distingue los matices.

### 7. Inline Feedback (`inline-feedback`) — `["adaptive"]`
- **Técnica:** mensaje de validación compacto bajo un campo; el contenedor de la región viva se
  renderiza **siempre** y solo se intercambia su contenido, para que el anuncio sea fiable.
- **a11y:** error → `role="alert"`/assertive; el resto → `role="status"`/polite, con `aria-atomic` y
  override de urgencia. Acepta `id` para que el campo lo apunte con `aria-describedby`. Cada tono se
  enuncia en palabras (Success / Error / Warning / Information / Hint), `sr-only` por defecto.

### 8. Segmented Progress (`segmented-progress`) — `["adaptive"]`
- **Técnica:** barra partida en N segmentos discretos (distinta del `progress` continuo y del
  `progress-steps` que etiqueta cada paso); sin hooks, totalmente derivada de props, con clamp.
- **a11y:** `role="progressbar"` + `aria-valuemin=0`/`max=N`/`now` + `aria-valuetext` "Step 3 of 7";
  esas aria props y `role` están **`Omit`** del tipo público para que un consumidor no las
  desincronice. Lectura visible "3 de 7" más una píldora de estado (Not started / In progress /
  Complete). Relleno vs pista se distinguen por trazo, no solo por relleno.

### 9. Save Indicator (`save-indicator`) — `["adaptive"]`
- **Técnica:** chip de autoguardado (idle / saving / saved / error) con ícono, etiqueta y timestamp
  relativo; `savedAt` es **prop**, el texto relativo se calcula en un efecto y se refresca con un
  intervalo que se limpia en el cleanup.
- **a11y:** `role="status"` polite para idle/saving/saved, escalando a `role="alert"` assertive en
  error, con `aria-atomic`. El estado va en el **texto de la etiqueta** ("Saving…", "Saved", "Could
  not save") y en el ícono. Botón "Reintentar" real con nombre accesible en el estado de error.

### 10. Status Summary (`status-summary`) — 4 materiales
- **Técnica:** panel tipo statuspage: `<section aria-labelledby>` con encabezado real de rango
  configurable y lista real (`ul`/`li`) de servicios.
- **a11y:** cada estado usa tres canales redundantes — el **nombre completo del estado como texto
  visible**, un glifo, y una **forma distinta** (disco lleno vs anillo vs triángulo). Ese
  diferenciador de forma es la jugada clave: nunca un punto verde/ámbar/rojo. El banner general es
  `role="status"`; una caída mayor puede escalar a `role="alert"`.

## Proceso (según restricciones de la ronda)

Proceso mínimo indicado: **sin verificación en navegador**, **sin pase de revisión adversarial ni
sub-agentes/workflow de review** (el orquestador audita), **sin TDD**, **sin git worktree**. La
**generación** se hizo con un workflow de generación (un agente por componente, leyendo las
referencias en D: y reutilizando las recetas verbatim) — trabajo primario, no revisión. Durante el
desarrollo, `lint`/`typecheck` rápidos; **un solo `npm run check`** completo al cierre.

### Verificación previa al gate
Se comprobó mecánicamente, contra la regla real de `verify-registry`, el **cierre de dependencias**
de los 10 (closure transitivo que sigue `@/lib/cn` hacia `clsx`+`tailwind-merge`; estricto en ambos
sentidos, así que declarar de más también rompe). Resultado: seis importan `lucide-react` y lo
declaran; **cuatro no lo importan y correctamente no lo declaran** — `rating` (estrellas SVG
inline), `loading-overlay` (spinner hand-rolled), `signal-bars` y `segmented-progress` (elementos
planos). Ninguno importa ni declara `motion`. También se verificó `category: "feedback"` en los diez
y que los materiales coincidan exactamente con el estándar (4 solo en los tres con superficie).

## ⚠️ Incidente: los 30 archivos sin trackear fueron borrados del árbol compartido

**Qué pasó.** Tras generar los 10 componentes y verificarlos (lint y typecheck en verde, 195
entradas en mi rama), el `HEAD` compartido saltó a `feat/text-batch3` (Codex) y **los 30 archivos
quedaron eliminados del disco**. El síntoma fue un `git add` fallando con
`pathspec 'src/registry/ui/rating.tsx' did not match any files` mientras el conteo de entradas
seguía en 195 — que en esa rama correspondía a `main(185)` + los 10 de Texto de Codex, no a los
míos. La causa compatible con lo observado es un borrado de archivos sin trackear (`git clean -fd`
o equivalente) ejecutado desde el otro agente; mis archivos aún no estaban committeados, así que
git no tenía copia de ellos.

**Cómo se recuperó.** Los transcripts de los agentes de generación conservan las llamadas `Write`
con el contenido íntegro de cada archivo. Se extrajeron de
`subagents/workflows/wf_25d49fa4-696/agent-*.jsonl`, tomando la **última** escritura por ruta (algún
agente reescribió un archivo), con una lista blanca que solo permitía las 30 rutas de mis 10 slugs
—de modo que la restauración no podía tocar nada ajeno—. Resultado: **30/30 restaurados, 0
faltantes**; el único path descartado fue un script auxiliar que un agente había dejado en su
scratchpad. El reporte había sobrevivido al borrado.

**Qué se cambió para que no se repita.** Los archivos se **commitearon de inmediato** tras la
restauración (lo committeado sobrevive a `git clean`) y la rama se **empujó a origin antes del
gate**, en vez de al final. Recomendación para el flujo: en rondas paralelas conviene commitear
temprano —no solo antes del gate— porque el trabajo sin trackear en un árbol compartido es
frágil ante cualquier limpieza del otro agente.

## Nota de entorno (árbol compartido con Codex)

`D:\morphiq-ui` es un working tree compartido; `gen-registry` descubre todas las `entries/*.ts` en
disco. El `HEAD` compartido apareció en `feat/text-batch3` (Codex) durante la ronda; se imprimió la
rama y se volvió a `feat/feedback-batch2` antes del gate/commit. Los 10 componentes de Texto de
Codex estaban **committeados en su rama**, así que el `checkout` los sacó limpiamente del árbol y el
conteo quedó exacto en `main(185)+10 = 195` sin necesidad de apartar untracked. Siguiendo la regla
explícita de esta ronda **no se lanzó `npm ci`**: `node_modules` estaba sano (66 shims) y una
instalación en paralelo lo habría vaciado a mitad. `git add` fue **solo** de mis 31 archivos
explícitos (nunca `-A`); no se tocó `docs/CREDITS.md`, `schema.ts`, `verify-registry`,
`package.json` ni ningún `ui/*` existente.
