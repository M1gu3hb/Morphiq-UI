# Repository and deployment policy

## Single source of truth

The private GitHub repository `morphiq-ui` is the canonical home for source code,
documentation, database migrations, configuration, and release history. Vercel contains
only built deployments; it is not used as source storage.

## Definitive services

| Responsibility | Definitive location |
| --- | --- |
| Source and history | Private GitHub repository `morphiq-ui` |
| Production web app | Vercel project `morphiq-ui` |
| Public URL | `https://morphiq-ui.vercel.app` |
| Backend, later phase | One Supabase project linked to this repository |

The former Vercel project `mh-ui-lab` is a disposable prototype and must not receive
new deployments. Once removed from the Vercel dashboard, it must not be recreated.

## Cost-conscious workflow

1. Work locally on a focused branch.
2. Run `npm run check` before committing.
3. Push source and open a pull request when review is useful.
4. Merge stable checkpoints into `main`.
5. Deploy only meaningful checkpoints to the existing `morphiq-ui` Vercel project.

Do not create a new Vercel project for a rename, preview, or feature. Do not manually
deploy every small commit. GitHub Actions performs code validation; Vercel is reserved
for previewing release candidates and serving production.

The public pages are statically generated. Browser-language detection runs on the
client, so normal page views are served from the CDN instead of invoking a serverless
function solely to choose Spanish or English.

## Branches and releases

- `main` must stay deployable.
- Feature work uses `feat/<short-name>`.
- Fixes use `fix/<short-name>`.
- Commit source before any production deployment.
- Production deployments must reference a known Git commit in the handoff notes.

## Secrets

Never commit `.env*`, Supabase service-role keys, Vercel tokens, payment credentials,
or private signing material. Public client variables may be documented in
`.env.example` when the backend phase begins.
