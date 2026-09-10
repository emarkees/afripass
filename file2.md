

Prompt:
# AfriPass — Production-Ready Multi-Tenant Financial Verification Network



## MASTER DEVELOPMENT PROMPT

You are continuing development of the existing AfriPass Level 2 application.

LIVE APPLICATION:

https://afripass-three.vercel.app/

The current application already contains the Midnight privacy/ZK foundation.

Your job is to evolve AfriPass from a Level 2 prototype into a **production-oriented, multi-tenant financial credential verification platform**.

---

# 1. CRITICAL: DO NOT REBUILD THE EXISTING PROJECT

DO NOT rebuild AfriPass from scratch.

DO NOT remove or replace the existing:

* Lace wallet connection
* Midnight.js integration
* Compact contract
* Midnight Preprod configuration
* existing ZK proof generation
* existing ZK verification
* private witness architecture
* privacy dashboard
* responsive UI
* existing Light/Dark mode
* existing Level 2 functionality

Instead:

**EXTEND THE EXISTING APPLICATION.**

The existing Midnight functionality must continue working after every implementation phase.

---

# 2. NEW PRODUCT VISION

AfriPass is a:

**Privacy-preserving financial credential and verification infrastructure platform.**

AfriPass is NOT:

* a bank
* a lender
* a centralized financial database
* a replacement for financial institutions

AfriPass connects:

**Users + Financial-Service Providers + Credential Issuers + Verifiers**

through privacy-preserving financial credentials and Midnight ZK proofs.

Core architecture:

```text
Financial-Service Provider
        ↓
Provider Attestation
        ↓
AfriPass Credential
        ↓
User Financial Passport
        ↓
User Consent
        ↓
Midnight ZK Proof
        ↓
Verification Request
        ↓
Verifier
        ↓
Eligibility Result
```

Core product principle:

**VERIFY MORE. REVEAL LESS.**

---

# 3. IMPORTANT NEW REQUIREMENT: MULTI-TENANT ARCHITECTURE

AfriPass must be designed as a **multi-tenant platform**.

Every financial-service provider/organization must have its own isolated organization account.

Examples:

```text
ABC Finance
├── Admins
├── Issuers
├── Verifiers
├── Developers
└── Auditors
```

```text
XYZ Microfinance
├── Admins
├── Issuers
├── Verifiers
└── Developers
```

These organizations must NOT be able to access each other's:

* customers
* credentials
* API keys
* verification requests
* audit logs
* usage statistics
* team members
* billing information
* internal settings

Every organization is a separate tenant.

---

# 4. ORGANIZATION / TENANT MODEL

Create a first-class:

```text
Organization
```

entity.

An organization represents a financial-service provider using AfriPass.

Organization fields should conceptually include:

```text
id
name
slug
organization_type
country
website
business_email
contact_phone
status
verification_status
subscription_plan
subscription_status
created_at
updated_at
```

Organization types:

```text
BANK
FINTECH
LENDER
MICROFINANCE
COOPERATIVE
EMPLOYER
CREDIT_PROVIDER
MERCHANT_FINANCE
OTHER
```

Do NOT assume every organization is a bank.

---

# 5. PROVIDER ACCOUNT CREATION

Create:

```text
/provider/register
```

A financial organization should be able to create an AfriPass account.

Registration should collect only appropriate business information.

Fields:

* Organization name
* Organization type
* Country
* Business email
* Website
* Contact person
* Phone
* Intended capabilities
* Issuer
* Verifier
* Issuer + Verifier

After registration:

```text
Account Created
      ↓
Email Verification
      ↓
Organization Review
      ↓
Provider Approval
      ↓
Subscription Selection
      ↓
Provider Dashboard
```

Do NOT automatically grant production privileges.

---

# 6. PROVIDER ORGANIZATION STATUS

Support:

```text
PENDING_REVIEW
APPROVED
REJECTED
SUSPENDED
DEACTIVATED
```

Also support:

```text
EMAIL_UNVERIFIED
BUSINESS_VERIFICATION_PENDING
BUSINESS_VERIFIED
```

The UI must clearly distinguish:

* account status
* business verification status
* subscription status
* API status

---

# 7. PROVIDER DASHBOARD

Every provider gets its own dashboard.

Route:

```text
/provider/dashboard
```

Dashboard must be tenant-specific.

Show:

### Overview

* Credentials issued
* Active credentials
* Revoked credentials
* Expired credentials
* Proofs verified
* Verification requests
* Active API keys
* API usage
* Current subscription
* Subscription renewal
* Organization status

Example:

```text
ABC FINANCE

Approved Provider
Issuer + Verifier

Credentials
1,284

Proofs Verified
486

Verification Requests
742

API Calls
18,492

Current Plan
Professional

Renewal
30 September 2026
```

Do not use hardcoded statistics in production.

The dashboard must consume backend API data.

---

# 8. ORGANIZATION ADMIN

Every organization must have an administrator.

The organization owner/admin should be able to manage the organization.

Create:

```text
/provider/organization
```

Capabilities:

* View organization
* Update organization profile
* View verification status
* Manage team
* Manage roles
* Manage API access
* Manage subscription
* View usage
* View security
* View audit logs

---

# 9. ADMIN CAN CREATE USERS

This is a critical production requirement.

An organization administrator must be able to create/invite staff accounts.

Create:

```text
/provider/team
```

Admin can:

```text
Invite User
Create User
Deactivate User
Reactivate User
Remove User
Change Role
Reset User Access
```

Do NOT require every staff member to register the organization again.

Example:

```text
ABC Finance

Users

John Doe
Owner

Mary James
Admin

David Smith
Issuer

Sarah Brown
Verifier

Michael Adams
Developer

Peter Jones
Auditor
```

---

# 10. STAFF INVITATION FLOW

Implement:

```text
Admin
 ↓
Invite Staff
 ↓
Email Invitation
 ↓
User Accepts
 ↓
Create Password
 ↓
Email Verification
 ↓
Assigned Organization
 ↓
Assigned Role
 ↓
Provider Dashboard
```

An invited staff member must automatically belong to the correct organization.

