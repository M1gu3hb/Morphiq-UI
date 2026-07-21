# Reporte 0034 — Rediseño táctil de Spinner, Skeleton y Tooltip

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `redesign/spinner-skeleton-tooltip` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Cerrar el rediseño de los 22 componentes elevando los materiales de Spinner y Skeleton, y puliendo únicamente el movimiento de Tooltip sin alterar sus materiales ni su comportamiento Radix.

## Objetivo

Dar identidad visual propia a los cuatro materiales de Spinner y a los cuatro
shimmers de Skeleton, y completar la entrada/salida de Tooltip con escala,
opacidad y desplazamiento lateral. Todo debía conservar API, semántica,
contraste, reduced-motion, forced-colors y contrato self-contained.

## Qué se hizo

- `src/registry/ui/spinner.tsx` añade cuerpo, iluminación y profundidad local al
  aro mediante tokens propios, sin cambiar la rotación ni la región viva.
- `src/registry/ui/skeleton.tsx` sustituye el brillo genérico por cuatro
  gradientes de shimmer completos y material-específicos.
- `src/registry/ui/tooltip.tsx` reemplaza la transición de entrada parcial por
  keyframes locales de entrada y salida que siguen `data-state` y `data-side` de
  Radix. Los bloques de materiales, colores y variantes no se modificaron.
- Las entries de los tres componentes describen el resultado real y la entry de
  Tooltip documenta el nuevo contrato de movimiento y reduced-motion.

Los tres previews se auditaron y no necesitaron cambios: ya recorren todos los
materiales, variantes y tamaños; Spinner muestra estado con y sin etiqueta,
Skeleton demuestra la región `aria-busy`, y Tooltip permanece abierto por
defecto con `portalled={false}` para caber en la ficha.

## Cómo se hizo

### Spinner

El aro conserva sus colores de pista/arco y suma tres tokens locales:
`--mq-ring-body`, `--mq-ring-grad` y `--mq-ring-shadow`. La receta visual queda:

| Material | Receta del aro |
| --- | --- |
| clay | Cuerpo melocotón, bloom superior ancho, sombra interior terracota, canto corto y sombra ambiente marrón; no contiene sombra negra. |
| glass | Tinte frío propio, gradiente de luz, filo superior, sombra fría en capas, `blur(10px)` y `saturate(165%)`. |
| skeuo | Greige cálido `#e6e3da`, gradiente lit→body, bisel duro, sombra interior acromática, pared corta y contacto mecánico. |
| adaptive | Sin gradiente, una sola sombra de contacto y paleta clara/oscura; la identidad sigue siendo mínima. |

El keyframe existente sigue siendo
`@keyframes mq-spinner-rotate{to{rotate:1turn}}`: no se introdujo `transform` ni
otra propiedad animada. Chrome reportó una única `CSSAnimation` con propiedad
`rotate` en los cuatro materiales. Bajo reduced-motion `animation-name` computó
`none`, `getAnimations()` devolvió `[]` y quedó un aro bicolor estático. En
forced-colors se limpian `background-image`, backdrop y sombras; pista y arco
siguen usando `GrayText` y `CanvasText`.

La pista y el arco no cambiaron, por lo que se conservan los ratios auditados:
clay 5.46:1, glass 4.29:1 en el peor fondo, skeuo 6.32:1 y adaptive 12.64:1
claro / 8.89:1 oscuro. Se conservaron `role="status"`, texto real visible u
oculto y aro `aria-hidden`.

### Skeleton

Skeleton sigue siendo placeholder y no una superficie táctil. El cambio vive en
`--mq-shimmer`, que ahora contiene el gradiente completo de cada material:

| Material | Shimmer |
| --- | --- |
| clay | Barrido ancho, cálido y porcelánico, con una cola terracota. |
| glass | Frost estrecho azul/blanco sobre wash translúcido, filo propio, `blur(12px)` y `saturate(160%)`. |
| skeuo | Destello metálico corto, con highlight claro y una costura oscura sobre greige cálido. |
| adaptive | Barrido neutro, simple y sobrio, con versión oscura de baja intensidad. |

El keyframe local existente sigue animando exclusivamente
`background-position`. WAAPI devolvió `backgroundPositionX` y
`backgroundPositionY`, sin `transform`, opacidad ni propiedades fantasma. Bajo
reduced-motion no quedan animaciones y se descarta el gradiente, dejando el
bloque base estático; forced-colors limpia imagen, sombra y backdrop y conserva
el contorno `GrayText`.

Los colores base no cambiaron, por lo que se mantienen los pisos documentados
de visibilidad: clay 1.38:1, skeuo 1.41:1, adaptive 1.37:1 claro / 1.38:1 oscuro,
y glass 1.36:1 sobre papel con filo 4.63:1 sobre negro. Cada placeholder sigue
`aria-hidden`; el preview conserva una única región `role="status"`,
`aria-busy="true"` y nombre oculto.

### Tooltip

No se tocó ninguna receta material ni color: los bloques `material` y
`compoundVariants` permanecen iguales. El cambio es sólo movimiento y limpieza
de forced-colors.

Se añadieron dos keyframes hoisted/deduplicados por React:

- `mq-tooltip-enter`: `opacity 0→1`, `scale .94→1` y `translate` desde el lado
  del trigger hasta `0 0`.
- `mq-tooltip-exit`: el recorrido inverso, con escala final `.97`, para cerrar
  hacia el trigger sin un colapso exagerado.

