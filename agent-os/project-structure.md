# BugFlow Project Structure

## Overview
BugFlow is a comprehensive bug tracking and ticket management system built with Next.js, React, and PostgreSQL. The application provides a full-stack solution with admin dashboards, user portals, ticket submission forms, and real-time notifications.

## Directory Structure

### Root Configuration Files
```
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration (standalone mode)
├── eslint.config.mjs            # ESLint configuration
├── postcss.config.mjs           # PostCSS configuration for Tailwind
├── middleware.ts                # Next.js middleware (authentication/routing)
├── .env.local                   # Environment variables (local development)
├── Dockerfile                   # Multi-stage Docker build (production)
├── Dockerfile.dev               # Development Docker configuration
├── docker-compose.yml           # Production Docker Compose setup
├── docker-compose.dev.yml       # Development Docker Compose setup
├── prisma.config.ts             # Prisma configuration
├── README.md                    # Project documentation
└── next-env.d.ts                # Next.js TypeScript definitions
```

### `/app` - Next.js App Router
The application routing and API endpoints following Next.js 16 conventions.

#### Pages
```
app/
├── layout.tsx                   # Root layout wrapper
├── page.tsx                     # Home/landing page
├── globals.css                  # Global styles
├── admin/
│   └── page.tsx                 # Admin dashboard page
├── portal/
│   └── page.tsx                 # User portal/reporting page
├── status/
│   └── page.tsx                 # Ticket status tracking page
├── submit/
│   └── page.tsx                 # Ticket submission page
└── api/                         # API route handlers
    ├── health/                  # Health check endpoint
    ├── auth/                    # Authentication endpoints
    │   ├── login
    │   ├── logout
    │   └── register
    ├── tickets/                 # Ticket CRUD operations
    │   ├── [id].ts
    │   ├── list.ts
    │   └── create.ts
    ├── notifications/           # Notification endpoints
    │   ├── getNotifications.ts
    │   ├── markAsRead.ts
    │   └── settings.ts
    └── admin/                   # Admin-specific endpoints
        ├── users.ts
        ├── analytics.ts
        └── bulk-actions.ts
```

### `/components` - React Components
Organized by feature area, using barrel exports for clean imports.

```
components/
├── admin/                       # Admin dashboard components
│   ├── AdminDashboard.tsx       # Main admin panel
│   ├── KanbanBoard.tsx          # Kanban view for tickets
│   ├── KanbanColumn.tsx         # Column in Kanban board
│   ├── KanbanTicket.tsx         # Draggable ticket card
│   ├── TicketDetailModal.tsx    # Ticket detail view
│   ├── TicketFilters.tsx        # Filter controls
│   ├── TicketList.tsx           # List view of tickets
│   ├── BulkActionsBar.tsx       # Bulk action toolbar
│   └── index.ts                 # Barrel export
├── auth/                        # Authentication components
│   ├── AuthProvider.tsx         # Auth context provider
│   ├── LoginDialog.tsx          # Login form dialog
│   └── index.ts                 # Barrel export
├── landing/                     # Landing page components
│   ├── LandingPage.tsx          # Home page content
│   └── index.ts                 # Barrel export
├── notifications/               # Notification components
│   ├── NotificationBell.tsx     # Notification icon with count
│   └── index.ts                 # Barrel export
├── portal/                      # User portal components
│   ├── UserPortalDashboard.tsx  # Portal main view
│   ├── MetricCard.tsx           # Metric display card
│   ├── ReportGenerator.tsx      # Report generation
│   ├── StatusDistributionChart.tsx  # Status pie chart
│   ├── SubmissionChart.tsx      # Submission timeline
│   └── index.ts                 # Barrel export
├── shell/                       # App shell/layout components
│   ├── AppShell.tsx             # Main application wrapper
│   ├── MainNav.tsx              # Navigation menu
│   ├── UserMenu.tsx             # User dropdown menu
│   ├── DarkModeToggle.tsx        # Theme switcher
│   └── index.ts                 # Barrel export
├── status/                      # Status tracking components
│   ├── TicketTrackingDashboard.tsx  # Tracking view
│   ├── TicketStatusCard.tsx     # Status display card
│   ├── StatusHistoryModal.tsx   # Status history timeline
│   └── index.ts                 # Barrel export
└── tickets/                     # Ticket submission components
    ├── TicketSubmissionForm.tsx # Form to submit tickets
    ├── TicketSuccessModal.tsx   # Success confirmation
    └── index.ts                 # Barrel export
```

### `/lib` - Utility Functions & Libraries
```
lib/
├── auth.ts                      # Authentication utilities (JWT, login, register)
├── db.ts                        # Prisma client initialization
└── env-detection.ts             # Environment variable detection
```

### `/types` - TypeScript Definitions
```
types/
└── index.ts                     # Centralized type definitions
                                 # (User, Ticket, Notification, etc.)
```

### `/prisma` - Database Schema & Migrations
```
prisma/
├── schema.prisma                # Prisma data model definition
├── seed.ts                      # Database seed script
└── migrations/
    ├── migration_lock.toml      # Migration lock file
    ├── 20260217150226_init/     # Initial schema migration
    │   └── migration.sql
    └── 20260217192430_add_notification_settings/
        └── migration.sql        # Notification settings migration
```

