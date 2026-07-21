# Reporte 0010 — Cobertura de transiciones de componentes

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `fix/transition-coverage` · **Commit final:** ver PR (commit `fix: complete component transition coverage`)
- **Tipo:** fix
- **Prompt recibido:** Fase 1, Ronda 5. Auditar Button, Card y Toggle para que cada propiedad visual que cambia por estado esté incluida en la transición del mismo elemento, y probarlo con `getAnimations()`.

## Objetivo

Cerrar los saltos visuales causados por listas `transition-[…]` incompletas en los tres
componentes de producción. La corrección debía conservar diseño, colores y tiempos, evitar
propiedades fantasma y demostrar la cobertura en Chromium sin depender de muestrear un
instante intermedio de la animación.

## Qué se hizo

- `src/registry/ui/button.tsx` — se añadieron `filter` y `opacity` a la lista existente.
  `filter` cubre `hover:brightness-[1.08]` del material skeuo (y `brightness-100` del
  ghost); `opacity` cubre `data-[state=disabled]:opacity-55`.
- `src/registry/ui/card.tsx` — se añadió `opacity` para
  `data-[state=disabled]:opacity-55`.
- `src/registry/ui/toggle.tsx` — el botón raíz recibió `transition-opacity` para su
  `disabled:opacity-55`; el thumb añadió `border-color`, porque el material adaptive en
  modo oscuro cambia `--mq-thumb-brd` al entrar en `data-state=checked`.
- `docs/reports/0010-transition-coverage.md` — este reporte.

Ninguno de los tres componentes estaba completamente cubierto. No se cambiaron recetas,
colores, sombras, desplazamientos ni duraciones existentes. El nuevo fade del Toggle usa
los mismos `200ms ease-out` que su track y su thumb, y respeta `motion-reduce`.

## Cómo se hizo

**Inventario estático.** Se revisaron por elemento todos los modificadores `hover:`,
`active:`, `focus-visible:`, `disabled:`, `data-[state=…]:` y variantes oscuras. La
correspondencia aplicada fue: `translate-*` → `translate`; `shadow-*` → `box-shadow`;
`bg-*` → `background-color`; `backdrop-*` → `backdrop-filter`; `brightness-*` →
`filter`; `opacity-*` → `opacity`; y el borde del thumb → `border-color`.

Los outlines de foco se conservaron instantáneos: son feedback de accesibilidad, no una
propiedad que el componente pretendiera animar. También se excluyeron cursores, variables
geométricas por tamaño y el cambio de SVG del Toggle, porque no son transiciones visuales
interpolables del mismo elemento.

**Reproducción roja.** Contra el build base, un script Playwright abrió las fichas reales,
forzó cada estado y leyó `element.getAnimations()`. El resultado falló exactamente en cinco
casos: Button/filter, Button/opacity, Card/opacity, Toggle/opacity y
Toggle/border-color. Las listas calculadas tampoco contenían esas propiedades.

**Prueba independiente del reloj.** Para evitar depender de `requestAnimationFrame` o de
una captura a mitad de los 150–200ms, cada escenario se aisló, se amplió temporalmente la
duración desde el navegador (sin modificar fuentes), se forzó el estado y se filtraron los
objetos cuyo constructor era `CSSTransition`. La comprobación final dio:

| Componente / estado real | Propiedad que cambia | `CSSTransition.transitionProperty` observado |
| --- | --- | --- |
| Button clay / hover | `translate`, `box-shadow` | `translate`, `box-shadow` |
| Button glass / hover | `translate`, `box-shadow`, `backdrop-filter` | `translate`, `box-shadow`, `backdrop-filter` |
| Button skeuo / hover | `translate`, `filter` | `translate`, `filter` |
| Button adaptive / hover | `box-shadow` | `box-shadow` |
| Button ghost / hover | `translate`, `background-color` | `translate`, `background-color` |
| Button / disabled | `opacity` | `opacity` |
| Card interactive / hover | `translate` | `translate` |
| Card / disabled | `opacity` | `opacity` |
| Toggle / disabled | `opacity` | `opacity` |
| Toggle / checked, track | `background-color` | `background-color` |
| Toggle / checked, thumb | `translate` | `translate` |
| Toggle labeled / checked, ambas leyendas | `opacity` | `opacity` en ambas |
| Toggle adaptive oscuro / checked, thumb | `translate`, `background-color`, `border-color` | `translate`, `background-color`, `border-top/right/bottom/left-color` |

