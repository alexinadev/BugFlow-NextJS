# Phase 3: Dashboard Features — Architecture & Design Decisions

**Created**: February 24, 2026, ~18:15
**Status**: Architecture Planning Complete

## Vision: Feature-Complete Role-Specific Dashboards

**Goal**: Transform Phase 2.2 dashboard shells into fully functional, data-driven interfaces with complete CRUD operations for each role.

**Success Outcome**: 
- AGENT has productive work interface (Kanban board)
- MANAGER has full ticket oversight and assignment
- ADMIN has complete system control (users, settings, audit)
- USER has personal ticket tracking (already done)

---

## Key Architectural Decisions

### Decision 1: Real-Time Data vs Cached

**Question**: Should dashboards update in real-time or use cached data refreshed on-demand?

**Chosen**: **Cached data with manual refresh buttons**

**Rationale**:
- Real-time updates add complexity (WebSockets, subscriptions)
- Manual refresh is simpler first implementation
- Can add real-time in Phase 4+ enhancement
- Works well for typical dashboard usage patterns
- Better for performance and server load

**Implementation**:
```tsx
const [tickets, setTickets] = useState<Ticket[]>([])

const refreshTickets = async () => {
  const response = await fetch('/api/tickets/assigned')
  const data = await response.json()
  setTickets(data.tickets)
}

useEffect(() => {
  refreshTickets()  // Initial load
}, [])

// Manual refresh via button
<button onClick={refreshTickets}>Refresh</button>
```

---

### Decision 2: Pagination vs Load-All

**Question**: For user table and audit logs, fetch all or paginate?

**Chosen**: **Paginate from start (25-50 items initially)**

**Rationale**:
- User tables can grow very large
- Paginating prevents performance issues early
- Better UX on initial load (faster rendering)
- Can implement infinite scroll later if preferred

**Implementation**:
```tsx
const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(25)

const fetchUsers = async (pageNum: number) => {
  const response = await fetch(`/api/admin/users?page=${pageNum}&limit=${pageSize}`)
  const data = await response.json()
  setUsers(data.users)
  setTotalCount(data.total)
}
```

---

### Decision 3: Drag-Drop vs Status Dropdown Buttons

**Question**: For AGENT Kanban, use native drag-drop or buttons?

**Chosen**: **Status dropdown buttons initially, drag-drop as enhancement**

**Rationale**:
- Native drag-drop works well on desktop but not mobile
- Dropdown buttons work universally
- Dropdown is faster to implement
- Can add drag-drop as Phase 4 enhancement
- Ensures accessibility for all users

**Implementation**:
```tsx
<div className="...ticket card...">
  <div className="...ticket details..."></div>
  <select 
    value={ticket.status}
    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
  >
    <option value="open">Open</option>
    <option value="in_progress">In Progress</option>
    <option value="pending_info">Pending Info</option>
    <option value="resolved">Resolved</option>
  </select>
</div>
```

**Enhancement Path**: Add react-beautiful-dnd or similar in Phase 4

---

### Decision 4: Form Validation Strategy

**Question**: Client-side validation, server-side, or both?

**Chosen**: **Both (client-side for UX, server-side for security)**

**Rationale**:
- Client validation provides instant feedback
- Server validation is security requirement
- Both together gives best UX + security
- Prevents bad data from reaching database

**Implementation**:
```tsx
// Client-side (zod validation)
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
})

// Server-side (Prisma validation + business logic)
export async function POST(request: Request) {
  const user = await checkRole('ADMIN')
  
  const body = await request.json()
  const validation = UserSchema.safeParse(body)
  
  if (!validation.success) {
    return Response.json({ 
      success: false, 
      errors: validation.error.flatten() 
    }, { status: 400 })
  }
  
  // Continue with create...
}
```

---

### Decision 5: Error Handling Approach

**Question**: How to handle API errors gracefully?

**Chosen**: **Toast notifications + error boundaries**

**Rationale**:
- Toast notifications (react-hot-toast or similar) inform user immediately
- Error boundaries catch React component errors
- Retry logic for failed API calls
- Users don't lose context when failure occurs

**Patterns**:
```tsx
// Toast for API errors
const handleDelete = async (userId: string) => {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const error = await response.json()
      toast.error(error.message || 'Failed to delete user')
      return
    }
    
    toast.success('User deleted successfully')
    // Refresh list
  } catch (error) {
    toast.error('Network error - please try again')
  }
}

// Error boundary for component crashes
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardContent />
</ErrorBoundary>
```

---

### Decision 6: Role Visibility in Admin Dashboards

**Question**: Should ADMIN be able to edit other ADMIN users or MANAGER users?

**Chosen**: **Yes, ADMIN can edit any user including other ADMINs**

