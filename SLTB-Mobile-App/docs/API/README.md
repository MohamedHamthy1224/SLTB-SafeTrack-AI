# API Documentation

This directory contains all API documentation for the SLTB Mobile App backend.

## Purpose

Maintain up-to-date documentation for all REST API endpoints exposed by the Laravel backend.

## Documentation Format

API documentation will be maintained in:

- **OpenAPI 3.0 / Swagger** — Machine-readable API spec (YAML/JSON)
- **Postman Collection** — Importable API testing collection
- **Markdown** — Human-readable endpoint reference

## Planned Files

| File | Format | Description |
|------|--------|-------------|
| `openapi.yaml` | OpenAPI 3.0 | Full API specification |
| `SLTB-Mobile-API.postman_collection.json` | Postman | Importable collection |
| `authentication.md` | Markdown | Auth endpoint documentation |
| `alerts.md` | Markdown | Alerts endpoint documentation |
| `profile.md` | Markdown | Profile endpoint documentation |
| `dashboard.md` | Markdown | Dashboard endpoint documentation |

## API Base URL

```
Development: http://localhost:8000/api
Staging:     https://staging-api.sltb-safetrack.lk/api
Production:  https://api.sltb-safetrack.lk/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {access_token}
```

## Standard Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "timestamp": "2024-08-01T12:00:00Z",
    "version": "1.0.0"
  }
}
```

## Status

🚧 **Pending** — API documentation will be created as endpoints are implemented.
