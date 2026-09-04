package api_keys

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

type CreateApiKeyRequest struct {
	Name        string `json:"name"`
	Permissions string `json:"permissions"`
}

type CreateApiKeyResponse struct {
	ApiKey    *database.ApiKey `json:"apiKey"`
	RawSecret string           `json:"rawSecret"`
}

func HandleCreate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req CreateApiKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}

	rawSecret := fmt.Sprintf("afp_live_%x", time.Now().UnixNano())
	prefix := rawSecret[:12]
	masked := fmt.Sprintf("%s••••••••••••••••••••%s", prefix, rawSecret[len(rawSecret)-4:])

	newKey := &database.ApiKey{
		ID:           fmt.Sprintf("key-%d", time.Now().UnixNano()%1000),
		ProviderID:   "prov-demo-bank",
		Name:         req.Name,
		KeyPrefix:    prefix,
		HashedSecret: "hashed_" + rawSecret,
		MaskedKey:    masked,
		Permissions:  req.Permissions,
		Status:       "active",
		CreatedAt:    time.Now(),
	}

	store := database.GetStore()
	store.ApiKeys[newKey.ID] = newKey

	response.JSON(w, http.StatusCreated, CreateApiKeyResponse{
		ApiKey:    newKey,
		RawSecret: rawSecret,
	})
}
