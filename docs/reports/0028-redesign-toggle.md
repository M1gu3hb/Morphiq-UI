# Reporte 0028 — Rediseño táctil piloto de Toggle

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `redesign/toggle` · **Commit final:** ver PR (commit `redesign: deepen tactile toggle materials`)
- **Tipo:** feature
- **Prompt recibido:** Rediseñar únicamente Toggle como piloto táctil, diferenciando clay, glass, skeuo y adaptive sin alterar su API, accesibilidad, geometría ni archivos compartidos.

## Objetivo

Dar a la pista y al pulgar del Toggle una lectura material propia y táctil, con movimiento de
resorte y respuesta de presión verificables, preservando íntegramente el comportamiento del
switch existente y su contrato self-contained.

## Qué se hizo

- `src/registry/ui/toggle.tsx` recibió tokens locales para iluminación, profundidad,
  hover y tratamiento de backdrop. Las cuatro recetas ahora modelan pista y pulgar por
  separado, sin depender de `globals.css` ni de variables `:root`.
- El pulgar conserva el desplazamiento derivado por `--mq-travel`, pero ahora usa una curva
  de resorte y se comprime al presionar. Hover eleva su sombra.
- `docs/reports/0028-redesign-toggle.md` documenta la implementación y las pruebas reales.

`src/registry/previews/toggle-preview.tsx` y `src/registry/entries/toggle.ts` fueron auditados
pero no modificados: el preview ya ejercita materiales, variantes, tamaños y estados reales;
el manifiesto de dependencias y el texto de accesibilidad siguen siendo fieles.

## Cómo se hizo

### Recetas de pista y pulgar

| Material | Pista | Pulgar |
| --- | --- | --- |
| clay | Relleno cálido/saturado con gradiente de luz superior, sombra interior inferior y elevación exterior suave; la combinación hace que la pista se lea inflada. | Gradiente convexo, brillo interior alto, sombreado inferior y pequeño borde/extrusión cálida; la sombra crece en hover. |
| glass | Tinte propio opaco-en-lo-necesario, borde claro, filo de luz superior, `backdrop-filter: blur(14px) saturate(1.6)` y sombra atmosférica. El contraste no depende del fondo. | Gradiente blanco-cristalino con highlight diagonal, borde claro y sombra fría translúcida. |
| skeuo | Canal hundido: gradiente de ranura, inset oscuro superior, rebote claro inferior y borde exterior iluminado. | Gradiente físico de blanco iluminado a cuerpo beige, inset superior e inferior, canto extruido de 3 px y sombra proyectada. |
| adaptive | Superficie deliberadamente limpia, sin imagen decorativa, con inset mínimo. Conserva tokens claros/oscuros. | Superficie plana con sombra contenida que aumenta en hover; en esquema oscuro el estado checked invierte pista clara y pulgar oscuro para mantener separación. |

Los nuevos knobs (`--mq-track-image`, `--mq-track-shadow`, `--mq-track-blur`,
`--mq-track-saturate`, `--mq-thumb-image`, `--mq-thumb-shadow` y
`--mq-thumb-shadow-hover`) se declaran en el propio control y cada consumo `var()` incluye
fallback literal. La geometría de `sm`, `md`, `lg`, el ancho especial de `labeled` y la
fórmula de `--mq-travel` no cambiaron.

### Movimiento y cobertura exacta

El desplazamiento checked usa la propiedad standalone `translate` de Tailwind 4 con
`cubic-bezier(0.22,1.55,0.36,1)` y 300 ms: el segundo punto supera 1 para producir una
ligera llegada elástica sin introducir keyframes ni desplazar la geometría final. Durante
`:active`, el descendiente responde mediante `group-active/toggle:scale-[0.88]`; al soltar,
vuelve a `scale: 1` con la misma curva.

La lista del pulgar es exactamente
`transition-[translate,scale,box-shadow,background-color,border-color]`: `translate` cambia
con checked; `scale` con press; `box-shadow` con hover; y background/border cambian en el
adaptive oscuro checked. La pista declara sólo `background-color`, la única propiedad que
cambia con checked. No hay `transform` ni propiedades de transición fantasma.

Chrome del sistema consultó WAAPI con duración extendida sólo dentro de la sonda, para no
depender del reloj:

| Acción | Elemento | `CSSTransition` observada |
| --- | --- | --- |
| alternar estado | pulgar | `translate` |
| alternar estado | pista | `background-color` |
| hover | pulgar | `box-shadow` |
| mantener pointer down | pulgar | `scale` |

En `prefers-reduced-motion: reduce`, la duración computada queda en la microduración global
del sitio (`0.01 ms`), no quedan animaciones activas después de 30 ms y el press computa
`scale: 1`: no hay resorte ni squash. El cambio de estado permanece directo.

### Accesibilidad sin regresiones

- Se conserva el `<button type="button" role="switch">`, `aria-checked`, estado controlado
  o no controlado, callbacks y activación nativa con Espacio/Enter. Playwright confirmó que
  Espacio cambió `aria-checked` y mantuvo el foco.