Chromium expande el shorthand `border-color` en cuatro transiciones longhand; las cuatro
aparecieron. La matriz final terminó verde y la reproducción roja dejó de encontrar los
cinco huecos.

## Resultado esperado vs. real

- **Esperado:** cada propiedad de estado tiene cobertura precisa, sin `transform` fantasma
  ni un `transition-all` que anime propiedades accidentales.
- **Real:** los cinco huecos quedaron cubiertos; `getAnimations()` devolvió las
  `CSSTransition` correspondientes y mantuvo la cobertura previa de translate, sombras,
  fondos, backdrop y captions.
- **Alcance:** solo se tocaron los tres componentes autorizados y este reporte. La plomería
  del registry, scripts, package, app, previews y tests quedaron intactos.

## Bugs / obstáculos y cómo se resolvieron

1. **PR #7 ya estaba mergeado pero el borrado local de su rama devolvió error.** GitHub
   confirmó `MERGED`; `git pull` dejó `main` en el merge `52bbab7` con Button, Card, Toggle
   y el smoke E2E presentes. La rama de trabajo se creó desde ese commit.
2. **El muestreo temporal no era confiable.** Se sustituyó por inspección de
   `CSSTransition` con `getAnimations()` y escenarios aislados.
3. **`border-color` aparece como cuatro nombres.** No es duplicación de clases: Chromium
   expande el shorthand a sus cuatro lados. La aserción exigió los longhands observados.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes instalados desde lock, sin descargar navegadores.
- `npm run lint` — ✅ sin errores después de cada cambio.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios después de cada cambio.
- `npm run test:studio` — ✅ incluido en `npm run check`.
- `npm run test:registry` — ✅ incluido en `npm run check`; 3 componentes, guards en `ok`.
- `npm run build` — ✅ 10 páginas; Button, Card y Toggle prerenderizados.
- `npm run check` — ✅ exit code 0.
- Matriz Playwright `getAnimations()` — ✅ todos los escenarios de la tabla presentes.
- `npm run test:e2e` — ✅ 7 rutas públicas contra build de producción.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; quedan 2 moderadas ya conocidas.

## Riesgos, deuda y pendientes

- La verificación dinámica se ejecutó en Chromium de escritorio. Otros motores pueden
  exponer los shorthands con nombres distintos, aunque la lista CSS es estándar.
- `prefers-reduced-motion` elimina las transiciones a propósito; la matriz se ejecutó con
  `no-preference` y confirmó que la ruta reducida sigue declarando `transition-none`.
- Algunas recetas `active` cambian la cantidad o la posición `inset` de capas de sombra.
  Aunque `box-shadow` está correctamente declarado y sí produce `CSSTransition` en los
  hovers compatibles, Chromium puede tratar un par de listas con topología incompatible
  como no interpolable. Normalizar esas sombras cambiaría valores de diseño y quedó fuera
  del guardarraíl de esta ronda.
- La matriz `getAnimations()` fue una prueba de diagnóstico efímera y no se añadió a
  `tests/**`, porque ese directorio estaba fuera del guardarraíl. Si se quiere prevenir esta
  clase de regresión automáticamente, conviene convertirla en una suite permanente en una
  ronda dedicada.

## Estado final

Completo. Los cinco huecos de `transition-property` de Button, Card y Toggle quedaron
cubiertos con cambios mínimos y la matriz de navegador terminó verde.
