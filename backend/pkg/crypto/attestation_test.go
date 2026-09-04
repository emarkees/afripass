package crypto

import (
	"testing"
)

func TestSignAndVerifyAttestation(t *testing.T) {
	credID := "AFP-CRED-100"
	issuerID := "prov-demo-bank"
	claim := "Monthly Income Credential"
	keyID := "key_001"
	secretKey := []byte("test_secret_key_12345")

	sig := SignAttestation(credID, issuerID, claim, keyID, secretKey)
	if sig == "" {
		t.Fatalf("expected non-empty signature")
	}

	valid := VerifyAttestation(credID, issuerID, claim, keyID, sig, secretKey)
	if !valid {
		t.Errorf("expected signature to be valid")
	}

	// Verify tampering detection
	invalid := VerifyAttestation(credID, issuerID, "Tampered Claim", keyID, sig, secretKey)
	if invalid {
		t.Errorf("expected tampered signature verification to fail")
	}
}
