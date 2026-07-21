# Reporte 0032 — Rediseño táctil de Breadcrumb y Pagination

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `redesign/breadcrumb-pagination` · **Commit final:** ver PR (commit `redesign: deepen breadcrumb and pagination materials`)
- **Tipo:** feature
- **Prompt recibido:** Elevar Breadcrumb y Pagination al estándar táctil aprobado, con cuatro materiales distinguibles, movimiento propio y cero regresiones funcionales, accesibles o self-contained.

## Objetivo

Convertir dos controles de navegación visualmente planos en superficies pequeñas pero
físicamente legibles. Breadcrumb debía revelar una píldora material en hover/foco y anclar
la página actual con un chip; Pagination debía elevar, presionar y mantener hundidos sus
mini-controles sin cambiar su API ni semántica.

## Qué se hizo

- `src/registry/ui/breadcrumb.tsx` recibió shell, píldora interactiva y chip actual con
  paleta, gradiente, canto, profundidad y tratamiento de backdrop por material.
- `src/registry/ui/pagination.tsx` convirtió todos los botones en mini-superficies y añadió
  estados diferenciados de reposo, hover, press y página actual.
- `src/registry/entries/breadcrumb.ts` y `src/registry/entries/pagination.ts` actualizan la
  documentación bilingüe de movimiento, reduced-motion, forced-colors y contraste.
- Este reporte concentra el diseño y la evidencia de ambos componentes.

Los previews se auditaron pero no se modificaron: ya recorren los cuatro materiales, dos
variantes, tres tamaños y estados documentales; Pagination además conserva interacción
real. No se tocó ningún archivo compartido ni ningún archivo de Tabs/Accordion.

## Cómo se hizo

### Breadcrumb

#### Recetas nuevas

| Material | Shell, píldora y chip actual |
| --- | --- |
| clay | Marfil/terracota cálido, luz interior superior, sombra interior inferior, canto cálido y sombra ambiente sin negro. La píldora hover aumenta el canto; el chip actual queda extruido de forma permanente. |
| glass | Tinte propio, velo de luz, borde blanco, `blur(12px) saturate(165%)`, highlights interiores y sombra fría en capas. El contraste no depende del fondo. |
| skeuo | Superficie fría `linear-gradient(lit→body)`, bisel superior, sombra interior acromática, pared lateral gris y contacto corto. El chip actual se hunde en lugar de imitar clay. |
| adaptive | Sin imagen decorativa; dos capas de sombra, paleta clara/oscura y objetivo de 36 px bajo `pointer: coarse`. La identidad viene del contacto y la adaptación, no del ornamento. |

Cada enlace conserva su subrayado y crea la superficie en `::before`. En reposo ese pseudo
elemento está en `scale-x: .72` y opacidad cero; hover, `:focus-visible` y el estado
documental `data-focus` lo llevan a escala/opacidad finales con profundidad mayor. El
outline del ancla queda encima y aparece inmediatamente.

La píldora declara exactamente `transition-[scale,opacity,box-shadow]`; el ancla declara
solamente `color`. Chrome del sistema, con duración extendida sólo dentro de la sonda,
reportó:

| Acción | Elemento | `CSSTransition` observada |
| --- | --- | --- |
| hover/foco | ancla | `color` |
| hover/foco | `::before` | `box-shadow`, `opacity`, `scale` |

No aparecieron `background-color`, `backdrop-filter` ni `transform` durante esa acción.
En reduced-motion quedaron cero animaciones activas y la píldora terminó inmediatamente en
`opacity: 1; scale: 1`. Forced-colors computó `background-image: none`, `box-shadow: none`
y backdrop sin filtro en shell, píldora y chip.

#### Accesibilidad y contraste sin regresiones

- Se conserva `<nav aria-label>` → `<ol>` → un `<li>` por nivel.
- Los niveles intermedios siguen siendo `<a>` y el actual sigue siendo un `<span
  aria-current="page">`, sin `href` accidental.
- Separadores siguen `aria-hidden`; la elipsis mantiene `role="img"` y nombre con cantidad
  de niveles ocultos.
