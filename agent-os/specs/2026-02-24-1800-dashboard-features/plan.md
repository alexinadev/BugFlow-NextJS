# Phase 3: Dashboard Features Implementation Plan

**Phase Date**: February 24, 2026, ~18:00
**Status**: 🔵 PLANNING
**Estimated Duration**: 2-3 hours across multiple sub-phases
**Scope**: 15+ tasks across 4 sub-phases

## Overview

Phase 3 implements functional features in the dashboard shells created in Phase 2.2. This phase transforms placeholder layouts into fully operational interfaces with real data integration, user interactions, and role-specific workflows.

## Architecture Vision

```
Phase 3 Delivery Structure:
├─ Phase 3.1: AGENT Kanban Features (Wednesday evening)
│  ├─ Create Kanban board component
│  ├─ Integrate assigned tickets API
│  └─ Implement drag-to-update workflow
│
├─ Phase 3.2: ADMIN User Management (In Progress)
│  ├─ Create user data table component
│  ├─ Implement user CRUD forms
│  └─ Connect to user API
│
├─ Phase 3.3: ADMIN Settings & Audit (Next)
│  ├─ Create system settings form
│  ├─ Implement audit log viewer
│  └─ Connect to settings/audit APIs
│
└─ Phase 3.4: API Integration & Analytics (Final)
   ├─ Real metric calculations
   ├─ Performance optimization
   └─ Error handling & loading states
```

## Phase 3.1: AGENT Kanban Features ⭐ RECOMMENDED FIRST

**Target**: AGENT dashboard fully functional with Kanban board

### Task 1.1: Create KanbanBoard Component Structure
**Estimate**: 45 minutes
**Dependency**: Phase 2.2 (complete)

**Deliverable**: `components/admin/KanbanBoard.tsx`

**Requirements**:
- Display 4 columns: Open, In Progress, Pending Info, Resolved
- Each column shows ticket count badge
- Responsive layout (scrollable on mobile, side-by-side on desktop)
- Dark mode support
- Accessible column headers

**Structure**:
```tsx
interface KanbanBoardProps {
  tickets: Ticket[]
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => Promise<void>
  isLoading?: boolean
}

export function KanbanBoard({ tickets, onUpdateStatus, isLoading }: KanbanBoardProps) {
  // Group tickets by status
  const grouped = groupBy(tickets, 'status')
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* 4 columns */}
    </div>
  )
}
```

**Components Created**:
- `KanbanColumn` (child component showing single column)
- `TicketCard` (child component showing ticket in column)

---

### Task 1.2: Implement Ticket Cards with Status Badge
**Estimate**: 30 minutes
**Dependency**: Task 1.1

**Deliverable**: `components/admin/TicketCard.tsx` (enhance existing)

**Features**:
- Display ticket title, ID, priority/severity
- User who submitted ticket
- Date submitted
- Status color indicator
- Click to open detail modal
- Hover states for interactivity

**Implementation**:
```tsx
interface TicketCardProps {
  ticket: Ticket
  onSelect: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  return (
    <div 
      className="...card styling... hover:shadow-lg cursor-pointer"
      onClick={() => onSelect(ticket)}
    >
      <div className="font-semibold">{ticket.title}</div>
      <div className="text-sm text-slate-600">#{ticket.id}</div>
      <div className="flex justify-between mt-2">
        <span className="text-xs bg-severity-badge">{ticket.severity}</span>
        <span className="text-xs text-slate-500">{fromNow(ticket.createdAt)}</span>
      </div>
    </div>
  )
}
```

---

### Task 1.3: API Integration - Assigned Tickets Fetch
**Estimate**: 20 minutes
**Dependency**: Phase 1 (checkRole middleware complete)

**Deliverable**: `app/api/tickets/assigned/route.ts` (new endpoint)

**Endpoint**:
```typescript
GET /api/tickets/assigned
Header: Authorization: Bearer {token}

Response: {
  success: boolean
  tickets: Ticket[]
  count: number
}
```

**Backend Logic**:
1. `checkAuth()` — verify user is logged in
2. Filter tickets where `assignedTo` includes current user
3. Return with proper pagination
4. Handle AGENT vs MANAGER/ADMIN (MANAGER/ADMIN can filter by agent)

