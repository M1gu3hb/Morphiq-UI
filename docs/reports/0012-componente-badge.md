# Reporte 0012 — Componente Badge

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-badge` · **Commit final:** ver PR (commit `feat: add production Badge component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 6. Añadir un Badge de producción con cuatro materiales, tonos semánticos, tres tamaños, preview y entrada auto-descubierta, sin editar ningún archivo compartido.

## Objetivo

Incorporar una etiqueta compacta para estados y categorías siguiendo el modelo open-code de
Morphiq: autocontenida, accesible, con contraste AA, cuatro recetas materiales y cero
colisión con el Input construido en paralelo.

## Qué se hizo

- `src/registry/ui/badge.tsx` — componente `Badge`, variantes CVA, cuatro materiales, cinco
  tonos, tres tamaños, `asChild` y punto inicial opcional.
- `src/registry/previews/badge-preview.tsx` — preview real de todos los ids declarados y de
  los estados `default`, `focus`, `loading` y `disabled`.
- `src/registry/entries/badge.ts` — `RegistryEntry` auto-descubierta bajo la categoría
  `feedback`, con dependencias y contrato de accesibilidad reales.
- `docs/reports/0012-componente-badge.md` — este reporte.

No se editó `index.ts`, `generated.ts`, scripts, package, globals, tests ni ningún componente
existente. `generated.ts` fue regenerado por los hooks y permanece gitignorado.

## Cómo se hizo

### Tonos y significado

Se eligieron cinco tonos que cubren el vocabulario habitual de un badge:

- `neutral` — metadatos sin juicio, por ejemplo “Draft”.
- `success` — resultado positivo o disponible, “Live”.
- `warning` — requiere atención, “Needs review”.
- `danger` — bloqueo o error, “Blocked”.
- `info` — contexto informativo, “Beta”.

El tono no agrega un nombre accesible ni un rol implícito: solo cambia presentación. El
significado viene de `children`, o de `aria-label` si el consumidor decide hacer un badge
solo con icono. El punto opcional es decorativo y lleva `aria-hidden`. Así un lector de
pantalla y una persona que no distingue el color reciben la misma palabra semántica. El
elemento por defecto es un `<span>` sin rol; quien anuncie un estado dinámico puede pasar
`role="status"`, como hace el preview. `asChild` permite conservar otra semántica elegida por
el consumidor.

### Recetas materiales y self-containment

Las recetas viven enteras en `badge.tsx`:

- clay — volumen suave con highlights internos y borde inferior tonal;
- glass — relleno al 94%, blur/saturación de fondo y highlight translúcido;
- skeuo — gradiente tonal, bisel y sombra física compacta;
- adaptive — superficie mínima que invierte su paleta con el esquema claro/oscuro.

Todas usan únicamente variables locales `--mq-*`, y cada `var()` tiene fallback literal.
No hay variables de `:root`, clases de chrome global ni imports visuales externos. El
manifiesto coincide con el cierre real: Radix Slot, CVA y `src/lib/cn.ts` con sus paquetes
`clsx`/`tailwind-merge`.

No se introdujo hover ni animación. Los cambios de estado son inmediatos, por lo que no hay
propiedades de transición que puedan quedar sin cobertura y `prefers-reduced-motion` no
recibe movimiento. En `forced-colors`, Canvas/CanvasText sustituyen relleno y texto, las
sombras desaparecen y el borde de sistema conserva el perímetro.

### Contraste

Se calculó WCAG 2.x a partir de luminancia relativa sRGB. En clay se midió el relleno; en
skeuo se tomó el mínimo entre ambos extremos del gradiente; en glass se compuso el alpha
0.94 por separado sobre negro y blanco y se conservó el peor resultado; en adaptive se tomó
el mínimo de los esquemas claro y oscuro.

| Material | neutral | success | warning | danger | info |
| --- | ---: | ---: | ---: | ---: | ---: |
| clay | 10.79:1 | 7.40:1 | 7.31:1 | 7.17:1 | 7.61:1 |
| glass, peor backdrop | 12.27:1 | 6.52:1 | 7.59:1 | 8.03:1 | 7.79:1 |
| skeuo, peor stop | 8.93:1 | 6.67:1 | 5.77:1 | **4.86:1** | 5.96:1 |
| adaptive, peor esquema | 15.48:1 | 7.18:1 | 6.98:1 | 7.80:1 | 7.61:1 |

