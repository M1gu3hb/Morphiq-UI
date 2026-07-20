# Auditoría funcional de Morphiq Studio v5

Checkpoint base auditado: `feat/studio-v3` en `b53efa63e59316ee2f79a2fcea5add2695ced441`, tree `c4ef1126a04fd0cad9558ff82626b7a8eb3c4216`. El commit local, la rama remota y el tree coincidían; no existían cambios locales al iniciar. `main` no se modificó.

## Línea base

- `npm ci`: correcto con Node 24.16.0 y npm 11.13.0.
- ESLint y TypeScript: correctos.
- La suite Studio inicial falló en Windows con `spawnSync .../node_modules/.bin/tsc ENOENT`; el script invocaba directamente el shim POSIX de `tsc`.
- `npm audit --omit=dev`: dos findings moderados por PostCSS `<8.5.10`, transitivo de Next 16.2.10. npm sólo propone `--force` hacia Next 9.3.3, un downgrade rompedor; no se aplicó. Las reglas del checkpoint también prohíben usar canary para ocultar advisories.
- Auditoría de navegador: Playwright real contra el servidor local, vistas 1600×1000, 1440×960, 820×1180 y 390×844, además de revisión visual de landing, biblioteca, catálogo, cinco plantillas y consola.

## Matriz de auditoría

