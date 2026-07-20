# Mapa técnico de Morphiq UI

Checkpoint auditado: rama `feat/studio-v3`, commit `b53efa63e59316ee2f79a2fcea5add2695ced441`, tree `c4ef1126a04fd0cad9558ff82626b7a8eb3c4216`.

## Estructura y rutas

- `src/app/` contiene el App Router de Next.js 16. `layout.tsx` carga fuentes, CSS global, metadatos y el bootstrap de idioma; `page.tsx` implementa la landing.
- `src/app/components/` sirve `/components` y delega el catálogo a `component-catalog.tsx`.
- `src/app/library/` sirve `/library` y delega exploración, personalización y descargas a `library-explorer.tsx` y `library-preview.tsx`.
- `src/app/studio/` sirve `/studio`; su página cliente obtiene el idioma y monta `StudioShell`.
- `src/components/studio/` contiene el editor: modelo, shell, lienzo, árbol de capas, inspector, timeline, ayuda, plantillas y exportadores.
- `src/lib/` contiene datos estáticos del catálogo/biblioteca y la capa mínima de internacionalización.
- `scripts/verify-studio.mjs` es la suite estructural y de regresión existente.
- `docs/` contiene especificación, decisiones de producto, operaciones y evidencia de auditoría.

Las cuatro rutas públicas son estáticas. No hay API routes, Server Actions, base de datos, autenticación ni backend en este checkpoint.

## Arranque, navegación e idioma

`src/app/layout.tsx` inicia `document.documentElement.lang` antes de hidratar, usando `morphiq-locale` o el idioma del navegador. `src/lib/client-locale.ts` expone `useLocale()` mediante `useSyncExternalStore` y `setClientLocale()`, que persiste y emite el evento `morphiq-locale-change`. Landing, catálogo, biblioteca y Studio reciben `Locale` y traducen cadenas con `tr()` de `src/lib/i18n.ts`. `site-header.tsx` y `locale-switch.tsx` proporcionan navegación y cambio manual.

## Fuente de verdad del Studio

`src/components/studio/studio-model.ts` define `StudioDocument` versión 5. El documento serializable contiene canvas, tokens, nodos, variantes, variables, interacciones, definiciones de componentes y timeline. Cada `StudioNode` contiene identidad, `parentId`/`childIds`, tipo, contenido, visibilidad/bloqueo, transformaciones 2D/3D, geometría, estilo, layout, overrides responsive, valor/estado, vínculo de instancia, bindings y accesibilidad.

La jerarquía es un grafo dirigido padre/hijo representado en ambos sentidos. `getRootNodes`, `getNodeChildren` y `getDescendantIds` lo recorren. `repairHierarchy` elimina padres inválidos, ciclos y referencias de hijos incoherentes al importar. `isContainer` limita la paternidad a frame, group y boolean. Las operaciones estructurales viven en `studio-shell.tsx` (`groupNodesInDocument`, añadir, borrar, duplicar, agrupar, desagrupar, enmascarar y reparentar) y mantienen ambas referencias.

## Estado global, selección e historial

`studio-shell.tsx` es el coordinador cliente. Mantiene el documento React, `past`/`future`, selección de nodos y keyframes, herramienta activa, variante, dispositivo, preview, playhead, paneles, guías y estado de interacción temporal. No usa un store externo.

`commit()` sincroniza instancias, evita commits idénticos, actualiza `updatedAt`, conserva hasta 100 snapshots y agrupa ediciones repetidas durante 700 ms. `undo()` y `redo()` intercambian snapshots completos y limpian selecciones que ya no existen. La selección normal reemplaza, Ctrl/Cmd alterna y Shift selecciona el rango según el orden lineal de `project.nodes`; los comandos de grupo/alineación validan el padre común.

## Persistencia, importación y migraciones

Guardar escribe el documento completo en `localStorage` bajo `morphiq-studio-v5`. Al montar, la URL `?template=` tiene prioridad; de lo contrario se intenta recuperar v5 y después la clave histórica v4. Importar JSON usa `normalizeStudioDocument()` y luego `synchronizeComponentInstances()` antes de aceptar el proyecto. JSON inválido no sustituye el documento actual.

`normalizeStudioDocument()` valida tipos de nodo e IDs, normaliza colecciones, números, enums y rutas de propiedades, repara jerarquía y elimina referencias inválidas a nodos, variables, componentes y tracks. Las rutas `__proto__`, `prototype` y `constructor` están bloqueadas. La migración v4 transforma el modelo plano anterior a nodos v5, estilos, canvas y materiales básicos; no inventa variantes, componentes o motion inexistentes.