Never allow a user to manipulate an organization ID from the frontend to gain access to another tenant.

Tenant membership must be enforced by the backend.

---

# 11. ROLE-BASED ACCESS CONTROL

Roles:

```text
OWNER
ADMIN
ISSUER
VERIFIER
AUDITOR
DEVELOPER
```

Permissions:

### OWNER

Full organization control.

Can:

* manage admins
* manage users
* manage billing
* manage API
* issue credentials
* revoke credentials
* verify proofs
* view audit logs
* change organization settings

### ADMIN

Can:

* manage users
* manage roles
* manage organization profile
* view operational data
* manage approved settings

### ISSUER

Can:

* issue credentials
* view issued credentials
* revoke credentials
* view issuance history

Cannot:

* manage billing
* create admins
* manage API security

### VERIFIER

Can:

* create verification requests
* verify proofs
* view verification history

### AUDITOR

Read-only access to:

* audit logs
* credential activity
* verification activity
* security activity

### DEVELOPER

Can:

* manage API keys
* view API documentation
* configure webhooks
* view API usage

Do NOT implement roles only visually.

Backend authorization must enforce every permission.

---

# 12. SUBSCRIPTION SYSTEM

AfriPass should operate as a SaaS/API platform.

Providers should subscribe to an API plan to access production API functionality.

Create:

```text
/provider/billing
```

and:

```text
/pricing
```

Possible plans:

### Free / Sandbox

For development and testing.

Example:

```text
Sandbox API
Limited requests
Synthetic/test credentials
Test verification
No production issuance
```

### Starter

For small organizations.

Example:

```text
API access
Credential issuance
Proof verification
Basic team members
Basic audit logs
Usage limits
```

### Professional

For growing providers.

Example:

```text
Higher API limits
More team members
Advanced verification
Webhooks
Advanced audit logs
API analytics
Priority support
```

### Enterprise

For large financial organizations.

Example:

```text
Custom API limits
Large-scale verification
Advanced security
Dedicated infrastructure options
Custom integrations
Advanced compliance
SLA
Priority support
```

IMPORTANT:

Do not hardcode prices if billing infrastructure has not been implemented.

Use configurable subscription plans from the backend.

---

# 13. SUBSCRIPTION STATES

Support:

```text
TRIALING
ACTIVE
PAST_DUE
CANCELED
EXPIRED
SUSPENDED
```

The provider dashboard should clearly display:

```text
Plan:
Professional

Status:
Active

API Usage:
72%

Renewal:
30 September 2026
```

If a subscription expires, the backend—not the frontend—must determine what API functionality remains available.

---

# 14. API ACCESS MUST DEPEND ON SUBSCRIPTION

A provider cannot simply create an API key and gain unlimited production access.

The backend must check:

```text
Organization
+
Subscription
+
Subscription status
+
API permission
+
API quota
+
User role
+
API key status
```

before allowing protected API operations.

Example:

```text
API Request
     ↓
Authenticate API Key
     ↓
Identify Organization
     ↓
Check Subscription
     ↓
Check Permission
     ↓
Check Rate Limit
     ↓
Check Quota
     ↓
Authorize Request
     ↓
Execute
```

---

# 15. API MANAGEMENT / DEVELOPER PORTAL

Create:

```text
/provider/api
```

and:

```text
/provider/developer
```

The provider's developer should be able to:

* create API keys
* revoke API keys
* rotate API keys
* view API key status
* view last-used time
* view API permissions
* view API usage
* view API errors
* configure webhooks
* view API documentation
* view sandbox credentials
* manage production API access

Never expose full API secrets after creation.

---

# 16. API KEY SECURITY

API keys must:

* be generated securely
* be hashed where appropriate
* support expiration
* support revocation
* support rotation
* support scopes
* be associated with an organization
* optionally be associated with a team member
* never be stored in plaintext unnecessarily

Example permissions:

```text
credential:issue
credential:read
credential:revoke
verification:create
verification:verify
organization:read
webhook:manage
```

Use least privilege.

---

# 17. API USAGE DASHBOARD

Create:

```text
/provider/api/usage
```

Display:

```text
API Requests

Today
1,284

This Month
18,492

Remaining
81,508

Success Rate
99.4%

Average Response Time
240ms
```

Charts should be driven by backend data.

Support filtering:

* Today
* 7 days
* 30 days
* Custom range

---

# 18. API QUOTAS

Plans must support configurable limits.

Example:

```text
Monthly API Requests
Credential Issuance
Proof Verification
Verification Requests
Webhook Events
Team Members
API Keys
```

Do not hardcode limits in React.

The backend should return the organization's current entitlements.

---

# 19. USAGE ALERTS

Add configurable usage alerts.

Example:

```text
80% API usage
90% API usage
100% API usage
```

Provider admin can receive:

* email notification
* dashboard notification
* webhook notification where configured

---

# 20. BILLING ARCHITECTURE

Create a billing abstraction.

Do NOT tightly couple the application to one payment provider.

Create:

```text
BillingService
PaymentProvider
SubscriptionService
InvoiceService
```

Potential payment providers can later include:

* Paystack
* Flutterwave
* Stripe

The architecture must allow another provider to be added without rewriting the billing system.

---

# 21. INVOICES

Create:

```text
/provider/billing/invoices
```

Show:

```text
Invoice ID
Period
Plan
Amount
Status
Issued
Due
Paid
```

Possible states:

```text
DRAFT
OPEN
PAID
FAILED
VOID
REFUNDED
```

Do not store unnecessary payment-card information.

---

# 22. PROVIDER API SANDBOX

Create a sandbox environment.

Example:

```text
Sandbox
Production
```

Sandbox allows developers to test:

* credential issuance
* verification requests
* proof verification
* webhooks
* API authentication

Synthetic data must be clearly labelled:

```text
SANDBOX DATA
```

Never make sandbox credentials appear to be real financial credentials.

---

# 23. PRODUCTION / SANDBOX SEPARATION

Strictly separate:

```text
Development
Sandbox
Staging
Production
```

Production data must never be mixed with sandbox data.

