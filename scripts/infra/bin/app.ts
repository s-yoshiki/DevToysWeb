#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CertificateStack } from '../lib/certificate-stack.js'
import { DevToysStack } from '../lib/devtoys-stack.js'

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

// `devtoys.ex-foundry.com` is delegated from the `ex-foundry.com` parent zone,
// so both the apex (prd) and the dev subdomain are served from this zone.
const hostedZoneId = 'Z0619515E2LNT3K1FO5D'
const hostedZoneName = 'devtoys.ex-foundry.com'
const domainName = deployEnvironment === 'prd' ? hostedZoneName : `dev.${hostedZoneName}`

// CloudFront reads certificates from us-east-1 only, so the certificate is
// pinned there and handed to the site stack across regions.
const certificateStack = new CertificateStack(app, `${stackPrefix}DevToysCertificateStack`, {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
  domainName,
  hostedZoneId,
  hostedZoneName,
  tags: { Environment: deployEnvironment, Project: 'DevToysWeb' },
})

void new DevToysStack(app, `${stackPrefix}DevToysStack`, {
  env: awsEnvironment,
  crossRegionReferences: true,
  certificate: certificateStack.certificate,
  domainName,
  hostedZoneId,
  hostedZoneName,
  tags: { Environment: deployEnvironment },
})
