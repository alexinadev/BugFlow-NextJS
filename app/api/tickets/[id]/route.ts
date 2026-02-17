import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error('Get ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    // Only ADMIN can update tickets
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can update tickets' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const { status, assignedTo } = body

    const updateData: Record<string, unknown> = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error('Update ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}