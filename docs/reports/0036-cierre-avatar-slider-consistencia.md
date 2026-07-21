# Reporte 0036 — Cierre: Avatar, Slider y consistencia

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `redesign/avatar-slider-consistencia` · **Commit final:** ver PR
- **Tipo:** feature / fix
- **Prompt recibido:** Cerrar el rediseño con motion puntual para Avatar y Slider, unificar el skeuo de Input/Textarea y reparar el roving `tabIndex` de Tabs.

## Objetivo

Completar el lenguaje de movimiento sin alterar materiales ni contratos de
accesibilidad, cerrar la deriva fría de los dos campos de texto y asegurar que
la pestaña activa sea realmente el único `role="tab"` con `tabIndex=0`.

## Qué se hizo

- `src/registry/ui/avatar.tsx`: hover con contorno inmediato y escala sutil
  `1 → 1.04`; la transición nombra exclusivamente la propiedad CSS `scale`.
- `src/registry/ui/slider.tsx`: el thumb agarrado ahora crece a `1.08`; el
  Range interpola los insets que Radix modifica (`left/right` en horizontal,
  `top/bottom` en vertical). Se eliminó `border-color` de la transición del
  thumb porque WAAPI demostró que era una propiedad fantasma.
- `src/registry/ui/input.tsx` y `src/registry/ui/textarea.tsx`: skeuo pasó de
  gris azulado a la misma familia greige cálida acromática de Select/Tabs/
  Accordion. Se actualizaron superficies, gradientes, pared, tintas, texto,
  placeholder y borde.
- `src/registry/ui/tabs.tsx`: el wrapper conserva a Radix como dueño de ARIA,
  foco y teclado, y refleja únicamente su valor seleccionado para fijar el
  contrato DOM `active=0`, `inactive=-1` desde el primer render hidratado.
- Las entries de Avatar, Slider, Input y Textarea ahora describen el movimiento
  y las cifras reales de contraste. Los previews ya ejercitaban todos los
  estados necesarios y no se modificaron.

Avatar no ofrece indicador de estado en su API actual. Por eso no se añadió un
pulso ni una prop nueva: la instrucción era condicional y el cierre conserva el
alcance y la accesibilidad existentes.

## Cómo se hizo

### Motion comprobado sin depender del reloj

Se ejecutó el build de producción y se consultó `getAnimations()` en Chromium
inmediatamente después de cada interacción real:

| Componente / acción | `transition-property` | `getAnimations()` observado |
| --- | --- | --- |
| Avatar · hover | `scale` | `CSSTransition(scale)` |
| Slider · ArrowRight, 40→45 | `left, right, top, bottom` | `CSSTransition(right)` |
| Slider · hover + pointer down | `box-shadow, background-color, scale` | `CSSTransition(background-color)`, `CSSTransition(box-shadow)`, `CSSTransition(scale)` |

No aparece `transform`, `border-color` ni otra propiedad sin consumidor. Los
insets verticales no aparecen en la preview horizontal, pero son los que Radix
escribe cuando la API se usa con `orientation="vertical"`; no son fantasmas.

Con `prefers-reduced-motion: reduce`, Avatar, Range y Thumb computaron
`transition-property: none`. En forced-colors el Range y el borde del thumb
computaron al mismo color de sistema Highlight, y el Avatar conservó borde de
sistema; no se depende de los rellenos materiales.

### Skeuo antes y después

Input y Textarea comparten exactamente el mismo contrato nuevo:

| Token / medida | Antes: frío | Después: greige cálido |
| --- | --- | --- |
| Superficie | `#e4e7ea` | `#e6e3da` |
| Superficie fuerte | `#d6dade` | `#d7d3c9` |
| Gradiente normal | `#f0f2f3 → #dadddf` | `#f2efe7 → #dcd8ce` |
| Gradiente filled | `#e5e8ea → #ced2d5` | `#e4e0d6 → #cec9be` |
| Pared | `#a4a9ae` | `#a8a49b` |
| Tinta / placeholder | `#202326` / `#4c5257` | `#23231f` / `#4a4943` |
| Borde en reposo | `rgba(30,34,38,.38)` | `rgba(25,25,23,.52)` |

El cálculo sRGB conservador usa el extremo más oscuro del gradiente `filled`:

| Contraste | Antes | Después | Requisito |
| --- | ---: | ---: | ---: |
| Placeholder / superficie | 5.21:1 | 5.47:1 | ≥ 4.5:1 |
| Texto / superficie | 10.38:1 | 9.55:1 | ≥ 4.5:1 |
| Borde / superficie | 2.14:1 | 3.12:1 | ≥ 3:1 |

