#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { DevToysStack } from '../lib/devtoys-stack.js'
import { GitHubActionsStack } from '../lib/github-actions-stack.js'

const app = new cdk.App()
const environment = app.node.tryGetContext('environment')

if (environment !== 'dev' && environment !== 'prd') {
  throw new Error('CDK context "environment" must be either "dev" or "prd"')
}
const deployEnvironment = environment as 'dev' | 'prd'

const accounts = {
  dev: '790131586983',
  prd: '654248427729',
} as const
const awsEnvironment = {
  account: accounts[deployEnvironment],
  region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
}
const stackPrefix = deployEnvironment === 'dev' ? 'Dev' : 'Prd'

new GitHubActionsStack(app, `${stackPrefix}DevToysGitHubActionsStack`, {
  env: awsEnvironment,
  githubEnvironment: deployEnvironment,
  roleName:
    deployEnvironment === 'dev'
      ? 'DevToysWebGitHubActionsDeployRole'
      : 'DevToysWebGitHubActionsPrdDeployRole',
  existingProviderArn:
    deployEnvironment === 'prd'
      ? `arn:aws:iam::${accounts.prd}:oidc-provider/token.actions.githubusercontent.com`
      : undefined,
  tags: { Environment: deployEnvironment, Project: 'DevToysWeb' },
})

new DevToysStack(app, `${stackPrefix}DevToysStack`, {
  env: awsEnvironment,
  tags: { Environment: deployEnvironment },
})
