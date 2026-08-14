# Database Schema Directory

This directory contains all database schema definition files for the SLTB Mobile App.

## Purpose

Store raw schema definitions, DDL scripts, and schema visualization files.

## Contents

```
schema/
├── police_officers.md    # Officers table schema definition
├── alerts.md             # Alerts table schema definition
├── alert_actions.md      # Alert actions audit table schema
├── notifications.md      # Notifications table schema
└── audit_logs.md         # System audit log schema
```

## Notes

- Schema documents describe the intended table structure before migration files are created
- Column names use `snake_case` convention
- All tables include `created_at`, `updated_at` timestamps
- Primary keys use unsigned BIGINT auto-increment (standard Laravel convention)
- Foreign keys are properly indexed

## Status

🚧 **Pending** — Schema design will begin in Phase 2.
