import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}