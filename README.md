# BugFlow

A streamlined ticketing system that connects end-users directly with support teams for software bug reporting. BugFlow transforms chaotic email and chat reports into structured, trackable tickets, giving users visibility and administrators a clear workflow.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)

## Features

### For Users
- **Ticket Submission** — Submit bug reports with guided fields, severity levels, and step-by-step reproduction details
- **Status Tracking** — Monitor ticket progress with real-time status updates
- **User Portal** — Dashboard with submission metrics, charts, and analytics
- **Report Export** — Generate PDF and CSV reports with configurable date ranges

### For Administrators
- **Kanban Board** — Drag-and-drop ticket management with status columns
- **List View** — Sortable, filterable ticket table with bulk actions
- **Ticket Assignment** — Assign tickets to team members
- **Bulk Operations** — Update status and assignee for multiple tickets
- **Admin Dashboard** — Overview of all tickets with filtering and search

### Technical Features
- 🔐 JWT-based authentication with role-based access control
- 🌗 Dark mode support
- 📱 Responsive design for mobile and desktop
- 🔔 Notification system with read/unread tracking
- 📊 Interactive charts with Recharts
- 📄 PDF generation with React-PDF

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS 4
- **UI Components:** Lucide Icons
- **Charts:** Recharts
- **PDF Generation:** @react-pdf/renderer
- **Drag & Drop:** @dnd-kit
- **Authentication:** JWT with jose
- **Password Hashing:** bcryptjs

## Prerequisites

### Option A: Docker (Recommended)
- Docker Engine 20.10+
- Docker Compose 2.0+

### Option B: Local Development
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## 🐳 Docker Deployment (Recommended)

BugFlow is fully containerized with Docker, making deployment consistent and simple across all environments.

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/alexinadev/BugFlow-NextJS.git
cd BugFlow-NextJS

# Create environment file
cp .env.example .env

# Start production containers
docker compose up -d

# View logs
docker compose logs -f app
```

That's it! The application will be available at [http://localhost:3000](http://localhost:3000).

### Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BugFlow Container Stack               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐       ┌──────────────────────────┐    │
│  │   bugflow    │       │     bugflow-db           │    │
│  │     app      │──────▶│     PostgreSQL 16        │    │
│  │  Next.js 16  │       │                          │    │
│  │   Port 3000  │       │     Port 5432            │    │
│  └──────────────┘       └──────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Production Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View app logs only
docker compose logs -f app

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Rebuild containers (after dependency changes)
docker compose up -d --build

# Check container status
docker compose ps

# Execute command inside container
docker compose exec app sh

# Access PostgreSQL CLI
docker compose exec db psql -U bugflow -d bugflow
```

### Development with Docker

For development with hot-reload support:

```bash
# Start development containers
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f app

# Stop development containers
docker compose -f docker-compose.dev.yml down
```

**Development features:**
- Hot-reload enabled (changes reflect immediately)
- Source code mounted as volume
- Separate database volume to not conflict with production

### Docker Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://bugflow:bugflow@db:5432/bugflow` | PostgreSQL connection string |
| `JWT_SECRET` | `change-this-secret-in-production` | JWT signing secret (CHANGE THIS!) |
| `NODE_ENV` | `production` | Environment mode |

### Docker Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | Persistent PostgreSQL data storage |

### Dockerfile Structure

The production Dockerfile uses a multi-stage build for optimal image size:

```
Stage 1: base        - Node.js Alpine setup
Stage 2: deps        - Install dependencies
Stage 3: builder     - Build the application
Stage 4: runner      - Production image (~200MB)
```

### Health Checks

The application includes built-in health checks:

- **App:** `GET /api/health` - Returns `{ "status": "ok" }`
- **Database:** PostgreSQL readiness check via `pg_isready`

### Troubleshooting Docker Issues

<details>
<summary>🔧 Common Docker Problems</summary>

#### Container won't start