**Implementation Pattern** (existing from Phase 1):
```typescript
import { checkRole } from '@/lib/rbac'

export async function GET(request: Request) {
  const user = await checkRole('AGENT', 'MANAGER', 'ADMIN')
  
  // Query database for assigned tickets
  const tickets = await db.ticket.findMany({
    where: {
      assignedTo: {
        hasSome: [user.id]
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return Response.json({ success: true, tickets, count: tickets.length })
}
```

---

### Task 1.4: Kanban Update Status Endpoint
**Estimate**: 20 minutes
**Dependency**: Task 1.3, Phase 1

**Deliverable**: `app/api/tickets/[id]/status/route.ts` (new endpoint)

**Endpoint**:
```typescript
PATCH /api/tickets/{ticketId}/status
Body: { status: TicketStatus }
Header: Authorization: Bearer {token}

Response: {
  success: boolean
  ticket: Ticket
  message: string
}
```

**Business Logic**:
1. Verify user is AGENT and ticket is assigned to them (or MANAGER/ADMIN)
2. Validate new status is valid transition
3. Update ticket status
4. Create status change event for audit
5. Return updated ticket

**Validation Rules**:
- Open → In Progress, Resolved
- In Progress → Pending Info, Resolved
- Pending Info → In Progress, Resolved
- Resolved → (terminal state)

---

### Task 1.5: Wire Kanban to AGENT Dashboard
**Estimate**: 25 minutes
**Dependency**: Tasks 1.1-1.4

**Changes**: `app/admin/agent/page.tsx`

**Implementation**:
```tsx
export default function AgentDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignedTickets()
  }, [])

  const fetchAssignedTickets = async () => {
    const response = await fetch('/api/tickets/assigned')
    const data = await response.json()
    setTickets(data.tickets)
  }

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Update local state
        setTickets(prev => 
          prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
        )
        // Show success toast
      }
    } catch (error) {
      // Show error toast
    }
  }

  return (
    <IfRole allowed={['AGENT', 'MANAGER', 'ADMIN']}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Queue</h1>
          <p className="text-slate-600 mt-2">{user?.name} • {tickets.length} assigned tickets</p>
        </div>

        {/* Kanban board */}
        <KanbanBoard 
          tickets={tickets}
          onUpdateStatus={handleStatusChange}
          isLoading={loading}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {/* Real stat counts from groupBy(tickets, 'status') */}
        </div>
      </div>
    </IfRole>
  )
}
```

---

## Phase 3.2: ADMIN User Management ⭐ PRIORITY 2

**Target**: ADMIN dashboard with full user management

### Task 2.1: Create User Data Table Component
**Estimate**: 45 minutes
**Dependency**: Phase 2.2

**Deliverable**: `components/admin/UserManagementTable.tsx`

**Features**:
- Table display of all users
- Columns: Name, Email, Role, Department, Created Date, Actions
- Sortable columns (name, created date)
- Filter by role (dropdown)
- Action buttons: Edit, Disable, Delete
- Pagination (if many users)
- Loading states
- Empty state

**Table Structure**:
```tsx
interface UserManagementTableProps {
  users: User[]
  isLoading: boolean
  onEditUser: (user: User) => void
  onDisableUser: (userId: string) => Promise<void>
  onDeleteUser: (userId: string) => Promise<void>
}

export function UserManagementTable({ users, isLoading, ...handlers }: UserManagementTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-slate-700">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Department</th>
            <th className="text-left p-3">Created</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-700">
              {/* Cells */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

### Task 2.2: Create User Edit/Create Modal
**Estimate**: 40 minutes
**Dependency**: Task 2.1

**Deliverable**: `components/admin/UserFormModal.tsx`

**Features**:
- Modal form for create/edit user
- Fields: Name, Email, Role (select), Department (text)
- Form validation
- Error messages
- Save/Cancel buttons
- Success confirmation

**Form Fields**:
```tsx
interface UserFormData {
  name: string
  email: string
  role: Role
  department?: string
}

// Validation Rules:
// - name: required, min 2 chars
// - email: required, valid email format
// - role: required, one of Role enum
// - department: optional, max 50 chars
```

---

### Task 2.3: Users API Endpoints
**Estimate**: 40 minutes
**Dependency**: Phase 1

**Deliverables**:
- `app/api/admin/users/route.ts` (GET all users, POST create user)
- `app/api/admin/users/[id]/route.ts` (GET one user, PATCH update, DELETE)

**Endpoints**:
```typescript
// GET /api/admin/users
// Returns: { success, users[], total }

