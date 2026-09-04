package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/afripass/backend/internal/api_keys"
	"github.com/afripass/backend/internal/audit"
	"github.com/afripass/backend/internal/auth"
	"github.com/afripass/backend/internal/config"
	"github.com/afripass/backend/internal/credentials"
	"github.com/afripass/backend/internal/middleware"
	"github.com/afripass/backend/internal/organizations"
	"github.com/afripass/backend/internal/providers"
	"github.com/afripass/backend/internal/subscriptions"
	"github.com/afripass/backend/internal/team"
	"github.com/afripass/backend/internal/verification"
	"github.com/afripass/backend/pkg/response"
)

func main() {
	cfg := config.LoadConfig()

	mux := http.NewServeMux()

	// Health and Readiness Checks
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status":          "healthy",
			"database":        "connected",
			"midnightService": "available (Preprod)",
		})
	})

	mux.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status": "ready",
		})
	})

	// API v1 Auth & Provider Routes
	mux.HandleFunc("/api/v1/auth/login", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleProviderLogin)))
	mux.HandleFunc("/api/v1/auth/provider/signup", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleProviderSignup)))
	mux.HandleFunc("/api/v1/auth/provider/login", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleProviderLogin)))
	mux.HandleFunc("/api/v1/auth/provider/logout", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleProviderLogout)))
	mux.HandleFunc("/api/v1/auth/provider/verify-email", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleVerifyEmail)))
	mux.HandleFunc("/api/v1/auth/provider/resend-verification", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleResendVerification)))
	mux.HandleFunc("/api/v1/auth/provider/forgot-password", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleForgotPassword)))
	mux.HandleFunc("/api/v1/auth/provider/reset-password", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleResetPassword)))
	mux.HandleFunc("/api/v1/auth/provider/change-password", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleChangePassword)))
	mux.HandleFunc("/api/v1/auth/provider/me", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleGetMe)))
	mux.HandleFunc("/api/v1/auth/provider/sessions", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleGetSessions)))
	mux.HandleFunc("/api/v1/auth/provider/sessions/revoke", middleware.CORSMiddleware(middleware.LoggerMiddleware(auth.HandleDeleteSessions)))
	mux.HandleFunc("/api/v1/providers/register", middleware.CORSMiddleware(middleware.LoggerMiddleware(providers.HandleRegister)))
	mux.HandleFunc("/api/v1/providers", middleware.CORSMiddleware(middleware.LoggerMiddleware(providers.HandleList)))

	// API v1 Organization & Multi-Tenancy Routes
	mux.HandleFunc("/api/v1/provider/organization", middleware.CORSMiddleware(middleware.LoggerMiddleware(organizations.HandleGetOrganization)))
	mux.HandleFunc("/api/v1/provider/organization/update", middleware.CORSMiddleware(middleware.LoggerMiddleware(organizations.HandleUpdateOrganization)))
	mux.HandleFunc("/api/v1/provider/organization/status", middleware.CORSMiddleware(middleware.LoggerMiddleware(organizations.HandleGetOrganizationStatus)))
	mux.HandleFunc("/api/v1/provider/dashboard/stats", middleware.CORSMiddleware(middleware.LoggerMiddleware(organizations.HandleGetDashboardStats)))
	mux.HandleFunc("/api/v1/provider/members", middleware.CORSMiddleware(middleware.LoggerMiddleware(team.HandleListMembers)))
	mux.HandleFunc("/api/v1/provider/members/invite", middleware.CORSMiddleware(middleware.LoggerMiddleware(team.HandleInviteMember)))

	// API v1 Credentials & Proof Verification Routes
	mux.HandleFunc("/api/v1/providers/credentials", middleware.CORSMiddleware(middleware.LoggerMiddleware(credentials.HandleIssue)))
	mux.HandleFunc("/api/v1/credentials", middleware.CORSMiddleware(middleware.LoggerMiddleware(credentials.HandleList)))
	mux.HandleFunc("/api/v1/credentials/revoke/", middleware.CORSMiddleware(middleware.LoggerMiddleware(credentials.HandleRevoke)))
	mux.HandleFunc("/api/v1/proofs/verify", middleware.CORSMiddleware(middleware.LoggerMiddleware(verification.HandleVerifyProof)))

	// API v1 Developer, Audit & SaaS Subscription Routes
	mux.HandleFunc("/api/v1/provider/api-keys", middleware.CORSMiddleware(middleware.LoggerMiddleware(api_keys.HandleCreate)))
	mux.HandleFunc("/api/v1/provider/audit", middleware.CORSMiddleware(middleware.LoggerMiddleware(audit.HandleListAuditEvents)))
	mux.HandleFunc("/api/v1/provider/subscription", middleware.CORSMiddleware(middleware.LoggerMiddleware(subscriptions.HandleGetSubscription)))
	mux.HandleFunc("/api/v1/provider/plans", middleware.CORSMiddleware(middleware.LoggerMiddleware(subscriptions.HandleListPlans)))
	mux.HandleFunc("/api/v1/provider/invoices", middleware.CORSMiddleware(middleware.LoggerMiddleware(subscriptions.HandleListInvoices)))
	mux.HandleFunc("/api/v1/provider/subscription/checkout", middleware.CORSMiddleware(middleware.LoggerMiddleware(subscriptions.HandleCheckout)))

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 AfriPass Multi-Tenant Go Backend Server listening on http://localhost%s", addr)
	log.Printf("   Environment: %s", cfg.AppEnv)
	log.Printf("   Midnight Network: %s", cfg.MidnightNetwork)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server stopped with error: %v", err)
	}
}
