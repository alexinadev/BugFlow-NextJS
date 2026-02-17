'use client'

import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { KanbanColumn } from './KanbanColumn'
import type { Ticket, TicketStatus } from '@/types'

interface KanbanBoardProps {
  tickets: Ticket[]
  selectedTickets: string[]
  onSelectTicket: (id: string) => void
  onTicketClick: (id: string) => void
  onDragEnd: (ticketId: string, newStatus: TicketStatus) => void
}

const columns: { id: TicketStatus; title: string; color: string }[] = [
  { id: 'pending_verification', title: 'Pending Review', color: 'bg-slate-500 text-white' },
  { id: 'open', title: 'Open', color: 'bg-blue-500 text-white' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-500 text-white' },
  { id: 'resolved', title: 'Resolved', color: 'bg-emerald-500 text-white' },
  { id: 'closed', title: 'Closed', color: 'bg-purple-500 text-white' },
]

export function KanbanBoard({
  tickets,
  selectedTickets,
  onSelectTicket,
  onTicketClick,
  onDragEnd,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const ticketId = active.id as string
      const newStatus = over.id as TicketStatus
      onDragEnd(ticketId, newStatus)
    }
  }

  const activeTicket = activeId ? tickets.find(t => t.id === activeId) : null

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tickets={tickets.filter((t) => t.status === column.id)}
            selectedTickets={selectedTickets}
            onSelectTicket={onSelectTicket}
            onTicketClick={onTicketClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTicket && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 opacity-90">
            <h4 className="font-medium text-slate-900 dark:text-white text-sm">
              {activeTicket.title}
            </h4>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}