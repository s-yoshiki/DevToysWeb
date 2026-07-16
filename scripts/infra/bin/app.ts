#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { DevToysStack } from '../lib/devtoys-stack.js'

const app = new cdk.App()

new DevToysStack(app, 'DevToysStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
  },
})
