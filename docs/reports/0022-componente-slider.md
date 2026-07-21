# Reporte 0022 — Componente Slider

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-slider` · **Commit final:** ver PR (commit `feat: add production Slider component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 11. Añadir un Slider autocontenido y accesible, basado en Radix, con valor único y rango, cuatro materiales, dos variantes y tres tamaños, sin editar archivos compartidos.

## Objetivo

Incorporar un control de valor continuo de producción que conserve toda la mecánica de
`@radix-ui/react-slider`, ofrezca una API Morphiq de un solo archivo y funcione como valor
único o rango de dos thumbs. El componente debía mantener contraste no textual de al menos
3:1, movimiento acotado y soporte real de teclado, reduced-motion y forced-colors.

## Qué se hizo

- `src/registry/ui/slider.tsx` — API compuesta `Slider`, `SliderTrack`, `SliderRange` y
  `SliderThumb`; recetas CVA, cuatro materiales y estados interactivos autocontenidos.
- `src/registry/previews/slider-preview.tsx` — ejemplos simultáneos de valor único (40) y
  rango (25–75), con cobertura de materiales, variantes, tamaños y estados del catálogo.
- `src/registry/entries/slider.ts` — entrada `inputs`, dependencias fieles, metadatos
  bilingües y política de accesibilidad.
- `docs/reports/0022-componente-slider.md` — este reporte.

No se editó `package.json`, el índice generado, schema, scripts, app, globals, tests ni otro
componente. El índice que regeneran los hooks está gitignorado.

## Cómo se hizo

### Mapeo a Radix y API

`Slider` delega puntero, arrastre, orden de valores, colisiones de thumbs, formulario,
orientación, dirección y teclado a `SliderPrimitive.Root`. Dentro monta exactamente
`Track`, `Range` y tantos `Thumb` como valores tenga `value` o `defaultValue`. También se
exportan wrappers nombrados de esos tres primitivos para consumidores que necesiten
composición o clases por parte, sin reimplementar la máquina de interacción.

Las props `min`, `max` y `step` llegan a Radix después de un saneamiento mínimo para evitar
intervalos imposibles. `value`/`defaultValue` siguen siendo arreglos como en Radix:
`[40]` produce un slider único y `[25, 75]` un rango. `minStepsBetweenThumbs` pasa directo al
primitivo; el preview lo usa con dos pasos de separación.

### Valor único, rango y teclado

Cada thumb conserva `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y
`aria-orientation` emitidos por Radix. `thumbLabels` permite nombres distintos por thumb;
el fallback es `Value` para uno y `Minimum value` / `Maximum value` para dos. `showValue`
muestra el `aria-valuenow` sobre cada thumb, por lo que el valor no se comunica solo por la
posición o el color.

Chrome confirmó estas rutas de teclado con `step={5}`:

| Caso | Entrada | Resultado |
| --- | --- | --- |
| valor único | `ArrowRight` / `ArrowLeft` | 40 → 45 → 40 |
| valor único | `PageUp` / `PageDown` | 40 → 90 → 40 |
| valor único | `Home` / `End` | 0 / 100 |
| rango | flecha en mínimo | 25 → 30 |
| rango | `PageUp` que viola el gap | permanece en 30 |
| rango | `End` / `Home` | máximo a 100 / mínimo a 0 |

Radix aplica `Home` al primer thumb y `End` al último thumb, y mueve el foco al thumb que
cambió. El arrastre real desde el 40% hasta aproximadamente el 62% terminó en 60, alineado
al paso de cinco.

### Variantes, tamaños y transición

- `default` deja la pista limpia.
- `ticks` añade una capa decorativa `aria-hidden` con un
  `repeating-linear-gradient`; su intervalo se deriva de `step / (max - min)`. Con paso 5,
  Chrome computó `--mq-tick-step: 5%`.
- `sm`, `md` y `lg` produjeron pista/thumb de 5/16, 8/20 y 12/26 px.

La pista y el rango no declaran transición: durante el arrastre deben seguir al puntero sin
retardo. `getAnimations()` devolvió arreglos vacíos en ambos elementos mientras el valor
cambiaba. El thumb solo transiciona las propiedades que cambian en hover/active:
`box-shadow`, `background-color`, `border-color` y la propiedad individual `scale`.
Al entrar en hover, `getAnimations()` devolvió `CSSTransition` para `background-color` y
`box-shadow`; no hay `transform` fantasma.

En `prefers-reduced-motion: reduce`, el thumb aplica `transition-none`; Chrome computó
`transition-property: none`. La variante con marcas no añade animación.

### Contraste, forced-colors y self-containment

El contraste entre rango y pista se calculó con luminancia relativa sRGB. La pista
semitransparente de glass se compuso tanto sobre blanco como sobre negro y se conserva aquí
el peor caso; adaptive se midió en ambos esquemas.

| Material | Rango / pista | Resultado |
| --- | ---: | --- |
| clay | `#9f2f23` / `#f4ded2` | 5.59:1 |
| glass, peor backdrop | `#075d70` / pista compuesta | **5.01:1** |
| skeuo | `#3f4641` / `#d6d0c4` | 6.32:1 |
| adaptive, peor esquema | `#f5f3ee` / `#42443f` | 8.89:1 |

