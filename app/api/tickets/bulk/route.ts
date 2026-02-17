import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only ADMIN can do bulk operations
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can perform bulk operations' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { ticketIds, status, assignedTo } = body

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No tickets specified' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo
    }

    // Update all specified tickets
    const result = await prisma.ticket.updateMany({
      where: {
        id: { in: ticketIds },
      },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      updated: result.count,
    })
  } catch (error) {
    console.error('Bulk update error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}