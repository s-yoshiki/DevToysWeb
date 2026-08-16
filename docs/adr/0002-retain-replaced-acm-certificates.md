# Retain replaced ACM certificates

- Status: Accepted
- Date: 2026-08-15

## Context

The CloudFront distribution consumes the ACM certificate from a separate
`us-east-1` stack through a cross-region reference. Changing certificate names
or validation settings replaces the ACM resource. During that replacement,
CloudFront can still reference the previous certificate while the two stacks
are being deployed, so deleting the old certificate fails with ACM's
`Certificate ... is in use` error.

## Decision

Apply `RemovalPolicy.RETAIN` to the managed certificate. This allows the new
certificate to be created and lets the site stack switch CloudFront to it
without making deletion of the old certificate part of the deployment.

Retained certificates are infrastructure leftovers and should be reviewed and
removed manually only after confirming that no CloudFront distribution uses
them.

## Consequences

Certificate replacements are deployable without a transient cross-stack
deletion conflict, at the cost of possible unused ACM certificates that need
periodic cleanup.
