# Foreign Key Relations

Define clear relationships between models with cascade deletion for data integrity.

## Pattern: Cascade on Delete

When a parent record is deleted, child records are automatically deleted:

```prisma
model Comment {
  id       String   @id @default(cuid())
  ticketId String
  ticket   Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}
```

## Rules

- Use `onDelete: Cascade` for child records (comments on ticket, notifications on ticket, etc.)
- Use `onDelete: Cascade` for one-to-one relations (NotificationSettings on User)
- Document any relations that don't cascade (currently: none)
- Foreign key field always precedes relation field in schema

## Benefits

- **Simplicity:** No orphaned records
- **App Logic:** No need to manually delete children in code
- **Consistency:** Child data integrity is guaranteed at database level
