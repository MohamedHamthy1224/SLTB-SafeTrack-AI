<div align="center">

# 🚔 SLTB SafeTrack AI — Mobile Application
### Traffic Police Mobile Application
**Version:** 1.0.0-foundation &nbsp;|&nbsp; **Status:** In Development &nbsp;|&nbsp; **Platform:** iOS & Android

---

[![React Native](https://img.shields.io/badge/React_Native-Expo-0ea5e9?style=for-the-badge&logo=expo)](https://expo.dev)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Setup Overview](#setup-overview)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Git Branch Strategy](#git-branch-strategy)
- [Future Development Phases](#future-development-phases)

---

## 🎯 Project Overview

**SLTB-Mobile-App** is the Traffic Police Mobile Application of the **SLTB SafeTrack AI System** — an intelligent, AI-powered fleet management and public safety platform operated by the Sri Lanka Transport Board (SLTB).

This mobile application empowers Traffic Police Officers to:

- 🔔 Receive real-time AI-generated traffic alerts
- 📊 Access live dashboard data and incident reports
- 📋 Review historical traffic violation records
- 👤 Manage their officer profile and account settings
- 📡 Communicate seamlessly with the central SLTB SafeTrack AI backend

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Mobile Framework** | React Native (Expo) | SDK 51+ |
| **Navigation** | React Navigation | v6 |
| **State Management** | Context API + Zustand | Latest |
| **HTTP Client** | Axios | Latest |
| **Backend Framework** | Laravel | 11.x |
| **API Architecture** | RESTful API | — |
| **Authentication** | Laravel Sanctum / JWT | — |
| **Database** | MySQL | 8.0+ |
| **Caching** | Redis | 7+ |
| **Runtime** | Node.js | 20 LTS |
| **Package Manager** | npm / yarn | Latest |
| **PHP** | PHP | 8.2+ |

---

## 📁 Folder Structure

```
SLTB-Mobile-App/
│
├── 📱 frontend/                  # React Native Expo Application
│   ├── src/
│   │   ├── assets/               # Static assets (images, fonts, etc.)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # App-wide shared components
│   │   │   ├── authentication/   # Auth-specific components
│   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   ├── alerts/           # Alert components
│   │   │   ├── history/          # History list components
│   │   │   ├── profile/          # Profile components
│   │   │   └── shared/           # Cross-feature shared components
│   │   ├── layouts/              # Screen layout wrappers
│   │   ├── navigation/           # App navigation configuration
│   │   ├── screens/              # Screen-level components
│   │   ├── services/             # API service layer
│   │   ├── hooks/                # Custom React hooks
│   │   ├── theme/                # Design system tokens
│   │   ├── constants/            # App-wide constants
│   │   ├── helpers/              # Helper functions
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript / PropTypes definitions
│   │   ├── styles/               # Global styles
│   │   ├── config/               # App configuration
│   │   ├── contexts/             # React Context definitions
│   │   ├── providers/            # Context providers
│   │   ├── store/                # State management store
│   │   └── mock/                 # Mock data for development
│   ├── App.js                    # App entry point
│   ├── app.json                  # Expo configuration
│   ├── babel.config.js           # Babel configuration
│   └── package.json              # Dependencies
│
├── ⚙️  backend/                   # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # Request controllers
│   │   │   ├── Middleware/       # HTTP middleware
│   │   │   └── Requests/        # Form request validation
│   │   ├── Models/              # Eloquent ORM models
│   │   ├── Services/            # Business logic layer
│   │   ├── Repositories/        # Data access layer
│   │   ├── Resources/           # API resource transformers
│   │   ├── Policies/            # Authorization policies
│   │   ├── Traits/              # Reusable traits
│   │   ├── Events/              # Domain events
│   │   ├── Listeners/           # Event listeners
│   │   ├── Jobs/                # Queue jobs
│   │   └── Notifications/       # Notification classes
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   ├── seeders/             # Database seeders
│   │   └── factories/           # Model factories
│   ├── routes/                  # Route definitions
│   ├── config/                  # Laravel configuration
│   ├── storage/                 # File storage
│   ├── tests/                   # Unit & feature tests
│   └── public/                  # Public web root
│
├── 🗄️  database/                  # Database Design & Artifacts
│   ├── schema/                  # Schema definitions
│   ├── migrations/              # Versioned migration scripts
│   ├── seeders/                 # Seed data scripts
│   ├── backup/                  # Database backup files
│   ├── ERD/                     # Entity Relationship Diagrams
│   └── SQL/                     # Raw SQL scripts
│
├── 📚 docs/                      # Project Documentation
│   ├── API/                     # API documentation
│   ├── Architecture/            # System architecture docs
│   ├── Database/                # Database design docs
│   ├── UI/                      # UI/UX documentation
│   │   └── Images/              # UI screenshots and designs
│   ├── MeetingNotes/            # Sprint & meeting notes
│   └── Requirements/            # Project requirements
│
├── 🎨 assets/                    # Root-level shared assets
│   ├── images/                  # App images
│   ├── icons/                   # App icons
│   ├── fonts/                   # Custom fonts
│   ├── animations/
│   │   └── lottie/              # Lottie animation files
│   ├── illustrations/           # Illustration assets
│   └── sounds/                  # Audio assets
│
├── 🔗 shared/                    # Cross-platform shared resources
│   ├── constants/               # Shared constants
│   ├── types/                   # Shared type definitions
│   ├── interfaces/              # Shared interface definitions
│   └── utils/                   # Shared utility functions
│
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

---

## ⚡ Setup Overview

### Prerequisites

Ensure the following tools are installed on your machine:

```bash
# Required
node --version        # >= 20.x LTS
npm --version         # >= 10.x
php --version         # >= 8.2
composer --version    # >= 2.x
mysql --version       # >= 8.0
```

### Frontend Setup (React Native Expo)

```bash
# 1. Navigate to frontend directory
cd SLTB-Mobile-App/frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start Expo development server
npx expo start

# 5. Run on specific platform
npx expo start --android
npx expo start --ios
```

### Backend Setup (Laravel)

```bash
# 1. Navigate to backend directory
cd SLTB-Mobile-App/backend

# 2. Install PHP dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Run database migrations
php artisan migrate

# 6. Seed the database
php artisan db:seed

# 7. Start development server
php artisan serve
```

---

## 🔄 Development Workflow

### Sprint Cycle

```
Week 1-2 → Sprint Planning + Design Review
Week 2-4 → Feature Development
Week 4   → Code Review + QA Testing
Week 4   → Staging Deployment + UAT
Week 5   → Production Release
```

### Daily Workflow

1. **Pull** latest changes from `develop` branch
2. **Create** feature branch following naming convention
3. **Develop** feature with unit tests
4. **Commit** using conventional commit format
5. **Push** and open Pull Request
6. **Review** — minimum 1 peer review required
7. **Merge** to `develop` after approval

### Commit Message Convention

```
<type>(<scope>): <short description>

Types:
  feat     → New feature
  fix      → Bug fix
  docs     → Documentation changes
  style    → Formatting, no logic change
  refactor → Code refactoring
  test     → Adding or updating tests
  chore    → Build process or tool changes
  perf     → Performance improvement
  ci       → CI/CD pipeline changes

Examples:
  feat(auth): add JWT token refresh mechanism
  fix(alerts): resolve duplicate notification issue
  docs(api): update authentication endpoint docs
  refactor(services): extract alert service logic
```

---

## 📐 Coding Standards

### React Native / JavaScript

- **Style Guide:** Airbnb JavaScript Style Guide
- **Formatting:** Prettier (`.prettierrc` configured)
- **Linting:** ESLint with React Native plugin
- **Naming:**
  - Components → `PascalCase` (e.g., `AlertCard.jsx`)
  - Hooks → `useCamelCase` (e.g., `useAlerts.js`)
  - Constants → `UPPER_SNAKE_CASE`
  - Functions/Variables → `camelCase`
  - Files → `PascalCase` for components, `camelCase` for utilities
- **Component Structure:** Functional components with hooks only — no class components
- **Prop Validation:** Always define PropTypes or TypeScript interfaces
- **Imports:** Absolute imports configured via `babel-plugin-module-resolver`

### Laravel / PHP

- **Style Guide:** PSR-12 Coding Standard
- **Formatting:** Laravel Pint
- **Naming:**
  - Controllers → `PascalCase` + `Controller` suffix
  - Models → `PascalCase` singular (e.g., `PoliceOfficer`)
  - Tables → `snake_case` plural (e.g., `police_officers`)
  - Routes → `kebab-case`
  - Methods → `camelCase`
- **Architecture:** Repository Pattern + Service Layer
- **Validation:** Always use Form Request classes
- **API Responses:** Always use API Resource classes

### General Rules

- ✅ No hardcoded strings — use constants/config files
- ✅ No `console.log` or `dd()` in production code
- ✅ Every function must have a clear, single responsibility
- ✅ Write tests for all business logic
- ✅ Document all public APIs and complex logic

---

## 🌿 Git Branch Strategy

This project follows **Git Flow** branching model:

```
main
  └── develop
        ├── feature/SLTB-{ticket}-{description}
        ├── bugfix/SLTB-{ticket}-{description}
        ├── hotfix/SLTB-{ticket}-{description}
        └── release/v{major}.{minor}.{patch}
```

### Branch Descriptions

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code | — |
| `develop` | Integration branch for features | `main` (via release) |
| `feature/*` | New feature development | `develop` |
| `bugfix/*` | Bug fixes for develop | `develop` |
| `hotfix/*` | Critical production fixes | `main` + `develop` |
| `release/*` | Release preparation | `main` + `develop` |

### Branch Naming Examples

```bash
feature/SLTB-101-user-authentication
feature/SLTB-102-alert-dashboard
bugfix/SLTB-201-login-token-expiry
hotfix/SLTB-301-critical-null-pointer
release/v1.0.0
```

### Pull Request Rules

- Minimum **1 reviewer** required
- All CI checks must pass
- No merge conflicts
- Branch must be up-to-date with target branch
- Linked to a ticket/issue

---

## 🚀 Future Development Phases

### Phase 1 — Foundation (Current)
> 🎯 Project setup, architecture, environment configuration

- [x] Project folder structure
- [x] .gitignore & README
- [ ] Expo project initialization
- [ ] Laravel project initialization
- [ ] CI/CD pipeline setup

### Phase 2 — Authentication
> 🔐 Officer login, token management, session handling

- [ ] Login screen (UI)
- [ ] Laravel Sanctum / JWT integration
- [ ] Token storage & refresh
- [ ] Protected route guards

### Phase 3 — Core Features
> 📊 Dashboard, Alerts, History modules

- [ ] Officer Dashboard screen
- [ ] Real-time AI Alert notifications
- [ ] Alert Details screen
- [ ] Historical records screen
- [ ] Push notifications (FCM)

### Phase 4 — Profile & Settings
> 👤 Profile management, password change, preferences

- [ ] Profile view & edit
- [ ] Change password
- [ ] Notification preferences
- [ ] App settings

### Phase 5 — AI Integration
> 🤖 SafeTrack AI module integration

- [ ] Live AI alert feed
- [ ] Predictive violation insights
- [ ] AI report summaries
- [ ] Heatmap data visualization

### Phase 6 — Optimization & Release
> 🏁 Performance, testing, production deployment

- [ ] Performance optimization
- [ ] Unit & integration tests
- [ ] End-to-end testing
- [ ] App Store / Play Store submission
- [ ] Production deployment

---

## 👥 Development Team

| Role | Responsibility |
|------|---------------|
| Solution Architect | System design & technical decisions |
| Frontend Developer | React Native Expo mobile app |
| Backend Developer | Laravel API development |
| Database Administrator | MySQL schema & optimization |
| QA Engineer | Testing & quality assurance |

---

## 📞 Contact & Support

For technical queries related to SLTB SafeTrack AI System:

- **Project:** SLTB SafeTrack AI
- **Module:** Traffic Police Mobile Application
- **System:** SLTB-Mobile-App v1.0.0

---

<div align="center">

**© 2024 SLTB SafeTrack AI System. All Rights Reserved.**

*Built with ❤️ for Sri Lanka Transport Board*

</div>