El mínimo 5.01:1 supera 3:1 para el indicador no textual. Forced-colors reemplaza pista,
rango y thumb por `Canvas`, `CanvasText`, `Highlight` y `ButtonFace`; elimina sus sombras y
mantiene borde visible. Chrome confirmó pista blanca con borde negro, rango Highlight,
thumb blanco con borde de sistema y `box-shadow: none` en las tres partes.

Todos los tokens son variables locales `--mq-*` con fallback literal en cada `var()`. El
archivo no consume variables de `:root`, clases del chrome del sitio ni estilos globales.
Los imports coinciden con el manifiesto: `@radix-ui/react-slider`, CVA y `cn.ts`, con
`clsx`/`tailwind-merge` declarados por la dependencia interna.

### TDD, revisión React y navegador real

El contrato efímero comenzó en rojo por la ausencia esperada de
`src/registry/entries/slider.ts` y pasó tras crear los tres archivos. No se añadió un test
persistente porque `tests/**` estaba fuera del guardarraíl. La revisión React confirmó una
sola frontera cliente necesaria para Radix, exports nombrados, ausencia de efectos o estado
duplicado y colocación de tipos/props junto al componente.

Playwright inició Chrome del sistema contra `next start`. Verificó HTTP 200, render real,
tres roles slider, ARIA, teclado, arrastre, gap del rango, texto de valor, dos variantes,
tres tamaños, cuatro materiales, disabled, reduced-motion, forced-colors, transiciones
reales mediante WAAPI y cero `console.error`/`pageerror`.

## Resultado esperado vs. real

- **Esperado:** tres archivos propios bastan para autoensamblar Slider sin cruzarse con el
  Radio Group paralelo.
- **Real:** codegen descubrió `slider`, `verify-registry` reportó 13 componentes
  autocontenidos y `/components/slider` quedó prerenderizado dentro de 20 páginas.
- **Interacción:** valor único, rango, arrastre y todas las teclas requeridas funcionaron en
  el build de producción; pista y rango no introducen latencia de transición.

## Bugs / obstáculos y cómo se resolvieron

1. **ESLint reportó tres aliases sin uso.** CVA ya infería material, variante y tamaño; se
   eliminaron los aliases redundantes y lint quedó sin warnings.
2. **La primera sonda esperaba que `End` moviera el thumb mínimo.** La fuente instalada de
   Radix y una reproducción aislada confirmaron su política: `Home` opera el primer thumb y
   `End` el último, trasladando el foco. Se corrigió la expectativa sin tocar producción.
3. **La primera medición de hover no creó transición.** El puntero ya estaba sobre el thumb
   después del arrastre. Se movió fuera, se esperó el estado estable y luego se entró;
   WAAPI devolvió las dos transiciones esperadas.
4. **La primera sonda buscó las marcas en la pista.** El DOM mostró que viven en el overlay
   decorativo interno. Midiendo `[data-slider-ticks]`, el gradiente y el paso 5% estaban
   presentes; no fue necesario cambiar el componente.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock; descarga de navegador omitida.
- Contrato TDD efímero — ✅ rojo esperado y verde final.
- Cálculo de contraste — ✅ rango/pista mínimo 5.01:1.
- `npm run lint` — ✅ sin warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":13,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 20 páginas; `/components/slider` SSG.
- `npm run check` — ✅ exit code 0.
- Playwright + Chrome del sistema — ✅ matriz funcional/a11y y cero errores de runtime.

## Riesgos, deuda y pendientes

- Las etiquetas visuales de valor son opcionales. Si se ocultan, el consumidor debe
  acompañar el control con una etiqueta visible o `aria-label`; para unidades de dominio
  puede componer `SliderThumb` y proporcionar `aria-valuetext`.
- Las marcas son decorativas y se derivan del paso; intervalos extremadamente pequeños se
  limitan visualmente a 0.5% para evitar un gradiente impracticable, sin alterar el step de
  Radix.
- La validación interactiva se hizo en Chrome de escritorio; forced-colors y reduced-motion
  se emularon mediante Playwright.

## Estado final

Completo. Slider queda auto-descubierto, autocontenido, accesible, contrastado,
prerenderizado y validado en navegador con valor único y rango; el gate integral está verde
con `components:13`.
