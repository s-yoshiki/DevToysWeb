import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { Construct } from 'constructs'

type CertificateStackProps = cdk.StackProps & {
  domainName: string
  hostedZoneId: string
  hostedZoneName: string
  subjectAlternativeNames?: readonly string[]
  validationHostedZones?: Record<string, HostedZoneConfig>
}

export type HostedZoneConfig = {
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

    const validationHostedZones = {
      [props.domainName]: hostedZone,
      ...Object.fromEntries(
        Object.entries(props.validationHostedZones ?? {}).map(([domainName, config]) => [
          domainName,
          route53.HostedZone.fromHostedZoneAttributes(
            this,
            `ValidationHostedZone${domainName.replace(/[^a-zA-Z0-9]/g, '')}`,
            {
              hostedZoneId: config.hostedZoneId,
              zoneName: config.hostedZoneName,
            },
          ),
        ]),
      ),
    }

    this.certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: props.domainName,
      subjectAlternativeNames: props.subjectAlternativeNames
        ? [...props.subjectAlternativeNames]
        : undefined,
      validation: acm.CertificateValidation.fromDnsMultiZone(validationHostedZones),
    })

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: this.certificate.certificateArn,
      description: `ACM certificate for ${props.domainName}`,
    })
  }
}
