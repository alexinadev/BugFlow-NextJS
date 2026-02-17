import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()
    
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' },
        { status: 400 }
      )
    }
    
    const result = await login(phone, password)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}