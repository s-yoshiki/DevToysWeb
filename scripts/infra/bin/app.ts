#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { DevToysStack } from '../lib/devtoys-stack.js'

const app = new cdk.App()
const environment = app.node.tryGetContext('environment')

if (environment !== 'dev' && environment !== 'prd') {
  throw new Error('CDK context "environment" must be either "dev" or "prd"')
}

const stackPrefix = environment === 'dev' ? 'Dev' : 'Prd'

new DevToysStack(app, `${stackPrefix}DevToysStack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
  },
  tags: { Environment: environment },
})
