# Authentication Response Format

All auth API responses use a consistent envelope structure.

## Success Response

```json
{ "success": true, "user": { "id": "", "name": "", "phone": "", "role": "" } }
```

## Error Response

```json
{ "success": false, "error": "Description of error" }
```

## Rules

- Always include `success` boolean as first check for frontend
- Include `user` object only on login success
- Never return both `success: false` and `user` data
- Error messages are safe for client display
- HTTP status codes: 200 (success), 401 (auth failed), 400 (bad request), 500 (server error)
