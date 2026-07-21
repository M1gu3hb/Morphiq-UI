# Reporte 0008 — Smoke E2E de producción

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `chore/e2e-smoke` · **Commit final:** ver PR (commit `chore: add production E2E smoke`)
- **Tipo:** chore
- **Prompt recibido:** Fase 1, Ronda 4. Añadir un smoke permanente con Playwright que levante el build real, recorra todas las rutas públicas y falle ante errores de navegador o runtime.

## Objetivo

Cubrir el hueco entre los verificadores estructurales y la aplicación ejecutándose de
verdad. El smoke debía validar las siete rutas públicas en un navegador real contra
`next build` + `next start`, sin convertir E2E en parte del gate local rápido.

## Qué se hizo

- `tests/smoke.spec.ts` — siete pruebas: `/`, `/components`, las fichas de Button, Card y
  Toggle, `/library` y `/studio`.
- `playwright.config.ts` — servidor de producción en `127.0.0.1:4173`, un único proyecto
  Chromium, un worker, timeouts explícitos, cero reintentos local y uno en CI, trazas y
  capturas solo ante fallo.
- `package.json` y `package-lock.json` — `@playwright/test@^1.61.1` como devDependency y
  script separado `test:e2e`.
- `.gitignore` — ignora `test-results/` y `playwright-report/`.
- `.github/workflows/quality.yml` — job `e2e` independiente; el job `validate` quedó
  intacto.
- `docs/reports/0008-e2e-smoke.md` — este reporte.

No se modificó ningún archivo bajo `src/`, ni `scripts/verify-studio.mjs`, ni
`scripts/verify-registry.mjs`.

## Cómo se hizo

**Servidor real.** `webServer` ejecuta
`npm run build && npm run start -- --hostname 127.0.0.1 --port 4173`, espera una respuesta
en la URL base y tiene un timeout de 180 segundos. No reutiliza servidores existentes, de
modo que el resultado siempre corresponde al build de la rama probada.

**Navegador preinstalado.** Durante `npm ci`/`npm install` local se estableció
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. El config resuelve primero
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` y en Windows encuentra Chrome/Edge del sistema; esta
ejecución usó `C:\Program Files\Google\Chrome\Application\chrome.exe`, versión
`150.0.7871.125`. En CI Linux el config no fuerza un ejecutable del sistema: el job instala
Chromium con `npx playwright install --with-deps chromium` y Playwright usa ese binario.

**Contrato del smoke.** Cada prueba registra listeners de `console` y `pageerror` antes de
`page.goto`, exige respuesta HTTP 200, espera una ancla visible y `networkidle`, y al final
exige que ambos arreglos de errores estén vacíos. Las páginas de contenido usan su `h1`;
Studio usa `.v5-topbar`. Las fichas exigen además el nombre bilingüe del componente, la
etiqueta bilingüe de “Real source” y un `pre code` visible y no vacío. No hay snapshots,
coordenadas ni asserts de estilo/píxel.

**E2E fuera de `check`.** El smoke reconstruye la app, inicia un servidor y abre un
navegador; en la última ejecución tardó 35.8 segundos además del gate estructural. Por eso
`check` conserva lint + tipos + suites estructurales + build, mientras `test:e2e` es un
comando explícito y un job de CI separado que puede fallar/reportar independientemente.

**TDD.** La especificación se escribió antes del config. El primer recorrido de landing
falló con `Cannot navigate to invalid URL`, porque todavía no existían `baseURL` ni
`webServer`. Después de añadir la configuración, las siete rutas pasaron.

## Resultado esperado vs. real

- **Esperado:** siete rutas con HTTP 200, ancla visible y cero errores de consola/runtime;
  fichas con nombre y fuente real.
- **Real:** 7/7 pruebas verdes. Las fichas Button/Card/Toggle mostraron nombre y código;
  landing, catálogo, biblioteca y Studio hidrataron sin `console.error` ni `pageerror`.
- **CI:** se añadió un job separado que reproduce instalación, navegador y smoke sin
  alterar `validate`.

## Bugs / obstáculos y cómo se resolvieron

1. **Toggle aún no estaba en `main` al inicio.** PR #5 ya estaba auditado y aprobado; se
   marcó listo de forma idempotente, se mergeó con `gh pr merge 5 --merge --delete-branch`
   y se creó la rama desde el merge `9b2783f`.
2. **El guardarraíl no enumeraba `package-lock.json`.** Instalar una devDependency sin
   actualizar el lock rompe el `npm ci` que usa CI. Se incluyó únicamente el cambio
   generado por npm para `@playwright/test`/`playwright` y se verificó con un segundo
   `npm ci` limpio.
3. **Avisos `NO_COLOR`/`FORCE_COLOR` en la terminal Codex.** Son warnings del manejo de
   color de los procesos Node lanzados por el entorno, no mensajes del contexto del
   navegador. Los listeners de la página siguieron en cero y el proceso terminó con exit
   code 0.

## Verificación (gate)

- `npm ci` — ✅ antes y después del cambio; 457 paquetes desde el lock actualizado.
- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios, incluyendo config y spec.
- `npm run test:studio` — ✅ `{"templates":5,...,"status":"ok"}`.
- `npm run test:registry` — ✅ 3 componentes, autocontención y guards en `ok`.
- `npm run build` — ✅ 10 páginas; Button/Card/Toggle prerenderizados como SSG.
- `npm run check` — ✅ exit code 0; no incluye E2E.
- `npm run test:e2e` — ✅ 7 passed, exit code 0, 35.8 s contra producción.
- `npm audit --audit-level=high` — ✅ sin vulnerabilidades altas; permanecen 2 moderadas
  transitivas de PostCSS ya conocidas.

## Riesgos, deuda y pendientes

- Es smoke estructural, no regresión visual: no detecta contraste, solapamientos ni cambios
  de píxel si la página sigue renderizando.
- Solo cubre Chromium de escritorio. Safari/WebKit, Firefox y viewports móviles quedan para
  una suite posterior si el costo de CI lo justifica.
- `networkidle` cubre la hidratación normal, pero un error disparado por un temporizador muy
  tardío podría ocurrir después de la aserción.
- El puerto fijo 4173 fallará de forma explícita si otro proceso lo ocupa; no se reutiliza
  un servidor para evitar probar accidentalmente otro build.
- CI permite un reintento para absorber fallos de infraestructura. Un test que solo pase en
  el retry debe investigarse; no debe normalizarse como verde confiable.
- El reporte HTML y las trazas se generan/retienen localmente ante fallo, pero el workflow
  todavía no los sube como artifacts de GitHub.

## Estado final

Completo. Smoke E2E permanente, ejecución local 7/7, gate estructural verde y job E2E
separado preparado para CI.
