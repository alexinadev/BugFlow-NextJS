# Phase 2.2: Dashboard Shells — Code References & Examples

**Purpose**: Document patterns, components, and code examples used in Phase 2.2 implementation

## Component Examples

### Dashboard Shell Template

All dashboard pages follow this consistent template:

#### Full Example: AGENT Dashboard
**File**: `app/admin/agent/page.tsx`

```tsx
'use client'

import { useAuth } from '@/components/auth'
import { IfRole } from '@/lib/ui-helpers'

/**
 * AGENT Dashboard - Assigned Ticket Management
 * 
 * Accessible to:
 * - AGENT users (see own assigned tickets)
 * - MANAGER users (oversee agent queue)
 * - ADMIN users (audit mode)
 */
export default function AgentDashboard() {
  const { user, loading } = useAuth()

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  // Role-based rendering with fallback
  return (
    <IfRole
      role={user?.role}
      allowed={['AGENT', 'MANAGER', 'ADMIN']}
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              You don't have permission to view this dashboard.
            </p>
          </div>
        </div>
      }
    >
      {/* Dashboard content here */}
    </IfRole>
  )
}
```

---

## Reused Components & Hooks

### 1. useAuth() Hook

**Source**: `components/auth/AuthProvider.tsx`
**Purpose**: Provides authentication state and user info
**Returns**:
```typescript
{
  user: AuthUser | null
  permissions: string[]
  loading: boolean
  login(): Promise<void>
  logout(): Promise<void>
  refreshUser(): Promise<void>
}
```

**Usage in Dashboard**:
```tsx
const { user, loading } = useAuth()

if (loading) return <Spinner />
if (!user) return <AuthRequired />

return <Dashboard user={user} />
```

---

### 2. IfRole Component

**Source**: `lib/ui-helpers.ts`
**Purpose**: Conditional rendering based on user role
**Props**:
```typescript
interface IfRoleProps {
  role?: Role                    // Current user role
  allowed: Role | Role[]         // Allowed role(s)
  children: React.ReactNode      // Render if authorized
  fallback?: React.ReactNode     // Render if denied (optional)
}
```

**Usage**:
```tsx
// Single role
<IfRole role={user?.role} allowed="ADMIN">
  <AdminPanel />
</IfRole>

// Multiple roles
<IfRole role={user?.role} allowed={['MANAGER', 'ADMIN']}>
  <LinkAnalytics />
</IfRole>

// With fallback
<IfRole
  role={user?.role}
  allowed={['AGENT', 'MANAGER', 'ADMIN']}
  fallback={<AccessDenied />}
>
  <AgentContent />
</IfRole>
```

---

### 3. RoleBadge Component

**Source**: `lib/ui-helpers.ts`
**Purpose**: Display user's role with color coding
**Usage**:
```tsx
<RoleBadge role={user.role} />
// Renders: "IT Support" in blue for AGENT, "Manager" in purple, etc.
```

---

## Type Definitions

### AuthUser Type

**Source**: `types/index.ts`
```typescript
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  department?: string
  createdAt: Date
}
```

### Role Type

**Source**: `types/index.ts`
```typescript
export type Role = 'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'
```

### RolePermissions Interface

**Source**: `types/index.ts`
```typescript
export interface RolePermissions {
  role: Role
  permissions: string[]
}
```

---

## Styling Patterns

### Container & Layout

```tsx
<div className="container mx-auto px-4 py-8">
  {/* Full-width container, centered, with padding */}
</div>
```

### Header Section

```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
    Dashboard Title
  </h1>
  <p className="text-slate-600 dark:text-slate-400 mt-2">
    Subtitle or description
  </p>
</div>
```

### Card Component

```tsx
<div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
    Card Title
  </h2>
  <p className="text-slate-600 dark:text-slate-400 mb-4">
    Card content
  </p>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    Action Button
  </button>
</div>
```

### Grid Layout (Responsive)

```tsx
{/* 2 columns on mobile, 4 on desktop */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Grid items */}
</div>

{/* 1 column on mobile, 2 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Grid items */}
</div>
```

### Metric Card

```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">42</div>
  <div className="text-sm text-blue-800 dark:text-blue-300">Metric Label</div>
</div>
```

### Dark Mode Text

```tsx
{/* Light: dark gray, Dark: light gray */}
<p className="text-slate-600 dark:text-slate-400">Secondary text</p>

{/* Light: black, Dark: white */}
<h1 className="text-slate-900 dark:text-white">Primary text</h1>
```

---

## Access Control Patterns

### Role Array Check (Alternative to IfRole)

```tsx
// When not using IfRole component
if (!user || !['MANAGER', 'ADMIN'].includes(user.role)) {
  return <AccessDenied />
}

return <Dashboard />
```

### Built-in Role Checks (lib/route-guards.ts)

**Available Functions**:
- `canAccessRoute(userRole, allowedRoles)` → boolean
- `hasPermission(permissions, required)` → boolean
- `getDefaultDashboard(role)` → string (route)
- `isProtectedRoute(pathname)` → boolean
- `getAllowedRoles(pathname)` → Role[] | undefined

