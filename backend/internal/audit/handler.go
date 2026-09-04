package audit

import (
	"net/http"
	"time"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

func HandleListAuditEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()

	// Seed some audit events if empty
	if len(store.AuditEvents) == 0 {
		store.AuditEvents = []*database.AuditEvent{
			{
				ID:        "audit-001",
				Timestamp: time.Now().Add(-2 * time.Hour),
				Category:  "credential",
				Action:    "credential.issued",
				Details:   "Income credential AFP-CRED-001 issued to subject commitment",
				Actor:     "Amina Bello (OWNER)",
				Severity:  "info",
			},
			{
				ID:        "audit-002",
				Timestamp: time.Now().Add(-90 * time.Minute),
				Category:  "verification",
				Action:    "proof.verified",
				Details:   "ZK proof verified: Income ≥ ₦1,000,000 — claim satisfied",
				Actor:     "System (Midnight Preprod)",
				Severity:  "info",
			},
			{
				ID:        "audit-003",
				Timestamp: time.Now().Add(-60 * time.Minute),
				Category:  "api",
				Action:    "api_key.created",
				Details:   "New API key created: Production Credential API",
				Actor:     "Kofi Mensah (DEVELOPER)",
				Severity:  "warning",
			},
			{
				ID:        "audit-004",
				Timestamp: time.Now().Add(-30 * time.Minute),
				Category:  "auth",
				Action:    "member.login",
				Details:   "Staff login from 41.58.xx.xx (Lagos, NG)",
				Actor:     "Tunde Afolayan (ISSUER)",
				Severity:  "info",
			},
			{
				ID:        "audit-005",
				Timestamp: time.Now().Add(-10 * time.Minute),
				Category:  "credential",
				Action:    "credential.revoked",
				Details:   "Credential AFP-CRED-047 revoked — account closure",
				Actor:     "Amina Bello (OWNER)",
				Severity:  "warning",
			},
			{
				ID:        "audit-006",
				Timestamp: time.Now().Add(-5 * time.Minute),
				Category:  "security",
				Action:    "rate_limit.exceeded",
				Details:   "API rate limit exceeded on /api/v1/proofs/verify (key: afp_live_3b...)",
				Actor:     "System",
				Severity:  "critical",
			},
		}
	}

	response.JSON(w, http.StatusOK, store.AuditEvents)
}
