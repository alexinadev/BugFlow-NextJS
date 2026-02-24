# Authentication and Role Check

All protected API routes verify user authentication first, then check roles for authorization.

## Pattern

```typescript
export async function POST(request: Request) {
  try {
    // Step 1: Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }  // No auth
      )
    }

    // Step 2: Check authorization (role-based)
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can update' },
        { status: 403 }  // Insufficient permissions
      )
    }

    // Route logic here...
  } catch (error) {
    // error handling
  }
}
```

## Rules

- Always check auth first with `getCurrentUser()`
- 401 = Not authenticated (no token/invalid token)
- 403 = Authenticated but insufficient role for endpoint
- Routes with no role restriction: skip role check, proceed after auth check
- Endpoints only ADMIN can access: `/admin/*`, `/bulk/*`
- Endpoints USER and ADMIN can access: `/tickets/*`, `/notifications/*`
