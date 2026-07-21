# Reporte 0023 — Textarea y Skeleton

- **Autor:** Claude
- **Fecha:** 2026-07-20
- **Rama:** `feat/textarea-skeleton` · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 12. Dos componentes en una sesión — Textarea (slug `textarea`, categoría `inputs`) y Skeleton (slug `skeleton`, categoría `feedback`) — con un solo PR y un solo reporte combinado. Cada componente debe cumplir el mismo estándar de calidad; no recortar por hacer dos.

## Objetivo

Añadir dos componentes de producción autocontenidos sin editar ningún archivo compartido.
Textarea completa la familia de campos de formulario junto a Input; Skeleton abre la
categoría `feedback` con un marcador de carga. Los dos debían medir contraste real antes de
afirmar nada sobre él, apagar el movimiento bajo `prefers-reduced-motion` y sobrevivir a
`forced-colors`.

## Qué se hizo

- `src/registry/ui/textarea.tsx` — `Textarea` (control desnudo) y `TextareaField`
  (etiqueta + control + mensaje), cuatro materiales, tres tratamientos, tres tamaños y
  autocrecimiento opcional.
- `src/registry/previews/textarea-preview.tsx` — copia distinta por material, estados
  `error` y `disabled`, cobertura de todos los ids de variante y tamaño.
- `src/registry/entries/textarea.ts` — entrada `inputs` con metadatos bilingües.
- `src/registry/ui/skeleton.tsx` — `Skeleton` con `line | circle | rect`, tres tamaños y
  `@keyframes` propios que viajan dentro del componente.
- `src/registry/previews/skeleton-preview.tsx` — composición avatar + líneas dentro de una
  región `aria-busy` / `role="status"`.
- `src/registry/entries/skeleton.ts` — entrada `feedback` con metadatos bilingües.
- `docs/reports/0023-textarea-y-skeleton.md` — este reporte.

No se editó `package.json`, el índice generado, schema, scripts, app, globals ni ningún otro
componente. El índice que regeneran los hooks está gitignorado.

---

# Componente 1 — Textarea

## Cómo se hizo

### Forma de la API

Espeja a `Input` deliberadamente: quien ya conoce uno conoce el otro. `Textarea` es el
control desnudo y `className` apunta al `<textarea>`; `TextareaField` compone etiqueta,
control y mensaje y hace el cableado de `htmlFor`, `aria-describedby` y `aria-invalid`.

El componente no guarda estado propio, así que no hay nada que se pueda desincronizar: se
controla con `value` + `onChange` o se deja al DOM con `defaultValue`, exactamente como un
`<textarea>` nativo.

`MATERIAL_TOKENS` se aplica dos veces: al control y al contenedor de `TextareaField`. No es
redundancia — el mensaje de error es **hermano** del control, no descendiente, así que nunca
podría heredar `--mq-error` de él. Se verificó en el navegador: con el estado `error`, el
borde del control y el color del mensaje resuelven ambos a `rgb(156, 47, 34)` (`#9c2f22`).

### Orden de los ejes en CVA

`variant` se declara **después** de `size` a propósito. `underline` necesita anular el
padding y el radio que fija el eje de tamaño; si se declarara antes, CVA emitiría sus clases
primero y `tailwind-merge` dejaría ganar a las de tamaño.

### Autocrecimiento

`fitToContent()` pone `height = "auto"` **antes** de leer `scrollHeight`. Sin ese reset la
altura solo puede subir, porque `scrollHeight` nunca puede reportar menos que la altura ya
fijada. Medido contra el build de producción: 82px en reposo → 145px con seis líneas → **de
vuelta a 82px** al acortar el texto, y `scrollHeight <= clientHeight` en todo momento (sin
barra de scroll fantasma).

El tirador de redimensionado nativo se conserva por defecto. Solo se quita con `autoResize`,
donde una altura arrastrada a mano sería sobrescrita de inmediato por la medida. Quitarle al
usuario un control que ya tenía sería un retroceso, no una mejora.

## Hallazgo: `box-shadow` fantasma en la lista de transición

La lista original era `transition-[border-color,box-shadow,background-color,opacity]`, con un
comentario que decía «exactamente las propiedades que cambian — nada fantasma» y mencionaba
«la sombra en el foco».

Al verificar contra el build de producción resultó **falso**. En el archivo no hay ninguna
sombra salvo `shadow-none` en la variante `underline`, y el foco no usa `box-shadow` sino
`outline`. Es decir: el comentario afirmaba una cosa y el código hacía otra, justo el
defecto que ese comentario decía evitar.

