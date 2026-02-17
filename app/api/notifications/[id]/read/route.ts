import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const notification = await prisma.notification.update({
      where: { 
        id,
        userId: user.id,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}