| Función | Archivo responsable | Prueba realizada | Resultado | Bug encontrado | Corrección | Regresión añadida | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Arranque y rutas | `src/app/**` | HTTP y navegación real en `/`, `/studio`, `/library`, `/components` | 200, sin errores | No | — | Smoke estructural y navegador | Correcto |
| Español/inglés | `client-locale.ts`, páginas y componentes | Cambio ES/EN, navegación a Studio y comprobación de `lang` y etiquetas | Correcto | No | — | Browser audit bilingüe | Correcto |
| Cinco plantillas | `studio-templates.ts` | Apertura mediante picker y URL; conteo y render visual | 5/5 | No | — | Suite exige cinco documentos y capas clave | Correcto |
| Todas las primitivas | `studio-model.ts`, `studio-shell.tsx` | Creación real de 18 herramientas expuestas; suite crea 20 `NodeKind` | Correcto | No | — | Conteo de tipos y creación browser | Correcto |
| Selección y multiselección | `studio-shell.tsx`, `studio-layers.tsx` | Click, Ctrl, selección por árbol, habilitación de acciones | Correcto | La selección repetida recreaba estado durante gestos | Selección simple idempotente | Aserción de selección estable | Correcto |
| Drag del canvas | `studio-node.tsx`, `studio-shell.tsx` | Gesto real sobre nodo, X `170→280`, undo `280→170` | Falló inicialmente | El `pointerdown` del nodo no llegaba de forma fiable al controlador | El modo edición deja propagar el inicio; Preview conserva captura | Aserción de propagación + browser drag/undo | Correcto |
| Resize del canvas | `studio-shell.tsx`, `globals.css` | Tirador real derecho, W `205→240` y cambio CSS | Falló inicialmente | El artboard deseleccionaba al pulsar el tirador; el blanco se reemplazaba antes de `mousedown` | Tirador estable, handles sobre hijos, artboard reconoce `.v5-rnd-node`, escala de zoom para `react-rnd` | Cuatro contratos de gestos + browser resize | Correcto |
| Rotación, skew, pivote y 3D | `studio-inspector.tsx`, `studio-node.tsx` | Rotate Z por inspector, undo; pivotes opuestos y tracks 3D double-door | Correcto | No | — | Puertas exigen pivotes 0/100 y tracks coordinados | Correcto |
| Reparentado y anidación | `studio-layers.tsx`, `studio-shell.tsx` | Drag de Rectangle a Frame: raíces `3→2`; undo `2→3` | Correcto | No | — | Integridad padre/hijo y ciclos en suite | Correcto |
| Agrupar/desagrupar | `studio-shell.tsx` | Browser: capas `8→9→8`; undo/redo adicional | Correcto | No | — | Suite de jerarquía + browser | Correcto |
| Duplicar/renombrar/lock/hide/orden | `studio-shell.tsx`, `studio-layers.tsx` | Duplicado jerárquico `25→28`, rename, hide/show, lock/unlock | Correcto | No | — | Browser audit | Correcto |
| Booleanos y máscaras | `studio-shell.tsx`, `studio-node.tsx` | Union y mask reales: `8→9`, seguidos de undo | Correcto | No | — | Suite valida nodos boolean y paths SVG | Correcto |
| Vectores/Bézier/clip | `studio-node.tsx`, `studio-model.ts` | Inspección de handles y suite de puntos, handles, clip paths y exportación animada | Correcto | No | — | Tracks de vector/clip y compilación TSX | Correcto |
| Materiales y filtros | `studio-inspector.tsx`, `studio-model.ts` | Panel Material con 93 controles sobre botón; construcción de 8 paints y 8 effects | Correcto | No | — | Conteo exhaustivo de paints/effects | Correcto |
| Layout/constraints | `studio-inspector.tsx`, `studio-shell.tsx` | Panel Layout real, overrides, resolución y CSS generado | Correcto | No | — | Instancia+responsive y variante+constraint en suite | Correcto |
| Breakpoints del documento | `studio-shell.tsx`, `studio-model.ts` | Desktop `960×620`, tablet `720×900`, mobile `390×760` | Correcto | No | — | Browser audit | Correcto |
| Responsive de Studio | `globals.css` | `body.scrollWidth`: 1440/1440, 820/820 y 390/390 | Falló en móvil: 760/390 | `min-width:760px` desbordaba el documento | Topbar compacta y workspace con scroll interno a ≤700 px | Contrato CSS + browser en 390 px | Correcto |
| Componentes e instancias | `studio-model.ts`, `studio-shell.tsx` | Creación/sincronización, altas/bajas de hijos, propiedades heredadas y overrides | Correcto | No nuevo | — | Suite sincroniza jerarquía y limpia clones obsoletos | Correcto |
| Responsive/motion de instancias | `studio-model.ts`, `studio-motion.ts`, `studio-export.ts` | Instancia+responsive, motion heredado y motion local ganador | Correcto | No nuevo | — | Regresiones de precedencia y CSS exportado | Correcto |
| Variables y bindings | `studio-inspector.tsx`, `studio-motion.ts` | Panel real; interpolación `0→50`; binding y tipos normalizados | Correcto | No | — | Track `variable.value` | Correcto |
| Variantes y estados | `studio-inspector.tsx`, `studio-model.ts` | Panel real, estados de puerta y orden de resolución | Correcto | No | — | Variantes de fuente/instancia y responsive | Correcto |
| Interacciones anidadas | `studio-node.tsx`, `studio-shell.tsx` | Preview double-door y click sobre hijo del frame | Falló inicialmente | Todos los hijos detenían click aunque no tuvieran interacción; el padre nunca recibía el trigger | `onTrigger` informa si gestionó el evento; sólo entonces detiene propagación | Contrato de bubbling + browser double-door | Correcto |
| Smart Transition double-door | `studio-templates.ts`, `studio-shell.tsx` | Transform de hoja cambió de identidad a matrix3d en Preview | Correcto tras fix | Derivado del bug anterior | Misma corrección | Browser matrix transform | Correcto |
| Timeline y playback | `studio-timeline.tsx`, `studio-motion.ts` | Play/pause, playhead `>0`, tracks visibles, work area, reverse/stretch/stagger | Correcto | No | — | Interpolación, reverse, markers y alternate | Correcto |
| Auto-key e historial | `studio-shell.tsx`, `studio-motion.ts` | Upsert/bloqueo de propiedad animada, agrupación de historial y undo | Correcto | No | — | Mensaje de bloqueo y suite estructural | Correcto |
| Guardado y recarga | `studio-shell.tsx` | Nombre cambiado, Save, lectura JSON, reload y espera de hidratación | Correcto | Falso positivo inicial por leer antes del efecto de montaje | Se corrigió el arnés, no producto | Browser save/reload | Correcto |
| Importación/migración | `studio-model.ts`, `studio-shell.tsx` | Normalización v4/v5, ciclos reparables, IDs duplicados y colecciones malformadas | Correcto | No | — | Suite de normalización y seguridad de rutas | Correcto |
| React/CSS | `studio-export.ts` | Generación de cinco plantillas, parse TSX y compilación estricta | Correcto | No | — | Compilación de outputs | Correcto |
| HTML/SVG | `studio-export.ts` | Export real en diálogo; doctype, sin JSX, SVG con `foreignObject` | Correcto | No | — | Suite por plantilla | Correcto |
| JSON/handoff IA | `studio-export.ts` | Export real; JSON parseable y handoff contiene TSX/CSS | Correcto | No | — | Suite por plantilla | Correcto |
| Accesibilidad y teclado | `studio-inspector.tsx`, `studio-node.tsx`, exportador | Panel real, roles/ARIA/tabIndex, controles nativos, reduced motion y navegación por tabs | Correcto | No | — | Compilación y checks de salida | Correcto |
| Ayuda contextual | `studio-help.tsx` | 124 botones visibles a través de barras, assets, timeline y seis inspectores | 124/124 | No | — | Cada diálogo exigió título, explicación y pasos | Correcto |
| Ejemplos animados de ayuda | `studio-help.tsx`, `globals.css` | Cada uno de los 124 diálogos exigió sección y `.v5-help-demo` | 124/124 | No | — | Browser audit | Correcto |
| Consola/hydration | Aplicación completa | Tres barridos Playwright y capturas visuales | Sin `console.error` ni `pageerror` | No | — | Browser audits | Correcto |
| Suite en Windows | `scripts/verify-studio.mjs` | `npm run test:studio` desde PowerShell | Falló inicialmente | Invocación del shim POSIX `.bin/tsc` | Ejecutar `typescript/bin/tsc` con `process.execPath` | La propia suite pasa en Windows | Correcto |

