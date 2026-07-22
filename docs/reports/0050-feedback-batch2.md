# 0050 · Feedback/Estados (tanda 2) · 7 componentes

**Rama:** `feat/feedback-batch2` · **Base:** `main` (90 entradas tras la tanda)
**Gate:** `npm run check` → `{"components":90,"selfContained":true,"guards":"ok","status":"ok"}`; el build genera las 7 rutas SSG (`/components/{toast,confirm-dialog,loading-dots,loading-bar,progress-steps,status-dot,empty-state}`).
**Categoría:** `feedback` (ya existía; **no** se tocó `schema.ts`). `toast` y `confirm-dialog` tienen superficie → los 4 materiales `clay/glass/skeuo/adaptive` (recetas de `ui/alert.tsx`/`card.tsx`; skeuo greige `#e6e3da`); los otros 5 son agnósticos → `["adaptive"]`.
**Dependencias nuevas:** ninguna de runtime salvo `lucide-react` (ya en el allowlist `core`) donde hay íconos. **Sin `motion`** — todo keyframes/transiciones CSS hoisteados.

Construidos con orquestación multi-agente (un generador por componente, patrón `alert.tsx`), seguidos de revisión adversarial a11y/runtime y verificación DOM/CSSOM en el build de producción. Código original en estilo Morphiq inspirado en fuentes MIT; nada copiado. No se repiten los `feedback` existentes (`alert, badge, progress, skeleton, spinner, tooltip`).

**Contrato de a11y de feedback (regla definitoria):** anuncios en vivo con `role="status"`+`aria-live="polite"` (o `role="alert"`+`assertive` solo si urge, mapeo de `alert.tsx`); overlays con `aria-modal`, **foco atrapado**, `Esc` cierra, y **retorno de foco** al disparador; el estado **nunca** solo por color (texto/ícono/forma); `reduced-motion` apaga entradas/bucles y deja el estado final; `forced-colors`; contraste ≥ 4.5:1; keyframes hoisteados y deduplicados; sin `getAnimations()` fantasma.

---

## 1. `toast` — Aviso transitorio (4 materiales)

- **Inspiración / licencia:** toasts (sonner / radix-toast-like, MIT). Original: superficie+tono de `alert.tsx`.
- **Receta por material:** superficie + 5 tonos copiados de `alert.tsx` (clay/glass/skeuo/adaptive × neutral/info/success/warning/danger); tono con **ícono + palabra sr-only** + barra de acento (nunca solo color).
- **Técnica:** entra deslizando (keyframe hoisteado sobre `translate`/`opacity`); auto-cierre en un efecto que **banca el tiempo restante** y se **pausa en hover/foco** (blur usa `currentTarget.contains(relatedTarget)` para no reanudar al pasar el foco al botón cerrar), `clearTimeout` en pausa/desmontaje. `ToastViewport` es un landmark fijo (no una segunda live-region, para no doblar el anuncio).
- **a11y:** `role="status"`+`aria-live="polite"` (neutral/info/success), `role="alert"`+`assertive` (warning/danger) — **verificado** (3 polite + 2 assertive); botón `Dismiss` labelado; **no roba el foco** (no-modal, verificado). `motion-reduce:animate-none` deja el toast presente.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 2. `confirm-dialog` — Modal de confirmación (4 materiales)

- **Inspiración / licencia:** confirm dialogs (radix-dialog / alert-dialog-like, MIT). Original.
- **Receta por material:** panel con tokens por material (superficie + grupos de CTA cancelar/confirmar/danger); entrada con keyframe hoisteado (`scale`/`translate`/`opacity`, sin `transform`).
- **a11y (verificado):** `role="dialog"` + `aria-modal="true"` + `aria-labelledby`/`aria-describedby` (ambos **resuelven**); **foco atrapado** (Tab/Shift+Tab ciclan — Shift+Tab desde Cancel envuelve a Publish); foco inicial en **Cancel** (seguro para destructivo); `Escape` cancela y **devuelve el foco al disparador** (`aria-expanded` vuelve a false); backdrop cancela; scroll del body bloqueado. El significado destructivo lo lleva la **etiqueta** del botón, no el color.
- **reduced-motion:** el modal abre sin animación, presente. `forced-colors` a `Canvas`/`CanvasText`/`Highlight`.
- variants: `["default"]`; sizes sm/md/lg. materials: los 4. deps: cva/clsx/tailwind-merge/lucide-react.

## 3. `loading-dots` — Tres puntos (`["adaptive"]`)

