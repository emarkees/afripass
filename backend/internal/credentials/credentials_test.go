package credentials

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/afripass/backend/internal/database"
)

func TestIssueCredentialHandler(t *testing.T) {
	// Ensure store is initialized
	_ = database.GetStore()

	body := IssueCredentialRequest{
		Type:      "income",
		Claim:     "Monthly Income Credential",
		Value:     2500000,
		Currency:  "NGN",
		Period:    "6 months",
		IssuerID:  "org-first-horizon",
		ExpiresAt: "2027-01-01",
	}

	jsonBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/providers/credentials", bytes.NewBuffer(jsonBytes))
	w := httptest.NewRecorder()

	HandleIssue(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusCreated {
		t.Fatalf("expected status 201, got %d", res.StatusCode)
	}
}

func TestUnapprovedIssuerRejection(t *testing.T) {
	store := database.GetStore()
	store.Organizations["unapproved-org"] = &database.Organization{
		ID:     "unapproved-org",
		Name:   "Unapproved Corp",
		Status: "pending",
	}

	body := IssueCredentialRequest{
		Type:     "income",
		Claim:    "Fraud Claim",
		Value:    5000000,
		IssuerID: "unapproved-org",
	}

	jsonBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/providers/credentials", bytes.NewBuffer(jsonBytes))
	w := httptest.NewRecorder()

	HandleIssue(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusForbidden {
		t.Fatalf("expected status 403 Forbidden for unapproved issuer, got %d", res.StatusCode)
	}
}

func TestVerifyAttestationHandler(t *testing.T) {
	_ = database.GetStore()

	// 1. First issue a credential
	issueBody := IssueCredentialRequest{
		Type:      "income",
		Claim:     "Monthly Income Credential",
		Value:     1500000,
		Currency:  "NGN",
		IssuerID:  "org-first-horizon",
		ExpiresAt: "2027-01-01",
	}
	issueBytes, _ := json.Marshal(issueBody)
	issueReq := httptest.NewRequest(http.MethodPost, "/api/v1/providers/credentials", bytes.NewBuffer(issueBytes))
	issueW := httptest.NewRecorder()
	HandleIssue(issueW, issueReq)

	var resObj struct {
		Success bool                `json:"success"`
		Data    database.Credential `json:"data"`
	}
	json.NewDecoder(issueW.Body).Decode(&resObj)
	cred := resObj.Data

	// 2. Now verify its attestation
	verifyBody := VerifyAttestationRequest{
		CredentialID: cred.ID,
		IssuerID:     cred.IssuerID,
		Claim:        cred.Claim,
		KeyID:        cred.KeyID,
		Signature:    cred.Signature,
	}
	verifyBytes, _ := json.Marshal(verifyBody)
	verifyReq := httptest.NewRequest(http.MethodPost, "/api/v1/credentials/verify-attestation", bytes.NewBuffer(verifyBytes))
	verifyW := httptest.NewRecorder()
	HandleVerifyAttestation(verifyW, verifyReq)

	res := verifyW.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 OK for attestation verification, got %d", res.StatusCode)
	}

	var verifyResWrapper struct {
		Success bool                      `json:"success"`
		Data    VerifyAttestationResponse `json:"data"`
	}
	json.NewDecoder(verifyW.Body).Decode(&verifyResWrapper)
	if !verifyResWrapper.Data.Valid {
		t.Fatalf("expected signature to be valid")
	}
}

func TestRevokeCredentialHandler(t *testing.T) {
	store := database.GetStore()
	store.Credentials["cred-test-revoke"] = &database.Credential{
		ID:       "cred-test-revoke",
		Type:     "income",
		Claim:    "Test Credential",
		IssuerID: "org-first-horizon",
		Status:   "active",
	}

	revokeBody := RevokeCredentialRequest{
		Reason: "Customer requested account closure",
	}
	revokeBytes, _ := json.Marshal(revokeBody)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/credentials/revoke/cred-test-revoke", bytes.NewBuffer(revokeBytes))
	w := httptest.NewRecorder()

	HandleRevoke(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 for credential revocation, got %d", res.StatusCode)
	}

	if store.Credentials["cred-test-revoke"].Status != "revoked" {
		t.Fatalf("expected status to be revoked, got %s", store.Credentials["cred-test-revoke"].Status)
	}
}

