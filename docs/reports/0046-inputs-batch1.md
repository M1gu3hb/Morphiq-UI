# 0046 · Inputs creativos (tanda 1) · 7 componentes

**Rama:** `feat/inputs-batch1` · **Base:** `main` (62 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":62,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{file-upload,floating-label-input,action-search-bar,multi-select,tags-input,password-strength,number-stepper}`).
**Categoría:** `inputs` · **Materiales:** los 4 (`clay`/`glass`/`skeuo`/`adaptive`) con profundidad real (tokens + pozo de foco copiados de `ui/input.tsx`/`select.tsx`; skeuo greige `#e6e3da`, edge `#a8a49b`).
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist `core`) para íconos. Ningún componente necesitó `motion`: todo es CSS + control nativo + estado local, siguiendo el patrón de `ui/input.tsx`.

Construidos con orquestación multi-agente (un generador por componente en paralelo, patrón `input.tsx`/`select.tsx`), seguidos de revisión adversarial a11y/runtime y verificación DOM/CSSOM en el build de producción. Código original en estilo Morphiq inspirado en fuentes MIT; nada copiado.

**Contrato de formulario compartido:** control **nativo** donde se puede (input/textarea/number/file reales → teclado, foco, autofill, participación en formularios gratis); `aria-invalid` como **única fuente** del look de error; `aria-describedby` **compuesto** (no sobrescribe el del llamador) apuntando a una región `aria-live="polite"` siempre montada; ids de `React.useId()`; texto **y** placeholder ≥ 4.5:1 en cada material; nivel/estado nunca por color solo; `reduced-motion` apaga el adorno y conserva el estado final; `forced-colors` conserva los límites del control con borde de sistema, marca inválido con `Mark`, activo con `Highlight`.

---

## Nota de entorno (reportado por separado)

La cabecera de sesión apunta a `C:\morphiq-ui` (un checkout viejo y distinto, 22 entradas), pero el objetivo es `D:\morphiq-ui` (`feat/inputs-batch1`). En esta ronda **fijé las rutas `D:` de forma dura y exigí prueba de lectura** en las specs de los agentes; los 7 escribieron correctamente en `D:`. Además, la primera corrida de generación **se cortó por el límite de uso de la sesión** (7 agentes fallaron dejando 9 archivos parciales); al reanudar, borré los 9 parciales y regeneré los 7 desde cero para tener salida uniforme y auto-verificada. `git status` confirma solo los 21 archivos de registro + este reporte, cero cambios fuera de ellos. No se tocó `docs/CREDITS.md`, `schema.ts`, `verify-registry`, ni ningún `ui/*` existente.

---

## 1. `file-upload` — Zona drag-and-drop + input nativo

