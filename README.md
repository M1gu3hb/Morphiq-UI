# Morphiq UI

A tactile React component library and visual component studio, signed by MH97.

The product combines a browsable component collection with a canvas where users can
compose, resize, tune, save locally, and export tactile UI as React source. The current
checkpoint intentionally has no authentication, database, payments, or marketplace.

## Current product

- Premium responsive landing page with a non-flat surface system.
- Automatic Spanish/English localization based on the browser, with a manual switch.
- A 24-object animated library with live text, color, and motion customization.
- Copy-ready React/CSS, AI implementation prompts, and TSX/CSS/SVG downloads.
- Visual studio with layers, history, devices, snapping, alignment, drag/resize,
  material and motion controls, local save, project JSON, and JSX export.
- Static production build deployed on Vercel.
- Accessibility foundations: semantic structure, keyboard-visible native controls,
  reduced-motion handling, and practical contrast.

## Stack

- Next.js 16 App Router, React 19, and TypeScript.
- Tailwind CSS 4 plus owned CSS material tokens.
- Radix UI primitives for future accessible interactive components.
- Motion for purposeful interaction and transition work.
- `react-rnd` for studio drag/resize behavior.
- Sandpack for the live-code editor phase.
- CVA, `clsx`, and `tailwind-merge` for component variants.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run check
```

## Routes

- `/` — product landing page.
- `/components` — component catalog and material filters.
- `/library` — customizable animated objects and export tools.
- `/studio` — visual component studio.

## Source of truth and deployment

The private GitHub repository `morphiq-ui` is the canonical source. Vercel is used only
to build and serve deliberate release checkpoints through the existing project
`morphiq-ui`; small local commits are not deployed individually. See
[Repository and deployment policy](docs/operations.md).

## Product documentation

- [Style and library research](docs/style-research.md)
- [Architecture and roadmap](docs/product-roadmap.md)
- [Repository and deployment policy](docs/operations.md)

This repository is private and unlicensed. Do not redistribute its original product
code or visual assets without permission.
