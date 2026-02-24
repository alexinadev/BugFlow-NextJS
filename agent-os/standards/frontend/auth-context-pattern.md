# Client-Side Auth Context

Use React Context API for managing auth state on the client. AuthProvider wraps the entire app.

## Context Interface

```typescript
interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login(phone: string, password: string): Promise<{ success: boolean; error?: string }>
  logout(): Promise<void>
  refreshUser(): Promise<void>
}
```

## Usage

- Call `useAuth()` hook to access context
- `loading` is true until initial user fetch completes
- `login()` returns success/error; on success, updates user state immediately
- `logout()` clears user state and redirects to home
- `refreshUser()` is called on mount; use manually after auth changes

## Pattern

Wrap app root with `<AuthProvider>` in layout. Context handles initial session check on load.
