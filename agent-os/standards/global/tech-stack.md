## Tech stack

The BugFlow application is a modern full-stack web application built with Next.js and PostgreSQL.

### Framework & Runtime
- **Application Framework:** Next.js 16.1.6 (standalone mode)
- **Language/Runtime:** TypeScript 5, Node.js 22
- **Package Manager:** npm with package-lock.json

### Frontend
- **JavaScript Framework:** React 19.2.3 with React DOM 19.2.3
- **CSS Framework:** Tailwind CSS 4 with PostCSS 4
- **UI Components:** 
  - Lucide React (icons, v0.574.0)
  - Recharts (data visualization, v3.7.0)
  - @dnd-kit (drag & drop functionality - core, sortable, utilities)
  - @react-pdf/renderer (PDF generation, v4.3.2)
  - Custom component library in `/components`

### Database & Storage
- **Database:** PostgreSQL 16-alpine
- **ORM/Query Builder:** Prisma 7.4.0 with @prisma/adapter-pg
- **Database Client:** pg (node-postgres, v8.18.0)
- **Caching:** None configured

### Testing & Quality
- **Test Framework:** Not configured (to be implemented)
- **Linting/Formatting:** ESLint 9 with Next.js and TypeScript configurations
- **Type Checking:** TypeScript strict mode enabled

### Deployment & Infrastructure
- **Containerization:** Docker (multi-stage build with Node 22-alpine)
- **Orchestration:** Docker Compose with health checks
- **Build Output:** Standalone Next.js build for optimal Docker image size
- **CI/CD:** Not configured (ready for GitHub Actions)

### Security & Authentication
- **Authentication:** JWT-based (jose v6.1.3)
- **Password Hashing:** bcryptjs (v3.0.3)
- **Session Management:** JWT tokens with custom implementation

### Third-Party Services
- **Authentication:** Custom JWT implementation
- **Email:** Not yet integrated
- **Monitoring:** Health check endpoints configured in Docker
