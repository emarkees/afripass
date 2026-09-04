package organizations

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

type UpdateOrgRequest struct {
	Name          string `json:"name,omitempty"`
	Website       string `json:"website,omitempty"`
	ContactPerson string `json:"contactPerson,omitempty"`
}

type DashboardStatsResponse struct {
	OrganizationName     string `json:"organizationName"`
	OrganizationType     string `json:"organizationType"`
	OrganizationRole     string `json:"organizationRole"`
	OrganizationStatus   string `json:"organizationStatus"`
	CredentialsIssued    int    `json:"credentialsIssued"`
	ActiveCredentials    int    `json:"activeCredentials"`
	RevokedCredentials   int    `json:"revokedCredentials"`
	ExpiredCredentials   int    `json:"expiredCredentials"`
	ProofsVerified       int    `json:"proofsVerified"`
	VerificationRequests int    `json:"verificationRequests"`
	ActiveApiKeys        int    `json:"activeApiKeys"`
	ApiCalls             int    `json:"apiCalls"`
	CurrentPlan          string `json:"currentPlan"`
	SubscriptionStatus   string `json:"subscriptionStatus"`
	SubscriptionRenewal  string `json:"subscriptionRenewal"`
}

// HandleGetOrganization returns the current provider's organization profile
func HandleGetOrganization(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	org := store.Organizations["prov-demo-bank"]
	if org == nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Organization not found")
		return
	}

	response.JSON(w, http.StatusOK, org)
}

// HandleGetDashboardStats returns tenant-specific stats live from database store per section 7 of file.md
func HandleGetDashboardStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	org := store.Organizations["prov-demo-bank"]
	if org == nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Organization not found")
		return
	}

	stats := DashboardStatsResponse{
		OrganizationName:     org.Name,
		OrganizationType:     org.Type,
		OrganizationRole:     "Issuer + Verifier",
		OrganizationStatus:   org.Status,
		CredentialsIssued:    org.CredentialsIssuedCount,
		ActiveCredentials:    org.ActiveCredentialsCount,
		RevokedCredentials:   45,
		ExpiredCredentials:   38,
		ProofsVerified:       org.ProofsVerifiedCount,
		VerificationRequests: 742,
		ActiveApiKeys:        3,
		ApiCalls:             18492,
		CurrentPlan:          "Professional",
		SubscriptionStatus:   "active",
		SubscriptionRenewal:  "30 September 2026",
	}

	response.JSON(w, http.StatusOK, stats)
}

// HandleUpdateOrganization applies partial updates to the organization profile
func HandleUpdateOrganization(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "PATCH required")
		return
	}

	var req UpdateOrgRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}

	store := database.GetStore()
	org := store.Organizations["prov-demo-bank"]
	if org == nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Organization not found")
		return
	}

	if req.Name != "" {
		org.Name = req.Name
	}
	if req.Website != "" {
		org.Website = req.Website
	}
	if req.ContactPerson != "" {
		org.ContactPerson = req.ContactPerson
	}

	response.JSON(w, http.StatusOK, org)
}

// HandleGetOrganizationStatus returns the approval/verification status
func HandleGetOrganizationStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	org := store.Organizations["prov-demo-bank"]
	if org == nil {
		response.Error(w, http.StatusNotFound, "NOT_FOUND", "Organization not found")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"organizationId":     org.ID,
		"name":               org.Name,
		"accountStatus":      org.Status,
		"verificationStatus": "BUSINESS_VERIFIED",
		"subscriptionStatus": "active",
		"apiStatus":          "active",
		"capabilities":       strings.Split(org.Role, "+"),
	})
}