API keys must be environment-specific.

Example:

```text
sandbox_afp_...
production_afp_...
```

Use separate backend configurations and databases where appropriate.

---

# 24. CREDENTIAL ISSUANCE

Provider issuers should be able to issue:

* Income Credential
* Savings Credential
* Repayment Credential
* Credit Eligibility Credential
* Business Revenue Credential
* Employment Income Credential
* Account Standing Credential

The frontend sends issuance requests to the backend.

Never allow the browser to directly create a trusted issuer credential.

---

# 25. REAL PROVIDER ATTESTATION

A provider-issued credential must contain provenance.

Conceptually:

```text
issuerId
organizationId
credentialId
subjectCommitment
credentialType
claimCommitment
issuedAt
expiresAt
status
signature
signatureAlgorithm
keyId
version
```

The provider cryptographically attests to the credential.

Never allow:

```text
user enters ₦2,000,000
↓
frontend marks verified
```

Instead:

```text
Approved Provider
↓
Attestation
↓
Credential
↓
Midnight ZK Proof
↓
Verifier
```

---

# 26. TRANSACTION EVIDENCE

Support transaction-level evidence when the originating provider actually supplies it.

Possible fields:

```text
transactionReference
providerId
integrityHash
signatureReference
verifiedAt
```

UI:

```text
Issuer Signature
✓ Valid

Transaction Evidence
✓ Validated

Transaction Signature
✓ Valid
```

ONLY display "Transaction Signature: Valid" when a genuine provider-supplied transaction signature exists.

If unavailable:

```text
Transaction Signature
Not provided by issuer

Provider Authentication
✓ Verified
```

Never fabricate transaction signatures.

---

# 27. CREDENTIAL REVOCATION

Providers must be able to revoke credentials.

Require:

* authorization
* reason
* timestamp
* actor
* credential ID

States:

```text
ACTIVE
REVOKED
EXPIRED
SUSPENDED
INVALID
```

Revoked credentials must not be treated as valid by verification services.

---

# 28. VERIFICATION REQUEST SYSTEM

Providers can create requests such as:

```text
Income ≥ ₦1,000,000
```

Purpose:

```text
Loan eligibility
```

User receives:

```text
ABC Finance requests proof of:

Income ≥ ₦1,000,000

Purpose:
Loan application

Data disclosed:
Eligibility result only
```

User must explicitly consent.

---

# 29. VERIFIER PORTAL

Create:

```text
/provider/verify
```

Support:

* Verification code
* QR code
* Proof reference
* Verification request
* API verification

Return:

```text
VALID

Claim:
Income ≥ ₦1,000,000

Credential:
Valid

Issuer:
Approved Provider

Proof:
Cryptographically Valid

Underlying financial information:
Not disclosed
```

---

# 30. QR VERIFICATION

QR codes must never contain unnecessary raw financial information.

Use:

```text
Verification Session ID
+
Secure reference
+
Cryptographic verification information
```

Flow:

```text
User
 ↓
Generate Proof
 ↓
Create Verification Session
 ↓
Generate QR
 ↓
Provider scans
 ↓
AfriPass API
 ↓
Verify
 ↓
Minimum result
```

---

# 31. VERIFICATION SESSION SECURITY

Every verification session should support:

```text
session_id
request_id
created_at
expires_at
status
verifier_id
subject_commitment
proof_reference
```

Statuses:

```text
PENDING
APPROVED
VERIFIED
REJECTED
EXPIRED
REVOKED
```

Sessions should expire automatically.

Example:

```text
Verification expires in 14 minutes
```

---

# 32. PROVIDER DIRECTORY

Create:

```text
/providers
```

Show:

* Organization
* Type
* Country
* Capabilities
* Approval status
* Issuer capability
* Verifier capability

Do not expose customer information.

---

# 33. PROVIDER TRUST MODEL

Provider badges:

```text
✓ AfriPass Approved Provider
✓ Credential Issuer
✓ Proof Verifier
⚠ Pending Approval
✕ Suspended
```

These badges must be backend-derived.

---

# 34. USER FINANCIAL PASSPORT

Users can have credentials from multiple organizations.

Example:

```text
Income
← Employer

Savings
← Bank

Repayment
← Lender

Business Revenue
← Fintech
```

AfriPass combines these into a portable privacy-preserving identity.

No single provider should automatically own the user's entire financial identity.

---

# 35. USER CONSENT CENTER

Create:

```text
/settings/privacy
```

or:

```text
/consents
```

Users should be able to see:

* who requested data/proof
* what claim was requested
* purpose
* what was disclosed
* when access expires
* consent status
* revoke where protocol permits

---

# 36. USER ACTIVITY

Create:

```text
/activity
```

Show:

```text
Credential received
Proof generated
Verification approved
Verification completed
Consent granted
Consent expired
```

Avoid exposing sensitive financial values.

---

# 37. PROVIDER AUDIT LOG

Every organization should have its own audit log.

Events:

* Login
* Logout
* User invited
* User removed
* Role changed
* API key created
* API key revoked
* Credential issued
* Credential revoked
* Verification request created
* Proof verified
* Organization settings changed
* Subscription changed
* Security settings changed

Audit events must contain:

```text
actor
organization
event
resource
timestamp
IP metadata where appropriate
result
```

Never unnecessarily log private financial values.

---

# 38. PLATFORM ADMIN DASHBOARD

In addition to provider dashboards, create a separate internal AfriPass platform administration architecture.

This is NOT the same as provider admin.

Conceptually:

```text
/platform/admin
```

Platform administrators can manage:

* providers
* organizations
* approvals
* subscriptions
* plans
* platform usage
* abuse detection
* system health
* audit events
* provider suspension
* API incidents
* support cases

Provider administrators must never have access to platform administration.

---

# 39. PLATFORM ADMIN ROLES

Support:

```text
PLATFORM_OWNER
PLATFORM_ADMIN
COMPLIANCE_ADMIN
SECURITY_ADMIN
SUPPORT_ADMIN
```

Use strict RBAC.

---

# 40. PROVIDER APPROVAL WORKFLOW

