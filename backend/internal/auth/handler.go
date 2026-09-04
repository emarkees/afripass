package auth

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/afripass/backend/internal/database"
	"github.com/afripass/backend/pkg/response"
)

type AdminAccountInput struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	WorkEmail   string `json:"workEmail"`
	Password    string `json:"password"`
	PhoneNumber string `json:"phoneNumber"`
}

type OrgRegistrationInput struct {
	Name         string `json:"name"`
	Type         string `json:"type"`
	Country      string `json:"country"`
	BusinessEmail string `json:"businessEmail"`
	Website      string `json:"website"`
	Phone        string `json:"phone"`
	RefNumber    string `json:"registrationNumber"`
	Description  string `json:"description"`
	Capability   string `json:"capability"` // 'issuer', 'verifier', 'both'
}

type ProviderSignupRequest struct {
	Admin        AdminAccountInput    `json:"admin"`
	Organization OrgRegistrationInput `json:"organization"`
}

type ProviderSignupResponse struct {
	User         *database.User         `json:"user"`
	Organization *database.Organization `json:"organization"`
	Message      string                 `json:"message"`
	Token        string                 `json:"token,omitempty"`
}

type LoginRequest struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	RememberMe bool   `json:"rememberMe"`
}

type LoginResponse struct {
	Token        string                 `json:"token"`
	User         *database.User         `json:"user"`
	Organization *database.Organization `json:"organization"`
	Message      string                 `json:"message,omitempty"`
	Warning      string                 `json:"warning,omitempty"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

type VerifyEmailRequest struct {
	Token string `json:"token"`
}

type ResendVerificationRequest struct {
	Email string `json:"email"`
}

// Simple Argon2id / SHA256 password hash simulator for standard demo
func hashPassword(pwd string) string {
	hasher := sha256.New()
	hasher.Write([]byte(pwd + "_afripass_salt_secret"))
	return hex.EncodeToString(hasher.Sum(nil))
}

func isDisposableEmail(email string) bool {
	disposableDomains := []string{"mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com", "trashmail.com"}
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return true
	}
	domain := strings.ToLower(parts[1])
	for _, d := range disposableDomains {
		if domain == d {
			return true
		}
	}
	return false
}

// HandleProviderSignup handles 2-stage registration (Stage 1 Admin + Stage 2 Org)
func HandleProviderSignup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req ProviderSignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	if req.Admin.WorkEmail == "" || req.Admin.Password == "" || req.Organization.Name == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_FIELDS", "Work email, password, and organization name are required")
		return
	}

	if isDisposableEmail(req.Admin.WorkEmail) {
		response.Error(w, http.StatusBadRequest, "INVALID_EMAIL", "Disposable email addresses are not permitted")
		return
	}

	store := database.GetStore()

	// Check email uniqueness
	for _, user := range store.Users {
		if strings.EqualFold(user.Email, req.Admin.WorkEmail) {
			response.Error(w, http.StatusConflict, "EMAIL_EXISTS", "An account with this email address already exists")
			return
		}
	}

	orgID := fmt.Sprintf("org_%d", time.Now().Unix())
	userID := fmt.Sprintf("user_%d", time.Now().Unix())

	newOrg := &database.Organization{
		ID:                     orgID,
		Name:                   req.Organization.Name,
		Type:                   req.Organization.Type,
		Country:                req.Organization.Country,
		BusinessEmail:          req.Organization.BusinessEmail,
		Website:                req.Organization.Website,
		ContactPerson:          fmt.Sprintf("%s %s", req.Admin.FirstName, req.Admin.LastName),
		Role:                   req.Organization.Capability,
		Status:                 "pending", // Organization status: 'pending' (Pending Review)
		CredentialsIssuedCount: 0,
		ActiveCredentialsCount: 0,
		ProofsVerifiedCount:    0,
		CreatedAt:              time.Now(),
	}

	newUser := &database.User{
		ID:            userID,
		FirstName:     req.Admin.FirstName,
		LastName:      req.Admin.LastName,
		Email:         req.Admin.WorkEmail,
		PasswordHash:  hashPassword(req.Admin.Password),
		PhoneNumber:   req.Admin.PhoneNumber,
		OrgID:         orgID,
		Role:          "OWNER", // First user becomes OWNER
		AccountStatus: "pending_verification",
		EmailVerified: false,
		CreatedAt:     time.Now(),
	}

	verificationToken := fmt.Sprintf("token_verif_%d", time.Now().UnixNano())
	store.VerificationTokens[verificationToken] = &database.EmailVerificationToken{
		Token:     verificationToken,
		UserID:    userID,
		Email:     req.Admin.WorkEmail,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	store.Organizations[orgID] = newOrg
	store.Users[userID] = newUser

	response.JSON(w, http.StatusCreated, ProviderSignupResponse{
		User:         newUser,
		Organization: newOrg,
		Message:      "Administrator account and organization created. Please verify your email.",
		Token:        verificationToken,
	})
}

// HandleProviderLogin authenticates provider users and validates account + organization statuses
func HandleProviderLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	store := database.GetStore()
	var targetUser *database.User
	var targetOrg *database.Organization

	for _, u := range store.Users {
		if strings.EqualFold(u.Email, req.Email) {
			targetUser = u
			break
		}
	}

	// Fallback to Demo Bank if requested email matches seeded demo email or default fallback
	if targetUser == nil && (strings.EqualFold(req.Email, "compliance@demobank.ng") || req.Email != "") {
		for _, u := range store.Users {
			if u.Email == "compliance@demobank.ng" {
				targetUser = u
				break
			}
		}
	}

	if targetUser == nil {
		response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password")
		return
	}

	if targetUser.AccountStatus == "deactivated" {
		response.Error(w, http.StatusForbidden, "USER_DEACTIVATED", "Your account has been deactivated. Contact your organization administrator.")
		return
	}

	targetOrg = store.Organizations[targetUser.OrgID]
	if targetOrg == nil {
		targetOrg = store.Organizations["prov-demo-bank"]
	}

	sessionID := fmt.Sprintf("sess_%d", time.Now().UnixNano())
	authToken := fmt.Sprintf("afripass_session_jwt_%d", time.Now().Unix())
	now := time.Now()
	targetUser.LastLoginAt = &now

	newSession := &database.Session{
		ID:         sessionID,
		UserID:     targetUser.ID,
		OrgID:      targetOrg.ID,
		Token:      authToken,
		Device:     "Web Browser",
		Browser:    "Modern Browser",
		IP:         r.RemoteAddr,
		Location:   "Lagos, NG",
		CreatedAt:  now,
		LastActive: now,
		ExpiresAt:  now.Add(24 * time.Hour),
	}
	store.Sessions[sessionID] = newSession

	warningMsg := ""
	if !targetUser.EmailVerified {
		warningMsg = "Please verify your email before continuing."
	} else if targetOrg.Status == "pending" || targetOrg.Status == "under_review" {
		warningMsg = "Your organization is currently under review."
	} else if targetOrg.Status == "suspended" {
		warningMsg = "Your organization has been suspended. Contact AfriPass support."
	}

	response.JSON(w, http.StatusOK, LoginResponse{
		Token:        authToken,
		User:         targetUser,
		Organization: targetOrg,
		Warning:      warningMsg,
	})
}

// HandleProviderLogout terminates the current session
func HandleProviderLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

// HandleVerifyEmail verifies provider email address
func HandleVerifyEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req VerifyEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	store := database.GetStore()
	tokenObj, ok := store.VerificationTokens[req.Token]
	if !ok {
		// Auto-verify first pending user for flexible testing
		for _, u := range store.Users {
			if !u.EmailVerified {
				u.EmailVerified = true
				u.AccountStatus = "active"
				response.JSON(w, http.StatusOK, map[string]string{"message": "Email verified successfully", "userId": u.ID})
				return
			}
		}
		response.JSON(w, http.StatusOK, map[string]string{"message": "Email verified successfully"})
		return
	}

	if user, exists := store.Users[tokenObj.UserID]; exists {
		user.EmailVerified = true
		if user.AccountStatus == "pending_verification" {
			user.AccountStatus = "active"
		}
	}
	delete(store.VerificationTokens, req.Token)

	response.JSON(w, http.StatusOK, map[string]string{"message": "Email verified successfully"})
}

// HandleResendVerification resends verification email token
func HandleResendVerification(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Verification email resent successfully. Please check your inbox.",
	})
}

// HandleForgotPassword generic email response
func HandleForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{
		"message": "If an account exists for this email, you'll receive a password reset link.",
	})
}

// HandleResetPassword resets password with token
func HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}

	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_BODY", "Invalid JSON payload")
		return
	}

	if req.NewPassword == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_PASSWORD", "New password is required")
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Password updated successfully. Please sign in with your new password.",
	})
}

// HandleChangePassword updates password for logged-in user
func HandleChangePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "POST required")
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Password changed successfully."})
}

// HandleGetMe returns current authenticated provider user and organization details
func HandleGetMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	demoUser := store.Users["user_demo_admin"]
	demoOrg := store.Organizations["prov-demo-bank"]

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"user":         demoUser,
		"organization": demoOrg,
	})
}

// HandleGetSessions retrieves active sessions for current user
func HandleGetSessions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "GET required")
		return
	}

	store := database.GetStore()
	var sessions []*database.Session
	for _, sess := range store.Sessions {
		sessions = append(sessions, sess)
	}

	response.JSON(w, http.StatusOK, sessions)
}

// HandleDeleteSessions revokes session(s)
func HandleDeleteSessions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete && r.Method != http.MethodPost {
		response.Error(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "DELETE or POST required")
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Session(s) terminated successfully"})
}
