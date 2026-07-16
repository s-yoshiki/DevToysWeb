#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { DevToysStack } from '../lib/devtoys-stack.js'
import { GitHubActionsStack } from '../lib/github-actions-stack.js'

const app = new cdk.App()
const environment = app.node.tryGetContext('environment')
const awsEnvironment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
}

new GitHubActionsStack(app, 'DevToysGitHubActionsStack', {
  env: awsEnvironment,
  tags: { Project: 'DevToysWeb' },
})

if (environment !== undefined && environment !== 'dev' && environment !== 'prd') {
  throw new Error('CDK context "environment" must be either "dev" or "prd"')
}

if (environment === 'dev' || environment === 'prd') {
  const stackPrefix = environment === 'dev' ? 'Dev' : 'Prd'

  new DevToysStack(app, `${stackPrefix}DevToysStack`, {
    env: awsEnvironment,
    tags: { Environment: environment },
  })
}
