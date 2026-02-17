import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.notification.updateMany({
      where: { 
        userId: user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}