// POST /api/admin/users
// Body: { name, email, role, department }
// Returns: { success, user }

// GET /api/admin/users/[id]
// Returns: { success, user }

// PATCH /api/admin/users/[id]
// Body: { name?, email?, role?, department?, isEnabled? }
// Returns: { success, user }

// DELETE /api/admin/users/[id]
// Returns: { success, message }
```

**Backend Logic**:
- All endpoints: `checkRole('ADMIN')` — admin-only access
- GET: Return all users with role-appropriate fields
- POST: Create new user, hash password, send invite email
- PATCH: Update user details, validate email uniqueness
- DELETE: Soft delete (mark as disabled) rather than hard delete for audit trail

---

### Task 2.4: Wire User Management to ADMIN Dashboard
**Estimate**: 30 minutes
**Dependency**: Tasks 2.1-2.3

**Changes**: `app/admin/system/page.tsx`

**Implementation**:
- Replace "User Management" button with actual UserManagementTable
- Add modal state for create/edit forms
- Fetch users on component mount
- Handle create, edit, delete actions
- Show success/error toasts

---

## Phase 3.3: ADMIN Settings & Audit Logs

**Target**: System settings form and audit log viewer

### Task 3.1: System Settings Form
**Estimate**: 35 minutes
**Dependency**: Phase 2.2

**Deliverable**: `components/admin/SystemSettingsForm.tsx`

**Settings to Configure**:
- Ticket auto-assignment enabled/disabled
- SLA response time (hours)
- Notification email recipients
- System maintenance mode (boolean)
- Max attachment size (MB)
- Default ticket priority

**Form Implementation**:
```tsx
interface SystemSettings {
  autoAssignmentEnabled: boolean
  slaResponseHours: number
  notificationEmails: string[]
  maintenanceMode: boolean
  maxAttachmentSizeMB: number
  defaultPriority: 'low' | 'medium' | 'high' | 'critical'
}
```

---

### Task 3.2: Settings API Endpoints
**Estimate**: 20 minutes
**Dependency**: Phase 1

**Endpoints**:
- `GET /api/admin/settings` — Get all settings
- `PATCH /api/admin/settings` — Update settings

---

### Task 3.3: Audit Log Viewer Component
**Estimate**: 40 minutes
**Dependency**: Phase 1

**Deliverable**: `components/admin/AuditLogViewer.tsx`

**Features**:
- Timeline view of system events
- Filter by event type (user created, ticket updated, settings changed, etc.)
- Filter by date range
- Filter by user who made change
- Pagination
- Search by event details
- Sortable by date (newest first)

**Audit Events to Track**:
- User created/updated/deleted
- Ticket created/updated/status changed
- Comment added (especially internal comments)
- Attachment uploaded
- Settings modified
- Role changed

---

### Task 3.4: Audit Log API
**Estimate**: 30 minutes
**Dependency**: Phase 1

**Endpoint**: `GET /api/admin/audit-logs`

**Query Parameters**:
- `type` (filter by event type)
- `userId` (filter by who made change)
- `startDate`, `endDate` (date range)
- `page`, `limit` (pagination)

---

## Phase 3.4: API Integration & Analytics

**Target**: Real-time metrics and performance optimization

### Task 4.1: Real Metric Calculations
**Estimate**: 25 minutes

**Metrics to Calculate**:
- Total users by role breakdown
- Active sessions count
- Database size
- Ticket statistics (total, by status, by severity)
- Average response time
- SLA compliance percentage

**Implementation Location**: New file `lib/analytics.ts`

### Task 4.2: Real-Time Dashboard Stats
**Estimate**: 30 minutes

**Deliverable**: Update all dashboard stat cards with real data

**Changes**:
- AGENT dashboard: Actual ticket counts per status
- ADMIN dashboard: Total users, sessions, DB metrics
- Manager dashboard: Ticket breakdown stats

---

### Task 4.3: Error Handling & Loading States
**Estimate**: 20 minutes

**Add to All Dashboards**:
- Loading skeletons for tables/boards
- Error boundaries
- Retry logic for failed API calls
- Empty state messages
- Timeout handling

---

### Task 4.4: Performance Optimization
**Estimate**: 25 minutes

**Optimizations**:
- Pagination for user table (25-50 items per page)
- Pagination for audit logs (50-100 items per page)
- API response caching (React Query or SWR)
- Lazy loading for modals/forms
- Debouncing for search/filter inputs

---

## Sub-Phase Execution Order

### 📋 Recommended Sequence

**Session 1 (Tonight)**: Phase 3.1 — AGENT Kanban
- 2-2.5 hours
- Makes AGENT dashboard fully functional
- Good foundation for understanding patterns

**Session 2**: Phase 3.2 — ADMIN User Management
- 2-2.5 hours  
- Completes core admin functionality
- Reusable table/form patterns

**Session 3**: Phase 3.3 — Settings & Audit
- 1.5-2 hours
- Final admin features
- Audit trail complete

**Session 4**: Phase 3.4 — Integration & Analytics
- 1-1.5 hours
- Real data throughout
- Performance polish

---

## Task Tracking Matrix

### Phase 3.1: AGENT Kanban (5 tasks)
- [ ] 1.1 — KanbanBoard component structure (45 min)
- [ ] 1.2 — Ticket cards with styling (30 min)
- [ ] 1.3 — API endpoint: GET /api/tickets/assigned (20 min)
- [ ] 1.4 — API endpoint: PATCH /api/tickets/[id]/status (20 min)
- [ ] 1.5 — Wire Kanban to dashboard (25 min)
**Total**: 140 minutes (2h 20min)

### Phase 3.2: User Management (4 tasks)
- [ ] 2.1 — UserManagementTable component (45 min)
- [ ] 2.2 — UserFormModal component (40 min)
- [ ] 2.3 — User API endpoints (40 min)
- [ ] 2.4 — Wire to admin dashboard (30 min)
**Total**: 155 minutes (2h 35min)

### Phase 3.3: Settings & Audit (4 tasks)
- [ ] 3.1 — SystemSettingsForm component (35 min)
- [ ] 3.2 — Settings API endpoints (20 min)
- [ ] 3.3 — AuditLogViewer component (40 min)
- [ ] 3.4 — Audit API endpoint (30 min)
**Total**: 125 minutes (2h 5min)

### Phase 3.4: Integration & Analytics (4 tasks)
- [ ] 4.1 — Real metric calculations (25 min)
- [ ] 4.2 — Dashboard stat updates (30 min)
- [ ] 4.3 — Error handling & loading states (20 min)
- [ ] 4.4 — Performance optimization (25 min)
**Total**: 100 minutes (1h 40min)

---

## Type Safety Across Phase 3

**Key Types to Use** (from `types/index.ts`):
```typescript
export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  severity: Severity
  assignedTo: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  // ...
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
  department?: string
  isEnabled: boolean
  createdAt: Date
  // ...
}

