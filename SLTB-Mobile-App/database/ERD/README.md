# Entity Relationship Diagrams (ERD)

This directory contains all database Entity Relationship Diagram files.

## Purpose

Visual representation of the database schema and table relationships.

## Planned ERD Files

| File | Tool | Description |
|------|------|-------------|
| `sltb_mobile_erd_v1.0.png` | dbdiagram.io | Full system ERD export |
| `sltb_mobile_erd_v1.0.dbml` | DBML | dbdiagram.io source file |
| `sltb_mobile_erd_v1.0.mwb` | MySQL Workbench | MySQL Workbench model |

## Key Entities

```
PoliceOfficers ──< AlertActions >── Alerts
PoliceOfficers ──< Notifications
PoliceOfficers ──< PersonalAccessTokens
PoliceOfficers ──< AuditLogs
```

## Tools Recommended

- **dbdiagram.io** — Online ERD design (DBML syntax)
- **MySQL Workbench** — Advanced EER diagram modeling
- **DrawSQL** — Team-friendly schema visualization

## Status

🚧 **Pending** — ERD will be created during database design phase.
