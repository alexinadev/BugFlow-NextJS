# Dynamic Route Parameters

Extract route parameters using the Promise pattern in Next.js 15+.

## Pattern

```typescript
interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  // Await params Promise to extract values
  const { id } = await params

  // Use id in route logic
  const ticket = await prisma.ticket.findUnique({ where: { id } })
  
  if (!ticket) {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, ticket })
}
```

## Rules

- Define `Params` interface matching route structure
- Always `await params` before destructuring
- Route segments become interface properties (`[id]` → `id`, `[type]/[id]` → `type`, `id`)
- This is required by Next.js 15+ for type safety

## Structure Examples

```typescript
// Route: /api/tickets/[id]/history
interface Params {
  params: Promise<{ id: string }>
}

// Route: /api/items/[category]/[id]
interface Params {
  params: Promise<{ category: string; id: string }>
}
```
