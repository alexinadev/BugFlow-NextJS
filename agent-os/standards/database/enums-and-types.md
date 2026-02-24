# Enums and Types

Use Prisma enums for domain types like Role, Status, Severity, and Priority.

## Defined Enums

- **Role:** `USER`, `ADMIN`
- **TicketStatus:** `pending_verification`, `open`, `in_progress`, `resolved`, `closed`, `incoming`, `acknowledged`, `review`, `triaged`, `investigating`, `pending`
- **Severity:** `blocking`, `major`, `minor`, `suggestion`
- **Priority:** `urgent`, `high`, `medium`, `low`
- **NotificationType:** `status_change`, `assignment`, `resolution`, `update`

## Why Enums?

- **Type Safety:** Catch invalid values at compile time, not runtime
- **Database Constraints:** PostgreSQL enum prevents invalid data
- **Readability:** Self-documents valid values vs magic strings

## Adding New Enum Values

1. Update the enum definition in `schema.prisma`
2. Run `prisma migrate dev --name add_[enum_value]`
3. Existing data unchanged (backward compatible)

## Pattern

Always use enums for finite value sets. Never use generic `String` for status-like fields.
