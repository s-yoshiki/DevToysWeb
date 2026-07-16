# AGENTS.md

This file is the operating guide for coding agents working in this repository.

## Repository overview

DevToysWeb is a pnpm/Turborepo monorepo for a bilingual developer-tool website.

- `apps/web`: Next.js App Router frontend, statically exported for S3/CloudFront
- `apps/api`: Hono handlers deployed as an AWS Lambda
- `scripts/infra`: AWS CDK application for S3, CloudFront, and Lambda
- `.github/workflows`: production and content-only deployment workflows

Use pnpm from the repository root. The expected runtime is Node.js 26 and the package
manager version is pinned in the root `package.json`.

## Before changing code

1. Read the nearest source files and their callers before editing.
2. Check `git status --short`; preserve unrelated and user-authored changes.
3. Prefer existing feature boundaries and UI primitives over introducing new patterns.
4. Do not edit generated directories: `.next`, `out`, `.turbo`, `cdk.out`,
   `node_modules`, or `*.tsbuildinfo`.

## Where changes belong

- Tool metadata, paths, categories, and localized names:
  `apps/web/src/features/tools/domain/catalog.ts`
- Pure text conversions and generators:
  `apps/web/src/features/tools/domain/transformers.ts`
- Tool state and orchestration:
  `apps/web/src/features/tools/application/`
- Tool-specific interfaces:
  `apps/web/src/features/tools/components/`
- Shared UI primitives: `apps/web/src/components/ui/`
- Japanese and English shared copy:
  `apps/web/src/features/i18n/domain/dictionaries.ts`
- Server endpoints: `apps/api/src/`; keep the `/api` prefix because CloudFront routes it
- AWS resources and routing: `scripts/infra/lib/devtoys-stack.ts`
- GitHub Actions OIDC and deployment role: `scripts/infra/lib/github-actions-stack.ts`

When adding a tool, update the catalog and both locales together. Reuse an existing
workspace when possible; otherwise extend the `workspace` union and add the matching UI.
Keep browser-only transformations in the web app. Put operations requiring network access,
secret material, or server-side trust boundaries in the API.

## Project constraints

- The web application uses `output: 'export'`. Do not add Next.js features that require a
  runtime server, such as server actions, middleware, or dynamic server rendering.
- Routes must remain compatible with static output and `trailingSlash: true`.
- Imports within `apps/web` may use the `@/` alias.
- Follow the existing Biome style: two spaces, single quotes, no semicolons, 100 columns.
- Use the existing shadcn/Base UI components and Tailwind tokens before adding dependencies
  or custom primitives.
- User-facing shared text must be supplied in both Japanese and English.
- Network diagnostics must retain SSRF protections in `apps/api/src/network.ts`.
- Never deploy, bootstrap CDK, change cloud resources, or add secrets unless explicitly asked.

## Validation

Run the smallest relevant check during iteration, then the repository-level checks before
hand-off when the scope warrants it.

```sh
pnpm typecheck          # all TypeScript packages
pnpm lint               # Biome lint
pnpm format:check       # formatting without modifying files
pnpm test               # repository tests
pnpm build              # production build and static export
```

Package-scoped equivalents are faster for focused work:

```sh
pnpm --filter @devtoys/web typecheck
pnpm --filter @devtoys/web build
pnpm --filter @devtoys/api test
pnpm --filter @devtoys/infra typecheck
pnpm --filter @devtoys/infra synth:dev
```

For UI changes, inspect both `/ja/` and `/en/`, plus a representative tool route at mobile
and desktop widths. A successful typecheck alone does not validate the static export.

## Tests and change hygiene

- Add or update focused tests for pure logic and API security boundaries.
- Place API tests beside the source as `*.test.ts`; the package's `tsx` runner executes them.
- Avoid broad formatting churn. Run `pnpm exec biome check --write <changed-files>` for
  targeted fixes when useful.
- Do not commit generated build output or local environment files.
- Summarize changed behavior and list the validation commands actually run.
