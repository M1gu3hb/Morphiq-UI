# Reporte 0039 — Botones Magnetic, Gradient y Rainbow

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `feat/buttons-batch1` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar la primera tanda de la sección Botones con Magnetic Button, Gradient Button y Rainbow Button, cuatro materiales táctiles, movimiento accesible, self-containment y créditos, sin tocar infraestructura ni componentes compartidos.

## Objetivo

Expandir el registry autoensamblado de 25 a 28 componentes con tres botones nativos de
producción. Cada componente debía incluir entry, fuente distribuible y preview; conservar
contraste, teclado, foco, disabled, reduced-motion y forced-colors; y demostrar cobertura
de animación sin depender de muestrear un instante arbitrario del reloj.

## Qué se hizo

Se crearon únicamente los nueve archivos propios de los tres componentes:

- `src/registry/entries/magnetic-button.ts`, `ui/magnetic-button.tsx` y su preview.
- `src/registry/entries/gradient-button.ts`, `ui/gradient-button.tsx` y su preview.
- `src/registry/entries/rainbow-button.ts`, `ui/rainbow-button.tsx` y su preview.

También se agregó esta bitácora y se anexó una tabla de atribución a `docs/CREDITS.md`.
No se modificaron schema, generator, verify-registry, package.json, estilos globales ni
componentes existentes. El autoload descubrió las tres entries y generó sus fichas SSG.

## Cómo se hizo

### Magnetic Button

La categoría de interacción se investigó en SmoothUI (MIT), pero la implementación es
original. `motion/react` —declarado como paquete `motion` en la entry— aporta cuatro
`MotionValue` con resortes: dos desplazan la superficie y dos añaden un recorrido menor a
la etiqueta. Un listener pasivo de `pointermove` en `window` calcula distancia y
proximidad respecto del botón, por lo que la atracción empieza antes de entrar al área
clicable sin crear un overlay que bloquee controles vecinos. El desplazamiento se acota
con `strength` (11 px por defecto) y vuelve a cero al salir del radio o perder foco la
ventana. El listener se elimina en cleanup y el `ref` público se compone con el ref local.

`useReducedMotion()` evita registrar el listener y deja superficie/etiqueta en
`transform:none`. Punteros no-mouse, disabled y teclado reciben el mismo botón inmóvil.
Motion es dueño del transform; CSS no declara una transición `transform` fantasma. Los
estados táctiles sólo interpolan sombras/opacidad, más `filter` en skeuo, donde sí cambia
`brightness`.

### Gradient Button

La referencia de categoría visual es Lightswind (MIT); el código y la receta son
originales. Un keyframe local `mq-gradient-button-flow` mueve `background-position`. El
perímetro y la superficie interior ejecutan el mismo recorrido a velocidades y sentidos
distintos, creando profundidad sin dependencia de runtime. `<style href precedence>` de
React 19 hace que la regla viaje con el componente y se deduplique.

La etiqueta vive sobre el gradiente interior controlado, no sobre el borde luminoso. El
hover eleva con la propiedad individual `translate` de Tailwind 4 y amplía la sombra; el
active hunde el control. Disabled y `motion-reduce` detienen ambos loops y neutralizan los
desplazamientos.

### Rainbow Button

El patrón de perímetro espectral se investigó en MagicUI (MIT); la implementación Morphiq
es original. Botón, halo `aria-hidden` y superficie son capas independientes. Botón y halo
comparten `mq-rainbow-button-flow`, pero la etiqueta queda sobre una superficie opaca y
estable. Cada material redefine la secuencia de siete tonos: clay cálido, glass luminoso,
skeuo desaturado y adaptive de alto contraste.

El halo sólo interpola `opacity`; el botón sólo `translate`, `box-shadow` y `opacity`.
Reduced-motion congela los dos recorridos y elimina transiciones. Disabled detiene los
loops y oculta el halo. En forced-colors se ocultan halo, gradientes y sombras, dejando
`ButtonFace`, `ButtonText`, borde de sistema y foco `Highlight`.

### Receta por material y contraste

| Material | Magnetic | Gradient | Rainbow |
|---|---|---|---|
| clay | Coral inflado `#ff9077`, canto terracota y tinta cacao. | Borde coral/porcelana y superficie coral–melocotón. | Superficie coral con espectro cálido y pared terracota. |
| glass | Superficie oscura autocontenida, filo blanco, blur y sombra fría. | Borde cian/lila y gradiente interior carbón, con blur local. | Superficie carbón al 94%, espectro luminoso y halo frío. |
| skeuo | Greige cálido `#e6e3da`, bisel claro y pared `#a8a49b`. | Flujo metálico acromático sobre el mismo greige cálido. | Superficie greige y arcoíris desaturado tipo esmalte. |
| adaptive | Carbón/crema según esquema, sombra contenida y target grueso ≥48 px. | Gradiente verde sobrio que invierte superficie y tinta. | Superficie carbón/crema con perímetro espectral de alto contraste. |

Contraste WCAG de la etiqueta contra el peor punto de su superficie controlada:

| Componente | clay | glass | skeuo | adaptive claro / oscuro |
|---|---:|---:|---:|---:|
| Magnetic Button | 6.44:1 | 14.25:1 | 12.29:1 | 16.32:1 / 15.48:1 |
| Gradient Button | 6.96:1 | 12.52:1 | 12.29:1 | 11.31:1 / 12.25:1 |
| Rainbow Button | 6.96:1 | 15.23:1 | 12.29:1 | 16.32:1 / 15.48:1 |

