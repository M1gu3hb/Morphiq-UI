# Reporte 0057 — Bloques, tanda 2

- **Autor:** Codex
- **Fecha:** 2026-07-23
- **Rama:** `feat/blocks-batch2` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar diez bloques responsive, self-contained y accesibles sin modificar infraestructura compartida.

## Objetivo

Expandir la categoría `blocks` de 145 a 155 componentes con secciones listas para página,
previews que cubren todos sus ejes y cero cambios fuera de los 31 archivos autorizados.

## Qué se hizo y cómo

### FAQ Section

Inspiración general: disclosures de KokonutUI (MIT), reimplementados con API propia. Botones
nativos, `aria-expanded`/`aria-controls` y regiones asociadas conservan teclado y orden semántico;
la transición grid/rotate desaparece con reduced-motion.

### Newsletter Signup

Inspiración general: bloques de captura de SmoothUI y SeraUI (MIT), con cuatro materiales Morphiq.
El `<form>` asocia label, error y estado live; envío, éxito y error nunca dependen solo de color.

### Bento Grid

Inspiración general: bento layouts de Magic UI (MIT), sin copiar código. Los spans cambian solo la
composición visual; cada celda conserva h3 y los destinos son anchors nativos con foco visible.

### Contact Section

Inspiración general: secciones de contacto de SeraUI (MIT), reescritas. Validación local anuncia
errores por campo, enfoca el primero inválido y expone el resultado en una región `aria-live`.

### Team Section

Inspiración general: directorios de equipo de KokonutUI (MIT). Usa lista de articles, avatares con
alt y dimensiones intrínsecas, y nombres accesibles completos en los enlaces sociales.

### How It Works

Inspiración general: bloques de proceso de Magic UI (MIT). Un `<ol>` mantiene la secuencia real;
número, título y explicación cargan el significado y los conectores quedan decorativos.

### Announcement Banner

Inspiración general: banners de SeraUI (MIT). Es una región nombrada con CTA y cierre nativos;
`focusAfterDismissRef` permite devolver el foco a un destino útil después de descartar.

### Blog Grid

Inspiración general: rejillas editoriales de KokonutUI (MIT). Cada tarjeta es un article con h3,
fecha semántica e imagen con alt y dimensiones estables; reduced-motion elimina escala y elevación.

### Split Feature

Inspiración general: secciones alternadas de Animata (MIT), con composición original. El texto
precede siempre al visual en el DOM; el zig-zag de escritorio usa CSS y los visuales son aria-hidden.

### Feature Tabs

Inspiración general: Radix UI Tabs (MIT) como primitiva accesible y layout propio Morphiq. Conserva
roving tabIndex, Flechas/Home/End, paneles asociados, foco visible y decoración estabilizada.

## Resultado esperado vs. real

El resultado coincide con lo esperado: 155 entradas, diez fichas SSG nuevas, cero cambios
compartidos y 162/162 páginas generadas por el build de producción.

## Bugs / obstáculos y cómo se resolvieron

- Dos `npm ci` coincidieron sobre el mismo `node_modules`; se esperó al proceso ajeno y se dejó
  terminar la reconstrucción sin matar procesos ni borrar dependencias.
- Claude cambió temporalmente el HEAD compartido durante `prepare`; se restauró
  `feat/blocks-batch2` antes de cada edición y validación.
- La versión instalada de `lucide-react` no exporta iconos de marca; Team usa `Link2`, que comunica
  destino social sin añadir una dependencia.
- Nueve entries de Acciones aparecieron untracked y elevaron el autoload a 164; sus 27 archivos no
  se editaron ni agregaron, se apartaron temporalmente para el gate y quedaron restaurados.

## Verificación (gate)

- Lint dirigido a los 30 archivos de componente: verde.
- TypeScript dirigido a los 30 archivos propios: verde.
- `npm run check`: verde.
- Registry: `{"components":155,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next build: 162/162 páginas estáticas, incluidas las diez rutas nuevas.
- Sin navegador, Playwright, `getAnimations()` en vivo ni medición manual, por instrucción expresa.

## Riesgos, deuda y pendientes

- Los avatares e imágenes de demo usan Picsum y deben sustituirse por assets propios en producto.
- Los callbacks de formularios son deliberadamente agnósticos al backend; el consumidor conecta su
  transporte y conserva los estados accesibles ya expuestos.
- Fuentes y licencias se documentan aquí; `docs/CREDITS.md` queda intacto por guardarraíl.

## Estado final

Completo: implementación, aislamiento/restauración de archivos ajenos y gate en verde; listo para
push y PR.