- Tab/Enter siguen siendo nativos. La sonda confirmó `:focus-visible`, outline sólido de
  2 px y el mismo estado para el preview.
- El actual se distingue por chip, borde, profundidad y peso; no depende sólo del color.

La comprobación sRGB tomó el extremo más oscuro de cada gradiente y la peor composición
glass sobre negro:

| Material / esquema | Mínimo entre enlace, píldora y chip actual |
| --- | ---: |
| clay | 7.81:1 |
| glass | **4.80:1** |
| skeuo | 8.34:1 |
| adaptive claro | 11.24:1 |
| adaptive oscuro | 9.13:1 |

### Pagination

#### Recetas nuevas

| Material | Mini-superficies y página actual |
| --- | --- |
| clay | Botones cálidos inflados con highlight, shade terracota, canto y sombra cálida. Hover eleva el canto; press lo colapsa; la página actual queda rellena y hundida. |
| glass | Controles tintados con filo blanco, blur de 12 px que sube a 16 px en hover y sombra fría. La página actual usa teal oscuro propio, no el fondo anfitrión. |
| skeuo | Gradiente gris lit→body, bisel, pared lateral y sombra mecánica. La página actual cambia a una placa oscura con inset profundo. |
| adaptive | Superficies planas con dos capas, sombra de contacto creciente, claro/oscuro y objetivo mínimo de 44 px bajo `pointer: coarse`. |

Los botones usan la propiedad standalone `translate` de Tailwind 4: hover sube 1 px, press
baja 2 px y la página actual reposa hundida 1 px. La lista exacta es
`transition-[translate,box-shadow,background-color,color,border-color,backdrop-filter]`.
`background-image` queda fuera porque un gradiente no interpola contra `none`.

WAAPI aisló cada estado después de finalizar cualquier transición anterior:

| Acción | `CSSTransition` observada |
| --- | --- |
| hover glass | `translate`, `box-shadow`, `background-color`, cuatro lados de `border-color`, `backdrop-filter` |
| press | `translate`, `box-shadow` |

No apareció `color` en hover ni `transform` en ninguna acción. `color` sí pertenece a la
lista porque cambia cuando un botón se convierte en página actual. En reduced-motion no
quedaron animaciones y tanto hover como actual computaron `translate: 0px`; el relleno,
subrayado y pozo actual permanecieron. Forced-colors limpió gradiente, backdrop y sombra, y
el actual conservó outline sólido de sistema.

#### Accesibilidad y contraste sin regresiones

- Se conserva `<nav aria-label>` → `<ul>` → `<li>` con botones nativos `type="button"`.
- Enter cambió la página en Chrome real; Space conserva la activación nativa del mismo
  elemento sin modelo de teclado nuevo.
- La página actual mantiene `aria-current="page"`, nombre accesible propio, relleno, peso,
  subrayado y profundidad inset.
- Tras ir a página 1, Anterior computó `disabled=true`; tras ir a página 10, Siguiente hizo
  lo mismo. Las flechas y elipsis permanecen `aria-hidden`.
- No se modificaron la normalización de `page/pageCount`, el modelo controlado ni
  `onPageChange`.

Contraste conservador de texto y separación de la superficie activa contra el shell:

| Material / esquema | Texto normal | Texto activo | Superficie activa |
| --- | ---: | ---: | ---: |
| clay | 9.83:1 | 7.41:1 | 5.36:1 |
| glass | 8.08:1 | 11.72:1 | 8.08:1 |
| skeuo | 10.15:1 | 6.80:1 | **4.98:1** |
| adaptive claro | 17.80:1 | 17.80:1 | 15.30:1 |
| adaptive oscuro | 13.05:1 | 16.06:1 | 11.67:1 |

### Self-containment, TDD y revisión React

Todos los nuevos tokens viven en el archivo del componente y cada consumo `var()` incluye
fallback literal. `verify-registry` confirmó 22 componentes self-contained y guards en
`ok`. Forced-colors limpia manualmente gradientes, velos, backdrop filters y sombras.

