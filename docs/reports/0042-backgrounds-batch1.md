# Reporte 0042 — Sección Fondos (tanda 1): Aurora · Retro Grid · Dot · Grid · Meteors

- **Autor:** Claude
- **Fecha:** 2026-07-21
- **Rama:** `feat/backgrounds-batch1` · **Commit final:** ver PR
- **Tipo:** feature (componentes nuevos)
- **Prompt recibido:** R8. Cinco fondos nuevos en la categoría `backgrounds` — aurora-background, retro-grid, dot-pattern, grid-pattern, meteors. Contenedores full-bleed que renderizan el efecto detrás de `children`; el contraste del contenido nunca depende del fondo. Prioriza CSS puro (tier animado disponible, `motion` solo si de verdad hace falta). `reduced-motion` detiene la animación, `forced-colors` limpia el efecto, `getAnimations()` sin transiciones fantasma.

## Paso 0

Proyecto en `D:\morphiq-ui`. Imprimí la rama antes de cada gate y cada commit (working tree
compartido con Codex). Rama de trabajo `feat/backgrounds-batch1`. Registro previo en **31 entradas**;
tras esta tanda, **36**.

## Guardarraíl respetado

Creé **solo** los 3 archivos (`ui/`, `previews/`, `entries/`) de cada uno de los 5, más este reporte.
**No** toqué `docs/CREDITS.md` (lo mantiene el orquestador; la atribución va aquí abajo), ni
`schema.ts`, ni `verify-registry.mjs`, ni ningún `ui/*` existente. `git add` solo de mis archivos.

## Decisiones de diseño

**Fondos agnósticos al material.** El contrato del registro tipa `PreviewProps.material` como
`StyleSlug` (4 valores). Un componente con eje `material` en la cva keyeado solo en `"adaptive"`
rechazaría los otros tres en tiempo de tipos. Solución: los fondos **no tienen eje `material`** en la
cva. Aceptan `material?` y solo lo reflejan en `data-material` para paridad de catálogo; la entrada
declara `materials: ["adaptive"]`. Es un estilo único, no una receta por material.

**Self-containment del tipo de material.** La primera pasada del gate falló con
`undeclared internal imports: src/lib/component-data.ts` — los cinco importaban
`import type { StyleSlug } from "@/lib/component-data"`. Un componente copy-and-own no debe depender
de un módulo interno de la librería solo por un alias de tipo. **Fix:** inliné el tipo en cada archivo
(`type MaterialSlug = "clay" | "glass" | "skeuo" | "adaptive"`) y quité el import. Cero deps internas
salvo `src/lib/cn.ts`, como el resto del catálogo.

**CSS puro, cero deps nuevas.** Los cinco se resuelven con gradientes, máscaras, `perspective` y un
`@keyframes` local por componente. No hizo falta `motion`. `dependencies.npm` de los cinco es solo
`["class-variance-authority","clsx","tailwind-merge"]`.

**Keyframes que viajan con el componente.** Cada animado emite su `@keyframes` vía un
`<style href="mq-…" precedence="medium">` (hoisting de React 19), deduplicado por `href`: N instancias
en una página → **una** regla. La *definición* del keyframe vive en el `<style>` hoisteado del HTML;
el *shorthand* `animate-[mq-…_…]` vive en el chunk de Tailwind (por eso el chunk contiene el nombre
`mq-…` pero no el bloque `@keyframes` — es lo esperado).

**Patrón común de legibilidad.** En los cinco, el efecto es un `<span aria-hidden="true">` detrás; el
contenido va en una capa `relative z-10`. La base es siempre un color **opaco**, así que el efecto
nunca pisa el contraste del contenido del caller. El contenido de demo se eligió para quedar ≥4.5:1
sobre la superficie.

---

# 1 — Aurora Background (`aurora-background`)

**Atribución:** inspirado en *Aurora Background* de **Aceternity UI** (MIT). Código original,
reimplementado en CSS puro y self-contained.

