# AfriPass Production Backend (Go)

High-performance, privacy-preserving REST API for institutional financial attestations, credential lifecycle management, and Midnight Zero-Knowledge proof coordination.

## 🚀 Key Architectural Features
- **Data Provenance**: Institutional cryptographic HMAC-SHA256 & RSA signatures establish origin.
- **Privacy-Preserving**: No raw transaction logs or private bank accounts are stored.
- **Multi-Role Provider Network**: Supports Banks, Fintechs, Loan Companies, Cooperatives, and Employers as **Issuers** and/or **Verifiers**.
- **Midnight Integration**: Coordinates ZK proofs against the Midnight Preprod Network.

## 🛠️ Tech Stack
- **Language**: Go 1.22+
- **Database**: PostgreSQL 16
- **Auth**: JWT & Scoped API Keys
- **API Spec**: OpenAPI 3.0

## 📦 Running Locally
```bash
# Build binary
go build -o bin/server ./cmd/server

# Run test suite
go test ./...

# Run server
./bin/server
```

## 🐳 Docker Run
```bash
docker-compose up --build
```
