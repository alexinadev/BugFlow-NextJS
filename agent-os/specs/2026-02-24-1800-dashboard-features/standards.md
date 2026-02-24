# Phase 3: Dashboard Features — Standards & Compliance

**Specification Date**: February 24, 2026
**Standards Maintained From**: Phases 1, 2.1, 2.2

## Applying Existing Standards to Features

### Phase 1 Standards (Backend RBAC)

#### 1. Backend RBAC Pattern
**Standard**: `backend/role-based-access`

**Application in Phase 3**:
```typescript
// Task 1.3: GET /api/tickets/assigned
export async function GET(request: Request) {
  const user = await checkRole('AGENT', 'MANAGER', 'ADMIN')
  // AGENT sees own assigned tickets
  // MANAGER sees all tickets
  // ADMIN sees all tickets
}

// Task 3.2: Settings API
export async function PATCH(request: Request) {
  const user = await checkRole('ADMIN')  // Admin-only
  // Update system settings
}
```

**Pattern**: `checkRole()` at start of every protected endpoint

---

#### 2. Auth Before Authorization
**Standard**: `api/auth-and-role-check`

**Implementation**:
```typescript
// ✅ Correct: Check auth first, then role
const user = await checkAuth()           // 401 if no token
const adminUser = await checkRole('ADMIN')  // 403 if wrong role

// ❌ Wrong: Check role without checking auth first
if (user.role !== 'ADMIN') { ... }  // Could fail if user undefined
```

Applied to all Phase 3 API endpoints.

---

#### 3. Error Responses
**Standard**: `api/auth-and-role-check` (401 vs 403)

**Applied**:
```typescript
// Unauthenticated (401)
return Response.json({ 
  success: false, 
  error: 'Unauthorized' 
}, { status: 401 })

// Authenticated but insufficient permissions (403)
return Response.json({ 
  success: false, 
  error: 'Forbidden - Insufficient permissions' 
}, { status: 403 })
```

---

### Phase 2.1 Standards (Frontend Navigation)

#### 4. Client Component Pattern
**Standard**: `frontend/client-component-pattern`

**Application**: All dashboard feature components use `'use client'`
```tsx
'use client'

import { useAuth } from '@/components/auth'
import { useState, useEffect } from 'react'

export function UserManagementTable() {
  const { user } = useAuth()  // Requires client component
  const [users, setUsers] = useState([])  // useState requires client
  
  // Component code
}
```

---

#### 5. Auth Context Pattern
**Standard**: `frontend/auth-context-pattern`

**Application**: Feature components consume auth via hook
```tsx
const { user, loading } = useAuth()

if (loading) return <LoadingSkeleton />
if (!user) return <AuthRequired />

return <Component />
```

---

#### 6. Conditional Rendering with IfRole
**Standard**: Introduced in Phase 2.1, maintained in Phase 3

**Usage**:
```tsx
// Task 2.1: User Management (admin-only)
<IfRole role={user?.role} allowed={['ADMIN']}>
  <UserManagementTable />
</IfRole>

// Task 1.5: Kanban board (agent + managers can view)
<IfRole role={user?.role} allowed={['AGENT', 'MANAGER', 'ADMIN']}>
  <KanbanBoard />
</IfRole>
```

---

### Component Standards (All Phases)

#### 7. Props Typing
**Standard**: `frontend/component-props-typing`

**Applied Throughout Phase 3**:
```tsx
// Task 1.1: KanbanBoard
interface KanbanBoardProps {
  tickets: Ticket[]
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => Promise<void>
  isLoading?: boolean
  onRefresh?: () => Promise<void>
}

// Task 2.1: UserManagementTable
interface UserManagementTableProps {
  users: User[]
  isLoading: boolean
  onEdit: (user: User) => void
  onDelete: (userId: string) => Promise<void>
}

// All props explicitly typed, no 'any'
```

---

#### 8. Dark Mode Support
**Standard**: Implicit from Phase 2.2

**Applied to All Phase 3 Components**:
```tsx
// Light: white/slate-50 backgrounds, dark text
// Dark: slate-800/slate-900 backgrounds, light text

<div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
  <h2 className="text-slate-900 dark:text-white font-bold">Title</h2>
  <p className="text-slate-600 dark:text-slate-400">Description</p>
</div>
```

All new components include dark mode classes on every color property.

---

#### 9. Tailwind CSS Styling
**Standard**: Implicit from Phase 2+

**Applied Consistently**:
```tsx
// Spacing: p-4, px-6, my-8, mb-4
// Text: text-sm, text-lg, font-bold, font-semibold
// Colors: slate-900, blue-600, red-500 (with dark: variants)
// Layout: flex, grid, grid-cols-3, gap-4
// Interactive: hover:, focus:, active:, disabled:
// Responsive: sm:, md:, lg: prefixes
```

---

### Database Standards (Phase 1, Maintained)

#### 10. Enum-Based Role Access
**Standard**: `database/enums-and-types`

**Application**: All user fetches respect role enum
```prisma
enum Role {
  USER
  AGENT
  MANAGER
  ADMIN
}

// Phase 3 API: Filter users appropriately by role
```

---

#### 11. Audit Trail Fields
**Standard**: Best practice for compliance

**New Audit Table (Phase 3)**:
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  eventType String   // 'user_created', 'ticket_updated', etc.
  userId    String   // Who made the change
  targetId  String?  // What was changed
  details   Json     // What changed (before/after)
  
  createdAt DateTime @default(now())
  
  @@index([eventType])
  @@index([userId])
  @@index([createdAt])
}
```

---

### API Design Standards

#### 12. RESTful Conventions
**Standard**: Best practice REST API design

**Applied in Phase 3**:
```
GET    /api/admin/users              -> List users
POST   /api/admin/users              -> Create user
GET    /api/admin/users/:id          -> Get one user
PATCH  /api/admin/users/:id          -> Update user
DELETE /api/admin/users/:id          -> Delete user

