package team

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

type TeamMember struct {
	ID        string    `json:"id"`
	OrgID     string    `json:"organizationId"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"` // 'OWNER', 'ADMIN', 'ISSUER', 'VERIFIER', 'DEVELOPER', 'AUDITOR'
	Status    string    `json:"status"` // 'active', 'invited', 'suspended'
	CreatedAt time.Time `json:"createdAt"`
}

type InviteMemberRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

func HandleListMembers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	members := []*TeamMember{
		{
			ID:        "mem-001",
			OrgID:     "prov-demo-bank",
			Name:      "Amina Bello",
			Email:     "compliance@demobank.ng",
			Role:      "OWNER",
			Status:    "active",
			CreatedAt: time.Now().Add(-180 * 24 * time.Hour),
		},
		{
			ID:        "mem-002",
			OrgID:     "prov-demo-bank",
			Name:      "Tunde Afolayan",
			Email:     "issuance@demobank.ng",
			Role:      "ISSUER",
			Status:    "active",
			CreatedAt: time.Now().Add(-90 * 24 * time.Hour),
		},
		{
			ID:        "mem-003",
			OrgID:     "prov-demo-bank",
			Name:      "Kofi Mensah",
			Email:     "devs@demobank.ng",
			Role:      "DEVELOPER",
			Status:    "active",
			CreatedAt: time.Now().Add(-30 * 24 * time.Hour),
		},
	}

	response.JSON(w, http.StatusOK, members)
}

func HandleInviteMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req InviteMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request JSON")
		return
	}

	if req.Email == "" || req.Role == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_FIELDS", "Email and Role are required")
		return
	}

	newMember := &TeamMember{
		ID:        fmt.Sprintf("mem-%d", time.Now().UnixNano()%10000),
		OrgID:     "prov-demo-bank",
		Name:      req.Name,
		Email:     req.Email,
		Role:      req.Role,
		Status:    "invited",
		CreatedAt: time.Now(),
	}

	_ = database.GetStore()
	response.JSON(w, http.StatusCreated, newMember)
}
