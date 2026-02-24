# Phase 3: Dashboard Features — Code Examples & References

**Purpose**: Provide reusable patterns and code snippets for Phase 3 implementation

---

## API Endpoint Patterns

### Pattern 1: Protected Data Fetch with Role Check

**Example: GET /api/tickets/assigned (Task 1.3)**

```typescript
// app/api/tickets/assigned/route.ts
import { checkRole } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    // Step 1: Verify authenticated and authorized
    const user = await checkRole('AGENT', 'MANAGER', 'ADMIN')
    
    // Step 2: Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    
    // Step 3: Build query based on role
    let whereClause: any = {}
    
    if (user.role === 'AGENT') {
      // AGENT sees only their assigned tickets
      whereClause = {
        assignedTo: { hasSome: [user.id] }
      }
    } else if (user.role === 'MANAGER') {
      // MANAGER sees all tickets in their department
      whereClause = {
        department: user.department
      }
    }
    // ADMIN sees all tickets (empty whereClause)
    
    // Step 4: Execute query
    const tickets = await db.ticket.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
    
    const total = await db.ticket.count({ where: whereClause })
    
    // Step 5: Return success response
    return Response.json({
      success: true,
      tickets,
      total,
      page,
      pageSize: limit
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    
    if (error instanceof Response) {
      return error  // checkRole throws Response on auth failure
    }
    
    return Response.json({
      success: false,
      error: 'Failed to fetch tickets'
    }, { status: 500 })
  }
}
```

---

### Pattern 2: Protected Mutation with Validation

**Example: PATCH /api/tickets/:id/status (Task 1.4)**

```typescript
// app/api/tickets/[id]/status/route.ts
import { checkRole } from '@/lib/rbac'
import { db } from '@/lib/db'
import { z } from 'zod'

const StatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'pending_info', 'resolved'])
})

const VALID_TRANSITIONS = {
  'open': ['in_progress', 'resolved'],
  'in_progress': ['pending_info', 'resolved'],
  'pending_info': ['in_progress', 'resolved'],
  'resolved': [] // Terminal state
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Step 1: Verify auth
    const user = await checkRole('AGENT', 'MANAGER', 'ADMIN')
    
    // Step 2: Parse and validate body
    const body = await request.json()
    const validation = StatusSchema.safeParse(body)
    
    if (!validation.success) {
      return Response.json({
        success: false,
        error: 'Invalid status value',
        errors: validation.error.flatten()
      }, { status: 400 })
    }
    
    const { status: newStatus } = validation.data
    
    // Step 3: Fetch ticket
    const ticket = await db.ticket.findUnique({
      where: { id: params.id }
    })
    
    if (!ticket) {
      return Response.json({
        success: false,
        error: 'Ticket not found'
      }, { status: 404 })
    }
    
    // Step 4: Verify user can update (assigned or admin)
    const canUpdate = 
      user.role === 'ADMIN' || 
      ticket.assignedTo.includes(user.id)
    
    if (!canUpdate) {
      return Response.json({
        success: false,
        error: 'You do not have permission to update this ticket'
      }, { status: 403 })
    }
    
    // Step 5: Validate status transition
    const validTransitions = VALID_TRANSITIONS[ticket.status as keyof typeof VALID_TRANSITIONS]
    
    if (!validTransitions.includes(newStatus)) {
      return Response.json({
        success: false,
        error: `Cannot transition from ${ticket.status} to ${newStatus}`
      }, { status: 400 })
    }
    
    // Step 6: Update ticket in transaction
    const updatedTicket = await db.$transaction(async (tx) => {
      // Update ticket
      const updated = await tx.ticket.update({
        where: { id: params.id },
        data: { status: newStatus, updatedAt: new Date() }
      })
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          eventType: 'ticket_status_changed',
          userId: user.id,
          targetId: params.id,
          details: {
            from: ticket.status,
            to: newStatus
          }
        }
      })
      
      return updated
    })
    
    // Step 7: Return updated ticket
    return Response.json({
      success: true,
      ticket: updatedTicket,
      message: `Ticket status updated to ${newStatus}`
    })
  } catch (error) {
    console.error('Error updating ticket:', error)
    
    if (error instanceof Response) {
      return error
    }
    
    return Response.json({
      success: false,
      error: 'Failed to update ticket status'
    }, { status: 500 })
  }
}
```

---

### Pattern 3: Admin-Only User Management API

**Example: POST /api/admin/users (Task 2.3)**

```typescript
// app/api/admin/users/route.ts
import { checkRole } from '@/lib/rbac'
import { db } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
  department: z.string().optional()
})

export async function GET(request: Request) {
  try {
    const user = await checkRole('ADMIN')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const roleFilter = searchParams.get('role')
    
    const where: any = {}
    if (roleFilter) {
      where.role = roleFilter
    }
    
    const users = await db.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true,
        isEnabled: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const total = await db.user.count({ where })
    
    return Response.json({
      success: true,
      users,
      total,
      page,
      pageSize: limit
    })
  } catch (error) {
    if (error instanceof Response) return error
    
    return Response.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await checkRole('ADMIN')
    
    const body = await request.json()
    const validation = CreateUserSchema.safeParse(body)
    
    if (!validation.success) {
      return Response.json({
        success: false,
        errors: validation.error.flatten()
      }, { status: 400 })
    }
    
    const { name, email, role, department } = validation.data
    
    // Check email uniqueness
    const existingUser = await db.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return Response.json({
        success: false,
        error: 'Email already in use'
      }, { status: 409 })
    }
    
    // Create user with temporary password
    const tempPassword = Math.random().toString(36).substring(2, 15)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)
    
    const newUser = await db.user.create({
      data: {
        name,
        email,
        role,
        department,
        password: hashedPassword,
        isEnabled: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true
      }
    })
    
    // TODO: Send welcome email with temp password
    
    // Create audit log
    await db.auditLog.create({
      data: {
        eventType: 'user_created',
        userId: user.id,
        targetId: newUser.id,
        details: { ...newUser }
      }
    })
    
    return Response.json({
      success: true,
      user: newUser,
      message: 'User created. Welcome email sent.'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    
    return Response.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 })
  }
}
```