- **Inspiración / licencia:** loading dots (animata-like, MIT). Original.
- **Técnica:** 3 puntos `aria-hidden` en un `role="status"` que **siempre** lleva texto real (visible `label` o sr-only "Loading"), reusando el guard de `spinner`; `bounce`/`pulse` en un solo `<style href>` hoisteado, animando `translate`/`scale`/`opacity` con el stagger en el slot de delay del shorthand. `motion-reduce:animate-none` congela cada bucle en su fotograma de reposo (puntos visibles).
- **a11y:** el significado lo lleva el **texto** de la live-region, nunca color/movimiento; `forced-colors:[background-color:CanvasText]`.
- variants: `["bounce","pulse"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

## 4. `loading-bar` — Barra indeterminada (`["adaptive"]`)

- **Inspiración / licencia:** NProgress-style top bar (MIT). Original.
- **Técnica:** creep indeterminado con un keyframe hoisteado sobre `translate`+`scale` (`transform-origin:left`), sin `transform` ni `transition` (sin trampa/fantasma); el reposo `[translate:0_0] [scale:0.6_1]` es lo que ve un usuario con `animate-none`.
- **a11y:** `role="progressbar"` + `aria-label` sin `aria-valuenow` (indeterminado); el estado de carga lo lleva el rol+nombre+forma, no el color. `forced-colors:` bar `Highlight` sobre pista `CanvasText`.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

## 5. `progress-steps` — Indicador de pasos (`["adaptive"]`)

- **Inspiración / licencia:** step/stepper indicators (kokonutui-like, MIT). Original. (No es `number-stepper`.)
- **Técnica:** `<ol>`/`<li>` semántica; marcador con **ícono de check** (completado) o número (actual/pendiente), etiqueta y conector (`aria-hidden`). Estado por **ícono + texto** (`sr-only` "Completed:"/"Current step:") + color — nunca solo color.
- **a11y (verificado):** `<ol>` con 4 pasos, un solo `aria-current="step"`, prefijos sr-only por estado. `forced-colors:` check `Highlight`, actual `CanvasText`.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge/lucide-react.

## 6. `status-dot` — Indicador de presencia (`["adaptive"]`)

- **Inspiración / licencia:** presence/status dots (MIT). Original.
- **Técnica:** punto cuyo estado lo lleva **color + forma distinta + etiqueta de texto** (online lleno/pulso, away con muesca, busy con guion, offline anillo hueco); pulso opcional (keyframe hoisteado, `motion-reduce:animate-none` estático).
- **a11y (verificado):** todas las palabras de estado presentes como **texto** (online/away/busy/offline/do-not-disturb); el punto es `aria-hidden` (el significado va en la etiqueta + forma). `forced-colors:` punto `CanvasText`.
- `status` por prop; el preview muestra los cuatro. variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge.

## 7. `empty-state` — Estado vacío (`["adaptive"]`)

- **Inspiración / licencia:** empty states (MIT). Original.
- **Técnica:** ilustración/ícono (`aria-hidden`), **encabezado semántico** con nivel overrideable, párrafo y slot de acción (el llamador pasa un `<button>`/`<a>` con nombre accesible).
- **a11y:** semántica de encabezado real; la acción lleva su propio nombre accesible; ilustración decorativa; contraste ≥ 4.5:1. Mayormente estático; cualquier entrada sutil es segura para `reduced-motion`.
- variants: `["default"]`; sizes sm/md/lg. materials: `["adaptive"]`. deps: cva/clsx/tailwind-merge/lucide-react.

---

## Cierre

- **Gate:** `npm run check` verde — `{"components":90,"selfContained":true,"guards":"ok","status":"ok"}`; `verify-registry` reporta 90; build genera las 7 rutas SSG. `getAnimations()` sin fantasmas (keyframes hoisteados/deduplicados).
- **Revisión adversarial (un revisor por componente, rutas `D:` fijadas + prueba de lectura):** **1 limpio** (`empty-state`), 6 "minor" (2 MEDIUM + 5 LOW, sin CRITICAL/HIGH). Correcciones aplicadas:
  - **toast (MEDIUM live-region):** los toasts *polite* (neutral/info/success) montaban su región `aria-live` junto con su contenido en una sola mutación, que NVDA/JAWS a menudo **no** anuncian. Se añadió un `ToastAnnouncer` `sr-only` separado que monta **vacío** y revela su texto un frame después (rAF, sin `setState`-en-efecto; se re-monta en cada apertura), y se quitaron los atributos de live-region del toast visible → **una sola** vía de anuncio, fiable para polite y assertive. **Verificado:** 5 regiones announcer sr-only (3 polite + 2 assertive), 0 toasts visibles con `aria-live`/`role`.
  - **progress-steps (MEDIUM semántica):** `list-none` quita el rol de lista en Safari/VoiceOver y, con el número `aria-hidden`, se perdía el conteo ordinal → se añadió `role="list"` explícito al `<ol>`.
  - **loading-dots (LOW):** `rendersText` trataba el número `0` como texto visible (`count && node` con count 0 → "0" perdido) → ahora rechaza `0`/`NaN`, conservando el fallback "Loading".
  - **loading-bar (LOW):** un `aria-label` del llamador se pisaba con el nombre derivado de `label` → se omitió `aria-label` de las props (fuente única de nombre = `label`).
  - **status-dot (LOW):** región `role="status"` siempre activa sin opt-out → se añadió `live?: "polite" | "off"` (como `urgency` de Alert) para indicadores de presencia estáticos.
  - _No corregidos (deliberado, bajo riesgo):_ `toast` foco a `body` al descartar con el botón cerrar (no-modal, no requerido); `confirm-dialog` fondo no `inert` con el modal abierto (difícil sin portal por la elección de auto-contención; `aria-modal` + trampa de foco ya contienen).
- **Verificación runtime (build de producción, DOM/CSSOM):** confirm-dialog (dialog/aria-modal, labelledby/describedby resuelven, foco inicial Cancel, foco atrapado con Shift+Tab que envuelve, `Esc` cierra + retorno de foco), toast (status/alert con mapeo polite/assertive, `Dismiss`, tono por texto, no-modal), progress-steps (`<ol>` + `aria-current="step"` + prefijos sr-only), status-dot (estado por texto).
- **Guardarraíl:** solo se crearon los 21 archivos de registro (7 × ui/preview/entry) y este reporte. `docs/CREDITS.md`, `schema.ts`, `verify-registry` y los `ui/*` existentes intactos.