**Técnica.** Tres `radial-gradient` (`--mq-a1..a3`) sobre una lámina `200% 200%` muy desenfocada
(`blur-[64px] saturate-[125%]`); el `@keyframes mq-aurora` (18s) loopea `background-position` de las
tres capas para el desplazamiento suave de la aurora. Paleta night-sky fija sobre la base.

**Legibilidad.** Base opaca `--mq-bg` (#0b1020), contenido `--mq-fg` (#f4f6ff). Verificado en build:
contenido `rgb(244,246,255)` sobre `rgb(11,16,32)` ≈ 15:1.

**reduced-motion / forced-colors.** `motion-reduce:animate-none` congela el drift; además el reset
global `*{animation-duration:.01ms!important}` lo cubre. `forced-colors:hidden` quita la aurora y
`forced-colors:bg-[Canvas]`/`text-[CanvasText]` restauran superficie del sistema.

**Verificado (build prod):** 1 `<style>` + 1 regla `@keyframes mq-aurora` (dedup), `CSSAnimation`
`playState: running`, **0** `CSSTransition` (sin fantasmas).

# 2 — Retro Grid (`retro-grid`)

**Atribución:** inspirado en *Retro Grid* de **Magic UI** (MIT). Código original.

**Técnica.** Plano rotado `perspective(320px) rotateX(58deg)` con `transform-origin:50% 0%`; dos
`linear-gradient` de 1px repetidos (`background-size:60px 60px`) forman la cuadrícula; una máscara
`linear-gradient(to top, …)` desvanece el borde lejano hacia el horizonte. El `@keyframes
mq-retro-grid` (1.6s linear) desplaza `background-position` para el scroll infinito.

**Legibilidad.** Base opaca `#0a0a14`, líneas `rgba(120,180,255,.4)`; contenido `--mq-fg` claro.
Verificado: contenido `rgb(244,246,255)` sobre `rgb(10,10,20)`.

**reduced-motion / forced-colors.** `motion-reduce:animate-none` → rejilla estática; `forced-colors`
limpia la rejilla y restaura Canvas/CanvasText.

**Verificado:** 1 `<style>` + 1 `@keyframes mq-retro-grid` (dedup), animación `running`, **0**
transiciones fantasma.

# 3 — Dot Pattern (`dot-pattern`)

**Atribución:** inspirado en *Dot Pattern* de **Magic UI** (MIT). Código original.

**Técnica.** Un `radial-gradient` de punto repetido (`background-size:18px 18px`) — **estático**, sin
keyframes. Variante `faded`: se ramifica en el componente (no en la cva) añadiendo
`mask-image: radial-gradient(ellipse at center, #000 35%, transparent 78%)` que disuelve los puntos
hacia los bordes. Base y color de punto se voltean con el esquema (`dark:`).

**Legibilidad.** Base opaca; el contenido va en `z-10`. Verificado: superficie `rgb(16,16,20)` con
contenido `rgb(241,239,233)`.

**reduced-motion / forced-colors.** Estático → nada que detener. `forced-colors` quita los puntos y
restaura Canvas/CanvasText.

**Verificado:** `getAnimations()` = **0** (estático), **0** transiciones fantasma, el `<span>` del
patrón sí pinta `background-image`, `data-material="adaptive"`. Cobertura de variantes `default` y
`faded` como literales (la verifica el gate).

# 4 — Grid Pattern (`grid-pattern`)

**Atribución:** inspirado en *Grid Pattern* de **Magic UI** (MIT). Código original.

**Técnica.** Dos `linear-gradient` de 1px repetidos (`background-size:26px 26px`) — **estático**.
Variante `faded`: misma rama de máscara radial que dot-pattern (viñeta hacia los bordes). Base/líneas
se voltean con el esquema.

**Legibilidad.** Base opaca; contenido en `z-10`. Verificado: superficie `rgb(16,16,20)`, contenido
`rgb(241,239,233)`.

**reduced-motion / forced-colors.** Estático → nada que detener. `forced-colors` quita la rejilla y
restaura Canvas/CanvasText.

**Verificado:** `getAnimations()` = **0** (estático), **0** transiciones fantasma; la variante
`default` no lleva máscara (correcto), la máscara solo aplica en `faded`.

# 5 — Meteors (`meteors`)

**Atribución:** inspirado en *Meteors* de **Magic UI** (MIT, origen en Aceternity UI). Código
original.

**Técnica.** 16 estelas diagonales. Cada una es un `<span>` con
`bg-[linear-gradient(90deg, transparent, var(--mq-meteor))]`, `rotate-[215deg]` y sombra; el
`@keyframes mq-meteor` desplaza `translate` en diagonal con fundido de opacidad. **Determinista y
SSR-safe:** posición, delay y duración se derivan del índice (`(i*61)%100`, `(i*37)%45`, `(i%8)*0.9`,
`4+(i%5)`), sin `Math.random` → sin desajuste de hidratación. El nombre de la animación va en la clase
(no inline) para que `motion-reduce:animate-none` pueda ganar; el timing por estela va inline
(inofensivo bajo `animation:none`).

**Legibilidad.** Base opaca `#0a0a14`; contenido en `z-10`. Verificado: contenido `rgb(244,246,255)`
sobre `rgb(10,10,20)`.

**reduced-motion / forced-colors.** `motion-reduce:animate-none` detiene las 16 estelas (campo
estático); `forced-colors` las quita y restaura Canvas/CanvasText.

**Verificado:** 1 `<style>` + 1 `@keyframes mq-meteor` (dedup para las 16 estelas), **16**
`CSSAnimation` `mq-meteor` todas `running`, **0** transiciones fantasma.

---

## Artefactos de verificación del entorno (no defectos)

Documentados para la próxima ronda:

1. **Enumeración de `@media (forced-colors: active)` en Chromium.** Con forced-colors inactivo, el
   preview pane **no** expone esos bloques por `CSSMediaRule.mediaText` (`hasForcedColors:false`),
   pero **sí** por `selectorText` (`forcedColorsSelectorFound:true`). Mi primer barrido dio un falso
   "0 forced-colors" por mirar solo `mediaText`. Confirmado en el CSS de disco: existen
   `.forced-colors\:hidden{display:none}`, `.forced-colors\:bg-[Canvas]{background-color:canvas}`,
   `.forced-colors\:text-[CanvasText]{color:canvastext}`.
2. **Git-Bash mangea backslashes** en `node -e` y en patrones regex de `grep` (`\:` de la CSS
   escapada). `grep -F` (fixed-string) es fiable; los `css.includes("…\\:…")` daban falsos negativos.
3. **Keyframes en `<style>` hoisteado, no en el chunk.** `@keyframes mq-…` no está en el CSS estático
   de Tailwind (ahí solo vive el shorthand `animate-[…]`); está en el `<style href>` del HTML. Buscarlo
   en el chunk da 0 y es correcto.

## Gate

```
npm run check → {"components":36,"selfContained":true,"guards":"ok","status":"ok"}
next build     → Compiled successfully; 43/43 rutas estáticas
                 SSG: /components/aurora-background, /dot-pattern, /grid-pattern,
                      /meteors, /retro-grid (+ resto del catálogo)
```

## Atribución (para CREDITS.md — lo aplica el orquestador)

| Componente        | Origen reconocido | Licencia |
|-------------------|-------------------|----------|
| aurora-background | Aceternity UI     | MIT      |
| retro-grid        | Magic UI          | MIT      |
| dot-pattern       | Magic UI          | MIT      |
| grid-pattern      | Magic UI          | MIT      |
| meteors           | Magic UI (orig. Aceternity UI) | MIT |

Los cinco son reimplementaciones originales en estilo Morphiq (CSS puro, self-contained,
material-agnósticas); no se copió código upstream.