```bash
# Check logs for errors
docker compose logs app

# Common fix: rebuild after dependency changes
docker compose up -d --build
```

#### Database connection failed

```bash
# Check if database is ready
docker compose exec db pg_isready -U bugflow

# Check database logs
docker compose logs db

# Restart the database
docker compose restart db
```

#### Permission issues

```bash
# Fix ownership (run as root)
docker compose exec app sh -c "chown -R nextjs:nodejs /app"
```

#### Reset everything

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Remove images
docker rmi bugflow-app bugflow-db

# Start fresh
docker compose up -d
```

</details>

---

## 📦 Local Installation (Alternative)

### 1. Clone the repository

```bash
git clone https://github.com/alexinadev/BugFlow-NextJS.git
cd BugFlow-NextJS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bugflow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with test users
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Yes |

## Test Accounts

After seeding the database, you can log in with these accounts:

| Role | Phone | Password |
|------|-------|----------|
| Admin | `09123456789` | `admin123` |
| User | `09987654321` | `user123` |

## Project Structure

```
bugflow/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard page
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── tickets/       # Ticket CRUD endpoints
│   │   ├── notifications/ # Notification endpoints
│   │   └── admin/         # Admin-only endpoints
│   ├── portal/            # User portal page
│   ├── status/            # Status tracking page
│   └── submit/            # Ticket submission page
├── components/
│   ├── admin/             # Admin dashboard components
│   ├── auth/              # Authentication components
│   ├── landing/           # Landing page components
│   ├── notifications/     # Notification components
│   ├── portal/            # User portal components
│   ├── shell/             # App shell (nav, layout)
│   ├── status/            # Status tracking components
│   └── tickets/           # Ticket submission components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database client
│   └── env-detection.ts   # Environment detection
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── types/
│   └── index.ts           # TypeScript type definitions
└── product-plan/          # Product documentation
```

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with phone and password |
| `/api/auth/logout` | POST | Logout current user |
| `/api/auth/me` | GET | Get current user info |

### Tickets

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tickets` | GET | Get user's tickets (or all for admin) |
| `/api/tickets` | POST | Create new ticket |
| `/api/tickets/[id]` | GET | Get single ticket |
| `/api/tickets/[id]` | PATCH | Update ticket (admin only) |
| `/api/tickets/[id]/history` | GET | Get ticket status history |
| `/api/tickets/bulk` | POST | Bulk update tickets (admin only) |

### Notifications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get user's notifications |
| `/api/notifications/[id]/read` | PATCH | Mark notification as read |
| `/api/notifications/read-all` | POST | Mark all notifications as read |

### Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | Get all admin users |

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/submit` | Submit new ticket | Yes (User) |
| `/status` | Track ticket status | Yes (User) |
| `/portal` | User dashboard | Yes (User) |
| `/admin` | Admin dashboard | Yes (Admin) |

## Database Schema

### Models

- **User** — User accounts with roles (USER, ADMIN)
- **Ticket** — Bug reports with status, severity, and assignment
- **Comment** — Ticket comments (internal and public)
- **Notification** — User notifications
- **StatusHistory** — Ticket status change history
- **NotificationSettings** — User notification preferences

### Ticket Statuses

| Status | Label | Description |
|--------|-------|-------------|
| `pending_verification` | Pending Review | Awaiting admin review |
| `open` | Open | Confirmed and awaiting action |
| `in_progress` | In Progress | Being worked on |
| `resolved` | Resolved | Issue fixed |
| `closed` | Closed | Ticket closed |

### Severity Levels

| Severity | Description |
|----------|-------------|
| `blocking` | System is unusable |
| `major` | Major feature broken |
| `minor` | Minor issue or workaround exists |
| `suggestion` | Enhancement suggestion |

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Database migrations
npx prisma migrate dev

# Database seeding
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/alexinadev/BugFlow-NextJS/issues) page.