**Usage**:
```tsx
import { canAccessRoute, getDefaultDashboard } from '@/lib/route-guards'

if (!canAccessRoute(user.role, ['MANAGER', 'ADMIN'])) {
  router.push(getDefaultDashboard(user.role))
}
```

---

## API Integration Patterns (Phase 3)

### Fetch Tickets Example

```tsx
const fetchTickets = useCallback(async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/tickets')
    const data = await response.json()
    
    if (data.success) {
      setTickets(data.tickets)
    } else {
      setError(data.error)
    }
  } catch (error) {
    setError('Failed to fetch tickets')
  } finally {
    setLoading(false)
  }
}, [])
```

### Protected API Endpoint Pattern

**Existing Pattern** (from Phase 1):
```typescript
// app/api/tickets/[id]/assign/route.ts
export async function POST(request: Request) {
  const user = await checkRole('MANAGER', 'ADMIN')
  
  const { ticketId, agentId } = await request.json()
  
  // Perform assignment
  
  return Response.json({ success: true })
}
```

**Used by Dashboard**: Dashboards call these endpoints for mutations

---

## Existing Components Available for Phase 3

### AdminDashboard Component

**Source**: `components/admin/AdminDashboard.tsx`
**Purpose**: Shared dashboard for MANAGER and ADMIN
**Features**:
- Ticket list display
- Filtering by status, severity, assigned
- Bulk actions (reassign, status update)
- CSV export
- Pagination (if needed)

**Props**:
```typescript
interface AdminDashboardProps {
  tickets: Ticket[]
  admins: { id: string; name: string }[]
  isLoading: boolean
  onRefresh: () => Promise<void>
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>
  onBulkUpdate: (ids: string[], updates: Partial<Ticket>) => Promise<void>
  onExport: (ids: string[]) => void
}
```

**Usage in `/admin` page** (already implemented):
```tsx
return (
  <AdminDashboard
    tickets={tickets}
    admins={admins}
    isLoading={isLoading}
    onRefresh={fetchData}
    onUpdateTicket={handleUpdateTicket}
    onBulkUpdate={handleBulkUpdate}
    onExport={handleExport}
  />
)
```

### UserPortalDashboard Component

**Source**: `components/portal/UserPortalDashboard.tsx`
**Purpose**: Personal ticket dashboard for users
**Features**:
- User submitted tickets list
- Status tracking
- Submission form access
- Ticket details view

**Props**:
```typescript
interface UserPortalDashboardProps {
  tickets: Ticket[]
  isLoading: boolean
  onRefresh: () => Promise<void>
  onViewTicket: (id: string) => void
}
```

### KanbanBoard Component

**Source**: `components/admin/KanbanBoard.tsx`
**Purpose**: Kanban column visualization
**Features**:
- Multiple columns (configurable)
- Drag-and-drop (if needed)
- Ticket cards
- Status updates

**Available for Integration**: AGENT dashboard Kanban implementation

---

## Database Schema References

### Role Enum
```prisma
enum Role {
  USER
  AGENT
  MANAGER
  ADMIN
}
```

### User Model Fields
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  department String?  // New field for IT staff
  // ... other fields
}
```

### Permission Mapping (lib/rbac.ts)

USER permissions:
- "submit_ticket", "view_own_tickets", "update_own_ticket", "delete_own_ticket", 
- "view_ticket_status", "add_comment", "upload_attachment", "view_attachments",
- "rate_support", "view_faq", "search_tickets", "export_own_tickets"

AGENT permissions (extends USER):
- All USER permissions +
- "view_assigned_tickets", "update_ticket_status", "assign_ticket", "view_all_attachments",
- "add_internal_comment", "escalate_ticket"

MANAGER permissions (extends AGENT):
- All AGENT permissions +
- "view_all_tickets", "filter_tickets_advanced", "bulk_update_tickets", "export_tickets",
- "analyze_tickets", "manage_agents"

ADMIN permissions:
- All MANAGER permissions +
- "manage_users", "configure_system", "view_audit_logs", "manage_roles", "view_system_health"

---

## Common Errors & Solutions

### TypeScript Error: "Role not assignable"
**Cause**: Using string literal instead of Role type
**Solution**: Import and use Role type from `types/index.ts`
```tsx
// ❌ Wrong
allowed={['ADMIN']}

// ✅ Correct
allowed={['ADMIN'] as Role[]}

// ✅ Best (array of specific roles)
allowed={['AGENT', 'MANAGER', 'ADMIN']}
```

### Component Not Rendering
**Check Checklist**:
1. Is `'use client'` at top of file?
2. Is `useAuth()` called inside component?
3. Is `IfRole` receiving correct `role` prop?
4. Is role in `allowed` array?
5. Is loading state handled?

### Dark Mode Not Applied
**Cause**: Missing `dark:` prefix on color classes
**Example**:
```tsx
// ❌ Goes white on dark theme
<div className="bg-white">

// ✅ Adapts to theme
<div className="bg-white dark:bg-slate-800">
```

---

## Summary

Phase 2.2 implementations use existing patterns and components from Phases 1-2.1, introducing no new architecture patterns. All code adheres to established standards and uses centralized helpers for consistency.

**Ready for Phase 3**: All dashboards are scaffolded and ready for feature components and API integration.
