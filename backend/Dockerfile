# Multi-stage production build for AfriPass Go Backend
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o afripass-backend ./cmd/server

# Final minimal runtime image
FROM alpine:3.19

RUN adduser -D -g '' afripassuser

WORKDIR /app

COPY --from=builder /app/afripass-backend .
COPY --from=builder /app/migrations ./migrations

USER afripassuser

EXPOSE 8080

ENV PORT=8080
ENV APP_ENV=production

CMD ["./afripass-backend"]
