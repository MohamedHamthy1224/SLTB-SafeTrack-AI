# SQL Scripts Directory

This directory contains raw SQL scripts for reference and administration purposes.

## Purpose

Store SQL scripts for database setup, reference queries, and administration tasks.

## Planned SQL Files

| File | Purpose |
|------|---------|
| `create_database.sql` | Create the MySQL database and user |
| `indexes.sql` | Additional index optimization scripts |
| `stored_procedures.sql` | Any MySQL stored procedures |
| `views.sql` | Database view definitions |

## Create Database Script (Template)

```sql
-- SLTB SafeTrack AI — Mobile App Database Setup
-- Run this once on a new MySQL server

CREATE DATABASE IF NOT EXISTS `sltb_mobile_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'sltb_user'@'localhost'
  IDENTIFIED BY 'REPLACE_WITH_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON `sltb_mobile_db`.* TO 'sltb_user'@'localhost';
FLUSH PRIVILEGES;
```

## ⚠️ Note

Raw SQL backup dumps are stored in `../backup/` directory.
This directory is for script files only, not backup dumps.

## Status

🚧 **Pending** — SQL scripts will be created during database setup phase.
