package database

import (
	"sync"
	"time"
)

type Organization struct {
	ID                     string    `json:"id"`
	Name                   string    `json:"name"`
	Type                   string    `json:"type"`
	Country                string    `json:"country"`
	BusinessEmail          string    `json:"businessEmail"`
	Website                string    `json:"website"`
	ContactPerson          string    `json:"contactPerson"`
	Role                   string    `json:"role"`
	Status                 string    `json:"status"` // 'pending', 'approved', 'suspended', 'rejected'
	CredentialsIssuedCount int       `json:"credentialsIssuedCount"`
	ActiveCredentialsCount int       `json:"activeCredentialsCount"`
	ProofsVerifiedCount    int       `json:"proofsVerifiedCount"`
	CreatedAt              time.Time `json:"createdAt"`
}

type User struct {
	ID                 string    `json:"id"`
	FirstName          string    `json:"firstName"`
	LastName           string    `json:"lastName"`
	Email              string    `json:"email"`
	PasswordHash       string    `json:"-"`
	PhoneNumber        string    `json:"phoneNumber"`
	OrgID              string    `json:"organizationId"`
	Role               string    `json:"role"` // 'OWNER', 'ADMIN', 'ISSUER', 'VERIFIER', 'AUDITOR', 'DEVELOPER'
	AccountStatus      string    `json:"accountStatus"` // 'pending_verification', 'active', 'suspended', 'deactivated'
	EmailVerified      bool      `json:"emailVerified"`
	LastLoginAt        *time.Time `json:"lastLoginAt,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
}

type Session struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	OrgID     string    `json:"organizationId"`
	Token     string    `json:"token"`
	Device    string    `json:"device"`
	Browser   string    `json:"browser"`
	IP        string    `json:"ip"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"createdAt"`
	LastActive time.Time `json:"lastActive"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type EmailVerificationToken struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type PasswordResetToken struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	Email     string    `json:"email"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type Invitation struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"organizationId"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Role      string    `json:"role"`
	Token     string    `json:"token"`
	Status    string    `json:"status"` // 'pending', 'accepted', 'expired'
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type Credential struct {
	ID                string    `json:"credentialId"`
	Type              string    `json:"type"`
	Claim             string    `json:"claim"`
	Value             float64   `json:"value"`
	FormattedValue    string    `json:"formattedValue"`
	DisplayThreshold  string    `json:"displayThreshold"`
	Currency          string    `json:"currency"`
	Period            string    `json:"period"`
	IssuerID          string    `json:"issuerId"`
	IssuerName        string    `json:"issuerName"`
	IssuerStatus      string    `json:"issuerStatus"`
	IssuedAt          time.Time `json:"issuedAt"`
	ExpiresAt         time.Time `json:"expiresAt"`
	Status            string    `json:"status"` // 'active', 'expired', 'revoked'
	RevocationReason  string    `json:"revocationReason,omitempty"`
	Signature         string    `json:"signature"`
	KeyID             string    `json:"keyId"`
}

type VerificationRequest struct {
	ID                 string    `json:"id"`
	ProviderID         string    `json:"providerId"`
	ProviderName       string    `json:"providerName"`
	CredentialType     string    `json:"credentialType"`
	ClaimRequired     string    `json:"claimRequired"`
	Threshold          float64   `json:"threshold"`
	FormattedThreshold string    `json:"formattedThreshold"`
	Purpose            string    `json:"purpose"`
	Status             string    `json:"status"` // 'pending', 'approved', 'rejected', 'expired'
	RequestedAt        time.Time `json:"requestedAt"`
	ExpiresAt          time.Time `json:"expiresAt"`
}

type AuditEvent struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"organizationId"`
	Timestamp time.Time `json:"timestamp"`
	Category  string    `json:"category"`
	Action    string    `json:"action"`
	Details   string    `json:"details"`
	Actor     string    `json:"actor"`
	Severity  string    `json:"severity"`
}

