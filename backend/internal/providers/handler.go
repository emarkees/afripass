package providers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

type RegisterProviderRequest struct {
	Name          string `json:"name"`
	Type          string `json:"type"`
	Country       string `json:"country"`
	BusinessEmail string `json:"businessEmail"`
	Website       string `json:"website"`
	ContactPerson string `json:"contactPerson"`
	Role          string `json:"role"`
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req RegisterProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}

	if req.Name == "" || req.BusinessEmail == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_FIELDS", "Name and businessEmail are required")
		return
	}

	store := database.GetStore()
	orgID := fmt.Sprintf("prov-%d", time.Now().UnixNano()%10000)

	newOrg := &database.Organization{
		ID:            orgID,
		Name:          req.Name,
		Type:          req.Type,
		Country:       req.Country,
		BusinessEmail: req.BusinessEmail,
		Website:       req.Website,
		ContactPerson: req.ContactPerson,
		Role:          req.Role,
		Status:        "pending", // Mandatory Onboarding Status
		CreatedAt:     time.Now(),
	}

	store.Organizations[orgID] = newOrg
	response.JSON(w, http.StatusCreated, newOrg)
}

func HandleList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	var list []*database.Organization
	for _, org := range store.Organizations {
		list = append(list, org)
	}

	response.JSON(w, http.StatusOK, list)
}
