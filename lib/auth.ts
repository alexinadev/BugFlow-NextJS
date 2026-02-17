import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './db'
import type { AuthUser, Role } from '@/types'

const secretKey = process.env.JWT_SECRET!
const key = new TextEncoder().encode(secretKey)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function signToken(payload: { userId: string; phone: string; role: Role }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function verifyToken(token: string): Promise<{ userId: string; phone: string; role: Role } | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload as { userId: string; phone: string; role: Role }
  } catch {
    return null
  }
}

export async function getSession(): Promise<{ user: AuthUser } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) return null
  
  const payload = await verifyToken(token)
  if (!payload) return null
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, phone: true, role: true, avatar: true },
  })
  
  if (!user) return null
  
  return { user: { ...user, avatar: user.avatar ?? undefined } }
}

export async function login(phone: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { phone },
  })
  
  if (!user) {
    return { success: false, error: 'Invalid phone number or password' }
  }
  
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return { success: false, error: 'Invalid phone number or password' }
  }
  
  const token = await signToken({
    userId: user.id,
    phone: user.phone,
    role: user.role as Role,
  })
  
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  
  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as Role,
      avatar: user.avatar ?? undefined,
    },
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession()
  return session?.user ?? null
}