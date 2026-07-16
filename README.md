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

```sh
# One-time bootstrap for the target account/region
AWS_PROFILE=ex-knowledge pnpm --filter @devtoys/infra cdk bootstrap

# One-time creation of the GitHub Actions deployment roles
AWS_PROFILE=ex-knowledge pnpm --filter @devtoys/infra deploy:github:dev
AWS_PROFILE=ex-knowledge pnpm --filter @devtoys/infra deploy:github:prd

# Build the static site and deploy dev or prd from your machine
pnpm install
pnpm build
AWS_PROFILE=ex-knowledge pnpm --filter @devtoys/infra deploy:dev
AWS_PROFILE=ex-knowledge pnpm --filter @devtoys/infra deploy:prd
```

The environment stacks are named `DevDevToysStack` and `PrdDevToysStack`.
The environment-specific GitHub deployment roles are managed by
`DevDevToysGitHubActionsStack` and `PrdDevToysGitHubActionsStack`.
Both environments are deployed to AWS account `654248427729` with the
`AWS_PROFILE=ex-knowledge` profile for local operations.

`GET /api/health` returns the API health status through the CloudFront domain.

GitHub Actions deploys pushes to `main` to `prd`. A manual workflow run can deploy
either `dev` or `prd`. Configure both GitHub environments with the variables
`AWS_DEPLOY_ROLE_ARN` and (optionally) `AWS_REGION`. The role must trust GitHub's
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
