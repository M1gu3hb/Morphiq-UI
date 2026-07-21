# Reporte 0009 — Registro auto-ensamblado (sin archivo compartido)

- **Autor:** Claude Code
- **Fecha:** 2026-07-20
- **Rama:** `refactor/registry-autoload` (desde `main`) · **Commit final:** ver PR
- **Tipo:** refactor
- **Prompt recibido:** Fase 1, Ronda 5. Hacer que agregar un componente no requiera editar ningún archivo compartido, para que dos agentes trabajen en paralelo sin colisionar.

## Objetivo

Eliminar el único punto de contención del motor de componentes: `src/registry/index.ts`.
Mientras el array vivía ahí, **todo** autor que agregara un componente tenía que editar ese
archivo, así que dos en paralelo siempre chocaban.

## Qué se hizo

**Paso 0 (autónomo).** Mergeé los PRs #6 (fix `translate` + guard) y #7 (smoke E2E) yo mismo;
`main` quedó en `52bbab7` con `tests/smoke.spec.ts` presente y `button`/`card` ya en
`transition-[translate,…]`. Gate verde antes de ramificar.

**El mecanismo.**

- `src/registry/entries/<slug>.ts` — un `RegistryEntry` por archivo, exportado como `entry`.
  **El nombre del archivo ES el slug.** Ahí se movieron las tres entradas que vivían en
  `index.ts`.
- `scripts/gen-registry.mjs` — escanea `entries/*.ts` y emite `src/registry/generated.ts` con
  imports estáticos literales y el array ordenado por slug.
- `src/registry/generated.ts` — **gitignorado a propósito**.
- `src/registry/index.ts` — pasa a ser una fachada de 3 líneas:
  `export { registry } from "@/registry/generated"` más los re-exports de tipos que ya tenía.
- `package.json` — `registry:gen` + hooks `predev`, `prebuild`, `pretypecheck`,
  `pretest:registry`, `precheck`.
- `scripts/verify-registry.mjs` — descubre las entradas por la nueva convención.

## Cómo se hizo

### La técnica y por qué

**Codegen con imports literales**, no glob en runtime. El catálogo y `/components/[slug]` se
prerenderizan estáticos y Turbopack no tiene un equivalente soportado de `import.meta.glob`,
así que el grafo de módulos tiene que ser literal. Emitir `import` reales mantiene todo
analizable estáticamente: `generateStaticParams`, el tree shaking y el type-check se comportan
exactamente igual que cuando el array estaba escrito a mano.

### La decisión que hace que funcione: el archivo generado NO se commitea

Es el punto no obvio. Si `generated.ts` estuviera versionado, agregar un componente volvería
a tocar un archivo compartido —el generado— y **reintroduciría exactamente el conflicto que
este refactor elimina**. Gitignorarlo es lo que convierte "agregar un componente" en "crear
solo tus propios archivos".

El costo es que el archivo tiene que existir antes de compilar, y de ahí los cinco hooks
`pre*`. Se verificó que **ninguna** vía de entrada se lo salta:

| Vía | Cómo se cubre | Verificado |
| --- | --- | --- |
| `npm run dev` | `predev` | ✅ |
| `npm run build` (también Vercel) | `prebuild` | ✅ |
| `npm run check` (CI `quality`) | `precheck` | ✅ |
| `npm run typecheck` suelto | `pretypecheck` | ✅ |
| `npm run test:registry` suelto | `pretest:registry` — npm sí ejecuta `pre` en nombres con `:` (comprobado) | ✅ |
| `npm run test:e2e` (CI) | Playwright arranca con `npm run build` → dispara `prebuild` | ✅ |
| `npm run lint` suelto | no necesita el archivo; corre exit 0 sin él | ✅ |

### Cómo queda "cero archivo compartido al agregar"

Un componente son **tres archivos propios y nada más**:

```
src/registry/entries/<slug>.ts             la entrada
src/registry/ui/<slug>.tsx                 el componente distribuible
src/registry/previews/<slug>-preview.tsx   su preview
```

Ni `index.ts`, ni `generated.ts`, ni `package.json`, ni ningún índice. El orden sale del
nombre de archivo, así que tampoco hay que mantenerlo a mano.

### Cómo lo probé (el criterio clave)

Simulé un cuarto componente creando **solo** sus tres archivos, sin tocar nada más:

- `npm run registry:gen` → `{"entries":4,"slugs":["button","card","probe","toggle"]}`
- `npm run test:registry` → `{"components":4,…,"status":"ok"}` — los 6 checks y el guard de
  `translate` corrieron sobre él.
- `npm run build` → `/components/probe` prerenderizada como `● (SSG)`.
- El HTML prerenderizado de `/components` contiene las 4 tarjetas: `id="button"`, `id="card"`,
  `id="probe"`, `id="toggle"`.

Y la prueba dura de que no se tocó nada compartido: **sha256 sobre todos los archivos
rastreados y no rastreados, con y sin el componente de prueba, dio el mismo hash**
(`2a699dae0c3f2bfe…`). Es decir, agregarlo no modificó ni un byte de ningún archivo existente.
Después se borró y el árbol volvió a 3 entradas.

Las tres entradas movidas se verificaron **byte a byte** contra `git show main:src/registry/index.ts`
(ignorando CRLF): idénticas. No se reescribió ni una cadena de `a11y`.

### Qué cambió en `verify-registry`

- `readRegistryEntries()` ya no parsea el array de `index.ts`; ahora lee cada
  `entries/<slug>.ts`, localiza `export const entry` y lo evalúa estáticamente con el AST.
  **La carpeta de entradas es la fuente de verdad**: la suite valida lo que un autor escribió,
  no el artefacto, para que un `generated.ts` viejo o editado a mano no pueda hacer pasar una
  entrada rota.
- Nueva aserción: **el nombre del archivo debe coincidir con el `slug`**. Cierra la puerta a
  que dos componentes reclamen la misma ruta y hace que el orden se mantenga solo.
- Nueva aserción: `index.ts` sigue re-exportando `registry` desde `@/registry/generated`.
- Nueva aserción de frescura: `generated.ts` existe y coincide con un render nuevo desde
  `entries/`.
- Todo lo anterior sigue corriendo sin cambios: campos de `RegistryEntry`, categoría,
  materiales, `variants`/`sizes`, cierre de dependencias (faltantes **y** fantasma),
  existencia de `sourcePath` y del preview, cobertura de cada `id` en el preview, fugas de
  self-containment, el guard de `translate`, unicidad de slugs y orden alfabético. La
  compilación `tsc` del proyecto sigue incluyendo `src/registry` completa (ahora también
  `entries/` y `generated.ts`).

### Revisión adversarial y correcciones

Corrí un workflow de 21 agentes en 4 lentes (integridad de build, corrección del codegen,
regresión de la suite, seguridad en paralelo), cada hallazgo pasado por un agente cuyo trabajo
era refutarlo ejecutando comandos, no razonando. **15 hallazgos levantados, 4 sobrevivieron**
(3 distintos), y los tres se corrigieron:

1. **El guard de "módulo principal" no resolvía symlinks** (medio). `import.meta.url` viene
   con la ruta real, pero `process.argv[1]` solo `path.resolve`. En un checkout alcanzado por
   una junction de Windows, `subst` o un symlink (p. ej. `/tmp` en macOS), la comparación daba
   falso y **el script se volvía un no-op silencioso: exit 0, sin escribir nada**, arrastrando
   a los cinco hooks. Reproducido con `mklink /J`. Corregido con `realpathSync(process.argv[1])`.
2. **`localName` no era inyectivo** (bajo). `card-2` y `card2` son ambos slugs válidos y
   ambos producían `entryCard2` — imports duplicados y `TS2300` contra un archivo generado que
   nadie escribió. Causa: capitalizar la primera letra no distingue nada cuando es un dígito.
   Corregido usando `_` como separador (`entry_card_2` vs `entry_card2`); como los slugs son
   `[a-z0-9-]`, el `_` no puede aparecer en uno y el mapeo es inyectivo. Se añadió además una
   comprobación explícita de colisión por si alguien cambia la función.
3. **Cualquier archivo no-`.ts` en `entries/` reventaba el build** (medio). Un `README.md`, un
   `.DS_Store`, una carpeta `__tests__/` o —lo más relevante aquí— los `*.orig`/`*.rej` que
   deja un merge conflictivo hacían que el codegen lanzara y bloquearan dev, build, typecheck
   y el gate. Justo el escenario que la autoría en paralelo hace probable. Corregido: se
   ignora lo que no sea `.ts`, pero un `.ts` con nombre inválido (`Button.ts`, `nav_bar.ts`)
   **sigue fallando ruidosamente**, porque ahí sí hay una intención real y un error real.

