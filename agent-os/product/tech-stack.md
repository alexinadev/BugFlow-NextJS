# BugFlow Tech Stack

## Overview

BugFlow is a modern, full-stack web application built with Next.js and PostgreSQL, designed for containerized deployment with comprehensive support for ticket management, user authentication, notifications, and analytics.

---

## Core Application Stack

### Framework & Runtime
- **Application Framework:** Next.js 16.1.6 (standalone mode, App Router)
- **Language/Runtime:** TypeScript 5, Node.js 22
- **Package Manager:** npm with package-lock.json

### Frontend
- **JavaScript Framework:** React 19.2.3 with React DOM 19.2.3
- **CSS Framework:** Tailwind CSS 4 with PostCSS 4
- **UI Component Libraries:**
  - Lucide React (icons and graphics, v0.574.0)
  - Recharts (data visualization and charts, v3.7.0)
  - @dnd-kit (drag & drop library with core, sortable, and utilities modules)
- **Custom Component Library:** Component organization in `/components` with barrel exports for clean imports

### Backend
- **API Layer:** Next.js API Routes (serverless architecture)
- **Routing:** Next.js App Router with middleware support for authentication and authorization
- **Request/Response:** Native Next.js request/response handling with JSON serialization

---

## Database & Data Layer

### Primary Database
- **Database Engine:** PostgreSQL 16-alpine (production-ready relational database)
- **ORM/Query Builder:** Prisma 7.4.0 with @prisma/adapter-pg
- **Database Client:** pg (node-postgres, v8.18.0) for PostgreSQL connections
- **Schema Management:** Prisma schema-driven philosophy with automatic type generation

### Key Models
- **User:** User accounts with roles (USER, ADMIN), authentication, profile information
- **Ticket:** Bug reports with status, severity, priority, labels, descriptions
- **Comment:** Threaded discussions on tickets
- **Notification:** User notifications with read/unread status
- **NotificationSettings:** Per-user notification preferences and configurations

---

## Authentication & Security

### Authentication
- **Method:** JWT (JSON Web Tokens) using jose v6.1.3
- **Session Management:** Stateless JWT tokens with custom implementation
- **Token Storage:** Client-side (secure HTTP-only cookies recommended for production)

### Password & Data Security
- **Password Hashing:** bcryptjs v3.0.3 with salt rounds for secure password storage
- **Environment Configuration:** Environment variables for secrets (never committed to version control)
- **SQL Security:** Prisma ORM provides SQL injection prevention through parameterized queries

---

## Code Quality & Development Tools

### Linting & Formatting
- **Linting Platform:** ESLint 9 with Next.js and TypeScript configurations
- **Styling Standard:** Tailwind CSS utility classes (no custom CSS beyond tokens)
- **Format Enforcement:** Automated formatting via ESLint on file save

### Type Safety
- **Language:** TypeScript 5 with strict mode enabled
- **Type Definitions:** Centralized types in `/types/index.ts`
- **Prisma Types:** Auto-generated types from schema.prisma

---

## Containerization & Deployment

### Docker & Container Orchestration
- **Container Runtime:** Docker with multi-stage builds for optimized image size
- **Base Image:** Node 22-alpine (minimal footprint)
- **Build Strategy:** Multi-stage build separating build stage from runtime stage
- **Configuration:** Standalone Next.js build for optimal Docker deployment

### Orchestration & Development
- **Compose Files:** 
  - `docker-compose.yml` for production deployment
  - `docker-compose.dev.yml` for local development environment
- **Health Checks:** Configured for both application and database containers
- **Environment Management:** Separate environment configurations for dev and production

---

## Visualization & Reporting

### Data Visualization
- **Chart Library:** Recharts v3.7.0 for responsive, interactive charts
- **Chart Types:** Line charts (submissions), pie charts (status distribution), bar charts

### Report Generation & Export
- **PDF Generation:** @react-pdf/renderer v4.3.2 for generating downloadable PDF reports
- **Export Capabilities:** Support for exporting ticket lists and analytics summaries

---

## Development & Build Tools

### Build & Development
- **Development Server:** `npm run dev` with Next.js hot module reloading
- **Production Build:** `next build` with standalone output mode
- **Start Production:** `npm start` to run production-built application

### Database Migrations
- **Migration Tool:** Prisma migrate
- **Commands:**
  - `prisma migrate dev` for local development migrations
  - `prisma migrate deploy` for production migrations
- **Seed Script:** `prisma/seed.ts` for database initialization

---

## Infrastructure & Environment

### Configuration Files
- `.env.local` — Environment variables for local development (not committed)
- `tsconfig.json` — TypeScript compiler configuration with path aliases (`@/*`)
- `next.config.ts` — Next.js configuration (standalone mode)
- `prisma.config.ts` — Prisma configuration settings
- `postcss.config.mjs` — PostCSS configuration for Tailwind CSS
- `eslint.config.mjs` — ESLint rules and configuration

### Environment Detection
- **Custom Detection:** `lib/env-detection.ts` for runtime environment identification
- **Variables:** DATABASE_URL, JWT_SECRET, NODE_ENV (development/production)

---

## Third-Party Services (To Be Integrated)

### Email & Notifications
- **Status:** Planned for implementation on roadmap
- **Options:** SendGrid, Mailgun, or AWS SES for transactional email delivery

### Monitoring & Observability
- **Health Checks:** Current Docker health check endpoints
- **Logging:** Console-based logging (structured logging can be added)
- **Monitoring:** Ready for integration with APM services (New Relic, Datadog)

### CI/CD Pipeline
- **Status:** Ready for implementation
- **Recommended:** GitHub Actions for automated testing and deployment

---

## Client-Side Technologies

### Interactive Features
- **Drag & Drop:** @dnd-kit for Kanban board interactivity
- **Icons:** Comprehensive icon library via Lucide React
- **Animations:** CSS transitions via Tailwind CSS

### Browser Support
- **Target:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile:** Responsive design via Tailwind CSS responsive utilities

---

## Development Standards Compliance

### Code Quality Standards
- **Naming Conventions:** Consistent camelCase for variables/functions, PascalCase for components
- **Code Organization:** DRY principle with reusable utility functions in `/lib`
- **Dead Code:** Regular cleanup of unused imports and functions
- **Type Safety:** Strict TypeScript for compile-time type checking

### Architectural Patterns
- **Component Structure:** Modular components with barrel exports
- **API Organization:** Route-based API organization under `/app/api`
- **Database Access:** Centralized Prisma client in `lib/db.ts`
- **Feature Isolation:** Organized by feature area (admin, portal, tickets, etc.)

---

## Performance Considerations

### Optimization
- **Build Output:** Standalone Next.js build for Docker deployment
- **Image Size:** Multi-stage Docker builds minimize final image size
- **Data Fetching:** Server-side data fetching via Next.js API routes
- **Database Indexing:** Configured via Prisma schema for common queries

### Scalability
- **Stateless Design:** JWT-based authentication enables horizontal scaling
- **Database Pools:** pg connection pooling configured at runtime
- **Containerization:** Designed for Kubernetes or container orchestration platforms