Un contrato efímero fuera del repo empezó en RED con “Breadcrumb needs a material pill
gradient” y terminó GREEN comprobando recetas, firma de movimiento, cobertura de
transición, reduced-motion, forced-colors y semántica crítica. Se elimina al cerrar porque
`tests/**` está fuera del guardarraíl.

La revisión React comprobó que no se agregaron hooks, estado, efectos ni memoización. Se
mantienen exports nombrados, props colocadas, elementos semánticos y keys estables basadas
en ids/páginas. El cambio está confinado a constantes CVA y tokens de estilo.

## Resultado esperado vs. real

- **Esperado:** distinguir los cuatro materiales en controles pequeños y añadir píldora,
  lift y press sin romper comportamiento.
- **Real:** las ocho combinaciones componente/material muestran gradientes, sombras,
  temperaturas y backdrop computados distintos; los estados animan propiedades reales,
  la semántica permanece igual y las fichas prerenderizan por SSG.

## Bugs / obstáculos y cómo se resolvieron

1. **`npm ci` inicial falló con `ENOSPC`.** Quedaban 22 MB libres por instalaciones y
   builds repetidos en worktrees históricas ya mergeadas. Se eliminaron únicamente
   `node_modules` y `.next` regenerables de tres worktrees inactivas y la instalación
   parcial actual; no se tocó código ni la worktree de Claude. El segundo `npm ci` terminó.
2. **El primer color de enlace glass midió 4.33:1.** El shell más translúcido reducía su
   contraste sobre negro. Se oscureció sólo `--mq-crumb-link`; la misma prueba quedó en
   4.80:1.
3. **Las primeras superficies activas de Pagination no separaban 4.5:1.** Clay daba 4.40 y
   glass 3.37 contra el shell. Se ajustaron únicamente el relleno actual y su velo; quedaron
   en 5.36 y 8.08. Skeuo recibió margen adicional y cerró en 4.98.
4. **La sonda de Pagination buscó páginas que la elipsis había retirado o cuyo nombre
   cambió al volverse actual.** Se usaron destinos visibles y una referencia estable por
   texto sólo después de validar el nombre accesible.
5. **Las duraciones extendidas contaminaron lecturas posteriores.** La sonda finaliza las
   animaciones del cambio de material antes de medir hover/press o estilos finales; no se
   cambió producción por un artefacto del harness.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes; 22 entradas generadas.
- Contrato TDD efímero — ✅ RED esperado y GREEN final.
- Contraste sRGB conservador — ✅ Breadcrumb mínimo 4.80:1; Pagination 4.98:1.
- ESLint dirigido — ✅ UI y entries sin errores ni warnings.
- `npm run typecheck` — ✅ `next typegen` + TypeScript estricto.
- `npm run test:studio` — ✅ suite estructural verde.
- `npm run test:registry` — ✅ `{"components":22,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 29 páginas; Breadcrumb y Pagination incluidas en SSG.
- `npm run check` — ✅ exit 0.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades high/critical; permanecen dos
  moderadas preexistentes.
- Playwright CLI + Chrome del sistema — ✅ materiales, capturas visuales, WAAPI, teclado,
  límites disabled, ARIA, reduced-motion, forced-colors y cero errores de consola/runtime.

## Riesgos, deuda y pendientes

- Glass gana más refracción sobre contenido visible; su tinte propio y ratios conservadores
  mantienen legibilidad incluso sobre negro o blanco planos.
- Las sombras/gradientes son CSS estándar, pero el rasterizado puede variar levemente entre
  motores. Forced-colors y fallbacks literales mantienen un resultado funcional.
- El preview muestra un material a la vez. Sus selectores cubren todo el espacio y no
  justificaron ampliar el alcance ni tocar infraestructura compartida.

## Estado final

Completo. Breadcrumb y Pagination alcanzan el estándar táctil aprobado, demuestran su
movimiento con transiciones CSS reales y conservan estructura, teclado, contraste y
self-containment.
