package crypto

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// SignAttestation produces a deterministic cryptographic HMAC-SHA256 signature for credential attestation
func SignAttestation(credentialID, issuerID, claim, keyID string, secretKey []byte) string {
	h := hmac.New(sha256.New, secretKey)
	payload := fmt.Sprintf("%s:%s:%s:%s", credentialID, issuerID, claim, keyID)
	h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}

// VerifyAttestation verifies that a signature matches the payload and secret key
func VerifyAttestation(credentialID, issuerID, claim, keyID, signature string, secretKey []byte) bool {
	expectedSig := SignAttestation(credentialID, issuerID, claim, keyID, secretKey)
	return hmac.Equal([]byte(expectedSig), []byte(signature))
}
