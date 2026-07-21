# Reporte 0016 — Componente Avatar

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-avatar` · **Commit final:** ver PR (commit `feat: add production Avatar component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 8. Añadir un Avatar de producción con cuatro materiales, formas y tamaños CVA, imagen con fallback accesible y preview auto-descubierto, sin editar archivos compartidos.

## Objetivo

Incorporar una representación de identidad autocontenida que muestre una imagen real y
caiga de forma estable a iniciales o icono cuando no hay imagen o la carga falla. Debía
mantener contraste AA, semántica correcta, forced-colors y reduced motion en los cuatro
materiales de Morphiq.

## Qué se hizo

- `src/registry/ui/avatar.tsx` — componente `Avatar`, estado de carga por `src`, fallback de
  iniciales/icono, props nativas de imagen compuestas, cuatro marcos materiales, tres formas
  y tres tamaños.
- `src/registry/previews/avatar-preview.tsx` — preview simultáneo de imagen y fallback, con
  cobertura real de todos los ids y estados del selector de la ficha.
- `src/registry/entries/avatar.ts` — entrada `media` auto-descubierta, dependencias exactas y
  contrato de accesibilidad bilingüe.
- `docs/reports/0016-componente-avatar.md` — este reporte.

No se editó schema, ficha genérica, package, index/generated, scripts, app, globals, tests ni
ningún componente existente. El índice regenerado por los hooks permanece gitignorado.

## Cómo se hizo

### Formas y tamaños

La variante expresa forma, sin sumar ejes secundarios de status o grupos:

- `circle` — círculo clásico para personas y perfiles;
- `rounded` — rectángulo redondeado para identidades de producto/equipo;
- `squircle` — radio proporcional de 32%, más orgánico y táctil.

Los tamaños son `sm` (36 px, marco de 2 px), `md` (48 px, marco de 3 px) y `lg`
(64 px, marco de 4 px). Mantener tres tamaños evita complejidad innecesaria y coincide con
los demás componentes del registry.

### Imagen → fallback sin parpadeo

El fallback permanece montado debajo de la imagen. Para cada `src`, la imagen empieza con
opacidad cero y `aria-hidden`; solo cambia inmediatamente a opacidad uno cuando ese mismo
`src` dispara `onLoad` y tiene `naturalWidth > 0`. No hay transición, por lo que nunca se
muestra una imagen rota ni un frame intermedio. `onError` marca ese `src` como fallido,
conserva el fallback y retira el estado busy.

El estado se guarda como `loadedSrc`/`failedSrc`, no como un booleano global. Al cambiar de
URL, una carga anterior no puede autorizar la imagen nueva. Un callback ref comprueba además
`HTMLImageElement.complete` y `naturalWidth`, cubriendo imágenes cacheadas cuyo evento load
pudo ocurrir antes de la hidratación. `useImperativeHandle` compone el ref opcional del
consumidor sin mutar props; `imageProps` también compone `onLoad`, `onError`, className,
loading y los demás atributos nativos.

Se usa `<img>` deliberadamente: el archivo es código distribuible para React y no puede
depender de `next/image`. La desactivación de `@next/next/no-img-element` es local y explica
esa frontera.

### Accesibilidad

`alt` es obligatorio. Con identidad significativa, la imagen cargada conserva ese alt; para
uso decorativo, `alt=""` elimina imagen, fallback y busy interno del árbol accesible.

Mientras falta, carga o falla una imagen significativa, el fallback usa `role="img"` y
`aria-label` con el nombre completo, o con alt si no hay name. Las iniciales visibles y el
icono genérico llevan `aria-hidden`, evitando que un lector pronuncie “MC” o intente inferir
identidad desde el símbolo. Al cargar la imagen, el fallback pasa a `aria-hidden` y la imagen
real entra al árbol, por lo que nunca existen dos nombres accesibles simultáneos.

El outline de documentación tiene 2 px y offset de 3 px. Forced-colors conserva borde
CanvasText, usa Canvas/CanvasText para el fallback y elimina sombras. No se declara ninguna
animación ni transición; los cambios son inmediatos también bajo reduced motion.

### Materiales, contraste y self-containment

Cada receta controla el marco y la superficie de fallback:

- clay — marco cálido con canto inferior, luces internas y volumen blando;
- glass — superficie oscura al 94/96%, blur/saturación y highlight translúcido;
- skeuo — marco en gradiente, bisel físico y fallback mineral;
- adaptive — marco mínimo oscuro que invierte superficie y texto en el esquema alterno.

