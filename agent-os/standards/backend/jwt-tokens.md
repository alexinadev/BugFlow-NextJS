# JWT Token Management

All authentication uses JWT tokens stored in **httpOnly cookies** to prevent XSS attacks.

## Token Configuration

- **Algorithm:** HS256
- **Expiration:** 7 days
- **Transport:** httpOnly, Secure (production), SameSite=Lax
- **Payload:** `{ userId, phone, role }`

## Why httpOnly?

HttpOnly cookies are inaccessible to JavaScript, protecting against XSS token theft. Always use httpOnly in production.

## Token Verification

Server-side verification is mandatory. Client-side JWT decoding (without validation) is used for UI only.