## Evidencia resumida de navegador

- Auditoría funcional principal: 30 comprobaciones, todas correctas; rutas, idiomas, plantillas, 18 primitivas, multiselección, group/undo/redo, rename, duplicate, breakpoints, persistencia, seis exportaciones, double-door, timeline, desktop/tablet/mobile y consola.
- Auditoría profunda: 21 comprobaciones, todas correctas; drag/undo, resize, rotación/undo, seis inspectores, reparent/undo, union, mask, group/ungroup, hide/show, lock/unlock y consola.
- Ayuda contextual: 124/124 diálogos con explicación y ejemplo animado.
- Revisión visual: landing desktop/mobile, biblioteca desktop/mobile, catálogo y las cinco plantillas de Studio. No se observó clipping del documento, desbordamiento del `body` ni error visual bloqueante. En móvil, los tres paneles completos se conservan mediante desplazamiento horizontal dentro del editor en vez de eliminar herramientas.

## Límites y riesgos conocidos

- La suite versionada es fuerte en invariantes y código generado, pero no incluye Playwright como dependencia del repositorio; los barridos de navegador de este checkpoint fueron temporales y se eliminaron antes del commit. Incorporar un smoke E2E permanente sería el siguiente endurecimiento razonable.
- `studio-shell.tsx` sigue concentrando coordinación, comandos e interacción. Separar comandos/reducer ayudaría, pero hacerlo en este checkpoint ampliaría el riesgo sin necesidad funcional.
- El historial usa snapshots completos y las imágenes se guardan como data URL en `localStorage`; documentos muy grandes pueden presionar memoria/cuota.
- HTML y SVG son snapshots visuales; React/CSS es la salida interactiva y JSON la salida editable sin pérdida.
- Permanecen dos advisories moderados transitivos de PostCSS. No existe una actualización estable y no rompedora propuesta por npm para este árbol; no se silenció ni se forzó un downgrade.
- Persistencia remota, colaboración, autenticación, pagos, marketplace y Supabase siguen deliberadamente fuera de alcance.

## Gate de publicación

Antes del commit y del único Preview final deben pasar, sin omisiones: `npm run lint`, `npm run typecheck`, `npm run test:studio`, `npm run build`, `npm run check`, `git diff --check`; el audit debe quedar documentado con su excepción moderada conocida y el build de producción debe responder 200 en las cinco URLs requeridas.