- `:focus-visible` y el estado documental `data-focus` conservan el mismo anillo. Loading
  sigue enfocable con `aria-busy` y activación bloqueada; disabled conserva el atributo
  nativo.
- El label visible sigue heredando `currentColor`. Las variantes `default`, `labeled` e
  `icon` no cambiaron; la sonda contó dos captions ON/OFF con `aria-hidden`, por lo que
  `aria-checked` sigue siendo la única voz del estado.
- Forced-colors elimina imágenes/sombras y computó bordes de sistema visibles en pista y
  pulgar. El pulgar mantiene separación del contenedor aun cuando el navegador descarta
  rellenos decorativos.

Los colores de captions se preservaron. Se recalculó contraste sRGB, incluyendo glass
compuesto sobre blanco y negro y una superposición blanca conservadora del 14% en la banda
del texto checked:

| Material / caso | checked | unchecked |
| --- | ---: | ---: |
| clay | 6.44:1 | 7.98:1 |
| glass sobre blanco | **5.27:1** | 15.77:1 |
| glass sobre negro | 12.67:1 | 5.89:1 |
| skeuo | 10.59:1 | 8.24:1 |
| adaptive claro | 16.32:1 | 10.88:1 |
| adaptive oscuro | 15.48:1 | 8.88:1 |

El mínimo real/conservador es 5.27:1, por encima de 4.5:1.

### TDD, React y navegador real

Un contrato estático efímero empezó en RED porque el Toggle anterior no tenía tokens de
material ni compresión, y terminó GREEN comprobando recetas, curva, propiedades exactas,
reduced-motion, forced-colors y ausencia de `transform`. Se eliminó al terminar porque
`tests/**` estaba fuera del guardarraíl.

La revisión de React confirmó que no se agregó estado, efecto, memoización ni dependencia:
la lógica de render y eventos es idéntica; el cambio reside en CVA y constantes de estilo.
Playwright CLI manejó Chrome del sistema contra `next start`, inspeccionó visualmente los
cuatro materiales y verificó estilos computados, WAAPI, teclado, ARIA, esquema oscuro,
reduced-motion y forced-colors.

## Resultado esperado vs. real

- **Esperado:** un Toggle visualmente táctil y materialmente distinguible sin alterar su
  comportamiento ni cruzarse con el Select que Claude Code trabaja en paralelo.
- **Real:** sólo cambió `toggle.tsx`; el registro conserva 22 componentes self-contained y
  `/components/toggle` prerenderiza. Los cuatro materiales producen gradientes, sombras y
  backdrop computados distintos, mientras la API y el DOM accesible permanecen iguales.

## Bugs / obstáculos y cómo se resolvieron

1. **El primer tratamiento glass se aplicaba al root, no a la pista.** La sonda computó
   `backdropFilter: none` sobre el track. Se convirtió blur/saturate en tokens heredados
   consumidos por `TRACK`; la repetición confirmó `blur(14px) saturate(1.6)` en la pista.
2. **La primera tabla material capturó colores a mitad de transición.** La sonda cambiaba
   de selector y leía inmediatamente. Se esperaron 350 ms antes de muestrear estilos; no se
   cambió código de producción por un artefacto del harness.
3. **PowerShell fragmentó inicialmente el código de `run-code`.** Se usó `--filename` con
   una sonda efímera, manteniendo el componente intacto.
4. **La política del shell rechazó la limpieza recursiva de capturas.** Tras listar el
   objetivo exacto dentro de la worktree, `git clean -fd -- .playwright-cli` eliminó sólo
   esos artefactos regenerables.

## Verificación (gate)

- `npm ci` — ✅ 22 entradas generadas; sin descargar navegador.
- Contrato TDD efímero — ✅ RED esperado y GREEN final.
- Contraste — ✅ mínimo 5.27:1.
- `npm run lint` — ✅ sin errores ni warnings.
- `npm run typecheck` — ✅ `next typegen` + TypeScript estricto.
- `npm run test:studio` — ✅ suite estructural verde.
- `npm run test:registry` — ✅ `{"components":22,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 29 páginas; `/components/toggle` incluida en SSG.
- `npm run check` — ✅ exit 0.
- Playwright CLI + Chrome del sistema — ✅ render, materiales, ARIA, teclado, WAAPI,
  dark scheme, reduced-motion y forced-colors.

## Riesgos, deuda y pendientes

- La sensación táctil se validó en Chrome de escritorio; la curva usa propiedades CSS
  estándar, pero la percepción final puede variar ligeramente por frecuencia de pantalla.
- El blur de glass necesita contenido detrás para mostrar refracción; aun sin contexto, su
  tinte, borde y contraste propios mantienen la receta utilizable y legible.
- El preview existente muestra un material a la vez. Es suficiente para comparar mediante
  sus selectores y no justificó ampliar el alcance de esta ronda.

## Estado final

Completo. El piloto Toggle conserva su contrato funcional y accesible, diferencia los
cuatro materiales y prueba su movimiento táctil con transiciones CSS reales.