El mínimo absoluto es 4.86:1 (`skeuo` + `danger`), por encima del 4.5:1 exigido para el
texto pequeño del componente.

### TDD y comprobación real

Antes de crear producción se ejecutó una aserción efímera del contrato y falló por la
ausencia de `src/registry/entries/badge.ts`, como debía. Tras crear solo los tres archivos,
la misma prueba pasó y el verificador oficial confirmó autocontención, dependencias, ids de
preview y tipos.

Un recorrido Playwright contra `next start` verificó `/components/badge` con HTTP 200, los
cinco tonos, cuatro materiales, tres tamaños y cuatro estados; también comprobó semántica,
punto decorativo, paleta adaptive oscura, ausencia de motion, borde de sistema en
forced-colors y cero `console.error`/`pageerror`. La inspección visual de la ficha confirmó
el Badge clay/success y el bloque de fuente real.

## Resultado esperado vs. real

- **Esperado:** tres archivos propios bastan para registrar, tipar, documentar y prerenderizar
  Badge sin tocar plumbing compartido.
- **Real:** el codegen descubrió `badge` automáticamente, `verify-registry` quedó verde y
  `/components/badge` apareció como SSG. El diff funcional contiene solo esos tres archivos.
- **Diseño:** los 20 pares material/tono superan AA; el preview demuestra texto semántico y
  no depende del punto/color para comunicar significado.

## Bugs / obstáculos y cómo se resolvieron

1. **La primera ejecución verde del test efímero falló por el quoting de Windows.** Las
   comillas literales dentro del `node -e` fueron consumidas por la línea de comandos; la
   aserción se corrigió a `\x22` y pasó sin cambiar producción.
2. **El navegador abrió el sitio en español.** La prueba inicial buscaba labels ingleses;
   se hizo bilingüe para las opciones traducibles, igual que el smoke permanente del repo.
3. **Input seguía en un PR paralelo durante el cierre.** El gate aislado de esta rama reportó
   cuatro componentes —los tres de main más Badge—. El PR #10 de Input estaba abierto, con
   CI verde pero sin señal de auditoría/aprobación; fusionarlo habría excedido la autorización
   explícita, que solo cubría los PR #9 y #8. Por eso no se inventa un resultado de cinco.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock; navegador no descargado.
- Contrato TDD efímero — ✅ después de reproducir el fallo inicial esperado.
- Cálculo de contraste — ✅ 20/20 combinaciones ≥ 4.5:1; mínimo 4.86:1.
- `npm run lint` — ✅ después del cambio.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":4,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 11 páginas; `/components/badge` SSG.
- `npm run check` — ✅ exit code 0 en la rama aislada.
- Playwright de la ficha real — ✅ 5 tonos, 4 materiales, 3 tamaños, 4 estados, forced
  colors y cero errores de navegador.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS ya conocidas.
- GitHub Actions PR #11 — ✅ `validate` (48 s) y `e2e` (1 min 12 s).

## Riesgos, deuda y pendientes

- El contraste glass se acota contra negro y blanco, que son los extremos de luminancia;
  fondos con patrones muy finos pueden seguir reduciendo la legibilidad perceptual aunque no
  bajen el ratio calculado tras composición.
- `asChild` delega la semántica y el comportamiento al elemento hijo. Badge no bloquea
  interacción ni inventa semántica de control.
- La verificación interactiva fue Chromium de escritorio; forced-colors se emuló por CDP.
- La prueba de contrato adicional fue efímera porque `tests/**` estaba fuera del
  guardarraíl. El gate permanente sigue siendo `verify-registry`.

## Estado final

Completo para Badge. Rama, gate aislado y CI del PR están verdes. El resumen integrado de
`components:5` queda pendiente de que el PR #10 de Input sea auditado y fusionado; en esta
rama el resultado real y reproducible es `components:4`.