A production provider should pass through:

```text
Registration
↓
Email Verification
↓
Business Information
↓
Review
↓
Approval
↓
Subscription
↓
API Activation
↓
Production Access
```

Do not automatically mark organizations as approved.

---

# 41. PROVIDER SUSPENSION

Platform administrators must be able to suspend a provider.

When suspended:

```text
Production API access
↓
Disabled
```

Existing credentials should be evaluated according to their issuer/revocation policy.

Do not silently delete provider data.

Record:

```text
suspended_at
suspended_by
reason
```

---

# 42. SECURITY CENTER

Create:

```text
/provider/security
```

Show:

* active sessions
* recent logins
* password changes
* MFA status
* API key activity
* suspicious activity
* security events

Add architecture for future:

```text
MFA
Passkeys
SSO
Enterprise SSO
IP restrictions
Device/session management
```

Do not implement fake security features.

---

# 43. MFA-READY ARCHITECTURE

Sensitive provider actions should support step-up authentication.

Examples:

* Creating API keys
* Revoking credentials
* Changing admin permissions
* Changing billing
* Changing signing configuration

---

# 44. NOTIFICATION CENTER

Create:

```text
/notifications
```

Notifications:

```text
Verification request received
Credential issued
Credential expiring
Credential revoked
API usage approaching limit
Subscription renewal
Payment failure
Team invitation
Security alert
Provider approval
Provider suspension
```

Support read/unread states.

---

# 45. EMAIL ARCHITECTURE

Create backend abstractions:

```text
EmailService
NotificationService
TemplateService
```

Potential future providers:

```text
Resend
SendGrid
Amazon SES
Postmark
```

Do not hardcode email delivery directly into business logic.

---

# 46. WEBHOOK SYSTEM

Providers should be able to configure webhook endpoints.

Events:

```text
credential.issued
credential.revoked
credential.expired
verification.requested
verification.completed
proof.verified
subscription.updated
api.limit.warning
```

Webhook security:

* signing secret
* event ID
* timestamp
* signature
* retry mechanism
* idempotency

---

# 47. IDEMPOTENCY

Production API endpoints that create financial credentials, verification requests, payments, or other important resources should support idempotency where appropriate.

Example:

```text
Idempotency-Key
```

The backend must prevent accidental duplicate issuance.

---

# 48. RATE LIMITING

Implement rate limiting at:

```text
IP
User
Organization
API key
Endpoint
```

Different plans can have different limits.

Example:

```text
Sandbox:
100 requests/day

Starter:
10,000/month

Professional:
100,000/month

Enterprise:
Custom
```

These are examples only.

Actual limits must come from backend configuration.

---

# 49. API VERSIONING

Use:

```text
/api/v1/
```

Do not build an API that cannot evolve.

Future:

```text
/api/v2/
```

should be possible without breaking v1 consumers.

---

# 50. BACKEND ARCHITECTURE

The production backend should be written in Go.

Suggested architecture:

```text
backend/

cmd/
  server/
    main.go

internal/

auth/
users/
organizations/
providers/
members/
roles/
permissions/

credentials/
claims/
attestations/
issuers/
revocations/

verification/
verification_requests/
verification_sessions/

proofs/
midnight/

transactions/

consent/

subscriptions/
billing/
plans/
invoices/

api_keys/
webhooks/
notifications/
email/

audit/
security/

platform_admin/

database/
config/
middleware/

pkg/
  crypto/
  response/
  validation/
  logging/

migrations/

api/
  openapi/

tests/

Dockerfile
docker-compose.yml
go.mod
.env.example
README.md
```

---

# 51. DATABASE

Use PostgreSQL for production.

Important tables/entities:

```text
users
organizations
organization_members
roles
permissions
providers

credentials
credential_claims
attestations
credential_revocations

verification_requests
verification_sessions
verification_results

proofs
consents

api_keys
api_usage
api_rate_limits

subscriptions
subscription_plans
subscription_events
invoices

webhooks
webhook_deliveries

audit_events
security_events

notifications
email_events

transaction_evidence

issuer_keys
credential_signatures

platform_admins
provider_reviews
provider_suspensions
```

Every tenant-owned table must have a clear organization relationship where appropriate.

---

# 52. TENANT ISOLATION

This is mandatory.

Every backend request involving provider data must establish:

```text
Authenticated identity
↓
Organization membership
↓
Role
↓
Permission
↓
Tenant scope
```

Never trust:

```text
organization_id
```

sent by the browser without validating that the authenticated user belongs to that organization.

---

# 53. AUTHENTICATION

Implement production-ready authentication.

Endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/verify-email
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

Use secure password hashing such as:

```text
Argon2id
```

or another strong production-approved password hashing strategy.

Use secure sessions/tokens.

Never place authentication secrets in React.

---

# 54. PROVIDER ENDPOINTS

Conceptually:

```text
POST   /api/v1/providers/register
GET    /api/v1/providers/me
PATCH  /api/v1/providers/me
GET    /api/v1/providers/me/status
```

---

# 55. TEAM ENDPOINTS

```text
GET    /api/v1/provider/members
POST   /api/v1/provider/members/invite
POST   /api/v1/provider/members
PATCH  /api/v1/provider/members/{id}
DELETE /api/v1/provider/members/{id}
POST   /api/v1/provider/members/{id}/suspend
```

Every endpoint must enforce organization boundaries.

---

# 56. CREDENTIAL ENDPOINTS

```text
POST /api/v1/provider/credentials
GET  /api/v1/provider/credentials
GET  /api/v1/provider/credentials/{id}
POST /api/v1/provider/credentials/{id}/revoke
```

---

# 57. VERIFICATION ENDPOINTS

```text
POST /api/v1/verification-requests
GET  /api/v1/verification-requests
GET  /api/v1/verification-requests/{id}

POST /api/v1/verification-sessions
POST /api/v1/proofs/verify
```

---

# 58. SUBSCRIPTION ENDPOINTS

