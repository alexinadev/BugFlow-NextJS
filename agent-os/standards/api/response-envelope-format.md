# Response Envelope Format

Structure all API responses consistently with `{ success, data }` envelope.

## Success Response

```json
{
  "success": true,
  "ticket": { "id": "TCK-2026-ABC123", "title": "...", "status": "pending_verification" }
}
```

## Error Response

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## Rules

- All responses include `success: boolean` as top-level key
- On success: include data field (varies by endpoint: `ticket`, `notifications`, `updated`, etc.)
- On error: only include `success` and `error` fields
- Error messages are client-safe (no stack traces, safe to display)
- Data field name reflects resource type (singular: `ticket`, `notification`, or count: `updated`)

## Exceptions

- Health check (`/api/health`) returns `{ status, timestamp }` (no success field)

## Benefits

- **Predictable:** Frontend always checks `success` first
- **Consistent:** Same pattern across all endpoints
- **Type-Safe:** Clear structure for TypeScript
