# Database Documentation

This directory contains all database design and reference documentation.

## Purpose

Document database design decisions, table schemas, relationships, and conventions.

## Planned Documents

| File | Description |
|------|-------------|
| `database-design.md` | Overall database design philosophy and decisions |
| `table-schemas.md` | Detailed schema for each table |
| `relationships.md` | Table relationship descriptions |
| `indexes.md` | Index strategy and justifications |
| `naming-conventions.md` | Database naming rules and standards |
| `performance-guide.md` | Query optimization guidelines |

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | `snake_case`, plural | `police_officers` |
| Columns | `snake_case` | `badge_number` |
| Primary Keys | `id` (BIGINT UNSIGNED) | `id` |
| Foreign Keys | `{table_singular}_id` | `officer_id` |
| Indexes | `idx_{table}_{column}` | `idx_alerts_status` |
| Boolean Columns | `is_{condition}` | `is_active` |
| Timestamps | Standard Laravel | `created_at`, `updated_at` |

## Status

🚧 **Pending** — Database documentation will be created in Phase 2.