Todos superan 4.5:1. La transparencia glass se compuso contra blanco y negro y se reporta
el peor resultado; no se asumió que el fondo del sitio aportara contraste.

### `getAnimations()` y propiedades reales

La sonda se ejecutó inmediatamente después de forzar hover en cada material. El resultado
fue idéntico en clay/glass/adaptive salvo la fila skeuo indicada:

| Componente / capa | `transition-property` computada | `getAnimations()` observado |
|---|---|---|
| Magnetic, clay/glass/adaptive | `box-shadow, opacity` | `CSSTransition: box-shadow`; Motion produjo traslación real y volvió al origen. |
| Magnetic, skeuo | `box-shadow, filter, opacity` | `CSSTransition: box-shadow`, `CSSTransition: filter`. |
| Gradient, los 4 materiales | `translate, box-shadow, opacity` | `CSSTransition: box-shadow`, `CSSTransition: translate`, `CSSAnimation: mq-gradient-button-flow` en borde y cuerpo. |
| Rainbow, los 4 materiales | `translate, box-shadow, opacity` | `CSSTransition: box-shadow`, `CSSTransition: translate`, `CSSAnimation: mq-rainbow-button-flow`. |
| Halo Rainbow | `opacity` | `CSSTransition: opacity` + `CSSAnimation: mq-rainbow-button-flow`. |

No apareció ninguna `CSSTransition: transform`. Bajo reduced-motion, Magnetic computó
`transform:none` en botón y etiqueta y devolvió cero animaciones; Gradient y Rainbow
computaron `animation-name:none` en todas sus capas.

### Accesibilidad y self-containment

Los tres exports renderizan `<button type="button">` real por defecto, conservan
activación nativa por Space/Enter, admiten `ref`, exponen foco visible separado y respetan
`disabled`. Sus efectos son decorativos y no comunican estado. Las previews cubren
`default`, `focus`, `loading` y `disabled` sin duplicar recetas de hover/active.

Cada `var()` tiene fallback literal y cada material define sus tokens sobre la propia
instancia. No hay lecturas de `:root`, globals.css ni clases del chrome. Gradient y
Rainbow sólo dependen del trío estándar CVA/cn; Magnetic declara exactamente `motion`
además del mismo cierre de dependencias.

## Resultado esperado vs. real

- **Esperado:** tres componentes nuevos, cuatro materiales, 28 entries y tres rutas SSG.
- **Real:** `verify-registry` reportó exactamente 28 componentes self-contained; Next
  generó 35 páginas estáticas y las tres fichas nuevas. Chromium recibió 200 en las tres,
  encontró título, `h1`, preview y `<button type="button">`, activó el estado disabled y
  registró cero `console.error` y cero `pageerror`.

Magnetic mostró una matriz con traslación al aproximar el cursor y volvió prácticamente a
la identidad tras el resorte. En forced-colors, las tres superficies computaron
`background-image:none`, borde `solid` y contorno `solid`; el halo Rainbow quedó `display:none`.

## Bugs / obstáculos y cómo se resolvieron

1. **`docs/component-expansion-map.md` no estaba versionado en main.** Se leyó la copia
   local solicitada del árbol canónico sin añadirla ni modificarla, porque queda fuera del
   guardarraíl.
2. **El primer typecheck de Magnetic encontró conflicto entre `onDragEnd` nativo y el de
   Motion.** La API se tipó con `ComponentPropsWithRef<typeof motion.button>`, preservando
   atributos, eventos y ref correctos sin `any`.
3. **La primera versión sólo atraía dentro del botón.** La revisión contra el requisito la
   cambió por un campo de proximidad global pasivo, acotado y con cleanup, sin agrandar la
   zona clicable.
4. **Un `next start` anterior sobrevivió al cierre del cell y quedó sobre el puerto 4187
   mientras se regeneraba `.next`.** Se identificó el PID y su command line exactos, se
   cerró sólo ese proceso y se repitió toda la prueba contra un servidor limpio.

## Verificación (gate)

- `npm ci` — ✅ dependencias instaladas; lockfile sin cambios.
- Contrato TDD efímero fuera del repo — ✅ RED por archivos ausentes y GREEN final para
  los tres componentes.
- ESLint dirigido después de cada cambio — ✅.
- `npm run typecheck` y `npm run test:registry` durante la implementación — ✅.
- `npm run check` final — ✅ lint, typecheck, verify-studio, verify-registry y build.
- Registry — ✅ `{"components":28,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next 16 / Turbopack — ✅ 35 páginas estáticas; 28 fichas SSG, incluidas
  `/components/magnetic-button`, `/components/gradient-button` y
  `/components/rainbow-button`.
- Playwright CLI + Chromium — ✅ 200, render real, matriz WAAPI por 4 materiales,
  proximidad/resorte, reduced-motion, forced-colors, disabled y cero errores.

## Riesgos, deuda y pendientes

- Cada instancia Magnetic registra un listener pasivo de `pointermove` y lo limpia al
  desmontarse. Es correcto para uso normal; una vista con cientos de botones magnéticos
  podría beneficiarse después de un coordinador compartido.
- El gradiente usa interpolación CSS y puede rasterizar matices ligeramente distintos por
  navegador/GPU, pero la superficie de texto y su contraste no dependen del halo o borde.
- La dependencia `motion` ya estaba instalada y permitida por el tier animado; este PR no
  cambia package.json ni el lockfile.

## Estado final

Completo. Los tres componentes, previews, entries, créditos y reporte están listos; gate
completo y verificación real de navegador permanecen verdes con 28 componentes.
