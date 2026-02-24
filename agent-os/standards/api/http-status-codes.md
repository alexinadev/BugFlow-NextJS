# HTTP Status Codes

Use consistent status codes for different response scenarios.

## Standard Codes

- **200 OK** — Request succeeded, data returned
- **400 Bad Request** — Missing/invalid required fields
- **401 Unauthorized** — No valid authentication token
- **403 Forbidden** — Authenticated but insufficient permissions for action
- **404 Not Found** — Resource doesn't exist (e.g., ticket not found)
- **500 Internal Server Error** — Unhandled exception (logged server-side)

## Rules

- Use correct status code for every response path
- Combine with `{ success: false, error: "..." }` body
- All errors logged with `console.error()` server-side
- Status code + error message must match (e.g., 404 + "not found")

## Examples

```typescript
// 401 — No auth
return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

// 403 — No permission
return NextResponse.json({ success: false, error: 'Only admins can update' }, { status: 403 })

// 404 — Not found
return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 })
```
