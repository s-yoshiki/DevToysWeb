import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

type GitHubActionsStackProps = cdk.StackProps & {
  githubEnvironment: 'dev' | 'prd'
  roleName: string
  existingProviderArn?: string
}

export class GitHubActionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GitHubActionsStackProps) {
    super(scope, id, props)

    const provider = props.existingProviderArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GitHubProvider',
          props.existingProviderArn,
        )
      : new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
        })

    const deployRole = new iam.Role(this, 'DeployRole', {
      roleName: props.roleName,
      description: `Deploys DevToysWeb from the GitHub Actions ${props.githubEnvironment} environment`,
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:s-yoshiki/DevToysWeb:environment:${props.githubEnvironment}`,
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

    // Bucket-level and object-level actions need different ARN shapes: an
    // `arn:aws:s3:::*` grant does not cover `s3:PutObject`, so `aws s3 sync`
    // in the content workflow would fail with AccessDenied.
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'ListWebsiteBuckets',
        actions: ['s3:GetBucketLocation', 's3:ListBucket'],
        resources: [`arn:${cdk.Aws.PARTITION}:s3:::*`],
      }),
    )

    deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'DeployWebsiteContent',
        actions: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject'],
        resources: [`arn:${cdk.Aws.PARTITION}:s3:::*/*`],
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
      description: `Set this as AWS_DEPLOY_ROLE_ARN in the ${props.githubEnvironment} GitHub environment`,
    })
  }
}
