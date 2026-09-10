package credentials

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/crypto"
	"github.com/afripass/backend/pkg/response"
)

type IssueCredentialRequest struct {
	Type      string  `json:"type"`
	Claim     string  `json:"claim"`
	Value     float64 `json:"value"`
	Currency  string  `json:"currency"`
	Period    string  `json:"period"`
	IssuerID  string  `json:"issuerId"`
	ExpiresAt string  `json:"expiresAt"`
}

type RevokeCredentialRequest struct {
	Reason string `json:"reason"`
}

func HandleIssue(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req IssueCredentialRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	store := database.GetStore()
	if req.IssuerID == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_ISSUER", "IssuerID is required")
		return
	}
	issuer, exists := store.Organizations[req.IssuerID]
	if !exists {
		response.Error(w, http.StatusNotFound, "ISSUER_NOT_FOUND", "Issuer organization not found")
		return
	}

	if issuer.Status != "approved" {
		response.Error(w, http.StatusForbidden, "UNAPPROVED_ISSUER", "Only approved organizations can issue financial credentials")
		return
	}

	credID := fmt.Sprintf("AFP-CRED-%d", time.Now().UnixNano()%1000)
	symbol := "₦"
	if req.Currency == "USD" {
		symbol = "$"
	} else if req.Currency == "KES" {
		symbol = "KSh"
	}
	formattedVal := fmt.Sprintf("%s%.0f", symbol, req.Value)

	expTime, _ := time.Parse("2006-01-02", req.ExpiresAt)
	if expTime.IsZero() {
		expTime = time.Now().Add(365 * 24 * time.Hour)
	}

	keyID := "key_001"
	sig := crypto.SignAttestation(credID, issuer.ID, req.Claim, keyID, []byte("afripass_master_signing_key"))

	newCred := &database.Credential{
		ID:               credID,
		Type:             req.Type,
		Claim:            req.Claim,
		Value:            req.Value,
		FormattedValue:   formattedVal,
		DisplayThreshold: formattedVal + "+",
		Currency:         req.Currency,
		Period:           req.Period,
		IssuerID:         issuer.ID,
		IssuerName:       issuer.Name,
		IssuerStatus:     "verified",
		IssuedAt:         time.Now(),
		ExpiresAt:        expTime,
		Status:           "active",
		Signature:        sig,
		KeyID:            keyID,
	}

	store.Credentials[credID] = newCred
	issuer.CredentialsIssuedCount++
	issuer.ActiveCredentialsCount++

	response.JSON(w, http.StatusCreated, newCred)
}

func HandleList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	var list []*database.Credential
	for _, cred := range store.Credentials {
		list = append(list, cred)
	}

	response.JSON(w, http.StatusOK, list)
}

type VerifyAttestationRequest struct {
	CredentialID string `json:"credentialId"`
	IssuerID     string `json:"issuerId"`
	Claim        string `json:"claim"`
	KeyID        string `json:"keyId"`
	Signature    string `json:"signature"`
}

type VerifyAttestationResponse struct {
	Valid        bool   `json:"valid"`
	CredentialID string `json:"credentialId"`
	IssuerID     string `json:"issuerId"`
	IssuerName   string `json:"issuerName"`
	Status       string `json:"status"`
	Signature    string `json:"signature"`
	VerifiedAt   string `json:"verifiedAt"`
	TrustLevel   string `json:"trustLevel"`
}

func HandleVerifyAttestation(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req VerifyAttestationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	store := database.GetStore()
	cred, exists := store.Credentials[req.CredentialID]

	var valid bool
	var issuerID, issuerName, status, sig string

	if exists {
		issuerID = cred.IssuerID
		issuerName = cred.IssuerName
		status = cred.Status
		sig = cred.Signature
		valid = crypto.VerifyAttestation(cred.ID, cred.IssuerID, cred.Claim, cred.KeyID, cred.Signature, []byte("afripass_master_signing_key"))
	} else if req.CredentialID != "" && req.Signature != "" {
		issuerID = req.IssuerID
		issuerName = "Attested Financial Institution"
		status = "active"
		sig = req.Signature
		valid = crypto.VerifyAttestation(req.CredentialID, req.IssuerID, req.Claim, req.KeyID, req.Signature, []byte("afripass_master_signing_key"))
	} else {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Credential not found for verification")
		return
	}

	trustLevel := "Provider Attestation (Unverified)"
	if valid {
		trustLevel = "Provider Attestation (Cryptographically Verified)"
	}

	res := VerifyAttestationResponse{
		Valid:        valid,
		CredentialID: req.CredentialID,
		IssuerID:     issuerID,
		IssuerName:   issuerName,
		Status:       status,
		Signature:    sig,
		VerifiedAt:   time.Now().Format(time.RFC3339),
		TrustLevel:   trustLevel,
	}

	response.JSON(w, http.StatusOK, res)
}

func HandleRevoke(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	credID := chi.URLParam(r, "id")
	if credID == "" {
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) >= 1 && parts[len(parts)-1] != "" {
			credID = parts[len(parts)-1]
		}
	}

	var req RevokeCredentialRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	if credID == "" {
		response.Error(w, http.StatusBadRequest, "INVALID_PATH", "Credential ID required")
		return
	}

	store := database.GetStore()
	cred, exists := store.Credentials[credID]
	if !exists {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Credential not found")
		return
	}

	cred.Status = "revoked"
	cred.RevocationReason = req.Reason

	if issuer, ok := store.Organizations[cred.IssuerID]; ok {
		if issuer.ActiveCredentialsCount > 0 {
			issuer.ActiveCredentialsCount--
		}
		issuer.RevokedCredentialsCount++
	}

	response.JSON(w, http.StatusOK, cred)
}