```text
GET  /api/v1/provider/subscription
GET  /api/v1/provider/plans
POST /api/v1/provider/subscription/checkout
POST /api/v1/provider/subscription/cancel
POST /api/v1/provider/subscription/change
GET  /api/v1/provider/invoices
```

Payment confirmation must happen through the backend/payment provider webhook.

Never trust:

```text
frontend says payment = successful
```

as authoritative.

---

# 59. API MANAGEMENT ENDPOINTS

```text
POST   /api/v1/provider/api-keys
GET    /api/v1/provider/api-keys
POST   /api/v1/provider/api-keys/{id}/rotate
DELETE /api/v1/provider/api-keys/{id}
GET    /api/v1/provider/api-usage
```

---

# 60. WEBHOOK ENDPOINTS

```text
POST /api/v1/provider/webhooks
GET  /api/v1/provider/webhooks
PATCH /api/v1/provider/webhooks/{id}
DELETE /api/v1/provider/webhooks/{id}
POST /api/v1/provider/webhooks/{id}/test
```

---

# 61. BILLING WEBHOOKS

Payment providers should notify the backend.

Example:

```text
payment successful
payment failed
subscription renewed
subscription canceled
subscription expired
```

The backend updates subscription state.

Never rely solely on browser redirects.

---

# 62. MIDNIGHT INTEGRATION

KEEP MIDNIGHT.

Midnight remains the privacy/ZK layer.

Architecture:

```text
React / TypeScript
       ↓
AfriPass Go API
       ↓
Credential / Attestation Service
       ↓
Midnight Integration
       ↓
Compact Contract
       ↓
ZK Proof
       ↓
Verifier
```

Do not move private issuer signing keys into the browser.

Do not replace Midnight with another blockchain.

---

# 63. MIDNIGHT / BACKEND BOUNDARY

Clearly separate:

### Backend responsibilities

* provider authentication
* organization management
* credential lifecycle
* issuer attestation
* authorization
* subscriptions
* API access
* audit
* verification request management
* transaction evidence
* provider trust

### Midnight responsibilities

* private witness
* ZK circuits
* privacy-preserving proof
* proof verification
* required ledger state

Do not turn PostgreSQL into a replacement for Midnight's privacy layer.

---

# 64. PRIVATE DATA PRINCIPLE

AfriPass must NOT become a giant centralized financial-history database.

Store only what is necessary.

Prefer:

```text
commitments
hashes
references
attestations
metadata
proofs
verification results
```

over storing complete financial histories.

---

# 65. PROVIDER INTEGRATIONS

Create an adapter architecture.

Example:

```text
ProviderAdapter

BankAdapter
FintechAdapter
LenderAdapter
MicrofinanceAdapter
CooperativeAdapter
EmployerAdapter
```

Provider-specific data should be normalized into AfriPass credential structures.

Do not hardcode one bank.

Support future:

* REST APIs
* Webhooks
* secure file import
* OAuth-style provider authorization where appropriate
* enterprise integrations

---

# 66. REAL-WORLD DATA VERIFICATION

The system must distinguish:

```text
User-provided claim
```

from:

```text
Provider-attested claim
```

from:

```text
Cryptographically verified proof
```

These are three different trust levels.

Example UI:

```text
User Claim
Unverified

Provider Attestation
✓ Valid

Credential
✓ Active

Midnight Proof
✓ Cryptographically Valid
```

---

# 67. PRODUCTION USER EXPERIENCE

The user should not need to understand blockchain terminology to use AfriPass.

Explain complex cryptography in simple language.

Example:

Instead of:

```text
Witness commitment circuit successfully executed
```

prefer:

```text
Your proof was generated without revealing your underlying financial information.
```

---

# 68. STATUS SYSTEM

Use explicit statuses.

Provider:

```text
Pending
Approved
Suspended
Rejected
Deactivated
```

Credential:

```text
Pending
Attested
Active
Expired
Revoked
Suspended
Invalid
```

Verification:

```text
Pending
Approved
Verified
Rejected
Expired
```

Subscription:

```text
Trial
Active
Past Due
Canceled
Expired
Suspended
```

API:

```text
Active
Restricted
Revoked
Expired
```

---

# 69. ERROR HANDLING

Support:

```text
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Rate Limited
500 Internal Error
503 Service Unavailable
```

Never expose stack traces or secrets.

---

# 70. OBSERVABILITY

Production backend should support:

* structured logging
* metrics
* request IDs
* tracing-ready architecture
* health checks
* readiness checks
* error monitoring

Endpoints:

```text
GET /health
GET /ready
```

---

# 71. DATABASE MIGRATIONS

Use versioned migrations.

Never modify production schema manually.

Migration system should support:

```text
up
down
version
status
```

---

# 72. BACKUPS / RECOVERY ARCHITECTURE

Design for:

* automated database backups
* retention policies
* restore testing
* disaster recovery
* database replication where appropriate

Do not claim backups are operational until actually configured.

---

# 73. SECURITY HEADERS

Production API should support appropriate security headers and secure CORS configuration.

Never use:

```text
Access-Control-Allow-Origin: *
```

for authenticated production endpoints unless there is a deliberate security reason.

---

# 74. SECRETS MANAGEMENT

Never commit:

* database passwords
* JWT secrets
* API secrets
* provider signing keys
* payment secrets
* webhook secrets
* Midnight private keys

Use environment variables locally and a proper secret-management solution in production.

Issuer signing keys should preferably use:

```text
KMS
HSM
Dedicated signing service
```

or another secure key-management architecture.

---

# 75. FRONTEND ARCHITECTURE

Keep UI separate from infrastructure.

Create:

```text
services/

authService
providerService
organizationService
memberService
credentialService
attestationService
verificationService
proofService
subscriptionService
billingService
apiKeyService
webhookService
notificationService
auditService
midnightService
```

Components should consume these services instead of making random API calls.

---

# 76. FRONTEND ROUTES

Consumer:

```text
/
 /passport
 /passport/credentials
 /requests
 /consents
 /activity
 /providers
 /settings
```

Provider:

```text
/provider/login
/provider/register
/provider/dashboard
/provider/credentials
/provider/credentials/issue
/provider/verifications
/provider/verify
/provider/team
/provider/organization
/provider/api
/provider/api/usage
/provider/developer
/provider/billing
/provider/invoices
/provider/security
/provider/audit
/provider/settings
```

Platform:

```text
/platform/admin
/platform/providers
/platform/subscriptions
/platform/audit
/platform/security
```

Protect provider and platform routes.

---

# 77. PROVIDER DASHBOARD SIDEBAR

Use:

```text
Dashboard

Credentials
├── All Credentials
├── Issue Credential
└── Revoked

Verification
├── Requests
├── Verify Proof
└── History

Team
├── Users
├── Roles
└── Invitations

Developer
├── API Keys
├── API Usage
├── Webhooks
└── API Documentation

Billing
├── Current Plan
├── Change Plan
└── Invoices

Organization

Security

Audit Logs

Settings
```

---

# 78. ADMIN DASHBOARD

Admin should see:

```text
Organization Overview

Team Members

Credentials

Verification Activity

API Usage

Subscription

Security

Audit Logs
```

The admin must NOT automatically receive access to private financial values simply because they are an admin.

Privacy boundaries still apply.

---

# 79. API DEVELOPER EXPERIENCE

Provide API documentation inside AfriPass.

Show:

```text
Authentication
Credentials
Verification Requests
Proof Verification
Webhooks
Errors
Rate Limits
API Versions
Examples
```

Include copyable examples eventually.

Do not expose real API keys in documentation.

---

# 80. SDK-READY API

Design the Go API so AfriPass can later provide official SDKs.

Potential future SDKs:

```text
JavaScript / TypeScript
Python
Go
PHP
Java
```

The API contract should be stable and documented with OpenAPI.

---

# 81. WEBHOOK RELIABILITY

Webhook delivery should support:

```text
retry
exponential backoff
signature verification
idempotency
delivery history
failure status
manual retry
```

Provider dashboard:

```text
Webhook Delivery

✓ Delivered
✕ Failed
↻ Retry
```

---

# 82. SUPPORT / HELP CENTER

Add a provider support area.

Possible:

```text
/provider/support
```

Allow:

* documentation
* API guides
* security guides
* integration guides
* contact support
* incident status

Do not implement fake support tickets unless backend support exists.

---

# 83. INCIDENT / STATUS SYSTEM

Production architecture should support a future:

```text
/status
```

page.

Possible services:

```text
AfriPass API
Verification Service
Credential Service
Midnight Integration
Webhook Service
```

Statuses:

```text
Operational
Degraded
Partial Outage
Major Outage
```

---

# 84. COMPLIANCE-READY ARCHITECTURE

Do not claim AfriPass is legally compliant with any specific regulation unless actually assessed.

However, design for:

* data minimization
* consent
* auditability
* access control
* retention policies
* deletion workflows
* incident response
* data export
* privacy controls

---

# 85. DATA RETENTION

Create configurable retention policies.

Examples:

```text
Audit records
Verification sessions
Webhook logs
API logs
Expired credentials
Revoked credentials
```

Do not delete records simply because they are old if legal/audit requirements require retention.

Make retention configurable by policy.

---

# 86. DATA EXPORT

Allow organization administrators to export appropriate organization-level data.

Examples:

```text
Audit logs
Credential records
Verification history
API usage
Invoices
```

Exports must respect tenant isolation and user privacy.

---

# 87. DATA DELETION

Design deletion workflows carefully.

Do not allow a normal admin to delete critical audit records.

Use states such as:

```text
ACTIVE
DELETION_REQUESTED
DELETED
```

Where permanent deletion is appropriate.

---

# 88. PRIVACY-FIRST DEFAULTS

Default to minimum disclosure.

Never make:

```text
full income
full transactions
full account history
```

the default verification output.

Default:

```text
Claim satisfied
```

---

# 89. NO FAKE PRODUCTION DATA

Development and sandbox data must have obvious labels:

```text
DEMO
SYNTHETIC
SANDBOX
TEST
```

Never display fictional providers as real financial institutions.

Never fabricate:

* bank transactions
* signatures
* attestations
* production API usage
* payments
* subscriptions
* provider approval
* cryptographic verification

---

# 90. FRONTEND ENVIRONMENT

Use:

```text
Development
Staging
Production
```

Example:

```text
VITE_API_URL
VITE_MIDNIGHT_NETWORK
VITE_APP_ENV
```

Never put server secrets in VITE environment variables.

---

# 91. LIGHT AND DARK MODE

Preserve the existing Light/Dark mode.

All new screens must work correctly in:

```text
Light
Dark
```

---

# 92. MOBILE-FIRST PROVIDER EXPERIENCE

Provider dashboard must work on:

```text
Desktop
Tablet
Mobile
```

Verification should be particularly optimized for mobile because QR verification may happen on phones.

---

# 93. ACCESSIBILITY

Use:

* semantic HTML
* keyboard navigation
* accessible forms
* focus states
* screen reader support
* appropriate ARIA
* sufficient contrast

Never communicate status using color alone.

---

# 94. PERFORMANCE

Provider dashboards must support organizations with large datasets.

Use:

* pagination
* server-side filtering
* server-side sorting
* search
* lazy loading
* caching where appropriate

Do not load thousands of credentials into the browser at once.

---

# 95. SEARCH

Provider users should be able to search:

Credentials:

```text
Credential ID
Subject reference
Credential type
Status
```

Verification:

```text
Request ID
Status
Date
Claim type
```

Do not expose unnecessary personal information.

---

# 96. AUDITABLE CRYPTOGRAPHIC PROVENANCE

Every trusted credential should be traceable through:

```text
Provider
↓
Attestation
↓
Credential
↓
Proof
↓
Verification
```

The verifier should be able to establish:

* who issued the credential
* whether issuer is approved
* whether credential is valid
* whether credential has expired
* whether credential has been revoked
* whether proof is cryptographically valid

without receiving the underlying financial history.

---

# 97. COMPLETE PROVIDER FLOW

