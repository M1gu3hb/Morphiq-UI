# Reporte 0030 — Rediseño táctil de Input y Textarea

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `redesign/input-textarea` · **Commit final:** ver PR (commit `redesign: deepen tactile input and textarea materials`)
- **Tipo:** feature
- **Prompt recibido:** Rediseñar Input y Textarea con profundidad táctil propia para clay, glass, skeuo y adaptive, preservando API, accesibilidad, autoResize, geometría y el contrato self-contained.

## Objetivo

Convertir los dos campos de texto en superficies táctiles distinguibles y consistentes con
los pilotos aprobados de Select y Toggle. El cambio debía residir sólo en los archivos
propios de Input y Textarea, sin modificar la plomería compartida ni degradar su semántica
nativa.

## Qué se hizo

- `src/registry/ui/input.tsx` y `src/registry/ui/textarea.tsx` incorporan recetas completas
  de material: paletas, gradientes, cantos, profundidad de reposo, hover y pozo de foco.
- Las transiciones declaran únicamente las propiedades que cambian. El foco conserva un
  outline inmediato y anima la entrada al pozo interior sin introducir propiedades
  fantasma.
- `src/registry/entries/input.ts` y `src/registry/entries/textarea.ts` actualizan la
  documentación bilingüe de foco, reduced-motion, forced-colors y los ratios conservadores
  del nuevo colorido.
- La lógica pública de ambos componentes no cambió. En particular, Textarea conserva el
  resize nativo y el algoritmo de `autoResize` que vuelve primero a `height: auto`.

Los previews existentes ya ejercitan los cuatro materiales, tres variantes, tres tamaños y
los estados default, focus, loading, disabled y error; se auditaron y no necesitaron cambios.

## Cómo se hizo

### Recetas táctiles

| Material | Input y Textarea |
| --- | --- |
| clay | Superficie cálida marfil/terracota, luz blanca superior, sombreado interior inferior, canto cálido y elevación exterior. Hover aumenta contacto/elevación; foco reduce la extrusión y añade un pozo inset. No usa negro en la receta decorativa. |
| glass | Tinte propio legible, gradiente de luz superior, borde claro, highlights interiores, sombra fría atmosférica y `backdrop-filter: blur(18px) saturate(170%)`; hover llega a 22 px de blur y más profundidad. |
| skeuo | Cuerpo frío de gris metalizado con gradiente de parte iluminada a cuerpo, borde físico, canto de 3 px y sombra proyectada. El foco se hunde como un control mecánico. |
| adaptive | Tratamiento deliberadamente sobrio: superficie opaca sin imagen decorativa y dos capas de sombra. Hover crea contacto sin ornamento. Conserva paleta clara/oscura y aumenta el objetivo táctil bajo `pointer: coarse` a 48 px en Input y 120 px en Textarea. |

Cada receta conserva el mismo número y orden de capas entre estados para que el navegador
pueda interpolarlas: cinco en clay y skeuo, cuatro en glass y dos en adaptive. Los tokens
`--mq-grad`, `--mq-grad-strong` y `--mq-edge`, como todos los `var()` consumidos, llevan
fallback literal. No se agregó ninguna dependencia de `globals.css` ni de variables `:root`.

Los tamaños mantienen una línea plegada coherente con controles compactos:
`12px/1.3`, `13px/1.35`, `14px/1.4` en Input y `12px/1.55`, `13px/1.6`, `14px/1.65` en
Textarea. No se alteraron padding, radios, `rows` ni el área útil de escritura.

### Foco, transición y movimiento reducido

La lista exacta en ambos controles es
`transition-[border-color,background-color,box-shadow,backdrop-filter,opacity]`:

- `border-color` cambia con foco y error;
- `box-shadow` cambia con hover y foco;
- `backdrop-filter` cambia sólo en hover de glass;
- `opacity` cambia en disabled;
- `background-color` cambia al escoger material o tratamiento en el preview.

El `outline` no se anima: aparece inmediatamente al navegar con teclado. El pozo de foco
material sí interpola mediante `box-shadow`, tanto con `:focus-visible` real como con el
estado documental `data-focus`. Cuando `aria-invalid=true`, el borde y outline de error
siguen ganando especificidad.

Chrome del sistema, contra el build de producción, extendió temporalmente la duración de la
sonda y consultó `getAnimations()` justo después de enfocar con Tab. El resultado fue:

| Componente | Propiedad reportada por WAAPI | Tipo |
| --- | --- | --- |
| Input | `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color` | `CSSTransition` |
| Input | `box-shadow` | `CSSTransition` |
| Textarea | `border-top-color`, `border-right-color`, `border-bottom-color`, `border-left-color` | `CSSTransition` |
| Textarea | `box-shadow` | `CSSTransition` |

No aparecieron animaciones activas de `background-color` ni `backdrop-filter` durante el
foco: están declaradas porque cambian en otros estados, pero no son fantasmas de la acción
medida. En `prefers-reduced-motion: reduce` no quedaron animaciones activas; la microduración
global computó `0.01 ms` y el pozo final siguió siendo distinto al reposo, de modo que se
elimina el trayecto sin borrar la información de foco.

