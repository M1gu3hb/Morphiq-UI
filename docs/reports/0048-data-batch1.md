# 0048 · Datos/UI (tanda 1) · 7 componentes

**Rama:** `feat/data-batch1` · **Base:** `main` (76 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":76,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{stat-card,radial-progress,data-table,timeline,sparkline,calendar,bar-chart}`).
**Categoría:** `data` (**nueva** — ver Paso 0.5). `stat-card` y `radial-progress` tienen superficie → los 4 materiales `clay/glass/skeuo/adaptive` (tokens/profundidad de `ui/card.tsx`); los otros 5 son agnósticos → `["adaptive"]`.
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist `core`) donde hay íconos. **Sin `motion`, sin WebGL, sin librerías de charting** — todo SVG/CSS a mano.

## Paso 0.5 — categoría `data` agregada al schema

Se agregó **una sola línea** al union `RegistryCategory` en `src/registry/schema.ts` (`| "data"` después de `| "blocks"`). `verify-registry` lee el union dinámicamente, así que con eso acepta la categoría (no se tocó `verify-registry`). Es la única edición a un archivo compartido, autorizada para esta ronda. Codex no toca `schema.ts` → sin conflicto.

**Contrato de accesibilidad de datos (regla definitoria):** toda gráfica lleva un **equivalente accesible** — un resumen textual `sr-only` o una `<table>` equivalente `sr-only` — y el SVG decorativo va `aria-hidden`; el **color nunca** es el único portador de significado (siempre acompañado de texto/ícono/forma); `reduced-motion` deja el **valor final** (sin count-up/dibujo) vía `@starting-style` + `motion-reduce:transition-none`; `forced-colors` conserva marcas/ejes/estados con colores de sistema; contraste ≥ 4.5:1; nada de `Date.now()`/`Math.random()` en render (datos por props).

---

## 1. `stat-card` — KPI (4 materiales)

- **Inspiración / licencia:** tarjetas KPI tipo tremor / spectrum-ui (MIT). Original: superficie material de `card.tsx`.
- **Técnica:** número grande (tabular-nums), etiqueta y delta; sparkline inline opcional (SVG, `aria-hidden`). Reutiliza los tokens/profundidad de los 4 materiales de `card.tsx`.
- **Equivalente accesible:** el número/etiqueta/delta son texto real; el delta es **ícono de flecha (lucide) + signo/% en texto + color** con un `aria-label` ("up 12.5% vs last period") — nunca solo color; la sparkline es `aria-hidden` con un resumen `sr-only`.
- **reduced-motion:** valor **estático** (sin count-up); la sparkline reposa dibujada (draw one-shot vía `starting:` + `pathLength=1`, cancelado por `motion-reduce`).
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 2. `radial-progress` — Medidor circular (4 materiales)

- **Inspiración / licencia:** medidores circulares (magicui/animata-like, MIT). Original.
- **Técnica:** SVG con círculo de pista + arco de valor (`stroke-dasharray`=circunferencia, `stroke-dashoffset`=circ·(1−v/100)); % centrado como texto real + etiqueta. `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`.
- **Equivalente accesible:** el % en texto es autoritativo; `role=progressbar` expone el valor.
- **reduced-motion:** el arco **dibuja** al montar vía `@starting-style` (`starting:[stroke-dashoffset:var(--mq-circ)]` → reposo `var(--mq-offset)`); `motion-reduce:transition-none` lo deja **lleno** al valor final. **Verificado:** reposo = offset objetivo (73.89 de 263.9 para 72%), transición solo sobre `stroke-dashoffset`.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge.

## 3. `data-table` — Tabla ordenable (`["adaptive"]`)

- **Inspiración / licencia:** tablas de datos (tremor/tanstack-table-like, MIT). Original: orden por teclado.
- **Técnica:** `<table>` real con `<caption>`, `<th scope="col">`, `<thead>`/`<tbody>`; columnas ordenables con un `<button>` en el `th` (operable por teclado), `aria-sort` que alterna asc/desc/none, ícono de dirección + `aria-sort` (no solo color); zebra; `stickyHeader` opcional; foco visible. Comparador estable (numérico/localeCompare, desempate por índice).
- **Equivalente accesible:** el propio `<table>` semántico es el equivalente; `aria-sort` y botones etiquetados ("Sort by Region, not sorted").
- **Verificado:** clic en "Region" ordena ascendente (`Aurora, Basalt, Cinder…`), `aria-sort` pasa a `ascending` y las otras columnas a `none`; re-clic alterna la dirección.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge/lucide-react.

## 4. `timeline` — Línea de tiempo (`["adaptive"]`)

- **Inspiración / licencia:** timelines verticales (MIT). Original.
- **Técnica:** `<ol>`/`<li>` semántica; cada ítem con punto + conector (`aria-hidden`), `<time dateTime>`, título y cuerpo; estado (done/current/upcoming) con ícono/forma + texto (no solo color). Superficie adaptativa opaca (contraste inequívoco en claro/oscuro).
- **Equivalente accesible:** el orden lo lleva la lista ordenada; marcas/conectores `aria-hidden`; `<time>` con `dateTime` legible por máquina.
- **reduced-motion:** entrada escalonada opcional segura (estado final visible), `motion-reduce` la apaga.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

## 5. `sparkline` — Mini-tendencia (`["adaptive"]`)

