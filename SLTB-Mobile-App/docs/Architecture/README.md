# Architecture Documentation

This directory contains all system architecture documentation.

## Purpose

Document the high-level and detailed architecture decisions for the SLTB SafeTrack AI Mobile App system.

## Planned Documents

| File | Description |
|------|-------------|
| `system-overview.md` | High-level system architecture overview |
| `mobile-app-architecture.md` | React Native app layer architecture |
| `backend-architecture.md` | Laravel API architecture (MVC + Services + Repositories) |
| `data-flow.md` | End-to-end data flow diagrams |
| `security-architecture.md` | Auth, token management, data security design |
| `notification-architecture.md` | Push notification delivery pipeline |
| `deployment-architecture.md` | Production deployment topology |
| `adr/` | Architecture Decision Records |

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   SLTB SafeTrack AI System                  │
│                                                             │
│  ┌──────────────────┐         ┌───────────────────────────┐ │
│  │  Mobile App      │         │  SLTB Web Dashboard       │ │
│  │  (React Native   │         │  (React.js)               │ │
│  │   Expo)          │         │                           │ │
│  └────────┬─────────┘         └───────────┬───────────────┘ │
│           │                               │                 │
│           └───────────────┬───────────────┘                 │
│                           │ HTTPS / REST API                │
│                           ▼                                 │
│              ┌─────────────────────────┐                    │
│              │  Laravel REST API       │                    │
│              │  (PHP 8.2)              │                    │
│              └────────────┬────────────┘                    │
│                           │                                 │
│              ┌────────────┴────────────┐                    │
│              │                         │                    │
│              ▼                         ▼                    │
│         ┌────────┐              ┌──────────┐                │
│         │ MySQL  │              │  Redis   │                │
│         │  DB    │              │  Cache   │                │
│         └────────┘              └──────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             AI Engine (SafeTrack AI)                │    │
│  │   Bus monitoring → Violation detection → Alerts     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Status

🚧 **Pending** — Architecture documents will be created during Phase 1 & 2.
