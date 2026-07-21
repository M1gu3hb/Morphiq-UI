# Reporte 0024 — Breadcrumb y Pagination

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `feat/breadcrumb-pagination` · **Commit final:** ver PR (commit `feat: add Breadcrumb and Pagination components`)
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 12. Añadir Breadcrumb y Pagination como dos componentes de navegación autocontenidos, accesibles y sin dependencias nuevas, en un único PR y reporte.

## Objetivo

Incorporar dos controles de navegación de producción con semántica HTML nativa, cuatro
materiales, dos variantes y tres tamaños cada uno. Breadcrumb debía representar la jerarquía
y su colapso sin contaminar nombres accesibles; Pagination debía comunicar página actual,
rangos largos y límites sin depender solo del color.

## Qué se hizo

### Breadcrumb

- `src/registry/ui/breadcrumb.tsx` — ruta de datos con `nav > ol > li`, enlaces
  intermedios, página actual no interactiva, separador decorativo y colapso opcional.
- `src/registry/previews/breadcrumb-preview.tsx` — ruta completa de cuatro niveles y
  segunda ruta de seis niveles colapsada a cuatro posiciones.
- `src/registry/entries/breadcrumb.ts` — entrada `navigation`, dependencias exactas y
  contrato bilingüe de accesibilidad.

### Pagination

- `src/registry/ui/pagination.tsx` — paginación controlada con botones nativos, cálculo de
  cinco destinos para rangos largos, elipsis y límites anterior/siguiente.
- `src/registry/previews/pagination-preview.tsx` — ejemplo interactivo de diez páginas,
  actual en cuatro y cobertura de materiales, variantes, tamaños y estados.
- `src/registry/entries/pagination.ts` — entrada `navigation`, dependencias exactas y
  contrato bilingüe de accesibilidad.

`docs/reports/0024-breadcrumb-y-pagination.md` es este reporte. No se editó `package.json`,
schema, índices, scripts, app, globals, tests ni ningún componente existente; el índice
regenerado por los hooks permanece gitignorado.

## Cómo se hizo

### Breadcrumb — semántica y colapso

La API recibe `items` intermedios —cada uno con `id`, `href` y `label`— y un `current`
separado. Esa división impide que la página actual se convierta accidentalmente en enlace:
el DOM final es un `<nav aria-label="Breadcrumb">`, un único `<ol>`, un `<li>` por nivel,
anchors en todos los intermedios y un `<span aria-current="page">` al final.

`BreadcrumbSeparator` está dentro del `li` anterior y siempre lleva `aria-hidden="true"`;
por eso `/` no entra al nombre accesible del enlace. El preview produjo exactamente los
nombres `Home`, `Components` y `Navigation`, sin separadores añadidos.

`maxItems` activa el colapso solo cuando el total lo supera y nunca baja de tres posiciones.
Con seis niveles y `maxItems={4}` conservó el primero y los dos finales, sustituyó tres
niveles centrales por `…` y expuso el texto accesible “3 hidden breadcrumb levels”. La
elipsis es informativa y no interactiva; si una aplicación necesita abrir los destinos
ocultos debe reemplazarla por un menú real, tal como documenta la entrada. El ejemplo
principal no colapsa y muestra sus cuatro niveles completos.

Los enlaces mantienen subrayado, hover y anillo `:focus-visible`. La página actual se
distingue por peso y borde inferior, no por color. El estado `focus` del preview usa el
mismo selector `data-focus` de la receta, sin duplicar estilos.

### Pagination — estructura, rango y límites

Pagination es controlado mediante `page`, `pageCount` y `onPageChange`; sanea valores no
finitos y limita la página al rango válido antes de renderizar. El DOM es
`<nav aria-label="Pagination"> > <ul> > <li>` y todos los controles son
`<button type="button">`. Tab, Enter y Espacio son comportamiento del navegador, no una
máquina de teclado reimplementada.

Para más de siete páginas, `getPaginationItems` muestra siempre cinco destinos numerados:

- cerca del inicio: páginas 1–4, elipsis y última;
- en el centro: primera, elipsis, anterior/actual/siguiente, elipsis y última;
- cerca del final: primera, elipsis y las últimas cuatro.