- **Inspiración / licencia:** patrones de dropzone open-source (react-dropzone / shadcn, MIT). Original: `<label>` sobre input nativo + realce de arrastre.
- **Receta por material:** superficie de la zona con los tokens/pozo de `input.tsx`; el foco (que cae en el input oculto) hace aflorar el pozo vía `has-[:focus-visible]:`.
- **a11y / teclado:** la zona es un `<label>` envolviendo un `<input type="file" multiple>` **visualmente oculto**, así que click, Tab→Enter/Space, participación en formularios y el picker del SO son gratis; el arrastre (bandera `data-dragging` con contador) es puro realce. Cada fila: nombre + tamaño (`formatBytes` determinista) + `<button aria-label="Remove <name>">`. `aria-invalid` marca un archivo rechazado; dos regiones `aria-live` anuncian errores y altas/bajas. Estado "loading" → `role="progressbar"` por fila con % textual (nunca solo color).
- **reduced-motion:** realce + entrada de filas sin viaje (estado final intacto). **forced-colors:** borde punteado `CanvasText`, arrastre `Highlight`, glifo `CanvasText`.
- variants: `["default"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

## 2. `floating-label-input` — Label flotante (CSS puro)

- **Inspiración / licencia:** Material-style floating label (MIT). Original: técnica CSS-only sobre input nativo.
- **Receta por material:** tokens/pozo de `input.tsx`; alturas mayores que `input.tsx` para reservar el carril del label flotado.
- **a11y / teclado:** input nativo con `placeholder=" "` + clase `peer`; el `<label htmlFor>` (siempre asociado) flota vía `peer-focus`, `peer-[:not(:placeholder-shown)]` y `peer-data-[focus=true]`, animando **solo** las propiedades estándar `translate`+`scale` (`transition-[translate,scale,color]`, `origin-left`, nunca `transition-[transform]` ni `font-size`). `aria-invalid` única fuente del error; `aria-describedby` compuesto a región `aria-live`; texto ≥ 4.5:1.
- **reduced-motion:** el label termina flotado sin viaje. **forced-colors:** chip del label `Canvas`/`CanvasText`, borde `CanvasText`.
- variants: `["default","filled","underline"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge.

## 3. `action-search-bar` — Combobox de acciones (ARIA 1.2)

- **Inspiración / licencia:** command/action bars (kbar / cmdk, MIT). Original: combobox ARIA 1.2 sobre input nativo.
- **a11y / teclado:** `<input role="combobox" aria-expanded aria-controls aria-activedescendant aria-autocomplete="list">` + `<ul role="listbox">` de `<li role="option" aria-selected>`. Arrow/Home/End mueven un **cursor virtual** (`aria-activedescendant`) sin sacar el foco del input; Enter activa; Escape cierra (y luego limpia); mousedown-preventDefault conserva el foco al clickear; blur cierra. Región `role="status"` anuncia conteos; opción activa con 3 pistas (fondo + acento + `Highlight` en forced-colors), nunca solo color. Panel con superficie **opaca** (`--mq-surface`, como `select.tsx`).
- **Verificación runtime:** `aria-expanded` alterna; ArrowDown fija `aria-activedescendant` a un id que **resuelve**, `aria-selected="true"` en la opción activa, el foco **permanece** en el input; Escape cierra y limpia `aria-activedescendant`.
- **reduced-motion:** panel sin viaje. variants: `["default"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

## 4. `multi-select` — Selección múltiple con chips

- **Inspiración / licencia:** multi-select comboboxes (react-select / shadcn, MIT). Original.
- **a11y / teclado:** combobox controlando `<ul role="listbox" aria-multiselectable="true">` de `<li role="option" aria-selected>`; valores seleccionados como chips con `<button aria-label="Remove <label>">`. Arrow mueven `aria-activedescendant`, Enter alterna, **Backspace en input vacío** borra el último chip, Escape cierra. `aria-live` anuncia cambios.
- **Verificación runtime:** al abrir, listbox con `aria-multiselectable="true"`, 5 opciones **todas** con `aria-selected` (2 seleccionadas = 2 chips), `aria-activedescendant` resuelve. Entrada del panel migrada a **`@starting-style`** (variante `starting:`) para evitar `setState`-en-efecto — ver correcciones.
- **reduced-motion / forced-colors** cubiertos. variants: `["default"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

## 5. `tags-input` — Chips por Enter/coma

- **Inspiración / licencia:** tag/token inputs (MIT). Original.
- **a11y / teclado:** contenedor tipo campo (pozo en `focus-within`) con tags `role="listitem"` dentro de `role="list"`, cada uno con remove labelado, seguidos de un `<input>` real con label/`aria-describedby` ("Enter para agregar"); Enter o `,` agregan (dedupe, ignora vacío), **Backspace en vacío** borra el último, `onPaste` divide por coma. `aria-live` anuncia altas/bajas; `aria-invalid` para tag inválido.
- **Verificación runtime:** `role="list"` presente; Enter agrega (2→3) y limpia el input; Backspace-en-vacío borra (3→2).
- **reduced-motion / forced-colors** cubiertos. variants: `["default"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

## 6. `password-strength` — Medidor con texto + toggle

- **Inspiración / licencia:** password meters (zxcvbn-style UIs, MIT). Original: score determinista.
- **a11y / teclado:** `<input type={visible?"text":"password"}>` nativo, `<button aria-pressed aria-label>` show/hide (lucide eye/eye-off) que **conserva el valor**, y un medidor `role="meter"` (aria-valuemin/max/now, etiquetado "Password strength") **más** un texto de nivel ("Weak/Fair/Good/Strong") en región `aria-live` — el nivel **nunca** es solo color. Score determinista por longitud+variedad.
- **Verificación runtime:** nivel textual "Weak" visible + `aria-live` "Password strength: …" + guía; toggle → `type="text"`, `aria-pressed="true"`, label "Hide password", **valor preservado** ("abc").
- **reduced-motion:** relleno de barra sin viaje. **forced-colors:** segmento lleno con `Highlight`, glifo `CanvasText`. variants: `["default","filled"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

## 7. `number-stepper` — Spinbutton nativo + hold-to-repeat

- **Inspiración / licencia:** number/quantity steppers (MIT). Original: hold-to-repeat con limpieza de intervalo.
- **a11y / teclado:** `<input type="number">` nativo (spinbutton implícito, `min`/`max`/`step`) flanqueado por `<button aria-label="Decrease"/"Increase">`; **hold-to-repeat** por `onPointerDown` (paso inmediato + intervalo acelerado) y por teclado `onKeyDown` que maneja **Espacio y Enter** (con `preventDefault`), deteniéndose en pointerup/leave/blur/keyup **y en desmontaje** (`useEffect(() => stopHold)` — sin fuga de intervalo). Los botones se **deshabilitan** en min/max.
- **Verificación runtime:** input `type=number` (min 1, max 8, step 1); ruta de puntero incrementa (2→3); ruta de teclado (keydown Enter) incrementa; sin `onClick` (por diseño — el teclado va por keydown); cleanup sin fugas.
- **reduced-motion / forced-colors** cubiertos. variants: `["default","filled"]`; sizes sm/md/lg. deps: cva/clsx/tailwind-merge/lucide-react.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":62,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 62; build genera las 7 rutas SSG. `getAnimations()` sin fantasmas (listas de transición copiadas/ajustadas de la referencia canónica).
- **Correcciones aplicadas (2 errores de lint que bloqueaban el gate + 2 warnings):**
  - `action-search-bar`: eliminado un `setState`-en-efecto que clampaba `activeIndex` (redundante — `activeValid` ya protege cada lectura y `handleChange` resetea al escribir).
  - `multi-select`: la entrada del panel pasó de un flag JS `entered` (que hacía `setState` en efecto) a **`@starting-style`** (variante `starting:`), misma animación sin el error; quitados warning de directiva eslint sin uso.
  - `number-stepper`: eliminado el tipo `StepperMaterial` sin uso.
- **Revisión adversarial (un revisor por componente, rutas `D:` fijadas + prueba de lectura):** 3 limpios (`floating-label-input`, `action-search-bar`, `number-stepper`), 4 "minor" sin CRITICAL/HIGH. Correcciones aplicadas:
  - **file-upload (MEDIUM contraste + LOW forced-colors):** el relleno del medidor usaba `--mq-brd-focus`, que en `glass` es casi blanco (rgba(255,255,255,0.98)) sobre una pista `--mq-edge` también blanca → invisible. Cambiado a `--mq-ring` (oscuro/alto contraste en todo material, se voltea en `adaptive`) + `forced-colors:[background-color:Highlight]`. **(LOW estado):** con `multiple={false}` un drop múltiple ahora anuncia el conteo **retenido**, no el recibido.
  - **multi-select (2× MEDIUM):** `aria-controls` ahora `open ? listboxId : undefined` (la listbox solo existe abierta — no colgar el IDREF); añadido efecto `scrollIntoView({block:"nearest"})` sobre la opción activa (la lista tiene `max-h`+scroll, así que flechar más allá del pliegue ahora la trae a la vista).
  - **tags-input (MEDIUM keys + LOW):** keys posicionales (`${index}-${tag}`) en chips e inputs ocultos (un `value` controlado con tags duplicados ya no colisiona keys de React); `onKeyDown`/`onPaste` omitidos del tipo de props (son el comportamiento del componente — contrato explícito en vez de descartarlos en silencio).
  - **password-strength (LOW):** el toggle tenía `aria-pressed` **y** un `aria-label` que cambiaba (doble anuncio); se quitó `aria-pressed` y se conserva el label de acción ("Show/Hide password"), que comunica propósito y estado por un solo canal.
  - _No corregidos (deliberado, bajo riesgo):_ `file-upload` `backdrop-filter` en la lista de transición compartida (idéntico a la referencia canónica `input.tsx`; inerte salvo en `glass`); `multi-select` `activeIndex` inicial 0 (seguro — `toggle` ya protege opciones `disabled`); `tags-input` región `aria-live` que no re-anuncia dos lotes idénticos consecutivos (cosmético).
- **Verificación runtime (build de producción, DOM/CSSOM):** action-search-bar (combobox: `aria-activedescendant` resuelve, foco permanece en el input, Escape cierra), multi-select (`aria-multiselectable`, opciones `aria-selected`, chips), password-strength (nivel textual + `aria-live` + toggle conserva valor), number-stepper (spinbutton nativo, teclado Enter/Espacio, cleanup sin fugas), tags-input (Enter agrega, Backspace borra).
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry) y este reporte. `docs/CREDITS.md` intacto (atribución arriba).
