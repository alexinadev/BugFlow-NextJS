# Request Body Validation

Validate required fields after parsing request.json(), before business logic.

## Pattern

```typescript
export async function POST(request: Request) {
  try {
    // ... auth check ...

    // Parse request body
    const body = await request.json()
    const { title, description, severity, userEmail } = body

    // Validate required fields
    if (!title || !description || !severity || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Business logic
    const ticket = await prisma.ticket.create({ ... })
    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    // error handling
  }
}
```

## Rules

- Validate after `request.json()` parse succeeds
- Check all required fields with truthy check (`!field`)
- Return 400 Bad Request for validation failure
- Validation error message: "Missing required fields"
- Optional fields can be omitted

## Note

No schema validation library (zod, etc.) currently used. Manual validation is sufficient for this project.
