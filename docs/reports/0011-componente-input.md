# Reporte 0011 — Componente Input

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `feat/component-input` (desde `main`) · **Commit final:** ver PR
- **Tipo:** feature
- **Prompt recibido:** Fase 1, Ronda 6. Construir el componente Input (campo de texto) creando solo sus tres archivos, en paralelo con Codex que construye Badge.

## Objetivo

Añadir un campo de texto de producción al registry y, de paso, ser la primera prueba real del
registro auto-ensamblado: dos ejecutores agregando componentes a la vez sin compartir ningún
archivo.

## Qué se hizo

**Paso 0 (autónomo).** Mergeé los PRs #9 (registro auto-ensamblado) y #8 (cobertura de
transiciones) yo mismo. `main` quedó en `fcf3e9d` con `entries/{button,card,toggle}.ts`
presentes y el gate en verde.

**Tres archivos, ninguno compartido:**

- `src/registry/ui/input.tsx` — `Input` e `InputField`.
- `src/registry/previews/input-preview.tsx` — preview `PreviewProps`.
- `src/registry/entries/input.ts` — la `RegistryEntry`.

No se tocó `index.ts`, ni `generated.ts`, ni `verify-registry.mjs`, ni `package.json`, ni
ningún otro componente. El catálogo y la ruta `/components/input` aparecieron solos.

## Cómo se hizo

### La API de label/error, y por qué

El componente se exporta en **dos piezas**:

- **`Input`** — el control desnudo. `className` apunta al `<input>`, que es lo que uno espera
  de algo llamado "Input". No guarda estado propio: `value` + `onChange` para controlarlo,
  `defaultValue` para dejárselo al DOM. Sin estado interno no hay nada que se desincronice.
- **`InputField`** — la composición: `label` + control + mensaje, con el cableado hecho.

La razón de que exista `InputField` es concreta: **asociar la etiqueta es justo la parte que
se hace mal**. Un `<label>` sin `htmlFor`, un `aria-describedby` que pisa el del llamador, un
mensaje de error que se ve pero no se anuncia. Dejar eso "documentado" garantiza que alguien
lo rompa; hacerlo en la librería, no. Decisiones concretas dentro de `InputField`:

- El id sale de `useId()` salvo que pases el tuyo; el `<label htmlFor>` apunta a él.
- **`aria-describedby` se compone, no se sobrescribe.** Si el llamador ya trae una
  descripción, sobrevive junto a la nuestra.
- **`aria-invalid` es la única fuente de verdad del error.** El estilo de error se activa con
  el selector `aria-[invalid=true]`, no con una clase paralela, así que lo que se ve y lo que
  se le dice a la tecnología de asistencia **no pueden desincronizarse**. `errorText` implica
  invalidez.
- **La región del mensaje está siempre montada, incluso vacía.** Es deliberado: una región
  `aria-live` tiene que existir en el DOM *antes* de que llegue el texto para que el anuncio
  sea fiable. Un contenedor que apareciera junto con el error se lo perdería a menudo.

### Ejes

- **`variant: default | filled | underline`** — los tres tratamientos reales de un campo de
  texto (caja con borde, relleno sólido sin borde hasta el foco, y solo regla inferior). El
  eje se declara **después** de `size` en el CVA a propósito, para que `underline` pueda
  quitar el radio y el padding que fija el tamaño.
- **`size: sm | md | lg`** — 34/42/50 px de alto, con padding, tipografía y radio
  proporcionales. Verificado en el DOM: 34/42/50, `px` 10/13/16, `font-size` 12/13/14,
  radio 10/13/16.

### Self-containment

Igual que Button, Card y Toggle: utilidades Tailwind con valores arbitrarios y paleta en
variables `--mq-*` declaradas sobre el propio control, **siempre** con fallback literal. Cero
clases de `globals.css`, cero vars de `:root`. `verify-registry` lo comprueba solo y pasa.