## Canvas, geometría y vectores

`studio-shell.tsx` resuelve primero herencia de instancia, responsive, variante, bindings y patches de preview; solo en variante base aplica el timeline. `renderSceneNode()` recalcula constraints respecto del padre resuelto y usa `react-rnd` para posición/tamaño absoluto. Los hijos relativos se renderizan dentro del layout flex/grid del padre. Grid, reglas, guías arrastrables, snap y zoom son estado real del canvas.

`studio-node.tsx` convierte el nodo resuelto en DOM/CSS/SVG. Implementa primitivas, polígonos/estrellas, vectores Bézier, booleanos SVG, clip paths, pivote, transforms 3D, materiales, controles interactivos y handles directos. La Pluma acumula puntos en el shell y crea un nodo vectorial; el inspector y los handles modifican los mismos `vectorPoints`, `clipPoints` y pivotes del documento.

Los booleanos son no destructivos: el grupo conserva operandos como hijos y construye paths SVG para union, subtract, intersect o exclude. Las máscaras agrupan capas, ocultan la capa usada como máscara y guardan el contorno normalizado en el grupo.

## Materiales, rellenos y efectos

`studio-model.ts` define ocho pinturas (solid, linear, radial, conic, diamond, image, noise y pattern), ocho efectos (sombras, glows, blur de capa/fondo, noise y texture), filtros y modos de mezcla. `paintCss`, `nodeBackground`, `nodeBoxShadow`, `nodeFilter` y `nodeBackdropFilter` son la traducción común al canvas/exportación. `studio-inspector.tsx` mantiene pilas reordenables/duplicables, gradientes editables, imágenes, opacidad, stroke y filtros. `surfaceRecipes` aplica recetas Clay, Glass, Skeuomorphic y Adaptive sobre datos reales del nodo.

## Layout, responsive y constraints

`NodeLayout` admite free, horizontal, vertical y grid; padding independiente, gaps, wrapping, alineación, distribución, fixed/hug/fill, mínimos/máximos, posición absolute/relative y constraints start/center/end/stretch/scale. El inspector escribe layout base u overrides del breakpoint activo. `switchDevice()` fija desktop 960×620, tablet 720×900 o mobile 390×760. En el canvas, responsive se resuelve antes de variantes y constraints; `studio-export.ts` conserva ese orden en media queries para 840 px y 520 px.

## Componentes, instancias y propiedades expuestas

Una `ComponentDefinition` apunta a un root real y declara propiedades y variantes. Crear desde varias capas primero las agrupa. Instanciar clona toda la jerarquía y guarda `instanceSourceId` en cada clon; el root guarda `componentId` e `instanceOverrides`. `synchronizeComponentInstances()` vuelve a materializar cada jerarquía desde el componente principal, crea/elimina clones cuando cambia la fuente y limpia variantes, interacciones y tracks huérfanos.

La resolución del canvas y `materializeComponentInstances()` del exportador aplican el blueprint, conservan transform/responsive del root de instancia y luego aplican properties expuestas con override local. Las capas internas vinculadas bloquean cambios estructurales incoherentes; el usuario debe editar el principal o una propiedad expuesta. El valor `NodeKind = componentInstance` existe como primitiva posible, pero las instancias reales se representan mediante clones con `componentId`/`instanceSourceId`, no mediante un wrapper de ese tipo.

## Variables, variantes, estados e interacciones

Las variables tipadas (string, number, color, boolean) pueden enlazarse a rutas de nodo y animarse con tracks `variable.value`. Las variantes contienen `NodeOverride` por ID de nodo. El orden de resolución es blueprint → responsive → override de variante de fuente → override local de instancia → bindings → estado temporal de preview.

Las interacciones declaran source/variant, trigger, acción, condición, delay y transición. El inspector ofrece click, doble click, hover, focus, puntero, drag, swipe, scroll, teclado, load, delay y variable; las acciones cambian/togglean variante, mutan variable, controlan el timeline o abren una URL segura. `studio-shell.tsx` ejecuta este grafo solo en Preview. Smart Transition actualiza duración/easing/tipo y el canvas anima geometría/apariencia; instant y dissolve restringen la transición.

## Timeline y playback

`studio-motion.ts` crea tracks/keyframes, interpola números y colores, evalúa easing lineal/cúbico/Bézier/spring, aplica motion heredado y local, y soporta upsert, borrar, duplicar, mover, reverse, stretch y stagger. El track directo de instancia se aplica después del heredado y gana por propiedad.