type ApiKey struct {
	ID          string    `json:"id"`
	ProviderID  string    `json:"providerId"`
	Name        string    `json:"name"`
	KeyPrefix   string    `json:"keyPrefix"`
	HashedSecret string   `json:"-"`
	MaskedKey   string    `json:"maskedKey"`
	Permissions string    `json:"permissions"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	LastUsedAt  *time.Time `json:"lastUsedAt"`
}

// MemoryStore provides in-memory repository implementation for quick dev/testing execution
type MemoryStore struct {
	mu                      sync.RWMutex
	Users                   map[string]*User
	Organizations           map[string]*Organization
	Sessions                map[string]*Session
	VerificationTokens      map[string]*EmailVerificationToken
	PasswordResetTokens     map[string]*PasswordResetToken
	Invitations             map[string]*Invitation
	Credentials             map[string]*Credential
	VerificationRequests    map[string]*VerificationRequest
	AuditEvents             []*AuditEvent
	ApiKeys                 map[string]*ApiKey
}

var globalStore *MemoryStore
var once sync.Once

func GetStore() *MemoryStore {
	once.Do(func() {
		globalStore = &MemoryStore{
			Users:                make(map[string]*User),
			Organizations:        make(map[string]*Organization),
			Sessions:             make(map[string]*Session),
			VerificationTokens:   make(map[string]*EmailVerificationToken),
			PasswordResetTokens:  make(map[string]*PasswordResetToken),
			Invitations:          make(map[string]*Invitation),
			Credentials:          make(map[string]*Credential),
			VerificationRequests: make(map[string]*VerificationRequest),
			AuditEvents:          make([]*AuditEvent, 0),
			ApiKeys:              make(map[string]*ApiKey),
		}
		seedMockData(globalStore)
	})
	return globalStore
}

func seedMockData(s *MemoryStore) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Seed Demo Bank Organization
	s.Organizations["prov-demo-bank"] = &Organization{
		ID:                     "prov-demo-bank",
		Name:                   "Demo Bank Nigeria",
		Type:                   "Bank",
		Country:                "Nigeria",
		BusinessEmail:          "compliance@demobank.ng",
		Website:                "https://demobank.ng",
		ContactPerson:          "Amina Bello",
		Role:                   "both",
		Status:                 "approved",
		CredentialsIssuedCount: 1284,
		ActiveCredentialsCount: 1201,
		ProofsVerifiedCount:    486,
		CreatedAt:              time.Now().Add(-180 * 24 * time.Hour),
	}

	// Seed Demo Administrator User
	now := time.Now()
	s.Users["user_demo_admin"] = &User{
		ID:            "user_demo_admin",
		FirstName:     "Amina",
		LastName:      "Bello",
		Email:         "compliance@demobank.ng",
		PasswordHash:  "hashed_password_sample",
		PhoneNumber:   "+2348012345678",
		OrgID:         "prov-demo-bank",
		Role:          "OWNER",
		AccountStatus: "active",
		EmailVerified: true,
		LastLoginAt:   &now,
		CreatedAt:     time.Now().Add(-180 * 24 * time.Hour),
	}

	// Seed Sample Session
	s.Sessions["sess_sample_001"] = &Session{
		ID:         "sess_sample_001",
		UserID:     "user_demo_admin",
		OrgID:      "prov-demo-bank",
		Token:      "afripass_jwt_token_sample",
		Device:     "MacBook Pro 16",
		Browser:    "Chrome 122.0",
		IP:         "197.210.64.12",
		Location:   "Lagos, Nigeria",
		CreatedAt:  time.Now().Add(-2 * time.Hour),
		LastActive: time.Now(),
		ExpiresAt:  time.Now().Add(24 * time.Hour),
	}

	// Seed Sample Credential
	s.Credentials["AFP-CRED-001"] = &Credential{
		ID:               "AFP-CRED-001",
		Type:             "income",
		Claim:            "Monthly Income Credential",
		Value:            2000000,
		FormattedValue:   "₦2,000,000",
		DisplayThreshold: "₦2.0M+",
		Currency:         "NGN",
		Period:           "6 months",
		IssuerID:         "prov-demo-bank",
		IssuerName:       "Demo Bank Nigeria",
		IssuerStatus:     "verified",
		IssuedAt:         time.Now().Add(-30 * 24 * time.Hour),
		ExpiresAt:        time.Now().Add(300 * 24 * time.Hour),
		Status:           "active",
		Signature:        "9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a",
		KeyID:            "key_001",
	}
}
