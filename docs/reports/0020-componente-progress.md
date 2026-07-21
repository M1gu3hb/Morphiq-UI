# Reporte 0020 — Componente Progress

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-progress` · **Commit final:** ver PR (commit `feat: add production Progress component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 10. Añadir una barra Progress determinada e indeterminada, autocontenida, accesible, con cuatro materiales, dos variantes y tres tamaños, sin editar archivos compartidos.

## Objetivo

Incorporar una barra de progreso de producción que comunique el avance por semántica y
texto, no solo por longitud o color. Debía animar correctamente la propiedad CSS real en
modo determinado, usar keyframes propios en indeterminado y respetar reduced-motion y
forced-colors.

## Qué se hizo

- `src/registry/ui/progress.tsx` — componente `Progress` server-friendly, API de valor/max,
  modos determinado e indeterminado, texto visible opcional, recetas CVA y estilos propios.
- `src/registry/previews/progress-preview.tsx` — preview determinado al 64%, estado loading
  indeterminado y cobertura real de todas las variantes, tamaños, materiales y estados.
- `src/registry/entries/progress.ts` — entrada `feedback`, dependencias exactas y contrato
  bilingüe de accesibilidad.
- `docs/reports/0020-componente-progress.md` — este reporte.

No se editó package, schema, index/generated, scripts, app, globals, tests ni componentes
existentes. El índice regenerado por los hooks permanece gitignorado.

## Cómo se hizo

### Determinado e indeterminado

`value` acepta un número, `null` o `undefined`; los dos últimos seleccionan el modo
indeterminado. `max` vale 100 por defecto y cualquier máximo no finito o no positivo vuelve
a 100. En determinado, un valor no finito cae a cero y todo valor se limita al intervalo
`0…max`, de modo que la geometría y ARIA siempre describen el mismo estado.

El root es `role="progressbar"` con `aria-valuemin="0"` y el máximo saneado.
`aria-valuenow` existe únicamente en determinado; en indeterminado se omite. El consumidor
puede pasar `aria-label` y `aria-valuetext`; si `label` es string, también se usa como nombre
accesible, y queda el fallback neutral `Progress` cuando no hay otro nombre.

`label`, `valueLabel` y `showValue` controlan el texto visual. El default muestra porcentaje
en determinado e “In progress” en indeterminado. Ese contenido visual lleva `aria-hidden`
porque los descendientes de un progressbar son presentacionales por definición; la fuente
autoritativa para tecnología asistiva sigue siendo `aria-valuenow`/`aria-valuetext`. Así el
significado no depende del ancho, del color ni de las franjas.

### Avance y cobertura de transición

El indicador determinado ocupa el 100% de la pista y se recorta moviéndolo desde
`-100%` hasta `0%`. Se usa la propiedad CSS individual `translate`, mediante style inline,
porque Tailwind 4 escribe `translate-*` sobre esa propiedad y no sobre `transform`.
La clase del mismo elemento es exactamente `transition-[translate]`; no declara
propiedades fantasma.

La comprobación independiente en Chrome cambió el preview de 64% a 34% y consultó
`getAnimations()` inmediatamente. El resultado fue:

| Modo | Tipo WAAPI | Propiedad / nombre | Estado |
| --- | --- | --- | --- |
| determinado | `CSSTransition` | `translate` | `running` |
| indeterminado | `CSSAnimation` | `mq-progress-indeterminate` | `running` |

El indeterminado usa un indicador de 42% y `@keyframes mq-progress-indeterminate`, definido
en un `<style>` que viaja dentro del mismo archivo distribuible. No depende de keyframes de
`globals.css` ni obliga a editar una hoja compartida.

### Reduced motion y forced-colors

En `prefers-reduced-motion: reduce`, el determinado aplica `transition-none` y el
indeterminado `animate-none`; queda una porción estática que sigue comunicando actividad.
La prueba se inició con reduced-motion activo y sin depender de sleeps: el determinado
reportó `transition-property: none`; al cambiar a indeterminado, `animation-name` fue `none`
y `getAnimations()` quedó vacío.

Forced-colors reemplaza la pista por `Canvas` con borde sólido `CanvasText`, y el relleno por
`Highlight`; sombras e imagen de franjas desaparecen. Chrome computó pista blanca, borde
negro sólido, relleno Highlight y `box-shadow: none` en ambos elementos.

### Variantes, tamaños, contraste y self-containment

- `default` usa el relleno sólido de cada material.
- `striped` alterna dos tonos del mismo material en una trama diagonal; no añade movimiento.
- `sm`, `md` y `lg` producen pistas reales de 6, 10 y 14 px.

