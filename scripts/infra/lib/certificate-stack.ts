import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { Construct } from 'constructs'

type CertificateStackProps = cdk.StackProps & {
  domainName: string
  hostedZoneId: string
  hostedZoneName: string
}

/**
 * CloudFront only accepts certificates from us-east-1, so the certificate lives
 * in its own stack pinned to that region. The site stack consumes it through a
 * cross-region reference.
 */
export class CertificateStack extends cdk.Stack {
  readonly certificate: acm.ICertificate

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props)

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    })

    this.certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    })

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: this.certificate.certificateArn,
      description: `ACM certificate for ${props.domainName}`,
    })
  }
}