export type TicketStatus = 'open' | 'in_progress' | 'pending_info' | 'resolved'
export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type Role = 'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'
```

---

## Standards to Maintain

✅ **From Phases 1-2.2**:
- Client component pattern (`'use client'`)
- Auth context pattern (`useAuth()`)
- RBAC at API layer (`checkRole()`)
- Conditional rendering (`IfRole`)
- Type safety (TypeScript strict)
- Dark mode support
- Tailwind CSS styling
- Centralized configuration

---

## Success Criteria

By end of Phase 3.4:
- ✅ AGENT can view assigned tickets in Kanban board
- ✅ AGENT can drag/update ticket status
- ✅ ADMIN can view all users in table
- ✅ ADMIN can create/edit/delete users
- ✅ ADMIN can configure system settings
- ✅ ADMIN can view audit logs with filtering
- ✅ All dashboards show real data with live counts
- ✅ Error states and loading states functional
- ✅ Performance optimized (pagination, caching)
- ✅ Full TypeScript type safety

---

## Next Steps

**Recommendation**: Proceed with **Phase 3.1: AGENT Kanban Features**

This sub-phase:
1. Makes immediate visible impact (working Kanban)
2. Teaches patterns for other components
3. Sets up API structure for Phase 3.2+
4. Takes ~2.5 hours to complete fully

**Proceed?** (Yes/No or specify which sub-phase to start with)
