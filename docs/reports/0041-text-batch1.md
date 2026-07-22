# Reporte 0041 — Texto animado, tanda 1

- **Autor:** Codex
- **Fecha:** 2026-07-21
- **Rama:** `feat/text-batch1` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Agregar cinco componentes originales de texto animado —Shiny Text, Gradient Text, Typewriter Text, Text Reveal y Word Rotate— como efectos agnósticos al material, accesibles, self-contained y estables bajo reduced-motion y forced-colors.

## Objetivo

Expandir el registry autoensamblado de 31 a 36 componentes con una primera tanda de texto
animado. Cada componente debía aportar entry, fuente distribuible y preview propios, heredar
tipografía y color del contexto y mantener siempre una capa semántica legible.

## Qué se hizo

Se crearon únicamente los 15 archivos propios de los cinco componentes:

- `entries/`, `ui/` y `previews/` para `shiny-text`.
- `entries/`, `ui/` y `previews/` para `gradient-text`.
- `entries/`, `ui/` y `previews/` para `typewriter-text`.
- `entries/`, `ui/` y `previews/` para `text-reveal`.
- `entries/`, `ui/` y `previews/` para `word-rotate`.

Los cinco usan `category: "text"`, material `adaptive`, variante propia y tamaño `inherit`.
No se editaron `docs/CREDITS.md`, schema, scripts, package.json, archivos generados ni
componentes existentes. La atribución solicitada queda en este reporte.

## Cómo se hizo

### Shiny Text

**Inspiración:** MagicUI, componente de texto brillante, licencia MIT. La implementación es
original. Una regla local `mq-shiny-text-sweep` mueve `background-position` sobre una copia
`aria-hidden` recortada con `background-clip:text`. Debajo permanece el texto semántico normal en
`currentColor`; el brillo translúcido nunca sustituye la capa que aporta contraste.

El efecto es CSS puro, se deduplica con `<style href precedence>` de React 19 y acepta duración y
color de brillo. `prefers-reduced-motion` oculta la copia animada; forced-colors hace lo mismo y
conserva `CanvasText`.

### Gradient Text

**Inspiración:** MagicUI, texto con gradiente animado, licencia MIT. Código original Morphiq. El
keyframe local `mq-gradient-text-flow` desplaza un gradiente configurable sobre una copia
decorativa con opacidad 0,42. El texto real sigue debajo en `currentColor`, de modo que ni una
parada clara ni el recorte transparente pueden matar la legibilidad.

No usa runtime de animación. Reduced-motion deja un cuadro estático (`animation-name:none`) y
forced-colors elimina la capa cromática.

### Typewriter Text

**Inspiración:** SmoothUI, patrón typewriter, licencia MIT. La implementación es una máquina de
estados propia y compacta con `setTimeout`: escribe, pausa, borra y avanza por `phrases`, con modo
`loop` o `once`. Reserva el ancho de la frase más larga para evitar layout shift. Solo usa Motion
para `useReducedMotion`; la dependencia `motion` está declarada exactamente en la entry.

Los caracteres visuales y el cursor están `aria-hidden`. Una región `aria-live="polite"` y
`aria-atomic="true"` expone la frase completa, nunca un anuncio por letra, y se puede desactivar.
Reduced-motion muestra completa la primera frase, cancela los timeouts y congela el cursor.
Forced-colors mantiene tinta y cursor de sistema.

### Text Reveal

**Inspiración:** MagicUI, text reveal, licencia MIT. Código original. `motion/react` segmenta por
palabra o por carácter Unicode y, cuando 45% del renglón entra al viewport, escalona opacidad,
blur y elevación. La copia sin segmentar queda en un nodo `sr-only`; todos los fragmentos visuales
son `aria-hidden`, por lo que el orden y los espacios de lectura no cambian.

`useReducedMotion` evita el estado inicial oculto y el trigger de viewport. Además, overrides CSS
con `!important` dejan `transform:none`, `opacity:1` y `filter:none` incluso antes de hidratar.
Forced-colors aplica la misma geometría estática con `CanvasText`.

### Word Rotate

**Inspiración:** MagicUI, word rotate, licencia MIT. Código original. `AnimatePresence` rota una
lista con salida/entrada vertical, perspectiva, fade y blur. Una copia invisible de la palabra más
ancha reserva el espacio y evita que el texto vecino salte. La palabra visual es `aria-hidden`; un
nodo simple mantiene el valor actual en el árbol accesible. Los anuncios son opt-in porque un
claim promocional rotando continuamente no debe interrumpir a un lector de pantalla.

Reduced-motion cancela el `setInterval`, fija la primera palabra y neutraliza transform, blur y
opacidad. Forced-colors hace estática la geometría y usa `CanvasText`.

### Contraste y herencia

Los cinco heredan fuente, tamaño, peso y `currentColor`; el efecto no comunica información ni
reemplaza el texto base. Por eso el contrato documenta que quien integra debe proporcionar una
pareja host de al menos 4,5:1. Las previews usan tinta `#171817` sobre el gradiente claro
`#f4f2ec → #d8ff66`: el peor extremo medido es **15,61:1** (15,90:1 en el otro), muy por encima
del mínimo. En forced-colors Chromium computó `CanvasText` negro sobre `Canvas` blanco.