`delayed-open` dura 180 ms con una curva suave, `instant-open` 140 ms para no
entorpecer el paso entre triggers y `closed` 120 ms. Al usar CSS animations,
Radix Presence mantiene Content montado durante la salida. `scale` y `translate`
son propiedades individuales, así que no compiten con un `transform` del
consumidor.

La primera sonda de reduced-motion descubrió que el selector `data-state` tenía
mayor especificidad que `motion-reduce:animate-none`: la media query existía,
pero aún quedaba una `CSSAnimation` terminada. Se creó un segundo contrato RED y
se corrigió con `motion-reduce:!animate-none`. La repetición real computó
`animation-name: none`, estado final `opacity: 1; scale: 1; translate: 0` y
`getAnimations(): []`.

La mecánica sigue siendo 1:1 de Radix. El proxy con `role="tooltip"` mantuvo el
mismo id que `aria-describedby` del trigger; Escape lo retiró, y hover y foco de
teclado volvieron a abrirlo. Forced-colors computó imagen, backdrop y sombra en
`none`, con borde de sistema. Como los tokens de material no cambiaron, todos
los pares texto/superficie conservan el mínimo existente de 9.52:1.

### Tabla de movimiento observada

| Componente / estado | Tipo | Propiedades de `getAnimations()` |
| --- | --- | --- |
| Spinner activo | `CSSAnimation` | `rotate` |
| Skeleton activo | `CSSAnimation` | `backgroundPositionX`, `backgroundPositionY` |
| Tooltip `instant-open` | `CSSAnimation` | `opacity`, `scale`, `translate` |
| Tooltip `closed` | `CSSAnimation` | `opacity`, `scale`, `translate` |
| Los tres con reduced-motion | — | ninguna (`[]`) |

### Self-containment, TDD y revisión React

Todos los nuevos tokens están declarados en su propio componente y cada
consumo `var()` incluye fallback literal. No se lee `:root`, `globals.css` ni
clases de chrome. `verify-registry` confirmó los 22 componentes self-contained
y todos los guards en `ok`.

Un contrato efímero fuera del repo empezó RED con 17 ausencias repartidas entre
recetas, consumo de tokens, forced-colors y movimiento de Tooltip, y terminó
GREEN para los tres componentes. El hallazgo de especificidad de reduced-motion
se convirtió en un segundo RED antes del arreglo. El contrato y las capturas se
eliminaron al cerrar porque no pertenecen al guardarraíl.

La revisión React confirmó exports nombrados, props colocadas, ausencia de hooks
o estado nuevos, semántica nativa/Radix intacta y estilos hoisted deduplicados.

## Resultado esperado vs. real

- **Esperado:** cuatro materiales distinguibles en Spinner y Skeleton, y
  entrada/salida física en Tooltip sin rehacerlo.
- **Real:** los materiales computan gradientes, temperaturas, sombras y filtros
  diferentes; las capturas los distinguen a primera vista. Tooltip conserva su
  aspecto y anima únicamente las tres propiedades previstas. No aparecieron
  errores de consola o runtime.

## Bugs / obstáculos y cómo se resolvieron

1. **La sonda esperaba que `role="tooltip"` fuera la burbuja visible.** Radix
   asigna ese rol a un proxy accesible recortado y pinta Content en otro nodo.
   Se inspeccionaron por separado proxy y Content; no hubo cambio de producción.
2. **Cambiar material cerraba el tooltip abierto por defecto.** Es comportamiento
   correcto de un Root no controlado: el selector mueve foco fuera del trigger.
   La sonda esperó los 120 ms de Presence y reabrió por foco; hover se probó en
   un flujo independiente fuera del área de gracia.
3. **Reduced-motion no vencía a `data-state`.** La evidencia WAAPI mostró una
   animación residual por especificidad. El override importante es el único
   cambio de producción derivado de la depuración y dejó cero animaciones.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes; 22 entradas generadas.
- Contrato TDD efímero — ✅ RED observado y GREEN final para 3 componentes.
- ESLint dirigido después de cada cambio — ✅.
- `npm run typecheck` después de cada componente y entries — ✅.
- `npm run test:registry` — ✅
  `{"components":22,"selfContained":true,"guards":"ok","status":"ok"}`.
- Playwright CLI + Chrome del sistema — ✅ materiales, capturas, WAAPI,
  reduced-motion, forced-colors, Escape, hover, foco, ARIA y cero errores.
- `npm run check` — ✅ lint, typecheck, studio, registry y build.
- Build — ✅ 29 páginas; fichas de Spinner, Skeleton y Tooltip prerenderizadas.
- `npm audit --audit-level=high` — ✅ sin high/critical; permanecen dos moderadas
  preexistentes de Next/PostCSS.

## Riesgos, deuda y pendientes

- Los shimmers se capturan en puntos distintos de su recorrido; su identidad se
  evaluó también por estilos computados completos, no sólo por un frame.
- El rasterizado de blur/sombras puede variar levemente entre motores, pero los
  fallbacks literales y forced-colors mantienen el resultado funcional.
- No se amplió el alcance para unificar la deriva skeuo global; estos dos nuevos
  tratamientos usan deliberadamente el greige cálido aprobado.

## Estado final

Completo. Spinner y Skeleton alcanzan el estándar material solicitado, Tooltip
recibe movimiento de entrada/salida sin alterar su apariencia ni su mecánica,
y el gate completo permanece verde.