El texto pierde contraste numérico al calentarse, pero mantiene un margen
amplio. El borde subió deliberadamente de `.38` a `.52` para que la unificación
no perpetuara el incumplimiento no textual. En el DOM ambos controles
computaron los seis tokens cálidos y el gradiente esperado.

### Tabs: roving tabindex

La reproducción previa en producción devolvió:

```json
{"tablist":0,"tabs":[-1,-1,-1]}
```

Radix 1.1.17 usaba el propio tablist como punto de entrada inicial. Tabs ahora
mantiene un espejo controlado/no controlado del valor que Radix selecciona y
solo lo usa para entregar el `tabIndex` del Trigger. El comportamiento final fue:

```json
{"active":"Overview","tabIndex":[0,-1,-1]}
```

Tras enfocar Overview y pulsar ArrowRight, Radix movió foco, `data-state` y el
indicador a Activity; el DOM pasó a `[-1,0,-1]`. No se reimplementaron flechas,
Home/End, selección, `aria-controls`, `aria-labelledby` ni el indicador.

### TDD, self-containment y revisión React

Un contrato efímero fuera del repo empezó RED para los cuatro grupos: motion de
Avatar, motion de Slider, skeuo de Input y skeuo de Textarea. La inspección DOM
de Tabs fue un RED independiente (`active.tabIndex === -1`). Tras implementar,
los cuatro grupos y Tabs quedaron GREEN. El hallazgo del `border-color` fantasma
se convirtió en otro RED antes de retirarlo.

La revisión React confirmó exports nombrados, props colocadas y hooks
incondicionales. El estado adicional de Tabs está junto a su consumo, distingue
correctamente modo controlado/no controlado y no reemplaza el estado ni los
eventos de Radix. `verify-registry` confirmó que las 22 entradas siguen
self-contained, con fallbacks literales y guards en `ok`.

## Resultado esperado vs. real

- **Esperado:** dos gestos de motion coherentes, campos skeuo cálidos y una
  pestaña activa tabulable.
- **Real:** las propiedades animadas tienen `CSSTransition` real y no fantasmas;
  reduced-motion las suprime; ambos campos comparten los tokens cálidos y
  superan sus pisos de contraste; Tabs conserva teclado Radix y expone 0/−1
  correctamente antes y después de navegar.

## Bugs / obstáculos y cómo se resolvieron

1. El primer `npm ci` superó el timeout y dejó `node_modules` parcial; se aisló
   esa carpeta generada y una instalación limpia terminó correctamente.
2. Playwright CLI creó `.playwright-cli/` en el repo; se cerró la sesión y se
   eliminó únicamente ese artefacto antes del diff final.
3. El servidor base dejó vivo su hijo de Next al agotarse el comando; se
   verificó PID, puerto y línea de comando del worktree antes de cerrarlo.
4. WAAPI mostró `border-color` en la lista del thumb pero nunca como transición
   activa. Se añadió el contrato RED y se eliminó la propiedad fantasma.

## Verificación (gate)

- `npm ci` — ✅ 457 paquetes y 22 entradas generadas.
- Contrato TDD efímero — ✅ RED observado; GREEN final
  `{"contracts":4,"status":"ok"}`.
- ESLint dirigido y `tsc --noEmit` después de cada cambio — ✅.
- Playwright CLI sobre build de producción — ✅ Tabs, ArrowRight, tokens
  computados, `getAnimations()`, reduced-motion y forced-colors.
- `npm run check` — ✅ lint, typecheck, Studio, registry y build.
- `verify-registry` — ✅
  `{"components":22,"selfContained":true,"guards":"ok","status":"ok"}`.
- Build — ✅ 29 páginas; las 22 fichas de componente quedaron prerenderizadas.
- `npm audit --audit-level=high` — ✅ sin high/critical; quedan dos moderadas
  preexistentes en Next/PostCSS y su arreglo sugerido exige un cambio mayor.

## Riesgos, deuda y pendientes

- El Range suaviza 200 ms; en arrastres extremadamente rápidos puede percibirse
  una estela corta, decisión explícita de este encargo. Reduced-motion la quita.
- El consumidor todavía puede pasar un `tabIndex` explícito a TabsTrigger; se
  respeta por compatibilidad, aunque el valor automático correcto es 0/−1.
- La verificación fue en Chromium, no con lector de pantalla ni otros motores.
- El Avatar sigue sin indicador de presencia; si esa API se añade en otra ronda,
  entonces corresponde añadir el pulso suave solicitado y su texto accesible.

## Estado final

Completo. El cierre de motion y consistencia queda implementado, verificado en
el DOM real y con el gate de 22 componentes en verde.
