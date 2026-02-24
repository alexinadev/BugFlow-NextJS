# Password Hashing

Use bcryptjs for all password hashing. Never store or log plaintext passwords.

## Hashing Configuration

- **Library:** bcryptjs
- **Salt Rounds:** 10
- **Rationale:** Balance between security and performance (~200ms hash on standard hardware)

## Rules

- Hash passwords immediately before storage
- Always compare with bcrypt.compare(), never string equality
- Never log or expose passwords in error messages
- Use same generic error message for wrong password/non-existent user (prevent user enumeration)
