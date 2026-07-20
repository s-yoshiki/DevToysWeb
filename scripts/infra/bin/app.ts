#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { DevToysStack } from '../lib/devtoys-stack.js'
import { GitHubActionsStack } from '../lib/github-actions-stack.js'
import { GitHubOidcProviderStack } from '../lib/github-oidc-provider-stack.js'

const app = new cdk.App()
const environment = app.node.tryGetContext('environment')

if (environment !== 'dev' && environment !== 'prd') {
  throw new Error('CDK context "environment" must be either "dev" or "prd"')
}
const deployEnvironment = environment as 'dev' | 'prd'

// Every environment lives in this account; override with `-c account=...` only
// when deploying a throwaway copy elsewhere.
const defaultAccount = '822013579886'
const account = app.node.tryGetContext('account') ?? defaultAccount
// Resolved from context or CDK_DEPLOY_REGION only: an ambient AWS_REGION in a
// shell must not silently retarget the stacks.
const awsEnvironment = {
  account,
  region: app.node.tryGetContext('region') ?? process.env.CDK_DEPLOY_REGION ?? 'ap-northeast-1',
}
const stackPrefix = deployEnvironment === 'dev' ? 'Dev' : 'Prd'

// The OIDC provider is account-wide, so it is created once and imported by ARN
// from both environment role stacks.
new GitHubOidcProviderStack(app, 'DevToysGitHubOidcStack', {
  env: awsEnvironment,
  tags: { Project: 'DevToysWeb' },
})

new GitHubActionsStack(app, `${stackPrefix}DevToysGitHubActionsStack`, {
  env: awsEnvironment,
  githubEnvironment: deployEnvironment,
  roleName:
    deployEnvironment === 'dev'
      ? 'DevToysWebGitHubActionsDeployRole'
      : 'DevToysWebGitHubActionsPrdDeployRole',
  existingProviderArn: `arn:aws:iam::${account}:oidc-provider/token.actions.githubusercontent.com`,
  tags: { Environment: deployEnvironment, Project: 'DevToysWeb' },
})

new DevToysStack(app, `${stackPrefix}DevToysStack`, {
  env: awsEnvironment,
  tags: { Environment: deployEnvironment },
})
