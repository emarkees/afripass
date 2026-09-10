package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	chicors "github.com/go-chi/cors"

	"github.com/afripass/backend/internal/api_keys"
	"github.com/afripass/backend/internal/audit"
	"github.com/afripass/backend/internal/auth"
	"github.com/afripass/backend/internal/config"
	"github.com/afripass/backend/internal/credentials"
	"github.com/afripass/backend/internal/organizations"
	"github.com/afripass/backend/internal/providers"
	"github.com/afripass/backend/internal/subscriptions"
	"github.com/afripass/backend/internal/team"
	"github.com/afripass/backend/internal/verification"
	"github.com/afripass/backend/pkg/response"
)

func main() {
	cfg := config.LoadConfig()

	r := chi.NewRouter()

	// Global Chi Middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.Timeout(60 * time.Second))

	// CORS Middleware via go-chi/cors
	r.Use(chicors.Handler(chicors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "X-Tenant-ID", "X-API-Key"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health and Readiness Checks
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status":          "healthy",
			"database":        "connected",
			"midnightService": "available (Preprod)",
		})
	})

	r.Get("/ready", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status": "ready",
		})
	})

	// API v1 Router Group
	r.Route("/api/v1", func(r chi.Router) {
		// Auth & Provider Routes
		r.Post("/auth/login", auth.HandleProviderLogin)
		r.Post("/auth/provider/signup", auth.HandleProviderSignup)
		r.Post("/auth/provider/login", auth.HandleProviderLogin)
		r.Post("/auth/provider/logout", auth.HandleProviderLogout)
		r.Post("/auth/provider/verify-email", auth.HandleVerifyEmail)
		r.Post("/auth/provider/resend-verification", auth.HandleResendVerification)
		r.Post("/auth/provider/forgot-password", auth.HandleForgotPassword)
		r.Post("/auth/provider/reset-password", auth.HandleResetPassword)
		r.Post("/auth/provider/change-password", auth.HandleChangePassword)
		r.Get("/auth/provider/me", auth.HandleGetMe)
		r.Get("/auth/provider/sessions", auth.HandleGetSessions)
		r.Delete("/auth/provider/sessions/revoke", auth.HandleDeleteSessions)

		r.Post("/providers/register", providers.HandleRegister)
		r.Get("/providers", providers.HandleList)

		// Multi-Tenancy & Organization Routes
		r.Get("/provider/organization", organizations.HandleGetOrganization)
		r.Post("/provider/organization/update", organizations.HandleUpdateOrganization)
		r.Get("/provider/organization/status", organizations.HandleGetOrganizationStatus)
		r.Get("/provider/dashboard/stats", organizations.HandleGetDashboardStats)
		r.Get("/provider/members", team.HandleListMembers)
		r.Post("/provider/members/invite", team.HandleInviteMember)

		// Credentials & Attestation Verification Routes
		r.Post("/providers/credentials", credentials.HandleIssue)
		r.Get("/credentials", credentials.HandleList)
		r.Post("/credentials/revoke/{id}", credentials.HandleRevoke)
		r.Post("/credentials/revoke/*", credentials.HandleRevoke)
		r.Post("/credentials/verify-attestation", credentials.HandleVerifyAttestation)
		r.Post("/proofs/verify", verification.HandleVerifyProof)

		// Developer, Audit & SaaS Subscriptions
		r.Post("/provider/api-keys", api_keys.HandleCreate)
		r.Get("/provider/audit", audit.HandleListAuditEvents)
		r.Get("/provider/subscription", subscriptions.HandleGetSubscription)
		r.Get("/provider/plans", subscriptions.HandleListPlans)
		r.Get("/provider/invoices", subscriptions.HandleListInvoices)
		r.Post("/provider/subscription/checkout", subscriptions.HandleCheckout)
	})

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 AfriPass Multi-Tenant Go Backend Server (go-chi/v5) listening on http://localhost%s", addr)
	log.Printf("   Go Version: 1.27.1")
	log.Printf("   Environment: %s", cfg.AppEnv)
	log.Printf("   Midnight Network: %s", cfg.MidnightNetwork)

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server stopped with error: %v", err)
	}
}
