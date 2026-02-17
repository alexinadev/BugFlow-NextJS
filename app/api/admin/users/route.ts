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

    // Only ADMIN can list all admins
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can view admin list' },
        { status: 403 }
      )
    }

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    })

    return NextResponse.json({ success: true, admins })
  } catch (error) {
    console.error('Get admins error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}