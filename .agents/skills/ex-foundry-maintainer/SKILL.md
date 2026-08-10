---
name: ex-foundry-maintainer
description: Maintain an ex-foundry service repository with its shared configs, standard pnpm commands, ADRs, and coding-agent conventions. Use when changing source, tests, configuration, documentation, CI, or deployment scripts in these repositories.
---

# Ex-foundry Maintainer

## Workflow

1. Read the repository's `AGENTS.md`, `CLAUDE.md`, and relevant README or `docs/` guidance before editing.
2. Run `git status --short --branch` and preserve existing user changes.
3. Use Node.js 26 and the pinned pnpm version from `package.json`; run commands from the repository root.
4. Keep generated files out of changes: `node_modules`, `.turbo`, build output, framework caches, `cdk.out`, and local databases.
5. Inspect the nearest package and its callers before changing application code.

## Repository conventions

- Keep the real Biome configuration in `configs/biome/biome.json`; keep the root `biome.json` as the entry point that extends it.
- Keep shared TypeScript configurations in `configs/tsconfig/`, published inside the workspace as `@repo/typescript-config`. Put application-specific paths, includes, and compiler overrides in the consuming `tsconfig.json`.
- Use these root command names when available: `pnpm check`, `pnpm check:fix`, `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm check-types`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, and `pnpm deploy`.
- Treat `pnpm deploy`, CDK deploy/bootstrap/destroy, and cloud or GitHub mutations as externally state-changing operations. Do not run them without an explicit user request and a confirmed target.
- Record new technical decisions in `docs/adr/` using a sequential `NNNN-kebab-case.md` file. Keep historical `docs/decisions/` records intact when present.
- Keep repository-specific instructions and this skill in sync when a workflow changes.

## Validation

Run the narrowest relevant checks first, then the repository-level checks required by its guide. For configuration-only changes, at minimum validate JSON/YAML parsing, workspace package resolution, `pnpm check`, and `pnpm typecheck` when dependencies are available. If parser or scraper code changes in NPB Analysis, run the documented small debug scrape; never run a full scrape unless explicitly requested.