## Resultado esperado vs. real

- **Esperado:** registro auto-ensamblado, cero archivo compartido al agregar, todo funcionando
  igual. **Real:** cumplido y probado con el hash idéntico con/sin el cuarto componente.
- **Diferencia:** el prompt ofrecía "hooks" *o* "archivo generado + verificación de frescura".
  Se hicieron **ambos**: los hooks para que nada requiera pasos manuales, y la verificación de
  frescura como red por si el codegen no corrió.

## Bugs / obstáculos y cómo se resolvieron

1. Los tres hallazgos confirmados de la revisión, arriba.
2. **Dos fallos de gate autoinfligidos, no del código.** El primero: lancé el gate en segundo
   plano y a la vez ejecuté sondas que borraban `generated.ts`. El segundo, más instructivo:
   los agentes de revisión corren **en el mismo working tree**, y les pedí explícitamente que
   verificaran ejecutando comandos — así que borraron `generated.ts` y editaron entradas para
   provocar fallos. El síntoma fue un `TS6053` desconcertante junto a un codegen que reportaba
   `written:false`. **Lección: un workflow de revisión que muta el árbol no puede correr en
   paralelo con el gate.** Tras terminar, verifiqué las tres entradas byte a byte contra `main`
   y estaban intactas.
3. **Borré `button.ts` sin querer.** Al probar que un nombre inválido falla, hice
   `touch …/Button.ts`; en Windows el sistema de archivos es *case-insensitive*, así que eso
   tocó el `button.ts` existente y el `rm -f Button.ts` posterior lo **borró**. Como
   `entries/` aún no estaba versionado, git no podía restaurarlo: lo regeneré desde
   `git show main:src/registry/index.ts` y verifiqué byte a byte que quedó idéntico. La prueba
   se rehizo con `nav_bar.ts`, que no colisiona.

## Verificación (gate)

`npm run check` en verde (**exit code 0**), con el registro auto-ensamblado:

- `registry:gen` (vía `precheck`) — `{"entries":3,"slugs":["button","card","toggle"]}`.
- `npm run lint` — ✅.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit`.
- `npm run test:studio` — ✅ `status:"ok"`.
- `npm run test:registry` — ✅ `{"components":3,"selfContained":true,"guards":"ok","status":"ok"}`.
- `npm run build` — ✅ 10 páginas, `/components/button`, `/components/card` y
  `/components/toggle` bajo `● (SSG)`, sin warnings.

## Riesgos, deuda y pendientes

- **`npx tsc --noEmit` a pelo falla en un clon nuevo**, hasta que corra el codegen: el módulo
  generado no existe todavía. La vía soportada es `npm run typecheck` (que tiene
  `pretypecheck`). Mismo efecto en el editor: el tsserver marcará
  `@/registry/generated` hasta el primer `npm run dev` o `npm install`… **y aquí queda una
  mejora que no hice**: un script `prepare` (que npm corre tras `npm install`) dejaría el
  archivo listo justo después de clonar. No lo añadí porque el prompt acota los cambios de
  `package.json` a "solo el script de codegen" y no quise ampliarlo sin permiso; lo dejo
  recomendado y es una línea.
- **La convención "nombre de archivo = slug" es ahora obligatoria** y la suite la exige. Es
  deliberado (da el orden gratis y evita rutas duplicadas), pero significa que renombrar un
  slug implica renombrar su archivo.
- **El guard de identificadores duplicados cubre el codegen, no el schema.** Dos slugs
  distintos que colisionen ya fallan, pero sigue sin haber una comprobación de que un slug no
  choque con una ruta existente de la app (`/components/library`, por ejemplo). Hoy no puede
  pasar porque las rutas son estáticas y distintas; vale la pena tenerlo en mente si el
  catálogo crece.
- **No revisé visualmente** el catálogo renderizado más allá del HTML prerenderizado (la
  captura de pantalla del entorno sigue dando timeout). El HTML sí se inspeccionó y contiene
  las tarjetas correctas.
- `npm audit` sigue con los 2 avisos moderados de PostCSS transitivo, igual que en 0001–0008.

## Estado final

Completo. Agregar un componente ya no toca ningún archivo compartido —probado con hash
idéntico antes y después de añadir uno—, el gate queda verde, las tres rutas siguen siendo
SSG, y los tres hallazgos confirmados de la revisión adversarial están corregidos y
reverificados.