El contraste no textual se calculó con luminancia relativa sRGB. Glass se compuso sobre
negro y blanco y se conservó el peor resultado; adaptive se midió en ambos esquemas.

| Material | Relleno sólido / pista | Franja clara / pista |
| --- | ---: | ---: |
| clay | 5.59:1 | 3.50:1 |
| glass, peor backdrop | 5.01:1 | 3.40:1 |
| skeuo | 6.32:1 | **3.35:1** |
| adaptive, peor esquema | 8.89:1 | 5.99:1 |

El mínimo de 3.35:1 supera el requisito 3:1 para gráficos/estado. El texto visible usa
tokens oscuros sobre papel/blanco y un par invertido en adaptive oscuro; el mínimo medido es
11.59:1. Todas las variables son locales `--mq-*`, cada `var()` tiene fallback literal y no
se usan variables `:root`, clases de chrome ni estilos del sitio. Los imports coinciden con
el manifiesto: CVA y `cn.ts`, con `clsx`/`tailwind-merge` declarados por la dependencia
interna.

### TDD, revisión React y navegador real

El contrato efímero comenzó en rojo por la ausencia esperada de
`src/registry/entries/progress.ts` y pasó tras crear los tres archivos. No se añadió un test
persistente porque `tests/**` estaba fuera del guardarraíl. La revisión React confirmó un
componente puro, sin hooks, efectos, estado duplicado ni frontera `use client`; props y tipos
permanecen colocados junto al componente y los exports son nombrados.

Playwright CLI ejecutó Chrome del sistema contra `next start`. Verificó HTTP 200, rango ARIA
0/100/64, omisión de `aria-valuenow` en indeterminado, `aria-valuetext`, los cuatro
materiales, ambas variantes, alturas 6/10/14, transición y keyframe reales, reduced-motion,
forced-colors, fuente real y cero `console.error`/`pageerror`. Se inspeccionó visualmente la
combinación glass–striped–lg en determinado e indeterminado.

## Resultado esperado vs. real

- **Esperado:** tres archivos propios bastan para registrar Progress sin cruzarse con el
  Checkbox paralelo.
- **Real:** codegen descubrió `progress`, `verify-registry` reportó once componentes
  autocontenidos y `/components/progress` quedó prerenderizado dentro de 18 páginas.
- **Movimiento:** `getAnimations()` confirmó `CSSTransition: translate` para el avance y
  `CSSAnimation: mq-progress-indeterminate` para el barrido.

## Bugs / obstáculos y cómo se resolvieron

1. **ESLint reportó tres aliases sin uso.** CVA ya infería material, variante y tamaño; se
   retiraron los aliases redundantes y lint quedó sin warnings.
2. **PowerShell rompía el argumento multilineal de `playwright-cli run-code`.** Una función
   mínima reprodujo el mismo `SyntaxError`; se usó la opción oficial `--filename` con un
   archivo efímero fuera del repo, eliminado después del QA.
3. **Una prueba inicial de reduced-motion veía una transición existente.** La captura mostró
   que `animation-name` ya era `none`; el objeto restante era una transición iniciada antes
   de cambiar la preferencia. La prueba correcta recargó con reduced-motion activo y luego
   cambió de modo: no nació ninguna animación ni transición.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock, sin descargar navegador.
- Contrato TDD efímero — ✅ rojo esperado y verde final.
- Cálculo de contraste — ✅ relleno/pista ≥ 3:1; texto ≥ 4.5:1.
- `npm run lint` — ✅ sin warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":11,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 18 páginas; `/components/progress` SSG.
- `npm run check` — ✅ exit code 0.
- Playwright CLI + Chrome del sistema — ✅ matriz funcional/a11y y cero errores.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS y el fix automático propone un downgrade incompatible.

## Riesgos, deuda y pendientes

- Cada instancia incluye el mismo bloque de keyframes para conservar el contrato open-code
  de un solo archivo. El navegador los resuelve con un nombre estable y prefijado; una futura
  etapa de empaquetado podría deduplicarlos sin mover la dependencia a `globals.css`.
- El texto visible es opcional. Si se oculta, quien consume debe conservar un nombre
  accesible útil y puede usar `aria-valuetext` para expresar unidades o estados de dominio.
- La validación interactiva fue Chrome de escritorio; forced-colors y reduced-motion se
  emularon con Playwright.

## Estado final

Completo. Progress queda auto-descubierto, autocontenido, accesible, contrastado, probado en
navegador y prerenderizado; el gate integral está verde con `components:11`.