Se corrigió a `transition-[border-color,background-color,opacity]` y se reescribió el
comentario explicando además por qué `outline` **tampoco** está en la lista: un anillo de
foco tiene que estar en el instante en que llega el foco, no aparecer con un fundido de
200ms. Verificado después del arreglo: `transition-property` computa exactamente
`border-color, background-color, opacity`.

## Verificación en navegador (build de producción)

Contra `next start`, no contra `next dev`. Se cancelaron las animaciones con
`getAnimations()` antes de leer estilos computados, porque el compositor del panel está
congelado y las transiciones reportan su valor **inicial** si no se cancelan.

| Comprobación | Resultado |
|---|---|
| `transition-property` | `border-color, background-color, opacity` |
| `aria-invalid` en estado error | `"true"` |
| Borde con error | `rgb(156, 47, 34)` = `#9c2f22` |
| Color del mensaje de error | `rgb(156, 47, 34)` — mismo token, hermano incluido |
| `<label for>` ligado al control | sí, `aria-describedby` compuesto |
| Región del mensaje | siempre montada, `aria-live="polite"` |
| Autocrecimiento | 82px → 145px → 82px, sin barra de scroll |
| `disabled` | atributo real + `opacity: 0.55` |
| Outline en reposo | `outline-style: none` (no se pinta nada) |
| Outline con foco | `solid`, 2px, offset 2px, `rgb(23, 24, 23)` = `--mq-ring` |
| Variantes | default `#fdf6f0`; filled `#f4e7db` + borde transparente; underline fondo transparente + borde inferior |

## Contraste (medido, luego escrito)

Calculado en Node desde los valores autorados y contrastado con los estilos computados del
build. **48 combinaciones, 0 fallos**, suelo 4,5:1 — al placeholder se le exige la misma vara
que al texto de cuerpo.

- **Mínimo absoluto:** placeholder de vidrio **5,14:1**, compuesto sobre negro puro. Ese es
  precisamente el motivo de que el vidrio lleve su propio tinte.
- **Mínimo en materiales opacos:** placeholder de clay relleno **5,89:1**.
- **Texto escrito:** nunca baja de **10,55:1**.
- **Underline** no tiene superficie propia por diseño, así que su contraste lo pone la
  página: 6,22:1–12,17:1 en placeholders y desde 12,71:1 en texto, sobre el fondo papel
  (`#f1efe9`) y sobre blanco.
- **Mensaje de error:** 6,42:1 o mejor sobre esas mismas superficies.

Etiqueta y texto de ayuda heredan el color del anfitrión en vez de fijar uno, porque van
sobre la superficie de la página y no sobre la nuestra. El mensaje de error sí fija color
porque ahí el color transmite significado.

---

# Componente 2 — Skeleton

## Cómo se hizo

### Los `@keyframes` viajan dentro del componente

Era el problema de diseño interesante de la ronda. El brillo necesita `@keyframes` propios,
`globals.css` está fuera de límites, y meter la regla en una hoja global rompería el contrato
de «copiar el archivo es toda la instalación».

Solución: emitirlos con el hoisting deduplicado de React 19 —
`<style href="mq-skeleton-shimmer" precedence="medium">`. React deduplica por `href`.

**Verificado, no asumido.** En la página con **4 instancias** de Skeleton:

- HTML preprerenderizado: **1** etiqueta `<style data-precedence="medium" data-href="mq-skeleton-shimmer">`.
- CSSOM en runtime: **1** `CSSKeyframesRule` llamada `mq-skeleton-shimmer`.
- Las otras dos apariciones del texto `@keyframes` en el HTML son el **código fuente del
  componente**, que la página de documentación muestra — no reglas duplicadas.
- Cada instancia: `animation-name: mq-skeleton-shimmer`, `1.6s`, `infinite`, `playState: "running"`.

### Por qué `background-position` y no `transform`

Animar la posición del fondo no necesita un pseudo-elemento extra y no puede colisionar con
un `transform` que ponga quien lo use. Además evita por completo la trampa de Tailwind v4 con
`translate`/`transform` que costó la Ronda 4.

### Colores separados como propiedades explícitas

`[background-color:…]` y `[background-image:…]` en vez de dos utilidades `bg-*`. Si se
usaran `bg-[color]` y `bg-[linear-gradient(...)]`, `tailwind-merge` las metería en el mismo
grupo y **una descartaría silenciosamente a la otra**.

Eso también hace trivial el estado de movimiento reducido: basta con quitar la imagen y queda
el color plano.

