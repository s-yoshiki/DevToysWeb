<h1 align="center">
  DevToysWeb
</h1>
<p align="center">
  A Swiss Army knife for developers for web
</p>
<p align="center">
  <a style="text-decoration:none" href="https://dev-toys-web.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Website-DevToysWeb-blue" alt="Website" />
  </a>
</p>

## Description

- [DevToys](https://github.com/veler/DevToys) 
- [DevToysMac](https://github.com/ObuchiYuki/DevToysMac)
- [DevBox](https://www.dev-box.app/)
- [DevUtils](https://devutils.app/)

にインスピレーションを受けて、Web版のクローンを作成しました。

本家の機能に追従しつつも、独自のツールも追加しています。(パスワード生成等)

## Installation

```
# init repository
git clone https://github.com/s-yoshiki/DevToysWeb.git
cd DevToysWeb

# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev

# build for production and launch server
$ pnpm build
$ pnpm start

# lint and format with Biome
$ pnpm check
$ pnpm format
```

## AWS deployment

The production architecture is a private S3 bucket behind CloudFront, with `/api/*`
routed to a Lambda Function URL. The CDK application lives in `scripts/infra`, and
server-side API handlers live in `apps/api`.

Development and CI use Node.js 26. The Lambda currently uses AWS's latest managed
Node.js runtime (24) until the Node.js 26 managed runtime becomes available.

The site is served from `https://devtoys.ex-foundry.com` (prd) and
`https://dev.devtoys.ex-foundry.com` (dev). Both names live in the delegated
`devtoys.ex-foundry.com` hosted zone. CloudFront only accepts certificates from
`us-east-1`, so the ACM certificate is created by a separate stack pinned to that
region and passed to the site stack as a cross-region reference — which is why
`us-east-1` must be bootstrapped as well.

```sh
# One-time bootstrap for the target account/region. The CDK app is evaluated even
# for bootstrap, so the environment context is required.
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra cdk bootstrap aws://822013579886/ap-northeast-1 --context environment=prd
# us-east-1 hosts the CloudFront certificate stack
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra cdk bootstrap aws://822013579886/us-east-1 --context environment=prd

# One-time creation of the account-wide GitHub OIDC provider
# (skip if the account already has a token.actions.githubusercontent.com provider)
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra deploy:github:oidc

# One-time creation of the GitHub Actions deployment roles
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra deploy:github:dev
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra deploy:github:prd

# Build the static site and deploy dev or prd from your machine.
# These deploy the certificate stack and the site stack together.
pnpm install
pnpm build
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra deploy:dev
AWS_PROFILE=ex-foundry pnpm --filter @devtoys/infra deploy:prd
```

The environment stacks are named `DevDevToysStack` and `PrdDevToysStack`, with
their certificates in `DevDevToysCertificateStack` and `PrdDevToysCertificateStack`.
The environment-specific GitHub deployment roles are managed by
`DevDevToysGitHubActionsStack` and `PrdDevToysGitHubActionsStack`, and the shared
GitHub OIDC provider by `DevToysGitHubOidcStack`.
Both environments are deployed to AWS account `822013579886` in `ap-northeast-1`,
using the `AWS_PROFILE=ex-foundry` profile for local operations. Point that
profile at `822013579886` before running any of the commands above. To target a
different account or region temporarily, pass `-c account=<id>` / `-c region=<region>`
to the CDK commands, or set `CDK_DEPLOY_REGION`. An ambient `AWS_REGION` is
deliberately ignored so a shell setting cannot retarget the stacks.

`GET /api/health` returns the API health status through the CloudFront domain.

GitHub Actions deploys pushes to `main` to `prd`. A manual workflow run can deploy
either `dev` or `prd`. Configure both GitHub environments with the variables
`AWS_DEPLOY_ROLE_ARN` and (optionally) `AWS_REGION` and `AWS_ACCOUNT_ID`. Both
workflows assert that the assumed role lives in `AWS_ACCOUNT_ID` (defaulting to
`822013579886`) before deploying, so a stale role ARN fails fast rather than
deploying to the wrong account. The role must trust GitHub's
OIDC provider for this repository and have permission to deploy the CDK stack. No
long-lived AWS access keys are required.

The `Deploy website content` workflow can update only the static S3 content for a
selected environment without running CDK. It reads the bucket name and CloudFront
distribution ID from the environment stack, synchronizes `apps/web/out`, and
invalidates the CloudFront cache. Run the CDK deployment once after adding these
stack outputs. The deployment role also needs S3 object write/delete permissions,
`cloudformation:DescribeStacks`, and `cloudfront:CreateInvalidation`.

## Tools

Many tools are available.

- converters
  - angle
  - date
  - number_base
  - yaml2json
- encode_decode
  - base64
  - crypto
  - html
  - url
- formatters
  - json
  - sql
- generater
  - hash
  - password
  - uuid

... and more are coming!

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md)