`studio-timeline.tsx` contiene UI de tracks por capa/variable, selección múltiple, drag, teclado, copiar/pegar, duración, work area, marcadores, FPS 24/30/60, velocidad, loop, dirección, auto-key y editor de curva. `studio-shell.tsx` ejecuta playback con `requestAnimationFrame`, limitado por FPS y work area. Alternate sin loop recorre ida y vuelta; Preview puede cambiar la dirección en runtime.

## Exportación y handoff

`studio-export.ts` materializa instancias y genera:

- React/TSX interactivo con estado de variantes, variables, controles, eventos y runtime de motion.
- CSS Modules con jerarquía, materiales, responsive, variantes, animaciones, work area, velocidad y reduced motion.
- HTML autónomo y SVG con `foreignObject` como snapshots visuales.
- handoff para IA que incorpora instrucciones, TSX y CSS.
- JSON v5 sin pérdida mediante `exportDocument()`.

`scripts/verify-studio.mjs` compila los módulos de modelo/exportación, valida las cinco plantillas, tipos, jerarquías, normalización, interpolación, instancias y patrones del código generado; además vuelve a compilar todo TSX generado con TypeScript estricto.

## Ayuda contextual y plantillas

`studio-help.tsx` proporciona un contexto global, panel bilingüe, temas explícitos y fallback inferido por etiqueta. Cada tema incluye descripción, pasos, advertencia, ejemplo y demo CSS animada. `HelpButton` y `Helpable` conectan herramientas, barras, secciones y campos sin alterar el documento.

`studio-templates.ts` construye documentos completos, no previews planos: Clay, Glass, Skeuomorphic y Adaptive contienen showcase, stage, control central, metadatos y decoración. Adaptive incluye override mobile. Double-door contiene escena, marco, hojas/hijos independientes, pivotes opuestos, variantes Open/Ajar, interacciones click, tres tracks y marcadores.

## Configuración, dependencias y entrega

`package.json` fija Next 16.2.10/React 19.2.4 y exige Node ≥20.9. `npm ci` usa `package-lock.json`. `next.config.ts` no añade opciones. Tailwind 4 entra por PostCSS y el styling de producto se concentra en `src/app/globals.css`. Radix, Motion y Sandpack están instalados para evolución del producto; el Studio actual usa directamente React, `react-rnd`, Lucide y CSS propio.

`.github/workflows/quality.yml` ejecuta Node 24, `npm ci` y `npm run check` en PRs y pushes a main. `check` encadena ESLint, typegen/TypeScript, suite Studio y build Next. `.vercel/` está ignorado y es configuración local: antes de desplegar debe comprobarse que apunte al proyecto existente `morphiq-ui`, nunca crear otro.

## Responsabilidad por archivo

| Función | Archivo responsable |
| --- | --- |
| Esquema, defaults, normalización, migración, jerarquía, recetas CSS | `studio-model.ts` |
| Orquestación, historial, selección, edición, preview, persistencia | `studio-shell.tsx` |
| Render DOM/SVG, interacción directa y handles | `studio-node.tsx` |
| Árbol, rename, lock/hide y drag-to-reparent | `studio-layers.tsx` |
| Controles de diseño/material/layout/componentes/interacciones/a11y | `studio-inspector.tsx` |
| Cálculo de easing, interpolación y operaciones de keyframes | `studio-motion.ts` |
| UI y edición del timeline | `studio-timeline.tsx` |
| React/CSS/HTML/SVG/IA/JSON | `studio-export.ts` |
| Clay/Glass/Skeuo/Adaptive/double-door | `studio-templates.ts` |
| Ayuda bilingüe y ejemplos animados | `studio-help.tsx` |
| Pruebas estructurales y compilación de exportaciones | `scripts/verify-studio.mjs` |

## Riesgos conocidos

- `studio-shell.tsx` concentra demasiadas responsabilidades y hace difícil probar lógica de comandos sin navegador; separar reducer/comandos sería una mejora de mantenibilidad, pero no debe hacerse sin regresiones.
- La suite existente es fuerte en invariantes estructurales y output generado, pero no automatiza flujos de usuario, consola, accesibilidad o regresión visual en un navegador real.
- El historial guarda snapshots completos y `localStorage` guarda imágenes como data URL; proyectos grandes pueden consumir memoria o cuota local.
- HTML/SVG son snapshots visuales por diseño; React/CSS es la salida interactiva.
- La migración v4 preserva el modelo básico, pero no puede recuperar información que v4 nunca almacenó.
- Los advisories transitivos de PostCSS deben verificarse en cada checkpoint; no deben ocultarse con versiones canary.
- No existe sandbox para código comunitario ni persistencia remota; ambas funciones están deliberadamente fuera de este checkpoint.
