import * as path from 'node:path'
import * as cdk from 'aws-cdk-lib'
import type * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import type { Construct } from 'constructs'

const repositoryRoot = path.resolve(process.cwd(), '../..')

type DevToysStackProps = cdk.StackProps & {
  domainName: string
  hostedZoneId: string
  hostedZoneName: string
  certificate: acm.ICertificate
}

export class DevToysStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DevToysStackProps) {
    super(scope, id, props)

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const api = new lambdaNodejs.NodejsFunction(this, 'ApiFunction', {
      entry: path.join(repositoryRoot, 'apps/api/src/index.ts'),
      handler: 'handler',
      // AWS Lambda's newest managed Node.js runtime is 24; upgrade to 26 when AWS releases it.
      runtime: lambda.Runtime.NODEJS_24_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      bundling: { minify: true, sourceMap: true },
    })

    const functionUrl = api.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    })

    const indexDocumentRewrite = new cloudfront.Function(this, 'IndexDocumentRewrite', {
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(repositoryRoot, 'scripts/infra/functions/index-document-rewrite.js'),
      }),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      domainNames: [props.domainName],
      certificate: props.certificate,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        functionAssociations: [
          {
            function: indexDocumentRewrite,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        'api/*': {
          origin: origins.FunctionUrlOrigin.withOriginAccessControl(functionUrl),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
      errorResponses: [{ httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' }],
    })

    // IAM-authenticated Function URLs require both InvokeFunctionUrl and InvokeFunction.
    // FunctionUrlOrigin grants the former; grant the latter to this distribution explicitly.
    api.addPermission('AllowCloudFrontInvokeFunction', {
      principal: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distribution.distributionId}`,
      invokedViaFunctionUrl: true,
    })

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(repositoryRoot, 'apps/web/out'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
      // The export is ~1,300 objects. Lambda CPU scales with memory, and the
      // handler's timeout is already at the 15 minute service maximum, so more
      // memory is the only way to keep the upload inside it. 1,769 MiB is one
      // full vCPU.
      memoryLimit: 1769,
    })

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    })

    const aliasTarget = route53.RecordTarget.fromAlias(
      new route53targets.CloudFrontTarget(distribution),
    )

    new route53.ARecord(this, 'SiteAliasRecord', {
      zone: hostedZone,
      recordName: props.domainName,
      target: aliasTarget,
    })

    new route53.AaaaRecord(this, 'SiteAliasRecordIpv6', {
      zone: hostedZone,
      recordName: props.domainName,
      target: aliasTarget,
    })

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${props.domainName}`,
    })

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    })

    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
    })

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    })
  }
}
