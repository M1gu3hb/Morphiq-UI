# Reporte 0026 — Steps y Stat

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/steps-stat` · **Commit final:** ver PR (commit `feat: add Steps and Stat components`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 13. Añadir Steps y Stat como dos componentes autocontenidos, accesibles y sin dependencias nuevas, en un único PR y reporte.

## Objetivo

Incorporar una secuencia semántica de progreso y una tarjeta KPI semántica al registry
autoensamblado. Ambos debían incluir los cuatro materiales, variantes y tamaños con CVA,
contraste medido, estados que no dependieran solo del color y cobertura exacta de movimiento.

## Qué se hizo

### Steps

- `src/registry/ui/steps.tsx` — lista ordenada de datos con estados `completed`, `current`
  y `pending`, variantes de puntos/números, tres tamaños y orientación horizontal/vertical.
- `src/registry/previews/steps-preview.tsx` — flujo de cuatro pasos con dos completados, uno
  actual y uno pendiente; cubre todos los ids de variante y tamaño.
- `src/registry/entries/steps.ts` — entrada `navigation`, dependencias exactas y contrato
  bilingüe de accesibilidad.

### Stat

- `src/registry/ui/stat.tsx` — tarjeta KPI con `dl/dt/dd`, valor, leyenda, delta/tendencia e
  ícono decorativo opcional; variantes `default`/`outline` y tres tamaños.
- `src/registry/previews/stat-preview.tsx` — tendencia positiva predeterminada y negativa en
  el estado `error`, con todos los ids de variante/tamaño.
- `src/registry/entries/stat.ts` — entrada `cards`, dependencias exactas y contrato bilingüe.

`docs/reports/0026-steps-y-stat.md` es este reporte. No se editó ningún archivo compartido,
dependencia, script, índice, componente existente, app, test ni stylesheet global.

## Cómo se hizo

### Steps — semántica, estados y orientación

La API recibe `steps: readonly StepItem[]`; cada elemento exige id estable, etiqueta y uno de
los tres estados. El DOM es un `<ol>` con un `<li>` por paso. Solo el actual lleva
`aria-current="step"`. Cada etiqueta recibe un prefijo `sr-only` —`Completed`, `Current step`
o `Pending`— y `statusLabels` permite localizar esos términos, así que el estado no depende
del color ni del dibujo.

Los completados combinan marcador relleno y check decorativo; el actual combina doble
contorno, punto/número y etiqueta gruesa subrayada; el pendiente usa marcador y conector
discontinuos. El check, el marcador gráfico y todos los conectores llevan `aria-hidden`.
El default es horizontal. La prop `orientation="vertical"` cambia los ejes CVA del root,
items y conectores sin cambiar el árbol semántico; está documentada en el tipo exportado y
en la ficha. Steps no declara hover ni transición: los cambios de progreso son inmediatos,
no hay propiedad fantasma y movimiento reducido no necesita una versión alternativa.

### Stat — definición y tendencia legible

Stat conserva la relación nativa de datos como `dl > div > dt + dd`. El ícono está dentro
del `dt`, pero su wrapper usa `aria-hidden`; el texto de la etiqueta permanece en el mismo
término. `dd` contiene el valor y, opcionalmente, delta y leyenda.

La tendencia acepta `positive | negative | neutral`. La flecha es decorativa; antes del
delta visible se incluye una palabra `sr-only` (`Increase`, `Decrease` o `No change`) y el
preview conserva además el signo visible (`+12.4%` / `-3.8%`). `trendLabel` permite
localizar esa palabra. El resultado no depende del verde/rojo ni de la forma de flecha.

El único movimiento es cosmético en hover de Stat: cambian el borde y la sombra. La lista
es exactamente `transition-[box-shadow,border-color]`; no hay translate, transform ni
propiedades sin estado. `motion-reduce:transition-none` elimina esa transición.

### Contraste medido

Los ratios se calcularon con luminancia relativa sRGB. Glass al 96% se compuso sobre blanco
y negro (`#f5fbfc` / `#ebf1f2`) y se conserva el peor caso. Adaptive se midió claro y
oscuro. En Steps, “texto mínimo” incluye principal, atenuado y pendiente; “marcador mínimo”
incluye marcador/superficie y texto dentro del completado.

| Material (peor esquema/backdrop) | Steps texto mínimo | Steps marcador mínimo | Steps conector mínimo | Stat texto/tendencia mínimo |
| --- | ---: | ---: | ---: | ---: |
| clay | 6.37:1 | 6.37:1 | 4.90:1 | 7.04:1 |
| glass | **5.87:1** | **5.87:1** | **3.91:1** | **5.87:1** |
| skeuo | 5.93:1 | 5.93:1 | 4.24:1 | 6.16:1 |
| adaptive | 6.27:1 | 6.27:1 | 4.60:1 | 7.13:1 |

Todo texto supera 4.5:1. Marcadores y conectores superan 3:1; el mínimo global de indicador
no textual es 3.91:1. El texto blanco dentro de marcadores completados mide entre 7.48:1 y
16.06:1 según material/esquema.

### Cobertura de transición con `getAnimations()`

Chrome del sistema consultó WAAPI inmediatamente después de forzar hover. La duración se
extendió solo en la sonda para independizarla del reloj; no se cambió `transition-property`.