### Accesibilidad y comportamiento conservados

- Input y Textarea siguen siendo controles HTML nativos. No se agregó estado React, efecto,
  memoización ni reimplementación de teclado.
- `InputField` y `TextareaField` conservan `<label htmlFor>`, composición de
  `aria-describedby`, región `aria-live` siempre montada y `aria-invalid` como única fuente
  del estado de error. La sonda confirmó `aria-invalid=true` y una descripción conectada.
- Forced-colors elimina explícitamente `box-shadow`, imágenes de fondo y backdrop filters;
  el navegador computó borde y outline sólidos de sistema en los dos controles.
- Textarea mantiene `resize-y` normalmente y `resize: none` sólo con `autoResize`. En la
  prueba real creció de 82 px a 270 px con contenido largo y volvió a 82 px al reducirlo.
  Esa contracción demuestra el orden obligatorio: primero `height = "auto"`, después
  `height = scrollHeight + "px"`.

La comprobación sRGB utilizó el extremo más oscuro de cada gradiente y, para glass, la peor
composición sobre negro. Placeholder y texto escrito mantienen el umbral de texto normal:

| Material / esquema | Placeholder mínimo | Texto mínimo |
| --- | ---: | ---: |
| clay | **4.80:1** | 9.81:1 |
| glass | 5.12:1 | 7.03:1 |
| skeuo | 5.21:1 | 10.38:1 |
| adaptive claro | 6.59:1 | 14.98:1 |
| adaptive oscuro | 7.01:1 | 12.24:1 |

El mínimo conservador es 4.80:1, por encima de 4.5:1. La variante underline no crea una
superficie propia y conserva su contrato documentado con el fondo anfitrión.

### Desarrollo guiado y navegador real

Un contrato estático efímero empezó en RED porque los controles anteriores no contenían un
mapa de profundidad por material. Terminó GREEN verificando las cuatro recetas, gradientes,
cobertura exacta de transición, objetivos `pointer-coarse`, reduced-motion, forced-colors,
foco/error, `aria-describedby` y el orden de `autoResize`. Se eliminó al cerrar porque
`tests/**` está fuera del guardarraíl.

Playwright CLI operó Chrome del sistema sobre `next start`. Además de las sondas WAAPI,
inspeccionó visualmente cada material de ambos componentes, verificó los estilos computados
de glass, skeuo y adaptive, foco de teclado, error, reduced-motion, forced-colors y la
contracción real de Textarea.

## Resultado esperado vs. real

- **Esperado:** dos controles táctiles con cuatro materiales diferenciados, sin alterar API,
  semántica, resize ni archivos compartidos.
- **Real:** las recetas producen gradientes, sombras y filtros computados distintos; Input y
  Textarea siguen respetando su comportamiento nativo, el registry permanece en 22
  componentes self-contained y ambas fichas prerenderizan por SSG.

## Bugs / obstáculos y cómo se resolvieron

1. **El primer parche amplio de Textarea no encontró el contexto de un comentario.** La
   operación fue atómica y no dejó cambios parciales. Se comprobó el diff, se dividió la
   modificación por constantes/CVA y se reaplicó con anclas exactas.
2. **Una lectura de estilos a mitad de transición no sirve para probar cobertura.** La
   verificación usa `getAnimations()` y nombres de propiedad de `CSSTransition`, independiente
   del progreso del reloj; los valores finales se leen después de asentarse.

## Verificación (gate)

- `npm ci` — ✅ dependencias instaladas; 22 entradas regeneradas.
- Contrato TDD efímero — ✅ RED esperado y GREEN final.
- Contraste sRGB conservador — ✅ mínimo 4.80:1.
- ESLint dirigido — ✅ los cuatro archivos TypeScript/TSX sin errores ni warnings.
- `npm run typecheck` — ✅ `next typegen` + TypeScript estricto.
- `npm run test:registry` — ✅ `{"components":22,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 29 páginas; `/components/input` y `/components/textarea` incluidas en SSG.
- `npm run check` — ✅ exit 0.
- Playwright CLI + Chrome del sistema — ✅ render, materiales, foco/ARIA, WAAPI,
  autoResize, esquema oscuro, reduced-motion y forced-colors.

## Riesgos, deuda y pendientes

- Glass gana refracción cuando existe contenido detrás; aun sobre una superficie lisa, su
  tinte propio mantiene contraste y el borde/highlight conserva la identidad material.
- Los gradientes y sombras se validaron en Chrome de escritorio. Son CSS estándar y tienen
  fallbacks literales, aunque el rasterizado puede variar sutilmente entre motores.
- El preview muestra un material a la vez; sus selectores ya cubren el espacio completo y no
  justificaron modificar archivos adicionales.

## Estado final

Completo. Input y Textarea ganan profundidad táctil material, foco verificable y contraste
documentado sin cambiar su API, semántica nativa, autoResize ni contrato self-contained.
