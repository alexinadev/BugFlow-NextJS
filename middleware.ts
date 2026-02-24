import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Role-based route access
// Roles hierarchy: USER < AGENT < MANAGER < ADMIN
const routePermissions: Record<string, string[]> = {
  '/submit': ['USER', 'AGENT', 'MANAGER'],
  '/portal': ['USER', 'AGENT', 'MANAGER', 'ADMIN'],
  '/status': ['USER', 'AGENT', 'MANAGER', 'ADMIN'],
  '/admin/agent': ['AGENT', 'MANAGER', 'ADMIN'],
  '/admin/tickets': ['MANAGER', 'ADMIN'],
  '/admin/analytics': ['MANAGER', 'ADMIN'],
  '/admin/config': ['MANAGER', 'ADMIN'],
  '/admin/system': ['ADMIN'],
  '/admin': ['MANAGER', 'ADMIN'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookie
  const token = request.cookies.get('token')?.value
  
  // If no token and trying to access protected route, redirect to home
  if (!token) {
    // Allow access to home page without authentication
    if (pathname === '/') {
      return NextResponse.next()
    }
    
    // For protected routes without auth, redirect to home (which shows login)
    const protectedRoutes = Object.keys(routePermissions)
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return NextResponse.next()
  }

  // Simple JWT payload decode (without verification - that's done server-side)
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'))
    const userRole = payload.role as string

    // Check route permissions
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to default page based on role
          return NextResponse.redirect(new URL('/portal', request.url))
        }
      }
    }

    return NextResponse.next()
  } catch {
    // Invalid token - redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    '/submit/:path*',
    '/portal/:path*',
    '/status/:path*',
    '/admin/:path*',
  ],
}