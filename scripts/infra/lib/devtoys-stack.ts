import * as path from 'node:path'
import * as cdk from 'aws-cdk-lib'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import type { Construct } from 'constructs'

const repositoryRoot = path.resolve(process.cwd(), '../..')

export class DevToysStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(repositoryRoot, 'apps/web/out'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    })

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
    })

    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
    })

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    })
  }
}
