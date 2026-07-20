import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

/**
 * Owns the account-wide GitHub OIDC provider. An account can only hold one
 * provider per URL, so the per-environment role stacks import it by ARN instead
 * of creating their own. Deploy this once per AWS account.
 */
export class GitHubOidcProviderStack extends cdk.Stack {
  readonly providerArn: string

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })
    this.providerArn = provider.openIdConnectProviderArn

    new cdk.CfnOutput(this, 'GitHubOidcProviderArn', {
      value: provider.openIdConnectProviderArn,
      description: 'GitHub Actions OIDC provider shared by every environment role',
    })
  }
}
