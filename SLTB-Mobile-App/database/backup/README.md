# Database Backup Directory

This directory stores database backup files.

## Purpose

Store automated and manual database backup dumps.

## ⚠️ IMPORTANT SECURITY NOTICE

> **NEVER commit `.sql`, `.dump`, or `.gz` backup files to version control.**
> All backup files in this directory are excluded by `.gitignore`.
> Use a secure, encrypted file storage solution for production backups.

## Backup Schedule

| Environment | Frequency | Retention |
|-------------|-----------|-----------|
| Production | Every 6 hours | 30 days |
| Staging | Daily | 7 days |
| Development | Manual | Until deleted |

## Backup Naming Convention

```
sltb_mobile_backup_YYYY-MM-DD_HHMMSS.sql.gz
```

## Restore Command

```bash
gunzip -c backup_file.sql.gz | mysql -u root -p sltb_mobile_db
```
