# Try-Catch Error Handling

Wrap all API route logic in try-catch to handle unexpected errors gracefully.

## Pattern

```typescript
export async function POST(request: Request) {
  try {
    // All route logic here
    const body = await request.json()
    const ticket = await prisma.ticket.create({ ... })
    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    // Log full error for debugging
    console.error('Create ticket error:', error)
    
    // Return generic error to client (never expose stack trace)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Rules

- Wrap entire route handler in try-catch
- Log full error with descriptive prefix: `console.error('[Action] error:', error)`
- Never expose error details to client (stack trace, database errors, etc.)
- Always return `{ success: false, error: 'Internal server error' }` for uncaught errors
- Use status 500 for unexpected errors

## Benefits

- **Stability:** Uncaught errors don't crash server
- **Debugging:** Console logs help troubleshoot issues
- **Security:** Stack traces and details stay server-side
