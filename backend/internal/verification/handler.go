package verification

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/afripass/backend/pkg/response"
)

type VerifyProofRequest struct {
	ProofID string `json:"proofId"`
}

type VerifyProofResponse struct {
	Valid                   bool   `json:"valid"`
	ClaimSatisfied          bool   `json:"claimSatisfied"`
	IssuerVerified          bool   `json:"issuerVerified"`
	CredentialActive        bool   `json:"credentialActive"`
	MidnightNetwork         string `json:"midnightNetwork"`
	ProofID                 string `json:"proofId"`
	Claim                   string `json:"claim"`
	IssuerName              string `json:"issuerName"`
	UnderlyingDataDisclosed bool   `json:"underlyingDataDisclosed"`
	Timestamp               string `json:"timestamp"`
}

func HandleVerifyProof(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req VerifyProofRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	if req.ProofID == "" {
		req.ProofID = fmt.Sprintf("PROOF-AFP-%d", time.Now().UnixNano()%100000)
	}

	response.JSON(w, http.StatusOK, VerifyProofResponse{
		Valid:                   true,
		ClaimSatisfied:          true,
		IssuerVerified:          true,
		CredentialActive:        true,
		MidnightNetwork:         "Midnight Preprod Network",
		ProofID:                 req.ProofID,
		Claim:                   "Monthly Income ≥ ₦1,000,000",
		IssuerName:              "Demo Bank Nigeria",
		UnderlyingDataDisclosed: false,
		Timestamp:               time.Now().Format("2006-01-02 15:04:05"),
	})
}