En el preview de diez páginas con actual 4, el árbol tuvo cinco botones numerados
`1, 3, 4, 5, 10`, dos elipsis decorativas y los controles Anterior/Siguiente. La página 4
usa `aria-current="page"`, relleno, peso 900 y subrayado persistente. Los SVG de flecha y
las elipsis son `aria-hidden`; los controles conservan nombres textuales “Previous page” y
“Next page”.

Anterior es `disabled` nativo en página 1 y no cambió el valor al recibir Enter. Siguiente
queda `disabled` en página 10. Un botón de página respondió a Enter y otro a Espacio, ambos
actualizando `aria-current`.

### Contraste por material

Los ratios se calcularon con luminancia relativa sRGB. Para superficies glass translúcidas
se compuso también sobre negro y se conserva el peor resultado; adaptive se midió en ambos
esquemas.

| Material | Breadcrumb: enlace / superficie, peor variante | Pagination: texto activo / relleno | Pagination: borde activo / superficie |
| --- | ---: | ---: | ---: |
| clay | 8.34:1 | 9.63:1 | 7.44:1 |
| glass, peor backdrop | **5.74:1** | **7.48:1** | **5.74:1** |
| skeuo | 6.32:1 | 9.71:1 | 6.32:1 |
| adaptive, peor esquema | 10.07:1 | 16.06:1 | 11.67:1 |

El mínimo de texto supera 4.5:1 y el borde activo supera 3:1. Los separadores de Breadcrumb
son decorativos, pero usan un token visible y desaparecen del árbol accesible.

### Cobertura de transición

Ningún elemento usa translate, rotate, filter ni una lista genérica. Chrome consultó
`getAnimations()` inmediatamente después de cada cambio de estado:

| Componente / estado | `CSSTransition` observadas | No observado |
| --- | --- | --- |
| Breadcrumb hover | `background-color`, `color` | ninguna propiedad extra |
| Breadcrumb focus | ninguna; outline instantáneo | cero transiciones fantasma |
| Pagination hover | `background-color`, cuatro longhands de `border-color`, `box-shadow` | `color` no cambia en hover |
| Pagination página actual | `background-color`, `color`, cuatro longhands de `border-color` | `box-shadow` no cambia al seleccionar |
| Pagination focus | ninguna; outline instantáneo | cero transiciones fantasma |

La lista declarada de Pagination incluye las cuatro propiedades porque todas cambian en al
menos uno de sus estados hover/current. WAAPI expone `border-color` como
`border-top/right/bottom/left-color`, que se validaron individualmente. En
`prefers-reduced-motion: reduce`, ambos controles computaron `transition-property: none`.

### Forced-colors y self-containment

Breadcrumb mapea superficie/borde a `Canvas`/`CanvasText`, enlaces a `LinkText`, anillo e
indicador actual a `Highlight` y elimina sombra. Chrome computó link azul de sistema,
borde actual Highlight y `box-shadow: none`.

Pagination usa `ButtonFace`/`ButtonText`, `GrayText` para disabled y un outline Highlight
interior de 2 px para la página actual. El subrayado/peso permanece como segundo canal. El
root perdió su sombra en alto contraste.

Todos los tokens viven como variables locales `--mq-crumb-*` o `--mq-page-*`; cada `var()`
tiene fallback literal. No se consumen variables `:root`, clases del chrome del sitio ni
estilos globales. Los manifests coinciden con los imports: CVA y `cn.ts`, con
`clsx`/`tailwind-merge` declarados por la dependencia interna; no se añadió ningún paquete.

### TDD, revisión React y navegador real

El contrato efímero comenzó en rojo por la ausencia de los seis archivos y pasó después de
crearlos. Un segundo RED/GREEN corrigió la cifra conservadora de contraste de Breadcrumb y
un tercero probó que Pagination carecía de indicador Highlight en forced-colors antes de
añadir el outline. No se persistieron tests porque `tests/**` estaba fuera del guardarraíl.

La revisión React confirmó exports nombrados, props colocadas junto a cada componente,
claves estables, un solo estado local en el specimen interactivo, ausencia de effects/memos
innecesarios y HTML semántico antes que ARIA.