Un detalle que hubo que resolver: **el mensaje de error es hermano del control, no
descendiente**, así que nunca podría heredar `--mq-error` declarada en el `<input>`. Por eso
la paleta vive en una constante `MATERIAL_TOKENS` que se aplica dos veces: al control (lo que
hace que un `<Input>` suelto sea autocontenido) y al envoltorio de `InputField` (lo que
permite que el mensaje use el color de error real del material en vez de caer al literal por
defecto).

### Cobertura de transición

Siguiendo la convención que fijó el reporte 0010, la lista contiene **exactamente** lo que
cambia entre estados y nada fantasma: `transition-[border-color,box-shadow,background-color,opacity]`.
Verificado con `getAnimations()` en el navegador, que responde si el navegador *creó* la
transición y no depende de muestrear a mitad de vuelo:

| Propiedad cambiada | `CSSTransition` creada |
| --- | --- |
| `border-color` | sí (las cuatro `border-*-color`) |
| `background-color` | sí |
| `box-shadow` | sí |
| `opacity` | sí |
| `translate` (deliberadamente **no** listada) | **no** |

Es decir: las cuatro declaradas animan de verdad, y una no declarada no cuela.

### Contraste

Calculado con la fórmula WCAG sobre los valores fuente y **contrastado después contra los
colores computados en el DOM**, que coincidieron exactamente.

- **Texto escrito y placeholder ≥ 4.5:1 en los cuatro materiales y en los tratamientos
  `default` y `filled`.** Al placeholder se le exigió la misma vara que al texto de cuerpo.
- Mínimo absoluto: **placeholder de vidrio 5.14:1** compuesto sobre negro puro — que es
  precisamente para lo que el vidrio lleva tinte propio (sobre blanco da 12.17:1).
- Mínimo en materiales opacos: **placeholder de clay relleno 5.89:1**. El texto escrito nunca
  baja de 10.55:1.
- `underline` no tiene superficie propia por diseño, así que su contraste lo pone la página:
  medido 6.22–12.17:1 en placeholders y desde 12.71:1 en texto, sobre el papel de Morphiq y
  sobre blanco.
- Etiqueta y texto de ayuda heredan `currentColor` (van sobre la superficie del anfitrión, no
  sobre la nuestra). El **mensaje de error sí conserva color explícito**, porque ahí el color
  transmite significado: mide 6.42:1 o más sobre esas mismas superficies.
- `adaptive` en esquema oscuro: texto 13.62:1, placeholder 7.80:1, error 7.80:1.

## Resultado esperado vs. real

- **Esperado:** Input en el registry, `/components/input` estática, gate verde. **Real:**
  cumplido. El build pasa a 11 páginas con `/components/input` bajo `● (SSG)` y el catálogo
  muestra "4 components" con la tarjeta enlazando a su ficha.
- **Diferencia:** el prompt anticipaba `verify-registry` reportando `components:5`. Reporta
  **`components:4`**, y es lo correcto: `main` traía 3 componentes (Button, Card, Toggle) y el
  mío es el cuarto. El quinto será el Badge de Codex cuando se mergee. El texto de contexto
  del prompt decía "4 componentes" pero listaba tres.

## Bugs / obstáculos y cómo se resolvieron

1. **El mensaje de error no habría tomado el color del material.** Detectado al escribir, no
   al probar: `--mq-error` se declaraba en el `<input>` y el `<p>` del mensaje es su hermano,
   así que habría caído siempre al fallback literal `#9c2f22` — mal en vidrio y skeuo
   (`#8f2a1e`) y sobre todo en adaptive oscuro (`#ff9d8e`, que debe ser claro). Solución:
   extraer la paleta a `MATERIAL_TOKENS` y aplicarla también al envoltorio.
2. **Afirmé una cifra de contraste equivocada en la entrada.** Escribí "el mínimo es el
   placeholder de skeuo con 7.04:1" antes de medir; al calcular, el mínimo real resultó ser el
   **placeholder de vidrio con 5.14:1** sobre negro. Corregido el texto de `a11y`/`a11yEs`
   para que diga lo que miden de verdad los valores. Vale la pena señalarlo porque es
   exactamente el tipo de afirmación que el auditor no puede verificar de un vistazo.

## Limitación del diseño que debo reportar (no la resolví por el guardarraíl)

