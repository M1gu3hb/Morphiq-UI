# Style and library research

Research checkpoint: July 2026.

## The four requested directions

### Claymorphism

Claymorphism creates inflated, soft objects with broad corner radii, saturated or
pastel material colors, and a combination of inner highlights, inner shade, and a
larger external shadow. It is related to neumorphism but does not require the object
to share the exact color of its background.

Implementation rule: clay is a material recipe, not a component package. It belongs
in tokens for highlight, shade, extrusion, softness, and pressed state.

Sources: [Hype4 claymorphism guide](https://hype4.academy/articles/design/claymorphism-in-user-interfaces),
[Smashing Magazine analysis](https://www.smashingmagazine.com/2022/03/claymorphism-css-ui-design-trend/).

### Glassmorphism

Glassmorphism uses translucent surfaces, backdrop blur, edge highlights, saturation,
and contextual backgrounds to create depth. A transparent white card on an empty white
background is not glass; the effect needs visible context behind it.

Implementation rule: contrast cannot depend on whatever background happens to be behind
the component. Each glass variant needs a fallback tint, border, and contrast contract.

Relevant platform primitives: CSS `backdrop-filter`, alpha colors, borders, and layered
shadows. No visual component library is necessary.

### Skeuomorphism

Skeuomorphism borrows understandable signals from physical objects: grooves, rotary
controls, material seams, pressed depth, meters, switches, and texture. Modern
skeuomorphism should preserve useful affordance without reproducing a physical object
pixel for pixel.

Implementation rule: use realism to explain interaction. Decorative realism with no
behavior becomes noise and harms responsiveness.

### Polymorphic UI

Polymorphism is not a clearly established visual finish parallel to clay or glass. In
modern component engineering it usually describes one component that can change its
rendered element, density, structure, or presentation according to context.

Implementation rule: this product treats polymorphism as adaptive behavior. Container
queries, semantic `asChild`/slot patterns, and responsive variants are the foundation.
Calling it another shadow preset would be misleading.

## Packages evaluated

| Package or system | Status found | Decision |
| --- | --- | --- |
| `claymorphism-css` | MIT, last package update in 2022 | Not installed. Too small and stale to become the product foundation. |
| `ui-neumorphism` | MIT React kit, last package update in 2022 | Not installed. Prescriptive components and aging maintenance. |
| `@nishag619/glass-ui` | MIT, early `0.1.x` package published in 2026 | Not installed. Young library and overlaps directly with our product. |
| Skeuos CSS | Lightweight GitHub CSS project | Not installed. Rigid styling and no compelling maintained npm foundation. |
| shadcn/ui approach | Open-code distribution model | Adopted as architectural inspiration, not as the visual identity. |
| Radix Primitives | Unstyled, accessible primitives | Installed. Strong behavioral and accessibility base. |
| Sandpack | Browser code editing and preview toolkit | Installed for the live-code phase of the studio. |
| `react-rnd` | Maintained React drag/resize utility | Installed for the first visual canvas. |

The blunt conclusion: installing a different pre-styled library for each aesthetic
would make the product incoherent and turn our startup into a wrapper around other
people's APIs. The differentiator has to be our own material-token engine, component
recipes, interaction quality, and distribution workflow.

## Core references

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [shadcn/ui distribution model](https://ui.shadcn.com/docs)
- [Sandpack documentation](https://sandpack.codesandbox.io/docs)
