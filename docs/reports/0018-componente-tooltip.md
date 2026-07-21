# Reporte 0018 — Componente Tooltip

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-tooltip` · **Commit final:** ver PR (commit `feat: add production Tooltip component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 9. Añadir un Tooltip de producción sobre Radix, con cuatro materiales, dos variantes y tres tamaños, preview visible y registry auto-descubierto, sin editar archivos compartidos.

## Objetivo

Incorporar un Tooltip autocontenido que conserve la mecánica accesible y de posicionamiento
de Radix y aporte la capa visual Morphiq. Debía abrir por hover y foco, cerrar con Escape,
mantener contraste AA y soportar reduced motion y forced-colors en los cuatro materiales.

## Qué se hizo

- `src/registry/ui/tooltip.tsx` — API componible `TooltipProvider`, `Tooltip`,
  `TooltipTrigger` y `TooltipContent`; recetas CVA, flecha material y portal configurable.
- `src/registry/previews/tooltip-preview.tsx` — preview abierto por defecto, inline y con
  cobertura de todos los materiales, variantes, tamaños y estados de la ficha.
- `src/registry/entries/tooltip.ts` — entrada `feedback`, manifiesto exacto de dependencias y
  contrato bilingüe de accesibilidad.
- `docs/reports/0018-componente-tooltip.md` — este reporte.

No se editaron package, schema, index/generated, scripts, app, globals, tests ni componentes
existentes. El índice regenerado por los hooks permanece gitignorado.

## Cómo se hizo

### Mapeo a Radix

Las cuatro exportaciones envuelven 1:1 los primitivos de
`@radix-ui/react-tooltip`: `Provider`, `Root`, `Trigger` y `Content`. No existe máquina de
estado propia. Radix conserva `role="tooltip"`, `aria-describedby` mientras está abierto,
hover, foco de teclado, Escape, pointer grace, `side`/`align`, offsets y colisiones.
`TooltipTrigger` conserva `asChild`; las props nativas pasan al primitivo correspondiente.

`TooltipContent` usa portal por defecto, como corresponde a producción. La prop acotada
`portalled={false}` mantiene el mismo `Content`/Popper de Radix pero evita sacar el nodo del
árbol de la tarjeta de documentación. `portalContainer` permite elegir destino sin cambiar
el default. La flecha es siempre `TooltipPrimitive.Arrow` y comparte superficie y borde con
la burbuja.

### Preview abierto y SSR

El preview usa `defaultOpen`, `delayDuration={0}` y `portalled={false}`. Así el catálogo
muestra el Tooltip sin exigir interacción, la burbuja queda asociada al ejemplo y la ficha
puede prerenderizarse. La misma instancia sigue respondiendo a Escape, foco y hover después
de hidratar. El build generó `/components/tooltip` como SSG y el navegador recibió HTTP 200.

### Variantes y tamaños

El eje `variant` expresa tratamiento de contraste, no comportamiento:

- `default` — superficie natural del material;
- `inverted` — relación claro/oscuro invertida para fondos alternativos.

Los tamaños `sm`, `md` y `lg` ajustan padding, radio, tipografía y flecha como un conjunto.
El preview entrega realmente 11, 12 y 13 px y cubre los cinco estados del contrato genérico.

### Animación y cobertura de transición

La entrada usa `@starting-style` mediante `starting:` y los atributos `data-side` que Radix
resuelve después de medir colisiones. Solo cambian `opacity` y la propiedad CSS individual
`translate`; ambas aparecen explícitamente en `transition-[opacity,translate]`. No se anima
`transform` ni se declaran propiedades fantasma. En Chrome, `getAnimations()` devolvió dos
`CSSTransition` en ejecución: una para `opacity` y otra para `translate`.

En reduced motion, los offsets locales `--mq-enter-x/y` se fuerzan a `0px` y la transición
se reduce a `opacity`. Los overrides llevan `!important` porque un selector `data-side`
tiene mayor especificidad que una utilidad bajo media query; esto garantiza cero
desplazamiento cualquiera que sea el lado elegido por Radix.

### Contraste, forced-colors y self-containment

El contraste se calculó con luminancia relativa sRGB. Para glass se compuso la transparencia
sobre negro y blanco; para skeuo se midieron ambos extremos del gradiente; adaptive se midió
en ambos esquemas. Todos los resultados superan 4.5:1.