```text
Provider registers
        ↓
Email verification
        ↓
Business review
        ↓
Provider approved
        ↓
Select subscription
        ↓
Payment confirmed
        ↓
API activated
        ↓
Admin enters dashboard
        ↓
Admin creates/invites staff
        ↓
Assign roles
        ↓
Developer creates API key
        ↓
Integrate provider system
        ↓
Issue credential
        ↓
Credential attested
        ↓
User receives credential
        ↓
User gives consent
        ↓
Midnight generates ZK proof
        ↓
Verifier requests proof
        ↓
Proof verified
        ↓
Provider receives minimum required result
```

---

# 98. COMPLETE USER FLOW

```text
User
 ↓
Connect Lace
 ↓
Create AfriPass
 ↓
Receive provider credentials
 ↓
View credential provenance
 ↓
Receive verification request
 ↓
Review request
 ↓
Give consent
 ↓
Select credential
 ↓
Midnight generates proof
 ↓
Generate QR / verification session
 ↓
Provider verifies
 ↓
Result returned
 ↓
Underlying financial information remains protected
```

---

# 99. COMPLETE PLATFORM FLOW

```text
AfriPass Platform
        ↓
Provider Network
        ↓
Organizations
        ↓
Subscriptions
        ↓
API Access
        ↓
Credential Issuance
        ↓
Attestations
        ↓
User Passports
        ↓
Consent
        ↓
Midnight ZK
        ↓
Verification
        ↓
Audit / Analytics
```

---

# 100. PRODUCTION-READINESS CHECKLIST

The system should eventually satisfy:

### Multi-tenancy

[ ] Every provider has an isolated organization

[ ] Tenant boundaries are enforced by backend

[ ] Cross-tenant access is impossible

[ ] Organization admins exist

[ ] Staff members belong to organizations

[ ] Roles and permissions are enforced

### Provider

[ ] Provider registration

[ ] Provider approval

[ ] Provider dashboard

[ ] Organization profile

[ ] Team management

[ ] Issuer capability

[ ] Verifier capability

### Credentials

[ ] Real provider attestation

[ ] Credential lifecycle

[ ] Expiration

[ ] Revocation

[ ] Provenance

[ ] Cryptographic integrity

### Verification

[ ] Verification requests

[ ] User consent

[ ] Midnight proof generation

[ ] Proof verification

[ ] QR verification

[ ] Expiring sessions

[ ] Minimum disclosure

### API

[ ] API keys

[ ] API scopes

[ ] API rotation

[ ] API revocation

[ ] API usage

[ ] API quotas

[ ] Rate limits

[ ] API versioning

[ ] OpenAPI documentation

### SaaS

[ ] Subscription plans

[ ] Subscription status

[ ] Usage limits

[ ] Billing abstraction

[ ] Invoices

[ ] Payment webhook architecture

[ ] Sandbox

[ ] Production environment

### Security

[ ] Secure authentication

[ ] Password hashing

[ ] Session management

[ ] MFA-ready architecture

[ ] Secure API keys

[ ] Signing-key protection

[ ] Audit logs

[ ] Security events

[ ] Tenant isolation

[ ] Rate limiting

[ ] Secure CORS

### Operations

[ ] Health checks

[ ] Readiness checks

[ ] Structured logs

[ ] Metrics-ready architecture

[ ] Database migrations

[ ] Backup strategy

[ ] Error monitoring-ready

### UX

[ ] Light mode

[ ] Dark mode

[ ] Mobile responsive

[ ] Accessible

[ ] Loading states

[ ] Error states

[ ] Notifications

[ ] Provider onboarding

[ ] Developer portal

---

# 101. CRITICAL SECURITY RULE

Never implement:

```text
User enters income
↓
Frontend says verified
↓
ZK proof
↓
Lender
```

Implement:

```text
Approved Provider
↓
Provider Attestation
↓
Financial Credential
↓
Private User Data
↓
Midnight ZK Proof
↓
Authorized Verifier
↓
Minimum Disclosure
```

Provider attestation establishes provenance.

Midnight establishes the privacy-preserving proof of the required condition.

These are separate trust layers.

---

# 102. IMPLEMENTATION ORDER

Do NOT attempt to build every feature at once.

Implement in phases.

## PHASE 1 — GO BACKEND FOUNDATION

Build:

* Go server
* PostgreSQL
* migrations
* configuration
* logging
* error handling
* health checks
* Docker
* OpenAPI

---

## PHASE 2 — AUTHENTICATION

Build:

* registration
* login
* logout
* refresh
* email verification
* password reset
* secure password hashing
* sessions/tokens

---

## PHASE 3 — MULTI-TENANCY

Build:

* organizations
* organization members
* roles
* permissions
* tenant middleware
* tenant isolation

This phase is extremely important.

---

## PHASE 4 — PROVIDER ONBOARDING

Build:

* provider registration
* provider review
* provider approval
* provider status
* provider dashboard

---

## PHASE 5 — TEAM MANAGEMENT

Build:

* invite staff
* accept invitation
* create users
* assign roles
* deactivate users
* role permissions

---

## PHASE 6 — CREDENTIAL SYSTEM

Build:

* credentials
* claims
* attestations
* issuer identity
* expiration
* revocation
* provenance
* transaction evidence

---

## PHASE 7 — VERIFICATION

Build:

* verification requests
* verification sessions
* consent
* proof verification
* verification history
* QR verification

---

## PHASE 8 — MIDNIGHT INTEGRATION

Connect the existing Midnight functionality to the backend architecture.

Do NOT rewrite the existing Compact/ZK implementation unnecessarily.

---

## PHASE 9 — API PLATFORM

Build:

* API keys
* scopes
* rotation
* rate limits
* quotas
* usage tracking
* API documentation
* webhooks

---

## PHASE 10 — SUBSCRIPTIONS

Build:

* plans
* subscriptions
* billing abstraction
* invoices
* payment provider integration
* payment webhooks
* subscription enforcement

---

## PHASE 11 — SECURITY

Add:

* MFA-ready architecture
* secure key management
* audit logs
* security events
* rate limiting
* session management
* tenant security testing

---

## PHASE 12 — PRODUCTION HARDENING