#### Key Models in Schema
- **User:** User accounts with roles (USER, ADMIN), profile info, created/updated timestamps
- **Ticket:** Bug reports with title, description, severity, status, labels, priority, assignees
- **Comment:** Discussion threads on tickets
- **Notification:** User notifications with read status
- **NotificationSettings:** Per-user notification preferences
- **Additional Models:** Support for categories, labels, severity levels, ticket statuses, and priorities

### `/public` - Static Assets
```
public/
├── images/                      # Logo, icons, UI images
├── favicon.ico                  # Favicon
└── fonts/                       # Custom font files
```

### `/scripts` - Utility Scripts
```
scripts/
└── docker-entrypoint.sh         # Docker container startup script
                                 # (Runs migrations, starts app)
```

### `/product-plan` - Documentation & Planning
```
product-plan/
├── README.md                    # Product planning overview
├── product-overview.md          # Product requirements & features
├── Docker Plan.md               # Docker deployment documentation
├── data-model/
│   ├── README.md                # Data model documentation
│   └── types.ts                 # TypeScript type definitions
├── design-system/
│   ├── tokens.css               # Design tokens (colors, spacing)
│   ├── fonts.md                 # Typography guidelines
│   └── tailwind-colors.md       # Tailwind color palette
├── instructions/
│   ├── one-shot-instructions.md # Quick start guide
│   └── incremental/             # Step-by-step setup guides
├── prompts/
│   ├── one-shot-prompt.md       # AI prompt for one-shot generation
│   ├── section-prompt.md        # Feature section prompts
│   └── section-prompt copy.md   # Alternative prompts
└── sections/                    # Feature documentation by domain
    ├── admin-dashboard-and-management/
    ├── status-tracking-and-notifications/
    ├── user-portal-and-reporting/
    ├── user-ticket-submission/
    └── shell/
        ├── README.md
        └── components/
```

### `/agent-os` - AI Agent Configuration & Standards
```
agent-os/
├── config.yml                   # Agent configuration settings
├── standards/                   # Development standards
│   ├── global/
│   │   ├── tech-stack.md        # Technology stack documentation
│   │   └── ... (other global standards)
│   ├── backend/                 # Backend code standards
│   ├── frontend/                # Frontend code standards
│   └── testing/                 # Testing standards
└── commands/                    # Agent command definitions
    ├── create-tasks/            # Task creation commands
    ├── implement-tasks/         # Implementation commands
    ├── orchestrate-tasks/       # Orchestration commands
    ├── plan-product/            # Product planning commands
    ├── shape-spec/              # Specification shaping
    └── write-spec/              # Specification writing
```

## Feature Areas

### 1. Admin Dashboard
- Kanban board view with drag-and-drop support
- Ticket list with advanced filtering
- Bulk actions on tickets
- Detailed ticket information modal
- Admin-only management interface

### 2. User Portal
- Personal ticket submission dashboard
- Report generation and export
- Statistics and metrics cards
- Status distribution visualization
- Submission timeline charts

### 3. Ticket Management
- Ticket submission form with validation
- Status tracking with history
- Multiple status states (pending_verification, assigned, etc.)
- Severity and priority levels
- Label and category support

### 4. Notifications
- Real-time notification bell with count
- User notification preferences
- Notification settings per user

### 5. Authentication & Authorization
- JWT-based authentication
- Role-based access (USER, ADMIN)
- Password hashing with bcryptjs
- Login/logout functionality

### 6. Deployment
- Multi-stage Docker build for optimal image size
- Docker Compose with PostgreSQL
- Health checks for both app and database
- Standalone Next.js build output

## Data Flow

```
User Request
    ↓
Next.js Middleware (auth check)
    ↓
API Route or Page Route
    ↓
Prisma (Database Access)
    ↓
PostgreSQL
    ↓
Response (API JSON or Server-Rendered HTML)
    ↓
React Component Rendering
    ↓
Browser Display
```

## Development Workflow

1. **Local Development:** `npm run dev` with hot module reloading
2. **Type Checking:** TypeScript strict mode
3. **Linting:** ESLint on save
4. **Database Changes:** `prisma migrate dev` to create migrations
5. **Docker Build:** `docker build` for production image
6. **Docker Run:** `docker-compose up` for local containers

## Key Technologies Integration

- **Next.js App Router:** Modern routing with server and client components
- **React Components:** Modular, reusable UI building blocks
- **Tailwind CSS:** Utility-first styling with Tailwind v4
- **Prisma:** Type-safe database access with migrations
- **PostgreSQL:** Production-ready relational database
- **JWT Auth:** Stateless authentication tokens
- **Drag & Drop:** @dnd-kit for Kanban interactivity
- **Charts:** Recharts for data visualization
- **PDF Export:** React PDF for report generation
- **Icons:** Lucide React for consistent iconography

## Configuration Management

- Environment variables in `.env.local`
- Docker environment overrides in compose files
- Prisma configuration in `prisma.config.ts`
- Next.js configuration in `next.config.ts`
- TypeScript paths configured with `@/*` alias

## Security Considerations

- HTTPS enforcement in production
- JWT token validation on protected routes
- Password hashing with bcryptjs
- SQL injection prevention via Prisma
- CORS configuration ready for API calls
- Health check endpoints for monitoring

