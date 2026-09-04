package config

import (
	"os"
)

type Config struct {
	Port                 string
	AppEnv               string
	DatabaseURL          string
	JWTSecret            string
	AttestationHMACKey  string
	MidnightNetwork      string
	CORSAllowedOrigins   string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" {
		appEnv = "development"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://afripass:afripass@localhost:5432/afripass_db?sslmode=disable"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "afripass_production_jwt_secret_key_change_me_32bytes"
	}

	attestationKey := os.Getenv("ATTESTATION_KEY")
	if attestationKey == "" {
		attestationKey = "afripass_institutional_master_signing_key_001"
	}

	midnightNet := os.Getenv("MIDNIGHT_NETWORK")
	if midnightNet == "" {
		midnightNet = "Midnight Preprod Network"
	}

	corsOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "*"
	}

	return &Config{
		Port:                port,
		AppEnv:              appEnv,
		DatabaseURL:         dbURL,
		JWTSecret:           jwtSecret,
		AttestationHMACKey: attestationKey,
		MidnightNetwork:     midnightNet,
		CORSAllowedOrigins:  corsOrigins,
	}
}
