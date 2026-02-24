# Phone-Based Authentication

This app uses phone number as the unique identifier for authentication, not email.

## Design Decision

Phone number as primary auth identifier aligns with user base preference and accessibility.

## Requirements

- **Unique:** Phone is UNIQUE constraint on users table
- **Login:** Use phone + password combination
- **Lookup:** All user queries use phone as identifier

## Implementation

```typescript
const user = await prisma.user.findUnique({ where: { phone } })
```

## Considerations

- No built-in validation for phone format (add if needed)
- No country code enforcement
- Phone displayed in auth context and UI
