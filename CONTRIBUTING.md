# Contributing

DevToysWeb is a pnpm monorepo and requires Node.js 26.

```sh
pnpm install
pnpm dev
```

The main packages are the static Next.js frontend in `apps/web`, the Hono Lambda API in
`apps/api`, and the AWS CDK application in `scripts/infra`. See `AGENTS.md` for the detailed
repository map, project constraints, and guidance for adding tools.

Before opening a pull request, run:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

Keep pull requests focused, include tests for logic changes, and provide Japanese and English
copy for user-facing features. Do not commit generated output such as `.next`, `out`,
`.turbo`, `cdk.out`, or `*.tsbuildinfo`.
