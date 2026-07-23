# 0056 · Datos/UI (tanda 2) · 10 componentes

**Rama:** `feat/data-batch2` · **Base:** `main` (135 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":135,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 10 rutas SSG.
**Categoría:** `data` · **Materiales:** `["adaptive"]` (un estilo). **Sin `motion`, sin WebGL, sin librerías de charting** — todo SVG/CSS a mano. Dependencia extra solo `lucide-react` donde hay íconos. No se repiten los `data` existentes (`stat-card, radial-progress, data-table, timeline, sparkline, calendar, bar-chart`). Código original en estilo Morphiq inspirado en fuentes MIT (magicui/animata/tremor-like), no copiado.

**Contrato de accesibilidad de datos (cumplido en los 10):** toda gráfica lleva un equivalente `sr-only` (tabla o resumen) y el SVG decorativo va `aria-hidden`; el color nunca es el único portador (valor en texto/ícono/patrón); estructuras interactivas con roles + teclado; `reduced-motion` deja el valor/estado final (dibujo por `@starting-style`); `forced-colors`; contraste ≥ 4.5:1; transición por su propiedad (trampa Tailwind v4).

---

1. **`line-chart`** — Gráfico de líneas multi-serie (magicui/tremor-like, MIT). Polilíneas + ejes/gridlines/ticks + leyenda calculados de forma determinista en SVG; trazo dibuja con `pathLength=1` + `@starting-style`. **Accesible:** `<table>` `sr-only` serie×puntos autoritativa; leyenda empareja color + nombre. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

2. **`area-chart`** — Área rellena, una serie o **apiladas** (tremor-like, MIT). Línea + polígono cerrado por serie; en `stacked` suma acumulada desde la base; crecen con `@starting-style` sobre `scale` (origen en la base). **Accesible:** `<table>` `sr-only` por serie; leyenda color+nombre; SVG `aria-hidden`. `["default","stacked"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

3. **`donut-chart`** — Dona/anillo (magicui-like, MIT). Arcos como `stroke-dasharray` sobre círculos concéntricos con offsets acumulados; centro con total en texto; dibuja con `@starting-style`. **Accesible:** `<table>` `sr-only` (label/valor/porcentaje) + leyenda con valor y % en **texto** (color solo refuerza). `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

4. **`gauge`** — Medidor **semicircular** con arco + aguja (distinto del `radial-progress` de círculo completo) (MIT). Semicírculo por `stroke-dasharray`, aguja rotada por la propiedad estándar `rotate`. **Accesible:** `role="meter"` + `aria-valuenow/min/max/valuetext` + valor visible; zonas etiquetadas. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

5. **`heatmap`** — Rejilla de intensidad tipo "contribuciones" (MIT). Celdas con relleno mapeado a 5 niveles discretos + leyenda Less→More etiquetada; cada celda con `<title>`/label (fecha+valor). **Accesible:** equivalente `sr-only` + títulos por celda; nivel nunca solo por color. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

6. **`funnel-chart`** — Embudo de etapas con conversión (tremor-like, MIT). Barras/trapecios centrados cuyo ancho ∝ valor; etiqueta + valor + **% de conversión** en texto; crecen con `@starting-style` sobre `scale`. **Accesible:** `<table>` `sr-only` (etapa/valor/conversión); funnel `aria-hidden`. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

7. **`comparison-table`** — Matriz planes×features (MIT). `<table>` real con `<caption>`, `<th scope>`; celda booleana = ícono Check/Minus (lucide) **+ texto `sr-only`** "Included"/"Not included" (no solo color); columna destacada por badge de texto. **Accesible:** la tabla ES el equivalente. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

8. **`progress-bar`** — Grupo de barras de métrica etiquetadas (MIT). Cada fila: label + barra + valor/max en texto; relleno crece con `@starting-style` sobre `scale` (origen izquierda). **Accesible:** cada barra `role="progressbar"` + `aria-valuenow/min/max/valuetext` + nombre; color solo refuerza. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge.

9. **`tree-view`** — Árbol jerárquico colapsable (WAI-ARIA, MIT). `role="tree"`/`treeitem`/`group` con `aria-expanded`/`aria-level`/`setsize`/`posinset`; **tabindex móvil** + Arrow (baja/sube/expande/colapsa)/Home/End/Enter/Space; chevron rota por la propiedad `rotate`. **Accesible:** el widget ES accesible + resumen `sr-only`; expansión por `aria-expanded` + forma del chevron. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

10. **`kanban-board`** — Columnas con tarjetas movibles por **botones/teclado** (no solo drag) (MIT). Cada columna = `<h3>` + `<ul role="list">` de `role="listitem"`; cada tarjeta con `<button aria-label="Move '…' to <col>">`; `aria-live="polite"` anuncia cada movimiento; conteo por columna en texto; foco preservado tras mover. **Accesible:** listas etiquetadas + movimiento por teclado + live-region. `["default"]`, sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

---

**Cierre:** `npm run check` verde — `components:135`; build genera las 10 rutas SSG. Ningún componente declaró `motion`. Solo se crearon los 30 archivos de registro (10 × ui/preview/entry) y este reporte; `docs/CREDITS.md`, `schema.ts`, `verify-registry` y los `ui/*` existentes intactos.

_Nota de entorno (reportada aparte): el árbol compartido `D:\morphiq-ui` tenía HEAD en `feat/media-batch2` (Codex) con sus 10 componentes de media **sin trackear**; volví a `feat/data-batch2` y aparté temporalmente esos 30 archivos de Codex para gatear exactamente mis 135 y no comprometer su trabajo, restaurándolos después. La generación de `tree-view`/`kanban-board` se cortó por límite de uso en el paso de retorno, pero sus 3 archivos quedaron completos y pasaron el gate._