**Rationale**:
- ADMIN is highest privilege level
- Need ability to manage team members at all levels
- Prevents "locked out admin" situations
- Trust model: if they're ADMIN, they can manage system

**Security Safeguard**:
```typescript
// ADMIN cannot disable their own account through self-action
if (userIdToDisable === currentUser.id && currentUser.role === 'ADMIN') {
  throw new Error('Cannot disable your own admin account')
}
```

---

### Decision 7: Audit Log Depth

**Question**: Track all changes or only significant ones?

**Chosen**: **All changes (detailed audit trail)**

**Rationale**:
- Compliance/legal reasons require detailed records
- Better for debugging issues
- Can summarize in UI if too much detail
- Storage cost reasonable for typical usage

**Events to Track**:
- User created/updated/deleted
- Ticket created/updated/status changed
- Ticket assigned/reassigned
- Comment added/edited/deleted
- Attachment uploaded/deleted
- Internal notes added
- Settings changed
- Bulk operations executed

---

### Decision 8: Component Reusability

**Question**: Create generic components or specialized dashboard components?

**Chosen**: **Generic reusable components (DataTable, Modal, Form)**

**Rationale**:
- DataTable works for users, audit logs, tickets
- Modal works for create/edit forms, details
- Form inputs reusable across many forms
- Reduces code duplication
- Easier to maintain consistent styling/behavior

**Planned Generic Components**:
- `<DataTable>` — Any table display
- `<Modal>` — Any modal dialog
- `<FormField>` — Input field with validation
- `<StatusBadge>` — Role/status display
- `<ConfirmDialog>` — Confirmation modal

---

### Decision 9: Responsive Design Approach

**Question**: Mobile-first responsive or desktop-optimized?

**Chosen**: **Mobile-friendly (tables collapse to cards on mobile)**

**Rationale**:
- Support mobile access for on-the-go users
- Tables scroll horizontally on mobile is poor UX
- Card layout is readable on small screens
- Both desktop and mobile well-supported

**Implementation**:
```tsx
// Desktop: Table
// Mobile: Card list with expandable details
<div className="hidden md:block">
  <table>{/* Desktop table */}</table>
</div>

<div className="md:hidden">
  <div className="space-y-2">
    {/* Card list for mobile */}
  </div>
</div>
```

---

### Decision 10: Real-Time Metric Calculation

**Question**: Calculate metrics in frontend or fetch from backend?

**Chosen**: **Fetch from backend API endpoint**

**Rationale**:
- More accurate (calculations on real data)
- Lighter frontend logic
- Can cache on backend for performance
- Some metrics require DB queries (sum, count, etc.)

**Implementation**:
```typescript
// Backend endpoint
GET /api/admin/dashboard/metrics

Response: {
  totalUsers: 42,
  totalTickets: 156,
  openTickets: 23,
  resolvedTickets: 133,
  avgResponseTime: 2.5,
  slaCompliance: 94.2,
  activeAgents: 5,
  dbSizeMB: 125
}

// Frontend usage
const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

useEffect(() => {
  const fetchMetrics = async () => {
    const response = await fetch('/api/admin/dashboard/metrics')
    const data = await response.json()
    setMetrics(data)
  }
  
  fetchMetrics()
}, [])
```

---

## Component Hierarchy Design

### AGENT Dashboard Architecture

```
AgentDashboard (page.tsx)
├─ useAuth() hook
├─ useState for tickets
├─ fetch /api/tickets/assigned
└─ KanbanBoard component
   ├─ KanbanColumn (4 instances)
   │  ├─ Column header + count badge
   │  └─ TicketCard[] (mapped from tickets)
   │     ├─ Ticket details display
   │     ├─ Priority/severity badge
   │     └─ Status dropdown
   └─ StatGrid (metric cards)
      ├─ MetricCard (4 instances)
      └─ Values from grouped(tickets, 'status')
```

### ADMIN Dashboard Architecture

```
AdminSystemDashboard (page.tsx)
├─ useAuth() hook (admin-only)
└─ Tabs/Sections
   ├─ User Management Tab
   │  ├─ UserManagementTable
   │  │  ├─ DataTable (generic)
   │  │  └─ Action buttons (Edit, Delete)
   │  └─ UserFormModal
   │     ├─ FormField components
   │     └─ Validation + submit
   │
   ├─ Settings Tab
   │  └─ SystemSettingsForm
   │     ├─ FormField[] (for each setting)
   │     └─ Submit/Reset buttons
   │
   ├─ Audit Logs Tab
   │  └─ AuditLogViewer
   │     ├─ Filter section
   │     ├─ DataTable (generic)
   │     └─ Pagination controls
   │
   └─ System Health Tab
      └─ HealthMonitor
         ├─ Real metrics display
         └─ Status indicators
```

