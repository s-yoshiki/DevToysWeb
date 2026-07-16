import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

export class GitHubActionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })

    const deployRole = new iam.Role(this, 'DeployRole', {
      roleName: 'DevToysWebGitHubActionsDeployRole',
      description: 'Deploys DevToysWeb from the repository GitHub Actions environments',
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': [
            'repo:s-yoshiki/DevToysWeb:environment:dev',
            'repo:s-yoshiki/DevToysWeb:environment:prd',
          ],
        },
      }),
      maxSessionDuration: cdk.Duration.hours(1),
    })

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'AssumeCdkBootstrapRoles',
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/cdk-hnb659fds-deploy-role-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
          `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/cdk-hnb659fds-file-publishing-role-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
          `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/cdk-hnb659fds-image-publishing-role-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
          `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/cdk-hnb659fds-lookup-role-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
        ],
      }),
    )

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'ReadDeploymentTargets',
        actions: ['cloudformation:DescribeStacks'],
        resources: ['*'],
      }),
    )

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'DeployWebsiteContent',
        actions: [
          's3:DeleteObject',
          's3:GetBucketLocation',
          's3:GetObject',
          's3:ListBucket',
          's3:PutObject',
        ],
        resources: ['arn:aws:s3:::*'],
      }),
    )

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'InvalidateWebsiteCache',
        actions: ['cloudfront:CreateInvalidation'],
        resources: ['*'],
      }),
    )

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: deployRole.roleArn,
      description: 'Set this as AWS_DEPLOY_ROLE_ARN in the dev and prd GitHub environments',
    })
  }
}