| Material | Default mínimo | Inverted mínimo |
| --- | ---: | ---: |
| clay | 10.77:1 | 12.06:1 |
| glass, peor backdrop | 13.41:1 | 13.02:1 |
| skeuo, peor extremo | **9.52:1** | 9.74:1 |
| adaptive, peor esquema | 15.48:1 | 15.48:1 |

Forced-colors usa `Canvas`, `CanvasText`, borde sólido de sistema y elimina sombras; la
flecha aplica los mismos colores de sistema. Todas las variables visuales son locales
`--mq-*`, cada `var()` tiene fallback literal y no se usan variables de `:root`, clases de
chrome ni estilos de `globals.css`. Los imports coinciden con el manifiesto: Radix Tooltip,
CVA y `cn.ts`, con `clsx`/`tailwind-merge` declarados por la dependencia interna.

### TDD, revisión React y navegador real

El contrato efímero empezó en rojo porque los tres archivos todavía no existían y quedó
verde tras implementarlos; no se añadió un test persistente porque `tests/**` estaba fuera
del guardarraíl. La revisión React confirmó wrappers pequeños, props nativas colocadas junto
al componente, ausencia de efectos/estado duplicado y ninguna reimplementación de Radix.

Playwright ejecutó Chrome del sistema contra `next start` y verificó: HTTP 200, preview
abierto, `role="tooltip"` enlazado por `aria-describedby`, cierre con Escape, reapertura por
foco y hover, flecha, `data-side`, cuatro materiales, dos variantes, tres tamaños,
transiciones reales, reduced motion, forced-colors y cero `console.error`/`pageerror`. La
combinación skeuo–inverted–lg se inspeccionó visualmente.

## Resultado esperado vs. real

- **Esperado:** tres archivos propios bastan para registrar Tooltip sin cruzarse con el
  Accordion paralelo.
- **Real:** codegen descubrió `tooltip`, `verify-registry` reportó nueve componentes
  autocontenidos y `/components/tooltip` quedó prerenderizado dentro de 16 páginas.
- **Interacción:** Radix mantuvo semántica, Escape, foco, hover y posicionamiento sin lógica
  paralela en Morphiq.

## Bugs / obstáculos y cómo se resolvieron

1. **El arnés inicial usó `CSS.escape` desde Node.** Esa API existe en el navegador, no en
   el runtime Node del script. El selector se cambió por un atributo de id sin tocar
   producción.
2. **Reabrir por hover inmediatamente después de hacer click en otro control fue inestable
   en el arnés.** Se aisló el hover como prueba propia y se recorrió la matriz con foco de
   teclado, evitando sleeps y conservando cobertura de ambas vías accesibles.
3. **Reduced motion conservaba un offset de 4 px.** La CSS compilada mostró que
   `data-side` tenía mayor especificidad que la utilidad de media query. Se hicieron
   importantes únicamente los dos custom properties de offset; el re-test obtuvo `x:0px`,
   `y:0px` y `transition-property: opacity`.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock; navegador no descargado.
- Contrato TDD efímero — ✅ rojo esperado y verde final.
- Cálculo de contraste — ✅ 8/8 pares ≥ 4.5:1; mínimo 9.52:1.
- `npm run lint` — ✅ sin warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":9,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 16 páginas; `/components/tooltip` SSG.
- `npm run check` — ✅ exit code 0.
- Playwright + Chrome del sistema — ✅ matriz funcional/a11y completa y cero errores.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS y el fix automático propone un downgrade incompatible.

## Riesgos, deuda y pendientes

- Un Tooltip debe complementar una etiqueta breve del trigger, no contener información
  esencial ni controles interactivos. Esa responsabilidad de contenido permanece en quien
  consume el componente.
- `portalled={false}` existe para previews acotados; la aplicación debe conservar el portal
  por defecto salvo que controle explícitamente clipping y stacking.
- La validación interactiva fue Chrome de escritorio; forced-colors y reduced motion se
  emularon con Playwright.

## Estado final

Completo. Tooltip queda auto-descubierto, autocontenido, accesible, AA, probado en navegador
y prerenderizado; el gate integral está verde con `components:9`.
