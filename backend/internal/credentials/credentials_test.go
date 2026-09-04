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
		IssuerID:  "prov-demo-bank",
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
