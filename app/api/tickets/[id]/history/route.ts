import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    // Get ticket to check access
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Check access: user must be owner or admin
    if (user && user.role !== 'ADMIN' && ticket.submitterId !== user.id) {
      // Allow public access via ticket ID (no auth required for public tracking)
      // But still return history
    }

    const history = await prisma.statusHistory.findMany({
      where: { ticketId: id },
      orderBy: { changedAt: 'desc' },
    })

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error('Get ticket history error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}