### Movimiento reducido: estático, no parpadeante

`motion-reduce:animate-none` + `motion-reduce:[background-image:none]`. El resultado es un
bloque plano y quieto, no un pulso más lento. Un marcador que sigue latiendo es exactamente
lo que alguien con sensibilidad al movimiento pidió no ver.

Ambas reglas se verificaron en el CSSOM y **coinciden con el elemento real**
(`el.matches(selector)`), igual que las tres de `forced-colors`. La regla es autosuficiente:
no depende del reset global de la página.

### Accesibilidad: calla el marcador, habla la región

Cada Skeleton lleva `aria-hidden="true"` (verificado en el DOM). Marcar cada barra anunciaría
«cargando» una vez por barra, que es ruido y no información. El preview demuestra el patrón
correcto: la región envolvente lleva `aria-busy`, `aria-live="polite"` y `role="status"`, más
una etiqueta oculta visualmente que es lo único que queda por anunciar.

## Hallazgo: los rellenos originales eran invisibles

La primera pasada usaba tonos «sutiles» elegidos a ojo. Al medirlos:

| Material | Relleno original | Contra la página |
|---|---|---|
| clay `#e9ddd2` | | **1,16:1** |
| glass `rgba(255,255,255,0.55)` | | **1,08:1** |
| skeuo `#cfcbc2` | | 1,41:1 |
| adaptive `#e5e4e0` | | **1,11:1** |

1,08:1 no es sutil: es invisible. Un marcador de carga que no se ve deja la interfaz como una
página en blanco, que es justo lo contrario de su única función.

Un marcador decorativo está **exento** de la 1.4.11 de WCAG, así que aquí no falla ninguna
norma. Aun así se les impuso un suelo propio de **1,35:1**, y se corrigieron los rellenos.

El vidrio fue el caso difícil: un relleno translúcido toma su luminosidad de lo que tiene
detrás, así que **ningún tinte único sobrevive a fondo blanco y a fondo negro a la vez**. Se
le dieron los dos: un lavado oscuro que lo sostiene sobre superficies claras y un borde
luminoso que lo sostiene sobre las oscuras — que además es como se ve el vidrio esmerilado de
verdad.

### Valores finales (medidos)

| Material | Peor caso | Cómo |
|---|---|---|
| clay `#ddcaba` | **1,38:1** | relleno, sobre papel |
| skeuo `#cfcbc2` | **1,41:1** | relleno, sobre papel |
| adaptive `#d0cec6` / `#313137` | **1,37:1** | relleno, sobre papel (claro) / tinta (oscuro) |
| glass `rgba(41,37,32,0.16)` + borde `rgba(255,255,255,0.45)` | **1,36:1** | lavado 1,36:1 sobre papel y 1,37:1 sobre blanco; sobre negro el lavado solo daría 1,04:1 y lo sostiene el borde con **4,63:1** |

Confirmado en el navegador: en glass el `background-color` computa `rgba(41, 37, 32, 0.16)` y
el `box-shadow` `rgba(255, 255, 255, 0.45) 0px 0px 0px 1px inset`; en el resto de materiales
`--mq-edge` cae a `transparent` y no dibuja nada.

---

## Gate

```
npm run check
{"entries":16,"slugs":[...,"skeleton",...,"textarea",...],"written":false}
{"components":16,"selfContained":true,"guards":"ok","status":"ok"}
✓ Compiled successfully
✓ Generating static pages (23/23)
```

`/components/textarea` y `/components/skeleton` se prerenderizan como SSG
(`.next/server/app/components/textarea.html` y `skeleton.html` existen). `components:16` es
el número esperado.

## Lo que no se hizo

- **No se probó `prefers-reduced-motion` ni `forced-colors` activándolos de verdad.** El
  panel no expone esos ajustes. Lo que sí se hizo fue confirmar en el CSSOM que las cinco
  reglas existen y que `el.matches(selector)` es verdadero contra el elemento real, que es
  evidencia de que aplicarían, no de que se vean bien aplicadas.
- **No se probó con lector de pantalla real.** Las afirmaciones de accesibilidad son sobre
  atributos y estructura verificados en el DOM, no sobre lo que anuncia NVDA o VoiceOver.
- **El contraste del vidrio se calculó sobre fondos sintéticos** (papel, blanco, negro), no
  sobre todos los fondos posibles en los que alguien podría ponerlo.
- Los eventos de teclado siguen sin poder sintetizarse en este panel (`event.key` llega
  vacío), así que el anillo de foco se verificó por el hook `data-focus` del preview, no
  tabulando de verdad.