`PreviewState` es `default | focus | loading | disabled`. **Un campo de texto no tiene estado
de carga, pero sí tiene estado de error**, que es el que un lector necesita ver — y no hay
slot para él. Añadir `error` a `PreviewState` significaría editar
`src/registry/schema.ts`, que es compartido y que este guardarraíl prohíbe.

Lo que hice: el preview reutiliza el slot `loading` para mostrar el campo inválido, y **el
texto renderizado lo dice en voz alta** ("this is the error state") en vez de disimularlo.
Está documentado en el comentario del preview y aquí.

Lo que recomiendo: añadir `"error"` a `PreviewState` en una ronda de mantenimiento. Es un
cambio de una palabra en `schema.ts`; los previews existentes no se rompen porque el switcher
solo ofrece los estados declarados. **No es una falla del registro auto-ensamblado** —ese
funcionó exactamente como se prometió, no toqué nada compartido— sino un límite del esquema de
previews, que se diseñó pensando en botones.

## Verificación (gate)

`npm run check` en verde (**exit code 0**):

- `registry:gen` — `{"entries":4,"slugs":["button","card","input","toggle"]}` (descubierto solo).
- `npm run lint` — ✅.
- `npm run typecheck` — ✅.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":4,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 11 páginas, sin warnings, `/components/input` bajo `● (SSG)`.

Verificación adicional contra el DOM real (estilos medidos sobre clones con
`transition: none` para no leer interpolaciones en vuelo):

- **Cableado de accesibilidad:** `<label for>` real que coincide con el `id` del input;
  `aria-describedby` resuelve a un nodo montado con `aria-live="polite"`; el mensaje existe
  también cuando está vacío.
- **Estados:** `default` sin `aria-invalid`; `focus` → `outline solid 2px rgb(23,24,23)`;
  error → `aria-invalid="true"`, borde `rgb(156,47,34)` y el mensaje de error;
  `disabled` → `disabled` nativo y opacidad 0.55.
- **Variantes:** `default` borde completo y radio 13; `filled` fondo `#f4e7db` con borde
  transparente; `underline` `border-top: 0`, solo borde inferior, radio 0 y padding 2px.
- **Materiales:** los cuatro fondos, colores de texto y de placeholder computados coinciden
  exactamente con los valores medidos.
- **Catálogo:** "4 components", la tarjeta `input` enlaza a `/components/input` y el filtro
  por material renderiza el campo en el material elegido.

**Lo que no verifiqué:** no hay revisión visual pixel a pixel (la captura de pantalla del
entorno sigue dando timeout); me apoyé en estilos computados, que para contraste y estado son
más precisos pero no sustituyen mirar el diseño.

## Riesgos, deuda y pendientes

- **`PreviewState` sin `error`**, arriba. Es el pendiente más relevante que deja esta ronda.
- **`InputField` siempre renderiza envoltorio, etiqueta y región de mensaje.** Es lo que hace
  el cableado fiable, pero significa que no sirve para un campo sin etiqueta visible; para eso
  está `<Input>` suelto con `aria-label`. Documentado en el JSDoc.
- **El color de error es fijo por material** (con rama oscura solo en `adaptive`), igual que
  `--mq-ring` en Button y Toggle. Asume superficie clara, que es lo que el producto es hoy.
  Cuando exista tema oscuro real hay que revisar los cuatro.
- **`underline` hereda el contraste del anfitrión** para texto y placeholder, como las
  variantes fantasma/contorno de Button y Card. Medido sobre papel y blanco; sobre un fondo
  oscuro habría que retematizar con `--mq-text`/`--mq-placeholder`.
- **Sin cobertura E2E propia.** El smoke de Codex cubre rutas, no el comportamiento del campo.
  Un test de teclado (escribir, tabular, leer el error) sería el siguiente escalón.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0010.

## Estado final

Completo. Input entregado con 4 materiales × 3 variantes × 3 tamaños, controlado y no
controlado, con la asociación de etiqueta/descripción/error resuelta por la librería, gate
verde y `/components/input` estática — sin tocar un solo archivo compartido, que era además la
prueba de fuego del registro auto-ensamblado.