- **Inspiración / licencia:** sparklines (Tufte / tremor-like, MIT). Original.
- **Técnica:** polilínea + área calculadas de forma determinista desde un arreglo numérico en un viewBox fijo; `vector-effect="non-scaling-stroke"`.
- **Equivalente accesible:** SVG `aria-hidden` + resumen `sr-only` (cantidad de puntos, tendencia como **palabra** up/down/no-change, % o cambio, origen→destino); delta visible con **flecha + signo + color** (nunca solo color).
- **reduced-motion:** la línea reposa **dibujada** (`stroke-dashoffset:0`, `pathLength=1`); el draw one-shot va por `@starting-style`, `motion-reduce:transition-none` lo deja completo.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

## 6. `calendar` — Rejilla de mes (`["adaptive"]`)

- **Inspiración / licencia:** date pickers WAI-ARIA (react-day-picker-like, MIT). Original: modelo de grid.
- **Técnica:** cabecera mes/año + botones prev/next (chevrons lucide, `aria-label`); nombres de día (`<abbr>` con nombre completo); rejilla `role="grid"`/`role="gridcell"` con **tabindex móvil** (un solo día tabulable), ArrowL/R ±1, ArrowU/D ±7, Home/End límites de semana, PageUp/Down mes, Enter/Espacio selecciona. Hoy con `aria-current="date"` + señal no-color; seleccionado con `aria-selected` + relleno; días fuera de mes atenuados y no tabulables. **SSR-safe:** rejilla desde `new Date(year,month,…)` con args explícitos; `today`/`month`/`selected` por props (nunca `new Date()` sin args en render).
- **Equivalente accesible:** modelo de grid APG; cada día con `aria-label` de **fecha completa** ("Wednesday, July 15, 2026").
- **Verificado:** `role="grid"`, 42 celdas, 1 tabulable, `aria-current="date"` (hoy) + `aria-selected` (1), ArrowRight mueve el foco (15→16 jul), nombres de día presentes.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge/lucide-react.

## 7. `bar-chart` — Gráfico de barras (`["adaptive"]`)

- **Inspiración / licencia:** bar charts (tremor-like, MIT). Original: SVG a mano.
- **Técnica:** barras/ejes/gridlines/etiquetas calculadas desde `{label,value}[]` en un viewBox 1:1; orientación = **variante** (`vertical`/`horizontal`); cada barra imprime su valor numérico como texto (legible sin color).
- **Equivalente accesible (obligatorio):** `<table>` `sr-only` real con `<caption>`, fila de encabezado (Categoría/Valor) y una fila por dato; el SVG es `aria-hidden`. **Verificado:** tabla oculta con caption "Weekly signups by day", 5 filas (`Mon 42k`…), SVG `aria-hidden`, valores visibles.
- **reduced-motion:** las barras **crecen** al montar vía `@starting-style` sobre la propiedad estándar `scale` (origen en la línea base, `transition-[scale]`); `motion-reduce:transition-none` las deja en su **altura final** (verificado: `scale:1` tras finalizar).
- variants: `["vertical","horizontal"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":76,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 76 y acepta la categoría `data`; build genera las 7 rutas SSG. `getAnimations()` sin fantasmas (draw one-shot solo sobre la propiedad que cambia).
- **Revisión adversarial (un revisor por componente, rutas `D:` fijadas + prueba de lectura):** **4 limpios** (`stat-card`, `radial-progress`, `sparkline`, `calendar`), 3 "minor" con solo hallazgos LOW (sin CRITICAL/HIGH/MEDIUM). Correcciones aplicadas:
  - **data-table (LOW correctitud):** el comparador documentaba "NaN al final en ambas direcciones" pero el llamador multiplicaba todo por `direction`, así que en orden descendente los NaN subían al tope; ahora `direction` se aplica **dentro** del comparador solo a la comparación significativa, dejando el orden NaN-al-final fijo.
  - **timeline (2× LOW):** el conector "pendiente" punteado estaba en ~1,7:1 mientras la nota a11y afirmaba ≥3:1 → se oscureció `--mq-tl-line` (`#8f8e86` claro / `#6c6b63` oscuro) a ≥3:1; y un `<time>` con texto humano y sin `dateTime` es un valor de máquina inválido → ahora solo se renderiza `<time dateTime>` cuando hay `dateTime`, y un timestamp solo-etiqueta degrada a `<span>`.
  - **bar-chart (2× LOW):** las marcas de eje fraccionarias se redondeaban a 1 decimal (`0,75`→`0,8`) sin coincidir con su línea → `trimNumber` ahora redondea a 2 decimales exactos; y las etiquetas de valor horizontales podían salirse del viewBox en barras cerca del máximo → si desbordarían y la barra es lo bastante ancha, la etiqueta se dibuja **dentro** del extremo (fill contrastante claro/oscuro/HighlightText).
  - _También:_ eliminado un warning de lint preexistente (`height` sin usar en `renderHorizontal`).
- **Verificación runtime (build de producción, DOM/CSSOM):** data-table (orden + `aria-sort`), calendar (grid + tabindex móvil + navegación por flechas + fecha completa), radial-progress (`progressbar` + offset final), bar-chart (tabla `sr-only` + svg `aria-hidden` + `scale` final).
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry), este reporte, y la única línea de `schema.ts` del Paso 0.5. `docs/CREDITS.md`, `verify-registry` y los `ui/*` existentes intactos.
