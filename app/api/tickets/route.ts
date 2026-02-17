import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Generate a unique ticket ID
function generateTicketId(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TCK-${year}-${random}`
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only USER role can submit tickets
    if (user.role !== 'USER') {
      return NextResponse.json(
        { success: false, error: 'Only users can submit tickets' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      stepsToReproduce,
      severity,
      userFullName,
      userEmail,
      environmentDetails,
    } = body

    // Validate required fields
    if (!title || !description || !stepsToReproduce || !severity || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ticketId = generateTicketId()

    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId,
        title,
        description,
        stepsToReproduce,
        severity,
        userEmail,
        userFullName: userFullName || user.name,
        status: 'pending_verification',
        environmentDetails,
        attachments: [],
        labels: [],
        assignedTo: [],
        submitterId: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    })
  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get('id')

    if (ticketId) {
      // Get single ticket
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      })

      if (!ticket) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, ticket })
    }

    // Get all tickets for the user
    const tickets = await prisma.ticket.findMany({
      where: user.role === 'USER' 
        ? { submitterId: user.id }
        : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, tickets })
  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}