Todas las variables son locales `--mq-*` y cada `var()` tiene fallback literal. No existen
variables de `:root`, clases de chrome ni dependencia visual de `globals.css`. Los imports
reales (CVA, Lucide y `cn.ts`) coinciden con el manifiesto, incluidos `clsx` y
`tailwind-merge` detrás de `cn`.

El contraste se calculó con luminancia relativa sRGB. Glass se compuso sobre negro y blanco
y se conservó el peor resultado; adaptive toma el mínimo de sus dos pares reales de esquema.

| Material | Foreground / fallback | Ratio mínimo |
| --- | --- | ---: |
| clay | `#3b2c23` / `#f1e3d3` | 10.61:1 |
| glass, peor backdrop | `#ffffff` / `rgba(55,63,78,.96)` | **9.36:1** |
| skeuo | `#29261f` / `#d1ccc0` | 9.42:1 |
| adaptive, peor esquema | par oscuro o par claro | 12.63:1 |

El mínimo absoluto es 9.36:1, holgadamente superior al requisito 4.5:1.

### TDD y navegador real

El primer contrato efímero falló por la ausencia esperada de
`src/registry/entries/avatar.ts`. Tras crear los tres archivos, pasó y se añadieron ciclos
rojo→verde específicos para recuperación de imágenes cacheadas y para ocultar busy en usos
decorativos. Los tests fueron efímeros porque `tests/**` estaba fuera del guardarraíl.

Playwright CLI ejecutó Chrome del sistema contra `next start`. Verificó HTTP 200, imagen en
estado `loaded`, fallback sin src en `fallback`, alt significativo, etiqueta completa
“Morgan Chen”, iniciales “MC” ocultas, tres formas, dimensiones 36/48/64, cuatro materiales,
loading/disabled/focus, cero animaciones, forced-colors, bloque de código real y cero
`console.error`/`pageerror`. La combinación skeuo–squircle–large se inspeccionó visualmente.

## Resultado esperado vs. real

- **Esperado:** tres archivos bastan para registrar y prerenderizar Avatar sin cruzarse con
  el pulido genérico paralelo.
- **Real:** codegen descubrió `avatar`, `verify-registry` reportó ocho componentes
  autocontenidos y `/components/avatar` apareció como SSG dentro de 15 páginas.
- **Carga:** la implementación cubre load, error, ausencia, cambio de `src` e imagen cacheada
  sin revelar contenido roto ni duplicar nombres accesibles.

## Bugs / obstáculos y cómo se resolvieron

1. **El verde inicial del contrato falló por quoting de Windows.** La expresión `['"]` llegó
   a Node sin comilla doble; se sustituyó por `\x22`/`String.fromCharCode(34)` sin cambiar
   producción.
2. **ESLint rechazó mutar un ref recibido por props dentro de `useCallback`.** React 19 lo
   trata como valor inmutable; se introdujo un ref interno y `useImperativeHandle`, dejando
   a React gestionar la composición.
3. **La primera auditoría de reduced motion esperaba `transition-duration: 0s`.** El valor
   computado era `.01ms` porque `globals.css` aplica ese límite global a todos los elementos
   bajo la media query. La comprobación correcta es `getAnimations().length === 0`; Avatar
   no declara transition y no necesitó cambio.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock; navegador no descargado.
- Contratos TDD efímeros — ✅ rojo esperado y verde final.
- Cálculo de contraste — ✅ 4/4 materiales ≥ 4.5:1; mínimo 9.36:1.
- `npm run lint` — ✅, sin warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":8,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 15 páginas; `/components/avatar` SSG.
- `npm run check` — ✅ exit code 0.
- Playwright CLI + Chrome del sistema — ✅ matriz funcional/a11y completa y cero errores.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS cuya corrección automática propone un downgrade incompatible.

## Riesgos, deuda y pendientes

- Reintentar exactamente la misma URL después de un error requiere remontar Avatar o cambiar
  el `src` (por ejemplo, añadiendo un parámetro de retry); se evita un bucle automático de
  red dentro del componente.
- `fallback` admite contenido personalizado, pero el wrapper mantiene el nombre accesible y
  lo trata como presentación. Quien necesite contenido interactivo no debe colocarlo dentro
  de un Avatar.
- El SVG del preview es un data URI estable para no depender de red. Las aplicaciones reales
  deben aplicar su propia política de CDN, `referrerPolicy`, CORS y tamaños responsivos a
  través de `imageProps`.
- La validación interactiva fue Chrome de escritorio; forced-colors se emuló con Playwright.

## Estado final

Completo. Avatar queda auto-descubierto, autocontenido, accesible, AA, probado en navegador
y prerenderizado; el gate integral está verde con `components:8`.