Add:

* observability
* monitoring
* backups
* disaster recovery strategy
* performance optimization
* database indexing
* load testing
* security testing
* API integration testing

---

# 103. DEVELOPMENT RULE

At the beginning of each phase:

1. Inspect the existing repository.
2. Understand the existing architecture.
3. Identify what already exists.
4. Do NOT duplicate existing functionality.
5. Reuse existing Midnight integration.
6. Implement only the necessary new layer.
7. Run tests.
8. Run linting.
9. Verify the existing Level 2 functionality still works.
10. Document what changed.

---

# 104. DO NOT MAKE UNJUSTIFIED ARCHITECTURAL CHANGES

If an existing implementation works, preserve it.

Do not replace:

```text
Midnight
```

with another blockchain.

Do not replace:

```text
React/TypeScript
```

unless absolutely necessary.

Do not replace existing working UI components unnecessarily.

Do not introduce microservices prematurely.

The initial Go backend should preferably be a **well-structured modular monolith**.

Design clean service boundaries so individual components can later be extracted if scale requires it.

---

# 105. RECOMMENDED PRODUCTION ARCHITECTURE

Start with:

```text
                    ┌──────────────────────┐
                    │      AfriPass        │
                    │   React / Next.js    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Go API          │
                    │   Modular Monolith   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                     │
          ▼                    ▼                     ▼
   Authentication       Organization/Tenant      Credentials
          │                    │                     │
          │                    │                     ▼
          │                    │                Attestation
          │                    │                     │
          │                    │                     ▼
          │                    │                 Verification
          │                    │                     │
          │                    │                     ▼
          │                    │              Midnight Service
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               │
                               ▼
                         PostgreSQL
                               │
                               ▼
                    Audit / Usage / Billing
```

Supporting infrastructure:

```text
Go API
 ├── PostgreSQL
 ├── Redis (future)
 ├── Object Storage (future)
 ├── KMS/HSM (production)
 ├── Email Service
 ├── Payment Provider
 ├── Monitoring
 └── Midnight Network
```

Do not introduce Redis or other infrastructure unless actually needed.

---

# 106. FINAL PRODUCT POSITIONING

AfriPass should communicate:

## AfriPass

### Your financial credentials. Your privacy.

For providers:

**ISSUE. VERIFY. PROTECT.**

For users:

**PROVE MORE. REVEAL LESS.**

For developers:

**ONE API FOR PRIVACY-PRESERVING FINANCIAL VERIFICATION.**

Core infrastructure:

```text
Provider
    ↓
Attestation
    ↓
Credential
    ↓
Consent
    ↓
Midnight ZK Proof
    ↓
Verification
    ↓
Minimum Disclosure
```

AfriPass is a:

**privacy-preserving financial credential and verification infrastructure layer connecting users and trusted financial-service providers.**

---

# 107. FINAL ACCEPTANCE CRITERIA

The production foundation is successful when:

[ ] Existing Level 2 still works

[ ] Lace wallet still works

[ ] Midnight.js still works

[ ] Compact contract still works

[ ] Existing ZK proof flow still works

[ ] Go backend is running

[ ] PostgreSQL is connected

[ ] Authentication works

[ ] Multi-tenancy works

[ ] Provider organizations exist

[ ] Provider dashboards are isolated

[ ] Organization admins can create/invite users

[ ] Roles and permissions are enforced by backend

[ ] Provider approval exists

[ ] Credentials have provenance

[ ] Attestations are cryptographically represented

[ ] Credentials support expiration

[ ] Credentials support revocation

[ ] Verification requests work

[ ] User consent works

[ ] Midnight proof remains the privacy layer

[ ] Verification results minimize disclosure

[ ] QR verification architecture exists

[ ] API keys work

[ ] API scopes work

[ ] API usage is tracked

[ ] API quotas exist

[ ] Rate limiting exists

[ ] Sandbox exists

[ ] Production environment exists

[ ] Subscription plans exist

[ ] Subscription status is enforced by backend

[ ] Billing architecture exists

[ ] Invoices exist

[ ] Payment webhook architecture exists

[ ] Webhooks exist

[ ] Audit logs exist

[ ] Security events exist

[ ] Platform administration exists

[ ] Provider suspension exists

[ ] Notifications exist

[ ] OpenAPI documentation exists

[ ] Health checks exist

[ ] Structured logging exists

[ ] Tenant isolation has tests

[ ] No frontend secrets exist

[ ] No fake production verification exists

[ ] No fabricated transaction signatures exist

[ ] No private financial history is unnecessarily centralized

[ ] Light mode works

[ ] Dark mode works

[ ] Mobile works

[ ] Accessibility is considered

[ ] Development/Sandbox/Staging/Production are separated

---

# 108. MOST IMPORTANT IMPLEMENTATION PRINCIPLE

Build AfriPass as a **network and platform**, not just a demo.

A provider should be able to:

```text
Create Organization
        ↓
Subscribe
        ↓
Get API Access
        ↓
Create Team
        ↓
Assign Roles
        ↓
Integrate API
        ↓
Issue Credentials
        ↓
Request Verification
        ↓
Verify ZK Proofs
        ↓
Monitor Usage
        ↓
Manage Billing
        ↓
Audit Activity
```

A user should be able to:

```text
Create Passport
        ↓
Receive Credentials
        ↓
See Trusted Issuers
        ↓
Receive Verification Request
        ↓
Give Consent
        ↓
Generate Midnight ZK Proof
        ↓
Share QR / Proof
        ↓
Keep Underlying Financial Data Private
```

And AfriPass should sit between them as the privacy infrastructure layer:

```text
          PROVIDERS
              │
              │ Attest
              ▼
        ┌─────────────┐
        │   AfriPass  │
        │ Credential   │
        │ Verification │
        │ API Network  │
        └──────┬──────┘
               │
               │ Privacy
               ▼
          MIDNIGHT ZK
               │
               ▼
             USERS
               │
               ▼
           VERIFIERS
```

Build this as a credible foundation for a real financial verification network—not merely as a visual demonstration.


Note: No demo coding or hardcoded