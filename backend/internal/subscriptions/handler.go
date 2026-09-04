package subscriptions

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/afripass/backend/pkg/response"
)

type SubscriptionPlan struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Tier        string   `json:"tier"` // 'sandbox', 'starter', 'professional', 'enterprise'
	PriceMonthly float64 `json:"priceMonthly"`
	PriceAnnual  float64 `json:"priceAnnual"`
	Currency    string   `json:"currency"`
	Features    []string `json:"features"`
	APILimit    int      `json:"apiLimit"`
	TeamLimit   int      `json:"teamLimit"`
	WebhookLimit int     `json:"webhookLimit"`
	IsPopular   bool     `json:"isPopular"`
}

type Subscription struct {
	ID           string    `json:"id"`
	OrgID        string    `json:"organizationId"`
	PlanID       string    `json:"planId"`
	PlanName     string    `json:"planName"`
	Tier         string    `json:"tier"`
	Status       string    `json:"status"` // 'trialing', 'active', 'past_due', 'canceled', 'expired', 'suspended'
	APIUsage     int       `json:"apiUsage"`
	APILimit     int       `json:"apiLimit"`
	UsagePercent float64   `json:"usagePercent"`
	CurrentPeriodStart time.Time `json:"currentPeriodStart"`
	CurrentPeriodEnd   time.Time `json:"currentPeriodEnd"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Invoice struct {
	ID       string    `json:"id"`
	OrgID    string    `json:"organizationId"`
	PlanName string    `json:"planName"`
	Amount   float64   `json:"amount"`
	Currency string    `json:"currency"`
	Status   string    `json:"status"` // 'draft', 'open', 'paid', 'failed', 'void', 'refunded'
	IssuedAt time.Time `json:"issuedAt"`
	DueAt    time.Time `json:"dueAt"`
	PaidAt   *time.Time `json:"paidAt"`
}

func HandleListPlans(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	plans := []SubscriptionPlan{
		{
			ID:           "plan-sandbox",
			Name:         "Sandbox",
			Tier:         "sandbox",
			PriceMonthly: 0,
			PriceAnnual:  0,
			Currency:     "USD",
			Features: []string{
				"Test/sandbox API access",
				"Synthetic credential issuance",
				"Test proof verification",
				"1 team member",
				"100 API requests/day",
			},
			APILimit:     100,
			TeamLimit:    1,
			WebhookLimit: 1,
			IsPopular:    false,
		},
		{
			ID:           "plan-starter",
			Name:         "Starter",
			Tier:         "starter",
			PriceMonthly: 49,
			PriceAnnual:  470,
			Currency:     "USD",
			Features: []string{
				"Production API access",
				"Credential issuance",
				"Proof verification",
				"5 team members",
				"10,000 API requests/month",
				"Basic audit logs",
			},
			APILimit:     10000,
			TeamLimit:    5,
			WebhookLimit: 3,
			IsPopular:    false,
		},
		{
			ID:           "plan-professional",
			Name:         "Professional",
			Tier:         "professional",
			PriceMonthly: 199,
			PriceAnnual:  1910,
			Currency:     "USD",
			Features: []string{
				"Higher API limits",
				"Advanced verification",
				"20 team members",
				"100,000 API requests/month",
				"Webhooks",
				"Advanced audit logs",
				"API analytics",
				"Priority support",
			},
			APILimit:     100000,
			TeamLimit:    20,
			WebhookLimit: 10,
			IsPopular:    true,
		},
		{
			ID:           "plan-enterprise",
			Name:         "Enterprise",
			Tier:         "enterprise",
			PriceMonthly: 0,
			PriceAnnual:  0,
			Currency:     "USD",
			Features: []string{
				"Custom API limits",
				"Large-scale verification",
				"Unlimited team members",
				"Dedicated infrastructure options",
				"Custom integrations",
				"Advanced compliance",
				"SLA",
				"Dedicated support",
			},
			APILimit:     0, // Custom
			TeamLimit:    0, // Unlimited
			WebhookLimit: 0, // Unlimited
			IsPopular:    false,
		},
	}

	response.JSON(w, http.StatusOK, plans)
}

func HandleGetSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	sub := Subscription{
		ID:           "sub-001",
		OrgID:        "prov-demo-bank",
		PlanID:       "plan-professional",
		PlanName:     "Professional",
		Tier:         "professional",
		Status:       "active",
		APIUsage:     18492,
		APILimit:     100000,
		UsagePercent: 18.5,
		CurrentPeriodStart: time.Now().Add(-15 * 24 * time.Hour),
		CurrentPeriodEnd:   time.Now().Add(15 * 24 * time.Hour),
		CreatedAt:          time.Now().Add(-180 * 24 * time.Hour),
	}

	response.JSON(w, http.StatusOK, sub)
}

type CheckoutRequest struct {
	PlanID        string `json:"planId"`
	BillingCycle  string `json:"billingCycle"` // 'monthly', 'annual'
}

func HandleCheckout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}

	// In production this would redirect to or create a payment session via Paystack/Flutterwave/Stripe
	response.JSON(w, http.StatusOK, map[string]string{
		"checkoutUrl": fmt.Sprintf("https://checkout.afripass.network/session/%d", time.Now().UnixNano()%100000),
		"sessionId":   fmt.Sprintf("cs_%d", time.Now().UnixNano()%100000),
		"planId":      req.PlanID,
		"status":      "pending_payment",
	})
}

func HandleListInvoices(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	paidAt := time.Now().Add(-20 * 24 * time.Hour)
	invoices := []Invoice{
		{
			ID:       "INV-2026-001",
			OrgID:    "prov-demo-bank",
			PlanName: "Professional",
			Amount:   199.00,
			Currency: "USD",
			Status:   "paid",
			IssuedAt: time.Now().Add(-45 * 24 * time.Hour),
			DueAt:    time.Now().Add(-15 * 24 * time.Hour),
			PaidAt:   &paidAt,
		},
		{
			ID:       "INV-2026-002",
			OrgID:    "prov-demo-bank",
			PlanName: "Professional",
			Amount:   199.00,
			Currency: "USD",
			Status:   "open",
			IssuedAt: time.Now().Add(-5 * 24 * time.Hour),
			DueAt:    time.Now().Add(25 * 24 * time.Hour),
			PaidAt:   nil,
		},
	}

	response.JSON(w, http.StatusOK, invoices)
}