---

## Component Patterns

### Pattern 4: Async Data Fetching Hook

```typescript
// lib/useAsync.ts
import { useEffect, useState } from 'react'

interface UseAsyncState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    loading: immediate
  })

  const execute = async () => {
    setState({ data: null, error: null, loading: true })
    
    try {
      const response = await asyncFunction()
      setState({ data: response, error: null, loading: false })
      return response
    } catch (error) {
      setState({ data: null, error: error as Error, loading: false })
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate])

  return { ...state, execute }
}

// Usage:
const { data: tickets, loading, error, execute: refresh } = useAsync(
  () => fetch('/api/tickets/assigned').then(r => r.json()),
  true
)
```

---

### Pattern 5: Data Table Component

```typescript
// components/admin/DataTable.tsx
'use client'

import { useState } from 'react'

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  keyExtractor?: (row: T, index: number) => string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  actions,
  keyExtractor = (_, i) => i.toString()
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-slate-500">No data found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {columns.map((col) => (
              <th 
                key={String(col.accessor)}
                className="text-left p-3 font-semibold text-slate-900 dark:text-white text-sm"
                onClick={() => {
                  if (col.sortable) {
                    setSortBy(col.accessor as keyof T)
                    setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                  }
                }}
              >
                {col.header}
                {col.sortable && ' ▼'}
              </th>
            ))}
            {actions && <th className="text-left p-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={keyExtractor(row, idx)}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => {
                const value = typeof col.accessor === 'function' 
                  ? col.accessor(row)
                  : row[col.accessor]
                
                return (
                  <td key={String(col.accessor)} className="p-3 text-slate-700 dark:text-slate-300 text-sm">
                    {value}
                  </td>
                )
              })}
              {actions && (
                <td className="p-3">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Usage in UserManagementTable**:
```tsx
<DataTable<User>
  data={users}
  columns={[
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Created', accessor: (u) => new Date(u.createdAt).toLocaleDateString() },
  ]}
  actions={(user) => (
    <button onClick={() => handleEdit(user)}>Edit</button>
  )}
  keyExtractor={(user) => user.id}
/>
```

---

### Pattern 6: Form with Validation

```typescript
// components/admin/UserForm.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'
import type { User } from '@/types'

const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(['USER', 'AGENT', 'MANAGER', 'ADMIN']),
  department: z.string().optional()
})

type UserFormData = z.infer<typeof UserSchema>

interface UserFormProps {
  initialData?: User
  onSubmit: (data: UserFormData) => Promise<void>
  isLoading?: boolean
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(
    initialData ? {
      name: initialData.name,
      email: initialData.email,
      role: initialData.role,
      department: initialData.department
    } : {
      name: '',
      email: '',
      role: 'USER',
      department: ''
    }
  )
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const validation = UserSchema.safeParse(formData)
    
    if (!validation.success) {
      setErrors(
        validation.error.flatten().fieldErrors as Record<string, string>
      )
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(validation.data)
    } catch (error) {
      setErrors({ submit: (error as Error).message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.role ? 'border-red-500' : 'border-slate-300'}`}
        >
          <option value="USER">User</option>
          <option value="AGENT">Agent</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Department (Optional)</label>
        <input
          type="text"
          name="department"
          value={formData.department || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      {errors.submit && <p className="text-red-500">{errors.submit}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => setFormData({
            name: '',
            email: '',
            role: 'USER',
            department: ''
          })}
          className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
```

---

### Pattern 7: Toast Notifications

```typescript
// lib/toast.ts (with react-hot-toast)
import { toast as hotToast } from 'react-hot-toast'

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  loading: (message: string) => hotToast.loading(message),
  promise: <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => hotToast.promise(promise, msgs)
}

// Usage:
const handleDelete = async (userId: string) => {
  try {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    
    if (!res.ok) {
      toast.error('Failed to delete user')
      return
    }
    
    toast.success('User deleted successfully')
    // Refresh
  } catch (error) {
    toast.error('Network error')
  }
}
```

---

## Existing Components to Leverage

### Already Available in BugFlow

1. **`KanbanBoard` + `KanbanColumn` + `KanbanTicket`**
   - Location: `components/admin/`
   - Purpose: Phase 1.1 Kanban visualization (might exist partially)
   - Enhance in Phase 3.1

2. **`AdminDashboard`**
   - Location: `components/admin/AdminDashboard.tsx`
   - Purpose: Ticket management (already reusable)
   - Used: Phase 2.2 /admin page, can extend in Phase 3

3. **`UserPortalDashboard`**
   - Location: `components/portal/UserPortalDashboard.tsx`
   - Purpose: User ticket view (already complete)
   - Used: /portal page

4. **`TicketDetailModal`**
   - Location: `components/admin/TicketDetailModal.tsx`
   - Purpose: Show full ticket details in modal
   - Reuse: Can popup from Kanban or table

---

## Summary of Key Patterns

| Pattern | File | Purpose |
|---------|------|---------|
| Protected Endpoints | API route | checkRole + query + response |
| Data Fetching | useAsync hook | Async state management |
| Tables | DataTable component | Generic table display |
| Forms | UserForm component | Client + server validation |
| Notifications | toast util | User feedback |
| Components | Existing library | Reusable UI pieces |

All patterns follow established standards and are ready for Phase 3.1 implementation.
