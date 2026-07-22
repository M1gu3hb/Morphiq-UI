# Equipo y flujo de trabajo

Morphiq UI se construye como un producto en serio, pensado como startup. Este documento
define quién hace qué y cómo se mueve el trabajo desde una idea hasta código en `main`.

## Roles

- **Miguel — dueño.** Define las ideas, la visión de producto y los objetivos. Decide
  prioridades, aprueba direcciones y avisa cuándo los ejecutores terminaron para que
  arranque la revisión.
- **Orquestador / Arquitecto / Auditor** (Claude en Cowork). Audita el código real,
  diseña la solución, redacta los prompts precisos para los ejecutores y revisa cada
  reporte comparándolo contra el código verdadero. Es quien detecta reportes inflados o
  imprecisos y quien emite prompts de corrección.
- **Ejecutores** (Claude Code y Codex). Implementan exactamente lo pedido, sin salirse
  del alcance. Antes de tocar nada auditan el código involucrado; corren el gate
  obligatorio; y al terminar escriben un reporte en `docs/reports/`.

## El ciclo

1. **Idea.** Miguel plantea un objetivo o problema.
2. **Auditoría y diseño.** El orquestador audita el código real involucrado y diseña la
   solución.
3. **Prompt a ejecutor.** El orquestador redacta un prompt preciso y acotado y se lo pasa
   a un ejecutor (Claude Code o Codex).
4. **Implementación + gate + reporte.** El ejecutor implementa lo pedido, corre el gate
   (`npm run check`) hasta dejarlo en verde y escribe un reporte en `docs/reports/`.
5. **Aviso.** Miguel avisa "ya terminaron" para disparar la revisión.
6. **Revisión reporte vs. código.** El orquestador compara el reporte contra el código
   real. Si encuentra un error, emite un **prompt de corrección** que describe:
   qué es, impacto, gravedad y el fix.
7. **Siguiente fase.** Si todo está correcto, se avanza a la siguiente fase; si hubo
   corrección, vuelve al paso 4 con el prompt de corrección.

## Reglas

- **Gate obligatorio.** `npm run check` (lint + typecheck + test:studio + build) debe
  quedar en verde antes de cualquier commit.
- **Ramas.** `feat/<slug>` para features, `fix/<slug>` para bugs, `chore/<slug>` para
  infraestructura/documentación.
- **`main` siempre desplegable.** No se rompe `main`; solo entran checkpoints estables.
- **GitHub = fuente de verdad.** El repositorio privado `morphiq-ui` es la fuente
  canónica de código, historia y documentación.
- **Vercel solo publica.** Un único proyecto `morphiq-ui`. Nunca se crea un proyecto
  nuevo en Vercel para un rename, preview o feature.
- **Nunca secretos.** No se commitean `.env*`, tokens, service-role keys ni ningún
  material sensible.

## Convención de reportes

Cada ejecutor deja un reporte al terminar cada prompt/tarea. La convención completa
(nombrado secuencial `NNNN-slug.md`, secciones obligatorias y cómo se auditan) está en
[`reports/README.md`](reports/README.md). Usa [`reports/TEMPLATE.md`](reports/TEMPLATE.md)
como base.

## Tiers de componentes (core vs. animado)

La biblioteca crece hacia cientos de componentes en dos tiers:

- **Core** — los 22 originales, **cero dependencias de runtime**: se copian con solo
  `src/lib/cn.ts`. El guard de `verify-registry` es estricto: `var()` con fallback
  literal, sin `:root`/`globals.css`, y solo las primitivas de estilo/comportamiento ya
  presentes.
- **Animado** — componentes cuyo propósito es el movimiento. Pueden **declarar e importar**
  dependencias npm de una **allowlist** (`animatedTierPackages` en
  `scripts/verify-registry.mjs`, empieza con `motion`). El guard de dependency-manifest
  sigue exigiendo `declarado === importado`; la allowlist solo deja de prohibir esos
  paquetes. Ampliarla es un cambio de una línea, deliberado y revisable.

**Lo que NO se relaja para nadie:** self-containment del CSS, contraste, cobertura de
transición (verificada con `getAnimations()`, sin propiedades fantasma),
`prefers-reduced-motion` y `forced-colors`. El gate (`npm run check`) es obligatorio para
ambos tiers.

**Materiales:** los componentes con superficie se hacen en los materiales que apliquen
(clay/glass/skeuo/adaptive, y `liquid-glass` a medida que se cablea). Los intrínsecamente
visuales (fondos, texto animado, efectos) suelen ser material-agnósticos (un solo estilo),
lo cual es esperado. Las categorías nuevas — `text`, `backgrounds`, `effects`, `blocks` —
conviven con las seis originales.

**Attribution:** cada componente derivado de una fuente MIT/Apache conserva su crédito en
[`CREDITS.md`](CREDITS.md). Fuentes con Commons Clause son solo inspiración.
