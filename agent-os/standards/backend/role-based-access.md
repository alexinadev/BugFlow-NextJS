# Role-Based Access Control (RBAC)

Role-based access is enforced at the middleware layer to intercept unauthorized requests before they reach API routes.

## How It Works

- Routes are mapped to required roles in middleware
- Token is decoded (without full verification) to extract user role
- If role not in allowed list, redirect to `/portal` (default user view)
- If no token, redirect to `/` (home)

## Route Permissions

```typescript
const routePermissions = {
  '/submit': ['USER'],
  '/admin': ['ADMIN'],
  '/status': ['USER', 'ADMIN'],
  '/portal': ['USER', 'ADMIN'],
}
```

## Adding New Routes

1. Add entry to `routePermissions` in `middleware.ts`
2. Include in matcher config
3. No role = redirect to `/portal`; invalid role = same redirect