### Self-containment y movimiento real

Todos los `var()` locales tienen fallback literal y `verify-registry` confirmó ausencia de
dependencias de `:root`, globals.css o clases del chrome. Shiny y Gradient solo declaran el cierre
real de `cn`; Typewriter, Reveal y Rotate declaran además exactamente `motion`.

La sonda de Chromium se ejecutó sobre el elemento dueño de cada efecto:

| Componente / capa | `getAnimations()` observado | Propiedad real |
|---|---|---|
| Shiny, copia decorativa | `CSSAnimation: mq-shiny-text-sweep` | `background-position-x/y` |
| Gradient, copia decorativa | `CSSAnimation: mq-gradient-text-flow` | `background-position-x/y` |
| Typewriter, cursor | `CSSAnimation: mq-typewriter-cursor` | `opacity`; el texto avanza por estado JS |
| Text Reveal, segmento | `Animation` de Motion | `opacity`, `filter`; `transform` computado cambió durante la elevación |
| Word Rotate, palabra saliente | `Animation` de Motion | `opacity`, `filter`; `matrix3d` computada cambió durante el flip |

No apareció ninguna `CSSTransition` ni propiedad Tailwind fantasma. Bajo reduced-motion los cinco
devolvieron cero animaciones: Shiny quedó `display:none` en su overlay, Gradient y cursor
`animation-name:none`, Reveal en `opacity:1/filter:none/transform:none` y Rotate mantuvo
`tactile` estable después de 1,9 s.

## Resultado esperado vs. real

- **Esperado:** 36 entries, cinco rutas nuevas SSG y efectos estables sin movimiento solicitado.
- **Real:** `verify-registry` reportó exactamente 36 componentes self-contained y Next generó 43
  páginas estáticas, incluidas las cinco fichas nuevas.
- Chromium recibió HTTP 200 y mostró encabezado, preview y código fuente real en las cinco rutas;
  registró cero `console.error` y cero `pageerror`.
- Typewriter avanzó de `Build wi` a `Build with rh` en 320 ms; Word Rotate cambió de `tactile` a
  `precise`; Text Reveal mostró opacidad, blur y matriz de traslación intermedias reales.

## Bugs / obstáculos y cómo se resolvieron

1. **PR #38 chocaba con main únicamente en `docs/CREDITS.md`.** Se actualizó su rama en un
   worktree aislado con la estrategia solicitada, se empujó con lease y se mergeó. Así el worktree
   compartido de Claude Code no se cambió de rama.
2. **La primera sonda de Word Rotate no encontró una animación activa.** `networkidle` ya había
   consumido parte del intervalo y el muestreo fijo llegó tarde. Se reemplazó el reloj por una
   espera condicionada al cambio del nodo accesible y se muestreó inmediatamente; entonces
   `getAnimations()` devolvió las animaciones de opacidad/filtro y la `matrix3d` intermedia.
3. **La sesión del sitio conservaba español.** La prueba dejó de depender de copy traducible:
   comprobó estructura, slug/ruta, preview visible y bloque de código. Los `h1` en español
   coincidieron con las entries bilingües.

## Verificación (gate)

- `npm ci` — ✅ dependencias instaladas y lockfile sin cambios.
- Contrato TDD efímero fuera del repo — ✅ RED por archivos ausentes y GREEN final con los cinco.
- ESLint dirigido y TypeScript después de cada tanda — ✅.
- Revisión React — ✅ timers con cleanup, hooks incondicionales, listas estáticas con keys
  estables, contenido accesible sin duplicación y cero listeners persistentes.
- `npm run check` — ✅ lint, typecheck, verify-studio, verify-registry y build.
- Registry — ✅ `{"components":36,"selfContained":true,"guards":"ok","status":"ok"}`.
- Next 16 / Turbopack — ✅ 43/43 páginas estáticas; las cinco rutas nuevas son SSG.
- Playwright CLI + Chromium — ✅ HTTP 200, render real, movimiento, reduced-motion,
  forced-colors y cero errores de consola/runtime.

`npm audit --audit-level=high` encontró tres advisories transitivos ya presentes en Next
(PostCSS moderado y dos de `sharp`/libvips altos). La corrección automática propuesta intenta
instalar Next 9.3.3 con `--force`, una regresión incompatible; no se alteraron dependencias fuera
del guardarraíl.

## Riesgos, deuda y pendientes

- Typewriter y Word Rotate usan un timer por instancia, ambos con cleanup. Una vista con cientos
  de instancias podría necesitar un coordinador compartido, fuera del alcance de componentes
  copy-and-own.
- El modo letra de Reveal usa puntos de código Unicode (`Array.from`), suficiente para la mayoría
  del texto; graphemes complejos con ZWJ podrían requerir `Intl.Segmenter` en una futura API.
- Los efectos heredan contraste deliberadamente: fuera de las previews, una pareja de colores
  deficiente del host seguirá siendo responsabilidad de quien integra.
- La auditoría de dependencias debe resolverse cuando Next publique/seleccione versiones de
  PostCSS y sharp corregidas sin downgrade mayor.

## Estado final

Completo. Los cinco componentes, previews, entries y reporte están listos; gate y navegador real
permanecen verdes con 36 componentes.