Playwright CLI manejó Chrome del sistema contra `next start`. Ambas rutas respondieron 200,
renderizaron su encabezado y fuente real, cubrieron la matriz funcional descrita y
terminaron con cero `console.error` y cero `pageerror`.

## Resultado esperado vs. real

- **Esperado:** seis archivos propios bastan para registrar dos componentes sin cruzarse
  con Textarea/Skeleton.
- **Real:** codegen descubrió ambos slugs, `verify-registry` reportó 16 componentes
  autocontenidos y `/components/breadcrumb` y `/components/pagination` quedaron SSG dentro
  de 23 páginas.
- **Semántica real:** snapshots y roles confirmaron `nav/ol/li/a/current` para Breadcrumb y
  `nav/ul/li/button/current/disabled` para Pagination.

## Bugs / obstáculos y cómo se resolvieron

1. **`gh pr merge 21 --delete-branch` devolvió error local.** GitHub ya había mergeado el
   PR; solo falló borrar la rama porque su worktree seguía montada. Se verificó el merge
   commit remoto y no se borró ninguna worktree.
2. **El harness TDD perdió comillas en Windows.** `node -e` transformó un regex con
   comillas; se construyó el carácter con `String.fromCharCode(34)` y el contrato evaluó el
   código real.
3. **TypeScript rechazó `data-focus` dentro de un objeto.** El tipo estándar de props de
   anchor no admite ese `data-*` al construirse fuera de JSX. `linkProps` declaró esa clave
   explícita y lint/TypeScript quedaron limpios.
4. **La cifra inicial de Breadcrumb era demasiado alta.** El cálculo conservador midió
   5.74:1 para glass; un RED exigió la cifra real y se corrigieron ambos textos.
5. **Pagination mostraba seis páginas cerca del borde.** El snapshot contradijo la regla de
   cinco destinos; se ajustaron los umbrales y el DOM final quedó en cinco.
6. **WAAPI no devolvió el nombre abreviado `border-color`.** Chrome devolvió cuatro
   longhands, todos `CSSTransition`; la sonda reconoce esa representación estándar.
7. **Foco programático no siempre activó `:focus-visible`.** Un ciclo real
   Tab/Shift+Tab confirmó el outline y cero animaciones; no se simuló modalidad de teclado.
8. **La página actual no retenía Highlight en forced-colors.** Un RED mostró outline
   ausente; se añadió un outline Highlight de 2 px y la misma sonda pasó.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes desde lock, sin descargar navegador.
- Contratos TDD efímeros — ✅ RED esperado y GREEN final.
- Cálculo de contraste — ✅ Breadcrumb ≥ 5.74:1; Pagination texto ≥ 7.48:1 y borde ≥ 5.74:1.
- `npm run lint` — ✅ sin warnings.
- `npm run typecheck` — ✅ codegen + `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":16,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 23 páginas; ambas rutas SSG.
- `npm run check` — ✅ exit code 0 antes del QA; se repite al cierre tras este reporte.
- Playwright CLI + Chrome del sistema — ✅ semántica, teclado, límites, materiales,
  variantes, tamaños, movimiento, forced-colors y cero errores runtime.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas/críticas; permanecen dos
  moderadas transitivas de PostCSS cuyo fix automático propone un downgrade incompatible.

## Riesgos, deuda y pendientes

- Breadcrumb usa una elipsis informativa, no un menú. Si el producto exige navegar
  directamente a niveles ocultos, debe componerse un disclosure/menu accesible en lugar de
  convertir el glifo en un control sin comportamiento.
- Pagination usa botones y estado controlado; aplicaciones cuya paginación sea una URL
  canónica pueden envolver la misma presentación en anchors en una futura variante, con
  `aria-disabled` y retirada del tab order en los límites.
- La validación interactiva se hizo en Chrome de escritorio; forced-colors y reduced-motion
  se emularon con Playwright.

## Estado final

Completo. Breadcrumb y Pagination quedan auto-descubiertos, autocontenidos, contrastados,
prerenderizados y validados en navegador; el gate integral reporta `components:16`.
