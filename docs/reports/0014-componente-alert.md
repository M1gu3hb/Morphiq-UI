# Reporte 0014 — Componente Alert / Callout

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-alert` · **Commit final:** ver PR (commit `feat: add production Alert component`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 7. Añadir un Alert / Callout de producción con cuatro materiales, tonos semánticos, tres tamaños, preview y entrada auto-descubierta, sin editar archivos compartidos.

## Objetivo

Incorporar un aviso estructurado para páginas, mayor que Badge, con título, descripción,
ícono decorativo y acción opcional. Debía ser autocontenido, accesible, AA, compatible con
forced-colors y descubierto automáticamente mediante sus tres archivos propios.

## Qué se hizo

- `src/registry/ui/alert.tsx` — componente `Alert`, variantes CVA, cuatro materiales, cinco
  tonos, tres tamaños, política configurable de urgencia, ícono y acción opcionales.
- `src/registry/previews/alert-preview.tsx` — preview real de todos los ids declarados y de
  los estados `default`, `focus`, `loading` y `disabled`; la acción cambia su texto al usarla.
- `src/registry/entries/alert.ts` — `RegistryEntry` auto-descubierta en `feedback`, con
  manifiesto de dependencias y documentación bilingüe de accesibilidad.
- `docs/reports/0014-componente-alert.md` — este reporte.

No se editó ningún archivo compartido. En particular, no se tocaron `index.ts`,
`generated.ts`, scripts, `package.json`, schema, componentes existentes, app, globals ni
tests. El índice generado por los hooks permanece gitignorado.

## Cómo se hizo

### Tonos, texto semántico y política de urgencia

Se eligió el mismo vocabulario de feedback que Badge, pero aplicado a mensajes completos:

- `neutral` — una nota sin juicio ni urgencia;
- `info` — información nueva que no bloquea;
- `success` — una operación terminada correctamente;
- `warning` — una situación que requiere atención;
- `danger` — un error o bloqueo que exige reacción.

`title` y `children` son obligatorios. Además, el título accesible recibe automáticamente el
prefijo `Note`, `Information`, `Success`, `Warning` o `Error`, oculto solo visualmente. La prop
`toneLabel` permite localizar o adaptar ese prefijo. El ícono predeterminado lleva
`aria-hidden="true"`; puede sustituirse o quitarse con `icon={false}`. Así el significado no
depende del color ni de la forma del ícono, incluso si el consumidor escribe un título
ambiguo.

La política `urgency="auto"` aplica:

| Tono | Rol | `aria-live` | Motivo |
| --- | --- | --- | --- |
| `neutral` | `status` | `polite` | nota no bloqueante |
| `info` | `status` | `polite` | información no urgente |
| `success` | `status` | `polite` | confirmación que no debe interrumpir |
| `warning` | `alert` | `assertive` | requiere atención inmediata |
| `danger` | `alert` | `assertive` | error o bloqueo urgente |

Las regiones vivas usan `aria-atomic`. `urgency="polite" | "assertive" | "off"` permite
que el contexto del producto reemplace la inferencia visual. El slot `action` acepta un
botón o enlace real, pero Alert no implementa cierre ni restaura foco: esa responsabilidad
pertenece al flujo que elimina el aviso.

### Materiales, estados y self-containment

Las cuatro recetas viven enteras en `alert.tsx`:

- clay — superficie blanda, luces internas y canto inferior tonal;
- glass — relleno al 94%, blur/saturación de fondo y highlight translúcido;
- skeuo — gradiente, bisel, canto y sombra física;
- adaptive — superficie mínima que invierte la paleta entre esquemas claro y oscuro.

Cada material/tono define variables locales `--mq-*`; todo `var()` tiene fallback literal.
No se usan variables `:root`, clases de chrome ni CSS del sitio. Los imports externos reales
son CVA y Lucide; `cn.ts` cierra `clsx` y `tailwind-merge`, exactamente como declara la
entrada.

Alert no es una superficie interactiva y no introduce hover ni motion. Los cambios de
estado son inmediatos: no hay propiedades de transición fantasma y reduced motion obtiene
la misma interfaz. `focus` conserva un outline visible para el caso en que el consumidor
haga enfocable el contenedor. En forced-colors, Canvas/CanvasText sustituyen superficie y
texto, se conserva un borde del sistema y se eliminan sombras ornamentales.

### Contraste

Se calculó WCAG 2.x con luminancia relativa sRGB para el foreground compartido por título y
descripción. Clay usa su relleno; glass compone el alpha 0.94 sobre negro y blanco y conserva
el peor caso; skeuo toma el mínimo de ambos stops; adaptive toma el mínimo de sus dos pares
reales de esquema, sin cruzar texto y fondo de esquemas opuestos.

| Material | neutral | info | success | warning | danger |
| --- | ---: | ---: | ---: | ---: | ---: |
| clay | 10.79:1 | 7.61:1 | 7.40:1 | 7.31:1 | 7.17:1 |
| glass, peor backdrop | 12.27:1 | 7.79:1 | 6.52:1 | 7.59:1 | 8.03:1 |
| skeuo, peor stop | 8.93:1 | 5.96:1 | 6.67:1 | 5.77:1 | **4.86:1** |
| adaptive, peor esquema | 15.48:1 | 7.61:1 | 7.18:1 | 6.98:1 | 7.80:1 |

El mínimo absoluto es 4.86:1 (`skeuo` + `danger`), superior al 4.5:1 exigido para texto
normal.

### TDD y navegador real

Antes de crear producción se ejecutó una aserción efímera del contrato y falló por la
ausencia esperada de `src/registry/entries/alert.ts`. Después de crear solo los tres archivos,
la misma prueba pasó. `verify-registry` confirmó ids, tipos, dependencias, autocontención y
cobertura de estado.

Un recorrido Playwright CLI contra `next start` y Chrome del sistema verificó la ficha
`/components/alert`: HTTP 200, cinco tonos con sus roles/live regions y etiquetas accesibles,
cuatro materiales, tres tamaños, estados loading/disabled/focus, acción funcional, ícono
decorativo, ausencia de animaciones bajo reduced motion, borde/sombra de forced-colors y
cero `console.error`/`pageerror`. También se inspeccionó visualmente la combinación
skeuo-warning junto al bloque de código real.

## Resultado esperado vs. real

- **Esperado:** tres archivos propios registran, documentan y prerenderizan Alert sin
  colisionar con Tabs ni tocar plumbing compartido.
- **Real:** el codegen descubrió `alert`, el registry reportó seis componentes autocontenidos
  y `/components/alert` se generó como SSG dentro de 13 páginas estáticas.
- **Accesibilidad:** la semántica se deriva por defecto del tono, puede sobrescribirse por
  contexto y siempre incluye una palabra tonal accesible localizable.

## Bugs / obstáculos y cómo se resolvieron

1. **El primer cálculo auxiliar de contraste marcó `adaptive` como fallo.** La evidencia
   mostró que el script cruzaba el texto claro del esquema normal con el fondo claro del
   esquema oscuro, una pareja que nunca se renderiza. Se separaron los pares reales de cada
   esquema y la medición reproducible dio mínimo 4.86:1. Producción no necesitó cambios.
2. **Playwright CLI guarda snapshots y capturas locales.** Se usaron únicamente para la
   comprobación visual y se eliminaron al terminar; no entran al diff ni al commit.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock; sin descargar navegador.
- Contrato TDD efímero — ✅ rojo antes de implementar y verde después.
- Cálculo de contraste — ✅ 20/20 combinaciones ≥ 4.5:1; mínimo 4.86:1.
- `npm run lint` — ✅.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":6,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 13 páginas; `/components/alert` SSG.
- `npm run check` — ✅ exit code 0.
- Playwright CLI + Chrome del sistema — ✅ HTTP 200 y matriz funcional/a11y completa; cero
  errores de consola o runtime.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS y la corrección automática propuesta implicaría un downgrade
  incompatible de Next.

## Riesgos, deuda y pendientes

- Los consumidores deben reservar `assertive` para mensajes realmente urgentes. Montar
  warnings/danger persistentes durante cada navegación puede generar anuncios excesivos;
  `urgency="polite"` u `off` cubre esos contextos.
- Glass se midió sobre los extremos de luminancia, pero fondos con textura intensa pueden
  reducir legibilidad perceptual aunque el alpha compuesto conserve el ratio calculado.
- Si una acción elimina el Alert, el consumidor debe gestionar foco y cualquier anuncio de
  cierre; el componente evita estado interno para no imponer ese flujo.
- La validación interactiva fue Chrome de escritorio; forced-colors fue emulado por
  Playwright. La aserción adicional fue efímera porque `tests/**` está fuera del guardarraíl.

## Estado final

Completo. Alert queda auto-descubierto, autocontenido, accesible, AA y prerenderizado; el
gate local integral está verde con `components:6`.
