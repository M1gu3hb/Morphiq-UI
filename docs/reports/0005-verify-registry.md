# Reporte 0005 — Suite verify-registry

- **Autor:** Codex
- **Fecha:** 2026-07-20
- **Rama:** `chore/verify-registry` · **Commit final:** ver PR (commit `chore: add registry contract gate`)
- **Tipo:** chore
- **Prompt recibido:** Fase 1, Ronda 2. Crear una verificación automática del contrato del registry, integrarla al gate y cerrar los dos huecos detectados por la auditoría: drift de ids del preview y `sourcePath` desacoplado del componente.

## Objetivo

Convertir el contrato documental del registry en una red de seguridad ejecutable. La suite
debe rechazar entradas inconsistentes, componentes que dejen de ser autocontenidos,
manifiestos de dependencias desincronizados y código del registry que no compile.

## Qué se hizo

- `scripts/verify-registry.mjs` — suite en Node puro, sin framework de test. Valida todas
  las entradas de `registry`, los dos guards de auditoría, autocontención, manifiestos de
  dependencias y compilación TypeScript.
- `package.json` — agrega `test:registry` y lo encadena en `check` después de
  `test:studio` y antes de `build`.
- `docs/reports/0005-verify-registry.md` — este reporte.

No se modificó ningún archivo bajo `src/`, ni `scripts/verify-studio.mjs`, ni el workflow
de CI.

## Cómo se hizo

**Integridad derivada del contrato.** La suite usa el parser de TypeScript ya instalado
para leer `RegistryEntry`, `RegistryCategory` y el array `registry`. Los nombres de campos
y categorías salen del AST de `schema.ts`, en lugar de mantener una segunda copia manual.
Sobre cada entrada comprueba campos completos, slug único/kebab-case/ordenado, materiales
permitidos y no vacíos, opciones no vacías con ids únicos y rutas internas existentes.

**Guard de `sourcePath` (hallazgo 2).** Exige literalmente la convención
`src/registry/ui/<slug>.tsx` y después confirma que el archivo exista y permanezca dentro
del repo. Así una entrada copiada no puede publicar por accidente el fuente de otro
componente bajo el sello “Real source”.

**Guard de ids del preview (hallazgo 1).** Localiza
`src/registry/previews/<slug>-preview.tsx`, lo parsea y exige que cada id declarado en
`variants` y `sizes` exista como literal de texto en ese archivo. También prohíbe ambos
arrays vacíos. Esto detecta el drift que antes terminaba coaccionado silenciosamente a un
default.

**Autocontención.** Se lee `globals.css` y se confirma que siguen declaradas las 13
variables de sitio prohibidas. Para cada `sourcePath`, un escáner preserva posiciones pero
enmascara comentarios; después inspecciona cada llamada `var(...)` con balanceo de
paréntesis y exige una coma de fallback en el nivel superior. Una fuga informa archivo,
línea, variable y si pertenece al sitio. En paralelo, las clases se extraen de los
selectores reales de `globals.css`; los literales usados en contextos de estilo
(`className`, `cn`, `clsx`, `cva` y `tv`, incluidos template literals y constantes
referenciadas) no pueden reutilizar ninguna de ellas.

**Manifiesto fiel.** Se recorren imports/re-exports estáticos desde el componente y, de
forma transitiva, desde sus archivos internos. Los imports `@/` y relativos se resuelven a
rutas POSIX del repo; los paquetes se normalizan a su nombre raíz. Los dos conjuntos se
comparan en ambos sentidos con `dependencies.internal` y `dependencies.npm`, por lo que
detectan faltantes y fantasmas. `react`/`react-dom` se permiten como peers implícitos del
host, pero si se declaran solo dejan de ser fantasma cuando realmente se importan.

**TypeScript Windows-safe.** La suite crea un `tsconfig` temporal que extiende el real e
incluye todos los `.ts`/`.tsx` de `src/registry`. Invoca
`node node_modules/typescript/bin/tsc --project ...` mediante `process.execPath` y
`execFileSync`, igual que `verify-studio`, sin depender del shim `.bin/tsc`. El temporal se
elimina siempre en `finally`.

## Resultado esperado vs. real

- **Esperado:** el Button existente satisface todo el contrato y la suite imprime un
  resumen JSON antes de permitir el build.
- **Real:** `test:registry` termina con
  `{"components":1,"selfContained":true,"guards":"ok","status":"ok"}` y el gate completo
  queda en verde.
- Se observó primero el RED esperado: tras integrar el comando, falló con
  `MODULE_NOT_FOUND` porque `verify-registry.mjs` aún no existía. Después de implementar la
  suite, el mismo comando quedó verde.

## Bugs / obstáculos y cómo se resolvieron

1. **La fundación aún no estaba en `main`.** El remoto mostraba PR #2 abierto, aunque el
   primer contexto decía que ya estaba mergeado. Se verificaron refs y estado del PR antes
   de editar. La rama se creó sobre `feat/component-engine`, como especifica el prompt
   corregido; el PR contra `main` queda apilado y depende explícitamente de #2.
2. **El manifiesto de Button parecía tener fantasmas si solo se miraba el archivo
   principal.** `clsx` y `tailwind-merge` son imports de `src/lib/cn.ts`, no de
   `button.tsx`. La comparación recorre el cierre transitivo de dependencias internas, que
   representa lo que el usuario realmente debe copiar/instalar.
3. **Resolución futura de módulos con sufijos.** El resolver prueba siempre el path exacto,
   extensiones conocidas e índices, de modo que imports como `./foo.client` no se confundan
   con una extensión ya resuelta.

## Verificación (gate)

- `npm run lint` — ✅ sin errores.
- `npm run typecheck` — ✅ `next typegen` + `tsc --noEmit` limpios.
- `npm run test:studio` — ✅ `{"templates":5,...,"status":"ok"}`.
- `npm run test:registry` — ✅ 1 componente, autocontención y guards en `ok`.
- `npm run build` — ✅ Next 16.2.10; 8 páginas, `/components/button` prerenderizada como SSG.
- `npm run check` — ✅ exit code 0 con el nuevo orden completo del gate.

El preflight también quedó verde antes de editar. `npm ci` conserva 2 avisos moderados
transitivos ya conocidos; no forman parte del gate y no se aplicó un cambio forzado de
dependencias.

## Riesgos, deuda y pendientes

- El análisis de imports es deliberadamente estático/best-effort: imports dinámicos,
  `require()` construido o aliases nuevos fuera de `@/` requerirán ampliar el parser.
- Encontrar un id como literal en el preview prueba cobertura nominal, no demuestra por sí
  solo que cada rama produzca el render correcto. Un test de interacción sería un guard más
  fuerte en una fase posterior.
- La detección de clases globales compara tokens estáticos. Puede rechazar una coincidencia
  legítima con un nombre global (falso positivo) y no ve nombres ensamblados enteramente en
  runtime (falso negativo).
- El fallback de `var()` se valida sintácticamente por la coma superior; no intenta evaluar
  si el valor CSS del fallback es válido en el navegador.
- La suite presupone que `RegistryEntry` y `registry` permanecen declarados como literales
  estáticos. Si el registry se genera dinámicamente, el verificador debe evolucionar junto
  con esa decisión de arquitectura.
- Este PR depende de la fundación de PR #2 hasta que esa rama se integre en `main`.

## Estado final

Completo. Suite implementada, Button validado, gate integrado y verde. El único pendiente
externo es que PR #2 entre en `main` antes (o junto) con este PR apilado.
