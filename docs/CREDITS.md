# Credits & licenses

Morphiq UI's core 22 components are original code. The library is expanding by adapting
open-source components from the sources below. Every component derived from one of these
keeps a credit (author + license); this file is the canonical `NOTICE`.

The full expansion plan is in [`component-expansion-map.md`](component-expansion-map.md).

## Redistributable sources

Adapted code may ship in the catalog **provided the license notice is preserved**.

| Source | License | Terms |
|---|---|---|
| magicui | MIT | Redistributable with attribution. |
| animata | MIT | Redistributable with attribution. |
| smoothui | MIT | Redistributable with attribution. |
| seraui | MIT | Redistributable with attribution. |
| Lightswind | MIT | Redistributable with attribution. |
| componentry | MIT | Redistributable with attribution. |
| eldoraui | MIT | Redistributable with attribution. |
| motion-primitives | MIT | Redistributable with attribution. |
| kokonutui | Apache 2.0 | Redistributable with attribution **+ NOTICE** preserved. |
| spectrum-ui | Apache 2.0 | Redistributable with attribution **+ NOTICE** preserved. |

## Inspiration only — do NOT copy code

These carry a **Commons Clause** on top of MIT, which forbids redistributing ported
versions. They may inform design and technique, but no code from them enters the catalog.

| Source | License | Terms |
|---|---|---|
| react-bits | MIT + Commons Clause | Inspiration only. |
| animate-ui | MIT + Commons Clause | Inspiration only. |

## Runtime dependencies (animated tier)

| Package | License | Used for |
|---|---|---|
| [motion](https://motion.dev) (Framer Motion) | MIT | The animated tier's motion runtime. Declared per-component in the registry entry; permitted by the allowlist in `scripts/verify-registry.mjs`. |

## The `liquid-glass` material

The fifth material is original code. Its refraction technique — an SVG `feTurbulence` +
`feDisplacementMap` filter referenced from `backdrop-filter`, over a frosted
`blur()`/`saturate()` fallback — is a widely documented CSS pattern; the MIT projects
`liquid-glass` and `liquid-surface` were consulted as references, not copied.

## How to credit a new adapted component

When a component is derived from one of the redistributable sources, add a row here
(component, source, license) and keep the original license header in the component's file
comment. Apache 2.0 sources additionally require their `NOTICE` text to travel with the
distribution.
