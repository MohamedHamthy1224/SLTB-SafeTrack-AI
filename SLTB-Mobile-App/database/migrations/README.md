# Database Migrations Directory

This directory contains versioned database migration scripts.

## Purpose

Track and version all database schema changes over time.
Each migration is timestamped and reversible.

## Migration Naming Convention

```
YYYY_MM_DD_HHMMSS_description_of_change.sql
```

## Planned Migrations

| Order | Migration | Description |
|-------|-----------|-------------|
| 001 | create_police_officers_table | Officer accounts, auth, profile |
| 002 | create_alerts_table | AI-generated traffic alerts |
| 003 | create_alert_actions_table | Officer actions audit trail |
| 004 | create_notifications_table | Push notification log |
| 005 | create_audit_logs_table | System-wide audit log |
| 006 | create_personal_access_tokens_table | Sanctum auth tokens |

## Status

🚧 **Pending** — Will be created via `php artisan make:migration` in Phase 2.