| Componente / estado | `CSSTransition` observadas | Propiedades fantasma |
| --- | --- | --- |
| Steps, default/numerado | ninguna (`getAnimations({subtree:true}) = []`) | ninguna; no declara movimiento |
| Stat, hover | `box-shadow`, `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color` | ninguna |
| Stat, reduced-motion | ninguna; `transition-property: none` | ninguna |

WAAPI expone `border-color` mediante sus cuatro longhands. La sonda canceló después las
transiciones alargadas de prueba antes de evaluar reduced-motion.

### Forced-colors, reduced-motion y self-containment

En forced-colors, ambos roots computaron `Canvas`/`CanvasText`; Steps asignó el actual a
`Highlight`, el pendiente a `GrayText` y mantuvo conectores visibles. Stat eliminó sombras,
usó borde de sistema y convirtió el delta a `CanvasText`; el signo, flecha y texto oculto
siguen comunicando tendencia. En reduced-motion Steps mantuvo cero animaciones y Stat
computó `transition-property: none` con cero animaciones activas.

Todos los tokens viven como variables locales `--mq-steps-*` y `--mq-stat-*`. Cada `var()`
tiene fallback literal; no se usan variables `:root`, clases del chrome ni globals. Los
manifiestos coinciden con los imports: CVA y `cn.ts`, con `clsx`/`tailwind-merge` declarados
por la dependencia interna. No se añadió ningún paquete.

### TDD, revisión React y navegador real

Un contrato estático efímero comenzó en RED porque los seis archivos no existían y terminó
GREEN validando estructura, ids, estados, fallbacks, forced-colors y transición exacta. No
se persistió porque `tests/**` estaba fuera del guardarraíl.

La revisión React confirmó componentes puros sin `useEffect`, estado cliente ni Radix;
props colocadas junto al componente, claves basadas en `step.id`, semántica HTML antes que
roles ARIA y ausencia de memoización innecesaria. Durante esa revisión el ícono de Stat se
movió dentro de `dt` para que el grupo mantuviera `dt + dd` directo.

Playwright CLI manejó Chrome del sistema contra `next start`. `/components/steps` y
`/components/stat` respondieron 200, mostraron heading, preview y bloque de fuente real.
La sonda confirmó el árbol semántico, ambas direcciones de tendencia, forced-colors,
reduced-motion, transiciones WAAPI y cero `console.error` / `pageerror`.

## Resultado esperado vs. real

- **Esperado:** seis archivos propios registran dos componentes sin tocar la plomería que
  Claude Code modifica en paralelo.
- **Real:** codegen descubrió ambos slugs; `verify-registry` reportó 20 componentes
  autocontenidos y el build generó `/components/steps` y `/components/stat` dentro de 27
  páginas estáticas.
- **Semántica real:** navegador confirmó `OL` con cuatro `LI` y un único
  `aria-current="step"`; Stat confirmó `DL > div > DT + DD`, tendencia positiva y negativa.

## Bugs / obstáculos y cómo se resolvieron

1. **El primer baseline no encontró `eslint`.** `npm ci` todavía estaba finalizando los
   bin-links cuando el wrapper devolvió control; el paquete ya existía y `.bin` apareció
   después con `eslint`, `tsc` y `next`. Tras verificar esos artefactos, el mismo gate quedó
   verde sin tocar dependencias.
2. **El contrato efímero interpretó la prosa `var()` como CSS.** El regex se estrechó a
   llamadas cuyo contenido comienza con `--`, conservando la detección real de fallbacks.
3. **Lint señaló un alias no usado.** `StepsMaterial` duplicaba el tipo ya derivado por
   `VariantProps`; se eliminó y lint quedó sin warnings.
4. **La sonda de contraste tuvo dos errores de harness PowerShell.** Se separó el
   `foreach` de la tubería y luego se reemplazó el formateo hexadecimal por las dos
   composiciones glass exactas; ningún token del componente cambió a ciegas.
5. **Reduced-motion mostró microtransiciones globales de 0.01 ms.** `globals.css` aplica
   esa duración universal. La sonda esperó 30 ms tras cambiar media y confirmó cero
   animaciones propias; en Stat también canceló la transición de 5 s creada solo para la
   prueba antes de medir reduced-motion.

## Verificación (gate)

- `npm ci` — ✅ lockfile instalado sin descargar navegador.
- Contrato TDD efímero — ✅ RED esperado y GREEN final (`6` archivos).
- Cálculo de contraste — ✅ texto ≥ 5.87:1; marcadores/conectores ≥ 3.91:1.
- `npm run lint` — ✅ sin errores ni warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:registry` — ✅ `{"components":20,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 27 páginas; ambas rutas SSG.
- `npm run check` — ✅ exit code 0; incluye lint, tipos, ambas suites y build SSG.
- Playwright CLI + Chrome del sistema — ✅ 200, semántica, estados, código real, movimiento,
  forced-colors y cero errores runtime.

## Riesgos, deuda y pendientes

- El preview documenta visualmente el flujo horizontal predeterminado. La orientación
  vertical forma parte de la API/CVA y conserva el mismo DOM, pero no tiene un selector
  separado en la ficha porque el schema solo expone variante y tamaño.
- `trendLabel` localiza el estado accesible; los consumidores deben pasarlo cuando el
  idioma del producto no sea inglés.
- La verificación interactiva se hizo en Chrome de escritorio. Forced-colors y
  reduced-motion se emularon con Playwright.

## Estado final

Completo. Steps y Stat quedan auto-descubiertos, autocontenidos, contrastados,
prerenderizados y verificados con semántica y movimiento reales.