---

## Data Flow Patterns

### Create User Flow
```
1. Click "Add User" button
2. UserFormModal opens (empty form)
3. User fills form (name, email, role)
4. Client validates (zod schema)
5. Submit button → POST /api/admin/users
6. Server validates + creates
7. Success toast → Refresh user list
8. Modal closes
```

### Update Ticket Status Flow (Kanban)
```
1. User selects new status from dropdown
2. handleStatusChange() called
3. Check if transition is valid
4. PATCH /api/tickets/{id}/status sent
5. Optimistic UI update (show new status immediately)
6. Server confirms
7. Refresh /api/tickets/assigned
8. Update state
9. Toast confirmation
```

### View User Details Flow
```
1. Click user row in table
2. UserDetailModal opens
3. Modal shows full user info
4. Edit and Delete buttons available
5. Click Edit → UserFormModal with pre-filled data
6. Make changes → PATCH /api/admin/users/{id}
7. Refresh table on save
```

---

## Performance Considerations

### Optimizations

**1. API Response Caching**
- Use React Query (recommended) or SWR
- Cache user list for 5 minutes
- Cache ticket data for 2 minutes
- Cache settings for 10 minutes
- Manual invalidation on mutations

**2. Pagination**
- User table: 25 items per page
- Audit logs: 50 items per page
- Load next page on demand

**3. Lazy Loading**
- Load modals/forms only when opened
- Don't fetch detailed user data until clicked

**4. Debouncing**
- Search input: 500ms debounce
- Filter dropdowns: Immediate
- Number inputs: 300ms debounce

---

## Type Safety Architecture

**Single Source of Truth**: `types/index.ts`

**Type Tree**:
```typescript
AuthUser
├─ id, email, name, role (required)
├─ department (optional)
└─ createdAt, updatedAt

Ticket
├─ id, title, description
├─ status: TicketStatus
├─ severity: Severity
├─ assignedTo: string[]
├─ createdBy, createdAt, updatedAt
└─ comments, attachments

User
├─ id, email, name
├─ role: Role
├─ department (optional)
├─ isEnabled: boolean
└─ createdAt, updatedAt

TicketStatus = 'open' | 'in_progress' | 'pending_info' | 'resolved'
Severity = 'low' | 'medium' | 'high' | 'critical'
Role = 'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'
```

---

## Integration with Phase 1-2 Infrastructure

**Leveraging Existing Systems**:

1. **RBAC** (Phase 1)
   - `checkRole('ADMIN')` for admin endpoints
   - Role-based API access control

2. **Auth Context** (Phase 1)
   - `useAuth()` for current user info
   - Permission checking

3. **Route Guards** (Phase 2.1)
   - `IfRole` for component rendering
   - Route access matrix

4. **UI Helpers** (Phase 2.1)
   - `RoleBadge` for role display
   - Dark mode utilities
   - Styling helpers

---

## Risk Mitigation

### Risk 1: Long API Calls Block UI
**Mitigation**: Loading skeletons, optimistic updates, timeouts

### Risk 2: Large Data Sets Cause Performance Issues
**Mitigation**: Pagination from start, lazy loading, caching

### Risk 3: Concurrent Updates Cause Conflicts
**Mitigation**: Optimistic locking, server-side conflict resolution, refresh after mutation

### Risk 4: Type Mismatches Between Frontend/Backend
**Mitigation**: Strict TypeScript, API response validation (zod), dedicated types file

---

## Testing Strategy (Phase 4)

**Unit Tests**:
- Component rendering with different props
- Form validation logic
- Permission checks

**Integration Tests**:
- Full create user flow
- Update ticket status flow
- Filter/search functionality

**E2E Tests**:
- AGENT creates, updates, resolves ticket
- ADMIN creates user and assigns to AGENT
- MANAGER views team queue

---

## Monitoring & Observability (Phase 4+)

**What to Track**:
- API endpoint response times
- Error rates by endpoint
- User action frequency (most used features)
- Performance metrics (page load time, TTI)

---

## Summary

**Phase 3 Architecture Principles**:
1. ✅ Cached data with manual refresh (not real-time yet)
2. ✅ Paginated data (not load-all)
3. ✅ Button-based status updates (not drag-drop initially)
4. ✅ Client + server validation
5. ✅ Toast notifications for feedback
6. ✅ ADMIN has full system control
7. ✅ Detailed audit trail
8. ✅ Generic, reusable components
9. ✅ Mobile-responsive design
10. ✅ Backend metric calculation

**Ready for Implementation**: Phase 3.1 (AGENT Kanban)