GET    /api/admin/settings           -> Get settings
PATCH  /api/admin/settings           -> Update settings

GET    /api/admin/audit-logs?...     -> List audit logs
GET    /api/tickets/assigned?...     -> List assigned tickets
PATCH  /api/tickets/:id/status       -> Update ticket status
```

---

#### 13. Consistent Response Format
**Standard**: All APIs return success/error structure

**Pattern**:
```typescript
// Success response
{
  success: true,
  data: { ... } | [ ... ],
  message?: string
}

// Error response
{
  success: false,
  error: string,
  details?: object
}

// Paginated response
{
  success: true,
  data: [ ... ],
  total: number,
  page: number,
  pageSize: number
}
```

---

### Form Validation Standards

#### 14. Client & Server Validation
**Standard**: Security + UX best practice

**Client-Side** (using zod):
```typescript
// Task 2.2: User form validation
const UserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
  department: z.string().optional(),
})

// In component
const [errors, setErrors] = useState<Record<string, string>>({})

const handleSubmit = (formData: FormData) => {
  const validation = UserFormSchema.safeParse(formData)
  
  if (!validation.success) {
    setErrors(validation.error.flatten().fieldErrors)
    return
  }
  
  // Submit to API
}
```

**Server-Side** (in API route):
```typescript
const validation = UserFormSchema.safeParse(body)

if (!validation.success) {
  return Response.json({
    success: false,
    errors: validation.error.flatten()
  }, { status: 400 })
}

// Continue with DB operation
```

---

### Type Safety Standards

#### 15. Strict TypeScript Configuration
**Standard**: `tsconfig.json` strict mode

**Applied Throughout**:
```typescript
// ❌ Not allowed
const data: any = response.json()
const user = someFunction()  // Missing return type

// ✅ Required
const data: UserResponse = response.json()
const user: User = someFunction()
interface UserResponse { success: boolean; user: User }
function someFunction(): User { ... }
```

All Phase 3 code:
- Explicit function return types
- Explicit variable types where needed
- No implicit `any`
- Strict null checks enabled

---

### Component Library Standards (Emerging)

#### 16. Reusable Component Patterns
**Standard**: Emerging in Phase 3

**Generic DataTable Component**:
```tsx
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
}

export function DataTable<T>({ data, columns, ...props }: DataTableProps<T>) {
  // Render table generically
}

// Usage:
<DataTable
  data={users}
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
  ]}
  actions={(user) => <ActionButtons user={user} />}
/>
```

**Generic Modal Component**:
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  // Render modal generically
}
```

---

#### 17. Form Field Component Library
**Standard**: Reusable form elements

**Emerging Components**:
- `<TextField>` — Text input with validation display
- `<SelectField>` — Dropdown select
- `<CheckboxField>` — Boolean toggle
- `<TextAreaField>` — Multi-line input
- All include label, error message, loading state

```tsx
<TextField
  label="User Name"
  name="name"
  value={formData.name}
  error={errors.name}
  onChange={handleChange}
  required
/>
```

---

## Standards Compliance Checklist for Phase 3.1

Before starting implementation, confirm:

### Backend API Standards
- [ ] All protected endpoints call `checkRole()` first
- [ ] 401 for unauthenticated, 403 for unauthorized
- [ ] Consistent response format (success/error structure)
- [ ] RESTful naming conventions
- [ ] Error messages are clear and actionable
- [ ] Database transactions for multi-step operations
- [ ] Proper TypeScript types for request/response

### Frontend Standards
- [ ] All components marked `'use client'` if using hooks
- [ ] Auth protection via `useAuth()` early in component
- [ ] Role checking via `IfRole` component
- [ ] No implicit `any` types
- [ ] Dark mode classes on all colors
- [ ] Tailwind utility classes (not custom CSS)
- [ ] Props clearly typed interface
- [ ] Loading states with skeletons
- [ ] Error boundaries around critical sections

### Form Standards
- [ ] Client-side validation (zod schema)
- [ ] Server-side validation (matching schema)
- [ ] Error display in UI
- [ ] Disable submit during processing
- [ ] Success/error toasts
- [ ] Form reset after success

### Accessibility Standards
- [ ] Semantic HTML (`<button>`, `<table>`, `<form>`)
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Color not only way to distinguish (use icons/text too)
- [ ] Sufficient contrast ratios

---

## New Standards to Introduce (if needed)

**Potential Phase 3+ Standards**:
- Real-time updates pattern (WebSockets)
- Drag-and-drop component pattern
- File upload pattern
- Advanced filtering pattern
- Export/import data pattern

*For now: Not needed, will be introduced when feature is added*

---

## Summary

| Standard Category | Phase Origin | Phase 3 Application |
|------------------|--------------|-------------------|
| RBAC | Phase 1 | All API endpoints |
| RBAC | Phase 1 | Component conditional rendering |
| Client Components | Phase 2.1 | All feature components |
| Auth Pattern | Phase 2.1 | useAuth() in all pages |
| Type Safety | All | No implicit any |
| Dark Mode | Phase 2.2 | All new components |
| Tailwind CSS | Phase 2.2 | All styling |
| Form Validation | Phase 3 | New standard: client + server |
| API Design | Phase 3 | New standard: REST conventions |
| Component Library | Phase 3 | New standard: reusable components |

**Compliance Level**: All Phase 3 code will maintain 100% compliance with established standards and introduce new standards carefully where needed.
